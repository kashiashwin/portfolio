/**
 * Renders an interactive, animated 2D Canvas Radar Chart & Skill Matrix.
 * Distinguishes high proficiency in Python (95%) from C (70%), C++ (75%), and Java (68%).
 */

const skillData = [
  { label: 'Python (Primary)', score: 0.95, color: '#00f0ff', isPrimary: true },
  { label: 'C Language', score: 0.70, color: '#818cf8', isPrimary: false },
  { label: 'C++', score: 0.75, color: '#a855f7', isPrimary: false },
  { label: 'Java', score: 0.68, color: '#f43f5e', isPrimary: false },
  { label: 'JavaScript / Web', score: 0.88, color: '#38bdf8', isPrimary: false },
  { label: 'SQL / Databases', score: 0.80, color: '#34d399', isPrimary: false },
];

export function initSkillsRadar() {
  const canvas = document.getElementById('skills-radar-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationProgress = 0;

  function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const size = Math.min(rect.width, 480);
    canvas.width = size * window.devicePixelRatio;
    canvas.height = size * window.devicePixelRatio;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function drawRadar() {
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const radius = (w / 2) * 0.72;
    const numSkills = skillData.length;

    ctx.clearRect(0, 0, w, h);

    // Concentric Web Grid Rings
    const rings = 5;
    for (let r = 1; r <= rings; r++) {
      const ringR = (radius / rings) * r;
      ctx.strokeStyle = r === rings ? 'rgba(0, 240, 255, 0.4)' : 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = r === rings ? 2 : 1;
      ctx.beginPath();

      for (let i = 0; i < numSkills; i++) {
        const angle = (i * 2 * Math.PI) / numSkills - Math.PI / 2;
        const x = cx + Math.cos(angle) * ringR;
        const y = cy + Math.sin(angle) * ringR;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    // Radial Axis Lines & Labels
    skillData.forEach((skill, i) => {
      const angle = (i * 2 * Math.PI) / numSkills - Math.PI / 2;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
      ctx.stroke();

      // Axis Label Text
      const labelDistance = radius + 28 * window.devicePixelRatio;
      const lx = cx + Math.cos(angle) * labelDistance;
      const ly = cy + Math.sin(angle) * labelDistance;

      ctx.font = `${skill.isPrimary ? 'bold 14px' : '12px'} system-ui, sans-serif`;
      ctx.fillStyle = skill.isPrimary ? '#00f0ff' : '#94a3b8';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(skill.label, lx, ly);
    });

    // Polygon Data Fill
    ctx.beginPath();
    skillData.forEach((skill, i) => {
      const angle = (i * 2 * Math.PI) / numSkills - Math.PI / 2;
      const currentScore = skill.score * animationProgress;
      const r = radius * currentScore;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();

    // Radial Gradient Fill
    const fillGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    fillGrad.addColorStop(0, 'rgba(0, 240, 255, 0.45)');
    fillGrad.addColorStop(0.7, 'rgba(168, 85, 247, 0.3)');
    fillGrad.addColorStop(1, 'rgba(99, 102, 241, 0.15)');

    ctx.fillStyle = fillGrad;
    ctx.fill();

    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2.5 * window.devicePixelRatio;
    ctx.stroke();

    // Skill Data Point Nodes
    skillData.forEach((skill, i) => {
      const angle = (i * 2 * Math.PI) / numSkills - Math.PI / 2;
      const currentScore = skill.score * animationProgress;
      const r = radius * currentScore;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;

      // Glow halo for Python
      if (skill.isPrimary) {
        ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(x, y, 12 * window.devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = skill.color;
      ctx.beginPath();
      ctx.arc(x, y, (skill.isPrimary ? 6 : 4) * window.devicePixelRatio, 0, Math.PI * 2);
      ctx.fill();
    });

    if (animationProgress < 1) {
      animationProgress += 0.02;
      requestAnimationFrame(drawRadar);
    }
  }

  // Trigger when visible in viewport
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animationProgress = 0;
      drawRadar();
      observer.disconnect();
    }
  }, { threshold: 0.3 });

  observer.observe(canvas);
}
