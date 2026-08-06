import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let mainTimeline;

export function initScrollAnimation(camera, sceneObjects) {
  const { universeSphere } = sceneObjects;

  mainTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: '#cosmic-zoom-space',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.2,
    },
  });

  // -------------------------------------------------------------
  // PHASE 0: Hero Overlay & Main Appbar Fade Out on Zoom
  // (Main appbar disappears when zooming in & STAYS HIDDEN until zoomed out to the VERY START)
  // -------------------------------------------------------------
  mainTimeline.to('#hero-overlay', {
    opacity: 0,
    pointerEvents: 'none',
    duration: 1,
    ease: 'power1.out',
  }, 'phase0');

  mainTimeline.to('#main-header', {
    opacity: 0,
    pointerEvents: 'none',
    duration: 0.5,
    ease: 'power1.out',
  }, 'phase0');

  // Ensure Mobile Hamburger Menu STAYS VISIBLE AFTER ZOOM IN on mobile
  mainTimeline.to('#mobile-menu-wrapper', {
    opacity: 1,
    pointerEvents: 'auto',
    duration: 0.5,
  }, 'phase0');

  // -------------------------------------------------------------
  // PHASE 1: Enter Universe & Zoom Past Galaxies / Nebulae
  // Camera Z moves from 300 to -350
  // -------------------------------------------------------------
  mainTimeline.to(camera.position, {
    z: -350,
    x: 0,
    y: 0,
    duration: 4,
    ease: 'power1.inOut',
  }, 'phase1');

  if (universeSphere) {
    mainTimeline.to(universeSphere.scale, {
      x: 3.5,
      y: 3.5,
      z: 3.5,
      duration: 3,
      ease: 'power1.inOut',
    }, 'phase1');
    mainTimeline.to(universeSphere.material, {
      opacity: 0.05,
      transparent: true,
      duration: 1.5,
    }, 'phase1+=1');
  }

  mainTimeline.to('#cosmic-hud-overlay', {
    opacity: 1,
    duration: 1,
  }, 'phase1+=0.5');

  mainTimeline.call(() => {
    const hudStatus = document.getElementById('hud-status');
    const hudTarget = document.getElementById('hud-target');
    if (hudStatus) hudStatus.innerText = 'HUD: PHASE 1 • DEEP SPACE';
    if (hudTarget) hudTarget.innerText = 'TARGET: MILKY WAY';
  }, null, 'phase1+=1');

  // -------------------------------------------------------------
  // PHASE 2: Completely Enter Milky Way & Zoom Into Our Star Cluster (Z = -350 to -750)
  // -------------------------------------------------------------
  mainTimeline.to(camera.position, {
    z: -750,
    x: 12,
    y: 5,
    duration: 4,
    ease: 'power2.inOut',
  }, 'phase2');

  mainTimeline.call(() => {
    const hudStatus = document.getElementById('hud-status');
    const hudTarget = document.getElementById('hud-target');
    if (hudStatus) hudStatus.innerText = 'HUD: PHASE 2 • INSIDE MILKY WAY GALAXY';
    if (hudTarget) hudTarget.innerText = 'TARGET: OUR STAR CLUSTER';
  }, null, 'phase2+=1');

  // -------------------------------------------------------------
  // PHASE 3: Zoom Into Our Cluster & Solar System -> Earth & Moon (Z = -750 to -1068)
  // -------------------------------------------------------------
  mainTimeline.to(camera.position, {
    z: -1068,
    x: 2,
    y: 0.5,
    duration: 5,
    ease: 'power3.out',
  }, 'phase3');

  mainTimeline.call(() => {
    const hudStatus = document.getElementById('hud-status');
    const hudTarget = document.getElementById('hud-target');
    if (hudStatus) hudStatus.innerText = 'HUD: PHASE 3 • INSIDE OUR CLUSTER';
    if (hudTarget) hudTarget.innerText = 'TARGET: SOLAR SYSTEM & EARTH';
  }, null, 'phase3+=1');

  mainTimeline.to('#cosmic-hud-overlay', {
    opacity: 0,
    duration: 1,
  }, 'phase3+=4');
}
