import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeCanvasProps {
  isMenuMode?: boolean;
  onTerritoryClick?: (territoryId: string) => void;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({ isMenuMode = true }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. SCENE CREATION
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0a0d18');
    scene.fog = new THREE.FogExp2('#111628', 0.015);

    // 2. CAMERA CREATION
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    // Initial camera position for isometric perspective
    camera.position.set(-35, 30, 45);
    camera.lookAt(0, 2, 0);

    // 3. RENDERER CREATION
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // 4. LIGHTING SYSTEM
    const ambientLight = new THREE.AmbientLight('#ffeacc', 0.6);
    scene.add(ambientLight);

    // Golden Sunset Directional Sun Light
    const sunLight = new THREE.DirectionalLight('#ffcf7a', 1.8);
    sunLight.position.set(40, 50, 30);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 150;
    sunLight.shadow.camera.left = -40;
    sunLight.shadow.camera.right = 40;
    sunLight.shadow.camera.top = 40;
    sunLight.shadow.camera.bottom = -40;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // Soft Indigo Fill Light
    const fillLight = new THREE.DirectionalLight('#3b4cca', 0.5);
    fillLight.position.set(-30, 20, -30);
    scene.add(fillLight);

    // 5. TERRAIN & GROUND
    const terrainGroup = new THREE.Group();

    // Main Ground Board Surface (Sandstone / Earth Texture)
    const groundGeometry = new THREE.PlaneGeometry(70, 70, 64, 64);
    
    // Add subtle procedural terrain height
    const posAttr = groundGeometry.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      // Distance from center
      const dist = Math.sqrt(x * x + y * y);
      const height = Math.sin(x * 0.15) * Math.cos(y * 0.15) * 1.2 + (dist > 28 ? (dist - 28) * 0.2 : 0);
      posAttr.setZ(i, height);
    }
    groundGeometry.computeVertexNormals();

    const groundMaterial = new THREE.MeshStandardMaterial({
      color: '#423326',
      roughness: 0.85,
      metalness: 0.1,
      flatShading: true
    });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.receiveShadow = true;
    terrainGroup.add(groundMesh);

    // Ancient River Bed (Blue Lapis Lazuli Water)
    const riverGeometry = new THREE.PlaneGeometry(68, 8, 32, 1);
    const riverMaterial = new THREE.MeshStandardMaterial({
      color: '#1d4ed8',
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.8
    });
    const riverMesh = new THREE.Mesh(riverGeometry, riverMaterial);
    riverMesh.rotation.x = -Math.PI / 2;
    riverMesh.rotation.z = Math.PI / 6;
    riverMesh.position.set(0, 0.15, 0);
    terrainGroup.add(riverMesh);

    // PACHISI ROADS / TRADE PATHWAYS (Carved Sandstone Trails)
    const roadMaterial = new THREE.MeshStandardMaterial({
      color: '#8c6f56',
      roughness: 0.9
    });

    const createRoadSegment = (x1: number, z1: number, x2: number, z2: number) => {
      const dx = x2 - x1;
      const dz = z2 - z1;
      const length = Math.sqrt(dx * dx + dz * dz);
      const angle = Math.atan2(dz, dx);

      const roadGeo = new THREE.BoxGeometry(length, 0.1, 1.8);
      const roadMesh = new THREE.Mesh(roadGeo, roadMaterial);
      roadMesh.position.set((x1 + x2) / 2, 0.12, (z1 + z2) / 2);
      roadMesh.rotation.y = -angle;
      roadMesh.receiveShadow = true;
      terrainGroup.add(roadMesh);
    };

    // Connect 4 capitals & central crossroads
    createRoadSegment(-18, 18, 0, 0);   // Chola to Center
    createRoadSegment(18, -18, 0, 0);  // Vijayanagara to Center
    createRoadSegment(-18, -18, 0, 0); // Maurya to Center
    createRoadSegment(18, 18, 0, 0);   // Kanchipuram to Center
    createRoadSegment(-18, 18, -18, -18); // Outer West
    createRoadSegment(18, -18, 18, 18);   // Outer East

    scene.add(terrainGroup);

    // 6. PROCEDURAL 3D ARCHITECTURE & LANDMARKS
    const buildDravidianTemple = (x: number, z: number, primaryColor: string) => {
      const group = new THREE.Group();
      group.position.set(x, 0.2, z);

      // Base Platform (Mandapa Base)
      const baseGeo = new THREE.BoxGeometry(7, 1.2, 7);
      const baseMat = new THREE.MeshStandardMaterial({ color: '#594a3e', roughness: 0.7 });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.y = 0.6;
      baseMesh.castShadow = true;
      baseMesh.receiveShadow = true;
      group.add(baseMesh);

      // Tiered Vimana Pyramid
      for (let level = 0; level < 4; level++) {
        const size = 5 - level * 1.1;
        const height = 1.4;
        const geo = new THREE.BoxGeometry(size, height, size);
        const mat = new THREE.MeshStandardMaterial({
          color: level === 3 ? '#d4af37' : '#736152',
          roughness: 0.6
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.y = 1.2 + level * height;
        mesh.castShadow = true;
        group.add(mesh);
      }

      // Kalasam Crown (Gold Dome Peak)
      const domeGeo = new THREE.ConeGeometry(0.8, 1.6, 8);
      const domeMat = new THREE.MeshStandardMaterial({ color: '#f59e0b', metalness: 0.8, roughness: 0.2 });
      const domeMesh = new THREE.Mesh(domeGeo, domeMat);
      domeMesh.position.y = 7.4;
      group.add(domeMesh);

      // Royal Flag Banner
      const poleGeo = new THREE.CylinderGeometry(0.08, 0.08, 6);
      const poleMat = new THREE.MeshStandardMaterial({ color: '#2b231b' });
      const poleMesh = new THREE.Mesh(poleGeo, poleMat);
      poleMesh.position.set(3, 3, 3);
      group.add(poleMesh);

      const flagGeo = new THREE.BoxGeometry(1.6, 0.8, 0.05);
      const flagMat = new THREE.MeshStandardMaterial({ color: primaryColor });
      const flagMesh = new THREE.Mesh(flagGeo, flagMat);
      flagMesh.position.set(3.8, 5.4, 3);
      group.add(flagMesh);

      scene.add(group);
      return group;
    };

    const buildFortCitadel = (x: number, z: number, primaryColor: string) => {
      const group = new THREE.Group();
      group.position.set(x, 0.2, z);

      // Fort Wall Circle
      const wallGeo = new THREE.CylinderGeometry(4, 4, 2, 8, 1, true);
      const wallMat = new THREE.MeshStandardMaterial({ color: '#6e5d4f', roughness: 0.8, side: THREE.DoubleSide });
      const wallMesh = new THREE.Mesh(wallGeo, wallMat);
      wallMesh.position.y = 1;
      wallMesh.castShadow = true;
      group.add(wallMesh);

      // Central Royal Tower
      const towerGeo = new THREE.BoxGeometry(3, 4.5, 3);
      const towerMat = new THREE.MeshStandardMaterial({ color: '#8c7766', roughness: 0.7 });
      const towerMesh = new THREE.Mesh(towerGeo, towerMat);
      towerMesh.position.y = 2.25;
      towerMesh.castShadow = true;
      group.add(towerMesh);

      // Flag
      const flagGeo = new THREE.BoxGeometry(1.4, 0.7, 0.05);
      const flagMat = new THREE.MeshStandardMaterial({ color: primaryColor });
      const flagMesh = new THREE.Mesh(flagGeo, flagMat);
      flagMesh.position.set(0, 5, 0);
      group.add(flagMesh);

      scene.add(group);
      return group;
    };

    // Instantiate 4 Kingdom Capitals
    buildDravidianTemple(-18, 18, '#b91c1c');   // Chola Capital (Maroon Flag)
    buildDravidianTemple(18, -18, '#d97706');  // Vijayanagara Capital (Ocher Flag)
    buildFortCitadel(-18, -18, '#1e3a8a');     // Maurya Capital (Indigo Flag)
    buildDravidianTemple(18, 18, '#854d0e');   // Kanchipuram Realm (Sandstone Flag)

    // Central Royal Crossroads Monument (Ashoka Pillar Monolith)
    const pillarGroup = new THREE.Group();
    const pillarBaseGeo = new THREE.CylinderGeometry(2, 2.5, 1, 8);
    const pillarBaseMat = new THREE.MeshStandardMaterial({ color: '#8c6f56' });
    const pillarBase = new THREE.Mesh(pillarBaseGeo, pillarBaseMat);
    pillarBase.position.y = 0.5;
    pillarGroup.add(pillarBase);

    const pillarShaftGeo = new THREE.CylinderGeometry(0.5, 0.6, 6, 16);
    const pillarShaftMat = new THREE.MeshStandardMaterial({ color: '#d4af37', metalness: 0.6, roughness: 0.3 });
    const pillarShaft = new THREE.Mesh(pillarShaftGeo, pillarShaftMat);
    pillarShaft.position.y = 4;
    pillarShaft.castShadow = true;
    pillarGroup.add(pillarShaft);

    // Lion Capital Crown
    const crownGeo = new THREE.SphereGeometry(0.9, 12, 12);
    const crownMat = new THREE.MeshStandardMaterial({ color: '#fbbf24', metalness: 0.8, roughness: 0.2 });
    const crown = new THREE.Mesh(crownGeo, crownMat);
    crown.position.y = 7.3;
    pillarGroup.add(crown);
    scene.add(pillarGroup);

    // Scatter Low-Poly Trees / Palms
    const treeGeo = new THREE.ConeGeometry(1.2, 3, 5);
    const trunkGeo = new THREE.CylinderGeometry(0.2, 0.3, 1, 5);
    const treeMat = new THREE.MeshStandardMaterial({ color: '#15803d', roughness: 0.9, flatShading: true });
    const trunkMat = new THREE.MeshStandardMaterial({ color: '#451a03' });

    for (let i = 0; i < 35; i++) {
      const tx = (Math.random() - 0.5) * 55;
      const tz = (Math.random() - 0.5) * 55;
      // Don't place trees right inside roads or capitals
      if (Math.hypot(tx, tz) > 6 && Math.hypot(tx + 18, tz - 18) > 8 && Math.hypot(tx - 18, tz + 18) > 8) {
        const treeGroup = new THREE.Group();
        treeGroup.position.set(tx, 0.5, tz);

        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.y = 0.5;
        treeGroup.add(trunk);

        const foliage = new THREE.Mesh(treeGeo, treeMat);
        foliage.position.y = 2;
        foliage.castShadow = true;
        treeGroup.add(foliage);

        scene.add(treeGroup);
      }
    }

    // 7. FLOATING ATMOSPHERIC GOLD DUST PARTICLES
    const particleCount = 250;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 80;
      particlePositions[i + 1] = Math.random() * 25 + 1;
      particlePositions[i + 2] = (Math.random() - 0.5) * 80;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: '#ffd700',
      size: 0.35,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 8. INTERACTIVE CAMERA CONTROLS (Smooth Orbit & Pan)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let cameraAngle = Math.PI / 4;
    let cameraDistance = 55;
    let targetAngle = cameraAngle;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      targetAngle += deltaX * 0.005;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      cameraDistance = THREE.MathUtils.clamp(cameraDistance + e.deltaY * 0.03, 20, 85);
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    domElem.addEventListener('wheel', handleWheel, { passive: true });

    // 9. ANIMATION & RENDER LOOP
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Slow cinematic camera orbit if in Main Menu mode
      if (isMenuMode) {
        targetAngle += 0.0012;
      }

      // Interpolate camera position smoothly
      cameraAngle += (targetAngle - cameraAngle) * 0.05;
      camera.position.x = Math.sin(cameraAngle) * cameraDistance;
      camera.position.z = Math.cos(cameraAngle) * cameraDistance;
      camera.position.y = cameraDistance * 0.55;
      camera.lookAt(0, 2, 0);

      // Animate river ripple opacity & particle drift
      riverMaterial.opacity = 0.75 + Math.sin(elapsedTime * 2) * 0.1;
      
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        positions[i] -= 0.02;
        if (positions[i] < 0) positions[i] = 25;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Animate Ashoka Crown gentle pulse glow
      crown.rotation.y = elapsedTime * 0.4;

      renderer.render(scene, camera);
    };

    animate();

    // 10. RESIZE HANDLER
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // CLEANUP ON UNMOUNT
    return () => {
      cancelAnimationFrame(animationFrameId);
      domElem.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domElem.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isMenuMode]);

  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing overflow-hidden"
    />
  );
};
