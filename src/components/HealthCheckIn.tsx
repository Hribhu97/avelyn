import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Heart, Sparkles, ShieldAlert, AlertCircle, RefreshCw } from 'lucide-react';
import { HealthObservationsState } from '../types';

interface HealthCheckInProps {
  observations?: HealthObservationsState;
  onUpdate: (observations: {
    droppings: 'normal' | 'abnormal';
    energy: 'active' | 'lethargic';
    appetite: 'good' | 'poor';
    vocal: 'normal' | 'silent';
  }) => void;
  flockName: string;
}

export default function HealthCheckIn({ observations, onUpdate, flockName }: HealthCheckInProps) {
  // Local state initialized with current observations orDefaults
  const [droppings, setDroppings] = useState<'normal' | 'abnormal'>(observations?.droppings || 'normal');
  const [energy, setEnergy] = useState<'active' | 'lethargic'>(observations?.energy || 'active');
  const [appetite, setAppetite] = useState<'good' | 'poor'>(observations?.appetite || 'good');
  const [vocal, setVocal] = useState<'normal' | 'silent'>(observations?.vocal || 'normal');
  const [saved, setSaved] = useState(false);

  // Deductions calculation
  let activeDeductions = 0;
  if (droppings === 'abnormal') activeDeductions += 15;
  if (energy === 'lethargic') activeDeductions += 15;
  if (appetite === 'poor') activeDeductions += 10;
  if (vocal === 'silent') activeDeductions += 5;

  const handleSave = () => {
    onUpdate({
      droppings,
      energy,
      appetite,
      vocal,
    });
    setSaved(true);

    // Audio feedback loop
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(500, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.015, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch (_) {}

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  const hasAlerts = droppings === 'abnormal' || energy === 'lethargic' || appetite === 'poor';

  return (
    <div className="bg-white border-2 border-slate-100 rounded-2xl p-2 shadow-xs space-y-2" id="health-checkin-widget">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
            Clinical Telemetry Input
          </span>
          <h3 className="font-display font-bold text-sm text-slate-800">
            Physical & Behavioral Observations
          </h3>
          <p className="text-xs text-slate-400">
            Evaluate {flockName} daily to feed high-fidelity diagnostic data into the Health Score model.
          </p>
        </div>
        <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-xl hidden sm:block">
          <RefreshCw className="w-4 h-4 text-indigo-500 animate-[spin_8s_linear_infinite]" />
        </div>
      </div>

      {/* Observation Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {/* Row 1: Droppings */}
        <div className="border border-slate-100 rounded-xl p-2 bg-slate-50/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              💩 Digestion & Droppings
            </span>
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">Weight: 15%</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => { setDroppings('normal'); setSaved(false); }}
              className={`p-1.5 rounded-lg border font-bold transition-all cursor-pointer ${
                droppings === 'normal'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-2xs'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
              id="droppings-normal-btn"
            >
              Normal (Firm)
            </button>
            <button
              onClick={() => { setDroppings('abnormal'); setSaved(false); }}
              className={`p-1.5 rounded-lg border font-bold transition-all cursor-pointer ${
                droppings === 'abnormal'
                  ? 'bg-amber-500 border-amber-600 text-white shadow-sm'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-rose-50 hover:text-rose-600'
              }`}
              id="droppings-abnormal-btn"
            >
              Abnormal (Loose)
            </button>
          </div>
        </div>

        {/* Row 2: Energy Level */}
        <div className="border border-slate-100 rounded-xl p-2 bg-slate-50/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              🔋 Energy & Posture
            </span>
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">Weight: 15%</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => { setEnergy('active'); setSaved(false); }}
              className={`p-1.5 rounded-lg border font-bold transition-all cursor-pointer ${
                energy === 'active'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-2xs'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
              id="energy-active-btn"
            >
              Active / Curious
            </button>
            <button
              onClick={() => { setEnergy('lethargic'); setSaved(false); }}
              className={`p-1.5 rounded-lg border font-bold transition-all cursor-pointer ${
                energy === 'lethargic'
                  ? 'bg-amber-500 border-amber-600 text-white shadow-sm'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-rose-50 hover:text-rose-600'
              }`}
              id="energy-lethargic-btn"
            >
              Lethargic / Sleepy
            </button>
          </div>
        </div>

        {/* Row 3: Appetite */}
        <div className="border border-slate-100 rounded-xl p-2 bg-slate-50/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              🍎 Appetite & Foraging
            </span>
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">Weight: 10%</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => { setAppetite('good'); setSaved(false); }}
              className={`p-1.5 rounded-lg border font-bold transition-all cursor-pointer ${
                appetite === 'good'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-2xs'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
              id="appetite-good-btn"
            >
              Eating Normally
            </button>
            <button
              onClick={() => { setAppetite('poor'); setSaved(false); }}
              className={`p-1.5 rounded-lg border font-bold transition-all cursor-pointer ${
                appetite === 'poor'
                  ? 'bg-amber-500 border-amber-600 text-white shadow-sm'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-rose-50 hover:text-rose-600'
              }`}
              id="appetite-poor-btn"
            >
              Food Avoidance
            </button>
          </div>
        </div>

        {/* Row 4: Vocalizations */}
        <div className="border border-slate-100 rounded-xl p-2 bg-slate-50/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              🗣️ Vocals & Chatter
            </span>
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">Weight: 5%</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => { setVocal('normal'); setSaved(false); }}
              className={`p-1.5 rounded-lg border font-bold transition-all cursor-pointer ${
                vocal === 'normal'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-2xs'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
              id="vocals-normal-btn"
            >
              Chirping & Social
            </button>
            <button
              onClick={() => { setVocal('silent'); setSaved(false); }}
              className={`p-1.5 rounded-lg border font-bold transition-all cursor-pointer ${
                vocal === 'silent'
                  ? 'bg-amber-500 border-amber-600 text-white shadow-sm'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-rose-50 hover:text-rose-600'
              }`}
              id="vocals-silent-btn"
            >
              Unusually Silent
            </button>
          </div>
        </div>
      </div>

      {/* Warnings & Veterinarian recommendation advice */}
      <AnimatePresence mode="wait">
        {hasAlerts && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-rose-50 border-2 border-rose-100 p-2 rounded-xl text-rose-800 space-y-2 mt-1">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-500" />
                <h4 className="text-xs font-bold font-display">
                  Urgent Avian Diagnostic Signal Blocked!
                </h4>
              </div>
              <p className="text-[11px] text-rose-600 leading-relaxed font-sans">
                Birds instinctively mask sickness to avoid predators. {flockName} currently logs{' '}
                <b>{droppings === 'abnormal' && 'abnormal droppings, '}</b>
                <b>{energy === 'lethargic' && 'lethargy/low behavior energy, '}</b>
                <b>{appetite === 'poor' && 'poor appetite indicators'}</b>. If these symptoms persist for more than 24 hours, click below to locate a certified avian veterinarian immediately.
              </p>
              <div className="pt-1 flex gap-2 flex-wrap">
                <a
                  href="https://www.aav.org/search/"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-1 px-3 rounded-lg text-[10px] uppercase tracking-wide inline-flex items-center gap-1 leading-none"
                >
                  🏥 Find Avian Vet (AAV)
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Deduction Metrics Indicator */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-2 flex-wrap gap-2">
        <div className="text-xs">
          {activeDeductions > 0 ? (
            <span className="text-amber-600 font-bold flex items-center gap-1 font-mono">
              ⚠️ -{activeDeductions} Health Score Deduction Applied
            </span>
          ) : (
            <span className="text-emerald-600 font-bold flex items-center gap-1 font-mono">
              ✨ 0 Clinical Deductions Applied (Perfect Physical Signs)
            </span>
          )}
        </div>

        <button
          onClick={handleSave}
          className={`py-1.5 px-4 rounded-lg text-xs font-bold leading-none cursor-pointer transition-all shadow-xs ${
            saved
              ? 'bg-emerald-500 text-white'
              : 'bg-[#FFFDF8] border-2 border-slate-200 text-slate-700 hover:border-slate-800'
          }`}
          id="save-observations-btn"
        >
          {saved ? '✓ Observations Logged!' : 'Save Wellness Observations'}
        </button>
      </div>
    </div>
  );
}
