import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { INITIAL_TERRITORIES } from '../data/territories';
import type { Territory, TerritoryOwner } from '../game/types';

interface ThreeCanvasProps {
  isMenuMode?: boolean;
  selectedTerritoryId?: string | null;
  onSelectTerritory?: (territory: Territory | null) => void;
}

const OWNER_COLORS: Record<TerritoryOwner, string> = {
  PLAYER: '#dc2626',   // Chola Red
  RIVAL_1: '#d97706',  // Vijayanagara Amber
  RIVAL_2: '#2563eb',  // Maurya Blue
  NEUTRAL: '#059669'   // Neutral Emerald
};

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  isMenuMode = false,
  selectedTerritoryId,
  onSelectTerritory
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const targetCameraPos = useRef<THREE.Vector3>(new THREE.Vector3(-35, 30, 45));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 2, 0));
  const currentLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 2, 0));

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. SCENE CREATION
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#080a14');
    scene.fog = new THREE.FogExp2('#0e1324', 0.014);

    // 2. CAMERA CREATION
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(-35, 30, 45);
    camera.lookAt(0, 2, 0);

    // 3. RENDERER CREATION
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 4. LIGHTING SYSTEM
    const ambientLight = new THREE.AmbientLight('#ffeacc', 0.55);
    scene.add(ambientLight);

    // Sun Directional Light (Warm Golden Hour)
    const sunLight = new THREE.DirectionalLight('#ffcf7a', 1.8);
    sunLight.position.set(45, 55, 35);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 160;
    sunLight.shadow.camera.left = -45;
    sunLight.shadow.camera.right = 45;
    sunLight.shadow.camera.top = 45;
    sunLight.shadow.camera.bottom = -45;
    sunLight.shadow.bias = -0.0004;
    scene.add(sunLight);

    // Rim Light (Indigo Sky Fill)
    const fillLight = new THREE.DirectionalLight('#3b4cca', 0.45);
    fillLight.position.set(-35, 25, -35);
    scene.add(fillLight);

    // 5. TERRAIN & ENVIRONMENT
    const terrainGroup = new THREE.Group();

    // Board Ground with Height Elevation
    const groundGeo = new THREE.PlaneGeometry(80, 80, 80, 80);
    const posAttr = groundGeo.attributes.position;
    
    // Elevate Fort hills and depress river valley
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      const dist = Math.sqrt(x * x + y * y);
      
      // River channel depression
      const inRiver = Math.abs(x - y * 0.5) < 4;
      let zVal = Math.sin(x * 0.12) * Math.cos(y * 0.12) * 1.4;

      // Elevated Fort Mounds
      if (Math.hypot(x - 10, y + 8) < 6 || Math.hypot(x + 10, y + 8) < 6 || Math.hypot(x + 8, y - 12) < 6) {
        zVal += 2.2;
      }
      if (inRiver) {
        zVal = -0.8;
      } else if (dist > 32) {
        zVal += (dist - 32) * 0.25;
      }
      
      posAttr.setZ(i, zVal);
    }
    groundGeo.computeVertexNormals();

    const groundMat = new THREE.MeshStandardMaterial({
      color: '#3d3024',
      roughness: 0.85,
      metalness: 0.05,
      flatShading: true
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.receiveShadow = true;
    terrainGroup.add(groundMesh);

    // Animated River Surface
    const riverGeo = new THREE.PlaneGeometry(85, 9, 32, 1);
    const riverMat = new THREE.MeshStandardMaterial({
      color: '#1e40af',
      roughness: 0.15,
      metalness: 0.85,
      transparent: true,
      opacity: 0.8
    });
    const riverMesh = new THREE.Mesh(riverGeo, riverMat);
    riverMesh.rotation.x = -Math.PI / 2;
    riverMesh.rotation.z = Math.PI / 5;
    riverMesh.position.set(0, 0.1, 0);
    terrainGroup.add(riverMesh);

    // Stepped Terraced Farmlands (Villages)
    const createFarmland = (x: number, z: number) => {
      const farmGroup = new THREE.Group();
      farmGroup.position.set(x, 0.2, z);
      
      for (let i = 0; i < 3; i++) {
        const stepGeo = new THREE.BoxGeometry(4 - i * 0.8, 0.2, 3 - i * 0.6);
        const stepMat = new THREE.MeshStandardMaterial({ color: i % 2 === 0 ? '#15803d' : '#854d0e', roughness: 0.9 });
        const step = new THREE.Mesh(stepGeo, stepMat);
        step.position.y = i * 0.2;
        step.receiveShadow = true;
        farmGroup.add(step);
      }
      terrainGroup.add(farmGroup);
    };

    createFarmland(-14, 8);
    createFarmland(14, -6);
    createFarmland(-8, -17);

    // PACHISI TRADE PATHWAYS (Carved Sandstone Roads)
    const roadMat = new THREE.MeshStandardMaterial({ color: '#8c6f56', roughness: 0.9 });

    const createRoadSegment = (p1: { x: number; z: number }, p2: { x: number; z: number }) => {
      const dx = p2.x - p1.x;
      const dz = p2.z - p1.z;
      const length = Math.hypot(dx, dz);
      const angle = Math.atan2(dz, dx);

      const roadGeo = new THREE.BoxGeometry(length, 0.08, 1.8);
      const roadMesh = new THREE.Mesh(roadGeo, roadMat);
      roadMesh.position.set((p1.x + p2.x) / 2, 0.15, (p1.z + p2.z) / 2);
      roadMesh.rotation.y = -angle;
      roadMesh.receiveShadow = true;
      terrainGroup.add(roadMesh);
    };

    // Connect neighbor territories with trade pathways
    INITIAL_TERRITORIES.forEach((t) => {
      t.neighbors.forEach((neighborId) => {
        const target = INITIAL_TERRITORIES.find((nt) => nt.id === neighborId);
        if (target && t.id < target.id) {
          createRoadSegment(t.position, target.position);
        }
      });
    });

    scene.add(terrainGroup);

    // 6. KINGDOM CAPITALS & ARCHITECTURE BUILDERS
    const interactiveObjects: THREE.Object3D[] = [];

    // Helper: Chola Dravidian Vimana Temple (South-West)
    const buildCholaCapital = (pos: { x: number; y: number; z: number }) => {
      const group = new THREE.Group();
      group.position.set(pos.x, pos.y, pos.z);

      const baseGeo = new THREE.BoxGeometry(7.5, 1.2, 7.5);
      const baseMat = new THREE.MeshStandardMaterial({ color: '#45372b', roughness: 0.7 });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.y = 0.6;
      base.castShadow = true;
      group.add(base);

      // Tiered Granite Pyramid
      for (let i = 0; i < 4; i++) {
        const sz = 5.5 - i * 1.2;
        const tierGeo = new THREE.BoxGeometry(sz, 1.3, sz);
        const tierMat = new THREE.MeshStandardMaterial({ color: i === 3 ? '#d4af37' : '#735f4d', roughness: 0.6 });
        const tier = new THREE.Mesh(tierGeo, tierMat);
        tier.position.y = 1.2 + i * 1.3;
        tier.castShadow = true;
        group.add(tier);
      }

      // Golden Kalasam Crown
      const domeGeo = new THREE.ConeGeometry(0.9, 1.8, 8);
      const domeMat = new THREE.MeshStandardMaterial({ color: '#f59e0b', metalness: 0.85, roughness: 0.2 });
      const dome = new THREE.Mesh(domeGeo, domeMat);
      dome.position.y = 7.5;
      group.add(dome);

      scene.add(group);
    };

    // Helper: Vijayanagara Monolithic Pavilion (North-East)
    const buildVijayanagaraCapital = (pos: { x: number; y: number; z: number }) => {
      const group = new THREE.Group();
      group.position.set(pos.x, pos.y, pos.z);

      // Base Mandapa
      const baseGeo = new THREE.BoxGeometry(8, 1, 8);
      const baseMat = new THREE.MeshStandardMaterial({ color: '#854d0e', roughness: 0.8 });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.y = 0.5;
      base.castShadow = true;
      group.add(base);

      // Monolithic Pillars
      const pillarMat = new THREE.MeshStandardMaterial({ color: '#d97706', roughness: 0.5 });
      for (let dx of [-2.5, 2.5]) {
        for (let dz of [-2.5, 2.5]) {
          const pGeo = new THREE.CylinderGeometry(0.4, 0.4, 4, 8);
          const pillar = new THREE.Mesh(pGeo, pillarMat);
          pillar.position.set(dx, 2.5, dz);
          pillar.castShadow = true;
          group.add(pillar);
        }
      }

      // Royal Cupola Roof
      const roofGeo = new THREE.BoxGeometry(7, 1.2, 7);
      const roofMat = new THREE.MeshStandardMaterial({ color: '#fbbf24', metalness: 0.7 });
      const roof = new THREE.Mesh(roofGeo, roofMat);
      roof.position.y = 5;
      roof.castShadow = true;
      group.add(roof);

      scene.add(group);
    };

    // Helper: Maurya Sandstone Stupa Citadel (North-West)
    const buildMauryaCapital = (pos: { x: number; y: number; z: number }) => {
      const group = new THREE.Group();
      group.position.set(pos.x, pos.y, pos.z);

      const baseGeo = new THREE.CylinderGeometry(4.5, 5, 1.5, 16);
      const baseMat = new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.7 });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.y = 0.75;
      base.castShadow = true;
      group.add(base);

      const domeGeo = new THREE.SphereGeometry(3.5, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
      const domeMat = new THREE.MeshStandardMaterial({ color: '#1e3a8a', roughness: 0.4 });
      const dome = new THREE.Mesh(domeGeo, domeMat);
      dome.position.y = 1.5;
      dome.castShadow = true;
      group.add(dome);

      scene.add(group);
    };

    // Helper: Rajput Hill Fort Citadel (South-East)
    const buildRajputCapital = (pos: { x: number; y: number; z: number }) => {
      const group = new THREE.Group();
      group.position.set(pos.x, pos.y, pos.z);

      const fortGeo = new THREE.BoxGeometry(7, 3, 7);
      const fortMat = new THREE.MeshStandardMaterial({ color: '#78350f', roughness: 0.8 });
      const fort = new THREE.Mesh(fortGeo, fortMat);
      fort.position.y = 1.5;
      fort.castShadow = true;
      group.add(fort);

      // Jharokha Watchtower
      const towerGeo = new THREE.CylinderGeometry(1.8, 2, 5, 8);
      const towerMat = new THREE.MeshStandardMaterial({ color: '#facc15', metalness: 0.5 });
      const tower = new THREE.Mesh(towerGeo, towerMat);
      tower.position.y = 4.5;
      tower.castShadow = true;
      group.add(tower);

      scene.add(group);
    };

    // Helper: Fort Outpost
    const buildFort = (pos: { x: number; y: number; z: number }, color: string) => {
      const group = new THREE.Group();
      group.position.set(pos.x, pos.y, pos.z);

      const baseGeo = new THREE.CylinderGeometry(3, 3.5, 2, 8);
      const baseMat = new THREE.MeshStandardMaterial({ color: '#57534e', roughness: 0.8 });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.y = 1;
      base.castShadow = true;
      group.add(base);

      const bannerGeo = new THREE.CylinderGeometry(0.1, 0.1, 4, 8);
      const bannerMat = new THREE.MeshStandardMaterial({ color: color });
      const banner = new THREE.Mesh(bannerGeo, bannerMat);
      banner.position.y = 3;
      group.add(banner);

      scene.add(group);
    };

    // Helper: Village Huts
    const buildVillage = (pos: { x: number; y: number; z: number }) => {
      const group = new THREE.Group();
      group.position.set(pos.x, pos.y, pos.z);

      for (let i = 0; i < 3; i++) {
        const ox = (i - 1) * 1.8;
        const hutGeo = new THREE.ConeGeometry(1.2, 1.5, 5);
        const hutMat = new THREE.MeshStandardMaterial({ color: '#a16207', roughness: 0.9 });
        const hut = new THREE.Mesh(hutGeo, hutMat);
        hut.position.set(ox, 0.75, (i % 2) * 1.2);
        hut.castShadow = true;
        group.add(hut);
      }

      scene.add(group);
    };

    // Build All Architecture
    buildCholaCapital(INITIAL_TERRITORIES[0].position);
    buildVijayanagaraCapital(INITIAL_TERRITORIES[1].position);
    buildMauryaCapital(INITIAL_TERRITORIES[2].position);
    buildRajputCapital(INITIAL_TERRITORIES[3].position);

    buildFort(INITIAL_TERRITORIES[4].position, OWNER_COLORS.PLAYER);
    buildFort(INITIAL_TERRITORIES[5].position, OWNER_COLORS.RIVAL_1);
    buildFort(INITIAL_TERRITORIES[6].position, OWNER_COLORS.RIVAL_2);

    buildVillage(INITIAL_TERRITORIES[8].position);
    buildVillage(INITIAL_TERRITORIES[9].position);
    buildVillage(INITIAL_TERRITORIES[10].position);
    buildVillage(INITIAL_TERRITORIES[11].position);

    // 7. 3D ARMY UNITS (Low-Poly Soldiers & Banners)
    const armyGroup = new THREE.Group();

    const createArmyUnit3D = (pos: { x: number; y: number; z: number }, owner: TerritoryOwner, count: number) => {
      const unit = new THREE.Group();
      unit.position.set(pos.x + 2.5, pos.y + 0.2, pos.z + 2.5);

      const color = OWNER_COLORS[owner];

      // Shield & Armor Figure
      const bodyGeo = new THREE.CylinderGeometry(0.4, 0.6, 1.4, 8);
      const bodyMat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.5 });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.y = 0.7;
      body.castShadow = true;
      unit.add(body);

      // Spear
      const spearGeo = new THREE.CylinderGeometry(0.05, 0.05, 2.5, 6);
      const spearMat = new THREE.MeshStandardMaterial({ color: '#f59e0b', metalness: 0.8 });
      const spear = new THREE.Mesh(spearGeo, spearMat);
      spear.position.set(0.5, 1.25, 0.2);
      spear.rotation.z = -Math.PI / 12;
      unit.add(spear);

      // Army Count Floating Badge
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(64, 64, 55, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 8;
        ctx.strokeStyle = '#facc15';
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 54px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(count.toString(), 64, 64);
      }

      const texture = new THREE.CanvasTexture(canvas);
      const badgeMat = new THREE.SpriteMaterial({ map: texture });
      const badgeSprite = new THREE.Sprite(badgeMat);
      badgeSprite.position.set(0, 2.8, 0);
      badgeSprite.scale.set(1.6, 1.6, 1);
      unit.add(badgeSprite);

      armyGroup.add(unit);
    };

    INITIAL_TERRITORIES.forEach((t) => {
      createArmyUnit3D(t.position, t.owner, t.armyStrength);
    });

    scene.add(armyGroup);

    // 8. INTERACTIVE TERRITORY SELECTION RINGS
    const territoryRings: { id: string; mesh: THREE.Mesh; ringMat: THREE.MeshStandardMaterial }[] = [];

    INITIAL_TERRITORIES.forEach((t) => {
      const color = OWNER_COLORS[t.owner];
      const ringGeo = new THREE.RingGeometry(3.2, 3.8, 32);
      const ringMat = new THREE.MeshStandardMaterial({
        color: color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
        roughness: 0.3
      });

      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = -Math.PI / 2;
      ringMesh.position.set(t.position.x, t.position.y + 0.05, t.position.z);
      ringMesh.userData = { territory: t };
      scene.add(ringMesh);

      interactiveObjects.push(ringMesh);
      territoryRings.push({ id: t.id, mesh: ringMesh, ringMat });
    });

    // Central Ashoka Pillar Monument
    const ashokaGroup = new THREE.Group();
    const shaftGeo = new THREE.CylinderGeometry(0.5, 0.6, 6, 16);
    const shaftMat = new THREE.MeshStandardMaterial({ color: '#d4af37', metalness: 0.7, roughness: 0.3 });
    const shaft = new THREE.Mesh(shaftGeo, shaftMat);
    shaft.position.y = 3;
    ashokaGroup.add(shaft);

    const crownGeo = new THREE.SphereGeometry(1, 12, 12);
    const crownMat = new THREE.MeshStandardMaterial({ color: '#fbbf24', metalness: 0.9, roughness: 0.1 });
    const crown = new THREE.Mesh(crownGeo, crownMat);
    crown.position.y = 6.5;
    ashokaGroup.add(crown);
    scene.add(ashokaGroup);

    // Floating Gold Dust Particles
    const particleCount = 200;
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

    // 9. RAYCASTING & CLICK SELECTION
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    let mouseDownPos = { x: 0, y: 0 };

    const handlePointerDown = (e: MouseEvent) => {
      isDragging = false;
      mouseDownPos = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: MouseEvent) => {
      if (Math.hypot(e.clientX - mouseDownPos.x, e.clientY - mouseDownPos.y) > 5) {
        isDragging = true;
      }
    };

    const handlePointerUp = (e: MouseEvent) => {
      if (isDragging) return; // Ignore click if user was dragging camera

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects, false);

      if (intersects.length > 0) {
        const hitObject = intersects[0].object;
        const territory = hitObject.userData.territory as Territory;
        if (territory && onSelectTerritory) {
          onSelectTerritory(territory);
        }
      }
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', handlePointerDown);
    domElem.addEventListener('mousemove', handlePointerMove);
    domElem.addEventListener('mouseup', handlePointerUp);

    // 10. ANIMATION & RENDER LOOP
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera pan / focus lerp
      currentLookAt.current.lerp(targetLookAt.current, 0.08);
      camera.position.lerp(targetCameraPos.current, 0.08);
      camera.lookAt(currentLookAt.current);

      // Rotate Ashoka crown and float particles
      crown.rotation.y = elapsedTime * 0.5;

      // Pulse selected territory ring
      territoryRings.forEach(({ id, ringMat }) => {
        if (id === selectedTerritoryId) {
          ringMat.opacity = 0.9 + Math.sin(elapsedTime * 6) * 0.15;
        } else {
          ringMat.opacity = 0.6;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // 11. RESIZE HANDLER
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElem.removeEventListener('mousedown', handlePointerDown);
      domElem.removeEventListener('mousemove', handlePointerMove);
      domElem.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isMenuMode, selectedTerritoryId]);

  // Handle smooth camera zoom to selected territory
  useEffect(() => {
    if (!selectedTerritoryId) {
      targetLookAt.current.set(0, 2, 0);
      targetCameraPos.current.set(-35, 30, 45);
      return;
    }

    const t = INITIAL_TERRITORIES.find((t) => t.id === selectedTerritoryId);
    if (t) {
      targetLookAt.current.set(t.position.x, t.position.y, t.position.z);
      targetCameraPos.current.set(t.position.x - 18, t.position.y + 18, t.position.z + 24);
    }
  }, [selectedTerritoryId]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full cursor-pointer overflow-hidden"
    />
  );
};
