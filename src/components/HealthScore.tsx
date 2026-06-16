import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Info, Sparkles, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { HealthObservationsState } from '../types';

interface HealthScoreProps {
  score: number;
  completedTasksCount: number;
  totalTasksCount: number;
  completedLessonsCount: number;
  streak: number;
  healthObservations?: HealthObservationsState;
}

export default function HealthScore({
  score,
  completedTasksCount,
  totalTasksCount,
  completedLessonsCount,
  streak,
  healthObservations,
}: HealthScoreProps) {
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);

  // SVG arc calculation parameters
  const size = 160;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = () => {
    if (score < 45) return '#EF4444'; // Red
    if (score < 75) return '#F59E0B'; // Amber
    return '#10B981'; // Emerald Green
  };

  const getHealthyLabel = () => {
    if (score < 45) return { title: 'Critical Attention', desc: 'Symptom alarms active or significant care checks skipped.' };
    if (score < 75) return { title: 'Fair Status', desc: 'Doing fine, but look closer at active habits or clinical checks.' };
    return { title: 'Elite Peak Health', desc: 'Perfect companion nutrition, education, & physical logs matched!' };
  };

  // Mathematical breakdown calculations for transparency
  const rawHabitPoints = Math.round((completedTasksCount / (totalTasksCount || 1)) * 30);
  const rawEduPoints = Math.min(30, completedLessonsCount * 10);
  const basePoints = 40;
  const isAllTasksCompleted = totalTasksCount > 0 && completedTasksCount === totalTasksCount;

  let activeDeductions = 0;
  if (healthObservations) {
    if (healthObservations.droppings === 'abnormal') activeDeductions += 15;
    if (healthObservations.energy === 'lethargic') activeDeductions += 15;
    if (healthObservations.appetite === 'poor') activeDeductions += 10;
    if (healthObservations.vocal === 'silent') activeDeductions += 5;
  }

  const calculatedBaseTotal = isAllTasksCompleted ? 100 : (basePoints + rawHabitPoints + rawEduPoints);

  return (
    <div className="bg-white border-2 border-slate-100 rounded-xl p-2 shadow-xs space-y-2" id="health-score-gauge-card">
      <div className="flex flex-col md:flex-row gap-2 items-center">
        {/* Gauge Visual */}
        <div className="relative shrink-0">
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
              className="text-4xl font-display font-bold text-slate-800"
            >
              {score}
            </motion.span>
            <span className="text-[10px] font-mono tracking-wider text-slate-400 font-bold uppercase mt-0.5">
              Avian BHS
            </span>
          </div>
        </div>

        {/* Metrics breakdown details */}
        <div className="flex-1 space-y-2 w-full">
          <div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-emerald-500 stroke-[2.5]" />
              <h3 className="font-display font-bold text-sm text-slate-800">
                {getHealthyLabel().title}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{getHealthyLabel().desc}</p>
          </div>

          {/* Stat Rows */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="bg-[#FFFDF8] border border-slate-100 rounded-xl p-2 flex flex-col justify-between">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                Care Habit Index
              </span>
              <span className="text-md font-display font-bold text-slate-700 mt-1">
                {completedTasksCount}/{totalTasksCount} Checked
              </span>
              {/* Progress bar in-card */}
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full"
                  style={{ width: `${(completedTasksCount / (totalTasksCount || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-[#FFFDF8] border border-slate-100 rounded-xl p-2 flex flex-col justify-between">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                Preparedness Index
              </span>
              <span className="font-display font-bold text-slate-700 text-md mt-1">
                {completedLessonsCount} Lessons Completed
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wide font-mono mt-2 block">
                {isAllTasksCompleted ? 'Bonus Tracked' : `+${completedLessonsCount * 10} Score Points`}
              </span>
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
            <Info className="w-4 h-4 text-emerald-500" />
            How is my flock health score calculated?
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
              <div className="pt-2 space-y-2 text-xs text-slate-500 border-t border-slate-200/60 mt-2 font-sans">
                <p className="leading-relaxed">
                  The **Avelyn Avian BHS (Bird Health Score)** utilizes a high-precision, multi-layered clinical formula combining ongoing habit tracking, owner education, and active physical symptom monitoring:
                </p>

                <div className="bg-white border border-slate-200/60 rounded-xl p-2 space-y-2 font-mono text-[11px]">
                  {isAllTasksCompleted ? (
                    <div className="flex justify-between border-b border-dashed border-emerald-100 pb-1 text-emerald-600 font-bold">
                      <span>Daily Habit Logging (100% complete):</span>
                      <span>100 pts (Fair status full override)</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between border-b border-dashed border-slate-100 pb-1">
                        <span>Base Score Capacity (Baseline Care Margin):</span>
                        <span className="text-slate-800 font-bold">40 pts</span>
                      </div>
                      <div className="flex justify-between border-b border-dashed border-slate-100 pb-1">
                        <span>Active Habits (({completedTasksCount}/{totalTasksCount}) * 30):</span>
                        <span className="text-slate-800 font-bold">+{rawHabitPoints} pts / 30 max</span>
                      </div>
                      <div className="flex justify-between border-b border-dashed border-slate-100 pb-1">
                        <span>Education Preparedness Index ({completedLessonsCount} modules * 10):</span>
                        <span className="text-slate-800 font-bold">+{rawEduPoints} pts / 30 max</span>
                      </div>
                    </>
                  )}

                  {activeDeductions > 0 ? (
                    <div className="flex justify-between text-rose-600 border-b border-dashed border-rose-100 pb-1 font-bold">
                      <span>Clinical Alarm Deductions (Symptom Alerts):</span>
                      <span>-{activeDeductions} pts</span>
                    </div>
                  ) : (
                    <div className="flex justify-between text-emerald-600 border-b border-dashed border-slate-100 pb-1">
                      <span>Clinical Alarm Deductions (Perfect health):</span>
                      <span>0 pts</span>
                    </div>
                  )}

                  {streak === 0 && (
                    <div className="flex justify-between text-orange-600 font-bold pt-1">
                      <span>⚠️ Care Delay Modifier (Streak inactive):</span>
                      <span>-50% rating penalty</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-800 font-bold border-t border-slate-200 pt-2 text-[12px]">
                    <span>Computed BHS Aggregate Index:</span>
                    <span className="text-emerald-600 font-black">{score} / 100</span>
                  </div>
                </div>

                <div className="space-y-1 text-[11px] leading-relaxed">
                  <h4 className="font-bold text-slate-700">Clinical Symptom Weights Applied:</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>💩 **Abnormal digestion or liquid droppings**: <span className="text-rose-600 font-bold">-15 pts</span></li>
                    <li>🔋 **Lethargy, continuous fluffing, listlessness**: <span className="text-rose-600 font-bold">-15 pts</span></li>
                    <li>🍎 **Appetite drop or rejection of fresh pellet/chop**: <span className="text-rose-600 font-bold">-10 pts</span></li>
                    <li>🗣️ **Unusual silent withdrawal / no vocals**: <span className="text-rose-600 font-bold">-5 pts</span></li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
