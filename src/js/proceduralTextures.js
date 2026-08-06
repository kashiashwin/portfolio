import * as THREE from 'three';

/**
 * Creates high-quality procedural textures using HTML5 Canvas
 * to ensure 100% offline reliability, zero external asset dependencies, and ultra-fast loading.
 */

// Helper to create CanvasTexture from draw function
function createTextureFromCanvas(width, height, drawFn) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  drawFn(ctx, width, height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// 1. Hero Sleeping Universe Sphere Texture
export function createUniverseTexture() {
  return createTextureFromCanvas(1024, 512, (ctx, w, h) => {
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, '#030214');
    bgGrad.addColorStop(0.3, '#0b0826');
    bgGrad.addColorStop(0.7, '#140c36');
    bgGrad.addColorStop(1, '#05021a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 8; i++) {
      const cx = Math.random() * w;
      const cy = Math.random() * h;
      const r = 100 + Math.random() * 200;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      const hues = ['rgba(112, 0, 255, 0.25)', 'rgba(0, 212, 255, 0.2)', 'rgba(236, 72, 153, 0.18)', 'rgba(79, 70, 229, 0.22)'];
      grad.addColorStop(0, hues[i % hues.length]);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = 0; i < 800; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const size = Math.random() * 1.5;
      const alpha = 0.3 + Math.random() * 0.7;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fillRect(x, y, size, size);
    }
  });
}

// 2. Star Sprite Texture
export function createStarParticleTexture() {
  return createTextureFromCanvas(64, 64, (ctx, w, h) => {
    const cx = w / 2;
    const cy = h / 2;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, w / 2);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.2, 'rgba(160, 220, 255, 0.8)');
    grad.addColorStop(0.5, 'rgba(120, 80, 255, 0.3)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, w / 2, 0, Math.PI * 2);
    ctx.fill();
  });
}

// 3. Distant Galaxy Sprite Texture
export function createDistantGalaxyTexture(hue = 'magenta') {
  return createTextureFromCanvas(256, 256, (ctx, w, h) => {
    const cx = w / 2;
    const cy = h / 2;

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, w / 2);
    if (hue === 'cyan') {
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.3, 'rgba(0, 240, 255, 0.7)');
      grad.addColorStop(0.7, 'rgba(30, 64, 175, 0.3)');
    } else if (hue === 'gold') {
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.3, 'rgba(251, 191, 36, 0.7)');
      grad.addColorStop(0.7, 'rgba(180, 83, 9, 0.3)');
    } else {
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.3, 'rgba(217, 70, 239, 0.7)');
      grad.addColorStop(0.7, 'rgba(109, 40, 217, 0.3)');
    }
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, w / 2, 0, Math.PI * 2);
    ctx.fill();
  });
}

// 4. Sun Flare Texture
export function createSunTexture() {
  return createTextureFromCanvas(512, 512, (ctx, w, h) => {
    const cx = w / 2;
    const cy = h / 2;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, w / 2);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.15, '#fffae0');
    grad.addColorStop(0.35, '#ffaa00');
    grad.addColorStop(0.65, '#ff4400');
    grad.addColorStop(1, 'rgba(20, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  });
}

// 5. Procedural Earth Texture
export function createEarthTexture() {
  return createTextureFromCanvas(2048, 1024, (ctx, w, h) => {
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, h);
    oceanGrad.addColorStop(0, '#091c38');
    oceanGrad.addColorStop(0.5, '#0d284f');
    oceanGrad.addColorStop(1, '#081730');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, w, h);

    const drawLand = (pathPoints, color = '#1a4738', strokeColor = '#00f0ff') => {
      ctx.fillStyle = color;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      pathPoints.forEach((p, idx) => {
        const px = (p[0] / 360 + 0.5) * w;
        const py = (0.5 - p[1] / 180) * h;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    };

    drawLand([[60, 65], [140, 65], [140, 35], [100, 10], [80, 8], [70, 20], [60, 25], [45, 38], [30, 40], [10, 55], [30, 70]], '#144033');
    drawLand([[68, 24], [72, 32], [78, 35], [88, 27], [92, 22], [84, 18], [80, 13], [78, 8.5], [76.5, 9.9], [75, 12], [73, 16], [70, 20]], '#1e5a44', '#00ffcc');
    drawLand([[-17, 35], [35, 35], [43, 12], [51, 10], [40, -10], [33, -34], [18, -34], [9, 4], [-17, 15]], '#163b2f');
    drawLand([[-130, 50], [-70, 50], [-60, 45], [-75, 25], [-90, 15], [-110, 30]], '#12362a');
    drawLand([[-80, 10], [-35, -5], [-35, -20], [-65, -55], [-75, -45], [-80, -2]], '#143c2d');
    drawLand([[113, -15], [153, -15], [153, -38], [113, -38]], '#184232');

    const cityLights = [
      [76.3, 10.0], [77.2, 28.6], [72.8, 19.1], [80.2, 13.1], [77.6, 12.9], [139.7, 35.6], [-0.1, 51.5], [-74.0, 40.7]
    ];
    cityLights.forEach(([lon, lat], index) => {
      const px = (lon / 360 + 0.5) * w;
      const py = (0.5 - lat / 180) * h;
      const isCUCEK = index === 0;
      const radius = isCUCEK ? 18 : 6;
      const grad = ctx.createRadialGradient(px, py, 0, px, py, radius);
      grad.addColorStop(0, isCUCEK ? 'rgba(0, 255, 204, 1)' : 'rgba(255, 200, 80, 0.9)');
      grad.addColorStop(0.4, isCUCEK ? 'rgba(0, 212, 255, 0.6)' : 'rgba(255, 140, 0, 0.4)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.fill();
    });
  });
}

// 6. Earth Clouds Layer Texture
export function createEarthCloudsTexture() {
  return createTextureFromCanvas(1024, 512, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    for (let i = 0; i < 150; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const rx = 20 + Math.random() * 80;
      const ry = 5 + Math.random() * 25;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, rx);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

// 7. Procedural 3D Moon Texture
export function createMoonTexture() {
  return createTextureFromCanvas(512, 256, (ctx, w, h) => {
    ctx.fillStyle = '#888894';
    ctx.fillRect(0, 0, w, h);

    // Craters noise
    for (let i = 0; i < 120; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const r = 4 + Math.random() * 20;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, '#555560');
      grad.addColorStop(0.7, '#777784');
      grad.addColorStop(1, '#9999a4');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

// 8. Sagittarius A* Black Hole Accretion Disk Texture
export function createAccretionDiskTexture() {
  return createTextureFromCanvas(512, 512, (ctx, w, h) => {
    const cx = w / 2;
    const cy = h / 2;
    ctx.clearRect(0, 0, w, h);

    const grad = ctx.createRadialGradient(cx, cy, 30, cx, cy, w / 2);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.15, 'rgba(0, 240, 255, 0.95)');
    grad.addColorStop(0.4, 'rgba(251, 146, 60, 0.8)');
    grad.addColorStop(0.7, 'rgba(239, 68, 68, 0.5)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, w / 2, 0, Math.PI * 2);
    ctx.fill();

    // Accretion spiral swirls
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      const startAngle = (i * Math.PI) / 3;
      ctx.arc(cx, cy, 70 + i * 15, startAngle, startAngle + Math.PI);
      ctx.stroke();
    }
  });
}

// 9. Procedural Textures for Solar System Planets
export function createPlanetTexture(type) {
  return createTextureFromCanvas(512, 256, (ctx, w, h) => {
    if (type === 'mercury') {
      ctx.fillStyle = '#6b6a68';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#4a4947';
      for (let i = 0; i < 80; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * w, Math.random() * h, 3 + Math.random() * 12, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (type === 'venus') {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#e3bb76');
      grad.addColorStop(0.5, '#c99a4b');
      grad.addColorStop(1, '#a87a32');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    } else if (type === 'mars') {
      ctx.fillStyle = '#ab4327';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#802b14';
      for (let i = 0; i < 90; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * w, Math.random() * h, 4 + Math.random() * 15, 0, Math.PI * 2);
        ctx.fill();
      }
      // Ice caps
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, 20);
      ctx.fillRect(0, h - 20, w, 20);
    } else if (type === 'jupiter') {
      // Gas giant bands
      const bands = ['#c98959', '#b56d3a', '#e8c49e', '#8c4820', '#d6a378', '#a05428'];
      const bandHeight = h / bands.length;
      bands.forEach((color, i) => {
        ctx.fillStyle = color;
        ctx.fillRect(0, i * bandHeight, w, bandHeight);
      });
      // Great Red Spot
      ctx.fillStyle = '#a83018';
      ctx.beginPath();
      ctx.ellipse(w * 0.6, h * 0.65, 35, 20, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === 'saturn') {
      const bands = ['#d1b886', '#bfa169', '#e0c99d', '#aa8a51'];
      const bandHeight = h / bands.length;
      bands.forEach((color, i) => {
        ctx.fillStyle = color;
        ctx.fillRect(0, i * bandHeight, w, bandHeight);
      });
    } else if (type === 'uranus') {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#78d6d6');
      grad.addColorStop(0.5, '#56b8b8');
      grad.addColorStop(1, '#3b9696');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    } else if (type === 'neptune') {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#2e5ec4');
      grad.addColorStop(0.5, '#1e4499');
      grad.addColorStop(1, '#112c6e');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }
  });
}

// 10. Saturn Ring Texture
export function createSaturnRingTexture() {
  return createTextureFromCanvas(512, 64, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(0.2, 'rgba(210, 180, 140, 0.8)');
    grad.addColorStop(0.5, 'rgba(180, 150, 110, 0.4)');
    grad.addColorStop(0.7, 'rgba(210, 180, 140, 0.9)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  });
}
