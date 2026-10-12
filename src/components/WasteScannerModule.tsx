import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Camera, 
  CameraOff,
  SwitchCamera,
  RotateCw, 
  ArrowRight, 
  Scale, 
  Sparkles, 
  AlertCircle,
  X,
  Zap,
  ShieldAlert,
  Upload,
  Scan,
  Plus,
  Trash2,
  PackageCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../utils/avasarI18n';
import type { WasteCategory } from '../types/avasar';
import { 
  analyzeImageWithGemini, 
  getGeminiApiKey, 
  type VisionAnalysisResult 
} from '../utils/visionService';
import {
  detectObjectInCanvas,
  preloadDetectionModel,
  type LocalDetectionResult
} from '../utils/localDetector';

interface WasteScannerModuleProps {
  onProceedToRecyclers: (scanResult: {
    category: WasteCategory;
    materialName: string;
    weightKg: number;
    photoUrl: string;
    ratePerKg: number;
    estimatedValue: number;
    confidence: number;
  }) => void;
}

interface BoundingBox {
  xPct: number;
  yPct: number;
  wPct: number;
  hPct: number;
  label: string;
}

export interface IdentifiedScrapItem {
  id: string;
  category: WasteCategory;
  name: string;
  photoUrl: string;
  weightKg: number;
  ratePerKg: number;
  estimatedValue: number;
  confidence: number;
  notes: string;
  hazardLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  scannedAt: string;
}

export const WasteScannerModule: React.FC<WasteScannerModuleProps> = ({ onProceedToRecyclers }) => {
  const { language, materials, speakText } = useApp();
  const t = getTranslation(language);

  // Video and Canvas refs for live camera streaming & capture
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Camera states
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Scan & Detection states
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [detectedCategory, setDetectedCategory] = useState<WasteCategory>('PCB');
  const [confidence, setConfidence] = useState<number>(90);

  // WEIGHT IS ENTERED BY THE PERSON ONLY (not by AI)
  const [weightKg, setWeightKg] = useState<number | ''>('');

  const [aiItemTitle, setAiItemTitle] = useState<string>('');
  const [aiNotes, setAiNotes] = useState<string>('');
  const [hazardLevel, setHazardLevel] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('LOW');
  const [isAiPowered, setIsAiPowered] = useState<boolean>(false);
  const [detectedBbox, setDetectedBbox] = useState<BoundingBox | null>(null);

  // List of all identified items
  const [identifiedItems, setIdentifiedItems] = useState<IdentifiedScrapItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Stop camera helper
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  }, []);

  // Start live webcam / mobile camera
  const startCamera = useCallback(async (facing: 'environment' | 'user' = cameraFacing) => {
    setCameraError(null);
    stopCamera();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported in this browser. Please use Chrome/Edge/Safari or upload a photo.');
      }

      let stream: MediaStream | null = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facing },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      if (!stream) {
        throw new Error('No camera stream received.');
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch {
          // Handled via onLoadedMetadata
        }
      }
      setIsCameraActive(true);
      setCameraFacing(facing);
    } catch (err: unknown) {
      console.error('Camera open failed:', err);
      let errorMsg = 'Could not access camera.';
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError' || err.message.toLowerCase().includes('permission')) {
          errorMsg = 'Camera permission denied. Please allow camera access in your browser settings.';
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          errorMsg = 'No camera detected on this system. You can use the "Upload Photo" button instead.';
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          errorMsg = 'Camera is currently in use by another application. Please close other camera apps and retry.';
        } else {
          errorMsg = err.message;
        }
      }
      setCameraError(errorMsg);
      setIsCameraActive(false);
    }
  }, [cameraFacing, stopCamera]);

  // Preload detection model and start camera on mount
  useEffect(() => {
    preloadDetectionModel();
    startCamera();

    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  // Ensure stream stays bound if video element updates
  useEffect(() => {
    if (isCameraActive && streamRef.current && videoRef.current) {
      if (videoRef.current.srcObject !== streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
        videoRef.current.play().catch(() => {});
      }
    }
  }, [isCameraActive]);

  // Flip front / back camera
  const toggleCameraFacing = () => {
    const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    startCamera(nextFacing);
  };

  // Find corresponding material config for rate calculation
  const currentMaterial = materials.find((m) => m.id === detectedCategory) || materials[0];
  const ratePerKg = currentMaterial.defaultRatePerKg;
  const numericWeight = typeof weightKg === 'number' && weightKg > 0 ? weightKg : 0;
  const estimatedTotal = Number((numericWeight * ratePerKg).toFixed(0));

  // Handle manual weight change by user
  const handleWeightChange = (inputVal: string) => {
    if (inputVal === '') {
      setWeightKg('');
      if (selectedItemId) {
        setIdentifiedItems((prev) =>
          prev.map((it) => (it.id === selectedItemId ? { ...it, weightKg: 0, estimatedValue: 0 } : it))
        );
      }
      return;
    }
    const parsed = parseFloat(inputVal);
    const positiveNum = !isNaN(parsed) && parsed > 0 ? parsed : 0;
    setWeightKg(positiveNum);

    if (selectedItemId) {
      setIdentifiedItems((prev) =>
        prev.map((it) => {
          if (it.id === selectedItemId) {
            return {
              ...it,
              weightKg: positiveNum,
              estimatedValue: Math.round(positiveNum * it.ratePerKg),
            };
          }
          return it;
        })
      );
    }
  };

  // Run Real Object Detection on Canvas
  const processCanvasDetection = async (canvas: HTMLCanvasElement, dataUrl: string) => {
    setIsScanning(true);
    setDetectedBbox(null);

    const apiKey = getGeminiApiKey();

    let finalCategory: WasteCategory = 'OTHER';
    let finalTitle = '';
    let finalConfidence = 90;
    let finalHazard: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    let finalNotes = '';

    // If Gemini API Key is configured via environment, attempt Gemini Vision
    if (apiKey) {
      try {
        const geminiRes: VisionAnalysisResult = await analyzeImageWithGemini(dataUrl, apiKey);
        finalCategory = geminiRes.category;
        finalConfidence = geminiRes.confidence;
        finalTitle = language === 'hi' ? geminiRes.itemNameHi : geminiRes.itemNameEn;
        finalNotes = geminiRes.notes;
        finalHazard = geminiRes.hazardLevel;
      } catch (err: unknown) {
        console.warn('Gemini Vision fallback to local neural detector:', err);
      }
    }

    // If Gemini wasn't used or failed, run onboard neural detector
    if (!finalTitle) {
      try {
        const localRes: LocalDetectionResult = await detectObjectInCanvas(canvas);
        finalCategory = localRes.category;
        finalConfidence = localRes.confidence;
        finalTitle = language === 'hi' ? localRes.itemNameHi : localRes.itemNameEn;
        finalNotes = localRes.notes;
        finalHazard = localRes.hazardLevel;

        if (localRes.bbox && canvas.width > 0 && canvas.height > 0) {
          const [x, y, w, h] = localRes.bbox;
          setDetectedBbox({
            xPct: Math.max(0, Math.min(100, (x / canvas.width) * 100)),
            yPct: Math.max(0, Math.min(100, (y / canvas.height) * 100)),
            wPct: Math.max(5, Math.min(100, (w / canvas.width) * 100)),
            hPct: Math.max(5, Math.min(100, (h / canvas.height) * 100)),
            label: `${localRes.rawClass || localRes.category} (${localRes.confidence}%)`,
          });
        }
      } catch (err) {
        console.error('Detection error:', err);
        finalTitle = 'Scrap Hardware Item';
        finalNotes = 'Optical diagnostic inspection.';
      }
    }

    // Update active item states (DO NOT let AI add weight - user enters weight)
    setDetectedCategory(finalCategory);
    setConfidence(finalConfidence);
    setAiItemTitle(finalTitle);
    setAiNotes(finalNotes);
    setHazardLevel(finalHazard);
    setIsAiPowered(true);

    const itemMaterial = materials.find((m) => m.id === finalCategory) || materials[0];
    const itemRate = itemMaterial.defaultRatePerKg;
    const currentWeight = typeof weightKg === 'number' && weightKg > 0 ? weightKg : 0;
    const itemVal = Math.round(currentWeight * itemRate);

    // Add identified item to the list of identified items
    const newItem: IdentifiedScrapItem = {
      id: `item-${Date.now()}`,
      category: finalCategory,
      name: finalTitle,
      photoUrl: dataUrl,
      weightKg: currentWeight,
      ratePerKg: itemRate,
      estimatedValue: itemVal,
      confidence: finalConfidence,
      notes: finalNotes,
      hazardLevel: finalHazard,
      scannedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setIdentifiedItems((prev) => [newItem, ...prev]);
    setSelectedItemId(newItem.id);

    // Prompt the user to enter the measured weight on scale
    speakText(
      `Identified ${finalTitle}. Category: ${finalCategory}. Please enter the measured scale weight.`,
      `पहचाना गया: ${finalTitle}। श्रेणी: ${finalCategory}। कृपया कांटे पर तौलकर वजन दर्ज करें।`
    );

    setIsScanning(false);
  };

  // Capture frame from active video stream
  const captureSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.90);
      stopCamera();
      setCapturedPhoto(dataUrl);
      processCanvasDetection(canvas, dataUrl);
    }
  };

  // Handle uploaded photo
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      stopCamera();
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setCapturedPhoto(dataUrl);

        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current || document.createElement('canvas');
          canvas.width = img.width || 640;
          canvas.height = img.height || 480;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            processCanvasDetection(canvas, dataUrl);
          }
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    }
  };

  // Select an item from identified items list to inspect or edit
  const handleSelectItem = (item: IdentifiedScrapItem) => {
    setSelectedItemId(item.id);
    setDetectedCategory(item.category);
    setConfidence(item.confidence);
    setWeightKg(item.weightKg > 0 ? item.weightKg : '');
    setAiItemTitle(item.name);
    setAiNotes(item.notes);
    setHazardLevel(item.hazardLevel);
    setCapturedPhoto(item.photoUrl);
    stopCamera();
  };

  // Delete an identified item
  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIdentifiedItems((prev) => prev.filter((it) => it.id !== id));
    if (selectedItemId === id) {
      setSelectedItemId(null);
    }
  };

  // Proceed with current active item or primary identified item
  const handleCreatePassport = () => {
    if (numericWeight <= 0) {
      alert(language === 'hi' ? 'कृपया आगे बढ़ने से पहले कांटे पर तौलकर वजन (kg) दर्ज करें।' : 'Please enter the measured scale weight in kg before proceeding.');
      return;
    }

    const finalPhoto = capturedPhoto || (identifiedItems[0]?.photoUrl) || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80';
    const finalTitle = aiItemTitle || (identifiedItems[0]?.name) || (language === 'hi' ? currentMaterial.nameHi : currentMaterial.nameEn);

    onProceedToRecyclers({
      category: detectedCategory,
      materialName: finalTitle,
      weightKg: numericWeight,
      photoUrl: finalPhoto,
      ratePerKg,
      estimatedValue: estimatedTotal,
      confidence,
    });
  };

  // Calculate totals across all identified items
  const totalBatchWeight = identifiedItems.reduce((acc, it) => acc + it.weightKg, 0);
  const totalBatchValue = identifiedItems.reduce((acc, it) => acc + it.estimatedValue, 0);

  return (
    <div className="space-y-4 pb-20">
      {/* Hidden canvas for video captures */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-stone-900 tracking-tight">
            {t.scanTitle}
          </h2>
          {isAiPowered && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              AI Scanner Active
            </span>
          )}
        </div>
        <p className="text-xs text-stone-600">
          Point camera at scrap electronics or upload a photo to identify objects, then enter measured scale weight.
        </p>
      </div>

      {/* Camera error alert banner */}
      {cameraError && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-800 space-y-2 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{cameraError}</span>
            </div>
            <button onClick={() => setCameraError(null)} className="text-rose-500 hover:text-rose-700">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => startCamera()}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-semibold transition-all active:scale-95"
            >
              Retry Camera
            </button>
          </div>
        </div>
      )}

      {/* Camera & Scanner Viewport Card */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden space-y-3">
        {/* Reticle Viewport */}
        <div className="relative aspect-4/3 w-full bg-stone-950 flex items-center justify-center overflow-hidden">
          {/* Video Stream Element */}
          <video
            ref={videoRef}
            playsInline
            autoPlay
            muted
            onLoadedMetadata={() => {
              videoRef.current?.play().catch(() => {});
            }}
            className={`w-full h-full object-cover ${isCameraActive ? 'block' : 'hidden'}`}
          />

          {/* Captured Static Photo when camera is stopped */}
          {!isCameraActive && capturedPhoto && (
            <img
              src={capturedPhoto}
              alt="Scrap item"
              className="w-full h-full object-cover filter contrast-[1.02]"
            />
          )}

          {/* Real AI Object Detection Bounding Box Overlay */}
          {!isCameraActive && capturedPhoto && detectedBbox && (
            <div
              className="absolute border-2 border-emerald-400 bg-emerald-500/15 rounded-lg shadow-[0_0_12px_rgba(16,185,129,0.5)] transition-all pointer-events-none z-10"
              style={{
                left: `${detectedBbox.xPct}%`,
                top: `${detectedBbox.yPct}%`,
                width: `${detectedBbox.wPct}%`,
                height: `${detectedBbox.hPct}%`,
              }}
            >
              <div className="absolute -top-6 left-0 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-md whitespace-nowrap uppercase tracking-wider flex items-center gap-1">
                <Scan className="w-3 h-3" />
                <span>{detectedBbox.label}</span>
              </div>
            </div>
          )}

          {/* Offline Camera Placeholder */}
          {!isCameraActive && !capturedPhoto && (
            <div className="flex flex-col items-center justify-center p-6 text-center text-stone-300 space-y-3">
              <div className="w-16 h-16 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-emerald-400">
                <Camera className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">Camera is Ready</p>
                <p className="text-xs text-stone-400 max-w-xs">
                  Click the button below to turn on your live camera and scan scrap items.
                </p>
              </div>
              <button
                onClick={() => startCamera()}
                className="px-5 py-2.5 bg-[#176B45] hover:bg-[#125436] text-white text-xs font-bold rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                <span>Open Camera</span>
              </button>
            </div>
          )}

          {/* Optical Scanner Reticle Crosshairs */}
          {(isCameraActive || (capturedPhoto && !detectedBbox)) && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="relative w-52 h-52 border border-emerald-400/50 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.18)]">
                <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-emerald-400"></div>
                <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-emerald-400"></div>
                <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-emerald-400"></div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-emerald-400"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full absolute"></div>
                </div>
              </div>
            </div>
          )}

          {/* Laser Scanning Animation */}
          {isScanning && (
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_16px_#10b981] animate-scan-line z-20"></div>
          )}

          {/* Top Camera Controls Overlay */}
          <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
            {isCameraActive && (
              <button
                onClick={toggleCameraFacing}
                className="p-2 rounded-xl bg-stone-900/80 hover:bg-stone-900 text-white border border-white/20 backdrop-blur-xs transition-all active:scale-90 shadow-md cursor-pointer"
                title="Switch Camera (Front/Rear)"
              >
                <SwitchCamera className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => (isCameraActive ? stopCamera() : startCamera())}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border backdrop-blur-xs transition-all active:scale-95 shadow-md cursor-pointer ${
                isCameraActive
                  ? 'bg-rose-600/90 hover:bg-rose-600 text-white border-rose-400/30'
                  : 'bg-stone-900/80 hover:bg-stone-900 text-emerald-400 border-white/20'
              }`}
            >
              {isCameraActive ? (
                <>
                  <CameraOff className="w-3.5 h-3.5" />
                  <span>Pause Cam</span>
                </>
              ) : (
                <>
                  <Camera className="w-3.5 h-3.5" />
                  <span>{capturedPhoto ? 'Reopen Cam' : 'Start Cam'}</span>
                </>
              )}
            </button>
          </div>

          {/* Capture Trigger Button when Live Camera is running */}
          {isCameraActive && (
            <div className="absolute bottom-4 inset-x-0 z-30 flex justify-center">
              <button
                onClick={captureSnapshot}
                className="py-3 px-7 rounded-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs flex items-center gap-2 shadow-xl shadow-emerald-950/60 border border-emerald-300 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 text-emerald-100" />
                <span>Capture & Identify</span>
              </button>
            </div>
          )}

          {/* Floating Pill on Viewport */}
          {capturedPhoto && !isCameraActive && (
            <div className="absolute bottom-2 inset-x-2 z-20 bg-stone-900/95 backdrop-blur-md text-white p-2.5 rounded-xl text-xs flex items-center justify-between border border-white/10 font-sans shadow-lg">
              <div className="max-w-[70%]">
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  {isScanning ? (
                    <>
                      <RotateCw className="w-2.5 h-2.5 animate-spin" />
                      ANALYZING NEURAL SPECTRUM...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                      IDENTIFIED:
                    </>
                  )}
                </span>
                <span className="font-bold text-xs truncate block text-stone-100">
                  {aiItemTitle || (language === 'hi' ? currentMaterial.nameHi : currentMaterial.nameEn)}
                </span>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-stone-400 font-mono block">MATCH</span>
                <span className="font-bold text-emerald-400 text-xs">
                  {confidence}%
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Upload and Camera Controls Bar */}
        <div className="p-3 pt-0">
          <div className="flex gap-2">
            <label className="flex-1 py-2.5 px-3 bg-[#176B45] hover:bg-[#125436] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95 transition-all">
              <Upload className="w-4 h-4" />
              <span>Upload Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {!isCameraActive && (
              <button
                onClick={() => startCamera()}
                className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-stone-200 active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-emerald-700" />
                <span>Scan Another</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* IDENTIFIED OBJECTS LIST: Lists the identified object(s)                   */}
      {/* ========================================================================= */}
      {identifiedItems.length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <div className="flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                Identified Object List ({identifiedItems.length})
              </h3>
            </div>
            {identifiedItems.length > 1 && (
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Total: ₹{totalBatchValue} ({totalBatchWeight > 0 ? `${totalBatchWeight.toFixed(1)} kg` : 'Weight pending'})
              </span>
            )}
          </div>

          <div className="space-y-2">
            {identifiedItems.map((item) => {
              const isSelected = selectedItemId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? 'bg-emerald-50/70 border-emerald-400 shadow-xs'
                      : 'bg-stone-50 border-stone-200 hover:bg-stone-100/70'
                  }`}
                >
                  {/* Item Image Thumbnail */}
                  <img
                    src={item.photoUrl}
                    alt={item.name}
                    className="w-14 h-14 object-cover rounded-lg border border-stone-200 shrink-0"
                  />

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-xs text-stone-900 truncate">
                        {item.name}
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase">
                        {item.category}
                      </span>
                      <span className="text-[9px] font-medium text-stone-500">
                        {item.confidence}% match
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-500 truncate mt-0.5">
                      {item.notes || 'Identified via optical sensor.'}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-stone-700 font-medium mt-1">
                      <span>
                        Weight:{' '}
                        <strong className={item.weightKg > 0 ? 'text-stone-900' : 'text-amber-700 font-semibold'}>
                          {item.weightKg > 0 ? `${item.weightKg} kg` : 'Weight Pending'}
                        </strong>
                      </span>
                      <span>Rate: <strong className="text-stone-900">₹{item.ratePerKg}/kg</strong></span>
                      <span className="text-emerald-700 font-bold">
                        {item.weightKg > 0 ? `Est: ₹${item.estimatedValue}` : 'Est: ₹0'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleDeleteItem(item.id, e)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Remove from list"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ACTIVE ITEM DETAILS & VALUATION FORMULA                                   */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
          Selected Item Valuation & Adjustments
        </h3>

        {/* Category correction dropdown */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-stone-700 flex items-center justify-between">
            <span>{t.correctCategory}</span>
            <span className="text-[10px] text-stone-400 font-normal">
              Collector Overrule
            </span>
          </label>
          <select
            value={detectedCategory}
            onChange={(e) => {
              const newCat = e.target.value as WasteCategory;
              setDetectedCategory(newCat);
              setAiItemTitle('');
            }}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-800 font-medium focus:outline-hidden focus:border-emerald-600 cursor-pointer"
          >
            {materials.map((m) => (
              <option key={m.id} value={m.id}>
                {language === 'hi' ? m.nameHi : m.nameEn} (₹{m.defaultRatePerKg}/kg)
              </option>
            ))}
          </select>
        </div>

        {/* Enter Weight Input - PERSON ENTERS WEIGHT ONLY */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-stone-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span>{t.enterWeight}</span>
              <span className="text-[10px] text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                User Scale Entry
              </span>
            </span>
            <span className="text-[10px] text-emerald-700 font-medium">
              Physical Scale
            </span>
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="number"
                step="0.1"
                min="0.01"
                placeholder="Enter measured kg (e.g. 2.5)"
                value={weightKg === '' ? '' : weightKg}
                onChange={(e) => handleWeightChange(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 pl-9 text-base font-bold text-stone-900 focus:outline-hidden focus:border-emerald-600 tabular-nums placeholder:text-stone-400 placeholder:font-normal placeholder:text-xs"
              />
              <Scale className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
            </div>
            <span className="text-xs font-bold text-stone-600 bg-stone-100 px-3 py-3 rounded-xl border border-stone-200">
              KG
            </span>
          </div>
          {(!weightKg || weightKg === 0) && (
            <p className="text-[11px] text-amber-700 font-medium pt-0.5">
              ⚠️ Weigh the scrap on your scale and type the kilograms above.
            </p>
          )}
        </div>

        {/* Hazard level warning if high */}
        {(hazardLevel === 'HIGH' || currentMaterial.safetyHazard === 'HIGH') && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-xs text-amber-800 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Hazard Alert: Contains hazardous compounds. Handle with insulated gloves.</span>
          </div>
        )}

        {/* AI Identified Notes / Component description */}
        {aiNotes && (
          <div className="text-xs text-stone-600 bg-stone-50 border border-stone-200/80 rounded-xl p-3">
            <span className="font-semibold text-stone-800 block text-[11px] uppercase tracking-wider mb-0.5">
              Identified Notes:
            </span>
            {aiNotes}
          </div>
        )}

        {/* Valuation Formula Calculation Box */}
        <div className="bg-stone-50 rounded-xl border border-stone-200/80 p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-600 font-medium">
            <span>{t.indicativeRate}:</span>
            <span className="font-bold text-stone-900 tabular-nums">
              ₹{ratePerKg} / kg
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-stone-600 font-medium">
            <span>Weight × Benchmark Rate:</span>
            <span className="font-mono text-stone-700">
              {numericWeight > 0 ? `${numericWeight} kg` : '0 kg'} × ₹{ratePerKg}
            </span>
          </div>

          <div className="pt-2 border-t border-stone-200 flex items-baseline justify-between">
            <div>
              <span className="text-xs font-bold text-stone-900 block">
                {t.estimatedValue}
              </span>
              <span className="text-[10px] text-stone-500">
                Formula: Weight × Rate
              </span>
            </div>
            <span className="text-2xl font-black text-[#176B45] tabular-nums">
              ₹{estimatedTotal}
            </span>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-[10px] text-stone-500 leading-relaxed italic">
          {t.estimateDisclaimer}
        </p>

        {/* Action Button: Proceed to Recycler Matching */}
        <button
          onClick={handleCreatePassport}
          className="w-full py-3 px-4 rounded-xl bg-[#176B45] hover:bg-[#125436] active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
        >
          <span>{t.createPassportBtn}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
