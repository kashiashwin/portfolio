import { initThreeSetup } from './threeSetup.js';
import { buildCosmicScene, updateCosmicScene } from './cosmicScene.js';
import { initScrollAnimation } from './scrollAnimation.js';
import { initSkillsRadar } from './skillsRadar.js';
import { initProjectsModal } from './projectsModal.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Three.js Setup
  const canvasElement = document.getElementById('bg');
  const { scene, camera, renderer } = initThreeSetup(canvasElement);

  // 2. Build 3D Cosmic Scene
  const sceneObjects = buildCosmicScene(scene);

  // 3. Initialize GSAP ScrollTrigger Animation Timeline (Manual user scroll)
  initScrollAnimation(camera, sceneObjects);

  // 4. Mobile Hamburger Menu Toggle & Sleek Animations
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

  // Close menu when clicking any mobile nav link
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggleMobileMenu(false);
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (isMenuOpen && !mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
      toggleMobileMenu(false);
    }
  });

  // 5. Initialize Interactive UI Components
  initSkillsRadar();
  initProjectsModal();

  // 6. Contact Form Validation & Toast Notification
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;

      // Toast Feedback
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-6 right-6 z-50 glass-panel border border-emerald-400/60 p-4 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center gap-3 text-sm text-emerald-300 font-medium animate-bounce';
      toast.innerHTML = `
        <span class="text-xl">✅</span>
        <div>
          <span class="font-bold block">Message Sent Successfully!</span>
          <span class="text-xs text-slate-300">Thank you ${name}. Ashwin will respond to ${email} shortly.</span>
        </div>
      `;
      document.body.appendChild(toast);

      contactForm.reset();
      setTimeout(() => {
        toast.remove();
      }, 5000);
    });
  }

  // 7. Three.js Animation Loop
  let clock = { getElapsedTime: () => performance.now() * 0.001 };
  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Update 3D scene breathing, particle movement, & camera Z visibility checks
    updateCosmicScene(elapsedTime, camera.position.z);

    // Render Three.js frame
    renderer.render(scene, camera);
  }

  animate();
});
