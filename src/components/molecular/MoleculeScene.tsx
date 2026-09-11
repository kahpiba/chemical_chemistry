import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { MoleculeData, MoleculeAtom } from '../../data/molecules';

interface MoleculeSceneProps {
  molecule: MoleculeData;
  explodeAmount: number; // 0 (assembled) to 1 (fully exploded)
  autoRotate: boolean;
  onSelectAtom?: (atom: MoleculeAtom | null) => void;
}

export const MoleculeScene: React.FC<MoleculeSceneProps> = ({
  molecule,
  explodeAmount,
  autoRotate,
  onSelectAtom,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredAtom, setHoveredAtom] = useState<{ atom: MoleculeAtom; x: number; y: number } | null>(null);

  // References to keep track of dynamic meshes across renders
  const explodeRef = useRef(explodeAmount);
  explodeRef.current = explodeAmount;

  const autoRotateRef = useRef(autoRotate);
  autoRotateRef.current = autoRotate;

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
    camera.position.set(0, 2, 8);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 3. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.minDistance = 2;
    controls.maxDistance = 22;
    controls.autoRotate = autoRotateRef.current;
    controls.autoRotateSpeed = 1.0;

    // 4. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.4);
    dirLight2.position.set(-6, -4, -6);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xffffff, 1.5, 30);
    pointLight.position.set(0, 0, 5);
    scene.add(pointLight);

    // 5. Build Atom Meshes
    const atomMeshes: {
      mesh: THREE.Mesh;
      basePos: THREE.Vector3;
      expPos: THREE.Vector3;
      atom: MoleculeAtom;
    }[] = [];

    const sphereGeo = new THREE.SphereGeometry(1, 32, 32);

    molecule.atoms.forEach((atom) => {
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(atom.color),
        roughness: 0.25,
        metalness: 0.15,
      });

      const mesh = new THREE.Mesh(sphereGeo, mat);
      mesh.scale.setScalar(atom.radius);

      const basePos = new THREE.Vector3(...atom.position);
      const expPos = new THREE.Vector3(...atom.position).add(
        new THREE.Vector3(...atom.explodedOffset)
      );

      mesh.position.copy(basePos);
      (mesh as any).userData = { atom };
      scene.add(mesh);

      atomMeshes.push({ mesh, basePos, expPos, atom });
    });

    // 6. Build Bond Meshes (Cylinders)
    const bondMeshes: {
      mesh: THREE.Mesh;
      atomAIdx: number;
      atomBIdx: number;
      order: number;
    }[] = [];

    const bondGeo = new THREE.CylinderGeometry(0.08, 0.08, 1, 16);
    const bondMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.4,
      metalness: 0.2,
      transparent: true,
      opacity: 0.9,
    });

    molecule.bonds.forEach((bond) => {
      const mesh = new THREE.Mesh(bondGeo, bondMat.clone());
      scene.add(mesh);
      bondMeshes.push({
        mesh,
        atomAIdx: bond.atomA,
        atomBIdx: bond.atomB,
        order: bond.order,
      });
    });

    // Helper: update bond orientation and scale between two 3D positions
    const updateCylinder = (
      mesh: THREE.Mesh,
      vStart: THREE.Vector3,
      vEnd: THREE.Vector3
    ) => {
      const distance = vStart.distanceTo(vEnd);
      const midpoint = new THREE.Vector3().addVectors(vStart, vEnd).multiplyScalar(0.5);

      mesh.position.copy(midpoint);
      mesh.scale.set(1, distance, 1);

      const direction = new THREE.Vector3().subVectors(vEnd, vStart).normalize();
      const orientation = new THREE.Quaternion();
      orientation.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
      mesh.quaternion.copy(orientation);
    };

    // Calculate camera distance to fit molecule comfortably
    const box = new THREE.Box3();
    atomMeshes.forEach((item) => box.expandByPoint(item.expPos));
    const size = box.getSize(new THREE.Vector3()).length();
    camera.position.set(0, size * 0.4, Math.max(5, size * 1.3));
    controls.target.set(0, 0, 0);

    // 7. Raycasting for Atom Hover & Selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(atomMeshes.map((a) => a.mesh));

      if (intersects.length > 0) {
        const hitAtom = (intersects[0].object as any).userData?.atom as MoleculeAtom;
        if (hitAtom) {
          setHoveredAtom({
            atom: hitAtom,
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          });
          renderer.domElement.style.cursor = 'pointer';
          return;
        }
      }
      setHoveredAtom(null);
      renderer.domElement.style.cursor = 'grab';
    };

    const handlePointerDown = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(atomMeshes.map((a) => a.mesh));

      if (intersects.length > 0) {
        const hitAtom = (intersects[0].object as any).userData?.atom as MoleculeAtom;
        if (hitAtom && onSelectAtom) {
          onSelectAtom(hitAtom);
        }
      }
    };

    renderer.domElement.addEventListener('mousemove', handlePointerMove);
    renderer.domElement.addEventListener('click', handlePointerDown);

    // 8. Animation & Render Loop
    let animationFrameId: number;
    let currentExplode = explodeRef.current;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth interpolation for explosion animation
      currentExplode = THREE.MathUtils.lerp(currentExplode, explodeRef.current, 0.1);

      // Update Atom Positions
      atomMeshes.forEach(({ mesh, basePos, expPos }) => {
        mesh.position.lerpVectors(basePos, expPos, currentExplode);
      });

      // Update Bonds & Opacity
      const bondOpacity = Math.max(0, 1 - currentExplode * 1.5);
      bondMeshes.forEach(({ mesh, atomAIdx, atomBIdx }) => {
        const posA = atomMeshes[atomAIdx].mesh.position;
        const posB = atomMeshes[atomBIdx].mesh.position;
        updateCylinder(mesh, posA, posB);

        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.opacity = bondOpacity;
        mesh.visible = bondOpacity > 0.02;
      });

      controls.autoRotate = autoRotateRef.current;
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handling
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('mousemove', handlePointerMove);
      renderer.domElement.removeEventListener('click', handlePointerDown);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [molecule, onSelectAtom]);

  return (
    <div ref={containerRef} className="mol-viewport-container">
      {/* Atom Tooltip on Hover */}
      {hoveredAtom && (
        <div
          className="atom-tooltip"
          style={{
            left: Math.min(hoveredAtom.x + 14, (containerRef.current?.clientWidth || 300) - 180),
            top: Math.max(12, hoveredAtom.y - 40),
          }}
        >
          <div
            className="atom-tooltip-dot"
            style={{ backgroundColor: hoveredAtom.atom.color }}
          />
          <strong>{hoveredAtom.atom.element}</strong>
          <span>{hoveredAtom.atom.name}</span>
          {hoveredAtom.atom.charge && (
            <span style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
              ({hoveredAtom.atom.charge})
            </span>
          )}
        </div>
      )}
    </div>
  );
};
