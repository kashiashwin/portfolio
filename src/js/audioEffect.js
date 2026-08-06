/**
 * Procedural Web Audio API Sound Synthesizer for 3D Cosmic Zoom.
 * Generates an epic, futuristic "Space Warp / Hyperdrive Whoosh" sound effect without external audio files.
 * Automatically STOPS after Earth loads (camera.position.z <= -980).
 */

let audioCtx = null;
let lastScrollY = window.scrollY;
let lastSoundTime = 0;
let soundEnabled = true;
let activeCamera = null;

export function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Generate procedural white noise buffer for whoosh air physics
function createNoiseBuffer(ctx, duration = 0.5) {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

/**
 * Triggers an epic sci-fi whoosh sound effect on scroll zoom
 * Automatically SILENT once Earth loads (camera.position.z <= -980)
 */
export function playWhooshSound(intensity = 1.0) {
  if (!soundEnabled) return;
  // Stop SFX after Earth loads (camera.position.z <= -980)
  if (activeCamera && activeCamera.position.z <= -980) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  const now = Date.now();
  if (now - lastSoundTime < 140) return;
  lastSoundTime = now;

  try {
    const duration = 0.45 + Math.min(intensity * 0.25, 0.35);
    const startTime = ctx.currentTime;

    // 1. White Noise Bandpass Filter Sweep (Air Whoosh)
    const noiseBuffer = createNoiseBuffer(ctx, duration);
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 2.0;
    filter.frequency.setValueAtTime(140, startTime);
    filter.frequency.exponentialRampToValueAtTime(2800 * Math.max(intensity, 0.9), startTime + duration * 0.45);
    filter.frequency.exponentialRampToValueAtTime(80, startTime + duration);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.01, startTime);
    noiseGain.gain.linearRampToValueAtTime(0.55 * Math.min(intensity, 1.3), startTime + duration * 0.35);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    noiseSource.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    // 2. Sci-Fi Pitch Glide Oscillator (Hyperdrive Sci-Fi Sound)
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(90, startTime);
    osc.frequency.exponentialRampToValueAtTime(480 * Math.max(intensity, 0.8), startTime + duration * 0.4);
    osc.frequency.exponentialRampToValueAtTime(60, startTime + duration);

    const oscFilter = ctx.createBiquadFilter();
    oscFilter.type = 'lowpass';
    oscFilter.frequency.setValueAtTime(800, startTime);

    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.01, startTime);
    oscGain.gain.linearRampToValueAtTime(0.25 * Math.min(intensity, 1.1), startTime + duration * 0.3);
    oscGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(oscFilter);
    oscFilter.connect(oscGain);
    oscGain.connect(ctx.destination);

    // 3. Sub-Bass Deep Impulse Rumble
    const subOsc = ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(150, startTime);
    subOsc.frequency.exponentialRampToValueAtTime(40, startTime + duration);

    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0.45 * intensity, startTime);
    subGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);

    // Start all procedural sound nodes
    noiseSource.start(startTime);
    noiseSource.stop(startTime + duration);

    osc.start(startTime);
    osc.stop(startTime + duration);

    subOsc.start(startTime);
    subOsc.stop(startTime + duration);
  } catch (err) {
    // Ignore audio restrictions
  }
}

// Global listener to trigger whoosh sound on mouse wheel, touch, and scroll velocity
export function initAudioScrollTrigger(camera) {
  activeCamera = camera;

  const triggerCheck = (delta) => {
    // Stop SFX after Earth loads (camera.position.z <= -980)
    if (activeCamera && activeCamera.position.z <= -980) return;

    const zoomSpace = document.getElementById('cosmic-zoom-space');
    if (zoomSpace) {
      const rect = zoomSpace.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        const intensity = Math.min(Math.max(delta / 18, 0.8), 1.5);
        playWhooshSound(intensity);
      }
    }
  };

  // Immediate event listeners to unlock Web Audio API Context
  const unlock = () => getAudioContext();

  ['click', 'touchstart', 'pointerdown', 'keydown', 'wheel', 'scroll'].forEach((evt) => {
    window.addEventListener(evt, unlock, { passive: true });
  });

  // Scroll listener
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const delta = Math.abs(currentScrollY - lastScrollY);
    lastScrollY = currentScrollY;

    if (delta > 2) {
      triggerCheck(delta);
    }
  }, { passive: true });

  // Mouse wheel listener (triggers instantly when trackpad or mouse wheel moves)
  window.addEventListener('wheel', (e) => {
    const delta = Math.abs(e.deltaY);
    if (delta > 2) {
      triggerCheck(delta);
    }
  }, { passive: true });

  // Touch move listener (mobile swipe)
  window.addEventListener('touchmove', () => {
    triggerCheck(15);
  }, { passive: true });
}
