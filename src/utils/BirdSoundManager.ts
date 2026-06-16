/**
 * BirdSoundManager.ts
 * Centered audio synthesis manager for high-fidelity interactive companion birdsongs.
 * Leverages native Web Audio API to create zero-latency, beautiful, procedurally custom-generated bird calls.
 */

export interface BirdSoundOptions {
  breedId: string;
  intensity: 'normal' | 'lovable' | 'annoyed';
}

const AudioContextClass = typeof window !== 'undefined' ? (window.AudioContext || (window as any).webkitAudioContext) : null;
let sharedCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (!AudioContextClass) return null;
  if (!sharedCtx) {
    sharedCtx = new AudioContextClass();
  }
  if (sharedCtx.state === 'suspended') {
    sharedCtx.resume();
  }
  return sharedCtx;
}

/**
 * Procedurally synthesizes high-fidelity bird soundscapes
 */
export const BirdSoundManager = {
  play: (breedId: string, intensity: 'normal' | 'lovable' | 'annoyed') => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const cleanId = breedId.toLowerCase();

      // Master volume dynamic ceiling to keep clicks eye-friendly and ears safe
      const masterVolume = ctx.createGain();
      masterVolume.gain.setValueAtTime(0.32, now);
      masterVolume.connect(ctx.destination);

      // Simple lowpass filter to remove harsh digital harmonics, making synthesizers sweet & analog
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(8000, now);
      filter.connect(masterVolume);

      // Distinguish species and trigger custom waveforms & pitch algorithms
      if (cleanId.includes('blue_budgie') || cleanId.includes('ringneck')) {
        // --- RINGNECK PARAKEET: High-pitched clear "kee-ak!", sweet ringing warbles and sliding screeches ---
        if (intensity === 'normal') {
          // Double "kee-ak!" contact whistle
          playRingneckWhistle(ctx, filter, now, 2400, 3600, 2000, 0.16);
          playRingneckWhistle(ctx, filter, now + 0.18, 2600, 3800, 2200, 0.14);
        } else if (intensity === 'lovable') {
          // Playful mimic warble (rising and falling whistle)
          playRingneckWhistle(ctx, filter, now, 2000, 3400, 2400, 0.22);
          playRingneckWhistle(ctx, filter, now + 0.26, 2800, 4200, 3000, 0.18);
        } else {
          // Sharp loud warning alarm screech "kreeee-ak!"
          playRingneckScreech(ctx, filter, now, 1800, 3900, 0.26);
        }
      } else if (cleanId.includes('budgie')) {
        // --- BUDGIE: Sweet frequency-swept chatter and constant joyful trilling ---
        if (intensity === 'normal') {
          // Double quick chirp
          playBudgieChirp(ctx, filter, now, 3500, 4200, 0.06);
          playBudgieChirp(ctx, filter, now + 0.1, 3800, 4400, 0.06);
        } else if (intensity === 'lovable') {
          // Lovable trill
          for (let i = 0; i < 4; i++) {
            const delay = i * 0.08;
            const startFreq = 3400 + Math.sin(i * 1.5) * 400;
            const endFreq = 4200 + Math.cos(i * 1.5) * 400;
            playBudgieChirp(ctx, filter, now + delay, startFreq, endFreq, 0.05);
          }
        } else {
          // Annoyed sharp high chatter or scolding dry clicky buzz
          playBuzzyClick(ctx, filter, now, 2400, 1600, 0.2);
        }
      } 
      else if (cleanId.includes('parrotlet')) {
        // --- PARROTLET: Crisp, crystalline, slightly metallic, very rapid chirps ---
        if (intensity === 'normal') {
          playParrotletChirp(ctx, filter, now, 2900, 3700, 0.08);
        } else if (intensity === 'lovable') {
          // A joyful rapid bubble song
          playParrotletChirp(ctx, filter, now, 3100, 3900, 0.07);
          playParrotletChirp(ctx, filter, now + 0.08, 3500, 2800, 0.07);
          playParrotletChirp(ctx, filter, now + 0.16, 2900, 3600, 0.09);
        } else {
          // High squeaky reprimand
          playSharpReprimand(ctx, filter, now, 4200, 0.15);
        }
      } 
      else if (cleanId.includes('lovebird')) {
        // --- LOVEBIRD: Energetic, high-decibel rich chirping with beautiful harmonics ---
        if (intensity === 'normal') {
          playLovebirdChirp(ctx, filter, now, 2600, 3200, 0.1);
          playLovebirdChirp(ctx, filter, now + 0.14, 2800, 3400, 0.08);
        } else if (intensity === 'lovable') {
          // Sweet romantic melody
          playLovebirdChirp(ctx, filter, now, 2700, 3500, 0.12);
          playLovebirdChirp(ctx, filter, now + 0.15, 3300, 3900, 0.12);
          playLovebirdChirp(ctx, filter, now + 0.30, 3600, 2600, 0.15);
        } else {
          // Annoyed loud alarm
          playHarshSqueak(ctx, filter, now, 2200, 0.22);
        }
      } 
      else if (cleanId.includes('java')) {
        // --- JAVA SPARROW: Clean, bell-like, pure flute-like "pips" that decay softly ---
        if (intensity === 'normal') {
          playBellPip(ctx, filter, now, 1800, 0.09);
        } else if (intensity === 'lovable') {
          // Musical scale of pips
          playBellPip(ctx, filter, now, 1760, 0.08); // A6
          playBellPip(ctx, filter, now + 0.14, 1976, 0.08); // B6
          playBellPip(ctx, filter, now + 0.28, 2200, 0.12); // C#7
        } else {
          // Short dry chide click
          playJavaClickSound(ctx, filter, now, 1100, 0.18);
        }
      } 
      else if (cleanId.includes('cockatiel')) {
        // --- COCKATIEL: Whistling bird par excellence. Famous for wolf whistles! ---
        if (intensity === 'normal') {
          // Happy short contact call whistle
          playPureWhistle(ctx, filter, now, 2000, 2800, 0.18);
        } else if (intensity === 'lovable') {
          // ICONIC WOLF WHISTLE: Quick ascending sliding tone + immediate descending sliding tone!
          playPureWhistle(ctx, filter, now, 2100, 3600, 0.20);
          playPureWhistle(ctx, filter, now + 0.24, 3400, 1900, 0.30);
        } else {
          // Soft hissing dragon growl or snake-like warning hiss (filtered fuzzy sound)
          playHissingSound(ctx, filter, now, 0.3);
        }
      } 
      else {
        // --- ROOT DEFAULT BIRD: Universal sweet whistling synth ---
        if (intensity === 'normal') {
          playPureWhistle(ctx, filter, now, 2805, 3400, 0.1);
        } else if (intensity === 'lovable') {
          playPureWhistle(ctx, filter, now, 2500, 3300, 0.12);
          playPureWhistle(ctx, filter, now + 0.15, 3000, 3800, 0.16);
        } else {
          playSharpReprimand(ctx, filter, now, 3200, 0.22);
        }
      }
    } catch (e) {
      console.warn('BirdSoundManager Audio Synthesis skipped or unsupported:', e);
    }
  }
};

// ==================== DESIGN PATTERNS & UTILITIES ====================

function playBudgieChirp(ctx: AudioContext, destination: AudioNode, time: number, startF: number, endF: number, dur: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  // Budgies use sine/triangle with a fast vibrato (chatter)
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(startF, time);
  osc.frequency.exponentialRampToValueAtTime(endF, time + dur);
  
  // Adding frequency modification for realistic bird flutter
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.setValueAtTime(45, time); // 45hz micro-vibrato
  lfoGain.gain.setValueAtTime(120, time); // vibrato amplitude
  
  lfo.connect(lfoGain);
  lfoGain.connect(osc.frequency);
  
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(0.2, time + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);
  
  osc.connect(gain);
  gain.connect(destination);
  
  lfo.start(time);
  osc.start(time);
  
  lfo.stop(time + dur);
  osc.stop(time + dur + 0.02);
}

function playParrotletChirp(ctx: AudioContext, destination: AudioNode, time: number, startF: number, endF: number, dur: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  // Triangles and sines make parrotlets sound crisp and cute
  osc.type = 'sine';
  osc.frequency.setValueAtTime(startF, time);
  osc.frequency.linearRampToValueAtTime(endF, time + dur);
  
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(0.25, time + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
  
  osc.connect(gain);
  gain.connect(destination);
  
  osc.start(time);
  osc.stop(time + dur + 0.02);
}

function playLovebirdChirp(ctx: AudioContext, destination: AudioNode, time: number, startF: number, endF: number, dur: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  // Lovebirds have louder, richer screeches with multiple harmonic frequencies
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(startF, time);
  osc.frequency.exponentialRampToValueAtTime(endF, time + dur);
  
  // Harmonic overtone
  const subOsc = ctx.createOscillator();
  subOsc.type = 'sine';
  subOsc.frequency.setValueAtTime(startF * 1.5, time);
  subOsc.frequency.exponentialRampToValueAtTime(endF * 1.5, time + dur);
  
  const subGain = ctx.createGain();
  subGain.gain.setValueAtTime(0.08, time);
  subGain.gain.exponentialRampToValueAtTime(0.0001, time + dur);
  
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(0.3, time + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);
  
  osc.connect(gain);
  subOsc.connect(subGain);
  subGain.connect(destination);
  gain.connect(destination);
  
  osc.start(time);
  subOsc.start(time);
  
  osc.stop(time + dur + 0.02);
  subOsc.stop(time + dur + 0.02);
}

function playBellPip(ctx: AudioContext, destination: AudioNode, time: number, freq: number, dur: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, time);
  
  // Beautiful round attack and decay characteristic of finches/Java Sparrows
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(0.35, time + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);
  
  osc.connect(gain);
  gain.connect(destination);
  
  osc.start(time);
  osc.stop(time + dur + 0.01);
}

function playPureWhistle(ctx: AudioContext, destination: AudioNode, time: number, startF: number, endF: number, dur: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(startF, time);
  osc.frequency.exponentialRampToValueAtTime(endF, time + dur);
  
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(0.25, time + 0.04); // slow sweep attack for flute-like feel
  gain.gain.exponentialRampToValueAtTime(0.0005, time + dur);
  
  osc.connect(gain);
  gain.connect(destination);
  
  osc.start(time);
  osc.stop(time + dur + 0.05);
}

function playSharpReprimand(ctx: AudioContext, destination: AudioNode, time: number, freq: number, dur: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  // Sawtooth/triangle represents slightly sharp or buzzy disapproval
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(freq, time);
  osc.frequency.linearRampToValueAtTime(freq - 600, time + dur);
  
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(0.12, time + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);
  
  osc.connect(gain);
  gain.connect(destination);
  
  osc.start(time);
  osc.stop(time + dur + 0.02);
}

function playBuzzyClick(ctx: AudioContext, destination: AudioNode, time: number, startF: number, endF: number, dur: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(startF, time);
  osc.frequency.linearRampToValueAtTime(endF, time + dur);
  
  // Frequency modulator for severe buzzed friction
  const fm = ctx.createOscillator();
  const fmGain = ctx.createGain();
  fm.frequency.setValueAtTime(150, time);
  fmGain.gain.setValueAtTime(450, time);
  
  fm.connect(fmGain);
  fmGain.connect(osc.frequency);
  
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(0.15, time + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);
  
  osc.connect(gain);
  gain.connect(destination);
  
  fm.start(time);
  osc.start(time);
  
  fm.stop(time + dur);
  osc.stop(time + dur + 0.02);
}

function playJavaClickSound(ctx: AudioContext, destination: AudioNode, time: number, freq: number, dur: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(freq, time);
  osc.frequency.linearRampToValueAtTime(200, time + dur);
  
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(0.15, time + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);
  
  osc.connect(gain);
  gain.connect(destination);
  
  osc.start(time);
  osc.stop(time + dur + 0.02);
}

function playHarshSqueak(ctx: AudioContext, destination: AudioNode, time: number, freq: number, dur: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(freq, time);
  osc.frequency.linearRampToValueAtTime(freq + 400, time + dur);
  
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(0.1, time + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);
  
  osc.connect(gain);
  gain.connect(destination);
  
  osc.start(time);
  osc.stop(time + dur + 0.02);
}

function playHissingSound(ctx: AudioContext, destination: AudioNode, time: number, dur: number) {
  // Synthesize white noise for snake/dragon scale warning hissed sound
  const bufferSize = ctx.sampleRate * dur;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  
  const noiseNode = ctx.createBufferSource();
  noiseNode.buffer = buffer;
  
  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.setValueAtTime(5000, time);
  bandpass.Q.setValueAtTime(1.2, time);
  
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(0.08, time + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);
  
  noiseNode.connect(bandpass);
  bandpass.connect(gain);
  gain.connect(destination);
  
  noiseNode.start(time);
  noiseNode.stop(time + dur + 0.01);
}

function playRingneckWhistle(ctx: AudioContext, destination: AudioNode, time: number, startF: number, peakF: number, endF: number, dur: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'sine';
  
  // Pitch envelope: slide up then down
  osc.frequency.setValueAtTime(startF, time);
  osc.frequency.linearRampToValueAtTime(peakF, time + dur * 0.45);
  osc.frequency.exponentialRampToValueAtTime(endF, time + dur);
  
  // Vibrato
  const vibrato = ctx.createOscillator();
  const vibratoGain = ctx.createGain();
  vibrato.frequency.setValueAtTime(10, time); // 10Hz gentle warble
  vibratoGain.gain.setValueAtTime(60, time); // depth
  
  vibrato.connect(vibratoGain);
  vibratoGain.connect(osc.frequency);
  
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(0.28, time + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);
  
  osc.connect(gain);
  gain.connect(destination);
  
  vibrato.start(time);
  osc.start(time);
  
  vibrato.stop(time + dur);
  osc.stop(time + dur + 0.02);
}

function playRingneckScreech(ctx: AudioContext, destination: AudioNode, time: number, startF: number, endF: number, dur: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(startF, time);
  osc.frequency.exponentialRampToValueAtTime(endF, time + dur);
  
  const vibrato = ctx.createOscillator();
  const vibratoGain = ctx.createGain();
  vibrato.frequency.setValueAtTime(32, time); // fast harsh rattle
  vibratoGain.gain.setValueAtTime(220, time);
  
  vibrato.connect(vibratoGain);
  vibratoGain.connect(osc.frequency);
  
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(0.22, time + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);
  
  osc.connect(gain);
  gain.connect(destination);
  
  vibrato.start(time);
  osc.start(time);
  
  vibrato.stop(time + dur);
  osc.stop(time + dur + 0.02);
}
