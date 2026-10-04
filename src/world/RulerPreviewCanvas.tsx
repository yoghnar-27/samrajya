import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { RulerType } from '../game/types';

interface RulerPreviewCanvasProps {
  rulerType: RulerType;
  isSelected: boolean;
  isHovered: boolean;
}

export const RulerPreviewCanvas: React.FC<RulerPreviewCanvasProps> = ({
  rulerType,
  isSelected,
  isHovered
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef(isHovered);
  const selectRef = useRef(isSelected);

  useEffect(() => {
    hoverRef.current = isHovered;
    selectRef.current = isSelected;
  }, [isHovered, isSelected]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. SCENE & CAMERA
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(38, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 2.6, 8.5);
    camera.lookAt(0, 2.3, 0);

    // 2. RENDERER WITH SOFT SHADOWS
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // 3. LIGHTING
    const ambientLight = new THREE.AmbientLight('#fffaed', 0.85);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight('#fbbf24', 2.5);
    sunLight.position.set(6, 10, 8);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight('#38bdf8', 1.2);
    rimLight.position.set(-6, 5, -5);
    scene.add(rimLight);

    // Spotlight on selection
    const spotLight = new THREE.SpotLight('#facc15', 3.0, 15, Math.PI / 4, 0.5);
    spotLight.position.set(0, 8, 3);
    spotLight.target.position.set(0, 2, 0);
    scene.add(spotLight);
    scene.add(spotLight.target);

    // 4. ROYAL STONE PEDESTAL BASE
    const pedestalGroup = new THREE.Group();

    const pedestalGeo = new THREE.CylinderGeometry(2.0, 2.3, 0.5, 24);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: '#3d3023',
      roughness: 0.6,
      metalness: 0.2
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = 0.25;
    pedestal.receiveShadow = true;
    pedestalGroup.add(pedestal);

    const goldRingGeo = new THREE.TorusGeometry(2.05, 0.07, 12, 32);
    const goldRingMat = new THREE.MeshStandardMaterial({
      color: isSelected ? '#facc15' : '#d4af37',
      metalness: 0.9,
      roughness: 0.1
    });
    const goldRing = new THREE.Mesh(goldRingGeo, goldRingMat);
    goldRing.rotation.x = Math.PI / 2;
    goldRing.position.y = 0.5;
    pedestalGroup.add(goldRing);
    scene.add(pedestalGroup);

    // 5. FULL-BODY 3D RULER CHARACTER
    const rulerGroup = new THREE.Group();
    rulerGroup.position.y = 0.5;

    if (rulerType === 'KING') {
      // FULL-BODY KING MODEL (Indian Sovereign Silhouette)
      // Lower Garment (Choga & Dhoti Gown)
      const dhotiGeo = new THREE.CylinderGeometry(0.8, 1.05, 2.0, 16);
      const dhotiMat = new THREE.MeshStandardMaterial({ color: '#854d0e', roughness: 0.5 });
      const dhoti = new THREE.Mesh(dhotiGeo, dhotiMat);
      dhoti.position.y = 1.0;
      dhoti.castShadow = true;
      rulerGroup.add(dhoti);

      // Gold Embroidered Belt / Sash
      const sashGeo = new THREE.CylinderGeometry(0.85, 0.88, 0.2, 16);
      const sashMat = new THREE.MeshStandardMaterial({ color: '#d4af37', metalness: 0.8, roughness: 0.2 });
      const sash = new THREE.Mesh(sashGeo, sashMat);
      sash.position.y = 2.0;
      rulerGroup.add(sash);

      // Upper Armor Chest (Royal Gold Sherwani)
      const chestGeo = new THREE.BoxGeometry(1.45, 1.3, 0.9);
      const chestMat = new THREE.MeshStandardMaterial({ color: '#d4af37', metalness: 0.75, roughness: 0.25 });
      const chest = new THREE.Mesh(chestGeo, chestMat);
      chest.position.y = 2.65;
      chest.castShadow = true;
      rulerGroup.add(chest);

      // Shoulder Epaulette Guards
      for (let dx of [-0.85, 0.85]) {
        const epauletteGeo = new THREE.SphereGeometry(0.4, 12, 12);
        const epaulette = new THREE.Mesh(epauletteGeo, chestMat);
        epaulette.position.set(dx, 3.2, 0);
        rulerGroup.add(epaulette);
      }

      // Head
      const headGeo = new THREE.SphereGeometry(0.42, 16, 16);
      const headMat = new THREE.MeshStandardMaterial({ color: '#d97706', roughness: 0.8 });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.y = 3.7;
      head.castShadow = true;
      rulerGroup.add(head);

      // Imperial Mukut / Royal Turban with Gold Crest Plume
      const mukutGeo = new THREE.CylinderGeometry(0.55, 0.45, 0.6, 16);
      const mukutMat = new THREE.MeshStandardMaterial({ color: '#b91c1c', roughness: 0.4 });
      const mukut = new THREE.Mesh(mukutGeo, mukutMat);
      mukut.position.y = 4.05;
      rulerGroup.add(mukut);

      const plumeGeo = new THREE.ConeGeometry(0.18, 0.8, 8);
      const plumeMat = new THREE.MeshStandardMaterial({ color: '#facc15', metalness: 0.9 });
      const plume = new THREE.Mesh(plumeGeo, plumeMat);
      plume.position.set(0, 4.45, 0.35);
      rulerGroup.add(plume);

      // Ceremonial Gold Talwar Sword
      const swordBladeGeo = new THREE.BoxGeometry(0.09, 2.0, 0.04);
      const swordBladeMat = new THREE.MeshStandardMaterial({ color: '#f8fafc', metalness: 0.95, roughness: 0.1 });
      const swordBlade = new THREE.Mesh(swordBladeGeo, swordBladeMat);
      swordBlade.position.set(0.95, 2.0, 0.25);
      swordBlade.rotation.z = -Math.PI / 14;
      rulerGroup.add(swordBlade);

    } else {
      // FULL-BODY QUEEN MODEL (Indian Sovereign Silhouette)
      // Flared Royal Sari Gown
      const gownGeo = new THREE.ConeGeometry(1.25, 2.2, 20);
      const gownMat = new THREE.MeshStandardMaterial({ color: '#991b1b', roughness: 0.4 });
      const gown = new THREE.Mesh(gownGeo, gownMat);
      gown.position.y = 1.1;
      gown.castShadow = true;
      rulerGroup.add(gown);

      // Gold Embroidered Pallu Draped Sash
      const palluGeo = new THREE.CylinderGeometry(0.65, 0.9, 1.4, 16, 1, true);
      const palluMat = new THREE.MeshStandardMaterial({ color: '#fbbf24', metalness: 0.8, roughness: 0.2, side: THREE.DoubleSide });
      const pallu = new THREE.Mesh(palluGeo, palluMat);
      pallu.position.set(0.1, 1.8, 0);
      pallu.rotation.z = -Math.PI / 12;
      rulerGroup.add(pallu);

      // Upper Bodice
      const bodiceGeo = new THREE.CylinderGeometry(0.5, 0.6, 1.2, 16);
      const bodiceMat = new THREE.MeshStandardMaterial({ color: '#d4af37', metalness: 0.75, roughness: 0.25 });
      const bodice = new THREE.Mesh(bodiceGeo, bodiceMat);
      bodice.position.y = 2.5;
      bodice.castShadow = true;
      rulerGroup.add(bodice);

      // Head
      const headGeo = new THREE.SphereGeometry(0.4, 16, 16);
      const headMat = new THREE.MeshStandardMaterial({ color: '#d97706', roughness: 0.8 });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.y = 3.55;
      head.castShadow = true;
      rulerGroup.add(head);

      // High Royal Tiara Crown
      const tiaraGeo = new THREE.CylinderGeometry(0.46, 0.42, 0.45, 12);
      const tiaraMat = new THREE.MeshStandardMaterial({ color: '#facc15', metalness: 0.95, roughness: 0.1 });
      const tiara = new THREE.Mesh(tiaraGeo, tiaraMat);
      tiara.position.y = 3.95;
      rulerGroup.add(tiara);

      // Gold Necklaces
      const necklaceGeo = new THREE.TorusGeometry(0.5, 0.05, 8, 16);
      const necklaceMat = new THREE.MeshStandardMaterial({ color: '#fbbf24', metalness: 0.9 });
      const necklace = new THREE.Mesh(necklaceGeo, necklaceMat);
      necklace.rotation.x = Math.PI / 2;
      necklace.position.y = 3.0;
      rulerGroup.add(necklace);

      // Royal Golden Lotus Scepter
      const scepterStaffGeo = new THREE.CylinderGeometry(0.05, 0.05, 2.6, 8);
      const scepterMat = new THREE.MeshStandardMaterial({ color: '#d4af37', metalness: 0.8 });
      const scepterStaff = new THREE.Mesh(scepterStaffGeo, scepterMat);
      scepterStaff.position.set(-0.85, 2.2, 0.3);
      rulerGroup.add(scepterStaff);

      const lotusGeo = new THREE.SphereGeometry(0.22, 10, 10);
      const lotusMat = new THREE.MeshStandardMaterial({ color: '#f43f5e', metalness: 0.5 });
      const lotus = new THREE.Mesh(lotusGeo, lotusMat);
      lotus.position.set(-0.85, 3.5, 0.3);
      rulerGroup.add(lotus);
    }

    scene.add(rulerGroup);

    // 6. ANIMATION & RENDER LOOP
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Rotation speed up on hover/select
      const rotSpeed = hoverRef.current ? 0.025 : selectRef.current ? 0.02 : 0.008;
      rulerGroup.rotation.y += rotSpeed;

      // Subtle breathing motion (sinusoidal Y translation and scaling)
      rulerGroup.position.y = 0.5 + Math.sin(elapsedTime * 2.5) * 0.04;
      const scaleVal = 1 + Math.sin(elapsedTime * 2.0) * 0.015;
      rulerGroup.scale.set(scaleVal, scaleVal, scaleVal);

      // Spotlight intensity lerp on selection
      spotLight.intensity = THREE.MathUtils.lerp(spotLight.intensity, selectRef.current ? 4.5 : hoverRef.current ? 3.0 : 1.5, 0.1);
      goldRing.rotation.z = elapsedTime * 0.5;

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
  }, [rulerType]);

  return (
    <div ref={mountRef} className="w-full h-56 md:h-64 pointer-events-none relative" />
  );
};
