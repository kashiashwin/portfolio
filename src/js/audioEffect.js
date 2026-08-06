/**
 * Procedural Web Audio API Sound Synthesizer for 3D Cosmic Zoom.
 * Generates a subtle, ambient "Space Warp / Soft Whoosh" sound effect.
 * Automatically STOPS at the very start (camera.position.z >= 270 / scrollY <= 40) AND after Earth loads (camera.position.z <= -980).
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

// Generate procedural white noise buffer for soft whoosh air physics
function createNoiseBuffer(ctx, duration = 0.4) {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

/**
 * Triggers a subtle, ambient sci-fi whoosh sound effect on scroll zoom
 * Automatically SILENT at the very start (camera.position.z >= 270) AND after Earth loads (camera.position.z <= -980)
 */
export function playWhooshSound(intensity = 1.0) {
  if (!soundEnabled) return;

  // Stop SFX at the very start OR after Earth loads
  const isAtVeryStart = window.scrollY <= 40 || (activeCamera && activeCamera.position.z >= 270);
  const isPastEarth = activeCamera && activeCamera.position.z <= -980;
  if (isAtVeryStart || isPastEarth) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  const now = Date.now();
  if (now - lastSoundTime < 180) return;
  lastSoundTime = now;

  try {
    const duration = 0.35 + Math.min(intensity * 0.15, 0.25);
    const startTime = ctx.currentTime;

    // 1. Soft White Noise Bandpass Filter Sweep (Warm & Subtle Air Whoosh)
    const noiseBuffer = createNoiseBuffer(ctx, duration);
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 1.5;
    filter.frequency.setValueAtTime(120, startTime);
    filter.frequency.exponentialRampToValueAtTime(1100 * Math.max(intensity, 0.8), startTime + duration * 0.4);
    filter.frequency.exponentialRampToValueAtTime(70, startTime + duration);

    // Subtle, low gain envelope
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.005, startTime);
    noiseGain.gain.linearRampToValueAtTime(0.14 * Math.min(intensity, 1.1), startTime + duration * 0.3);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    noiseSource.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    // 2. Gentle Sub-Bass Cushion (Deep ambient warmth)
    const subOsc = ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(110, startTime);
    subOsc.frequency.exponentialRampToValueAtTime(35, startTime + duration);

    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0.1 * intensity, startTime);
    subGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);

    // Start subtle sound nodes
    noiseSource.start(startTime);
    noiseSource.stop(startTime + duration);

    subOsc.start(startTime);
    subOsc.stop(startTime + duration);
  } catch (err) {
    // Ignore audio restrictions
  }
}

// Global listener to trigger subtle whoosh sound on mouse wheel, touch, and scroll velocity
export function initAudioScrollTrigger(camera) {
  activeCamera = camera;

  const triggerCheck = (delta) => {
    // Stop SFX at the very start OR after Earth loads
    const isAtVeryStart = window.scrollY <= 40 || (activeCamera && activeCamera.position.z >= 270);
    const isPastEarth = activeCamera && activeCamera.position.z <= -980;
    if (isAtVeryStart || isPastEarth) return;

    const zoomSpace = document.getElementById('cosmic-zoom-space');
    if (zoomSpace) {
      const rect = zoomSpace.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        const intensity = Math.min(Math.max(delta / 25, 0.6), 1.1);
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

    if (delta > 4) {
      triggerCheck(delta);
    }
  }, { passive: true });

  // Mouse wheel listener (triggers instantly when trackpad or mouse wheel moves)
  window.addEventListener('wheel', (e) => {
    const delta = Math.abs(e.deltaY);
    if (delta > 4) {
      triggerCheck(delta);
    }
  }, { passive: true });

  // Touch move listener (mobile swipe)
  window.addEventListener('touchmove', () => {
    triggerCheck(15);
  }, { passive: true });
}
