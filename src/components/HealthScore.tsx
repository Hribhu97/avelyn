import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Info, ChevronDown, ChevronUp, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';
import { HealthObservationsState } from '../types';

interface HealthScoreProps {
  score: number;
  completedTasksCount: number;
  totalTasksCount: number;
  completedLessonsCount: number;
  streak: number;
  profileCompletePercent?: number;
  emergencyKitSetup?: boolean;
  onToggleEmergencyKit?: () => void;
  healthObservations?: HealthObservationsState;
  dailyCareLogs?: {
    waterChanged: boolean;
    cageCleaned: boolean;
    foodProvided: boolean;
    exerciseCompleted: boolean;
    observationDone: boolean;
  };
}

export default function HealthScore({
  score,
  completedTasksCount,
  totalTasksCount,
  completedLessonsCount,
  streak,
  profileCompletePercent = 80,
  emergencyKitSetup = false,
  onToggleEmergencyKit,
  healthObservations,
  dailyCareLogs
}: HealthScoreProps) {
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);

  // SVG arc calculation parameters
  const size = 160;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = () => {
    if (score <= 40) return '#EF4444'; // Red (Critical Attention)
    if (score <= 60) return '#F59E0B'; // Amber (Needs Improvement)
    if (score <= 80) return '#3B82F6'; // Blue (Healthy)
    return '#10B981'; // Emerald Green (Excellent)
  };

  const getStatusDetails = () => {
    if (score <= 40) {
      return { 
        title: 'Critical Attention', 
        desc: 'Urgent care required. Multiple checklist tasks are missing or physical anomalies are flagged.',
        bg: 'bg-rose-50 border-rose-100 text-rose-700'
      };
    }
    if (score <= 60) {
      return { 
        title: 'Needs Improvement', 
        desc: 'Flock care metrics are lagging. Increase checklist completions and complete lessons to stabilize BHS.',
        bg: 'bg-amber-50 border-amber-100 text-amber-700'
      };
    }
    if (score <= 80) {
      return { 
        title: 'Healthy', 
        desc: 'Flock is in a good, stable condition. Complete remaining checklists to achieve peak excellence.',
        bg: 'bg-blue-50 border-blue-100 text-blue-700'
      };
    }
    return { 
      title: 'Excellent', 
      desc: 'Elite status! Perfect daily care combined with superior education, streaks, and preparedness.',
      bg: 'bg-emerald-50 border-emerald-100 text-emerald-700'
    };
  };

  const status = getStatusDetails();

  // If score is 0 and no activities have been checked, show the missing score prompt
  const isScoreMissing = score === 0 && completedTasksCount === 0 && (!dailyCareLogs || Object.values(dailyCareLogs).every(v => !v));

  if (isScoreMissing) {
    return (
      <div className="bg-white border-2 border-slate-100 rounded-2xl p-4 shadow-sm text-center space-y-3" id="health-score-gauge-card">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <HelpCircle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-display font-black text-sm text-slate-700">No Health Score Generated</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1 leading-relaxed">
            Complete your care activities to generate a score.
          </p>
        </div>
      </div>
    );
  }

  // Calculate detailed points
  const logs = dailyCareLogs || {
    waterChanged: completedTasksCount > 0,
    cageCleaned: completedTasksCount > 1,
    foodProvided: completedTasksCount > 2,
    exerciseCompleted: completedTasksCount > 3,
    observationDone: !!healthObservations
  };

  const dailyCareSubtotal = 
    (logs.waterChanged ? 14 : 0) +
    (logs.cageCleaned ? 14 : 0) +
    (logs.foodProvided ? 14 : 0) +
    (logs.exerciseCompleted ? 14 : 0) +
    (logs.observationDone ? 14 : 0);

  const preparednessSubtotal = 
    Math.min(7.5, completedLessonsCount * 2.5) +
    Math.min(7.5, streak * 1.5) +
    Math.min(7.5, (profileCompletePercent * 0.075)) +
    (emergencyKitSetup ? 7.5 : 0);

  return (
    <div className="bg-white border-2 border-slate-100 rounded-xl p-3 shadow-xs space-y-3" id="health-score-gauge-card">
      <div className="flex flex-col md:flex-row gap-3 items-center">
        {/* Gauge Visual */}
        <div className="relative shrink-0 select-none">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Track Circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#F8FAFC"
              strokeWidth={strokeWidth}
            />
            {/* Filled Arc Circle */}
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={getScoreColor()}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ type: 'spring', damping: 22, stiffness: 55 }}
              strokeLinecap="round"
            />
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              key={score}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-display font-black text-slate-800"
            >
              {score}
            </motion.span>
            <span className="text-[10px] font-mono tracking-wider text-slate-400 font-black uppercase mt-0.5">
              Avian BHS
            </span>
          </div>
        </div>

        {/* Metrics details */}
        <div className="flex-1 space-y-2.5 w-full">
          <div className={`p-2.5 rounded-xl border flex flex-col gap-1 ${status.bg}`}>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
              <h3 className="font-display font-black text-xs uppercase tracking-wider">
                Status: {status.title}
              </h3>
            </div>
            <p className="text-[11px] leading-relaxed font-sans">{status.desc}</p>
          </div>

          {/* Stat Rows */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#FFFDF8] border border-slate-100 rounded-xl p-2.5 flex flex-col justify-between">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                Daily Care Index
              </span>
              <span className="text-sm font-display font-bold text-slate-700 mt-1">
                {dailyCareSubtotal} / 70 Points
              </span>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-sky-500 h-full rounded-full"
                  style={{ width: `${(dailyCareSubtotal / 70) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-[#FFFDF8] border border-slate-100 rounded-xl p-2.5 flex flex-col justify-between">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                Preparedness Index
              </span>
              <span className="font-display font-bold text-slate-700 text-sm mt-1">
                {Math.round(preparednessSubtotal)} / 30 Points
              </span>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${(preparednessSubtotal / 30) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion For Detailed Formula Algorithm Breakdown */}
      <div className="border border-slate-100 rounded-xl bg-slate-50 p-2">
        <button
          onClick={() => setShowFormulaDetails(!showFormulaDetails)}
          className="w-full flex items-center justify-between text-xs font-bold text-slate-600 outline-none cursor-pointer"
          id="toggle-formula-details-btn"
        >
          <span className="flex items-center gap-1.5">
            <Info className="w-4 h-4 text-sky-500" />
            Check BHS Engine Formula
          </span>
          {showFormulaDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 animate-bounce" />}
        </button>

        <AnimatePresence>
          {showFormulaDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-2.5 space-y-3 text-xs text-slate-500 border-t border-slate-200/60 mt-2 font-sans">
                <p className="leading-relaxed">
                  The **Avelyn BHS Engine** dynamically calculates wellness scores based on **70% Daily Care** and **30% Preparedness**:
                </p>

                {/* Daily care breakdown */}
                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    1. Daily Care Checks (70 Pts Max)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-mono text-[10px]">
                    <div className="flex items-center justify-between p-1 bg-white border border-slate-100 rounded">
                      <span>Water changed:</span>
                      <span className={logs.waterChanged ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                        {logs.waterChanged ? '+14 pts' : '0 pts'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-1 bg-white border border-slate-100 rounded">
                      <span>Cage cleaned:</span>
                      <span className={logs.cageCleaned ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                        {logs.cageCleaned ? '+14 pts' : '0 pts'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-1 bg-white border border-slate-100 rounded">
                      <span>Food provided:</span>
                      <span className={logs.foodProvided ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                        {logs.foodProvided ? '+14 pts' : '0 pts'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-1 bg-white border border-slate-100 rounded">
                      <span>Exercise done:</span>
                      <span className={logs.exerciseCompleted ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                        {logs.exerciseCompleted ? '+14 pts' : '0 pts'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-1 bg-white border border-slate-100 rounded sm:col-span-2">
                      <span>Observation logged:</span>
                      <span className={logs.observationDone ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                        {logs.observationDone ? '+14 pts' : '0 pts'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Preparedness breakdown */}
                <div className="space-y-1.5 pt-1">
                  <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    2. Preparedness Factors (30 Pts Max)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-mono text-[10px]">
                    <div className="flex items-center justify-between p-1 bg-white border border-slate-100 rounded">
                      <span>Lessons ({completedLessonsCount}):</span>
                      <span className="text-emerald-600 font-bold">
                        +{Math.min(7.5, completedLessonsCount * 2.5)} pts
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-1 bg-white border border-slate-100 rounded">
                      <span>Streak ({streak}d):</span>
                      <span className="text-emerald-600 font-bold">
                        +{Math.min(7.5, streak * 1.5)} pts
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-1 bg-white border border-slate-100 rounded">
                      <span>Profile Completeness:</span>
                      <span className="text-emerald-600 font-bold">
                        +{Math.min(7.5, profileCompletePercent * 0.075)} pts
                      </span>
                    </div>
                    
                    {/* Interactive Emergency Kit toggle */}
                    <button
                      onClick={onToggleEmergencyKit}
                      type="button"
                      className="flex items-center justify-between p-1 bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100 rounded text-left cursor-pointer transition-colors"
                    >
                      <span className="underline">Emergency Kit Setup:</span>
                      <span className={emergencyKitSetup ? 'text-emerald-600 font-black' : 'text-slate-400'}>
                        {emergencyKitSetup ? '+7.5 pts' : 'Click to Set'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
