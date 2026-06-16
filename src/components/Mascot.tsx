import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MascotMood, MASCOT_PRESETS } from '../types';
import { BirdSoundManager } from '../utils/BirdSoundManager';

// --- CUSTOM SVG MASCOT RENDERERS (Fully Animated Vector Birds) ---

interface BirdSVGProps {
  displayMood: MascotMood;
  blink: boolean;
  hovered: boolean;
}

// 1. Budgie Wave (Green/Yellow, winking and waving wing)
function BudgieWaveSVG({ displayMood, blink, hovered }: BirdSVGProps) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full p-1 drop-shadow-md">
      {/* Branch */}
      <rect x="15" y="86" width="70" height="5" rx="2.5" fill="#8D6E63" />
      {/* Long tail */}
      <motion.path
        d="M 47 72 L 36 94 L 43 94 L 51 76"
        fill="#00E676"
        style={{ transformOrigin: '47px 72px' }}
        animate={{ rotate: hovered ? [0, 8, -8, 0] : [0, 3, -3, 0] }}
        transition={{ repeat: Infinity, duration: 2.2 }}
      />
      {/* Feet */}
      <circle cx="44" cy="86" r="2.5" fill="#FFB74D" />
      <circle cx="56" cy="86" r="2.5" fill="#FFB74D" />
      {/* Body */}
      <circle cx="50" cy="58" r="20" fill="#E6EE9C" />
      <path d="M 37 58 C 37 72, 63 72, 63 58 Z" fill="#D4E157" />
      {/* Head */}
      <circle cx="50" cy="37" r="15" fill="#FFF59D" />
      {/* Cheek Spots */}
      <circle cx="39" cy="43" r="2.5" fill="#3F51B5" />
      <circle cx="61" cy="43" r="2.5" fill="#3F51B5" />
      {/* Eyes with blink */}
      {blink || displayMood === 'sleepy' ? (
        <>
          <path d="M 40 35 Q 43 37 46 35" stroke="#212121" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 54 35 Q 57 37 60 35" stroke="#212121" strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="43" cy="35" r="2.5" fill="#212121" />
          {/* Winking eye */}
          <motion.circle
            cx="57"
            cy="35"
            r="2.5"
            fill="#212121"
            style={{ transformOrigin: '57px 35px' }}
            animate={{ scaleY: [1, 0.1, 1, 1, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1 }}
          />
        </>
      )}
      {/* Beak */}
      <path d="M 47 39 L 53 39 L 50 47 Z" fill="#FFB74D" />
      {/* Left wing (resting) */}
      <path d="M 31 54 C 29 60, 33 70, 37 70 Z" fill="#C5E1A5" />
      {/* Right wing (waving) */}
      <motion.path
        d="M 69 54 C 77 50, 85 36, 79 32 C 73 28, 69 46, 69 54 Z"
        fill="#C5E1A5"
        style={{ transformOrigin: '69px 54px' }}
        animate={{ rotate: [0, -32, 5, -32, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      />
    </svg>
  );
}

// 2. Budgie Sing (Yellow/Green, opens beak and bobs head)
function BudgieSingSVG({ displayMood, blink, hovered }: BirdSVGProps) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full p-1 drop-shadow-md">
      <rect x="15" y="86" width="70" height="5" rx="2.5" fill="#8D6E63" />
      {/* Tail */}
      <motion.path
        d="M 47 72 L 36 94 L 43 94 L 51 76"
        fill="#D4E157"
        style={{ transformOrigin: '47px 72px' }}
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      />
      <circle cx="44" cy="86" r="2.5" fill="#FFB74D" />
      <circle cx="56" cy="86" r="2.5" fill="#FFB74D" />
      {/* Body */}
      <circle cx="50" cy="58" r="20" fill="#D4E157" />
      <path d="M 37 58 C 37 72, 63 72, 63 58 Z" fill="#AFB42B" />
      {/* Head with bobbing animation */}
      <motion.g
        animate={{ y: [0, -2.5, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <circle cx="50" cy="37" r="15" fill="#FFF59D" />
        {/* Eyes */}
        {blink || displayMood === 'sleepy' ? (
          <>
            <path d="M 40 35 Q 43 37 46 35" stroke="#212121" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 54 35 Q 57 37 60 35" stroke="#212121" strokeWidth="2" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="43" cy="35" r="2.5" fill="#212121" />
            <circle cx="57" cy="35" r="2.5" fill="#212121" />
            <circle cx="42.5" cy="34" r="0.8" fill="white" />
            <circle cx="56.5" cy="34" r="0.8" fill="white" />
          </>
        )}
        {/* Animated Open Beak */}
        <motion.path
          d="M 46 39 L 54 39 L 50 44 Z"
          fill="#FFB74D"
          style={{ transformOrigin: '50px 39px' }}
          animate={{ scaleY: [1, 0.7, 1] }}
          transition={{ duration: 0.25, repeat: Infinity }}
        />
        <motion.path
          d="M 48 43 L 52 43 L 50 48 Z"
          fill="#FFA726"
          style={{ transformOrigin: '50px 48px' }}
          animate={{ scaleY: [1, 1.4, 1], y: [0, 1, 0] }}
          transition={{ duration: 0.25, repeat: Infinity }}
        />
      </motion.g>
      {/* Wings */}
      <path d="M 31 54 C 29 60, 33 70, 37 70 Z" fill="#AFB42B" />
      <path d="M 69 54 C 71 60, 67 70, 63 70 Z" fill="#AFB42B" />
    </svg>
  );
}

// 3. Blue Budgie (Sky Blue, eating seed)
function BlueBudgieSVG({ displayMood, blink, hovered }: BirdSVGProps) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full p-1 drop-shadow-md">
      <rect x="15" y="86" width="70" height="5" rx="2.5" fill="#8D6E63" />
      <path d="M 47 72 L 36 94 L 43 94 L 51 76" fill="#42A5F5" />
      <circle cx="44" cy="86" r="2.5" fill="#FFB74D" />
      <circle cx="56" cy="86" r="2.5" fill="#FFB74D" />
      {/* Body */}
      <circle cx="50" cy="58" r="20" fill="#90CAF9" />
      <path d="M 37 58 C 37 72, 63 72, 63 58 Z" fill="#42A5F5" />
      {/* Head */}
      <circle cx="50" cy="37" r="15" fill="#E3F2FD" />
      {/* Cheek Spots */}
      <circle cx="39" cy="43" r="2" fill="#1565C0" />
      <circle cx="61" cy="43" r="2" fill="#1565C0" />
      {/* Eyes */}
      {blink || displayMood === 'sleepy' ? (
        <>
          <path d="M 40 35 Q 43 37 46 35" stroke="#212121" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 54 35 Q 57 37 60 35" stroke="#212121" strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="43" cy="35" r="2.5" fill="#212121" />
          <circle cx="57" cy="35" r="2.5" fill="#212121" />
        </>
      )}
      {/* Beak nibbling */}
      <motion.path
        d="M 47 39 L 53 39 L 50 45 Z"
        fill="#FFD54F"
        style={{ transformOrigin: '50px 39px' }}
        animate={{ scaleY: [1, 0.8, 1.1, 1], y: [0, -0.4, 0.4, 0] }}
        transition={{ duration: 0.6, repeat: Infinity }}
      />
      {/* Seed (eating animation) */}
      <motion.path
        d="M 48 45 C 48 45, 50 50, 52 47 C 54 44, 50 44, 48 45 Z"
        fill="#ECEFF1"
        stroke="#546E7A"
        strokeWidth="0.8"
        style={{ transformOrigin: '50px 45px' }}
        animate={{ rotate: [0, 10, -10, 0], scale: [1, 0.85, 1.15, 1] }}
        transition={{ duration: 0.6, repeat: Infinity }}
      />
      {/* Wings */}
      <path d="M 31 54 C 29 60, 33 70, 37 70 Z" fill="#64B5F6" />
      <path d="M 69 54 C 71 60, 67 70, 63 70 Z" fill="#64B5F6" />
    </svg>
  );
}

// 4. Green Parrot (Bright green seed-eating bird styled after the Ringneck)
function GreenParrotSVG({ displayMood, blink, hovered }: BirdSVGProps) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full p-1 drop-shadow-md">
      <rect x="15" y="86" width="70" height="5" rx="2.5" fill="#8D6E63" />
      {/* Green Tail */}
      <path d="M 47 72 L 36 94 L 43 94 L 51 76" fill="#00C853" />
      <circle cx="44" cy="86" r="2.5" fill="#FFB74D" />
      <circle cx="56" cy="86" r="2.5" fill="#FFB74D" />
      {/* Body - Neon Green */}
      <circle cx="50" cy="58" r="20" fill="#00E676" />
      <path d="M 37 58 C 37 72, 63 72, 63 58 Z" fill="#00C853" />
      {/* Head - Mint Green */}
      <circle cx="50" cy="37" r="15" fill="#69F0AE" />
      {/* Eyes */}
      {blink || displayMood === 'sleepy' ? (
        <>
          <path d="M 40 35 Q 43 37 46 35" stroke="#212121" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 54 35 Q 57 37 60 35" stroke="#212121" strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="43" cy="35" r="2.5" fill="#212121" />
          <circle cx="57" cy="35" r="2.5" fill="#212121" />
        </>
      )}
      {/* Coral Red Beak nibbling */}
      <motion.path
        d="M 47 39 L 53 39 L 50 45 Z"
        fill="#E53935"
        style={{ transformOrigin: '50px 39px' }}
        animate={{ scaleY: [1, 0.8, 1.1, 1], y: [0, -0.4, 0.4, 0] }}
        transition={{ duration: 0.6, repeat: Infinity }}
      />
      {/* Seed (eating animation) */}
      <motion.path
        d="M 48 45 C 48 45, 50 50, 52 47 C 54 44, 50 44, 48 45 Z"
        fill="#ECEFF1"
        stroke="#546E7A"
        strokeWidth="0.8"
        style={{ transformOrigin: '50px 45px' }}
        animate={{ rotate: [0, 10, -10, 0], scale: [1, 0.85, 1.15, 1] }}
        transition={{ duration: 0.6, repeat: Infinity }}
      />
      {/* Wings - Emerald Green */}
      <path d="M 31 54 C 29 60, 33 70, 37 70 Z" fill="#00C853" />
      <path d="M 69 54 C 71 60, 67 70, 63 70 Z" fill="#00C853" />
    </svg>
  );
}

// 5. Lovebird Fly (Spreading wings, peach-faced)
function LovebirdFlySVG({ displayMood, blink, hovered }: BirdSVGProps) {
  const wingFlapLeft = {
    animate: { rotate: [0, -32, 12, -32, 0] },
    transition: { duration: 1.1, repeat: Infinity, ease: 'easeInOut' }
  };
  const wingFlapRight = {
    animate: { rotate: [0, 32, -12, 32, 0] },
    transition: { duration: 1.1, repeat: Infinity, ease: 'easeInOut' }
  };

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full p-1 drop-shadow-md">
      <rect x="15" y="86" width="70" height="5" rx="2.5" fill="#8D6E63" />
      <path d="M 47 72 L 38 92 L 44 92 L 52 75" fill="#2E7D32" />
      <circle cx="44" cy="86" r="2.5" fill="#FFB74D" />
      <circle cx="56" cy="86" r="2.5" fill="#FFB74D" />
      {/* Body */}
      <circle cx="50" cy="57" r="19" fill="#4CAF50" />
      <path d="M 36 57 C 36 68, 64 68, 64 57 Z" fill="#81C784" />
      {/* Head */}
      <circle cx="50" cy="38" r="15" fill="#FF8A65" /> {/* Peach face */}
      <path d="M 38 34 C 38 24, 62 24, 62 34 Z" fill="#FF7043" />
      {/* Eyes */}
      {blink || displayMood === 'sleepy' ? (
        <>
          <path d="M 41 35 Q 44 37 47 35" stroke="#212121" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 53 35 Q 56 37 59 35" stroke="#212121" strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="43" cy="35" r="2.5" fill="#212121" />
          <circle cx="57" cy="35" r="2.5" fill="#212121" />
          <circle cx="43" cy="35" r="3.8" stroke="white" strokeWidth="0.8" fill="none" />
          <circle cx="57" cy="35" r="3.8" stroke="white" strokeWidth="0.8" fill="none" />
        </>
      )}
      {/* Beak */}
      <path d="M 46 40 Q 50 36 54 40 Q 50 51 46 40 Z" fill="#E53935" />
      
      {/* Left Wing - Spread & Flapping */}
      <motion.path
        d="M 33 54 C 21 48, 9 36, 15 30 C 21 24, 31 40, 33 54 Z"
        fill="#388E3C"
        style={{ transformOrigin: '33px 54px' }}
        variants={wingFlapLeft}
        animate="animate"
      />
      {/* Right Wing - Spread & Flapping */}
      <motion.path
        d="M 67 54 C 79 48, 91 36, 85 30 C 79 24, 69 40, 67 54 Z"
        fill="#388E3C"
        style={{ transformOrigin: '67px 54px' }}
        variants={wingFlapRight}
        animate="animate"
      />
    </svg>
  );
}

// 6. Lovebird Nest (Cozy box, peeking bobber)
function LovebirdNestSVG({ displayMood, blink, hovered }: BirdSVGProps) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full p-1 drop-shadow-md">
      {/* Nest Box */}
      <rect x="22" y="26" width="56" height="56" rx="5" fill="#A1887F" stroke="#5D4037" strokeWidth="2.5" />
      {/* Hole */}
      <circle cx="50" cy="54" r="18" fill="#3E2723" />
      
      {/* Peeking Bird */}
      <motion.g
        animate={{ y: hovered ? [0, -9, 0] : [0, -3.5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <circle cx="50" cy="52" r="12" fill="#FF8A65" />
        <path d="M 41 48 C 41 40, 59 40, 59 48 Z" fill="#FF7043" />
        {blink || displayMood === 'sleepy' ? (
          <>
            <path d="M 43 47 Q 45 49 47 47" stroke="#212121" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M 53 47 Q 55 49 57 47" stroke="#212121" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="45" cy="47" r="2" fill="#212121" />
            <circle cx="55" cy="47" r="2" fill="#212121" />
            <circle cx="45" cy="47" r="2.8" stroke="white" strokeWidth="0.6" fill="none" />
            <circle cx="55" cy="47" r="2.8" stroke="white" strokeWidth="0.6" fill="none" />
          </>
        )}
        <path d="M 47 50 Q 50 47 53 50 Q 50 58 47 50 Z" fill="#E53935" />
      </motion.g>
      <rect x="27" y="68" width="46" height="9" fill="#8D6E63" />
      <circle cx="50" cy="72" r="1.8" fill="#4E342E" />
    </svg>
  );
}

// 7. Java Sparrow (Conical beak, seed eater)
function JavaSparrowSVG({ displayMood, blink, hovered }: BirdSVGProps) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full p-1 drop-shadow-md">
      <rect x="15" y="86" width="70" height="5" rx="2.5" fill="#8D6E63" />
      <path d="M 47 72 L 36 94 L 43 94 L 51 76" fill="#424242" />
      <circle cx="44" cy="86" r="2.5" fill="#FFB74D" />
      <circle cx="56" cy="86" r="2.5" fill="#FFB74D" />
      {/* Body */}
      <circle cx="50" cy="57" r="20" fill="#B0BEC5" />
      <path d="M 37 57 C 37 70, 63 70, 63 57 Z" fill="#78909C" />
      {/* Head */}
      <circle cx="50" cy="37" r="14" fill="#212121" />
      <ellipse cx="39" cy="41" rx="4" ry="5.5" fill="white" />
      <ellipse cx="61" cy="41" rx="4" ry="5.5" fill="white" />
      {/* Eyes */}
      {blink || displayMood === 'sleepy' ? (
        <>
          <path d="M 41 34 Q 43 35 45 34" stroke="#EF5350" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M 55 34 Q 57 35 59 34" stroke="#EF5350" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="43" cy="34" r="2" fill="#212121" />
          <circle cx="57" cy="34" r="2" fill="#212121" />
          <circle cx="43" cy="34" r="2.8" stroke="#EF5350" strokeWidth="0.8" fill="none" />
          <circle cx="57" cy="34" r="2.8" stroke="#EF5350" strokeWidth="0.8" fill="none" />
        </>
      )}
      {/* Pink Conical Beak */}
      <path d="M 45 35 Q 50 30 55 35 Q 50 48 45 35 Z" fill="#F48FB1" />
      {/* Falling seeds crumbs */}
      <motion.circle
        cx="50"
        cy="47"
        r="1.5"
        fill="#FFF9C4"
        stroke="#F57F17"
        strokeWidth="0.4"
        animate={{ y: [0, 3, 0], scale: [1, 0.6, 1] }}
        transition={{ duration: 0.7, repeat: Infinity }}
      />
      {/* Wings */}
      <path d="M 31 54 C 29 60, 33 68, 37 68 Z" fill="#90A4AE" />
      <path d="M 69 54 C 71 60, 67 68, 63 68 Z" fill="#90A4AE" />
    </svg>
  );
}

// 8. Cockatiel (Grey/Yellow, erect crest)
function CockatielSVG({ displayMood, blink, hovered }: BirdSVGProps) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full p-1 drop-shadow-md">
      <rect x="15" y="86" width="70" height="5" rx="2.5" fill="#8D6E63" />
      <path d="M 46 72 L 34 96 L 41 96 L 50 75" fill="#78909C" />
      <circle cx="44" cy="86" r="2.5" fill="#FFB74D" />
      <circle cx="56" cy="86" r="2.5" fill="#FFB74D" />
      {/* Body */}
      <circle cx="50" cy="57" r="20" fill="#CFD8DC" />
      <path d="M 36 57 C 36 70, 64 70, 64 57 Z" fill="#90A4AE" />
      {/* Tall Yellow Crest Feather */}
      <motion.path
        d="M 50 24 Q 36 3 47 9 Q 50 18 52 24"
        fill="#FFD54F"
        stroke="#37474F"
        strokeWidth="1.2"
        style={{ transformOrigin: '50px 24px' }}
        animate={{ rotate: hovered ? [0, -9, 7, 0] : [0, -3, 3, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Head */}
      <circle cx="50" cy="37" r="15" fill="#FFF176" />
      {/* Orange Blush */}
      <circle cx="39" cy="43" r="4" fill="#FF7043" />
      <circle cx="61" cy="43" r="4" fill="#FF7043" />
      {/* Eyes */}
      {blink || displayMood === 'sleepy' ? (
        <>
          <path d="M 40 34 Q 43 36 46 34" stroke="#212121" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 54 34 Q 57 36 60 34" stroke="#212121" strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="43" cy="34" r="2.5" fill="#212121" />
          <circle cx="57" cy="34" r="2.5" fill="#212121" />
        </>
      )}
      {/* Beak */}
      <path d="M 47 38 L 53 38 L 50 45 Z" fill="#B0BEC5" />
      {/* Wings */}
      <path d="M 30 54 C 28 60, 33 70, 37 70 Z" fill="#B0BEC5" />
      <path d="M 70 54 C 72 60, 67 70, 63 70 Z" fill="#B0BEC5" />
    </svg>
  );
}

// --- MAIN MASCOT COMPONENT ---

interface MascotProps {
  mood: MascotMood;
  message?: string;
  className?: string;
  size?: number;
  interactive?: boolean;
  activeMascot?: string;
  showBubble?: boolean;
}

export default function Mascot({
  mood,
  message,
  className = '',
  size = 180,
  interactive = true,
  activeMascot,
  showBubble,
}: MascotProps) {
  const [hovered, setHovered] = useState(false);
  const [blink, setBlink] = useState(false);
  const [chirpIndex, setChirpIndex] = useState(0);
  const [activeMascotName, setActiveMascotName] = useState<string>('budgie_wave');

  // Interactive interaction dynamics state
  const [tapCount, setTapCount] = useState(0);
  const [isHopping, setIsHopping] = useState(false);

  // Compute bubble visibility: default to size >= 100 on desktop, but allow overrides
  const bubbleVisible = showBubble !== undefined ? showBubble : (size >= 100);
  const [overrideMood, setOverrideMood] = useState<MascotMood | null>(null);

  const moodTimerRef = useRef<NodeJS.Timeout | null>(null);
  const tapResetTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleActiveMascot = (id: string) => {
      const exists = MASCOT_PRESETS.some(p => p.id === id);
      setActiveMascotName(exists ? id : 'budgie_wave');
    };

    if (activeMascot) {
      handleActiveMascot(activeMascot);
    } else {
      const raw = localStorage.getItem('avelyn_user_session_v1');
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed.activeMascot) {
            handleActiveMascot(parsed.activeMascot);
          }
        } catch (e) {}
      }
    }
  }, [activeMascot]);

  // Periodic blinking eyes
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Automatic tap count reset after 4 seconds of idle inactivity
  useEffect(() => {
    if (tapCount > 0) {
      if (tapResetTimerRef.current) clearTimeout(tapResetTimerRef.current);
      tapResetTimerRef.current = setTimeout(() => {
        setTapCount(0);
      }, 4000);
    }
    return () => {
      if (tapResetTimerRef.current) clearTimeout(tapResetTimerRef.current);
    };
  }, [tapCount]);

  useEffect(() => {
    return () => {
      if (moodTimerRef.current) clearTimeout(moodTimerRef.current);
    };
  }, []);

  const idleSayings = [
    "Chirp! Clean water makes the feathers shiny! 💧",
    "Don't forget some fresh greens today! 🥦",
    "You're doing amazing! Give your bird a soft head scratch for me! 🥰",
    "Did you know Indian Ringnecks can learn to mimic words? Peak intelligence! 🦜",
    "Every chirp is a happy check-in from your feathered family!",
  ];

  const handleHop = () => {
    if (!interactive) return;

    // Snappy physical jump state
    setIsHopping(true);
    setTimeout(() => setIsHopping(false), 650);

    const nextTapCount = tapCount + 1;
    setTapCount(nextTapCount);

    let intensity: 'normal' | 'lovable' | 'annoyed' = 'normal';

    if (nextTapCount >= 6) {
      intensity = 'annoyed';
      setOverrideMood('concerned');
    } else if (nextTapCount >= 3) {
      intensity = 'lovable';
      setOverrideMood('excited');
    } else {
      intensity = 'normal';
      setOverrideMood('happy');
    }

    // Synthesize the species special chirp
    BirdSoundManager.play(activeMascotName, intensity);

    if (moodTimerRef.current) clearTimeout(moodTimerRef.current);
    moodTimerRef.current = setTimeout(() => {
      setOverrideMood(null);
    }, 2800);

    setChirpIndex((prev) => (prev + 1) % idleSayings.length);
  };

  // Select dialogue speech bubble depending on mood and tap level overrides
  const getSpeechText = () => {
    const currentPreset = MASCOT_PRESETS.find((p) => p.id === activeMascotName);
    const birdLabel = currentPreset ? currentPreset.name.split(' (')[0] : 'Bird';

    if (overrideMood === 'concerned' && tapCount >= 6) {
      return `Chirp chiiirp! 💢 Hey, ${birdLabel} is getting dizzy! Tap me gently!`;
    }
    if (overrideMood === 'excited' && tapCount >= 3) {
      return `Chirrrp! 💕 ${birdLabel} sings a happy melody for your caring fingers!`;
    }
    if (overrideMood === 'happy' && tapCount > 0) {
      return `Chirp/Peep! 🌟 Click responsive! Hello bird parent!`;
    }

    if (message) return message;
    
    const displayMood = overrideMood || mood;
    switch (displayMood) {
      case 'concerned':
        return "Aww... your flock is waiting for you! Let's make sure they get some love. 🥺";
      case 'excited':
        return "Wow! Phenomenal bird care! You're an incredible bird parent! ✨🔥";
      case 'proud':
        return "I am so proud of your dedication to a healthy, happy flock! 🎖️";
      case 'sleepy':
        return "Time for some quiet, comfortable cage cover... Sweet birdy dreams. 😴💤";
      case 'celebrating':
        return "Yay! Care task streak updated! Level up! 🎉🥳";
      case 'happy':
      default:
        return hovered ? idleSayings[chirpIndex] : "Hi there! Let's make today a parrot paradise! 🦜✨";
    }
  };

  const displayMood = overrideMood || mood;

  // Choose the custom SVG vector bird renderer based on selected mascot id
  const renderMascotSVG = () => {
    switch (activeMascotName) {
      case 'budgie_wave':
        return <BudgieWaveSVG displayMood={displayMood} blink={blink} hovered={hovered} />;
      case 'budgie_sing':
        return <BudgieSingSVG displayMood={displayMood} blink={blink} hovered={hovered} />;
      case 'blue_budgie':
        return <BlueBudgieSVG displayMood={displayMood} blink={blink} hovered={hovered} />;
      case 'green_parrotlet':
        return <GreenParrotSVG displayMood={displayMood} blink={blink} hovered={hovered} />;
      case 'lovebird_fly':
        return <LovebirdFlySVG displayMood={displayMood} blink={blink} hovered={hovered} />;
      case 'lovebird_nest':
        return <LovebirdNestSVG displayMood={displayMood} blink={blink} hovered={hovered} />;
      case 'java_sparrow':
        return <JavaSparrowSVG displayMood={displayMood} blink={blink} hovered={hovered} />;
      case 'cockatiel':
        return <CockatielSVG displayMood={displayMood} blink={blink} hovered={hovered} />;
      default:
        return null;
    }
  };

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Speech Bubble layout */}
      {bubbleVisible && (
        <div className="w-full min-h-[50px] pb-3 flex items-center justify-center relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={getSpeechText()}
              initial={{ opacity: 0, scale: 0.9, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -5 }}
              transition={{ type: 'spring', damping: 15, stiffness: 200 }}
              className="relative z-20 max-w-[150px] bg-white border-2 border-emerald-500 rounded-xl px-2 py-1 shadow-sm text-slate-800 text-[10px] font-semibold text-center leading-normal"
            >
              {getSpeechText()}
              {/* Bubble Pointer Arrow */}
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-r-2 border-b-2 border-emerald-500 transform rotate-45 z-10" />
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Interactive Mascot SVG Canvas */}
      <motion.div
        className="relative cursor-pointer flex items-center justify-center rounded-2xl bg-white/95 border border-slate-100 shadow-md p-1.5"
        style={{ width: size, height: size }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handleHop}
        whileHover={{ scale: 1.04 }}
        animate={
          isHopping
            ? {
                y: [0, 6, -38, 0, 4, 0],
                scaleX: [1, 1.15, 0.8, 1.1, 0.96, 1],
                scaleY: [1, 0.8, 1.25, 0.9, 1.04, 1],
              }
            : displayMood === 'excited'
            ? {
                y: [0, -12, 0, -6, 0],
                rotate: [0, -4, 4, -2, 0],
                scaleX: 1,
                scaleY: 1,
                transition: { repeat: Infinity, duration: 0.8, ease: 'easeInOut' }
              }
            : displayMood === 'concerned'
            ? {
                x: [0, -2, 2, -2, 2, 0],
                scaleX: 1,
                scaleY: 1,
                transition: { repeat: Infinity, duration: 0.4 }
              }
            : displayMood === 'sleepy'
            ? {
                y: [0, -4, 0],
                scale: [1, 0.98, 1],
                scaleX: 1,
                scaleY: 1,
                transition: { repeat: Infinity, duration: 3.5, ease: 'easeInOut' }
              }
            : {
                y: [0, -6, 0],
                rotate: [0, -1.8, 1.8, 0],
                scaleX: 1,
                scaleY: 1,
                transition: { repeat: Infinity, duration: 3.2, ease: 'easeInOut' }
              }
        }
        transition={isHopping ? { duration: 0.65, ease: 'easeOut' } : undefined}
      >
        {/* Floating Effects / Particle layers depending on mood */}
        <AnimatePresence>
          {displayMood === 'happy' && (
            <>
              <motion.span
                key="h1"
                initial={{ opacity: 0, y: 20, scale: 0.5, x: -20 }}
                animate={{ opacity: [0, 1, 0], y: -40, scale: 1.2, x: -30 }}
                transition={{ repeat: Infinity, duration: 2.5, delay: 0.2 }}
                className="absolute text-emerald-400 font-bold text-lg pointer-events-none"
              >
                ♪
              </motion.span>
              <motion.span
                key="h2"
                initial={{ opacity: 0, y: 15, scale: 0.5, x: 25 }}
                animate={{ opacity: [0, 1, 0], y: -45, scale: 1.1, x: 35 }}
                transition={{ repeat: Infinity, duration: 2.8, delay: 1 }}
                className="absolute text-yellow-400 font-bold text-lg pointer-events-none"
              >
                ♫
              </motion.span>
            </>
          )}

          {displayMood === 'excited' && (
            <>
              <motion.span
                key="heart1"
                initial={{ opacity: 0, y: 30, scale: 0.3, x: -25 }}
                animate={{ opacity: [0, 1, 0], y: -60, scale: 1.3, x: -40 }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute text-rose-400 text-lg pointer-events-none"
              >
                ❤️
              </motion.span>
              <motion.span
                key="heart2"
                initial={{ opacity: 0, y: 20, scale: 0.3, x: 30 }}
                animate={{ opacity: [0, 1, 0], y: -50, scale: 1.2, x: 45 }}
                transition={{ repeat: Infinity, duration: 1.8, delay: 0.5 }}
                className="absolute text-pink-400 text-md pointer-events-none"
              >
                💖
              </motion.span>
            </>
          )}

          {displayMood === 'sleepy' && (
            <>
              <motion.span
                key="z1"
                initial={{ opacity: 0, y: 30, scale: 0.5, x: 20 }}
                animate={{ opacity: [0, 1, 0], y: -50, scale: 1.2, x: 40 }}
                transition={{ repeat: Infinity, duration: 3.5 }}
                className="absolute text-slate-400 font-semibold text-sm pointer-events-none"
              >
                Z
              </motion.span>
              <motion.span
                key="z2"
                initial={{ opacity: 0, y: 25, scale: 0.4, x: 15 }}
                animate={{ opacity: [0, 1, 0], y: -40, scale: 1.3, x: 30 }}
                transition={{ repeat: Infinity, duration: 3.0, delay: 1.2 }}
                className="absolute text-slate-400 font-bold text-xs pointer-events-none"
              >
                z
              </motion.span>
            </>
          )}

          {displayMood === 'concerned' && (
            <>
              <motion.svg
                key="sweat"
                initial={{ opacity: 0, scale: 0.4, y: 10, x: -30 }}
                animate={{ opacity: [0, 1, 1, 0], scale: 1, y: 35, x: -35 }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute w-5 h-5 text-indigo-400 fill-current pointer-events-none"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </motion.svg>
            </>
          )}

          {displayMood === 'celebrating' && (
            <>
              <motion.div
                key="confetti1"
                initial={{ opacity: 0, scale: 0.2 }}
                animate={{ opacity: [0, 1, 0], scale: 1.2, y: -40, x: [-20, -50] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute w-3 h-3 rounded-full bg-yellow-400 pointer-events-none"
              />
              <motion.div
                key="confetti2"
                initial={{ opacity: 0, scale: 0.2 }}
                animate={{ opacity: [0, 1, 0], scale: 1.2, y: -45, x: [20, 50] }}
                transition={{ repeat: Infinity, duration: 1.7, delay: 0.3 }}
                className="absolute w-2.5 h-2.5 bg-sky-400 rotate-45 transform pointer-events-none"
              />
              <motion.div
                key="confetti3"
                initial={{ opacity: 0, scale: 0.2 }}
                animate={{ opacity: [0, 1, 0], scale: 1, y: -30, x: [-10, 30] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.6 }}
                className="absolute w-3 h-1.5 bg-orange-400 transform -rotate-12 pointer-events-none"
              />
            </>
          )}
        </AnimatePresence>

        {/* Dynamic Vector SVG Bird or Fallback */}
        {renderMascotSVG() || (
          <svg
            viewBox="0 0 200 210"
            className="w-full h-full drop-shadow-md"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Shadows */}
            <ellipse cx="100" cy="195" rx="55" ry="8" fill="#1E293B" fillOpacity="0.12" />

            {/* Tail Feathers - Wiggle when happy */}
            <motion.path
              d="M85 150 L100 205 L115 150 Z"
              fill="#2BB356"
              stroke="#1E293B"
              strokeWidth="4"
              strokeLinejoin="round"
              animate={
                displayMood === 'excited' || displayMood === 'celebrating' || hovered
                  ? { rotate: [-10, 12, -10], originX: 0.5, originY: 0.2 }
                  : { rotate: [0, 3, 0], originX: 0.5, originY: 0.2 }
              }
              transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
            />

            {/* Feet */}
            <circle cx="82" cy="190" r="8" fill="#FFB74D" stroke="#1E293B" strokeWidth="4" />
            <path d="M78 190 L74 195 M82 190 L82 197 M86 190 L90 195" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />

            {/* Right Foot */}
            <circle cx="118" cy="190" r="8" fill="#FFB74D" stroke="#1E293B" strokeWidth="4" />
            <path d="M114 190 L110 195 M118 190 L118 197 M122 190 L126 195" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />

            {/* Body */}
            <circle cx="100" cy="125" r="60" fill="#39C16C" stroke="#1E293B" strokeWidth="5" />

            {/* Chest plumage */}
            <path d="M50 135 C 50 170, 150 170, 150 135 C 130 160, 70 160, 50 135 Z" fill="#ACEA6B" />

            {/* Ring Neck */}
            <motion.path
              d="M44 110 C 60 128, 140 128, 156 110"
              stroke={displayMood === 'concerned' ? '#E2E8F0' : '#1E293B'}
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
              animate={displayMood === 'excited' ? { scaleY: [1, 1.1, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1.2 }}
            />
            <path d="M46 111 C 60 125, 140 125, 154 111" stroke="#FFA94D" strokeWidth="2.5" strokeLinecap="round" fill="none" />

            {/* Cheeks */}
            <ellipse cx="60" cy="104" rx="12" ry="8" fill="#FFA94D" fillOpacity="0.85" />
            <ellipse cx="140" cy="104" rx="12" ry="8" fill="#FFA94D" fillOpacity="0.85" />

            {/* Eyes */}
            <g>
              {blink || displayMood === 'sleepy' ? (
                <motion.path d="M48 95 Q60 108 72 95" stroke="#1E293B" strokeWidth="5" strokeLinecap="round" fill="none" />
              ) : displayMood === 'concerned' ? (
                <>
                  <circle cx="60" cy="94" r="11" fill="#1E293B" />
                  <circle cx="56" cy="90" r="4.5" fill="white" />
                  <path d="M50 82 Q60 88 70 85" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
                </>
              ) : displayMood === 'excited' || displayMood === 'celebrating' ? (
                <>
                  <circle cx="60" cy="94" r="11.5" fill="#1E293B" />
                  <circle cx="57" cy="89" r="5" fill="white" />
                  <circle cx="65" cy="98" r="2.5" fill="white" />
                  <path d="M46 84 L48 88 L52 89 L48 90 L46 94 L44 90 L40 89 L44 88 Z" fill="#FFF" />
                </>
              ) : (
                <>
                  <circle cx="60" cy="94" r="11" fill="#1E293B" />
                  <circle cx="56" cy="90" r="4" fill="white" />
                  <circle cx="63" cy="97" r="2" fill="white" />
                </>
              )}
            </g>

            {/* Right Eye */}
            <g>
              {blink || displayMood === 'sleepy' ? (
                <motion.path d="M128 95 Q140 108 152 95" stroke="#1E293B" strokeWidth="5" strokeLinecap="round" fill="none" />
              ) : displayMood === 'concerned' ? (
                <>
                  <circle cx="140" cy="94" r="11" fill="#1E293B" />
                  <circle cx="136" cy="90" r="4.5" fill="white" />
                  <path d="M130 85 Q140 88 150 82" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
                </>
              ) : displayMood === 'excited' || displayMood === 'celebrating' ? (
                <>
                  <circle cx="140" cy="94" r="11.5" fill="#1E293B" />
                  <circle cx="137" cy="89" r="5" fill="white" />
                  <circle cx="145" cy="98" r="2.5" fill="white" />
                  <path d="M154 84 L156 88 L160 89 L156 90 L154 94 L152 90 L148 89 L152 88 Z" fill="#FFF" />
                </>
              ) : (
                <>
                  <circle cx="140" cy="94" r="11" fill="#1E293B" />
                  <circle cx="136" cy="90" r="4" fill="white" />
                  <circle cx="143" cy="97" r="2" fill="white" />
                </>
              )}
            </g>

            {/* Beak */}
            <motion.g animate={(displayMood === 'excited' || displayMood === 'celebrating' || hovered) ? { scaleY: [1, 1.15, 1], y: [0, -1, 0] } : {}}>
              {displayMood === 'concerned' ? (
                <path d="M90 98 C 90 98, 100 115, 110 98" fill="#FFD54A" stroke="#1E293B" strokeWidth="4" strokeLinejoin="round" />
              ) : (
                <>
                  <path d="M86 98 Q100 86 114 98 Q100 135 86 98 Z" fill="#FFD54A" stroke="#1E293B" strokeWidth="4" strokeLinejoin="round" />
                  <path d="M90 102 Q100 115 110 102" stroke="#E65100" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                </>
              )}
            </motion.g>

            {/* Left Wing */}
            <motion.path
              d="M45 115 C 20 120, 15 155, 42 165 C 44 145, 45 130, 45 115 Z"
              fill="#39C16C"
              stroke="#1E293B"
              strokeWidth="4"
              strokeLinejoin="round"
              animate={(displayMood === 'celebrating' || displayMood === 'excited') ? { rotate: [0, -50, 0], originX: 0.9, originY: 0.2 } : hovered ? { rotate: [0, -25, 0], originX: 0.9, originY: 0.2 } : { rotate: [0, -4, 0], originX: 0.9, originY: 0.2 }}
              transition={{ repeat: Infinity, duration: 0.7, ease: 'easeOut' }}
            />

            {/* Right Wing */}
            <motion.path
              d="M155 115 C 180 120, 185 155, 158 165 C 156 145, 155 130, 155 115 Z"
              fill="#39C16C"
              stroke="#1E293B"
              strokeWidth="4"
              strokeLinejoin="round"
              animate={(displayMood === 'celebrating' || flagExcited(displayMood)) ? { rotate: [0, 50, 0], originX: 0.1, originY: 0.2 } : hovered ? { rotate: [0, 5, 0], originX: 0.1, originY: 0.2 } : { rotate: [0, 4, 0], originX: 0.1, originY: 0.2 }}
              transition={{ repeat: Infinity, duration: 0.7, ease: 'easeOut', delay: 0.1 }}
            />
          </svg>
        )}
      </motion.div>
    </div>
  );
}

// Quick helper
function flagExcited(mood: MascotMood) {
  return mood === 'excited';
}
