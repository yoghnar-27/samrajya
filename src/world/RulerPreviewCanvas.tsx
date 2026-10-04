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

    const camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 2.5, 7.5);
    camera.lookAt(0, 2.2, 0);

    // 2. RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // 3. LIGHTING
    const ambientLight = new THREE.AmbientLight('#fffaed', 0.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight('#fbbf24', 2.2);
    sunLight.position.set(5, 8, 6);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight('#38bdf8', 1.0);
    rimLight.position.set(-5, 4, -4);
    scene.add(rimLight);

    // 4. PEDESTAL BASE
    const pedestalGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.4, 16);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: '#443728',
      roughness: 0.6,
      metalness: 0.2
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = 0.2;
    pedestal.receiveShadow = true;
    scene.add(pedestal);

    const goldTrimGeo = new THREE.TorusGeometry(1.65, 0.05, 8, 24);
    const goldTrimMat = new THREE.MeshStandardMaterial({ color: '#d4af37', metalness: 0.8, roughness: 0.2 });
    const goldTrim = new THREE.Mesh(goldTrimGeo, goldTrimMat);
    goldTrim.rotation.x = Math.PI / 2;
    goldTrim.position.y = 0.4;
    scene.add(goldTrim);

    // 5. RULER 3D MODEL GROUP
    const rulerGroup = new THREE.Group();
    rulerGroup.position.y = 0.4;

    if (rulerType === 'KING') {
      // KING MODEL
      // Lower Garment (Choga / Dhoti)
      const dhotiGeo = new THREE.CylinderGeometry(0.7, 0.9, 1.8, 12);
      const dhotiMat = new THREE.MeshStandardMaterial({ color: '#854d0e', roughness: 0.6 });
      const dhoti = new THREE.Mesh(dhotiGeo, dhotiMat);
      dhoti.position.y = 0.9;
      dhoti.castShadow = true;
      rulerGroup.add(dhoti);

      // Upper Armor (Gold Sherwani)
      const chestGeo = new THREE.BoxGeometry(1.3, 1.2, 0.8);
      const chestMat = new THREE.MeshStandardMaterial({ color: '#d4af37', metalness: 0.7, roughness: 0.3 });
      const chest = new THREE.Mesh(chestGeo, chestMat);
      chest.position.y = 2.4;
      chest.castShadow = true;
      rulerGroup.add(chest);

      // Shoulder Armor Guards
      for (let dx of [-0.75, 0.75]) {
        const guardGeo = new THREE.SphereGeometry(0.35, 8, 8);
        const guard = new THREE.Mesh(guardGeo, chestMat);
        guard.position.set(dx, 2.9, 0);
        rulerGroup.add(guard);
      }

      // Head
      const headGeo = new THREE.SphereGeometry(0.4, 12, 12);
      const headMat = new THREE.MeshStandardMaterial({ color: '#d97706', roughness: 0.8 });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.y = 3.4;
      head.castShadow = true;
      rulerGroup.add(head);

      // Royal Turban (Mukut / Paghdi)
      const turbanGeo = new THREE.CylinderGeometry(0.5, 0.42, 0.5, 12);
      const turbanMat = new THREE.MeshStandardMaterial({ color: '#b91c1c', roughness: 0.5 });
      const turban = new THREE.Mesh(turbanGeo, turbanMat);
      turban.position.y = 3.7;
      rulerGroup.add(turban);

      // Gold Crest Pin
      const pinGeo = new THREE.ConeGeometry(0.15, 0.6, 6);
      const pinMat = new THREE.MeshStandardMaterial({ color: '#facc15', metalness: 0.9 });
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.set(0, 4.0, 0.3);
      rulerGroup.add(pin);

      // Sword (Talwar)
      const bladeGeo = new THREE.BoxGeometry(0.08, 1.8, 0.04);
      const bladeMat = new THREE.MeshStandardMaterial({ color: '#e2e8f0', metalness: 0.9, roughness: 0.1 });
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.position.set(0.85, 1.8, 0.2);
      blade.rotation.z = -Math.PI / 16;
      rulerGroup.add(blade);
    } else {
      // QUEEN MODEL
      // Flared Royal Sari Gown
      const gownGeo = new THREE.ConeGeometry(1.1, 2.0, 16);
      const gownMat = new THREE.MeshStandardMaterial({ color: '#991b1b', roughness: 0.5 });
      const gown = new THREE.Mesh(gownGeo, gownMat);
      gown.position.y = 1.0;
      gown.castShadow = true;
      rulerGroup.add(gown);

      // Upper Bodice with Gold Trim
      const bodiceGeo = new THREE.CylinderGeometry(0.45, 0.55, 1.1, 12);
      const bodiceMat = new THREE.MeshStandardMaterial({ color: '#d4af37', metalness: 0.75, roughness: 0.25 });
      const bodice = new THREE.Mesh(bodiceGeo, bodiceMat);
      bodice.position.y = 2.3;
      bodice.castShadow = true;
      rulerGroup.add(bodice);

      // Head
      const headGeo = new THREE.SphereGeometry(0.38, 12, 12);
      const headMat = new THREE.MeshStandardMaterial({ color: '#d97706', roughness: 0.8 });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.y = 3.25;
      head.castShadow = true;
      rulerGroup.add(head);

      // Queen's Royal Gold Tiara Crown
      const crownGeo = new THREE.CylinderGeometry(0.42, 0.38, 0.4, 8);
      const crownMat = new THREE.MeshStandardMaterial({ color: '#facc15', metalness: 0.9, roughness: 0.1 });
      const crown = new THREE.Mesh(crownGeo, crownMat);
      crown.position.y = 3.6;
      rulerGroup.add(crown);

      // Royal Jewelry Necklaces
      const necklaceGeo = new THREE.TorusGeometry(0.45, 0.04, 6, 12);
      const necklaceMat = new THREE.MeshStandardMaterial({ color: '#fbbf24', metalness: 0.9 });
      const necklace = new THREE.Mesh(necklaceGeo, necklaceMat);
      necklace.rotation.x = Math.PI / 2;
      necklace.position.y = 2.75;
      rulerGroup.add(necklace);

      // Royal Golden Lotus Scepter
      const lotusGeo = new THREE.SphereGeometry(0.2, 8, 8);
      const lotusMat = new THREE.MeshStandardMaterial({ color: '#f43f5e', metalness: 0.5 });
      const lotus = new THREE.Mesh(lotusGeo, lotusMat);
      lotus.position.set(-0.75, 2.5, 0.3);
      rulerGroup.add(lotus);
    }

    scene.add(rulerGroup);

    // 6. ANIMATION LOOP (Subtle Breathing & Rotation)
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Rotation speed increases on hover/selection
      const rotSpeed = hoverRef.current ? 0.025 : selectRef.current ? 0.02 : 0.008;
      rulerGroup.rotation.y += rotSpeed;

      // Subtle breathing motion (sinusoidal y movement and slight chest scaling)
      rulerGroup.position.y = 0.4 + Math.sin(elapsedTime * 2.5) * 0.04;
      
      const scaleVal = 1 + Math.sin(elapsedTime * 2) * 0.015;
      rulerGroup.scale.set(scaleVal, scaleVal, scaleVal);

      // Pedestal glow ring rotation
      goldTrim.rotation.z = elapsedTime * 0.5;

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
    <div ref={mountRef} className="w-full h-48 md:h-56 pointer-events-none relative" />
  );
};
