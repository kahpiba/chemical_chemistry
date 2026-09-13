import React, { useState, useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  Layers,
  Box,
  RotateCw,
  Sparkles,
  Maximize2,
  Compass,
} from 'lucide-react';
import { CRYSTAL_LATTICES } from '../../data/crystalLatticeData';
import type { CrystalLattice, LatticeAtom } from '../../data/crystalLatticeData';
import { Scene3DHint } from '../common/Scene3DHint';

export const CrystalLatticeViewer: React.FC = () => {
  const [selectedLattice, setSelectedLattice] = useState<CrystalLattice>(CRYSTAL_LATTICES[0]);
  const [renderMode, setRenderMode] = useState<'ball_stick' | 'space_filling'>('ball_stick');
  const [showUnitCellBox, setShowUnitCellBox] = useState<boolean>(true);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [hoveredAtom, setHoveredAtom] = useState<LatticeAtom | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const autoRotateRef = useRef(autoRotate);
  autoRotateRef.current = autoRotate;

  // Unique elements for the legend
  const uniqueElements = useMemo(() => {
    const map = new Map<string, { element: string; name: string; color: string; count: number }>();
    selectedLattice.atoms.forEach((a) => {
      if (!map.has(a.element)) {
        map.set(a.element, { element: a.element, name: a.name, color: a.color, count: 1 });
      } else {
        map.get(a.element)!.count += 1;
      }
    });
    return Array.from(map.values());
  }, [selectedLattice]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(3.5, 2.5, 4.5);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 3. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 2.0;
    controls.maxDistance = 14.0;
    controls.autoRotate = autoRotateRef.current;
    controls.autoRotateSpeed = 1.2;

    // 4. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.0);
    dirLight2.position.set(-6, -4, -6);
    scene.add(dirLight2);

    // Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 5. Unit Cell Wireframe Box
    if (showUnitCellBox) {
      if (selectedLattice.system.includes('Heksagonal')) {
        // Hexagonal prism wireframe
        const hexAngles = [0, 60, 120, 180, 240, 300, 360].map((d) => (d * Math.PI) / 180);
        const r = 1.35;
        const h = 1.2;

        const points: THREE.Vector3[] = [];
        // Bottom ring
        for (let i = 0; i < 6; i++) {
          points.push(new THREE.Vector3(r * Math.cos(hexAngles[i]), -h, r * Math.sin(hexAngles[i])));
          points.push(new THREE.Vector3(r * Math.cos(hexAngles[i + 1]), -h, r * Math.sin(hexAngles[i + 1])));
        }
        // Top ring
        for (let i = 0; i < 6; i++) {
          points.push(new THREE.Vector3(r * Math.cos(hexAngles[i]), h, r * Math.sin(hexAngles[i])));
          points.push(new THREE.Vector3(r * Math.cos(hexAngles[i + 1]), h, r * Math.sin(hexAngles[i + 1])));
        }
        // Vertical edges
        for (let i = 0; i < 6; i++) {
          points.push(new THREE.Vector3(r * Math.cos(hexAngles[i]), -h, r * Math.sin(hexAngles[i])));
          points.push(new THREE.Vector3(r * Math.cos(hexAngles[i]), h, r * Math.sin(hexAngles[i])));
        }

        const hexGeo = new THREE.BufferGeometry().setFromPoints(points);
        const hexMat = new THREE.LineBasicMaterial({ color: '#94a3b8', transparent: true, opacity: 0.55 });
        const hexLines = new THREE.LineSegments(hexGeo, hexMat);
        rootGroup.add(hexLines);
      } else {
        // Cubic box wireframe
        const boxSize = selectedLattice.id === 'diamond' ? 2.4 : 2.2;
        const boxGeo = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
        const boxEdges = new THREE.EdgesGeometry(boxGeo);
        const boxMat = new THREE.LineBasicMaterial({ color: '#94a3b8', transparent: true, opacity: 0.55 });
        const boxLines = new THREE.LineSegments(boxEdges, boxMat);
        rootGroup.add(boxLines);
      }
    }

    // 6. Atom Spheres
    const atomRadiusMult = renderMode === 'space_filling' ? 1.9 : 1.0;
    const sphereGeo = new THREE.SphereGeometry(1, 28, 28);
    const atomMeshes: { mesh: THREE.Mesh; atom: LatticeAtom }[] = [];

    selectedLattice.atoms.forEach((atom) => {
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(atom.color),
        roughness: 0.25,
        metalness: 0.15,
      });

      const mesh = new THREE.Mesh(sphereGeo, mat);
      mesh.scale.setScalar(atom.radius * atomRadiusMult);
      mesh.position.set(...atom.position);
      rootGroup.add(mesh);
      atomMeshes.push({ mesh, atom });
    });

    // 7. Bonds (Cylinders) - shown in ball_stick mode
    if (renderMode === 'ball_stick') {
      const bondCylGeo = new THREE.CylinderGeometry(1, 1, 1, 16);

      selectedLattice.bonds.forEach((bond) => {
        const fromAtom = selectedLattice.atoms[bond.fromIndex];
        const toAtom = selectedLattice.atoms[bond.toIndex];
        if (!fromAtom || !toAtom) return;

        const p1 = new THREE.Vector3(...fromAtom.position);
        const p2 = new THREE.Vector3(...toAtom.position);
        const dir = new THREE.Vector3().subVectors(p2, p1);
        const length = dir.length();
        const center = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);

        const bondMat = new THREE.MeshStandardMaterial({
          color: bond.isVanDerWaals ? '#94a3b8' : '#cbd5e1',
          roughness: 0.4,
          transparent: !!bond.isVanDerWaals,
          opacity: bond.isVanDerWaals ? 0.45 : 0.85,
        });

        const bondMesh = new THREE.Mesh(bondCylGeo, bondMat);
        bondMesh.scale.set(bond.isVanDerWaals ? 0.025 : 0.045, length, bond.isVanDerWaals ? 0.025 : 0.045);
        bondMesh.position.copy(center);

        // Align cylinder with vector
        const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
        bondMesh.setRotationFromQuaternion(quat);
        rootGroup.add(bondMesh);
      });
    }

    // 8. Raycasting for hover tooltip
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-1000, -1000);

    const onPointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(atomMeshes.map((m) => m.mesh));
      if (intersects.length > 0) {
        const hit = atomMeshes.find((m) => m.mesh === intersects[0].object);
        if (hit) {
          setHoveredAtom(hit.atom);
          renderer.domElement.style.cursor = 'pointer';
          return;
        }
      }
      setHoveredAtom(null);
      renderer.domElement.style.cursor = 'grab';
    };

    renderer.domElement.addEventListener('mousemove', onPointerMove);

    // Resize Handler
    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // Animation Loop
    let animId = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.autoRotate = autoRotateRef.current;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('mousemove', onPointerMove);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [selectedLattice, renderMode, showUnitCellBox]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {/* Crystal Selector Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
              }}
            >
              <Box size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Visualizer Kisi Kristal 3D (Crystal Lattice)
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Eksplorasi susunan atom padatan, sel satuan Bravais, bilangan koordinasi & kerapatan APF
              </span>
            </div>
          </div>

          {/* Crystal System Chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {CRYSTAL_LATTICES.map((lat) => (
              <button
                key={lat.id}
                className={`filter-pill ${selectedLattice.id === lat.id ? 'active' : ''}`}
                onClick={() => setSelectedLattice(lat)}
                style={{ fontSize: '12px' }}
              >
                <strong>{lat.formula}:</strong> {lat.name.split('(')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main 3D Canvas & Side Info Panel */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 380px',
          gap: '16px',
          alignItems: 'start',
        }}
        className="crystal-grid-layout"
      >
        {/* Left: Interactive 3D Canvas */}
        <div
          className="glass-panel"
          style={{
            position: 'relative',
            height: '560px',
            borderRadius: '16px',
            overflow: 'hidden',
            background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
            border: '1px solid #cbd5e1',
          }}
        >
          {/* 3D Touch Hint */}
          <Scene3DHint storageKey="chem_lattice_hint_seen" customText="Geser kursor / sentuh untuk rotasi kisi kristal 3D" />

          {/* Canvas Mount */}
          <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

          {/* Floating Canvas Controls */}
          <div
            style={{
              position: 'absolute',
              top: '14px',
              left: '14px',
              display: 'flex',
              gap: '8px',
              zIndex: 10,
            }}
          >
            <button
              className={`filter-pill ${renderMode === 'ball_stick' ? 'active' : ''}`}
              onClick={() => setRenderMode('ball_stick')}
              style={{ fontSize: '11px', gap: '5px' }}
            >
              <Box size={13} />
              Bola & Batang
            </button>
            <button
              className={`filter-pill ${renderMode === 'space_filling' ? 'active' : ''}`}
              onClick={() => setRenderMode('space_filling')}
              style={{ fontSize: '11px', gap: '5px' }}
            >
              <Maximize2 size={13} />
              Ruang Terisi (Hard Spheres)
            </button>
          </div>

          <div
            style={{
              position: 'absolute',
              top: '14px',
              right: '14px',
              display: 'flex',
              gap: '8px',
              zIndex: 10,
            }}
          >
            <button
              className={`btn btn-secondary ${showUnitCellBox ? 'active' : ''}`}
              onClick={() => setShowUnitCellBox(!showUnitCellBox)}
              style={{ fontSize: '11px', padding: '6px 10px', gap: '5px' }}
              title="Tampilkan / Sembunyikan Kotak Sel Satuan"
            >
              <Layers size={13} />
              {showUnitCellBox ? 'Sembunyikan Box' : 'Tampilkan Box'}
            </button>
            <button
              className={`btn btn-secondary ${autoRotate ? 'active' : ''}`}
              onClick={() => setAutoRotate(!autoRotate)}
              style={{ fontSize: '11px', padding: '6px 10px', gap: '5px' }}
              title="Toggle Rotasi Otomatis"
            >
              <RotateCw size={13} />
              {autoRotate ? 'Stop Putar' : 'Putar 3D'}
            </button>
          </div>

          {/* Atom Hover HUD */}
          {hoveredAtom && (
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(8px)',
                color: '#ffffff',
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                zIndex: 10,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              <span
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: hoveredAtom.color,
                  display: 'inline-block',
                }}
              />
              <strong>{hoveredAtom.name} ({hoveredAtom.element})</strong>
              <span style={{ color: '#94a3b8' }}>
                Posisi: [{hoveredAtom.position.map((v) => v.toFixed(1)).join(', ')}]
              </span>
            </div>
          )}

          {/* Quick Atom Legend */}
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(8px)',
              padding: '8px 12px',
              borderRadius: '10px',
              fontSize: '11px',
              display: 'flex',
              gap: '12px',
              zIndex: 10,
              border: '1px solid #e2e8f0',
            }}
          >
            {uniqueElements.map((el) => (
              <div key={el.element} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: el.color,
                    border: '1px solid rgba(0,0,0,0.15)',
                  }}
                />
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{el.element}</span>
                <span style={{ color: '#64748b' }}>({el.count} atom)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Crystallographic Parameter Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Header Card */}
          <div className="glass-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase' }}>
                  {selectedLattice.formula}
                </span>
                <h3 style={{ margin: '2px 0 0', fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {selectedLattice.name}
                </h3>
              </div>
              <span
                style={{
                  background: '#f1f5f9',
                  color: '#475569',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 700,
                  border: '1px solid #e2e8f0',
                }}
              >
                {selectedLattice.system}
              </span>
            </div>

            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {selectedLattice.description}
            </p>

            {/* Key Crystallographic Properties */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                marginTop: '4px',
              }}
            >
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                  Kisi Bravais
                </span>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {selectedLattice.bravais}
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                  Bil. Koordinasi
                </span>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0284c7', marginTop: '2px' }}>
                  {selectedLattice.coordinationNumber}
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                  Efisiensi Kemasan (APF)
                </span>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#16a34a', marginTop: '2px' }}>
                  {selectedLattice.apf}
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                  Atom per Sel Satuan
                </span>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {selectedLattice.atomsPerUnitCell}
                </div>
              </div>
            </div>

            {/* Lattice Dimensions */}
            <div
              style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                padding: '10px 12px',
                borderRadius: '8px',
                fontSize: '11px',
                color: '#15803d',
              }}
            >
              <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Compass size={13} />
                Konstanta Kisi: a = {selectedLattice.latticeParams.a}, c = {selectedLattice.latticeParams.c}
              </div>
              <div style={{ marginTop: '2px', color: '#166534' }}>
                Sudut Kristalografi: {selectedLattice.latticeParams.angles}
              </div>
            </div>
          </div>

          {/* Scientific Significance Card */}
          <div
            className="glass-panel"
            style={{
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              background: '#fdf4ff',
              borderColor: '#f0abfc',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#86198f', fontSize: '13px', fontWeight: 700 }}>
              <Sparkles size={15} />
              Signifikansi Fisika & Kimia Material
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: '#701a75', lineHeight: 1.55 }}>
              {selectedLattice.scientificSignificance}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
