import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BirdType, FlockInfo } from '../types';
import Mascot from './Mascot';
import { Check, ArrowRight, ArrowLeft, Plus, Minus, Gift } from 'lucide-react';

interface OnboardingProps {
  clientId: string;
  referralCode: string;
  onApplyReferral: (code: string) => Promise<{ success: boolean; message: string }>;
  onComplete: (data: {
    birdType: BirdType[];
    birdCount: number;
    experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
    goals: string[];
    referralCodeEntered?: string;
  }) => void;
}

export default function Onboarding({
  clientId,
  referralCode,
  onApplyReferral,
  onComplete
}: OnboardingProps) {
  const [step, setStep] = useState(1); // 1 to 6
  const [selectedBirds, setSelectedBirds] = useState<BirdType[]>([]);
  const [birdCount, setBirdCount] = useState<number>(1);
  const [experience, setExperience] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [referralInput, setReferralInput] = useState('');
  const [referralMessage, setReferralMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [applyingReferral, setApplyingReferral] = useState(false);

  // Bird Options metadata
  const birdOptions = [
    { id: 'budgie' as BirdType, name: 'Budgie', emoji: '🦜' },
    { id: 'cockatiel' as BirdType, name: 'Cockatiel', emoji: '🐤' },
    { id: 'lovebird' as BirdType, name: 'Lovebird', emoji: '❤️' },
    { id: 'conure' as BirdType, name: 'Conure', emoji: '🟢' },
    { id: 'africangrey' as BirdType, name: 'African Grey', emoji: '🐦' },
    { id: 'macaw' as BirdType, name: 'Macaw', emoji: '🔴' },
    { id: 'finch' as BirdType, name: 'Finch', emoji: '🌾' },
    { id: 'canary' as BirdType, name: 'Canary', emoji: '💛' },
    { id: 'other' as BirdType, name: 'Other', emoji: '❓' }
  ];

  // Goals metadata
  const goalOptions = [
    { id: 'nutrition', label: 'Better Nutrition', desc: 'Find perfect bird food seeds, pellets & chop recipes.' },
    { id: 'training', label: 'Training', desc: 'Unravel step-up training, target training, and flight.' },
    { id: 'breeding', label: 'Breeding', desc: 'Expert guidance on nests, eggs, and chick rearing.' },
    { id: 'health', label: 'Health Monitoring', desc: 'Connect to avian vets and understand symptom red flags.' },
    { id: 'emergency', label: 'Emergency Preparedness', desc: 'Prepare emergency kits and clinical safety standards.' }
  ];

  const toggleBirdSelected = (id: BirdType) => {
    setSelectedBirds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleGoal = (id: string) => {
    setSelectedGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (step < 6) {
      setStep((p) => p + 1);
    } else {
      onComplete({
        birdType: selectedBirds.length ? selectedBirds : ['other'],
        birdCount,
        experienceLevel: experience,
        goals: selectedGoals.length ? selectedGoals : ['nutrition'],
        referralCodeEntered: referralMessage?.type === 'success' ? referralInput : undefined
      });
    }
  };

  const handleBack = () => {
    if (step > 1) setStep((p) => p - 1);
  };

  const handleApplyCode = async () => {
    if (!referralInput.trim()) return;
    setApplyingReferral(true);
    setReferralMessage(null);
    try {
      const res = await onApplyReferral(referralInput);
      if (res.success) {
        setReferralMessage({ type: 'success', text: res.message });
      } else {
        setReferralMessage({ type: 'error', text: res.message });
      }
    } catch (e: any) {
      setReferralMessage({ type: 'error', text: 'Error applying code.' });
    } finally {
      setApplyingReferral(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-4 font-sans text-[#1C1C1A]">
      {/* Container Card */}
      <div className="w-full max-w-md bg-[#FFFDF8] border-2 border-[#8FA89B] rounded-3xl shadow-xl overflow-hidden p-6 relative">
        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-6 flex border border-slate-200">
          <motion.div
            className="bg-[#8FA89B] h-full rounded-full"
            initial={{ width: '16.66%' }}
            animate={{ width: `${(step / 6) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="min-h-[340px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {/* Step 1: Welcome */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-4 text-center py-4"
              >
                <div className="mx-auto flex justify-center">
                  <Mascot mood="happy" size={120} showBubble={false} />
                </div>
                <div className="space-y-2">
                  <h1 className="font-display font-black text-2xl text-[#E0A926] tracking-tight leading-tight">
                    Welcome to Avelyn!
                  </h1>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                    Your companion bird wellness journey begins here. Let's configure your custom flock profile to tailor checklists, recommendations, and preparedness scores.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 2: Bird Type */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-4"
              >
                <div className="text-center space-y-1">
                  <h1 className="font-display font-black text-lg text-slate-800">
                    What birds do you own?
                  </h1>
                  <p className="text-xs text-slate-400">
                    Select all that apply.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto pr-1">
                  {birdOptions.map((opt) => {
                    const isSelected = selectedBirds.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        onClick={() => toggleBirdSelected(opt.id)}
                        className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'border-[#8FA89B] bg-[#8FA89B]/10 font-bold'
                            : 'border-slate-100 bg-[#FFFDF8] hover:border-[#8FA89B]/55'
                        }`}
                      >
                        <span className="text-xl">{opt.emoji}</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-700">{opt.name}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 3: Number of Birds */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-6 py-4"
              >
                <div className="text-center space-y-1">
                  <h1 className="font-display font-black text-lg text-slate-800">
                    Number of Birds
                  </h1>
                  <p className="text-xs text-slate-400">
                    How many feathered friends are in your flock?
                  </p>
                </div>

                <div className="flex items-center justify-center gap-6 max-w-xs mx-auto">
                  <button
                    onClick={() => setBirdCount(Math.max(1, birdCount - 1))}
                    className="w-12 h-12 rounded-full border-2 border-slate-200 hover:border-[#8FA89B] flex items-center justify-center font-bold text-lg text-slate-600 bg-white shadow-sm transition-all"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-3xl font-display font-black text-[#E0A926] w-16 text-center">
                    {birdCount}
                  </span>
                  <button
                    onClick={() => setBirdCount(birdCount + 1)}
                    className="w-12 h-12 rounded-full border-2 border-slate-200 hover:border-[#8FA89B] flex items-center justify-center font-bold text-lg text-slate-600 bg-white shadow-sm transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Experience Level */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-4"
              >
                <div className="text-center space-y-1">
                  <h1 className="font-display font-black text-lg text-slate-800">
                    Experience Level
                  </h1>
                  <p className="text-xs text-slate-400">
                    Select your current bird-keeping experience level.
                  </p>
                </div>

                <div className="flex flex-col gap-2.5 max-w-sm mx-auto">
                  {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => {
                    const isSelected = experience === lvl;
                    return (
                      <button
                        key={lvl}
                        onClick={() => setExperience(lvl as any)}
                        className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex justify-between items-center ${
                          isSelected
                            ? 'border-[#8FA89B] bg-[#8FA89B]/10 font-bold'
                            : 'border-slate-150 bg-[#FFFDF8] hover:border-[#8FA89B]/50'
                        }`}
                      >
                        <div>
                          <h4 className="font-display font-bold text-xs text-slate-800">{lvl}</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {lvl === 'Beginner' && 'Learning core nutrition & safety.'}
                            {lvl === 'Intermediate' && 'Expanding on routines & flight training.'}
                            {lvl === 'Advanced' && 'Focused on detailed health & breeding support.'}
                          </p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'bg-[#8FA89B] border-[#8FA89B] text-white' : 'border-slate-300'
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 5: Goals */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-4"
              >
                <div className="text-center space-y-1">
                  <h1 className="font-display font-black text-lg text-slate-800">
                    Goals Selection
                  </h1>
                  <p className="text-xs text-slate-400">
                    What are your main wellness focuses?
                  </p>
                </div>

                <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
                  {goalOptions.map((opt) => {
                    const isSelected = selectedGoals.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        onClick={() => toggleGoal(opt.id)}
                        className={`p-3 rounded-2xl border-2 text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#8FA89B] bg-[#8FA89B]/10'
                            : 'border-slate-150 bg-[#FFFDF8] hover:border-[#8FA89B]/50'
                        }`}
                      >
                        <div>
                          <h4 className="font-display font-bold text-xs text-slate-800">{opt.label}</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">{opt.desc}</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'bg-[#8FA89B] border-[#8FA89B] text-white' : 'border-slate-300'
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 6: Referral & Final Confirmation */}
            {step === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-4 text-center"
              >
                <div className="space-y-1">
                  <h1 className="font-display font-black text-lg text-slate-800">
                    Finalize Flock Setup
                  </h1>
                  <p className="text-xs text-slate-450 leading-relaxed max-w-xs mx-auto">
                    Your flock profile is configured. Have a referral code to claim seed discount credits?
                  </p>
                </div>

                {/* Referral Input Box */}
                <div className="bg-[#FAF8F5] border border-slate-200 rounded-2xl p-3 space-y-2 max-w-sm mx-auto">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={referralInput}
                      onChange={(e) => setReferralInput(e.target.value)}
                      placeholder="REF-XXXXXX"
                      className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#8FA89B] font-mono uppercase bg-white"
                      disabled={referralMessage?.type === 'success' || applyingReferral}
                    />
                    <button
                      onClick={handleApplyCode}
                      disabled={!referralInput.trim() || referralMessage?.type === 'success' || applyingReferral}
                      className="bg-[#8FA89B] hover:bg-[#8FA89B]/90 disabled:opacity-50 text-white text-[10px] font-bold px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer"
                    >
                      {applyingReferral ? 'Applying...' : 'Apply'}
                    </button>
                  </div>
                  {referralMessage && (
                    <p className={`text-[10px] font-bold text-left ${
                      referralMessage.type === 'success' ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {referralMessage.text}
                    </p>
                  )}
                </div>

                {/* Client IDs info */}
                <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto text-xs text-left">
                  <div className="bg-[#FAF8F5] border border-slate-200/60 p-2.5 rounded-xl">
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">Your Client ID</span>
                    <span className="font-mono font-bold text-slate-700 block mt-0.5">{clientId}</span>
                  </div>
                  <div className="bg-[#FAF8F5] border border-slate-200/60 p-2.5 rounded-xl">
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">Your Referral Code</span>
                    <span className="font-mono font-bold text-[#8FA89B] block mt-0.5">{referralCode}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action buttons */}
          <div className="flex items-center justify-between mt-6 pt-3 border-t border-slate-100">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-1 py-1.5 px-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={handleNext}
              disabled={step === 2 && selectedBirds.length === 0}
              className={`flex items-center gap-1.5 py-1.5 px-4 rounded-xl font-display font-black text-xs shadow-xs cursor-pointer transition-all ${
                step === 2 && selectedBirds.length === 0
                  ? 'bg-slate-100 text-slate-450 border border-slate-200 cursor-not-allowed shadow-none'
                  : 'bg-[#8FA89B] border border-[#8FA89B]/80 hover:bg-[#8FA89B]/90 text-white'
              }`}
              id="onboarding-next-btn"
            >
              {step === 6 ? 'Start Journey' : 'Continue'}
              {step < 6 ? <ArrowRight className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
