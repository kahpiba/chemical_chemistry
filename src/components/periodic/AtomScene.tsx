import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { ElementData } from '../../data/elements';

interface AtomSceneProps {
  element: ElementData;
  autoRotate?: boolean;
}

export const AtomScene: React.FC<AtomSceneProps> = ({ element, autoRotate = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 5, 12);

    // 2. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 3. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 2;
    controls.maxDistance = 25;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.8;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x38bdf8, 3, 20);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight1.position.set(5, 8, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.2);
    dirLight2.position.set(-5, -4, -5);
    scene.add(dirLight2);

    // 5. Nucleus Cluster (Protons & Neutrons)
    const nucleusGroup = new THREE.Group();
    scene.add(nucleusGroup);

    const protonCount = Math.min(element.number, 40); // Cap cluster spheres for visual clarity
    const approxNeutrons = Math.max(1, Math.round(Number(element.atomicMass) - element.number));
    const neutronCount = Math.min(approxNeutrons, 40);

    const protonGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const protonMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.3,
      metalness: 0.2,
      emissive: 0x991b1b,
      emissiveIntensity: 0.3,
    });

    const neutronGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const neutronMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.5,
      metalness: 0.1,
    });

    // Generate packed sphere cluster using Fibonacci sphere distribution
    const totalNucleons = protonCount + neutronCount;
    const clusterRadius = 0.35 + Math.pow(totalNucleons, 1 / 3) * 0.14;

    for (let i = 0; i < totalNucleons; i++) {
      const isProton = i % 2 === 0;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / totalNucleons);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = clusterRadius * Math.pow(Math.random() * 0.5 + 0.5, 0.5);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      const mesh = new THREE.Mesh(isProton ? protonGeo : neutronGeo, isProton ? protonMat : neutronMat);
      mesh.position.set(x, y, z);
      nucleusGroup.add(mesh);
    }

    // Glow aura around nucleus
    const glowGeo = new THREE.SphereGeometry(clusterRadius * 1.3, 24, 24);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.12,
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    nucleusGroup.add(glowMesh);

    // 6. Electron Shells & Orbiting Electrons
    interface ElectronObject {
      mesh: THREE.Mesh;
      radius: number;
      speed: number;
      angle: number;
      tiltX: number;
      tiltZ: number;
    }

    const electronObjects: ElectronObject[] = [];
    const electronGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const electronMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.8,
    });

    const shellBaseRadius = clusterRadius + 1.2;
    const shellSpacing = 0.95;

    element.shells.forEach((electronCountInShell, shellIndex) => {
      const shellRadius = shellBaseRadius + shellIndex * shellSpacing;

      // Shell orbital ring wireframe
      const points: THREE.Vector3[] = [];
      const segments = 64;
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * shellRadius, 0, Math.sin(theta) * shellRadius));
      }
      const ringGeo = new THREE.BufferGeometry().setFromPoints(points);
      const ringMat = new THREE.LineBasicMaterial({
        color: 0x0284c7,
        transparent: true,
        opacity: 0.35 - shellIndex * 0.03,
      });
      const ringLine = new THREE.LineLoop(ringGeo, ringMat);
      
      // Give each shell a slight 3D orbital tilt
      const tiltX = (shellIndex * 0.25) % Math.PI;
      const tiltZ = (shellIndex * 0.35) % Math.PI;
      ringLine.rotation.x = tiltX;
      ringLine.rotation.z = tiltZ;
      scene.add(ringLine);

      // Distribute electrons along the ring
      for (let e = 0; e < electronCountInShell; e++) {
        const initialAngle = (e / electronCountInShell) * Math.PI * 2;
        const eMesh = new THREE.Mesh(electronGeo, electronMat);
        scene.add(eMesh);

        electronObjects.push({
          mesh: eMesh,
          radius: shellRadius,
          speed: (1.2 / Math.sqrt(shellRadius)) * (shellIndex % 2 === 0 ? 1 : -1),
          angle: initialAngle,
          tiltX,
          tiltZ,
        });
      }
    });

    // Adjust camera distance depending on outermost shell
    const maxRadius = shellBaseRadius + element.shells.length * shellSpacing;
    camera.position.set(0, maxRadius * 1.3, maxRadius * 2.2);
    controls.target.set(0, 0, 0);

    // 7. Render Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Gently rotate nucleus
      nucleusGroup.rotation.y += delta * 0.3;
      nucleusGroup.rotation.x += delta * 0.15;

      // Update electron orbits
      electronObjects.forEach((eo) => {
        eo.angle += eo.speed * delta;
        const xRaw = Math.cos(eo.angle) * eo.radius;
        const zRaw = Math.sin(eo.angle) * eo.radius;

        // Apply tilt rotation
        const pos = new THREE.Vector3(xRaw, 0, zRaw);
        pos.applyAxisAngle(new THREE.Vector3(1, 0, 0), eo.tiltX);
        pos.applyAxisAngle(new THREE.Vector3(0, 0, 1), eo.tiltZ);

        eo.mesh.position.copy(pos);
      });

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Observer
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [element, autoRotate]);

  return (
    <div ref={containerRef} className="atom-canvas-wrapper">
      <div className="atom-canvas-badges">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)',
          }}
        >
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#ef4444',
            }}
          />
          <span style={{ fontSize: '12px', color: '#0f172a', fontWeight: 600 }}>
            {element.number} Proton (Inti)
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)',
          }}
        >
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#0284c7',
            }}
          />
          <span style={{ fontSize: '12px', color: '#0f172a', fontWeight: 600 }}>
            {element.shells.reduce((a, b) => a + b, 0)} Elektron ({element.shells.length} Kulit)
          </span>
        </div>
      </div>

      <div className="atom-canvas-hint">
        Tahan klik & geser untuk memutar · Scroll untuk zoom
      </div>
    </div>
  );
};
