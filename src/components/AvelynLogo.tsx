import React from 'react';
import { motion } from 'motion/react';

type AvelynLogoProps = {
  compact?: boolean;
};

export default function AvelynLogo({ compact = false }: AvelynLogoProps) {
  // Eye blinking animation
  const eyeBlink = {
    animate: {
      scaleY: [1, 1, 0.1, 1, 1, 1, 0.1, 1, 1],
    },
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  };

  // Wing flapping animation
  const wingFlap = {
    animate: {
      rotate: [0, -12, 5, -12, 0],
    },
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  };

  // Beak chirping animation
  const beakChirp = {
    hover: {
      rotate: [0, -8, 0, -8, 0],
      transition: {
        duration: 0.6,
        repeat: 2,
        ease: 'easeInOut',
      },
    },
  };

  // Tail wagging animation
  const tailWag = {
    animate: {
      rotate: [0, 6, -6, 4, 0],
    },
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  };

  return (
    <div className="flex items-center gap-3">
      <motion.div
        initial={{ rotate: -10, scale: 0.85, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative select-none"
      >
        <motion.div
          whileHover="hover"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white flex items-center justify-center shadow-lg cursor-pointer overflow-hidden"
        >
          {/* Stunning vector SVG bird logo replacing the emoji */}
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full p-1.5 drop-shadow-md"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Tail feathers - animated tail wag */}
            <motion.path
              d="M 32 60 L 12 68 L 18 52 Z"
              fill="white"
              fillOpacity={0.8}
              style={{ transformOrigin: '32px 60px' }}
              variants={tailWag}
              animate="animate"
            />

            {/* Bird body */}
            <path
              d="M 30 60 C 30 42 44 32 58 32 C 72 32 80 44 80 58 C 80 72 68 80 50 80 C 32 80 30 72 30 60 Z"
              fill="white"
            />

            {/* Head cap / crest detail */}
            <path
              d="M 50 32 C 58 20 70 24 74 34 Z"
              fill="#E6F4EA"
            />

            {/* Eye - animated blink */}
            <motion.circle
              cx="66"
              cy="46"
              r="3.5"
              fill="#0F2942"
              style={{ transformOrigin: '66px 46px' }}
              variants={eyeBlink}
              animate="animate"
            />

            {/* Cheek blush */}
            <circle
              cx="74"
              cy="54"
              r="4"
              fill="#FFD54F"
              fillOpacity={0.7}
            />

            {/* Beak - animated chirp on hover */}
            <motion.path
              d="M 78 44 L 92 48 L 77 53 Z"
              fill="#FF8A65"
              style={{ transformOrigin: '78px 44px' }}
              variants={beakChirp}
            />

            {/* Wing - animated flap */}
            <motion.path
              d="M 40 56 C 40 44 54 44 58 56 C 58 68 46 72 40 56 Z"
              fill="#A7F3D0"
              style={{ transformOrigin: '40px 56px' }}
              variants={wingFlap}
              animate="animate"
            />
          </svg>
        </motion.div>
        
        {/* Floating pulse indicator */}
        <motion.span
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-white shadow-xs"
        />
      </motion.div>

      <div>
        <motion.h1
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className={`font-display font-black tracking-tight leading-none bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent transition-all duration-300 ${
            compact ? 'text-lg md:text-xl' : 'text-2xl md:text-3xl lg:text-4xl'
          }`}
        >
          Avelyn
        </motion.h1>
        <p className="text-[9px] md:text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400">
          Flock Wellness
        </p>
      </div>
    </div>
  );
}
