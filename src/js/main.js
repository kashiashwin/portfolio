import { initThreeSetup } from './threeSetup.js';
import { buildCosmicScene, updateCosmicScene } from './cosmicScene.js';
import { initScrollAnimation } from './scrollAnimation.js';
import { initSkillsRadar } from './skillsRadar.js';
import { initProjectsModal } from './projectsModal.js';
import { initAudioScrollTrigger } from './audioEffect.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Three.js Setup
  const canvasElement = document.getElementById('bg');
  const { scene, camera, renderer } = initThreeSetup(canvasElement);

  // 2. Build 3D Cosmic Scene
  const sceneObjects = buildCosmicScene(scene);

  // 3. Initialize GSAP ScrollTrigger Animation Timeline (Manual user scroll)
  initScrollAnimation(camera, sceneObjects);

  // 4. Initialize Web Audio API Whoosh Sound Effect on Scroll Zoom
  initAudioScrollTrigger();

  // 5. Mobile Hamburger Menu Toggle & Sleek Animations
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const line1 = document.getElementById('hamburger-line1');
  const line2 = document.getElementById('hamburger-line2');
  const line3 = document.getElementById('hamburger-line3');
  let isMenuOpen = false;

  function toggleMobileMenu(open) {
    isMenuOpen = open !== undefined ? open : !isMenuOpen;

    if (isMenuOpen) {
      mobileMenu.classList.remove('hidden');
      setTimeout(() => {
        mobileMenu.classList.remove('opacity-0', 'scale-95');
        mobileMenu.classList.add('opacity-100', 'scale-100');
      }, 10);

      // Morph Hamburger lines into X
      if (line1) line1.style.transform = 'translateY(8px) rotate(45deg)';
      if (line2) line2.style.opacity = '0';
      if (line3) line3.style.transform = 'translateY(-8px) rotate(-45deg)';
    } else {
      mobileMenu.classList.remove('opacity-100', 'scale-100');
      mobileMenu.classList.add('opacity-0', 'scale-95');
      setTimeout(() => {
        mobileMenu.classList.add('hidden');
      }, 300);

      // Reset Hamburger lines
      if (line1) line1.style.transform = 'none';
      if (line2) line2.style.opacity = '1';
      if (line3) line3.style.transform = 'none';
    }
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });
  }

  // Close menu on clicking outside or selecting links
  document.addEventListener('click', (e) => {
    if (isMenuOpen && mobileMenu && !mobileMenu.contains(e.target) && e.target !== menuBtn) {
      toggleMobileMenu(false);
    }
  });

  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => toggleMobileMenu(false));
  });

  // 6. Initialize Skills Radar Matrix
  initSkillsRadar();

  // 7. Initialize Projects Modal Gallery
  initProjectsModal();

  // 8. Contact Form Handler
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value;
      alert(`Thank you ${name}! Your message has been sent successfully. Ashwin will get back to you shortly.`);
      contactForm.reset();
    });
  }

  // 9. Continuous WebGL Render Loop
  let clock = { getElapsedTime: () => performance.now() * 0.001 };
  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Pass camera Z position to control strict visibility states
    updateCosmicScene(elapsedTime, camera.position.z);
    renderer.render(scene, camera);
  }
  animate();
});
