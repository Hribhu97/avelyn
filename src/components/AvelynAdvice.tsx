import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, AlertTriangle, Droplet, Apple, Users, Wind, Activity, Heart, HelpCircle, X } from 'lucide-react';
import { UserState, DailyTask } from '../types';

interface AvelynAdviceProps {
  score: number;
  session: UserState;
  onClose?: () => void;
}

export default function AvelynAdvice({ score, session, onClose }: AvelynAdviceProps) {
  const [visible, setVisible] = useState(true);

  // Analyze lagging dimensions
  const getAdviceData = () => {
    const list: { title: string; desc: string; icon: any; color: string; bg: string; action: string }[] = [];

    const tasks = session.tasks || [];
    const observations = session.healthObservations;

    // Check Hydration Task
    const waterTask = tasks.find(t => t.id === 'task-water');
    if (waterTask && !waterTask.done) {
      list.push({
        title: 'Dehydration Threat 💧',
        desc: "Drinking water hasn't been logged yet. Consistent hydration regulates crop health and avoids kidney stress.",
        icon: Droplet,
        color: 'text-sky-500 border-sky-200',
        bg: 'bg-sky-50/70',
        action: 'Locate water cup and serve fresh, clean water immediately.'
      });
    }

    // Check Nutrition Task & Appetite
    const foodTask = tasks.find(t => t.id === 'task-pellets');
    const poorAppetite = observations?.appetite === 'poor';
    if ((foodTask && !foodTask.done) || poorAppetite) {
      list.push({
        title: 'Nutritional Rejection 🥦',
        desc: poorAppetite 
          ? "Appetite is currently flagged as poor. Rejection of pellets/veg-chop suggests low comfort or underlying gut stasis."
          : "Fresh pellet & chop feeding is pending. Standard seed-only diets fail to supply crucial Vitamin A.",
        icon: Apple,
        color: 'text-emerald-500 border-emerald-200',
        bg: 'bg-emerald-50/70',
        action: 'Introduce warm steamed sweet potato or a pinch of millet to encourage digestive action.'
      });
    }

    // Check Flight Task & Energy
    const flightTask = tasks.find(t => t.id === 'task-flight');
    const lethargic = observations?.energy === 'lethargic';
    if ((flightTask && !flightTask.done) || lethargic) {
      list.push({
        title: 'Sedentary Flight Stagnation ✈️',
        desc: lethargic
          ? "Lethargy and puffed feathers are classic signs of a sick bird conserving basic body temperature."
          : "Avelyn requires active foraging or flight time. Under-exercised wings lead to companion obesity.",
        icon: Wind,
        color: 'text-indigo-500 border-indigo-200',
        bg: 'bg-indigo-50/70',
        action: lethargic 
          ? 'Secure temporary warmth (around 80°F/27°C) and restrict flight space to avoid crash risks.'
          : 'Scatter some pellets on clean paper to start a physical foraging exercise.'
      });
    }

    // Check Social Interaction & Vocals
    const socialTask = tasks.find(t => t.id === 'task-social');
    const silent = observations?.vocal === 'silent';
    if ((socialTask && !socialTask.done) || silent) {
      list.push({
        title: 'Vocal Rest & Social Isolation ❤️',
        desc: silent
          ? "Sudden silence is a defensive reaction. Unusually silent birds are often masking pain."
          : "Active flock bonding is pending. Social isolation triggers severe behavioral feather plucking.",
        icon: Users,
        color: 'text-pink-500 border-pink-200',
        bg: 'bg-pink-50/70',
        action: 'Play soothing background whistle music or soft parrot chatter sounds to stimulate trust.'
      });
    }

    // Check Physical Digestion
    if (observations?.droppings === 'abnormal') {
      list.push({
        title: 'Clinical Digestive Alert 💩',
        desc: "Liquid or discolored droppings signal a breakdown of the intestinal microbiome, or heavy stress.",
        icon: Activity,
        color: 'text-amber-500 border-amber-200',
        bg: 'bg-amber-50/70',
        action: 'Remove fruits entirely (excess sugar) and audit current cage toys for toxic metal wire chewing.'
      });
    }

    // Default general advice if the score is low but tasks/observations seem fine (e.g. general streak penalty)
    if (list.length === 0) {
      list.push({
        title: 'Unbalanced Care Routine 📋',
        desc: "Your overall care index is under-performing. Consistency builds flock immunity.",
        icon: Sparkles,
        color: 'text-teal-500 border-teal-200',
        bg: 'bg-teal-50/70',
        action: 'Complete at least two pending care checklist items to restore baseline health metrics.'
      });
    }

    return list;
  };

  if (score >= 60 || !visible) return null;

  const laggingPoints = getAdviceData();
  // Pick the primary lagging area
  const primaryLag = laggingPoints[0];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white border-2 border-red-100 rounded-xl shadow-md p-2 space-y-2 relative"
        id="avelyn-advice-popup"
      >
        {/* Header - exactly 8px margins/padding spacing */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-red-50 border border-red-200 rounded-lg text-red-500">
              <AlertTriangle className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-red-600 block leading-none">
                💡 Avelyn Advice
              </span>
              <h4 className="font-display font-extrabold text-sm text-slate-800 tracking-tight mt-1">
                Failing Care Score Alert ({score}/100)
              </h4>
            </div>
          </div>
          <button
            onClick={() => {
              setVisible(false);
              if (onClose) onClose();
            }}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            id="close-advice-btn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Short advice text */}
        <p className="text-[12px] text-slate-500 leading-relaxed font-sans">
          Oh no! Your bird wellness metrics have dropped below the safe threshold of 60 BHS.
          Based on today's logs, Avelyn detected the following critical lag:
        </p>

        {/* Primary Lagging Insight Card - structured with exactly 8px (p-2 / space-y-2) margins */}
        <div className={`${primaryLag.bg} border border-dashed border-slate-200/90 rounded-xl p-2 space-y-2`}>
          <div className="flex items-center gap-1.5">
            <primaryLag.icon className={`w-4 h-4 ${primaryLag.color.split(' ')[0]}`} />
            <h5 className="text-xs font-black text-slate-800">{primaryLag.title}</h5>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
            {primaryLag.desc}
          </p>
          <div className="bg-white/80 p-2 rounded-lg border border-slate-100/60 mt-1">
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block font-mono">
              🩺 Actionable Remedy
            </span>
            <p className="text-[10px] text-slate-700 font-medium leading-relaxed mt-0.5">
              {primaryLag.action}
            </p>
          </div>
        </div>

        {/* Other warning badges if multiple */}
        {laggingPoints.length > 1 && (
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              Other lagging points:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {laggingPoints.slice(1).map((lag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-semibold text-slate-600 flex items-center gap-1"
                >
                  <lag.icon className="w-3 h-3 text-slate-400" /> {lag.title.split(' ')[0]}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-slate-100 pt-2 flex items-center justify-between gap-2">
          <span className="text-[10px] font-medium text-slate-400">
            Fix these items to repair your daily rating.
          </span>
          <button
            onClick={() => setVisible(false)}
            className="text-[10px] bg-slate-800 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-slate-900 transition-colors"
          >
            I'm On It!
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
