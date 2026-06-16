/**
 * AmbientMusicManager.ts
 * Procedural ambient music synthesizer using Web Audio API.
 * Generates soft, warm, overlapping pentatonic pad chords dynamically.
 */

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let filterNode: BiquadFilterNode | null = null;
let nextChordTimeout: NodeJS.Timeout | null = null;
let isPlaying = false;
let currentChordIndex = 0;

// Warm ambient chords (frequencies of pads in C major pentatonic / A minor)
const CHORDS = [
  // Cmaj9 (C3, E3, G3, B3, D4)
  [130.81, 164.81, 196.00, 246.94, 293.66],
  // Fmaj9 (F3, A3, C4, E4, G4)
  [174.61, 220.00, 261.63, 329.63, 392.00],
  // Am9 (A2, E3, G3, C4, E4)
  [110.00, 164.81, 196.00, 261.63, 329.63],
  // G6 (G2, D3, G3, B3, D4)
  [98.00, 146.83, 196.00, 246.94, 293.66]
];

function initAudio() {
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return false;

  audioCtx = new AudioContextClass();
  masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0.24, audioCtx.currentTime); // Soft volume
  masterGain.connect(audioCtx.destination);

  // Soft lowpass filter to remove digital harshness
  filterNode = audioCtx.createBiquadFilter();
  filterNode.type = 'lowpass';
  filterNode.frequency.setValueAtTime(1000, audioCtx.currentTime);
  filterNode.Q.setValueAtTime(1.0, audioCtx.currentTime);
  filterNode.connect(masterGain);

  return true;
}

function scheduleNextChord() {
  if (!isPlaying || !audioCtx || !filterNode) return;

  const now = audioCtx.currentTime;
  const chord = CHORDS[currentChordIndex];
  const chordDuration = 8.5; // Seconds each chord lasts
  const fadeTime = 2.8;      // Fade in/out duration

  // Schedule each note in the chord
  chord.forEach((freq) => {
    if (!audioCtx || !filterNode) return;

    const osc = audioCtx.createOscillator();
    const noteGain = audioCtx.createGain();

    osc.type = 'sine'; // Soft sine wave
    osc.frequency.setValueAtTime(freq, now);

    // Warm chord pad volume scheduling
    noteGain.gain.setValueAtTime(0, now);
    // Slow Attack
    noteGain.gain.linearRampToValueAtTime(0.045, now + fadeTime);
    // Sustain
    noteGain.gain.setValueAtTime(0.045, now + chordDuration - fadeTime);
    // Slow Decay
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + chordDuration);

    osc.connect(noteGain);
    noteGain.connect(filterNode);

    osc.start(now);
    osc.stop(now + chordDuration + 0.1);
  });

  // Cycle to next chord
  currentChordIndex = (currentChordIndex + 1) % CHORDS.length;

  // Schedule next chord to overlap (e.g. play next chord after 5.5 seconds)
  const overlapTime = 5.8; // overlap duration
  nextChordTimeout = setTimeout(() => {
    scheduleNextChord();
  }, overlapTime * 1000);
}

export const AmbientMusicManager = {
  start: () => {
    if (isPlaying) return;

    if (!audioCtx) {
      const success = initAudio();
      if (!success) return;
    }

    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isPlaying = true;
    scheduleNextChord();
  },

  stop: () => {
    isPlaying = false;
    if (nextChordTimeout) {
      clearTimeout(nextChordTimeout);
      nextChordTimeout = null;
    }
    if (audioCtx && audioCtx.state !== 'closed') {
      audioCtx.suspend();
    }
  },

  toggle: () => {
    if (isPlaying) {
      AmbientMusicManager.stop();
      return false;
    } else {
      AmbientMusicManager.start();
      return true;
    }
  },

  isActive: () => {
    return isPlaying;
  }
};
