import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MASCOT_PRESETS } from '../types';
import { ChevronRight, ChevronLeft, X, Sparkles, Flame, GraduationCap, Coins, MessageSquare, Heart, MessageCircle } from 'lucide-react';
import Mascot from './Mascot';

interface OnboardingTourProps {
  activeMascotId: string;
  onComplete: () => void;
}

interface TourStep {
  title: string;
  content: string;
  icon: any;
  ctaText: string;
}

export default function OnboardingTour({ activeMascotId, onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const steps: TourStep[] = [
    {
      title: "Step 1/6 — Meet Your Companion",
      content: "Your journey starts here 🐣\n\nYour companion grows with every interaction. Feed, learn, and check in daily to help them thrive.\n\nYou'll unlock:\n• XP for progress\n• Seed Coins for rewards\n• Streaks for consistency\n• New learning content",
      icon: Sparkles,
      ctaText: "Next →"
    },
    {
      title: "Step 2/6 — Gain XP",
      content: "Earn XP & Level Up 🚀\n\nComplete daily care activities and learning lessons to earn XP.\n\nXP helps you:\n• Increase your companion's level\n• Unlock new rewards\n• Track your progress over time\n\n💡 The more consistently you care and learn, the faster you level up.",
      icon: GraduationCap,
      ctaText: "Next →"
    },
    {
      title: "Step 3/6 — Collect Seed Coins",
      content: "Earn & Spend Seed Coins 🌱\n\nSeed Coins are your in-app rewards.\n\nEarn coins by:\n• Completing daily tasks\n• Maintaining care streaks\n• Finishing learning lessons\n\nUse coins to:\n• Unlock special items\n• Personalize your companion\n• Access exclusive rewards",
      icon: Coins,
      ctaText: "Next →"
    },
    {
      title: "Step 4/6 — Track Your Companion's Mood",
      content: "How Is Your Companion Feeling? 😊\n\nYour companion's mood reflects how well you're caring for them.\n\nCheck mood indicators to see if they are:\n• Happy 😄\n• Excited 🤩\n• Sleepy 😴\n• Hungry 🍎\n• Needing attention 💛\n\nRegular care keeps your companion happy and healthy.",
      icon: Heart,
      ctaText: "Next →"
    },
    {
      title: "Step 5/6 — Build Your Care Streak",
      content: "Consistency Matters 🔥\n\nVisit daily and complete care activities to build your streak.\n\nWhy streaks matter:\n• Bonus XP\n• Extra Seed Coins\n• Faster companion growth\n• Achievement rewards\n\nMiss a day and your streak may reset.",
      icon: Flame,
      ctaText: "Next →"
    },
    {
      title: "Step 6/6 — Learn & Chat",
      content: "Your Learning Hub & AI Guide 📚✨\n\nLearning Path:\nFollow structured lessons designed to help you learn step-by-step.\n• Bite-sized lessons\n• Progress tracking\n• Unlockable content\n\nGemini AI Chatbot:\nNeed help? Ask Gemini anytime for:\n• Quick answers\n• Learning support\n• Personalized guidance\n• Companion care tips\n\nYour AI guide is always available when you're stuck.",
      icon: MessageCircle,
      ctaText: "Start My Journey →"
    }
  ];

  const step = steps[currentStep];
  const StepIcon = step.icon;

  // Typewriter effect using robust slice method
  useEffect(() => {
    let currentLength = 0;
    setIsTyping(true);
    setDisplayedText('');

    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    let audioCtx: any = null;
    try {
      if (AudioCtxClass) audioCtx = new AudioCtxClass();
    } catch (_) {}

    const interval = setInterval(() => {
      currentLength++;
      setDisplayedText(step.content.slice(0, currentLength));

      // Synthesize key click sound
      try {
        if (audioCtx && currentLength % 2 === 0) {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1200 + Math.random() * 250, audioCtx.currentTime);
          gain.gain.setValueAtTime(0.0015, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.015);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.02);
        }
      } catch (_) {}

      if (currentLength >= step.content.length) {
        clearInterval(interval);
        setIsTyping(false);
        if (audioCtx) {
          audioCtx.close().catch(() => {});
        }
      }
    }, 12); // Steady pace for reading

    return () => {
      clearInterval(interval);
      if (audioCtx) {
        audioCtx.close().catch(() => {});
      }
    };
  }, [currentStep]);

  const handleNext = () => {
    if (isTyping) {
      // Skip typewriter effect if clicked while typing
      setDisplayedText(step.content);
      setIsTyping(false);
      return;
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed bottom-16 right-4 z-40 max-w-sm w-[90vw] md:w-85 flex flex-col items-center">
        
        {/* Cartoon Speech Bubble floating above mascot */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          className="bg-white border-2 border-emerald-500 rounded-3xl p-4.5 shadow-2xl relative space-y-3 font-sans text-left w-full mb-3"
        >
          {/* Skip Button */}
          <button 
            onClick={onComplete}
            className="absolute top-3 right-3 text-slate-400 hover:text-slate-655 transition-colors p-1 rounded-full hover:bg-slate-50 cursor-pointer"
            title="Skip Tour"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Guide Header info */}
          <div className="flex items-center gap-2 pr-5 border-b border-slate-100 pb-2">
            <div className="p-1 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-600">
              <StepIcon className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-display font-black text-slate-800 text-[13px] leading-tight">
                {step.title}
              </h4>
            </div>
          </div>

          {/* Speech Text (Formatted with line breaks) */}
          <div className="min-h-[120px] max-h-[200px] overflow-y-auto pr-1">
            <p className="text-[11.5px] text-slate-655 leading-relaxed font-bold font-sans whitespace-pre-wrap">
              {displayedText}
              {isTyping && <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-emerald-500 animate-pulse" />}
            </p>
          </div>

          {/* Navigation Controls inside bubble */}
          <div className="flex justify-between items-center pt-2.5 border-t border-slate-100 text-xs">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`flex items-center gap-0.5 font-bold cursor-pointer transition-colors ${
                currentStep === 0 ? 'text-slate-300 pointer-events-none' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Back
            </button>

            <button
              onClick={handleNext}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl cursor-pointer shadow-xs flex items-center gap-0.5 transition-transform active:scale-95 text-[11px]"
            >
              {step.ctaText}
            </button>
          </div>

          {/* Bubble Pointer Arrow pointing down to Mascot head */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r-2 border-b-2 border-emerald-500 transform rotate-45 z-10" />
        </motion.div>

        {/* Mascot companion (floating right under the pointer arrow) */}
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 bg-white/90 border border-slate-100 rounded-2xl overflow-hidden p-0.5 shadow-md flex items-center justify-center shrink-0 z-20"
        >
          <Mascot 
            mood={isTyping ? 'excited' : currentStep === 3 ? 'concerned' : 'happy'}
            message=""
            activeMascot={activeMascotId}
            size={60}
            showBubble={false}
          />
        </motion.div>

      </div>
    </AnimatePresence>
  );
}
