/**
 * Web Audio API synthesizer for Chemical Atlas.
 * Generates realistic laboratory sound effects without any external audio files.
 */

let audioCtx: AudioContext | null = null;
let _muted = false;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

export function setMuted(muted: boolean) {
  _muted = muted;
}

export function isMuted(): boolean {
  return _muted;
}

/** Short UI click / tap */
export function playClick() {
  if (_muted) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1200, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.06);
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.08);
}

/** Glass beaker clink */
export function playBeakerClink() {
  if (_muted) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(3200, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.15);
  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.2);
}

/** Continuous fizzing/bubbling sound. Returns a stop function. */
export function playFizzing(): () => void {
  if (_muted) return () => {};
  const ctx = getCtx();
  const bufferSize = 2 * ctx.sampleRate;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  noise.loop = true;

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.value = 4000;
  bandpass.Q.value = 0.8;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.06, ctx.currentTime);

  noise.connect(bandpass).connect(gain).connect(ctx.destination);
  noise.start();

  return () => {
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    setTimeout(() => {
      try { noise.stop(); } catch { /* ignore */ }
    }, 350);
  };
}

/** Sizzle/combustion burst (sodium reaction) */
export function playSizzle() {
  if (_muted) return;
  const ctx = getCtx();
  const bufferSize = ctx.sampleRate;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'highpass';
  bandpass.frequency.value = 2000;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.18, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

  noise.connect(bandpass).connect(gain).connect(ctx.destination);
  noise.start();
  noise.stop(ctx.currentTime + 0.6);
}

/** Pop / small explosion */
export function playPop() {
  if (_muted) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(150, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.12);
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.15);
}

/** Success chime (quiz correct answer) */
export function playSuccess() {
  if (_muted) return;
  const ctx = getCtx();
  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.1);
    gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + i * 0.1 + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.35);
    osc.connect(gain).connect(ctx.destination);
    osc.start(ctx.currentTime + i * 0.1);
    osc.stop(ctx.currentTime + i * 0.1 + 0.35);
  });
}

/** Error / wrong answer buzz */
export function playError() {
  if (_muted) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(180, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(120, ctx.currentTime + 0.25);
  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.3);
}

/** Liquid pouring sound */
export function playPour() {
  if (_muted) return;
  const ctx = getCtx();
  const bufferSize = ctx.sampleRate;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.value = 1200;
  bandpass.Q.value = 1.5;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.15);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);

  noise.connect(bandpass).connect(gain).connect(ctx.destination);
  noise.start();
  noise.stop(ctx.currentTime + 0.7);
}

/** Bunsen burner ignition */
export function playBunsenIgnite() {
  if (_muted) return;
  const ctx = getCtx();
  // Pop ignition
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(200, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08);
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.1);

  // Sustained hiss
  const bufferSize = 2 * ctx.sampleRate;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 6000;
  bp.Q.value = 0.5;
  const g2 = ctx.createGain();
  g2.gain.setValueAtTime(0.001, ctx.currentTime);
  g2.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.15);
  g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
  noise.connect(bp).connect(g2).connect(ctx.destination);
  noise.start(ctx.currentTime + 0.05);
  noise.stop(ctx.currentTime + 1.2);
}
