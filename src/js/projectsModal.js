/**
 * Projects Gallery Filter & Interactive Detail Modal Manager
 */

export const projectsData = [
  {
    id: 'cucek-portal',
    title: 'CUCEK Academic Portal & LMS',
    category: 'Full-Stack',
    tag: 'Python / Flask / PostgreSQL',
    shortDesc: 'A unified campus portal for CUCEK students to track attendance, SGPA marks, lecture notes, and campus announcements.',
    fullDesc: 'Built specifically for Cochin University College of Engineering Kuttanad (CUCEK). Features automated SGPA/CGPA grade calculators, real-time assignment submission notifications, and a responsive glassmorphic dashboard.',
    features: [
      'Automated SGPA & CGPA calculation algorithms based on CUSAT university grading scheme',
      'Role-based access control for students and faculty',
      'Real-time lecture notes sharing & pdf resource search',
      'Integrated dark mode and offline PWA capability'
    ],
    techStack: ['Python', 'Flask', 'PostgreSQL', 'Tailwind CSS', 'JavaScript'],
    github: 'https://github.com/ashwin-cucek/cucek-portal',
    demo: '#',
    bgGradient: 'from-blue-600/30 to-indigo-900/50',
    icon: '🎓'
  },
  {
    id: 'cosmic-galaxy-3d',
    title: 'Cosmic Engine 3D SPA',
    category: '3D Web',
    tag: 'Three.js / GSAP / WebGL',
    shortDesc: 'An interactive WebGL 3D universe visualizer featuring real-time particle physics and logarithmic camera zoom animations.',
    fullDesc: 'An immersive web experience that renders galaxy spirals, celestial lighting, and smooth Z-axis camera transitions using Three.js and GSAP ScrollTrigger.',
    features: [
      'Procedural canvas texture generation eliminating heavy external assets',
      '60 FPS particle simulations across 10,000+ stars using buffer geometries',
      'ScrollTrigger synchronized timeline for seamless deep-space navigation'
    ],
    techStack: ['JavaScript', 'Three.js', 'GSAP', 'HTML5 Canvas', 'Vite'],
    github: 'https://github.com/ashwin-cucek/cosmic-3d-engine',
    demo: '#',
    bgGradient: 'from-purple-600/30 to-pink-900/50',
    icon: '🌌'
  },
  {
    id: 'python-mini-compiler',
    title: 'Python AST Code Tutor & Compiler',
    category: 'Python / AI',
    tag: 'Python / AST / Pyodide',
    shortDesc: 'An interactive Python execution sandbox and syntax tree tutor built for amateur developers learning DSA in C/C++ & Python.',
    fullDesc: 'Analyzes Python code via Abstract Syntax Trees (AST) to generate visual memory execution stacks, variable mutation graphs, and automated optimization feedback.',
    features: [
      'AST parsing for instant syntax error pinpointing and visual execution trace',
      'Client-side Python execution powered by Pyodide in WebAssembly',
      'Side-by-side comparison mode for Python vs C/C++ memory allocation'
    ],
    techStack: ['Python', 'AST Parser', 'WebAssembly', 'JavaScript', 'Tailwind CSS'],
    github: 'https://github.com/ashwin-cucek/python-ast-tutor',
    demo: '#',
    bgGradient: 'from-cyan-600/30 to-teal-900/50',
    icon: '🐍'
  },
  {
    id: 'cucek-event-hub',
    title: 'Tech Fest & Hackathon Dashboard',
    category: 'Full-Stack',
    tag: 'Node.js / Express / MongoDB',
    shortDesc: 'Real-time event registration and leaderboard portal for CUCEK engineering tech fests.',
    fullDesc: 'Handles live team registrations, QR code ticket generation, and real-time live scoreboard updates for coding competitions and hackathons.',
    features: [
      'Automated QR code pass generation for workshop check-ins',
      'Real-time WebSocket leaderboard updates during competitive coding rounds',
      'Razorpay test sandbox integration for workshop tickets'
    ],
    techStack: ['JavaScript', 'Node.js', 'Express', 'MongoDB', 'Socket.io'],
    github: 'https://github.com/ashwin-cucek/cucek-techfest',
    demo: '#',
    bgGradient: 'from-amber-600/30 to-orange-900/50',
    icon: '⚡'
  }
];

export function initProjectsModal() {
  const modal = document.getElementById('project-modal');
  const modalContainer = document.getElementById('modal-container');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalDesc = document.getElementById('modal-desc');
  const modalFeatures = document.getElementById('modal-features');
  const modalTech = document.getElementById('modal-tech');
  const modalGithub = document.getElementById('modal-github');
  const modalClose = document.getElementById('modal-close');

  if (!modal) return;

  // Render project cards into container
  const grid = document.getElementById('projects-grid');
  if (grid) {
    grid.innerHTML = projectsData.map(p => `
      <div data-id="${p.id}" data-category="${p.category}" class="project-card group relative bg-slate-900/60 backdrop-blur-xl border border-slate-800 hover:border-cyan-400/60 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(0,240,255,0.2)] cursor-pointer">
        <div class="h-44 w-full rounded-xl bg-gradient-to-br ${p.bgGradient} flex items-center justify-center mb-5 relative overflow-hidden group-hover:scale-[1.02] transition-transform">
          <span class="text-6xl group-hover:scale-125 transition-transform duration-300">${p.icon}</span>
          <span class="absolute top-3 right-3 text-xs font-semibold px-3 py-1 bg-slate-950/70 border border-cyan-500/30 text-cyan-300 rounded-full">${p.category}</span>
        </div>
        <h3 class="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">${p.title}</h3>
        <p class="text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed">${p.shortDesc}</p>
        <div class="flex flex-wrap gap-2 mb-4">
          ${p.techStack.slice(0, 4).map(t => `<span class="text-[11px] px-2.5 py-0.5 bg-slate-800 text-slate-300 rounded-md border border-slate-700">${t}</span>`).join('')}
        </div>
        <div class="flex items-center justify-between text-xs text-cyan-400 font-medium">
          <span>View Details & Specs &rarr;</span>
        </div>
      </div>
    `).join('');
  }

  // Card click handler -> Open Modal
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const pId = card.getAttribute('data-id');
      const project = projectsData.find(p => p.id === pId);
      if (!project) return;

      modalTitle.innerText = project.title;
      modalCategory.innerText = project.category;
      modalDesc.innerText = project.fullDesc;

      modalFeatures.innerHTML = project.features.map(f => `
        <li class="flex items-start gap-2 text-slate-300 text-sm">
          <span class="text-cyan-400 font-bold mt-0.5">✓</span>
          <span>${f}</span>
        </li>
      `).join('');

      modalTech.innerHTML = project.techStack.map(t => `
        <span class="text-xs px-3 py-1 bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono rounded-lg">${t}</span>
      `).join('');

      modalGithub.href = project.github;

      modal.classList.remove('hidden');
      setTimeout(() => {
        modal.classList.remove('opacity-0');
        modalContainer.classList.remove('scale-95');
      }, 10);
    });
  });

  // Filter functionality
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('bg-cyan-500', 'text-black', 'font-bold'));
      filterBtns.forEach(b => b.classList.add('bg-slate-800/80', 'text-slate-300'));
      btn.classList.remove('bg-slate-800/80', 'text-slate-300');
      btn.classList.add('bg-cyan-500', 'text-black', 'font-bold');

      const filter = btn.getAttribute('data-filter');
      document.querySelectorAll('.project-card').forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Close Modal
  function closeModal() {
    modal.classList.add('opacity-0');
    modalContainer.classList.add('scale-95');
    setTimeout(() => {
      modal.classList.add('hidden');
    }, 250);
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}
