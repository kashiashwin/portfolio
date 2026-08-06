/**
 * Procedural Web Audio API Sound Synthesizer for 3D Cosmic Zoom.
 * Generates a sleek, futuristic "Whoosh / Space Warp" sound effect without any external MP3 dependencies.
 */

let audioCtx = null;
let lastScrollY = window.scrollY;
let lastSoundTime = 0;

function initAudioContext() {
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
function createNoiseBuffer(ctx, duration = 0.6) {
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
  initAudioContext();
  if (!audioCtx) return;

  const now = Date.now();
  // Throttle whoosh sounds so they don't overlap too intensely (min 200ms gap)
  if (now - lastSoundTime < 220) return;
  lastSoundTime = now;

  try {
    const duration = 0.5 + Math.min(intensity * 0.3, 0.4);
    const noiseBuffer = createNoiseBuffer(audioCtx, duration);
    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    // Bandpass Filter Sweep for "Whoosh" resonance
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 3.5;

    // Sweep filter frequency from 150Hz up to 1800Hz and back down to 100Hz
    const startTime = audioCtx.currentTime;
    filter.frequency.setValueAtTime(120, startTime);
    filter.frequency.exponentialRampToValueAtTime(1600 * intensity, startTime + duration * 0.4);
    filter.frequency.exponentialRampToValueAtTime(80, startTime + duration);

    // Sub-bass Sine Oscillator for deep cosmic rumble impact
    const subOsc = audioCtx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(140, startTime);
    subOsc.frequency.exponentialRampToValueAtTime(45, startTime + duration);

    const subGain = audioCtx.createGain();
    subGain.gain.setValueAtTime(0.25 * intensity, startTime);
    subGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    subOsc.connect(subGain);
    subGain.connect(audioCtx.destination);
    subOsc.start(startTime);
    subOsc.stop(startTime + duration);

    // Master Volume Envelope
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.01, startTime);
    gainNode.gain.linearRampToValueAtTime(0.35 * Math.min(intensity, 1.2), startTime + duration * 0.3);
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

// Global listener to trigger whoosh sound on scroll velocity
export function initAudioScrollTrigger() {
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const delta = Math.abs(currentScrollY - lastScrollY);
    lastScrollY = currentScrollY;

    // Only play whoosh if scrolling rapidly inside cosmic zoom space (#cosmic-zoom-space)
    const zoomSpace = document.getElementById('cosmic-zoom-space');
    if (zoomSpace) {
      const rect = zoomSpace.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight && delta > 25) {
        const intensity = Math.min(delta / 60, 1.5);
        playWhooshSound(intensity);
      }
    }
  }, { passive: true });

  // Initialize AudioContext on first user click or tap
  const unlockAudio = () => {
    initAudioContext();
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
  };
  window.addEventListener('click', unlockAudio);
  window.addEventListener('touchstart', unlockAudio);
}
