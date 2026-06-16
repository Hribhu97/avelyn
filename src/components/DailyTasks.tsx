import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DailyTask } from '../types';
import { Check, Plus, Trash2, Droplets, Utensils, Heart, Sparkles, Navigation } from 'lucide-react';

interface DailyTasksProps {
  tasks: DailyTask[];
  onToggleTask: (id: string) => void;
  onAddTask: (label: string, category: 'hydration' | 'nutrition' | 'social' | 'exercise' | 'custom') => void;
  onDeleteTask: (id: string) => void;
  seedsAwarded: number;
}

export default function DailyTasks({
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  seedsAwarded,
}: DailyTasksProps) {
  const [newLabel, setNewLabel] = useState('');
  const [newCategory, setNewCategory] = useState<'hydration' | 'nutrition' | 'social' | 'exercise' | 'custom'>('custom');
  const [showAdder, setShowAdder] = useState(false);

  // Play synthesized web chirp
  const triggerChirpChirpSound = (isClosing: boolean = false) => {
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;
      const ctx = new AudioCtxClass();
      
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.type = 'sine';
      
      if (!isClosing) {
        // High pitched double chirp
        oscillator.frequency.setValueAtTime(900, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(1400, ctx.currentTime + 0.11);
        oscillator.frequency.exponentialRampToValueAtTime(2100, ctx.currentTime + 0.22);
        
        gainNode.gain.setValueAtTime(0.04, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.26);
      } else {
        // Lower tone click
        oscillator.frequency.setValueAtTime(320, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08);
        gainNode.gain.setValueAtTime(0.03, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.1);
      }
    } catch (e) {
      // Ignored
    }
  };

  const handleToggle = (id: string, currentlyDone: boolean) => {
    if (!currentlyDone) {
      triggerChirpChirpSound(false);
    } else {
      triggerChirpChirpSound(true);
    }
    onToggleTask(id);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;
    onAddTask(newLabel.trim(), newCategory);
    setNewLabel('');
    setShowAdder(false);
    triggerChirpChirpSound(false);
  };

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'hydration':
        return { bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-100', icon: <Droplets className="w-4 h-4" /> };
      case 'nutrition':
        return { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100', icon: <Utensils className="w-4 h-4" /> };
      case 'social':
        return { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-100', icon: <Heart className="w-4 h-4" /> };
      case 'exercise':
        return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', icon: <Navigation className="w-4 h-4" /> };
      case 'custom':
      default:
        return { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-100', icon: <Sparkles className="w-4 h-4" /> };
    }
  };

  return (
    <div className="bg-[#FFFDF8] border-2 border-slate-100 rounded-2xl p-2 shadow-xs space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-sm text-slate-800">
            Daily Habits Logging
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Earn seeds and level up. Avelyn feels happier as tasks are checked off.
          </p>
        </div>

        <button
          onClick={() => setShowAdder(!showAdder)}
          className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 p-1.5 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1 text-[11px] font-bold cursor-pointer"
          id="add-custom-task-trigger"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" /> Custom task
        </button>
      </div>

      {/* Task Creation Drawer Form */}
      <AnimatePresence>
        {showAdder && (
          <motion.form
            onSubmit={handleCreate}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-white border border-slate-200 rounded-xl p-2 space-y-2 shadow-inner"
          >
            <div className="space-y-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Task Label
                </label>
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g. Weigh kiwi, Clean cage bottom, Bath time"
                  className="w-full text-xs bg-[#FFFDF8] border-2 border-slate-200 rounded-lg px-3 py-1.5 focus:border-emerald-400 outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Category Style
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(['hydration', 'nutrition', 'social', 'exercise', 'custom'] as const).map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setNewCategory(cat)}
                      className={`py-1 px-1 rounded-lg text-[10px] font-semibold border-2 capitalize flex flex-col items-center gap-1 cursor-pointer transition-all ${
                        newCategory === cat
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-slate-100 bg-white text-slate-500'
                      }`}
                    >
                      {getCategoryTheme(cat).icon}
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAdder(false)}
                className="py-1 px-2.5 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-1 px-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg shadow-sm cursor-pointer"
              >
                Add Habit
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Checklist Grid */}
      <div className="space-y-2">
        {tasks.map((task) => {
          const theme = getCategoryTheme(task.category);
          return (
            <motion.div
              key={task.id}
              layout
              className={`flex items-center justify-between p-2 rounded-xl border-2 transition-all ${
                task.done
                  ? 'border-emerald-100 bg-emerald-50/20 opacity-80'
                  : 'border-slate-100 bg-white shadow-xs'
              }`}
            >
              <div className="flex items-center gap-2">
                {/* Checklist Bullet Container */}
                <button
                  onClick={() => handleToggle(task.id, task.done)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
                    task.done
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-slate-300 hover:border-emerald-400 bg-[#FFFDF8]'
                  }`}
                  id={`checkbox-${task.id}`}
                >
                  {task.done && <Check className="w-3 h-3 stroke-[3.5]" />}
                </button>

                {/* Task Label & Type */}
                <div>
                  <span
                    className={`text-xs font-semibold transition-all ${
                      task.done ? 'line-through text-slate-400' : 'text-slate-800'
                    }`}
                  >
                    {task.label}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase rounded-md px-1 py-0.5 ${theme.bg} ${theme.text}`}>
                      {theme.icon}
                      {task.category}
                    </span>
                    <span className="text-[9px] font-semibold text-amber-500">
                      +{task.xpReward} XP
                    </span>
                  </div>
                </div>
              </div>

              {/* Delete Custom Tasks */}
              {task.id.startsWith('custom-') ? (
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="text-slate-400 hover:text-rose-500 p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Remove task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span className="text-[10px] font-mono font-bold text-slate-300 mr-1.5">
                  Daily
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-8 text-slate-400 text-sm">
          No daily habits left! Feel free to add some above. 🦜
        </div>
      )}
    </div>
  );
}
