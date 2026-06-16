import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BirdType, FlockInfo } from '../types';
import Mascot from './Mascot';
import { Check, ArrowRight, ArrowLeft } from 'lucide-react';

interface OnboardingProps {
  onComplete: (flock: FlockInfo) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [selectedBirds, setSelectedBirds] = useState<BirdType[]>([]);
  const [birdCount, setBirdCount] = useState<number>(1);
  const [ageGroup, setAgeGroup] = useState<string>('young');
  const [experience, setExperience] = useState<'beginner' | 'experienced'>('beginner');
  const [focusAreas, setFocusAreas] = useState<string[]>([]);

  // Bird Options metadata
  const birdOptions = [
    {
      id: 'budgie' as BirdType,
      name: 'Budgie',
      color: 'bg-emerald-50 border-emerald-300 hover:bg-emerald-100',
      textColor: 'text-emerald-700',
      badgeColor: 'bg-emerald-500',
      // Dynamic Mini SVG budgie
      svg: (
        <svg viewBox="0 0 100 100" className="w-16 h-16">
          <circle cx="50" cy="50" r="40" fill="#E6EE9C" />
          <circle cx="50" cy="50" r="28" fill="#D4E157" />
          <path d="M42 42 C45 35, 55 35, 58 42" stroke="#1E293B" strokeWidth="3" fill="none" />
          <circle cx="40" cy="50" r="4.5" fill="#1E293B" />
          <circle cx="60" cy="50" r="4.5" fill="#1E293B" />
          <polygon points="46,55 54,55 50,70" fill="#FFB74D" stroke="#1E293B" strokeWidth="2" />
          <ellipse cx="34" cy="58" rx="5" ry="3" fill="#42A5F5" />
          <ellipse cx="66" cy="58" rx="5" ry="3" fill="#42A5F5" />
        </svg>
      ),
    },
    {
      id: 'lovebird' as BirdType,
      name: 'Lovebird',
      color: 'bg-orange-50 border-orange-300 hover:bg-orange-100',
      textColor: 'text-orange-700',
      badgeColor: 'bg-orange-500',
      svg: (
        <svg viewBox="0 0 100 100" className="w-16 h-16">
          <circle cx="50" cy="50" r="40" fill="#FFCC80" />
          <circle cx="50" cy="50" r="28" fill="#81C784" />
          <path d="M35 48 Q50 30 65 48" fill="#FF8A65" />
          <circle cx="40" cy="54" r="4.5" fill="#1E293B" />
          <circle cx="60" cy="54" r="4.5" fill="#1E293B" />
          <polygon points="46,58 54,58 50,72" fill="#E64A19" />
          <ellipse cx="35" cy="62" rx="4" ry="2.5" fill="#FF7043" />
          <ellipse cx="65" cy="62" rx="4" ry="2.5" fill="#FF7043" />
        </svg>
      ),
    },
    {
      id: 'cockatiel' as BirdType,
      name: 'Cockatiel',
      color: 'bg-yellow-50 border-yellow-300 hover:bg-yellow-100',
      textColor: 'text-yellow-700',
      badgeColor: 'bg-yellow-500',
      svg: (
        <svg viewBox="0 0 100 100" className="w-16 h-16">
          <circle cx="50" cy="50" r="40" fill="#ECEFF1" />
          {/* Yellow Cheek & Crest */}
          <path d="M48 24 Q30 5 45 10 Q50 18 52 24" fill="#FFD54A" stroke="#1E293B" strokeWidth="2" />
          <circle cx="50" cy="54" r="28" fill="#CFD8DC" />
          <circle cx="40" cy="54" r="4.5" fill="#1E293B" />
          <circle cx="60" cy="54" r="4.5" fill="#1E293B" />
          <polygon points="45,58 55,58 50,70" fill="#90A4AE" stroke="#1E293B" strokeWidth="2" />
          <ellipse cx="36" cy="62" rx="6" ry="5" fill="#FF7043" />
          <ellipse cx="64" cy="62" rx="6" ry="5" fill="#FF7043" />
        </svg>
      ),
    },
    {
      id: 'ringneck' as BirdType,
      name: 'Indian Ringneck',
      color: 'bg-teal-50 border-teal-300 hover:bg-teal-100',
      textColor: 'text-teal-700',
      badgeColor: 'bg-teal-500',
      svg: (
        <svg viewBox="0 0 100 100" className="w-16 h-16">
          <circle cx="50" cy="50" r="40" fill="#A7FFEB" />
          <circle cx="50" cy="50" r="28" fill="#26A69A" />
          {/* Black & pink neck collar */}
          <path d="M40 70 Q50 78 60 70" stroke="#1E293B" strokeWidth="4" fill="none" />
          <path d="M41 71 Q50 77 59 71" stroke="#FF8A80" strokeWidth="2.5" fill="none" />
          <circle cx="41" cy="52" r="4" fill="#1E293B" />
          <circle cx="59" cy="52" r="4" fill="#1E293B" />
          <path d="M44 56 Q50 48 56 56 Q50 72 44 56 Z" fill="#E53935" stroke="#1E293B" strokeWidth="2" />
          <ellipse cx="35" cy="59" rx="4" ry="2.5" fill="#FF8A65" />
          <ellipse cx="65" cy="59" rx="4" ry="2.5" fill="#FF8A65" />
        </svg>
      ),
    },
    {
      id: 'africangrey' as BirdType,
      name: 'African Grey',
      color: 'bg-slate-100 border-slate-300 hover:bg-slate-200',
      textColor: 'text-slate-800',
      badgeColor: 'bg-slate-500',
      svg: (
        <svg viewBox="0 0 100 100" className="w-16 h-16">
          <circle cx="50" cy="50" r="40" fill="#ECEFF1" />
          <circle cx="50" cy="50" r="28" fill="#78909C" />
          {/* Red feather accents */}
          <path d="M40 70 Q50 78 60 70" fill="#EF5350" />
          <circle cx="40" cy="52" r="4.5" fill="#1E293B" />
          <circle cx="59" cy="52" r="4.5" fill="#1E293B" />
          {/* Sharp grey beak */}
          <path d="M46 56 Q50 48 54 56 Q50 74 46 56 Z" fill="#37474F" stroke="#1E293B" strokeWidth="2" />
        </svg>
      ),
    },
    {
      id: 'macaw' as BirdType,
      name: 'Macaw',
      color: 'bg-red-50 border-red-300 hover:bg-red-100',
      textColor: 'text-red-700',
      badgeColor: 'bg-red-500',
      svg: (
        <svg viewBox="0 0 100 100" className="w-16 h-16">
          <circle cx="50" cy="50" r="40" fill="#FFCDD2" />
          {/* Splendid face colors */}
          <path d="M22 50 C25 22, 75 22, 78 50 C60 55, 40 55, 22 50 Z" fill="#EF5350" />
          <circle cx="50" cy="50" r="24" fill="#1E88E5" />
          <circle cx="42" cy="48" r="4.5" fill="#1E293B" />
          <circle cx="58" cy="48" r="4.5" fill="#1E293B" />
          {/* Giant Macaw Beak */}
          <path d="M45 54 Q50 44 55 54 Q50 75 45 54 Z" fill="#ECEFF1" stroke="#1E293B" strokeWidth="2" />
          <path d="M47 54 Q50 44 53 54 Q50 63 47 54 Z" fill="#263238" />
        </svg>
      ),
    },
    {
      id: 'other' as BirdType,
      name: 'Other Bird',
      color: 'bg-indigo-50 border-indigo-300 hover:bg-indigo-100',
      textColor: 'text-indigo-700',
      badgeColor: 'bg-indigo-500',
      svg: (
        <svg viewBox="0 0 100 100" className="w-16 h-16">
          <circle cx="50" cy="50" r="40" fill="#D1C4E9" />
          <circle cx="50" cy="50" r="28" fill="#9575CD" />
          <circle cx="41" cy="50" r="4" fill="#1E293B" />
          <circle cx="59" cy="50" r="4" fill="#1E293B" />
          <polygon points="46,55 54,55 50,66" fill="#F48FB1" stroke="#1E293B" strokeWidth="1.5" />
          <path d="M42 38 Q50 32 58 38" stroke="#1E293B" strokeWidth="2.5" fill="none" />
        </svg>
      ),
    },
  ];

  // Goals metadata
  const goalOptions = [
    { id: 'nutrition', label: 'Better nutrition', desc: 'Find perfect bird food seeds, pellets & chop recipes.' },
    { id: 'lifespan', label: 'Longer lifespan', desc: 'Establish clinical care habits that prevent illness.' },
    { id: 'breeding', label: 'Breeding support', desc: 'Expert guidance on nests, eggs, and chick rearing.' },
    { id: 'vet', label: 'Veterinary care', desc: 'Connect to avian vets and understand symptom red flags.' },
    { id: 'training', label: 'Training & Speech', desc: 'Unravel step-up training, target training, and flight.' },
    { id: 'happiness', label: 'Bird happiness', desc: 'Introduce bird-safe foraging toys, baths, and social play.' },
  ];

  const toggleBirdSelected = (id: BirdType) => {
    setSelectedBirds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleFocusArea = (id: string) => {
    setFocusAreas((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (step < 4) {
      setStep((p) => p + 1);
    } else {
      onComplete({
        birdTypes: selectedBirds.length ? selectedBirds : ['other'],
        count: birdCount,
        ageGroup,
        experienceLevel: experience,
        focusArea: focusAreas.length ? focusAreas : ['nutrition', 'happiness'],
      });
    }
  };

  const handleBack = () => {
    if (step > 1) setStep((p) => p - 1);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] flex flex-col items-center justify-center p-2 font-sans">
      {/* Container Card */}
      <div className="w-full max-w-md bg-white border-2 border-emerald-500 rounded-xl shadow-md overflow-hidden p-3 relative">
        {/* Onboarding Progress Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4 flex border border-slate-200">
          <motion.div
            className="bg-emerald-500 h-full rounded-full"
            initial={{ width: '25%' }}
            animate={{ width: `${step * 25}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Step Views */}
        <div className="min-h-[300px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-3"
              >
                <div className="text-center space-y-0.5">
                  <h1 className="font-display font-bold text-sm text-slate-800">
                    What birds do you have?
                  </h1>
                  <p className="text-[11px] text-slate-500">
                    Select all that apply. This helps Avelyn tailor lessons and recommendations.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-0.5">
                  {birdOptions.map((opt) => {
                    const isSelected = selectedBirds.includes(opt.id);
                    return (
                      <motion.button
                        key={opt.id}
                        onClick={() => toggleBirdSelected(opt.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex flex-col items-center p-2 rounded-xl border-2 transition-colors text-center cursor-pointer relative ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50/70 shadow-xs'
                            : 'border-slate-200 bg-[#FFFDF8]'
                        }`}
                        id={`bird-opt-${opt.id}`}
                      >
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-4.5 h-4.5 bg-emerald-500 text-white rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                        <div className="mb-1">{opt.svg}</div>
                        <span className="font-display font-semibold text-[11px] text-slate-700">
                          {opt.name}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-3"
              >
                <div className="text-center space-y-0.5">
                  <h1 className="font-display font-bold text-sm text-slate-800">
                    Tell us about your flock
                  </h1>
                  <p className="text-[11px] text-slate-500">
                    Knowing your flock details ensures highly specific product discovery.
                  </p>
                </div>

                <div className="space-y-3 max-w-sm mx-auto py-1">
                  {/* Option 1: Number of Birds */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      How many feathered friends are in your life?
                    </label>
                    <div className="flex items-center gap-2 bg-[#FFFDF8] border border-slate-200 rounded-xl p-1.5 justify-between">
                      <button
                        onClick={() => setBirdCount(Math.max(1, birdCount - 1))}
                        className="w-8 h-8 bg-white hover:bg-slate-100 rounded-lg font-bold flex items-center justify-center border border-slate-200 text-slate-700 text-sm"
                      >
                        -
                      </button>
                      <span className="text-sm font-display font-bold text-emerald-600">
                        {birdCount} {birdCount === 1 ? 'Bird' : 'Birds'}
                      </span>
                      <button
                        onClick={() => setBirdCount(birdCount + 1)}
                        className="w-8 h-8 bg-white hover:bg-slate-100 rounded-lg font-bold flex items-center justify-center border border-slate-200 text-slate-700 text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Option 2: Age Group */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      What is the general age group?
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { id: 'baby', label: 'Weaning' },
                        { id: 'young', label: 'Young' },
                        { id: 'mature', label: 'Mature' },
                        { id: 'senior', label: 'Senior' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setAgeGroup(item.id)}
                          className={`p-2 text-[10px] font-semibold rounded-lg border text-center transition-all ${
                            ageGroup === item.id
                              ? 'border-emerald-500 bg-emerald-55 text-emerald-800 font-bold'
                              : 'border-slate-200 bg-white text-slate-600'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Option 3: Parent Experience */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Your bird-keeping experience level:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setExperience('beginner')}
                        className={`p-2 rounded-lg border text-left transition-all ${
                          experience === 'beginner'
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-slate-200 bg-white'
                        }`}
                      >
                        <h4 className="font-bold text-xs text-slate-800">Beginner</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Filled with pure excitement!
                        </p>
                      </button>

                      <button
                        onClick={() => setExperience('experienced')}
                        className={`p-2 rounded-lg border text-left transition-all ${
                          experience === 'experienced'
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-slate-200 bg-white'
                        }`}
                      >
                        <h4 className="font-bold text-xs text-slate-800">Advanced</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Focused on specialized care.
                        </p>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-3"
              >
                <div className="text-center space-y-0.5">
                  <h1 className="font-display font-bold text-sm text-slate-800">
                    What matters most?
                  </h1>
                  <p className="text-[11px] text-slate-500">
                    Choose the topics you care most about. You earn bonus seed-points!
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2 max-h-[220px] overflow-y-auto pr-0.5">
                  {goalOptions.map((opt) => {
                    const isSelected = focusAreas.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        onClick={() => toggleFocusArea(opt.id)}
                        className={`p-2 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-slate-200 bg-[#FFFDF8]'
                        }`}
                      >
                        <div>
                          <h4 className="font-display font-semibold text-xs text-slate-800">
                            {opt.label}
                          </h4>
                          <p className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</p>
                        </div>
                        <div
                          className={`w-4.5 h-4.5 rounded-full flex items-center justify-center border ${
                            isSelected
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center space-y-3 py-2"
              >
                {/* Mascot Interactive Showcase */}
                <Mascot mood="excited" size={110} className="mb-2" showBubble={false} />

                <div className="text-center space-y-1 max-w-sm">
                  <h2 className="font-display font-bold text-sm text-slate-800 leading-tight">
                    Meet Avelyn
                  </h2>
                  <p className="font-display text-emerald-600 font-bold text-xs">
                    "Together we will keep your flock glowing."
                  </p>
                  <p className="text-[11px] text-slate-500 px-2 font-sans">
                    Join Avelyn daily. Earn XP points, unlock bird master badges, and discover veterinarian formulas curated specifically for your gorgeous flock.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-4 pt-2 border-t border-slate-100">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                id="onboarding-back-btn"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={handleNext}
              disabled={step === 1 && selectedBirds.length === 0}
              className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg font-display font-bold text-xs shadow-xs cursor-pointer transition-all ${
                step === 1 && selectedBirds.length === 0
                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none'
                  : 'bg-emerald-500 border border-emerald-600 hover:bg-emerald-600 text-white'
              }`}
              id="onboarding-next-btn"
            >
              {step === 4 ? 'Start Journey' : 'Continue'}{' '}
              {step < 4 ? <ArrowRight className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
