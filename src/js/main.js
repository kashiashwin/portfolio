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

  // 4. Initialize Web Audio API Whoosh Sound Effect on Scroll Zoom (Stops after Earth loads)
  initAudioScrollTrigger(camera);

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

  // 8. Contact Form Handler (FormSubmit integration to ashwinkashi897@gmail.com)
  const contactForm = document.getElementById('contact-form');
  const contactStatus = document.getElementById('contact-form-status');
  const submitBtn = document.getElementById('contact-submit-btn');

  function showStatus(msg, isSuccess) {
    if (!contactStatus) return;
    contactStatus.classList.remove('hidden', 'bg-cyan-500/20', 'border-cyan-500/40', 'text-cyan-300', 'bg-rose-500/20', 'border-rose-500/40', 'text-rose-300');
    if (isSuccess) {
      contactStatus.classList.add('bg-cyan-500/20', 'border', 'border-cyan-500/40', 'text-cyan-300');
    } else {
      contactStatus.classList.add('bg-rose-500/20', 'border', 'border-rose-500/40', 'text-rose-300');
    }
    contactStatus.innerText = msg;
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;
      const subject = document.getElementById('contact-subject').value;
      const message = document.getElementById('contact-message').value;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Sending Email... 🚀';
      }

      showStatus('Sending your message directly to ashwinkashi897@gmail.com...', true);

      try {
        const response = await fetch('https://formsubmit.co/ajax/ashwinkashi897@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name,
            email,
            _subject: `[Portfolio Collaboration] ${subject}`,
            message,
          })
        });

        if (response.ok) {
          showStatus('✨ Message sent successfully! Ashwin will receive your email at ashwinkashi897@gmail.com shortly.', true);
          contactForm.reset();
        } else {
          showStatus('⚠️ Direct dispatch failed. Opening your default mail client...', false);
          window.location.href = `mailto:ashwinkashi897@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
        }
      } catch (err) {
        showStatus('⚠️ Opening default email client...', false);
        window.location.href = `mailto:ashwinkashi897@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = 'Send Message to Ashwin\'s Email →';
        }
      }
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
