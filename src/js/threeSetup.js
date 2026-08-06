import * as THREE from 'three';

let scene, camera, renderer;

export function initThreeSetup(canvasElement) {
  // 1. Scene
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x030210, 0.0015);

  // 2. Camera
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  camera.position.set(0, 0, 300);

  // 3. Renderer
  renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  // 4. Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
  sunLight.position.set(200, 100, 150);
  scene.add(sunLight);

  const purplePointLight = new THREE.PointLight(0xa855f7, 2, 400);
  purplePointLight.position.set(-100, -50, 100);
  scene.add(purplePointLight);

  const cyanPointLight = new THREE.PointLight(0x06b6d4, 2, 400);
  cyanPointLight.position.set(100, 50, -100);
  scene.add(cyanPointLight);

  // 5. Window Resize Handler
  window.addEventListener('resize', onWindowResize, false);

  return { scene, camera, renderer, sunLight };
}

function onWindowResize() {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

export { scene, camera, renderer };
