import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  BookOpen, 
  Lightbulb
} from 'lucide-react';
import type { Language, ChatMessage } from '../types';
import { translations } from '../utils/i18n';

interface CircularityAdvisorProps {
  currentLang: Language;
}

export const CircularityAdvisor: React.FC<CircularityAdvisorProps> = ({
  currentLang,
}) => {
  const t = translations[currentLang];
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      timestamp: '10:04 AM',
      content: `Hello. I am the **AVASAR Circularity & Compliance Advisor**. I am calibrated on Indian environmental jurisprudence, including the **E-Waste (Management) Rules 2022**, the **Plastic Waste Management (PWM) Rules 2024 amendments**, CPCB EPR credit portals, and live scrap indices across major industrial MIDC clusters.

How can I assist your waste segregation, hazard containment, or EPR documentation today?`,
      citations: [
        'CPCB EPR Guidelines Schedule II (PWM Rules)',
        'Ministry of Environment, Forest & Climate Change (MoEFCC) Notification G.S.R. 801(E)',
        'Indian Chemical Safety Protocol IS 14489'
      ]
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const samplePrompts = [
    'Safe disposal protocol for swollen Li-ion pouch cells',
    'Current market rate index for PET hot-washed flakes',
    'How to classify and segregate multilayer metallized plastic (MLP)?',
    'Producer EPR certificate generation timeline for FY 2026-27'
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: query
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsTyping(true);

    // Simulate intelligent response grounded in Indian statutes
    setTimeout(() => {
      let replyContent = '';
      let replyCitations: string[] = [];

      const lower = query.toLowerCase();

      if (lower.includes('li-ion') || lower.includes('battery') || lower.includes('swollen')) {
        replyContent = `### Protocol for Swollen Li-ion Cells (UN 3480 Class 9)

**1. Immediate Isolation:**
- Swelling indicates internal gas generation (\(CO_2, C_2H_4\)) and dielectric degradation. Do **not** pierce, apply mechanical pressure, or expose to moisture.
- Transfer immediately to a non-conductive, fire-retardant container filled with dry **expanded vermiculite** or heavy mineral sand.

**2. Mandatory Statutory Compliance (Battery Waste Management Rules 2022):**
- Prohibited from municipal landfill dumping or unregulated open shredding.
- Must only be handed to **CPCB Registered Recyclers** equipped with vacuum hydrometallurgy facilities to prevent thermal runaway.
- Material value: Residual Black Mass (Co/Li/Ni/Mn) yields up to **₹240–₹280/kg** for undamaged cathode material.`;
        replyCitations = ['Battery Waste Management Rules 2022 (MoEFCC)', 'Central Pollution Control Board HazMat Circular CPCB/BWM/2024'];
      } else if (lower.includes('pet') || lower.includes('flake') || lower.includes('rate') || lower.includes('price')) {
        replyContent = `### Indian Scrap Commodity Index: PET Flakes (Q4 2026)

- **Clear / Transparent Hot-Washed Bottle Flakes (IV > 0.72):**
  - **₹54.00 – ₹58.50 / kg** (Bhiwandi / Surat textile & bottle-to-bottle pelletizer delivery).
- **Mixed Color / Blue Flakes:**
  - **₹38.00 – ₹42.50 / kg** (Primary use: Geotextile polyester staple fiber).
- **Unwashed Baled Whole Bottles (Kabadi Gate Price):**
  - **₹22.00 – ₹26.00 / kg** (Depends on pre-baling cap and PVC ring separation).

*EPR Premium:* Recycled PET certificates are trading at an additional **+₹3.20/kg** on the National CPCB Portal.`;
        replyCitations = ['All India Plastics Manufacturers’ Association (AIPMA) Index', 'CPCB EPR Portal Clearing Rates'];
      } else if (lower.includes('mlp') || lower.includes('multilayer')) {
        replyContent = `### Multilayer Plastic (MLP) Segregation & Treatment

**Classification (PWM Rules Category III):**
- Packaging with at least one layer of plastic in combination with other materials like aluminium foil or paper (e.g., snack pouches, tetra-packs).

**Circular Pathways:**
1. **End-of-Life Co-Processing:** Direct dispatch to certified cement kilns for energy recovery (calorific value: ~5,200 kcal/kg).
2. **Pyrolysis & Bitumen Compounding:** IRC:SP:98-2020 guidelines permit up to 8% processed shredded MLP in municipal hot-mix asphalt roads.
3. **Producer EPR Liability:** 100% of manufactured MLP volume must be offset by Category III recycling/co-processing certificates.`;
        replyCitations = ['IRC:SP:98-2020 Guidelines for Waste Plastics in Bituminous Mixes', 'Plastic Waste Management (Amendment) Rules 2024'];
      } else {
        replyContent = `Under the relevant Indian waste frameworks (PWM, E-Waste, or CPCB guidelines), waste streams must be segregated at source into distinct dry recyclable fractions before micro-collector handover. 

AVASAR automatically ensures digital weight calibration, generates Form 6 e-manifests, and routes your consignment to the nearest CPCB authorized processing cluster to maximize your gross yield and earn verified carbon offset credits.`;
        replyCitations = ['CPCB Guidelines on Environmental Compensation', 'Solid Waste Management Rules 2016 Rule 15'];
      }

      const assistantMsg: ChatMessage = {
        id: `assist-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: replyContent,
        citations: replyCitations
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header and Scope */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-semibold uppercase">
              Regulatory Intelligence & Commodity Copilot
            </span>
            <span className="text-zinc-500 text-xs font-mono">STATUTORY JURISPRUDENCE DB</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
            {t.advisorTitle}
          </h2>
          <p className="text-sm text-zinc-400 max-w-3xl">
            {t.advisorSubtitle}
          </p>
        </div>
      </div>

      {/* Suggested Prompts Banner */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-mono text-zinc-500 shrink-0 flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          Recommended Queries:
        </span>
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-mono text-zinc-300 transition-colors shrink-0 active:scale-[0.98] cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Main Chat Interface */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 flex flex-col h-[520px] shadow-2xl">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                  isUser
                    ? 'bg-zinc-800 border-zinc-700 text-zinc-200'
                    : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-sm'
                }`}>
                  {isUser ? <span className="font-mono text-xs font-bold">YOU</span> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className={`space-y-2 rounded-xl p-4 text-xs ${
                  isUser
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-zinc-100'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-200'
                }`}>
                  <div className="flex items-center justify-between gap-4 border-b border-zinc-800/60 pb-1.5 font-mono text-[10px] text-zinc-500">
                    <span className="font-semibold text-zinc-400">
                      {isUser ? 'PRODUCER QUERY' : 'AVASAR STATUTORY COPILOT'}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {/* Render content with basic markdown support */}
                  <div className="leading-relaxed whitespace-pre-line font-sans text-xs">
                    {msg.content}
                  </div>

                  {/* Legal and Technical Citations */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="pt-2 mt-2 border-t border-zinc-800/80 space-y-1">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block">
                        Statutory References & Citations:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.citations.map((cite, cIdx) => (
                          <span
                            key={cIdx}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 font-mono text-[10px] text-emerald-400"
                          >
                            <BookOpen className="w-2.5 h-2.5 text-zinc-500" />
                            {cite}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 max-w-xl">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Querying CPCB gazette database & local scrap pricing tickers...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 md:p-4 border-t border-zinc-800 bg-zinc-900/50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={t.chatPlaceholder}
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-hidden focus:border-emerald-500/60 font-sans"
            />
            <button
              type="submit"
              disabled={!inputPrompt.trim() || isTyping}
              className="px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500 active:scale-[0.98] text-zinc-950 font-semibold text-xs font-mono transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-500/10"
            >
              <span>{t.send}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
