/**
 * Procedural Web Audio API Sound Synthesizer for 3D Cosmic Zoom.
 * Generates a crisp, futuristic "Whoosh / Space Warp" sound effect without any external asset dependencies.
 */

let audioCtx = null;
let lastScrollY = window.scrollY;
let lastSoundTime = 0;

function unlockAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// Generate procedural white noise buffer for whoosh physics
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
 * Triggers a procedural sci-fi whoosh sound effect based on scroll velocity
 */
export function playWhooshSound(intensity = 1.0) {
  unlockAudioContext();
  if (!audioCtx) return;

  const now = Date.now();
  // Throttle whoosh sound (min 150ms gap) for smooth playback
  if (now - lastSoundTime < 150) return;
  lastSoundTime = now;

  try {
    const duration = 0.4 + Math.min(intensity * 0.2, 0.3);
    const noiseBuffer = createNoiseBuffer(audioCtx, duration);
    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    // Bandpass Filter Sweep for "Whoosh" resonance
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 2.5;

    // Sweep filter frequency from 150Hz up to 2400Hz and back down to 100Hz
    const startTime = audioCtx.currentTime;
    filter.frequency.setValueAtTime(150, startTime);
    filter.frequency.exponentialRampToValueAtTime(2400 * Math.max(intensity, 0.8), startTime + duration * 0.4);
    filter.frequency.exponentialRampToValueAtTime(90, startTime + duration);

    // Sub-bass Sine Oscillator for deep cosmic rumble impact
    const subOsc = audioCtx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(160, startTime);
    subOsc.frequency.exponentialRampToValueAtTime(50, startTime + duration);

    const subGain = audioCtx.createGain();
    subGain.gain.setValueAtTime(0.4 * intensity, startTime);
    subGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    subOsc.connect(subGain);
    subGain.connect(audioCtx.destination);
    subOsc.start(startTime);
    subOsc.stop(startTime + duration);

    // Master Volume Envelope (Increased gain for clear audibility)
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.01, startTime);
    gainNode.gain.linearRampToValueAtTime(0.65 * Math.min(intensity, 1.2), startTime + duration * 0.3);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    noiseSource.start(startTime);
    noiseSource.stop(startTime + duration);
  } catch (err) {
    // Ignore audio autoplay restrictions gracefully
  }
}

// Global listener to trigger whoosh sound on mouse wheel, touch, and scroll velocity
export function initAudioScrollTrigger() {
  const triggerCheck = (delta) => {
    const zoomSpace = document.getElementById('cosmic-zoom-space');
    if (zoomSpace) {
      const rect = zoomSpace.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        const intensity = Math.min(Math.max(delta / 20, 0.8), 1.5);
        playWhooshSound(intensity);
      }
    }
  };

  // Scroll listener
  window.addEventListener('scroll', () => {
    unlockAudioContext();
    const currentScrollY = window.scrollY;
    const delta = Math.abs(currentScrollY - lastScrollY);
    lastScrollY = currentScrollY;

    if (delta > 3) {
      triggerCheck(delta);
    }
  }, { passive: true });

  // Mouse wheel listener (triggers instantly when trackpad/mouse is scrolled)
  window.addEventListener('wheel', (e) => {
    unlockAudioContext();
    const delta = Math.abs(e.deltaY);
    if (delta > 3) {
      triggerCheck(delta);
    }
  }, { passive: true });

  // Touch move listener (mobile swipe)
  window.addEventListener('touchmove', () => {
    unlockAudioContext();
    triggerCheck(15);
  }, { passive: true });

  // Unlock AudioContext on any user interaction
  const unlockEvents = ['click', 'touchstart', 'keydown', 'pointerdown'];
  unlockEvents.forEach((evt) => {
    window.addEventListener(evt, unlockAudioContext, { once: false, passive: true });
  });
}
