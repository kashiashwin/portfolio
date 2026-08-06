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
} from './proceduralTextures.js';

let universeSphere, glowSphere;
let starField, distantGalaxiesGroup, spiralGalaxyGroup, sunMesh;
let mercuryMesh, venusMesh, earthGroup, earthMesh, cloudMesh, moonMesh;
let marsMesh, jupiterMesh, saturnGroup, saturnMesh, uranusMesh, neptuneMesh;

// Helper: Create 3D Elliptical Galaxy Particle Mesh
function create3DEllipticalGalaxy(colorHex = 0xffd700, radius = 40, particleCount = 1200) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const baseColor = new THREE.Color(colorHex);

  for (let i = 0; i < particleCount; i++) {
    // Concentrated core distribution
    const r = Math.pow(Math.random(), 2.5) * radius;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    // Ellipsoid stretch
    pos[i * 3] = Math.sin(phi) * Math.cos(theta) * r * 1.4;
    pos[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r * 0.8;
    pos[i * 3 + 2] = Math.cos(phi) * r * 0.9;

    // Golden / red core fading to white halo
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
    color: 0x6366f1,
    transparent: true,
    opacity: 0.35,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
  });
  glowSphere = new THREE.Mesh(glowGeo, glowMat);
  glowSphere.position.copy(universeSphere.position);
  scene.add(glowSphere);

  const starTex = createStarParticleTexture();

  // -------------------------------------------------------------
  // 2. DEEP SPACE: Galaxies & Clusters (ONLY VISIBLE AFTER ENTERING UNIVERSE Z < 120)
  // -------------------------------------------------------------
  const starCount = 14000;
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    starPos[i * 3] = (Math.random() - 0.5) * 1500;
    starPos[i * 3 + 1] = (Math.random() - 0.5) * 1500;
    starPos[i * 3 + 2] = (Math.random() - 0.5) * 2400 - 300;

    const colorChoice = Math.random();
    if (colorChoice > 0.7) {
      starColors[i * 3] = 0.2; starColors[i * 3 + 1] = 0.9; starColors[i * 3 + 2] = 1.0;
    } else if (colorChoice > 0.4) {
      starColors[i * 3] = 0.7; starColors[i * 3 + 1] = 0.3; starColors[i * 3 + 2] = 1.0;
    } else {
      starColors[i * 3] = 1.0; starColors[i * 3 + 1] = 1.0; starColors[i * 3 + 2] = 1.0;
    }
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

  const starMat = new THREE.PointsMaterial({
    size: 2.2,
    map: starTex,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  starField = new THREE.Points(starGeo, starMat);
  starField.visible = false; // Strictly hidden initially
  scene.add(starField);

  // 3D REAL-LIFE GALAXY CLUSTERS & GALAXIES
  distantGalaxiesGroup = new THREE.Group();

  // Cluster 1: Abell 1689 Galaxy Cluster (Z = 60, X = -140, Y = 50)
  const abellCluster = new THREE.Group();
  abellCluster.position.set(-140, 50, 60);
  for (let i = 0; i < 6; i++) {
    const miniGal = create3DEllipticalGalaxy(i % 2 === 0 ? 0xffbb44 : 0x00f0ff, 25, 600);
    miniGal.position.set((Math.random() - 0.5) * 70, (Math.random() - 0.5) * 70, (Math.random() - 0.5) * 50);
    abellCluster.add(miniGal);
  }
  distantGalaxiesGroup.add(abellCluster);

  // Galaxy 2: Andromeda M31 Spiral Galaxy (Z = -60, X = 150, Y = -40)
  const andromeda = create3DSpiralGalaxy(2, 0x38bdf8, 0xe879f9, 55, 2000);
  andromeda.position.set(150, -40, -60);
  andromeda.rotation.x = Math.PI * 0.3;
  distantGalaxiesGroup.add(andromeda);

  // Galaxy 3: Sombrero M104 Elliptical Galaxy (Z = -180, X = -130, Y = 60)
  const sombrero = create3DEllipticalGalaxy(0xfef08a, 45, 1500);
  sombrero.position.set(-130, 60, -180);
  sombrero.rotation.x = Math.PI * 0.45;
  distantGalaxiesGroup.add(sombrero);

  // Cluster 4: Virgo Supercluster Nodes (Z = -290, X = 160, Y = 30)
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

  distantGalaxiesGroup.visible = false; // Strictly hidden initially
  scene.add(distantGalaxiesGroup);

  // -------------------------------------------------------------
  // 3. THE MILKY WAY (Spiral Galaxy at Z = -550)
  // -------------------------------------------------------------
  spiralGalaxyGroup = new THREE.Group();
  spiralGalaxyGroup.position.set(0, 0, -550);

  const galaxyParticles = 6000;
  const galaxyGeo = new THREE.BufferGeometry();
  const galaxyPos = new Float32Array(galaxyParticles * 3);
  const galaxyColors = new Float32Array(galaxyParticles * 3);

  const arms = 4;
  for (let i = 0; i < galaxyParticles; i++) {
    const r = Math.pow(Math.random(), 2) * 180;
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
  spiralGalaxyGroup.rotation.x = Math.PI * 0.35;
  spiralGalaxyGroup.visible = false;
  scene.add(spiralGalaxyGroup);

  // -------------------------------------------------------------
  // 4. SOLAR SYSTEM (Sun -> Mercury -> Venus -> Earth & Moon -> Mars -> Jupiter -> Saturn -> Uranus -> Neptune)
  // -------------------------------------------------------------
  
  // A. Sun (Z = -800)
  const sunGeo = new THREE.SphereGeometry(26, 32, 32);
  const sunTex = createSunTexture();
  const sunMat = new THREE.MeshBasicMaterial({ map: sunTex });
  sunMesh = new THREE.Mesh(sunGeo, sunMat);
  sunMesh.position.set(45, 20, -800);
  sunMesh.visible = false;
  scene.add(sunMesh);

  // B. Mercury (Z = -900)
  const mercuryTex = createPlanetTexture('mercury');
  mercuryMesh = new THREE.Mesh(
    new THREE.SphereGeometry(5, 32, 32),
    new THREE.MeshStandardMaterial({ map: mercuryTex, roughness: 0.8 })
  );
  mercuryMesh.position.set(15, -8, -900);
  mercuryMesh.visible = false;
  scene.add(mercuryMesh);

  // C. Venus (Z = -980)
  const venusTex = createPlanetTexture('venus');
  venusMesh = new THREE.Mesh(
    new THREE.SphereGeometry(9, 32, 32),
    new THREE.MeshStandardMaterial({ map: venusTex, roughness: 0.5 })
  );
  venusMesh.position.set(-30, 12, -980);
  venusMesh.visible = false;
  scene.add(venusMesh);

  // D. Earth & Moon Group (Z = -1100) — STRICTLY LOADS ONLY AFTER THE SUN (Z < -950)
  earthGroup = new THREE.Group();
  earthGroup.position.set(0, 0, -1100);

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

  earthGroup.visible = false; // Strictly hidden until after Sun
  scene.add(earthGroup);

  // E. Mars (Z = -1220)
  const marsTex = createPlanetTexture('mars');
  marsMesh = new THREE.Mesh(
    new THREE.SphereGeometry(8, 32, 32),
    new THREE.MeshStandardMaterial({ map: marsTex, roughness: 0.7 })
  );
  marsMesh.position.set(38, -15, -1220);
  marsMesh.visible = false;
  scene.add(marsMesh);

  // F. Jupiter (Z = -1350)
  const jupiterTex = createPlanetTexture('jupiter');
  jupiterMesh = new THREE.Mesh(
    new THREE.SphereGeometry(32, 64, 64),
    new THREE.MeshStandardMaterial({ map: jupiterTex, roughness: 0.5 })
  );
  jupiterMesh.position.set(-70, 25, -1350);
  jupiterMesh.visible = false;
  scene.add(jupiterMesh);

  // G. Saturn & Rings (Z = -1500)
  saturnGroup = new THREE.Group();
  saturnGroup.position.set(65, -30, -1500);

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

  // H. Uranus (Z = -1620)
  const uranusTex = createPlanetTexture('uranus');
  uranusMesh = new THREE.Mesh(
    new THREE.SphereGeometry(15, 32, 32),
    new THREE.MeshStandardMaterial({ map: uranusTex, roughness: 0.4 })
  );
  uranusMesh.position.set(-45, -20, -1620);
  uranusMesh.visible = false;
  scene.add(uranusMesh);

  // I. Neptune (Z = -1740)
  const neptuneTex = createPlanetTexture('neptune');
  neptuneMesh = new THREE.Mesh(
    new THREE.SphereGeometry(14, 32, 32),
    new THREE.MeshStandardMaterial({ map: neptuneTex, roughness: 0.4 })
  );
  neptuneMesh.position.set(50, 15, -1740);
  neptuneMesh.visible = false;
  scene.add(neptuneMesh);

  return {
    universeSphere,
    glowSphere,
    starField,
    distantGalaxiesGroup,
    spiralGalaxyGroup,
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

  // 3. Solar System Sequential Visibility
  // Sun appears first after Milky Way (cameraZ < -550)
  if (sunMesh) sunMesh.visible = cameraZ < -550;
  if (mercuryMesh) mercuryMesh.visible = cameraZ < -700;
  if (venusMesh) venusMesh.visible = cameraZ < -750;

  // Earth & Moon strictly load ONLY AFTER passing the Sun (cameraZ < -950)
  const afterSun = cameraZ < -950;
  if (earthGroup) earthGroup.visible = afterSun;

  // Moon orbit animation around Earth
  if (moonMesh) {
    const moonAngle = time * 0.8;
    moonMesh.position.x = Math.cos(moonAngle) * 45;
    moonMesh.position.z = Math.sin(moonAngle) * 45;
    moonMesh.rotation.y = time * 0.5;
  }

  // Outer planets load as camera progresses
  if (marsMesh) marsMesh.visible = cameraZ < -1050;
  if (jupiterMesh) jupiterMesh.visible = cameraZ < -1150;
  if (saturnGroup) saturnGroup.visible = cameraZ < -1250;
  if (uranusMesh) uranusMesh.visible = cameraZ < -1350;
  if (neptuneMesh) neptuneMesh.visible = cameraZ < -1450;

  if (cloudMesh) cloudMesh.rotation.y = time * 0.03;
  if (earthMesh) earthMesh.rotation.y += 0.001;
}
