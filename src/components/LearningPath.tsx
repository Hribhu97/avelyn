import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lesson, QuizQuestion } from '../types';
import Mascot from './Mascot';
import { BookOpen, Award, CheckCircle2, Lock, ArrowRight, Star, Heart } from 'lucide-react';

interface LearningPathProps {
  completedLessonIds: string[];
  onCompleteLesson: (lessonId: string, xp: number, seeds: number) => void;
  xp: number;
}

// Creative realistic bird education lessons
const LESSONS_DATA: Lesson[] = [
  {
    id: 'nutr-1',
    title: 'The Base Diet: Seeds vs Pellets',
    category: 'nutrition',
    locked: false,
    description: 'Why a 100% seed diet leads to hepatic lipidosis, and how organic pellets support longevity.',
    xpReward: 50,
    completed: false,
    questions: [
      {
        question: 'Why is an exclusive all-seed diet harmful for companion birds in the long term?',
        options: [
          'Seeds are too expensive to source',
          'It is high in fat but deficient in critical Vitamin A, Calcium, and vital amino acids',
          'Seeds damage their beaks due to extreme shells',
          'Seeds make bird feathers turn purple'
        ],
        correctAnswerIndex: 1,
        triviaMessage: 'All-seed diets lead to fatty liver disease (hepatic lipidosis). High-quality pellets mixed with daily "chop" (fresh vegetables) is standard practice for elite welfare!'
      }
    ]
  },
  {
    id: 'nutr-2',
    title: 'The Power of Carrot & "Chirp Chop"',
    category: 'nutrition',
    locked: false, // will check programmatically
    description: 'Preparing Vitamin-A loaded fresh food chops including broccoli, carrots, and sweet potatoes.',
    xpReward: 60,
    completed: false,
    questions: [
      {
        question: 'Which nutrient is vital for companion bird immune strength, and easily sourced from red bell peppers and carrots?',
        options: [
          'Caffeine',
          'Sodium Chloride',
          'Vitamin A',
          'Lactoferrin'
        ],
        correctAnswerIndex: 2,
        triviaMessage: 'Vitamin A keeps their epithelial tissues healthy, preventing respiratory infections (the most common avian veterinary emergency!).'
      }
    ]
  },
  {
    id: 'health-1',
    title: 'Mask of the Wild: Fluffiness Alert',
    category: 'health',
    locked: false,
    description: 'Understanding prey instincts and how to quickly identify subtle illness signals before it is too late.',
    xpReward: 50,
    completed: false,
    questions: [
      {
        question: 'Why do companion birds mask their symptoms when feeling unwell or tired?',
        options: [
          'They do not like avian veterinarians',
          'It is an evolutionary prey instinct to avoid attracting predators in the wild',
          'They are practicing deep breathing exercises',
          'They want to conserve heat'
        ],
        correctAnswerIndex: 1,
        triviaMessage: 'In the wild, a visibly weak bird is an immediate target. If your bird is puffed up, sleeping on both feet on the cage bottom, or unusually silent, contact an avian vet immediately!'
      }
    ]
  },
  {
    id: 'behav-1',
    title: 'Beak Grinding vs Screeching',
    category: 'behavior',
    locked: false,
    description: 'Deciphering the secret vocabulary of bird clicks, purrs, content beak clicks, and loud flock calls.',
    xpReward: 50,
    completed: false,
    questions: [
      {
        question: 'What does soft, rhythm-based grinding of the beak just before sleeping usually indicate?',
        options: [
          'Extreme dental pain or cracked beak surface',
          'An aggressive territorial challenge to nearby humans',
          'Deep contentment, feeling safe, and winding down to sleep',
          'A call for attention or extra mating seeds'
        ],
        correctAnswerIndex: 2,
        triviaMessage: 'Beak grinding is a wonderful, soothing rustle that signifies perfect relaxation. It means your bird is completely ready for bed!'
      }
    ]
  },
  {
    id: 'train-1',
    title: 'Precision Target Stick Training',
    category: 'training',
    locked: false,
    description: 'How to use positive reinforcement and clickers to guide landing spots and step up naturally.',
    xpReward: 60,
    completed: false,
    questions: [
      {
        question: 'What is the golden rule of modern, humane target training for wild-winged species?',
        options: [
          'Throwing cage blankets on them to force compliance',
          'Using spray bottles when they fly away',
          'Using a stick to point, clicking on approach, and immediately rewarding with a millet spray seed',
          'Withholding fresh water until they perform the tricks'
        ],
        correctAnswerIndex: 2,
        triviaMessage: 'Positive reinforcement builds deep trust. Forcing step-ups via towel-grabbing damages bird parent attachment permanentely.'
      }
    ]
  },
  {
    id: 'emerg-1',
    title: 'Invisible Killers: Teflon & Avocado',
    category: 'emergency',
    locked: false,
    description: 'Securing the household against deadly toxic items: toxic non-stick cookware fumes, heavy metal toys, and lethal garden plants.',
    xpReward: 70,
    completed: false,
    questions: [
      {
        question: 'Which household kitchen utensil produces odorless fumes that can kill a bird in minutes if overheated?',
        options: [
          'Wooden spoons',
          'PTFE Teflon-coated non-stick pans',
          'Cast-iron skillets',
          'Microwave glass turntables'
        ],
        correctAnswerIndex: 1,
        triviaMessage: 'Overheated Teflon (PTFE) emits highly toxic gases that paralyze parrot air sacs and lungs. Always cook on bird-safe ceramic, stainless steel, or cast iron!'
      }
    ]
  }
];

export default function LearningPath({
  completedLessonIds,
  onCompleteLesson,
  xp,
}: LearningPathProps) {
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [selectedAns, setSelectedAns] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [passed, setPassed] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [celebrateXp, setCelebrateXp] = useState(0);

  const handleOpenLesson = (lesson: Lesson, index: number) => {
    // Determine lock programmatically: first lesson is free, others require prior lesson completed
    const isLocked = index > 0 && !completedLessonIds.includes(LESSONS_DATA[index - 1].id);
    if (isLocked) {
      alert(`🔒 Complete "${LESSONS_DATA[index - 1].title}" first to unlock this track!`);
      return;
    }
    setActiveLesson(lesson);
    setSelectedAns(null);
    setQuizSubmitted(false);
    setFeedbackMsg('');
  };

  const handleOptionSelect = (index: number) => {
    if (quizSubmitted) return;
    setSelectedAns(index);
  };

  const handleCheckAnswer = () => {
    if (!activeLesson || selectedAns === null) return;
    const currentQ = activeLesson.questions[0];
    const isCorrect = selectedAns === currentQ.correctAnswerIndex;
    setPassed(isCorrect);
    setQuizSubmitted(true);

    if (isCorrect) {
      setFeedbackMsg(`🏆 Fantastic job! Correct! ${currentQ.triviaMessage}`);
      setCelebrateXp(activeLesson.xpReward);
    } else {
      setFeedbackMsg(`💡 Almost! Don't worry, Avelyn is encouraging you. Try researching this and let's get it right next time! Quick Fact: ${currentQ.triviaMessage}`);
    }
  };

  const handleFinishLesson = () => {
    if (activeLesson) {
      if (passed && !completedLessonIds.includes(activeLesson.id)) {
        onCompleteLesson(activeLesson.id, activeLesson.xpReward, 15);
      }
      setActiveLesson(null);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'nutrition':
        return '🥕';
      case 'health':
        return '🩺';
      case 'behavior':
        return '🦜';
      case 'training':
        return '🎓';
      case 'emergency':
        return '🚨';
      default:
        return '📚';
    }
  };

  const getCategoryColor = (category: string, completed: boolean) => {
    if (completed) return 'bg-emerald-500 border-emerald-600 text-white';
    switch (category) {
      case 'nutrition':
        return 'bg-amber-400 border-amber-500 text-white';
      case 'health':
        return 'bg-rose-400 border-rose-500 text-white';
      case 'behavior':
        return 'bg-sky-400 border-sky-500 text-white';
      case 'training':
        return 'bg-violet-400 border-violet-500 text-white';
      case 'emergency':
        return 'bg-red-500 border-red-600 text-white';
      default:
        return 'bg-slate-400 border-slate-500 text-white';
    }
  };

  return (
    <div className="bg-[#FFFDF8] border-2 border-slate-100 rounded-xl p-2 shadow-xs relative min-h-[440px]">
      <div className="text-center max-w-sm mx-auto mb-4 space-y-1">
        <h2 className="font-display font-bold text-sm text-slate-800">
          Avelyn Care Learning Path
        </h2>
        <p className="text-[11px] text-slate-500">
          Crack professional micro-lessons, answer bird queries and cultivate expert habits. 
        </p>
      </div>

      {/* Zig-Zag Gamified Lesson Path */}
      <div className="flex flex-col items-center space-y-6 relative max-w-xs mx-auto pb-4">
        {/* Dynamic Connector lines running in the background */}
        <div className="absolute top-6 bottom-6 w-1 bg-slate-100 rounded-full left-1/2 -translate-x-1/2 -z-10" />

        {LESSONS_DATA.map((lesson, idx) => {
          const isCompleted = completedLessonIds.includes(lesson.id);
          const isPriorCompleted = idx === 0 || completedLessonIds.includes(LESSONS_DATA[idx - 1].id);
          const isLocked = !isCompleted && !isPriorCompleted;

          // Zig-zag offset styling
          const offsetStyle = idx % 3 === 1 ? 'translate-x-[30px]' : idx % 3 === 2 ? '-translate-x-[30px]' : 'translate-x-0';

          return (
            <div key={lesson.id} className={`flex flex-col items-center relative ${offsetStyle}`}>
              {/* Target lesson node */}
              <motion.button
                onClick={() => handleOpenLesson(lesson, idx)}
                whileHover={!isLocked ? { scale: 1.1, rotate: [0, -2, 2, 0] } : {}}
                className={`w-14 h-14 rounded-full border-2 shadow-md flex items-center justify-center cursor-pointer transition-all ${
                  isLocked
                    ? 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed shadow-none'
                    : getCategoryColor(lesson.category, isCompleted)
                }`}
                id={`lesson-node-${lesson.id}`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                ) : isLocked ? (
                  <Lock className="w-5 h-5" />
                ) : (
                  <span className="text-lg font-bold">{getCategoryIcon(lesson.category)}</span>
                )}
              </motion.button>

              {/* Speech pointer with title indicator */}
              <div className="mt-1 bg-white border border-slate-100 rounded-lg px-2 py-0.5 shadow-xs text-center max-w-[130px]">
                <h4 className="text-[8px] font-bold tracking-wider text-slate-400 uppercase">
                  {lesson.category}
                </h4>
                <p className="text-[10px] font-semibold text-slate-700 truncate">
                  {lesson.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Giant Modal Sheet Overlay for Active Lesson */}
      <AnimatePresence>
        {activeLesson && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white border-2 border-emerald-500 rounded-xl p-3 max-w-sm w-full shadow-lg space-y-3 overflow-y-auto max-h-[90vh] font-sans"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 font-bold uppercase tracking-wider rounded text-[9px]">
                  <BookOpen className="w-3.5 h-3.5" /> micro-lesson: {activeLesson.category}
                </span>

                <span className="text-amber-500 font-bold text-[10px] flex items-center gap-0.5 font-display">
                  <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" /> +{activeLesson.xpReward} XP Reward
                </span>
              </div>

              {/* Lesson body & facts */}
              <div className="space-y-2">
                <h3 className="font-display font-bold text-sm text-slate-800">
                  {activeLesson.title}
                </h3>
                <div className="bg-[#FFFDF8] border border-slate-100 rounded-xl p-2 flex gap-2 items-start">
                  <Mascot mood={quizSubmitted ? (passed ? 'excited' : 'concerned') : 'happy'} size={70} className="shrink-0 -mt-1" showBubble={false} />
                  <div className="space-y-1">
                    <p className="text-[9px] text-slate-600 font-semibold uppercase font-mono tracking-wide">
                      Background Facts
                    </p>
                    <p className="text-xs text-slate-700 leading-relaxed font-sans">
                      {activeLesson.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quiz Query Form */}
              <div className="space-y-2">
                <p className="font-display font-bold text-xs text-slate-800">
                  ⚡ Check-Your-Care Quiz Question:
                </p>
                <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                  <p className="text-xs font-semibold text-slate-700 leading-snug">
                    {activeLesson.questions[0].question}
                  </p>
                </div>

                {/* Multiple choice pills */}
                <div className="space-y-1.5">
                  {activeLesson.questions[0].options.map((option, idx) => {
                    const isSelected = selectedAns === idx;
                    const isCorrect = idx === activeLesson.questions[0].correctAnswerIndex;
                    let style = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700';

                    if (quizSubmitted) {
                      if (isCorrect) {
                        style = 'border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold';
                      } else if (isSelected) {
                        style = 'border-rose-400 bg-rose-50 text-rose-800';
                      } else {
                        style = 'border-slate-100 bg-slate-50/50 text-slate-400 opacity-60';
                      }
                    } else if (isSelected) {
                      style = 'border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold';
                    }

                    return (
                      <button
                        key={idx}
                        disabled={quizSubmitted}
                        onClick={() => handleOptionSelect(idx)}
                        className={`w-full p-2.5 rounded-lg border-2 text-left text-xs transition-all flex items-center justify-between cursor-pointer ${style}`}
                      >
                        <span>
                          {String.fromCharCode(65 + idx)}. {option}
                        </span>
                        {quizSubmitted && isCorrect && (
                          <span className="text-[9px] font-bold text-emerald-600 bg-white px-1.5 py-0.5 rounded uppercase border border-emerald-300 shrink-0 ml-1">
                            Correct
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Answer result & feedback panel */}
              {quizSubmitted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-2 rounded-xl border leading-relaxed text-xs ${
                    passed
                      ? 'bg-emerald-50/45 border-emerald-300 text-slate-800'
                      : 'bg-rose-50/40 border-rose-200 text-slate-800'
                  }`}
                >
                  {feedbackMsg}
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <button
                  onClick={() => setActiveLesson(null)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 py-1.5 cursor-pointer"
                >
                  Quit Lesson
                </button>

                {!quizSubmitted ? (
                  <button
                    disabled={selectedAns === null}
                    onClick={handleCheckAnswer}
                    className={`py-1.5 px-3 rounded-lg font-bold text-xs cursor-pointer shadow-xs ${
                      selectedAns === null
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                        : 'bg-emerald-500 text-white hover:bg-emerald-600'
                    }`}
                  >
                    Check Answer
                  </button>
                ) : (
                  <button
                    onClick={handleFinishLesson}
                    className="py-1.5 px-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg shadow-xs cursor-pointer flex items-center gap-1"
                  >
                    {passed ? (
                      <>
                        Unlock Next Path <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      'Try Again Later'
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
