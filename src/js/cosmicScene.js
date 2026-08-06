import * as THREE from 'three';
import {
  createUniverseTexture,
  createStarParticleTexture,
  createSunTexture,
  createEarthTexture,
  createEarthCloudsTexture,
  createMoonTexture,
  createPlanetTexture,
  createSaturnRingTexture,
  createAccretionDiskTexture,
} from './proceduralTextures.js';

let universeSphere, glowSphere;
let starField, distantGalaxiesGroup, spiralGalaxyGroup, mwClustersGroup, solarClusterGroup, sunMesh, sunCoronaMesh;
let sagitariusAGroup, sagitariusAMesh, accretionDiskMesh, centerLightDiskMesh;
let mercuryMesh, venusMesh, earthGroup, earthMesh, cloudMesh, moonMesh;
let marsMesh, jupiterMesh, saturnGroup, saturnMesh, uranusMesh, neptuneMesh, plutoMesh;

// Helper: Create 3D Star Cluster Particle Mesh
function create3DStarCluster(particleCount = 500, radius = 25, colorHex = 0x00f0ff) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const baseColor = new THREE.Color(colorHex);

  for (let i = 0; i < particleCount; i++) {
    const r = Math.pow(Math.random(), 2) * radius;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    pos[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
    pos[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r;
    pos[i * 3 + 2] = Math.cos(phi) * r;

    const alpha = 1 - r / radius;
    colors[i * 3] = baseColor.r * (0.7 + alpha * 0.3);
    colors[i * 3 + 1] = baseColor.g * (0.7 + alpha * 0.3);
    colors[i * 3 + 2] = baseColor.b * (0.7 + alpha * 0.3);
  }

  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 2.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  return new THREE.Points(geo, mat);
}

// Helper: Create 3D Elliptical Galaxy Particle Mesh
function create3DEllipticalGalaxy(colorHex = 0xffd700, radius = 40, particleCount = 1200) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const baseColor = new THREE.Color(colorHex);

  for (let i = 0; i < particleCount; i++) {
    const r = Math.pow(Math.random(), 2.5) * radius;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    pos[i * 3] = Math.sin(phi) * Math.cos(theta) * r * 1.4;
    pos[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r * 0.8;
    pos[i * 3 + 2] = Math.cos(phi) * r * 0.9;

    const alpha = 1 - r / radius;
    colors[i * 3] = baseColor.r * (0.6 + alpha * 0.4);
    colors[i * 3 + 1] = baseColor.g * (0.6 + alpha * 0.4);
    colors[i * 3 + 2] = baseColor.b * (0.6 + alpha * 0.4);
  }

  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  return new THREE.Points(geo, mat);
}

// Helper: Create 3D Spiral Galaxy Particle Mesh
function create3DSpiralGalaxy(numArms = 2, primaryHex = 0x00f0ff, secondaryHex = 0xa855f7, radius = 50, particleCount = 1800) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const colPrimary = new THREE.Color(primaryHex);
  const colSecondary = new THREE.Color(secondaryHex);

  for (let i = 0; i < particleCount; i++) {
    const r = Math.pow(Math.random(), 2) * radius;
    const spinAngle = r * 0.08;
    const armAngle = ((i % numArms) * 2 * Math.PI) / numArms;

    const totalAngle = armAngle + spinAngle;
    const spreadX = (Math.random() - 0.5) * (r * 0.2);
    const spreadY = (Math.random() - 0.5) * (r * 0.2);
    const spreadZ = (Math.random() - 0.5) * (r * 0.12);

    pos[i * 3] = Math.cos(totalAngle) * r + spreadX;
    pos[i * 3 + 1] = Math.sin(totalAngle) * r + spreadY;
    pos[i * 3 + 2] = spreadZ;

    const lerpCol = i % 2 === 0 ? colPrimary : colSecondary;
    colors[i * 3] = lerpCol.r;
    colors[i * 3 + 1] = lerpCol.g;
    colors[i * 3 + 2] = lerpCol.b;
  }

  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 2.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  return new THREE.Points(geo, mat);
}

export function buildCosmicScene(scene) {
  // -------------------------------------------------------------
  // 1. HERO: Sleeping Universe Sphere (Z = 180)
  // -------------------------------------------------------------
  const universeGeo = new THREE.SphereGeometry(35, 64, 64);
  const universeTex = createUniverseTexture();
  const universeMat = new THREE.MeshStandardMaterial({
    map: universeTex,
    roughness: 0.4,
    metalness: 0.2,
    emissive: 0x1d0047,
    emissiveIntensity: 0.5,
  });
  universeSphere = new THREE.Mesh(universeGeo, universeMat);
  universeSphere.position.set(0, 0, 180);
  scene.add(universeSphere);

  // Outer Glowing Atmosphere Aura
  const glowGeo = new THREE.SphereGeometry(37, 64, 64);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.25,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
  });
  glowSphere = new THREE.Mesh(glowGeo, glowMat);
  glowSphere.position.set(0, 0, 180);
  scene.add(glowSphere);

  // Deep Space Starfield Points (10,000 background stars)
  const starTex = createStarParticleTexture();
  const starCount = 10000;
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    starPos[i * 3] = (Math.random() - 0.5) * 2000;
    starPos[i * 3 + 1] = (Math.random() - 0.5) * 2000;
    starPos[i * 3 + 2] = (Math.random() - 0.5) * 3000;

    const r = 0.5 + Math.random() * 0.5;
    const g = 0.5 + Math.random() * 0.5;
    const b = 0.8 + Math.random() * 0.2;
    starColors[i * 3] = r;
    starColors[i * 3 + 1] = g;
    starColors[i * 3 + 2] = b;
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

  const starMat = new THREE.PointsMaterial({
    size: 2.8,
    map: starTex,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  starField = new THREE.Points(starGeo, starMat);
  starField.visible = false; // Hidden until entering universe (cameraZ < 120)
  scene.add(starField);

  // -------------------------------------------------------------
  // 2. GALAXIES & CLUSTERS IN DEEP SPACE (Only visible AFTER Z < 120)
  // -------------------------------------------------------------
  distantGalaxiesGroup = new THREE.Group();

  // Galaxy 1: Andromeda M31 Spiral (Z = -220, X = -140, Y = 60)
  const andromeda = create3DSpiralGalaxy(2, 0x00f0ff, 0xec4899, 65, 2500);
  andromeda.position.set(-140, 60, -220);
  andromeda.rotation.x = Math.PI * 0.3;
  distantGalaxiesGroup.add(andromeda);

  // Galaxy 2: Sombrero M104 Elliptical Core (Z = -360, X = 150, Y = -80)
  const sombrero = create3DEllipticalGalaxy(0xfbbf24, 45, 1800);
  sombrero.position.set(150, -80, -360);
  distantGalaxiesGroup.add(sombrero);

  // Galaxy Cluster 3: Abell 1689 Massive Cluster (Z = -480, X = -180, Y = -100)
  const abellCluster = new THREE.Group();
  abellCluster.position.set(-180, -100, -480);
  for (let i = 0; i < 5; i++) {
    const subGal = i % 2 === 0 
      ? create3DSpiralGalaxy(2, 0xa855f7, 0x38bdf8, 25, 700)
      : create3DEllipticalGalaxy(0xf59e0b, 20, 500);
    subGal.position.set((Math.random() - 0.5) * 60, (Math.random() - 0.5) * 60, (Math.random() - 0.5) * 40);
    abellCluster.add(subGal);
  }
  distantGalaxiesGroup.add(abellCluster);

  // Galaxy Cluster 4: Virgo Supercluster Nodes (Z = -290, X = 160, Y = 30)
  const virgoCluster = new THREE.Group();
  virgoCluster.position.set(160, 30, -290);
  for (let i = 0; i < 7; i++) {
    const subGal = i % 2 === 0 
      ? create3DSpiralGalaxy(3, 0x00ffcc, 0xa855f7, 30, 800)
      : create3DEllipticalGalaxy(0xffa500, 22, 600);
    subGal.position.set((Math.random() - 0.5) * 80, (Math.random() - 0.5) * 80, (Math.random() - 0.5) * 60);
    virgoCluster.add(subGal);
  }
  distantGalaxiesGroup.add(virgoCluster);

  // Galaxy 5: Triangulum M33 Spiral (Z = -410, X = -110, Y = -50)
  const triangulum = create3DSpiralGalaxy(3, 0x60a5fa, 0xf43f5e, 48, 1600);
  triangulum.position.set(-110, -50, -410);
  triangulum.rotation.y = Math.PI * 0.2;
  distantGalaxiesGroup.add(triangulum);

  distantGalaxiesGroup.visible = false;
  scene.add(distantGalaxiesGroup);

  // -------------------------------------------------------------
  // 3. THE MILKY WAY & SAGITTARIUS A* LIGHT DISK (Z = -550)
  // -------------------------------------------------------------
  spiralGalaxyGroup = new THREE.Group();
  spiralGalaxyGroup.position.set(0, 0, -550);

  const galaxyParticles = 7500;
  const galaxyGeo = new THREE.BufferGeometry();
  const galaxyPos = new Float32Array(galaxyParticles * 3);
  const galaxyColors = new Float32Array(galaxyParticles * 3);

  const arms = 4;
  for (let i = 0; i < galaxyParticles; i++) {
    const r = Math.pow(Math.random(), 2) * 190;
    const spinAngle = r * 0.05;
    const armAngle = ((i % arms) * 2 * Math.PI) / arms;

    const totalAngle = armAngle + spinAngle;
    const spreadX = (Math.random() - 0.5) * (r * 0.25);
    const spreadY = (Math.random() - 0.5) * (r * 0.25);
    const spreadZ = (Math.random() - 0.5) * (r * 0.15);

    galaxyPos[i * 3] = Math.cos(totalAngle) * r + spreadX;
    galaxyPos[i * 3 + 1] = Math.sin(totalAngle) * r + spreadY;
    galaxyPos[i * 3 + 2] = spreadZ;

    if (r < 35) {
      galaxyColors[i * 3] = 1.0; galaxyColors[i * 3 + 1] = 0.95; galaxyColors[i * 3 + 2] = 0.7;
    } else {
      galaxyColors[i * 3] = 0.1 + (i % 2) * 0.7;
      galaxyColors[i * 3 + 1] = 0.6;
      galaxyColors[i * 3 + 2] = 1.0;
    }
  }

  galaxyGeo.setAttribute('position', new THREE.BufferAttribute(galaxyPos, 3));
  galaxyGeo.setAttribute('color', new THREE.BufferAttribute(galaxyColors, 3));

  const galaxyMat = new THREE.PointsMaterial({
    size: 2.5,
    map: starTex,
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const galaxyPoints = new THREE.Points(galaxyGeo, galaxyMat);
  spiralGalaxyGroup.add(galaxyPoints);

  // STAR CLUSTERS INSIDE MILKY WAY (Strictly load ONLY AFTER completely inside the galaxy: cameraZ < -550)
  mwClustersGroup = new THREE.Group();
  const mwClusters = [
    { color: 0x00f0ff, r: 50, angle: 0.4 },
    { color: 0xfbbf24, r: 85, angle: 1.8 },
    { color: 0xec4899, r: 120, angle: 3.2 },
    { color: 0x38bdf8, r: 150, angle: 4.6 },
  ];
  mwClusters.forEach(cl => {
    const cluster = create3DStarCluster(400, 18, cl.color);
    cluster.position.set(Math.cos(cl.angle) * cl.r, Math.sin(cl.angle) * cl.r, (Math.random() - 0.5) * 10);
    mwClustersGroup.add(cluster);
  });
  mwClustersGroup.visible = false; // Strictly hidden until cameraZ < -550 (Inside Milky Way completely)
  spiralGalaxyGroup.add(mwClustersGroup);

  // SAGITTARIUS A* SUPERMASSIVE BLACK HOLE LIGHT DISK (Center of Galaxy)
  sagitariusAGroup = new THREE.Group();

  // Event Horizon Dark Center
  const bhGeo = new THREE.SphereGeometry(6, 32, 32);
  const bhMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
  sagitariusAMesh = new THREE.Mesh(bhGeo, bhMat);
  sagitariusAGroup.add(sagitariusAMesh);

  // Bright Center Light Disk Ring
  const accGeo = new THREE.RingGeometry(7, 36, 64);
  const accTex = createAccretionDiskTexture();
  const accMat = new THREE.MeshBasicMaterial({
    map: accTex,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
  });
  accretionDiskMesh = new THREE.Mesh(accGeo, accMat);
  sagitariusAGroup.add(accretionDiskMesh);

  // Glowing Lensing Core Disk
  const coreDiskGeo = new THREE.CircleGeometry(12, 64);
  const coreDiskMat = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.6,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });
  centerLightDiskMesh = new THREE.Mesh(coreDiskGeo, coreDiskMat);
  sagitariusAGroup.add(centerLightDiskMesh);

  spiralGalaxyGroup.add(sagitariusAGroup);
  spiralGalaxyGroup.rotation.x = Math.PI * 0.35;
  spiralGalaxyGroup.visible = false;
  scene.add(spiralGalaxyGroup);

  // -------------------------------------------------------------
  // 4. SOLAR NEIGHBORHOOD STAR CLUSTER & REVOLVING SOLAR SYSTEM (All 8 Planets + Moon + Pluto)
  // -------------------------------------------------------------

  // Solar Neighborhood Cluster (Centered at Z = -750)
  solarClusterGroup = new THREE.Group();
  solarClusterGroup.position.set(20, 5, -750);
  const solarClusterPoints = create3DStarCluster(900, 80, 0x38bdf8);
  solarClusterGroup.add(solarClusterPoints);
  solarClusterGroup.visible = false; // Hidden until cameraZ < -650
  scene.add(solarClusterGroup);
  
  // A. Sun (Positioned slightly to the right at X = 20, Y = 5, Z = -920)
  const sunGeo = new THREE.SphereGeometry(24, 32, 32);
  const sunTex = createSunTexture();
  const sunMat = new THREE.MeshBasicMaterial({ map: sunTex });
  sunMesh = new THREE.Mesh(sunGeo, sunMat);
  sunMesh.position.set(20, 5, -920);

  // Outer Glowing Sun Corona Atmosphere
  const sunCoronaGeo = new THREE.SphereGeometry(27, 32, 32);
  const sunCoronaMat = new THREE.MeshBasicMaterial({
    color: 0xffaa00,
    transparent: true,
    opacity: 0.4,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
  });
  sunCoronaMesh = new THREE.Mesh(sunCoronaGeo, sunCoronaMat);
  sunMesh.add(sunCoronaMesh);

  sunMesh.visible = false;
  scene.add(sunMesh);

  // B. Mercury (Planet 1, Revolving around Sun)
  const mercuryTex = createPlanetTexture('mercury');
  mercuryMesh = new THREE.Mesh(
    new THREE.SphereGeometry(5, 32, 32),
    new THREE.MeshStandardMaterial({ map: mercuryTex, roughness: 0.8 })
  );
  mercuryMesh.position.set(20 + 35, 5, -920);
  mercuryMesh.visible = false;
  scene.add(mercuryMesh);

  // C. Venus (Planet 2, Revolving around Sun)
  const venusTex = createPlanetTexture('venus');
  venusMesh = new THREE.Mesh(
    new THREE.SphereGeometry(9, 32, 32),
    new THREE.MeshStandardMaterial({ map: venusTex, roughness: 0.5 })
  );
  venusMesh.position.set(20 - 55, 5, -920);
  venusMesh.visible = false;
  scene.add(venusMesh);

  // D. Earth & Moon Group (Planet 3, Revolving around Sun)
  earthGroup = new THREE.Group();
  earthGroup.position.set(20, 5, -920 + 85);

  const earthRadius = 24;
  const earthGeo = new THREE.SphereGeometry(earthRadius, 64, 64);
  const earthTex = createEarthTexture();
  const earthMat = new THREE.MeshStandardMaterial({
    map: earthTex,
    roughness: 0.6,
    metalness: 0.1,
  });
  earthMesh = new THREE.Mesh(earthGeo, earthMat);
  earthGroup.add(earthMesh);

  // Earth Clouds Layer
  const cloudGeo = new THREE.SphereGeometry(earthRadius + 0.5, 64, 64);
  const cloudTex = createEarthCloudsTexture();
  const cloudMat = new THREE.MeshStandardMaterial({
    map: cloudTex,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
  });
  cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
  earthGroup.add(cloudMesh);

  // Earth Atmosphere Outer Glow Rim
  const earthAtmGeo = new THREE.SphereGeometry(earthRadius + 2.5, 64, 64);
  const earthAtmMat = new THREE.MeshBasicMaterial({
    color: 0x00d4ff,
    transparent: true,
    opacity: 0.3,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
  });
  const earthAtmMesh = new THREE.Mesh(earthAtmGeo, earthAtmMat);
  earthGroup.add(earthAtmMesh);

  // 3D MOON MESH (Orbiting Earth)
  const moonRadius = 6;
  const moonGeo = new THREE.SphereGeometry(moonRadius, 32, 32);
  const moonTex = createMoonTexture();
  const moonMat = new THREE.MeshStandardMaterial({
    map: moonTex,
    roughness: 0.8,
  });
  moonMesh = new THREE.Mesh(moonGeo, moonMat);
  moonMesh.position.set(45, 10, 0);
  earthGroup.add(moonMesh);

  // Rotate Earth so South Asia faces front
  const latRad = (10.04 * Math.PI) / 180;
  const lonRad = (76.32 * Math.PI) / 180;
  earthMesh.rotation.y = -lonRad - Math.PI / 2;
  earthMesh.rotation.x = -latRad;

  earthGroup.visible = false;
  scene.add(earthGroup);

  // E. Mars (Planet 4, Revolving around Sun)
  const marsTex = createPlanetTexture('mars');
  marsMesh = new THREE.Mesh(
    new THREE.SphereGeometry(8, 32, 32),
    new THREE.MeshStandardMaterial({ map: marsTex, roughness: 0.7 })
  );
  marsMesh.position.set(20 + 120, 5, -920);
  marsMesh.visible = false;
  scene.add(marsMesh);

  // F. Jupiter (Planet 5, Revolving around Sun)
  const jupiterTex = createPlanetTexture('jupiter');
  jupiterMesh = new THREE.Mesh(
    new THREE.SphereGeometry(32, 64, 64),
    new THREE.MeshStandardMaterial({ map: jupiterTex, roughness: 0.5 })
  );
  jupiterMesh.position.set(20 - 165, 5, -920);
  jupiterMesh.visible = false;
  scene.add(jupiterMesh);

  // G. Saturn & Rings (Planet 6, Revolving around Sun)
  saturnGroup = new THREE.Group();
  saturnGroup.position.set(20 + 215, 5, -920);

  const saturnTex = createPlanetTexture('saturn');
  saturnMesh = new THREE.Mesh(
    new THREE.SphereGeometry(22, 64, 64),
    new THREE.MeshStandardMaterial({ map: saturnTex, roughness: 0.5 })
  );
  saturnGroup.add(saturnMesh);

  // 3D Saturn Rings Mesh
  const satRingTex = createSaturnRingTexture();
  const satRingGeo = new THREE.RingGeometry(26, 46, 64);
  const satRingMat = new THREE.MeshBasicMaterial({
    map: satRingTex,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.85,
  });
  const satRingMesh = new THREE.Mesh(satRingGeo, satRingMat);
  satRingMesh.rotation.x = Math.PI * 0.45;
  saturnGroup.add(satRingMesh);
  saturnGroup.visible = false;
  scene.add(saturnGroup);

  // H. Uranus (Planet 7, Revolving around Sun)
  const uranusTex = createPlanetTexture('uranus');
  uranusMesh = new THREE.Mesh(
    new THREE.SphereGeometry(15, 32, 32),
    new THREE.MeshStandardMaterial({ map: uranusTex, roughness: 0.4 })
  );
  uranusMesh.position.set(20 - 265, 5, -920);
  uranusMesh.visible = false;
  scene.add(uranusMesh);

  // I. Neptune (Planet 8, Revolving around Sun)
  const neptuneTex = createPlanetTexture('neptune');
  neptuneMesh = new THREE.Mesh(
    new THREE.SphereGeometry(14, 32, 32),
    new THREE.MeshStandardMaterial({ map: neptuneTex, roughness: 0.4 })
  );
  neptuneMesh.position.set(20 + 315, 5, -920);
  neptuneMesh.visible = false;
  scene.add(neptuneMesh);

  // J. Dwarf Planet Pluto (Revolving around Sun)
  const plutoTex = createPlanetTexture('pluto');
  plutoMesh = new THREE.Mesh(
    new THREE.SphereGeometry(4.5, 32, 32),
    new THREE.MeshStandardMaterial({ map: plutoTex, roughness: 0.9 })
  );
  plutoMesh.position.set(20 - 365, 5, -920);
  plutoMesh.visible = false;
  scene.add(plutoMesh);

  return {
    universeSphere,
    glowSphere,
    starField,
    distantGalaxiesGroup,
    spiralGalaxyGroup,
    mwClustersGroup,
    solarClusterGroup,
    sunMesh,
    mercuryMesh,
    venusMesh,
    earthGroup,
    earthMesh,
    cloudMesh,
    moonMesh,
    marsMesh,
    jupiterMesh,
    saturnGroup,
    uranusMesh,
    neptuneMesh,
    plutoMesh,
  };
}

// Continuous Frame Animation Updates
export function updateCosmicScene(time, cameraZ = 300) {
  // 1. Hero Universe Sphere Breathing Animation
  if (universeSphere) {
    const breath = Math.sin(time * 1.5) * 0.04;
    universeSphere.scale.set(1 + breath, 1 + breath, 1 + breath);
    universeSphere.rotation.y = time * 0.08;

    if (glowSphere) {
      glowSphere.scale.set(1 + breath * 1.2, 1 + breath * 1.2, 1 + breath * 1.2);
    }
  }

  // 2. Galaxies & Nebulae ONLY SHOW AFTER ENTERING UNIVERSE (cameraZ < 120)
  const hasEnteredUniverse = cameraZ < 120;
  if (starField) starField.visible = hasEnteredUniverse;
  if (distantGalaxiesGroup) {
    distantGalaxiesGroup.visible = hasEnteredUniverse;
    distantGalaxiesGroup.children.forEach((g, idx) => {
      g.rotation.z += 0.001 * (idx % 2 === 0 ? 1 : -1);
      g.rotation.y += 0.001;
    });
  }
  if (spiralGalaxyGroup) {
    spiralGalaxyGroup.visible = cameraZ < -250;
    spiralGalaxyGroup.rotation.z = time * 0.05;
  }

  // Milky Way Star Clusters STRICTLY LOAD ONLY AFTER WE ARE COMPLETELY INSIDE THE GALAXY (cameraZ < -550)
  if (mwClustersGroup) mwClustersGroup.visible = cameraZ < -550;

  // Sagittarius A* Light Disk Rotation
  if (accretionDiskMesh) accretionDiskMesh.rotation.z += 0.03;
  if (centerLightDiskMesh) centerLightDiskMesh.scale.setScalar(1 + Math.sin(time * 4) * 0.05);

  // 3. Solar Neighborhood Cluster ONLY VISIBLE AS WE ENTER OUR SPECIFIC CLUSTER (cameraZ < -650)
  if (solarClusterGroup) solarClusterGroup.visible = cameraZ < -650 && cameraZ > -950;

  // 4. SOLAR SYSTEM STRICTLY LOADS ONLY AFTER MOVING FORWARD PAST THE CLUSTER (cameraZ < -860)
  const afterMovingPastCluster = cameraZ < -860;
  const sunX = 20;
  const sunY = 5;
  const sunZ = -920;

  if (sunMesh) {
    sunMesh.visible = afterMovingPastCluster;
    sunMesh.rotation.y = time * 0.1;
  }

  // 3D PLANET ORBITAL REVOLUTIONS AROUND THE SUN
  if (mercuryMesh) {
    mercuryMesh.visible = cameraZ < -920;
    mercuryMesh.position.x = sunX + Math.cos(time * 1.6) * 35;
    mercuryMesh.position.z = sunZ + Math.sin(time * 1.6) * 35;
    mercuryMesh.rotation.y = time * 0.5;
  }

  if (venusMesh) {
    venusMesh.visible = cameraZ < -950;
    venusMesh.position.x = sunX + Math.cos(time * 1.2) * 55;
    venusMesh.position.z = sunZ + Math.sin(time * 1.2) * 55;
    venusMesh.rotation.y = time * 0.4;
  }

  // Earth & Moon strictly load ONLY AFTER passing the Sun (cameraZ < -1000)
  const afterSun = cameraZ < -1000;
  if (earthGroup) {
    earthGroup.visible = afterSun;
    earthGroup.position.x = sunX + Math.cos(time * 0.8) * 85;
    earthGroup.position.z = sunZ + Math.sin(time * 0.8) * 85;
  }

  // Moon orbit animation around Earth
  if (moonMesh) {
    const moonAngle = time * 0.8;
    moonMesh.position.x = Math.cos(moonAngle) * 45;
    moonMesh.position.z = Math.sin(moonAngle) * 45;
    moonMesh.rotation.y = time * 0.5;
  }

  // Outer planets orbital revolutions around the Sun
  if (marsMesh) {
    marsMesh.visible = cameraZ < -1050;
    marsMesh.position.x = sunX + Math.cos(time * 0.6) * 120;
    marsMesh.position.z = sunZ + Math.sin(time * 0.6) * 120;
    marsMesh.rotation.y = time * 0.4;
  }

  if (jupiterMesh) {
    jupiterMesh.visible = cameraZ < -1150;
    jupiterMesh.position.x = sunX + Math.cos(time * 0.45) * 165;
    jupiterMesh.position.z = sunZ + Math.sin(time * 0.45) * 165;
    jupiterMesh.rotation.y = time * 0.3;
  }

  if (saturnGroup) {
    saturnGroup.visible = cameraZ < -1250;
    saturnGroup.position.x = sunX + Math.cos(time * 0.35) * 215;
    saturnGroup.position.z = sunZ + Math.sin(time * 0.35) * 215;
    saturnGroup.rotation.y = time * 0.25;
  }

  if (uranusMesh) {
    uranusMesh.visible = cameraZ < -1350;
    uranusMesh.position.x = sunX + Math.cos(time * 0.25) * 265;
    uranusMesh.position.z = sunZ + Math.sin(time * 0.25) * 265;
    uranusMesh.rotation.y = time * 0.2;
  }

  if (neptuneMesh) {
    neptuneMesh.visible = cameraZ < -1450;
    neptuneMesh.position.x = sunX + Math.cos(time * 0.18) * 315;
    neptuneMesh.position.z = sunZ + Math.sin(time * 0.18) * 315;
    neptuneMesh.rotation.y = time * 0.18;
  }

  if (plutoMesh) {
    plutoMesh.visible = cameraZ < -1550;
    plutoMesh.position.x = sunX + Math.cos(time * 0.12) * 365;
    plutoMesh.position.z = sunZ + Math.sin(time * 0.12) * 365;
    plutoMesh.rotation.y = time * 0.15;
  }

  if (cloudMesh) cloudMesh.rotation.y = time * 0.03;
  if (earthMesh) earthMesh.rotation.y += 0.001;
}
