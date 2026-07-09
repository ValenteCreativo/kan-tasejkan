'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Universo realista estilo James Webb.
 * Basado en portalscene.tsx — galaxias espirales, nebulosas, planetas con anillos,
 * cometas, polvo cósmico. Post-processing con bloom.
 * Movimiento ultra lento y elegante.
 */

export default function CosmicIntro() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const mount = mountRef.current;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000005, 0.00015);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.set(0, 60, 400);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    mount.appendChild(renderer.domElement);

    // ─── STARFIELD ───
    function createStarLayer(count: number, spread: number, size: number, color: number, opacity: number) {
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * spread;
        pos[i * 3 + 1] = (Math.random() - 0.5) * spread;
        pos[i * 3 + 2] = (Math.random() - 0.5) * spread;
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({ color, size, sizeAttenuation: true, transparent: true, opacity, blending: THREE.AdditiveBlending });
      return new THREE.Points(geo, mat);
    }

    const starsDeep = createStarLayer(15000, 5000, 0.5, 0xffffff, 0.7);
    const starsMid = createStarLayer(6000, 3500, 0.9, 0xddeeff, 0.85);
    const starsNear = createStarLayer(2000, 2000, 1.4, 0xfff8ee, 1.0);
    const starsBlue = createStarLayer(800, 4000, 1.8, 0x6699ff, 0.5);
    const starsOrange = createStarLayer(500, 4000, 1.5, 0xffaa44, 0.4);
    scene.add(starsDeep, starsMid, starsNear, starsBlue, starsOrange);

    // ─── NEBULAE ───
    function createNebula(colors: { stop: number; color: string }[], size: number, position: THREE.Vector3, opacity: number) {
      const canvas = document.createElement('canvas');
      canvas.width = 512; canvas.height = 512;
      const ctx = canvas.getContext('2d')!;
      const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
      colors.forEach(c => gradient.addColorStop(c.stop, c.color));
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);
      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({ map: texture, blending: THREE.AdditiveBlending, transparent: true, opacity });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(size, size, 1);
      sprite.position.copy(position);
      return sprite;
    }

    const nebulaGroup = new THREE.Group();
    nebulaGroup.add(createNebula([{ stop: 0, color: 'rgba(60,80,180,0.5)' }, { stop: 0.3, color: 'rgba(30,20,80,0.3)' }, { stop: 0.7, color: 'rgba(10,5,30,0.1)' }, { stop: 1, color: 'rgba(0,0,0,0)' }], 600, new THREE.Vector3(-400, 150, -1200), 0.18));
    nebulaGroup.add(createNebula([{ stop: 0, color: 'rgba(0,200,120,0.3)' }, { stop: 0.4, color: 'rgba(0,80,60,0.15)' }, { stop: 1, color: 'rgba(0,0,0,0)' }], 450, new THREE.Vector3(500, -100, -1000), 0.12));
    nebulaGroup.add(createNebula([{ stop: 0, color: 'rgba(200,50,120,0.3)' }, { stop: 0.5, color: 'rgba(80,10,40,0.12)' }, { stop: 1, color: 'rgba(0,0,0,0)' }], 500, new THREE.Vector3(0, 300, -1500), 0.1));
    nebulaGroup.add(createNebula([{ stop: 0, color: 'rgba(255,200,50,0.25)' }, { stop: 0.5, color: 'rgba(120,60,0,0.08)' }, { stop: 1, color: 'rgba(0,0,0,0)' }], 350, new THREE.Vector3(-300, -250, -800), 0.08));
    nebulaGroup.add(createNebula([{ stop: 0, color: 'rgba(0,220,255,0.35)' }, { stop: 0.6, color: 'rgba(0,60,100,0.1)' }, { stop: 1, color: 'rgba(0,0,0,0)' }], 250, new THREE.Vector3(350, 200, -600), 0.15));
    nebulaGroup.add(createNebula([{ stop: 0, color: 'rgba(180,30,30,0.2)' }, { stop: 0.5, color: 'rgba(60,5,5,0.08)' }, { stop: 1, color: 'rgba(0,0,0,0)' }], 700, new THREE.Vector3(200, -200, -2000), 0.06));
    scene.add(nebulaGroup);

    // ─── SPIRAL GALAXY ───
    function createGalaxy(count: number, radius: number, branches: number, spin: number, colorIn: THREE.Color, colorOut: THREE.Color, pos: THREE.Vector3, rotX: number, rotZ: number) {
      const geo = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const r = Math.random() * radius;
        const branchAngle = ((i % branches) / branches) * Math.PI * 2;
        const spinAngle = r * spin;
        const rx = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3 * r;
        const ry = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3 * r * 0.15;
        const rz = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3 * r;
        positions[i * 3] = Math.cos(branchAngle + spinAngle) * r + rx;
        positions[i * 3 + 1] = ry;
        positions[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * r + rz;
        const mixed = colorIn.clone().lerp(colorOut, r / radius);
        colors[i * 3] = mixed.r; colors[i * 3 + 1] = mixed.g; colors[i * 3 + 2] = mixed.b;
      }
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      const mat = new THREE.PointsMaterial({ size: 0.8, vertexColors: true, sizeAttenuation: true, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.8 });
      const galaxy = new THREE.Points(geo, mat);
      galaxy.position.copy(pos);
      galaxy.rotation.x = rotX; galaxy.rotation.z = rotZ;
      return galaxy;
    }

    const galaxyMain = createGalaxy(25000, 300, 5, 1.5, new THREE.Color(0xffffff), new THREE.Color(0x3366cc), new THREE.Vector3(-250, -30, -500), Math.PI * 0.25, 0);
    const galaxySecondary = createGalaxy(10000, 150, 3, 2.0, new THREE.Color(0xff88cc), new THREE.Color(0x5522aa), new THREE.Vector3(500, 200, -1500), Math.PI * 0.4, Math.PI * 0.15);
    scene.add(galaxyMain, galaxySecondary);

    // ─── PLANETS ───
    // Saturn-like
    const planet1Group = new THREE.Group();
    planet1Group.position.set(200, -60, -400);
    const p1 = new THREE.Mesh(new THREE.SphereGeometry(35, 64, 64), new THREE.MeshStandardMaterial({ color: 0xf4e1c1, emissive: 0x1a0e05, metalness: 0.2, roughness: 0.8 }));
    planet1Group.add(p1);
    const ring = new THREE.Mesh(new THREE.RingGeometry(45, 70, 128), new THREE.MeshBasicMaterial({ color: 0xbbaa88, side: THREE.DoubleSide, transparent: true, opacity: 0.35 }));
    ring.rotation.x = Math.PI / 2.2;
    planet1Group.add(ring);
    scene.add(planet1Group);

    // Blue planet with atmosphere
    const p2 = new THREE.Mesh(new THREE.SphereGeometry(22, 48, 48), new THREE.MeshStandardMaterial({ color: 0x2266aa, emissive: 0x051520, roughness: 0.9 }));
    p2.position.set(-350, 100, -600);
    scene.add(p2);
    const atmo = new THREE.Mesh(new THREE.SphereGeometry(25, 48, 48), new THREE.MeshBasicMaterial({ color: 0x44aaff, transparent: true, opacity: 0.06, side: THREE.BackSide }));
    atmo.position.copy(p2.position);
    scene.add(atmo);

    // Small red planet
    const p3 = new THREE.Mesh(new THREE.SphereGeometry(12, 32, 32), new THREE.MeshStandardMaterial({ color: 0xcc4422, emissive: 0x220a05, roughness: 0.6 }));
    p3.position.set(400, -150, -800);
    scene.add(p3);

    // ─── COSMIC DUST ───
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(1500 * 3);
    for (let i = 0; i < 1500; i++) { dustPos[i*3]=(Math.random()-0.5)*2000; dustPos[i*3+1]=(Math.random()-0.5)*2000; dustPos[i*3+2]=(Math.random()-0.5)*2000; }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0x88aacc, size: 0.4, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending }));
    scene.add(dust);

    // ─── LIGHTING ───
    scene.add(new THREE.AmbientLight(0x0a0a1a, 0.4));
    const sun = new THREE.DirectionalLight(0xffffff, 0.6);
    sun.position.set(200, 300, 200);
    scene.add(sun);
    const rimLight = new THREE.PointLight(0x4488ff, 0.4, 800);
    rimLight.position.set(-300, 100, -200);
    scene.add(rimLight);

    // ─── ISOTIPO (logo floating in 3D space) ───
    const textureLoader = new THREE.TextureLoader();
    const isotipoTexture = textureLoader.load('/isotipo.png');
    isotipoTexture.colorSpace = THREE.SRGBColorSpace;
    const isotipoMat = new THREE.MeshBasicMaterial({
      map: isotipoTexture,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      blending: THREE.NormalBlending,
    });
    const isotipoGeo = new THREE.PlaneGeometry(120, 120);
    const isotipoMesh = new THREE.Mesh(isotipoGeo, isotipoMat);
    isotipoMesh.position.set(0, 60, 200); // Close to camera, centered
    scene.add(isotipoMesh);

    // ─── ANIMATION ───
    const clock = new THREE.Clock();
    let animId: number;

    function animate() {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Ultra slow star rotation (parallax)
      starsDeep.rotation.y += 0.00002;
      starsMid.rotation.y += 0.00004;
      starsNear.rotation.y += 0.00007;
      starsBlue.rotation.y -= 0.00003;
      starsOrange.rotation.y += 0.00003;

      nebulaGroup.rotation.y += 0.00002;
      galaxyMain.rotation.y += 0.00012;
      galaxySecondary.rotation.y -= 0.00015;

      p1.rotation.y += 0.0008;
      ring.rotation.z += 0.0002;
      p2.rotation.y += 0.001;
      p3.rotation.y += 0.0015;

      // Isotipo gentle float
      isotipoMesh.position.y = 60 + Math.sin(t * 0.2) * 3;
      isotipoMesh.rotation.y = Math.sin(t * 0.1) * 0.03;

      dust.rotation.y += 0.00003;

      // Camera gentle sway
      camera.position.x = 10 * Math.sin(t * 0.03);
      camera.position.y = 60 + 8 * Math.cos(t * 0.025);
      camera.lookAt(0, 0, -100);

      renderer.render(scene, camera);
    }
    animate();

    // Resize
    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={mountRef} className="w-full h-full bg-black relative">
      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 pointer-events-none z-10">
        <span className="text-[11px] font-[300] tracking-[0.4em] uppercase text-white/70">
          Descubre
        </span>
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none" className="animate-bounce opacity-70">
          <path d="M8 2v18M2 16l6 6 6-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}
