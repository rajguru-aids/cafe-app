'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { DrinkType, VesselFinish } from '@/lib/types';
import { DRINK_CONFIGS, VESSEL_FINISHES } from '@/lib/cafeData';
import { cafeAudio } from '@/lib/audio';
import { RotateCw, Coffee, Eye, Sparkles, RefreshCw, Flame } from 'lucide-react';

interface ThreeCoffeeViewerProps {
  currentDrink: DrinkType;
  currentVessel: VesselFinish;
  onDrinkChange: (drink: DrinkType) => void;
  onVesselChange: (vessel: VesselFinish) => void;
  onOrderClick: () => void;
  price: number;
}

export default function ThreeCoffeeViewer({
  currentDrink,
  currentVessel,
  onDrinkChange,
  onVesselChange,
  onOrderClick,
  price
}: ThreeCoffeeViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [cameraView, setCameraView] = useState<'hero' | 'top' | 'side'>('hero');
  const [isBrewing, setIsBrewing] = useState(false);
  const [sipCount, setSipCount] = useState(0);
  const [isSteamActive, setIsSteamActive] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // References to 3D scene elements
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cupMeshRef = useRef<THREE.Mesh | null>(null);
  const saucerMeshRef = useRef<THREE.Mesh | null>(null);
  const handleMeshRef = useRef<THREE.Mesh | null>(null);
  const liquidMeshRef = useRef<THREE.Mesh | null>(null);
  const steamParticlesRef = useRef<THREE.Points | null>(null);
  const beansGroupRef = useRef<THREE.Group | null>(null);
  const cupGroupRef = useRef<THREE.Group | null>(null);

  // Animation values
  const targetLiquidY = useRef(0.85);
  const currentLiquidY = useRef(0.85);
  const targetRotationY = useRef(0.2);
  const currentRotationY = useRef(0.2);
  const targetRotationX = useRef(0.35);
  const currentRotationX = useRef(0.35);
  const isDragging = useRef(false);
  const prevMousePos = useRef({ x: 0, y: 0 });

  // Generate procedural canvas texture for latte art / liquid surface
  const createLiquidTexture = useCallback((drink: DrinkType) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    const cfg = DRINK_CONFIGS[drink];

    if (drink === 'matcha_latte') {
      // Emerald frothy ceremonial matcha
      const grad = ctx.createRadialGradient(256, 256, 20, 256, 256, 256);
      grad.addColorStop(0, '#5A9451');
      grad.addColorStop(0.7, '#3E7036');
      grad.addColorStop(1, '#2E5528');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      // Microbubbles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      for (let i = 0; i < 180; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const r = Math.random() * 3 + 1;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (drink === 'flat_white') {
      // Golden espresso crema background
      const grad = ctx.createRadialGradient(256, 256, 40, 256, 256, 256);
      grad.addColorStop(0, '#B27341');
      grad.addColorStop(0.65, '#874D26');
      grad.addColorStop(1, '#4E2911');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      // Steamed microfoam Rosetta pattern
      ctx.save();
      ctx.translate(256, 256);

      // White microfoam heart/rosetta leaves
      ctx.fillStyle = '#FAF4EB';
      ctx.shadowColor = 'rgba(78, 41, 17, 0.4)';
      ctx.shadowBlur = 8;

      // Central stem line
      ctx.beginPath();
      ctx.moveTo(0, 160);
      ctx.lineTo(0, -180);
      ctx.lineWidth = 14;
      ctx.strokeStyle = '#FAF4EB';
      ctx.lineCap = 'round';
      ctx.stroke();

      // Rosetta leaf pairs
      for (let i = 0; i < 7; i++) {
        const y = 120 - i * 40;
        const width = 80 - i * 8;
        const leafH = 26 - i * 2;

        // Left leaf
        ctx.beginPath();
        ctx.ellipse(-width / 2, y, width / 2, leafH / 2, -0.25, 0, Math.PI * 2);
        ctx.fill();

        // Right leaf
        ctx.beginPath();
        ctx.ellipse(width / 2, y, width / 2, leafH / 2, 0.25, 0, Math.PI * 2);
        ctx.fill();
      }

      // Top heart
      ctx.beginPath();
      ctx.arc(-16, -170, 20, 0, Math.PI * 2);
      ctx.arc(16, -170, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (drink === 'cortado') {
      // Spanish cortado: deep espresso base with central heart pour
      const grad = ctx.createRadialGradient(256, 256, 40, 256, 256, 256);
      grad.addColorStop(0, '#C2844F');
      grad.addColorStop(0.7, '#7B451E');
      grad.addColorStop(1, '#391B08');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      // Steamed milk heart
      ctx.save();
      ctx.translate(256, 250);
      ctx.fillStyle = '#F5ECE1';
      ctx.shadowColor = 'rgba(57, 27, 8, 0.5)';
      ctx.shadowBlur = 10;

      ctx.beginPath();
      ctx.moveTo(0, 60);
      ctx.bezierCurveTo(-90, 0, -90, -90, 0, -50);
      ctx.bezierCurveTo(90, -90, 90, 0, 0, 60);
      ctx.fill();
      ctx.restore();
    } else if (drink === 'cold_brew') {
      // Kyoto drip dark glass with clear ice reflections
      const grad = ctx.createRadialGradient(256, 256, 20, 256, 256, 256);
      grad.addColorStop(0, '#26160B');
      grad.addColorStop(0.8, '#130B05');
      grad.addColorStop(1, '#080402');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      // Square ice cube outline & translucent face
      ctx.save();
      ctx.translate(256, 256);
      ctx.rotate(0.35);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 4;
      ctx.fillRect(-80, -80, 160, 160);
      ctx.strokeRect(-80, -80, 160, 160);
      ctx.restore();
    } else {
      // V60 Pour Over: translucent amber mahogany with light refraction rings
      const grad = ctx.createRadialGradient(256, 256, 10, 256, 256, 256);
      grad.addColorStop(0, '#5A2E12');
      grad.addColorStop(0.5, '#3D1C09');
      grad.addColorStop(0.9, '#241004');
      grad.addColorStop(1, '#150802');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      // Subtle water wave ripples
      ctx.strokeStyle = 'rgba(255, 200, 140, 0.15)';
      ctx.lineWidth = 3;
      for (let r = 50; r <= 220; r += 45) {
        ctx.beginPath();
        ctx.arc(256, 256, r, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  // Update vessel finish materials
  useEffect(() => {
    const vessel = VESSEL_FINISHES.find(v => v.id === currentVessel) || VESSEL_FINISHES[0];
    const color = new THREE.Color(vessel.hex);

    if (cupMeshRef.current) {
      const mat = cupMeshRef.current.material as THREE.MeshStandardMaterial;
      mat.color = color;
      mat.roughness = vessel.roughness;
      mat.metalness = vessel.metalness;
      mat.needsUpdate = true;
    }
    if (saucerMeshRef.current) {
      const mat = saucerMeshRef.current.material as THREE.MeshStandardMaterial;
      mat.color = color;
      mat.roughness = vessel.roughness;
      mat.metalness = vessel.metalness;
      mat.needsUpdate = true;
    }
    if (handleMeshRef.current) {
      const mat = handleMeshRef.current.material as THREE.MeshStandardMaterial;
      mat.color = color;
      mat.roughness = vessel.roughness;
      mat.metalness = vessel.metalness;
      mat.needsUpdate = true;
    }
  }, [currentVessel]);

  // Update liquid surface when drink changes
  useEffect(() => {
    if (liquidMeshRef.current) {
      const texture = createLiquidTexture(currentDrink);
      const mat = liquidMeshRef.current.material as THREE.MeshStandardMaterial;
      mat.map = texture;
      mat.roughness = currentDrink === 'cold_brew' || currentDrink === 'pourover' ? 0.12 : 0.45;
      mat.metalness = 0.05;
      mat.needsUpdate = true;
    }
    // Update steam visibility on particle system based on drink default
    const cfg = DRINK_CONFIGS[currentDrink];
    if (steamParticlesRef.current) {
      steamParticlesRef.current.visible = isSteamActive && cfg.steam;
    }
  }, [currentDrink, createLiquidTexture, isSteamActive]);

  // Handle camera view presets
  useEffect(() => {
    if (!cameraRef.current) return;
    const camera = cameraRef.current;

    if (cameraView === 'top') {
      camera.position.set(0, 3.8, 0.4);
      camera.lookAt(0, 0.5, 0);
      targetRotationX.current = 1.35;
    } else if (cameraView === 'side') {
      camera.position.set(2.8, 0.9, 2.5);
      camera.lookAt(0, 0.6, 0);
      targetRotationX.current = 0.05;
    } else {
      camera.position.set(0, 2.1, 3.5);
      camera.lookAt(0, 0.5, 0);
      targetRotationX.current = 0.35;
    }
  }, [cameraView]);

  // Three.js Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 50);
    camera.position.set(0, 2.1, 3.5);
    camera.lookAt(0, 0.5, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Group for cup assembly so we can rotate smoothly
    const cupGroup = new THREE.Group();
    cupGroupRef.current = cupGroup;
    scene.add(cupGroup);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xfff6ea, 1.2);
    scene.add(ambientLight);

    // Key Light (warm directional morning sun)
    const keyLight = new THREE.DirectionalLight(0xffe8cf, 2.6);
    keyLight.position.set(3, 5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 15;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    // Fill Light (soft cool morning shadow fill)
    const fillLight = new THREE.DirectionalLight(0xdbe6f0, 1.1);
    fillLight.position.set(-4, 3, -2);
    scene.add(fillLight);

    // Rim Light (sharp highlight separating cup silhouette)
    const rimLight = new THREE.DirectionalLight(0xffffff, 2.0);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    // Initial Vessel Material
    const initialVessel = VESSEL_FINISHES.find(v => v.id === currentVessel) || VESSEL_FINISHES[0];
    const ceramicMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(initialVessel.hex),
      roughness: initialVessel.roughness,
      metalness: initialVessel.metalness,
    });

    // 1. Ceramic Cup Body
    // Using LatheGeometry for authentic artisan hand-thrown pottery curve
    const cupPoints: THREE.Vector2[] = [];
    cupPoints.push(new THREE.Vector2(0.0, 0.0));
    cupPoints.push(new THREE.Vector2(0.68, 0.0));
    cupPoints.push(new THREE.Vector2(0.72, 0.05));
    cupPoints.push(new THREE.Vector2(0.85, 0.35));
    cupPoints.push(new THREE.Vector2(0.96, 0.72));
    cupPoints.push(new THREE.Vector2(1.02, 1.05));
    cupPoints.push(new THREE.Vector2(0.96, 1.05));
    cupPoints.push(new THREE.Vector2(0.90, 0.72));
    cupPoints.push(new THREE.Vector2(0.78, 0.35));
    cupPoints.push(new THREE.Vector2(0.66, 0.12));
    cupPoints.push(new THREE.Vector2(0.0, 0.12));

    const cupGeom = new THREE.LatheGeometry(cupPoints, 48);
    const cupMesh = new THREE.Mesh(cupGeom, ceramicMat);
    cupMesh.castShadow = true;
    cupMesh.receiveShadow = true;
    cupMeshRef.current = cupMesh;
    cupGroup.add(cupMesh);

    // 2. Ceramic Cup Handle
    const handleGeom = new THREE.TorusGeometry(0.36, 0.085, 20, 36, Math.PI * 1.05);
    const handleMesh = new THREE.Mesh(handleGeom, ceramicMat);
    handleMesh.position.set(1.04, 0.62, 0);
    handleMesh.rotation.z = -Math.PI / 1.95;
    handleMesh.castShadow = true;
    handleMeshRef.current = handleMesh;
    cupGroup.add(handleMesh);

    // 3. Ceramic Saucer Plate
    const saucerPoints: THREE.Vector2[] = [];
    saucerPoints.push(new THREE.Vector2(0.0, 0.0));
    saucerPoints.push(new THREE.Vector2(0.95, 0.0));
    saucerPoints.push(new THREE.Vector2(1.25, 0.04));
    saucerPoints.push(new THREE.Vector2(1.68, 0.18));
    saucerPoints.push(new THREE.Vector2(1.72, 0.16));
    saucerPoints.push(new THREE.Vector2(1.30, 0.02));
    saucerPoints.push(new THREE.Vector2(0.0, 0.01));

    const saucerGeom = new THREE.LatheGeometry(saucerPoints, 54);
    const saucerMesh = new THREE.Mesh(saucerGeom, ceramicMat);
    saucerMesh.position.set(0, -0.01, 0);
    saucerMesh.castShadow = true;
    saucerMesh.receiveShadow = true;
    saucerMeshRef.current = saucerMesh;
    cupGroup.add(saucerMesh);

    // 4. Artisanal Brass Spoon
    const spoonGroup = new THREE.Group();
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xC8A265,
      roughness: 0.28,
      metalness: 0.85
    });
    const handleSpoonGeom = new THREE.CylinderGeometry(0.025, 0.02, 1.8, 16);
    const spoonStick = new THREE.Mesh(handleSpoonGeom, brassMat);
    spoonStick.rotation.z = Math.PI / 2;
    spoonStick.position.set(0.65, 0.05, 0);
    spoonStick.castShadow = true;
    spoonGroup.add(spoonStick);

    const spoonBowlGeom = new THREE.SphereGeometry(0.14, 16, 16);
    spoonBowlGeom.scale(1.4, 0.4, 0.9);
    const spoonBowl = new THREE.Mesh(spoonBowlGeom, brassMat);
    spoonBowl.position.set(-0.25, 0.05, 0);
    spoonBowl.castShadow = true;
    spoonGroup.add(spoonBowl);

    spoonGroup.position.set(0.3, 0.05, 1.25);
    spoonGroup.rotation.y = -0.45;
    cupGroup.add(spoonGroup);

    // 5. Liquid Surface
    const liquidTexture = createLiquidTexture(currentDrink);
    const liquidGeom = new THREE.CylinderGeometry(0.92, 0.88, 0.04, 48);
    const liquidMat = new THREE.MeshStandardMaterial({
      map: liquidTexture,
      roughness: 0.45,
      metalness: 0.05,
    });
    const liquidMesh = new THREE.Mesh(liquidGeom, liquidMat);
    liquidMesh.position.set(0, targetLiquidY.current, 0);
    liquidMesh.receiveShadow = true;
    liquidMeshRef.current = liquidMesh;
    cupGroup.add(liquidMesh);

    // 6. Scattered Roasted Coffee Beans
    const beansGroup = new THREE.Group();
    beansGroupRef.current = beansGroup;
    const beanMat = new THREE.MeshStandardMaterial({
      color: 0x3A2113,
      roughness: 0.65,
      metalness: 0.1
    });

    const createBean = (x: number, y: number, z: number, rx: number, ry: number, rz: number) => {
      const beanGeom = new THREE.SphereGeometry(0.08, 12, 12);
      beanGeom.scale(1.6, 0.9, 1.1);
      const beanMesh = new THREE.Mesh(beanGeom, beanMat);
      beanMesh.position.set(x, y, z);
      beanMesh.rotation.set(rx, ry, rz);
      beanMesh.castShadow = true;
      return beanMesh;
    };

    // Beans resting on saucer plate rim
    beansGroup.add(createBean(-1.18, 0.08, 0.6, 0.2, 0.5, 0.1));
    beansGroup.add(createBean(-1.32, 0.11, 0.38, 0.4, 0.1, -0.2));
    beansGroup.add(createBean(1.15, 0.08, -0.65, -0.3, 1.2, 0.4));
    beansGroup.add(createBean(1.30, 0.10, -0.45, 0.1, 0.8, -0.3));
    beansGroup.add(createBean(-0.4, 0.03, 1.45, 0.5, 0.2, 0.3));
    beansGroup.add(createBean(-0.6, 0.03, 1.55, -0.2, 0.7, 0.1));
    cupGroup.add(beansGroup);

    // 7. Counter Base / Table Pedestal (Cedar wood grain tone)
    const tableGeom = new THREE.CylinderGeometry(2.8, 2.8, 0.2, 64);
    const tableMat = new THREE.MeshStandardMaterial({
      color: 0x1A1816,
      roughness: 0.92,
      metalness: 0.05
    });
    const tableMesh = new THREE.Mesh(tableGeom, tableMat);
    tableMesh.position.set(0, -0.11, 0);
    tableMesh.receiveShadow = true;
    scene.add(tableMesh);

    // 8. Dynamic Steam Particle System
    const particleCount = 75;
    const steamGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const opacities = new Float32Array(particleCount);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 0.45;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = 0.9 + Math.random() * 1.4;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      opacities[i] = Math.random() * 0.3 + 0.1;
      scales[i] = Math.random() * 0.06 + 0.03;
    }

    steamGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Canvas particle texture
    const steamCanvas = document.createElement('canvas');
    steamCanvas.width = 64;
    steamCanvas.height = 64;
    const sctx = steamCanvas.getContext('2d');
    if (sctx) {
      const grad = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(245, 235, 220, 0.85)');
      grad.addColorStop(0.5, 'rgba(230, 215, 200, 0.35)');
      grad.addColorStop(1, 'rgba(230, 215, 200, 0)');
      sctx.fillStyle = grad;
      sctx.fillRect(0, 0, 64, 64);
    }
    const steamTexture = new THREE.CanvasTexture(steamCanvas);

    const steamMat = new THREE.PointsMaterial({
      size: 0.28,
      map: steamTexture,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
      blending: THREE.NormalBlending
    });

    const steamParticles = new THREE.Points(steamGeom, steamMat);
    steamParticlesRef.current = steamParticles;
    cupGroup.add(steamParticles);

    // Mouse / Touch Drag Rotation Handlers
    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      prevMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - prevMousePos.current.x;
      const deltaY = e.clientY - prevMousePos.current.y;
      prevMousePos.current = { x: e.clientX, y: e.clientY };

      targetRotationY.current += deltaX * 0.008;
      targetRotationX.current = Math.max(0.05, Math.min(1.4, targetRotationX.current + deltaY * 0.005));
    };

    const onMouseUp = () => {
      isDragging.current = false;
    };

    // Touch support for mobile
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging.current = true;
        prevMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMousePos.current.x;
      const deltaY = e.touches[0].clientY - prevMousePos.current.y;
      prevMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

      targetRotationY.current += deltaX * 0.01;
      targetRotationX.current = Math.max(0.05, Math.min(1.4, targetRotationX.current + deltaY * 0.006));
    };

    const onTouchEnd = () => {
      isDragging.current = false;
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    domElem.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth rotation damping
      if (!isDragging.current) {
        targetRotationY.current += 0.0025; // Gentle idle turntable rotation
      }
      currentRotationY.current += (targetRotationY.current - currentRotationY.current) * 0.08;
      currentRotationX.current += (targetRotationX.current - currentRotationX.current) * 0.08;

      if (cupGroupRef.current) {
        cupGroupRef.current.rotation.y = currentRotationY.current;
      }

      // Smooth liquid level transition
      currentLiquidY.current += (targetLiquidY.current - currentLiquidY.current) * 0.1;
      if (liquidMeshRef.current) {
        liquidMeshRef.current.position.y = currentLiquidY.current;
      }

      // Animate Steam Particles
      if (steamParticlesRef.current && steamParticlesRef.current.visible) {
        const geom = steamParticlesRef.current.geometry;
        const posAttr = geom.getAttribute('position') as THREE.BufferAttribute;
        const posArray = posAttr.array as Float32Array;

        for (let i = 0; i < particleCount; i++) {
          const idx = i * 3;
          // Float upwards
          posArray[idx + 1] += 0.006 + (i % 3) * 0.002;
          // Gentle sinusoidal drift
          posArray[idx] += Math.sin(elapsed * 2 + i) * 0.002;
          posArray[idx + 2] += Math.cos(elapsed * 1.5 + i) * 0.002;

          // Reset when reached peak height
          if (posArray[idx + 1] > 2.2) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 0.4;
            posArray[idx] = Math.cos(angle) * radius;
            posArray[idx + 1] = currentLiquidY.current + 0.05;
            posArray[idx + 2] = Math.sin(angle) * radius;
          }
        }
        posAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domElem.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElem.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [createLiquidTexture, currentDrink, currentVessel]);

  // Action: Take a sip
  const handleTakeSip = () => {
    cafeAudio.playCeramicClink();
    const newSip = (sipCount + 1) % 4;
    setSipCount(newSip);

    if (newSip === 0) {
      targetLiquidY.current = 0.85; // Refilled
    } else {
      targetLiquidY.current = 0.85 - newSip * 0.18;
    }

    // Bean bounce effect
    if (beansGroupRef.current) {
      beansGroupRef.current.position.y = 0.04;
      setTimeout(() => {
        if (beansGroupRef.current) beansGroupRef.current.position.y = 0;
      }, 180);
    }
  };

  // Action: Fresh Brew Pour
  const handleBrewFresh = () => {
    setIsBrewing(true);
    cafeAudio.playBrewPourSound();
    targetLiquidY.current = 0.2; // Drop to bottom

    setTimeout(() => {
      targetLiquidY.current = 0.85; // Fill up smoothly
      setSipCount(0);
      setIsSteamActive(true);
    }, 600);

    setTimeout(() => {
      setIsBrewing(false);
      cafeAudio.playCeramicClink();
    }, 1400);
  };

  const drinkConfig = DRINK_CONFIGS[currentDrink];

  return (
    <div
      className="relative w-full h-[520px] md:h-[620px] bg-[#121110] border border-[#2A2420] rounded-2xl overflow-hidden shadow-2xl transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Subtle Background Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(circle at 50% 55%, rgba(198, 138, 76, 0.15) 0%, rgba(18, 17, 16, 0) 70%)'
        }}
      />

      {/* Top Left: Drink Details Overlay */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10 pointer-events-none">
        <div className="flex items-center gap-2 text-xs tracking-wider uppercase text-[#C68A4C] font-mono">
          <span>Craft Bar 3D</span>
          <span aria-hidden="true">·</span>
          <span>{drinkConfig.japanese}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-semibold tracking-wide text-[#EDE8E1] mt-1">
          {drinkConfig.name}
        </h2>
        <p className="text-xs md:text-sm text-[#9E9388] mt-1 max-w-xs leading-relaxed">
          {drinkConfig.subheading}
        </p>
      </div>

      {/* Top Right: Preset Camera Angle Buttons (Clean, single-line, fully functional) */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10 flex items-center gap-1.5 p-1 bg-[#1C1917]/90 backdrop-blur-md border border-[#332B25] rounded-lg">
        <button
          onClick={() => setCameraView('hero')}
          className={`px-2.5 py-1 text-xs font-medium rounded transition-all whitespace-nowrap ${
            cameraView === 'hero' ? 'bg-[#C68A4C] text-[#121110] font-semibold' : 'text-[#BBB1A5] hover:text-[#EDE8E1]'
          }`}
          title="Hero Perspective View"
        >
          Hero 45°
        </button>
        <button
          onClick={() => setCameraView('top')}
          className={`px-2.5 py-1 text-xs font-medium rounded transition-all whitespace-nowrap ${
            cameraView === 'top' ? 'bg-[#C68A4C] text-[#121110] font-semibold' : 'text-[#BBB1A5] hover:text-[#EDE8E1]'
          }`}
          title="Top Down Latte Art View"
        >
          Top Art
        </button>
        <button
          onClick={() => setCameraView('side')}
          className={`px-2.5 py-1 text-xs font-medium rounded transition-all whitespace-nowrap ${
            cameraView === 'side' ? 'bg-[#C68A4C] text-[#121110] font-semibold' : 'text-[#BBB1A5] hover:text-[#EDE8E1]'
          }`}
          title="Profile Silhouette View"
        >
          Profile
        </button>
      </div>

      {/* Left Mid: 3D Drink Switcher Tabs */}
      <div className="absolute left-4 top-28 md:top-32 z-10 hidden sm:flex flex-col gap-1.5 bg-[#1C1917]/80 backdrop-blur-md p-1.5 border border-[#332B25] rounded-xl">
        {(Object.keys(DRINK_CONFIGS) as DrinkType[]).map((key) => {
          const cfg = DRINK_CONFIGS[key];
          const isSelected = currentDrink === key;
          return (
            <button
              key={key}
              onClick={() => onDrinkChange(key)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs text-left rounded-lg transition-all ${
                isSelected
                  ? 'bg-[#2A2420] text-[#C68A4C] font-medium border border-[#C68A4C]/30 shadow-sm'
                  : 'text-[#9E9388] hover:text-[#EDE8E1] hover:bg-[#221D19]'
              }`}
            >
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/20"
                style={{ backgroundColor: cfg.liquidColor }}
              />
              <span className="whitespace-nowrap">{cfg.name}</span>
            </button>
          );
        })}
      </div>

      {/* Drag Hint on Bottom Center */}
      <div className="absolute bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 z-10 pointer-events-none text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1A1816]/75 backdrop-blur-md rounded-full border border-[#2E2721] text-[11px] text-[#A69B8F]">
          <RotateCw className="w-3 h-3 text-[#C68A4C] animate-spin" style={{ animationDuration: '6s' }} />
          <span>Click & drag to rotate 360°</span>
        </div>
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 z-10 flex flex-wrap items-center justify-between gap-3 p-3 bg-[#1A1816]/95 backdrop-blur-lg border border-[#382F28] rounded-xl shadow-xl">
        {/* Ceramic Vessel Finish Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#9E9388] hidden lg:inline font-mono">Ceramic Finish:</span>
          <div className="flex items-center gap-1.5">
            {VESSEL_FINISHES.map((v) => (
              <button
                key={v.id}
                onClick={() => onVesselChange(v.id as VesselFinish)}
                title={v.name}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md transition-all border ${
                  currentVessel === v.id
                    ? 'border-[#C68A4C] text-[#EDE8E1] bg-[#2B231D]'
                    : 'border-transparent text-[#9E9388] hover:text-[#EDE8E1] hover:bg-[#25201C]'
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full border border-black/40 shadow-xs"
                  style={{ backgroundColor: v.hex }}
                />
                <span className="hidden sm:inline whitespace-nowrap">{v.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tactile Actions: Sip, Brew Fresh, Steam, and Order */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={handleTakeSip}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#EDE8E1] bg-[#25201C] hover:bg-[#302924] border border-[#3D332B] rounded-lg transition-colors whitespace-nowrap"
            title="Take a sip and lower the coffee level"
          >
            <Coffee className="w-3.5 h-3.5 text-[#C68A4C]" />
            <span>{sipCount === 3 ? 'Refill' : 'Take a Sip'}</span>
          </button>

          <button
            onClick={handleBrewFresh}
            disabled={isBrewing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#EDE8E1] bg-[#25201C] hover:bg-[#302924] border border-[#3D332B] rounded-lg transition-colors whitespace-nowrap disabled:opacity-50"
            title="Fresh extraction animation"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#C68A4C] ${isBrewing ? 'animate-spin' : ''}`} />
            <span>{isBrewing ? 'Brewing...' : 'Brew Fresh'}</span>
          </button>

          <button
            onClick={() => {
              setIsSteamActive(!isSteamActive);
              if (steamParticlesRef.current) {
                steamParticlesRef.current.visible = !isSteamActive;
              }
            }}
            className={`p-1.5 text-xs border rounded-lg transition-colors ${
              isSteamActive
                ? 'bg-[#2B231D] border-[#C68A4C] text-[#C68A4C]'
                : 'bg-[#25201C] border-[#3D332B] text-[#9E9388]'
            }`}
            title="Toggle rising steam particles"
          >
            <Flame className="w-3.5 h-3.5" />
          </button>

          {/* Quick Add to Order CTA */}
          <button
            onClick={onOrderClick}
            className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-[#121110] bg-[#C68A4C] hover:bg-[#D69A5C] active:scale-98 rounded-lg shadow-md transition-all whitespace-nowrap"
          >
            <span>Order Cup</span>
            <span className="font-mono font-medium">${price.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
