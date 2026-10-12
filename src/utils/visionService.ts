import type { WasteCategory } from '../types/avasar';

export interface VisionAnalysisResult {
  category: WasteCategory;
  itemNameEn: string;
  itemNameHi: string;
  confidence: number;
  estimatedWeightKg: number;
  hazardLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  notes: string;
  isAiGenerated: boolean;
  modelUsed?: string;
}

const STORAGE_KEY = 'avasar_gemini_api_key';

export const getGeminiApiKey = (): string => {
  if (typeof window === 'undefined') return '';
  const fromEnv = (import.meta as unknown as { env?: { VITE_GEMINI_API_KEY?: string } })?.env?.VITE_GEMINI_API_KEY;
  if (fromEnv && fromEnv.trim().length > 0) return fromEnv.trim();
  return localStorage.getItem(STORAGE_KEY)?.trim() || '';
};

export const setGeminiApiKey = (key: string): void => {
  if (typeof window === 'undefined') return;
  if (!key.trim()) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, key.trim());
  }
};

/**
 * Extracts raw base64 data and mime type from a Data URL
 */
const parseDataUrl = (dataUrl: string): { mimeType: string; data: string } => {
  const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (matches && matches.length === 3) {
    return { mimeType: matches[1], data: matches[2] };
  }
  // Default fallback
  return { mimeType: 'image/jpeg', data: dataUrl.replace(/^data:[^;]+;base64,/, '') };
};

/**
 * Validates and normalizes category
 */
const normalizeCategory = (cat: string): WasteCategory => {
  const upper = (cat || '').toUpperCase().trim();
  if (upper.includes('PCB') || upper.includes('CIRCUIT') || upper.includes('MOTHERBOARD')) return 'PCB';
  if (upper.includes('BATTER')) return 'BATTERIES';
  if (upper.includes('CABLE') || upper.includes('WIRE') || upper.includes('COPPER')) return 'CABLES';
  if (upper.includes('CRT') || upper.includes('TUBE') || upper.includes('TELEVISION')) return 'CRT';
  if (upper.includes('PHONE') || upper.includes('MOBILE') || upper.includes('SMARTPHONE')) return 'PHONES';
  if (upper.includes('LAPTOP') || upper.includes('NOTEBOOK') || upper.includes('TABLET')) return 'LAPTOPS';
  return 'OTHER';
};

/**
 * Analyzes waste image using Google Gemini Vision API (gemini-1.5-flash / gemini-2.0-flash)
 */
export async function analyzeImageWithGemini(
  imageDataUrl: string,
  customApiKey?: string
): Promise<VisionAnalysisResult> {
  const apiKey = (customApiKey || getGeminiApiKey()).trim();

  if (!apiKey) {
    throw new Error('MISSING_API_KEY');
  }

  const { mimeType, data: base64Data } = parseDataUrl(imageDataUrl);

  const prompt = `
You are an expert AI vision system for electronic waste (E-waste) and scrap identification in India.
Look at this image carefully and identify the electronic waste / scrap object.

Classify it into EXACTLY ONE of the following valid categories:
- "PCB" (Printed Circuit Boards, computer motherboards, RAM, green circuit plates, electronic cards)
- "BATTERIES" (Lithium-ion cells, mobile phone batteries, UPS lead-acid, power banks)
- "CABLES" (Copper cables, power wires, ethernet cords, electrical wiring)
- "CRT" (CRT television, cathode ray tube, bulky glass monitor)
- "PHONES" (Smartphones, mobile phones, keypad feature phones, dismantled phones)
- "LAPTOPS" (Laptops, notebook computers, tablets)
- "OTHER" (Printers, chargers, routers, keyboards, small domestic electronic scrap, mixed scrap)

Respond with ONLY a raw JSON object (no markdown quotes, no backticks, no extra text) with the following structure:
{
  "category": "PCB",
  "itemNameEn": "Computer Motherboard with Heatsink",
  "itemNameHi": "कंप्यूटर मदरबोर्ड (PCB)",
  "confidence": 94,
  "estimatedWeightKg": 1.5,
  "hazardLevel": "LOW",
  "notes": "Clear printed circuit board with visible soldered microchips and gold-plated connectors."
}
`;

  // We try gemini-1.5-flash first, and fallback to gemini-2.0-flash if needed
  const models = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-2.5-flash'];
  let lastError: Error | null = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const payload = {
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64Data
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 600
        }
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = (errorData as { error?: { message?: string } })?.error?.message || `HTTP ${response.status}`;
        throw new Error(`API Error (${model}): ${message}`);
      }

      const resJson = await response.json();
      const rawText = resJson?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        throw new Error('Empty response from Gemini Vision API.');
      }

      // Clean markdown code blocks if returned
      const cleanJson = rawText
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();

      const parsed = JSON.parse(cleanJson);
      const normalizedCat = normalizeCategory(parsed.category);

      return {
        category: normalizedCat,
        itemNameEn: parsed.itemNameEn || 'Scrap Material',
        itemNameHi: parsed.itemNameHi || 'स्क्रैप सामग्री',
        confidence: Math.min(99, Math.max(60, Number(parsed.confidence) || 90)),
        estimatedWeightKg: Math.max(0.1, Number(parsed.estimatedWeightKg) || 1.0),
        hazardLevel: ['LOW', 'MEDIUM', 'HIGH'].includes(parsed.hazardLevel) ? parsed.hazardLevel : 'LOW',
        notes: parsed.notes || 'Identified via Gemini Optical Recognition.',
        isAiGenerated: true,
        modelUsed: model
      };
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));
      // If error is invalid API key or permission denied, don't keep trying all models
      if (lastError.message.includes('API_KEY_INVALID') || lastError.message.includes('not valid')) {
        break;
      }
    }
  }

  throw lastError || new Error('Failed to analyze image with Vision API.');
}
