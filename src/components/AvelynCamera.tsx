import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, RefreshCw, Download, Sparkles, Image, ShieldCheck, X, Video, Heart, AlertCircle } from 'lucide-react';

interface AvelynCameraProps {
  flockRepresentativeName: string;
}

const OVERLAYS = [
  {
    id: 'love-overlay',
    name: '💖 Avelyn Love Aura',
    emoji: '💖',
    text: 'Avelyn ❤️ Pure Love',
    color: '#FF69B4',
    draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      // Draw some pink hearts around the border
      ctx.fillStyle = 'rgba(255, 105, 180, 0.85)';
      ctx.font = '24px "Lust", "Prata", "Bodoni Moda", serif';
      // Draw text in the corner
      ctx.fillText('💖 AVELYN LOVE', 20, 40);
      ctx.font = '12px "Satoshi", sans-serif';
      ctx.fillText('🐾 ' + new Date().toLocaleDateString(), 20, h - 20);
      
      // Top right hearts
      ctx.font = '24px serif';
      ctx.fillText('💖', w - 40, 40);
      ctx.fillText('❤️', w - 80, 70);
      ctx.fillText('🥰', w - 50, 110);
      // Bottom left hearts
      ctx.fillText('✨🐾✨', 20, h - 50);
    }
  },
  {
    id: 'badge-overlay',
    name: '👑 Certified Avian Master',
    emoji: '👑',
    text: 'Certified Master Parent',
    color: '#FFB74D',
    draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      ctx.fillStyle = '#FFB74D';
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 4;
      ctx.font = 'bold 20px "Lust", "Prata", "Bodoni Moda", serif';
      ctx.fillText('👑 CERTIFIED BIRD PARENT', 20, 45);
      ctx.font = '14px "Satoshi", sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('AVELYN COMPANION SYSTEM', 20, 68);

      // Gold Medal in bottom corner
      ctx.fillStyle = '#FFD54F';
      ctx.beginPath();
      ctx.arc(w - 70, h - 70, 36, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#E65100';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Medal details
      ctx.fillStyle = '#E65100';
      ctx.font = 'bold 12px "Satoshi", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('100%', w - 70, h - 75);
      ctx.font = '9px "Satoshi", sans-serif';
      ctx.fillText('ORGANIC', w - 70, h - 60);
      ctx.textAlign = 'left';
      ctx.shadowBlur = 0; // reset
    }
  },
  {
    id: 'growth-overlay',
    name: '🌿 Kiwi Fresh Habit',
    emoji: '🌿',
    text: 'My Fresh Chop Day',
    color: '#39C16C',
    draw: (ctx: CanvasRenderingContext2D, w: number, h: number, name: string) => {
      ctx.fillStyle = '#39C16C';
      ctx.font = 'bold 18px "Lust", "Prata", "Bodoni Moda", serif';
      ctx.fillText('🥬 ' + name.toUpperCase() + "'S VEG CHOP DAY", 20, 40);
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.font = '12px "Satoshi", sans-serif';
      ctx.fillText('Raw Nutrition log: Certified Fresh 🥦🥕', 20, 60);

      // Cute organic leaf icons
      ctx.font = '30px serif';
      ctx.fillText('🌿', w - 60, h - 60);
      ctx.fillText('🍎', w - 110, h - 55);
      ctx.fillText('🥕', w - 70, h - 110);
    }
  },
  {
    id: 'space-overlay',
    name: '🚀 Cosmic Wingman',
    emoji: '🚀',
    text: 'Avelyn Flight Safety',
    color: '#6366F1',
    draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      ctx.fillStyle = '#818CF8';
      ctx.font = 'bold 22px "Lust", "Prata", "Bodoni Moda", serif';
      ctx.fillText('🚀 COSMIC WINGMAN', 20, 42);
      ctx.font = '11px "Space Mono", monospace';
      ctx.fillStyle = '#A5B4FC';
      ctx.fillText('FLIGHT TELEMETRY STATUS: NOMINAL', 20, 62);

      // Star constellations
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '16px serif';
      ctx.fillText('⭐', w - 80, 45);
      ctx.fillText('✨', w - 120, 90);
      ctx.fillText('🌌', w - 60, h - 60);
    }
  }
];

export default function AvelynCamera({ flockRepresentativeName }: AvelynCameraProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [activeOverlayIndex, setActiveOverlayIndex] = useState(0);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number>(4 / 3);
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Initialize and request stream
  const startCamera = async () => {
    setCameraError(null);
    setCapturedImage(null);
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // prefer back camera
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      });
      setStream(mediaStream);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.warn("Camera access denied or missing. Activating high-fidelity simulated uploader.", err);
      setCameraError(
        "Camera stream blocked/unsupported in this container. Use the uploader button below to apply Avelyn overlays to any bird photo!"
      );
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Handle Photo uploading fallback
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setUploadedImage(img);
        setCapturedImage(null);
        drawCapturedCanvas(img);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Click Trigger Action
  const clickPhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions identical to video aspect
    const videoWidth = video.videoWidth || 640;
    const videoHeight = video.videoHeight || 480;
    canvas.width = videoWidth;
    canvas.height = videoHeight;

    // Mirror if using front camera, but standard back camera is normal
    ctx.drawImage(video, 0, 0, videoWidth, videoHeight);

    // Apply designated Overlay
    const overlay = OVERLAYS[activeOverlayIndex];
    overlay.draw(ctx, videoWidth, videoHeight, flockRepresentativeName);

    // Get combined photo as png base64
    const fileUrl = canvas.toDataURL('image/png');
    setCapturedImage(fileUrl);
    
    // Play virtual snapshot noise
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      }
    } catch (_) {}
  };

  // Draw overlay with uploaded image
  const drawCapturedCanvas = (img: HTMLImageElement) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = img.naturalWidth || 640;
    canvas.height = img.naturalHeight || 480;

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Apply overlay
    const overlay = OVERLAYS[activeOverlayIndex];
    overlay.draw(ctx, canvas.width, canvas.height, flockRepresentativeName);

    const fileUrl = canvas.toDataURL('image/png');
    setCapturedImage(fileUrl);
  };

  // Re-draw automatically if user changes the overlay on uploaded image
  useEffect(() => {
    if (uploadedImage) {
      drawCapturedCanvas(uploadedImage);
    }
  }, [activeOverlayIndex, uploadedImage]);

  return (
    <div className="bg-white border-2 border-slate-100 rounded-xl p-2 shadow-xs space-y-2" id="avelyn-camera-block">
      {/* Title */}
      <div className="flex items-center justify-between gap-2">
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
            Mobile Avian Camera
          </span>
          <h3 className="font-display font-extrabold text-sm text-slate-800 tracking-tight">
            Bird Overlay Snapshot
          </h3>
          <p className="text-[11px] text-slate-400">
            Snap photos of {flockRepresentativeName} with collectible Avelyn system overlays on top!
          </p>
        </div>
        <div className="p-1.5 bg-indigo-50 border border-indigo-100 rounded-xl">
          <Camera className="w-4 h-4 text-indigo-500" />
        </div>
      </div>

      {/* Main Viewfinder Box - using exactly 8px margin and padding metrics */}
      <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-[16/10] flex items-center justify-center border border-slate-150 font-sans">
        
        {/* Real Video Stream Feed */}
        {isCameraActive && !capturedImage && (
          <video
            ref={videoRef}
            aria-label="Avian Camera Viewfinder"
            className="w-full h-full object-cover scale-x-[-1]"
            playsInline
            muted
          />
        )}

        {/* Captured / Uploaded result preview */}
        {capturedImage && (
          <img
            src={capturedImage}
            alt="Captured Bird Snapshot"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        )}

        {/* Empty placeholder states */}
        {!isCameraActive && !capturedImage && !uploadedImage && (
          <div className="text-center p-4 space-y-2 z-15 text-slate-300 max-w-sm">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mx-auto">
              <Video className="w-5 h-5 text-indigo-400" />
            </div>
            {cameraError ? (
              <div className="space-y-1">
                <p className="text-[11px] text-red-300 font-sans font-medium">
                  {cameraError}
                </p>
                <p className="text-[10px] text-slate-400">
                  Select a photo of your bird from your phone library to apply the frames!
                </p>
              </div>
            ) : (
              <p className="text-[11px] text-slate-300">
                Ready to take a picture of your bird? Activate your camera stream!
              </p>
            )}

            <button
              onClick={startCamera}
              className="py-1 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 mx-auto cursor-pointer shadow-xs transition-colors"
            >
              <Video className="w-3.5 h-3.5" /> Start Camera Feed
            </button>
          </div>
        )}

        {/* Live Graphic Overlays Preview Layer */}
        {isCameraActive && !capturedImage && (
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-2 border-2 border-indigo-400/40 rounded-xl">
            {/* Top Overlay banner text */}
            <div className="bg-slate-950/70 backdrop-blur-xs text-white px-2 py-0.5 rounded-md text-[10px] font-bold self-start flex items-center gap-1">
              <span>{OVERLAYS[activeOverlayIndex].emoji}</span>
              <span>{OVERLAYS[activeOverlayIndex].text.replace('[Name]', flockRepresentativeName)}</span>
            </div>
            
            {/* Mascot stamp placeholder */}
            <div className="w-8 h-8 bg-indigo-500 rounded-full self-end flex items-center justify-center text-md animate-pulse shadow-md border border-white">
              🦜
            </div>
          </div>
        )}
      </div>

      {/* Hidden processing Canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Overlay Picker list - strictly 8px margins/padding spacing and rounded boxes */}
      <div className="space-y-1">
        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
          Choose Collectible Mask Overlay
        </label>
        <div className="grid grid-cols-2 gap-1.5 text-xs">
          {OVERLAYS.map((overlay, idx) => (
            <button
              key={overlay.id}
              onClick={() => {
                setActiveOverlayIndex(idx);
                // Play feedback tick
                try {
                  const audio = new (window.AudioContext || (window as any).webkitAudioContext)();
                  const osc = audio.createOscillator();
                  const gain = audio.createGain();
                  osc.frequency.setValueAtTime(400, audio.currentTime);
                  gain.gain.setValueAtTime(0.01, audio.currentTime);
                  gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.05);
                  osc.connect(gain);
                  gain.connect(audio.destination);
                  osc.start();
                  osc.stop(audio.currentTime + 0.06);
                } catch(_) {}
              }}
              className={`p-1 px-1.5 rounded-lg text-left border-2 font-bold transition-all flex items-center gap-1 cursor-pointer text-[11px] ${
                activeOverlayIndex === idx
                  ? 'border-indigo-500 bg-indigo-50/40 text-indigo-800'
                  : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 text-slate-500'
              }`}
            >
              <span>{overlay.emoji}</span>
              <span className="truncate">{overlay.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Camera Action Buttons - exactly 8px grid spacing */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {isCameraActive && !capturedImage && (
          <button
            onClick={clickPhoto}
            className="flex-1 py-1.5 px-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            id="shutter-trigger-btn"
          >
            <Camera className="w-3.5 h-3.5" /> Snap Photo!
          </button>
        )}

        {/* Fallback File Uploader */}
        <label className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors text-center border-2 border-slate-200">
          <Image className="w-3.5 h-3.5 text-slate-400" />
          <span>Upload Picture</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />
        </label>

        {capturedImage && (
          <div className="w-full flex gap-1.5">
            <a
              href={capturedImage}
              download={`${flockRepresentativeName}-avelyn-overlay.png`}
              className="flex-1 py-1.5 px-3 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              id="camera-download-link"
            >
              <Download className="w-3.5 h-3.5" /> Save Snapshot
            </a>

            <button
              onClick={() => {
                setCapturedImage(null);
                setUploadedImage(null);
                if (isCameraActive) {
                  startCamera();
                }
              }}
              className="px-2.5 bg-slate-800 text-white hover:bg-slate-900 rounded-lg text-xs font-bold py-1.5 cursor-pointer"
            >
              Retake
            </button>
          </div>
        )}

        {isCameraActive && (
          <button
            onClick={stopCamera}
            className="py-1.5 px-2.5 border border-slate-200 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg text-xs font-bold cursor-pointer"
          >
            Turn Off
          </button>
        )}
      </div>

      <div className="text-[10px] text-slate-400 flex items-center gap-1 font-sans justify-center bg-slate-50 py-1 rounded-lg border border-slate-100">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        Photos are processed entirely in the browser safety sandbox.
      </div>
    </div>
  );
}
