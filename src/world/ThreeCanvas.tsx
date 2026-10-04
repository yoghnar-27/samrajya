import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { INITIAL_TERRITORIES } from '../data/territories';
import type { Territory, TerritoryOwner, CowrieRoll } from '../game/types';

interface ThreeCanvasProps {
  isMenuMode?: boolean;
  selectedTerritoryId?: string | null;
  onSelectTerritory?: (territory: Territory | null) => void;
  isRollingCowries?: boolean;
  cowrieRollResult?: CowrieRoll | null;
  onRollComplete?: () => void;
  movingArmy?: { sourceId: string; targetId: string } | null;
  onArmyMoveComplete?: (sourceId: string, targetId: string) => void;
  validTargets?: string[];
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
  onSelectTerritory,
  isRollingCowries = false,
  cowrieRollResult,
  onRollComplete,
  movingArmy,
  onArmyMoveComplete,
  validTargets = []
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const targetCameraPos = useRef<THREE.Vector3>(new THREE.Vector3(-35, 30, 45));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 2, 0));
  const currentLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 2, 0));
  
  const cowrieGroupRef = useRef<THREE.Group | null>(null);
  const cowrieShellsRef = useRef<{ mesh: THREE.Group; velocityY: number; rotVelX: number; rotVelY: number; targetOpen: boolean }[]>([]);
  const shockwaveRingRef = useRef<THREE.Mesh | null>(null);

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

    const sunLight = new THREE.DirectionalLight('#ffcf7a', 1.8);
    sunLight.position.set(45, 55, 35);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.bias = -0.0004;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight('#3b4cca', 0.45);
    fillLight.position.set(-35, 25, -35);
    scene.add(fillLight);

    // 5. TERRAIN & ENVIRONMENT
    const terrainGroup = new THREE.Group();

    const groundGeo = new THREE.PlaneGeometry(80, 80, 80, 80);
    const posAttr = groundGeo.attributes.position;
    
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      const dist = Math.sqrt(x * x + y * y);
      const inRiver = Math.abs(x - y * 0.5) < 4;
      let zVal = Math.sin(x * 0.12) * Math.cos(y * 0.12) * 1.4;

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

    // Trade Roads
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

    INITIAL_TERRITORIES.forEach((t) => {
      t.neighbors.forEach((neighborId) => {
        const target = INITIAL_TERRITORIES.find((nt) => nt.id === neighborId);
        if (target && t.id < target.id) {
          createRoadSegment(t.position, target.position);
        }
      });
    });

    scene.add(terrainGroup);

    // 6. 3D COWRIE TRAY & 6 RECOGNIZABLE 3D COWRIE SHELLS
    const cowrieGroup = new THREE.Group();
    cowrieGroup.position.set(0, 2.5, 8);

    // Brass Throwing Tray Base
    const trayGeo = new THREE.CylinderGeometry(4.8, 5.2, 0.45, 32);
    const trayMat = new THREE.MeshStandardMaterial({ color: '#b45309', metalness: 0.8, roughness: 0.2 });
    const trayMesh = new THREE.Mesh(trayGeo, trayMat);
    trayMesh.receiveShadow = true;
    cowrieGroup.add(trayMesh);

    const trayLipGeo = new THREE.TorusGeometry(5.0, 0.18, 12, 32);
    const trayLipMat = new THREE.MeshStandardMaterial({ color: '#f59e0b', metalness: 0.9, roughness: 0.1 });
    const trayLip = new THREE.Mesh(trayLipGeo, trayLipMat);
    trayLip.rotation.x = Math.PI / 2;
    trayLip.position.y = 0.22;
    cowrieGroup.add(trayLip);

    // Create 6 Authentic 3D Ivory Cowrie Shells
    const cowrieShells: { mesh: THREE.Group; velocityY: number; rotVelX: number; rotVelY: number; targetOpen: boolean }[] = [];

    for (let i = 0; i < 6; i++) {
      const shellGroup = new THREE.Group();
      
      // Curved Ivory Porcelain Outer Shell Body
      const bodyGeo = new THREE.SphereGeometry(0.7, 14, 10);
      bodyGeo.scale(1.0, 0.42, 1.45);
      const bodyMat = new THREE.MeshStandardMaterial({ color: '#fef3c7', roughness: 0.25, metalness: 0.1 });
      const shellBody = new THREE.Mesh(bodyGeo, bodyMat);
      shellBody.castShadow = true;
      shellGroup.add(shellBody);

      // Recessed Dark Aperture Slit (Cowrie Mouth)
      const apertureGeo = new THREE.BoxGeometry(0.28, 0.12, 1.0);
      const apertureMat = new THREE.MeshStandardMaterial({ color: '#572b0c', roughness: 0.8 });
      const aperture = new THREE.Mesh(apertureGeo, apertureMat);
      aperture.position.set(0, 0.16, 0);
      shellGroup.add(aperture);

      // Shell Ridge Accents
      const ridgeGeo = new THREE.TorusGeometry(0.32, 0.04, 6, 12);
      const ridgeMat = new THREE.MeshStandardMaterial({ color: '#d97706', roughness: 0.4 });
      const ridge = new THREE.Mesh(ridgeGeo, ridgeMat);
      ridge.rotation.x = Math.PI / 2;
      ridge.position.y = 0.18;
      shellGroup.add(ridge);

      // Layout in tray
      const col = i % 3;
      const row = Math.floor(i / 3);
      shellGroup.position.set((col - 1) * 2.1, 0.4, (row - 0.5) * 2.1);

      cowrieGroup.add(shellGroup);

      cowrieShells.push({
        mesh: shellGroup,
        velocityY: 0,
        rotVelX: 0,
        rotVelY: 0,
        targetOpen: true
      });
    }

    scene.add(cowrieGroup);
    cowrieGroupRef.current = cowrieGroup;
    cowrieShellsRef.current = cowrieShells;

    // 7. IMPACT SHOCKWAVE RING
    const shockwaveGeo = new THREE.RingGeometry(0.5, 1.4, 32);
    const shockwaveMat = new THREE.MeshStandardMaterial({
      color: '#facc15',
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0
    });
    const shockwaveMesh = new THREE.Mesh(shockwaveGeo, shockwaveMat);
    shockwaveMesh.rotation.x = -Math.PI / 2;
    shockwaveMesh.position.y = 0.2;
    scene.add(shockwaveMesh);
    shockwaveRingRef.current = shockwaveMesh;

    // 8. INTERACTIVE TERRITORY RINGS
    const interactiveObjects: THREE.Object3D[] = [];
    const territoryRings: { id: string; mesh: THREE.Mesh; ringMat: THREE.MeshStandardMaterial }[] = [];

    INITIAL_TERRITORIES.forEach((t) => {
      const color = OWNER_COLORS[t.owner];
      const ringGeo = new THREE.RingGeometry(3.2, 3.8, 32);
      const ringMat = new THREE.MeshStandardMaterial({
        color: color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
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

    // 9. RAYCASTING & SELECTION
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
      if (isDragging) return;

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

    // 10. RENDER LOOP
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Camera cubic lerp
      currentLookAt.current.lerp(targetLookAt.current, 0.08);
      camera.position.lerp(targetCameraPos.current, 0.08);
      camera.lookAt(currentLookAt.current);

      // Animate shockwave impact ring
      if (shockwaveRingRef.current && shockwaveRingRef.current.material) {
        const mat = shockwaveRingRef.current.material as THREE.MeshStandardMaterial;
        if (mat.opacity > 0) {
          shockwaveRingRef.current.scale.addScalar(0.12);
          mat.opacity -= 0.03;
        }
      }

      // Highlight rings
      territoryRings.forEach(({ id, ringMat }) => {
        if (id === selectedTerritoryId) {
          ringMat.color.set('#facc15');
          ringMat.opacity = 0.95 + Math.sin(elapsedTime * 6) * 0.15;
        } else if (validTargets.includes(id)) {
          ringMat.color.set('#22c55e');
          ringMat.opacity = 0.9 + Math.sin(elapsedTime * 8) * 0.2;
        } else {
          const defaultColor = OWNER_COLORS[INITIAL_TERRITORIES.find(t => t.id === id)?.owner || 'NEUTRAL'];
          ringMat.color.set(defaultColor);
          ringMat.opacity = 0.6;
        }
      });

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
      domElem.removeEventListener('mousedown', handlePointerDown);
      domElem.removeEventListener('mousemove', handlePointerMove);
      domElem.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isMenuMode, selectedTerritoryId, validTargets]);

  // Handle Camera Zoom to Cowrie Tray on Roll
  useEffect(() => {
    if (isRollingCowries) {
      targetLookAt.current.set(0, 2.5, 8);
      targetCameraPos.current.set(0, 9.5, 13.5);

      if (cowrieShellsRef.current.length === 6 && cowrieRollResult) {
        cowrieShellsRef.current.forEach((shell, idx) => {
          shell.velocityY = 0.28 + Math.random() * 0.18;
          shell.rotVelX = (Math.random() - 0.5) * 0.5;
          shell.rotVelY = (Math.random() - 0.5) * 0.5;
          shell.targetOpen = cowrieRollResult.shells[idx];
        });

        let steps = 0;
        const interval = setInterval(() => {
          steps++;
          cowrieShellsRef.current.forEach((shell) => {
            shell.mesh.position.y += shell.velocityY;
            shell.velocityY -= 0.022; // gravity
            if (shell.mesh.position.y < 0.4) shell.mesh.position.y = 0.4;

            shell.mesh.rotation.x += shell.rotVelX;
            shell.mesh.rotation.z += shell.rotVelY;
          });

          if (steps >= 38) {
            clearInterval(interval);
            cowrieShellsRef.current.forEach((shell) => {
              shell.mesh.position.y = 0.4;
              shell.mesh.rotation.x = shell.targetOpen ? 0 : Math.PI;
              shell.mesh.rotation.z = 0;
            });

            if (onRollComplete) {
              setTimeout(onRollComplete, 1200);
            }
          }
        }, 40);
      }
    } else if (!selectedTerritoryId) {
      targetLookAt.current.set(0, 2, 0);
      targetCameraPos.current.set(-35, 30, 45);
    }
  }, [isRollingCowries, cowrieRollResult, selectedTerritoryId, onRollComplete]);

  // Handle Army March Movement Animation along Path
  useEffect(() => {
    if (movingArmy) {
      const srcT = INITIAL_TERRITORIES.find((t) => t.id === movingArmy.sourceId);
      const dstT = INITIAL_TERRITORIES.find((t) => t.id === movingArmy.targetId);

      if (srcT && dstT) {
        const startPos = new THREE.Vector3(srcT.position.x, srcT.position.y, srcT.position.z);
        const endPos = new THREE.Vector3(dstT.position.x, dstT.position.y, dstT.position.z);

        targetLookAt.current.copy(startPos);
        targetCameraPos.current.set(startPos.x - 12, startPos.y + 14, startPos.z + 18);

        let progress = 0;
        const marchInterval = setInterval(() => {
          progress += 0.04;
          const currentPos = new THREE.Vector3().lerpVectors(startPos, endPos, progress);
          
          targetLookAt.current.copy(currentPos);
          targetCameraPos.current.set(currentPos.x - 12, currentPos.y + 14, currentPos.z + 18);

          if (progress >= 1.0) {
            clearInterval(marchInterval);
            
            if (shockwaveRingRef.current) {
              shockwaveRingRef.current.position.set(dstT.position.x, dstT.position.y + 0.1, dstT.position.z);
              shockwaveRingRef.current.scale.set(1, 1, 1);
              (shockwaveRingRef.current.material as THREE.MeshStandardMaterial).opacity = 0.9;
            }

            if (onArmyMoveComplete) {
              onArmyMoveComplete(movingArmy.sourceId, movingArmy.targetId);
            }
          }
        }, 40);
      }
    }
  }, [movingArmy, onArmyMoveComplete]);

  // Camera zoom focus on selected territory
  useEffect(() => {
    if (!isRollingCowries && !movingArmy && selectedTerritoryId) {
      const t = INITIAL_TERRITORIES.find((t) => t.id === selectedTerritoryId);
      if (t) {
        targetLookAt.current.set(t.position.x, t.position.y, t.position.z);
        targetCameraPos.current.set(t.position.x - 18, t.position.y + 18, t.position.z + 24);
      }
    }
  }, [selectedTerritoryId, isRollingCowries, movingArmy]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full cursor-pointer overflow-hidden"
    />
  );
};
