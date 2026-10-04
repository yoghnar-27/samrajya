import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const CinematicMenuCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. SCENE CREATION WITH ATMOSPHERIC FOG
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0d0b18');
    scene.fog = new THREE.FogExp2('#161226', 0.012);

    // 2. CAMERA CREATION (Cinematic elevated angle)
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(-40, 25, 50);
    camera.lookAt(0, 4, 0);

    // 3. RENDERER WITH SOFT SHADOWS & FILMIC TONE MAPPING
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 4. ATMOSPHERIC SUNSET LIGHTING
    const ambientLight = new THREE.AmbientLight('#ffdfb3', 0.65);
    scene.add(ambientLight);

    // Warm Golden-Hour Sun
    const sunLight = new THREE.DirectionalLight('#ff9e3b', 2.2);
    sunLight.position.set(50, 45, -30);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 180;
    sunLight.shadow.camera.left = -50;
    sunLight.shadow.camera.right = 50;
    sunLight.shadow.camera.top = 50;
    sunLight.shadow.camera.bottom = -50;
    sunLight.shadow.bias = -0.0004;
    scene.add(sunLight);

    // Deep Indigo Rim Light
    const rimLight = new THREE.DirectionalLight('#4338ca', 0.7);
    rimLight.position.set(-40, 20, 40);
    scene.add(rimLight);

    // 5. 3D LANDSCAPE & ANCIENT INDIAN ARCHITECTURE
    const landscapeGroup = new THREE.Group();

    // Terrain Elevation (Hills, Valley, Mountain Range)
    const groundGeo = new THREE.PlaneGeometry(120, 120, 96, 96);
    const posAttr = groundGeo.attributes.position;

    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      const dist = Math.hypot(x, y);

      // River depression
      const riverDist = Math.abs(x * 0.7 - y * 0.7);
      let zVal = Math.sin(x * 0.08) * Math.cos(y * 0.08) * 2.5;

      if (riverDist < 6) {
        zVal = -1.2;
      } else if (dist > 35) {
        // Distant Mountain Ridges
        zVal += (dist - 35) * 0.35 + Math.sin(x * 0.2) * 3;
      }

      posAttr.setZ(i, zVal);
    }
    groundGeo.computeVertexNormals();

    const groundMat = new THREE.MeshStandardMaterial({
      color: '#36291d',
      roughness: 0.85,
      metalness: 0.05,
      flatShading: true
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.receiveShadow = true;
    landscapeGroup.add(groundMesh);

    // Animated River Surface
    const riverGeo = new THREE.PlaneGeometry(130, 12, 32, 1);
    const riverMat = new THREE.MeshStandardMaterial({
      color: '#1d4ed8',
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.82
    });
    const riverMesh = new THREE.Mesh(riverGeo, riverMat);
    riverMesh.rotation.x = -Math.PI / 2;
    riverMesh.rotation.z = Math.PI / 4;
    riverMesh.position.set(0, 0.1, 0);
    landscapeGroup.add(riverMesh);

    // DISTANT SOUTH INDIAN TEMPLE VIMANA & FORT SILHOUETTES
    const buildDistantTempleVimana = (x: number, z: number, scale: number) => {
      const tGroup = new THREE.Group();
      tGroup.position.set(x, 0.5, z);
      tGroup.scale.set(scale, scale, scale);

      // Granite Base Mandapa
      const baseGeo = new THREE.BoxGeometry(8, 2, 8);
      const baseMat = new THREE.MeshStandardMaterial({ color: '#574636', roughness: 0.7 });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.y = 1;
      base.castShadow = true;
      tGroup.add(base);

      // Tiered Pyramid Towers
      for (let i = 0; i < 5; i++) {
        const sz = 6 - i * 1.0;
        const tierGeo = new THREE.BoxGeometry(sz, 1.8, sz);
        const tierMat = new THREE.MeshStandardMaterial({
          color: i === 4 ? '#d4af37' : '#735e4b',
          roughness: 0.6
        });
        const tier = new THREE.Mesh(tierGeo, tierMat);
        tier.position.y = 2 + i * 1.8;
        tier.castShadow = true;
        tGroup.add(tier);
      }

      // Golden Kalasam Crown Peak
      const crownGeo = new THREE.ConeGeometry(1.0, 2.2, 8);
      const crownMat = new THREE.MeshStandardMaterial({ color: '#fbbf24', metalness: 0.9, roughness: 0.1 });
      const crown = new THREE.Mesh(crownGeo, crownMat);
      crown.position.y = 12.1;
      tGroup.add(crown);

      landscapeGroup.add(tGroup);
    };

    const buildDistantFortBastion = (x: number, z: number, scale: number) => {
      const fGroup = new THREE.Group();
      fGroup.position.set(x, 0.5, z);
      fGroup.scale.set(scale, scale, scale);

      const wallGeo = new THREE.CylinderGeometry(5, 5.5, 4, 8);
      const wallMat = new THREE.MeshStandardMaterial({ color: '#4a3d31', roughness: 0.8 });
      const wall = new THREE.Mesh(wallGeo, wallMat);
      wall.position.y = 2;
      wall.castShadow = true;
      fGroup.add(wall);

      const towerGeo = new THREE.BoxGeometry(4, 7, 4);
      const towerMat = new THREE.MeshStandardMaterial({ color: '#665343', roughness: 0.7 });
      const tower = new THREE.Mesh(towerGeo, towerMat);
      tower.position.y = 5.5;
      tower.castShadow = true;
      fGroup.add(tower);

      landscapeGroup.add(fGroup);
    };

    buildDistantTempleVimana(0, -15, 1.2);
    buildDistantTempleVimana(-25, -25, 0.9);
    buildDistantFortBastion(25, -20, 1.1);

    // Carved Ashoka Pillar Monolith in Foreground Right
    const pillarGroup = new THREE.Group();
    pillarGroup.position.set(15, 0.5, 15);

    const pillarShaftGeo = new THREE.CylinderGeometry(0.7, 0.8, 8, 16);
    const pillarMat = new THREE.MeshStandardMaterial({ color: '#d4af37', metalness: 0.8, roughness: 0.2 });
    const shaft = new THREE.Mesh(pillarShaftGeo, pillarMat);
    shaft.position.y = 4;
    shaft.castShadow = true;
    pillarGroup.add(shaft);

    const lionCrownGeo = new THREE.SphereGeometry(1.2, 16, 16);
    const lionMat = new THREE.MeshStandardMaterial({ color: '#facc15', metalness: 0.9, roughness: 0.1 });
    const lionCrown = new THREE.Mesh(lionCrownGeo, lionMat);
    lionCrown.position.y = 8.6;
    pillarGroup.add(lionCrown);
    landscapeGroup.add(pillarGroup);

    // Scatter Trees & Palms
    const treeGeo = new THREE.ConeGeometry(1.4, 3.5, 5);
    const trunkGeo = new THREE.CylinderGeometry(0.2, 0.3, 1.2, 5);
    const treeMat = new THREE.MeshStandardMaterial({ color: '#166534', roughness: 0.9, flatShading: true });
    const trunkMat = new THREE.MeshStandardMaterial({ color: '#451a03' });

    for (let i = 0; i < 40; i++) {
      const tx = (Math.random() - 0.5) * 80;
      const tz = (Math.random() - 0.5) * 80;
      if (Math.hypot(tx, tz) > 10) {
        const treeGroup = new THREE.Group();
        treeGroup.position.set(tx, 0.5, tz);

        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.y = 0.6;
        treeGroup.add(trunk);

        const foliage = new THREE.Mesh(treeGeo, treeMat);
        foliage.position.y = 2.4;
        foliage.castShadow = true;
        treeGroup.add(foliage);

        landscapeGroup.add(treeGroup);
      }
    }

    scene.add(landscapeGroup);

    // 6. FLOATING GOLD DUST & ATMOSPHERIC EMBER PARTICLES
    const particleCount = 300;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 90;
      particlePositions[i + 1] = Math.random() * 30 + 1;
      particlePositions[i + 2] = (Math.random() - 0.5) * 90;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: '#ffd700',
      size: 0.4,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 7. CINEMATIC SLOW CAMERA ORBIT
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Slow cinematic camera orbit around the ancient landscape
      const camAngle = elapsedTime * 0.04;
      camera.position.x = Math.sin(camAngle) * 55 - 15;
      camera.position.z = Math.cos(camAngle) * 55;
      camera.position.y = 22 + Math.sin(elapsedTime * 0.5) * 2;
      camera.lookAt(0, 5, 0);

      // Particle drift
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        positions[i] -= 0.015;
        if (positions[i] < 0) positions[i] = 30;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Animate river shimmer
      riverMat.opacity = 0.78 + Math.sin(elapsedTime * 2) * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
    />
  );
};
