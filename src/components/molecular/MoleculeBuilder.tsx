import React, { useState, useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  Plus,
  Trash2,
  Sparkles,
  Link,
  ShieldCheck,
  AlertCircle,
  Play,
  Zap,
} from 'lucide-react';
import { playPop, playViolentSpatter } from '../../utils/audio';

interface CustomAtom {
  id: string;
  element: string;
  name: string;
  color: string;
  radius: number;
  maxBonds: number;
  position: [number, number, number];
}

interface CustomBond {
  id: string;
  sourceId: string;
  targetId: string;
  order: 1 | 2 | 3;
}

const PALETTE_ELEMENTS = [
  { element: 'C', name: 'Karbon', color: '#334155', radius: 0.45, maxBonds: 4 },
  { element: 'H', name: 'Hidrogen', color: '#f8fafc', radius: 0.3, maxBonds: 1 },
  { element: 'O', name: 'Oksigen', color: '#ef4444', radius: 0.4, maxBonds: 2 },
  { element: 'N', name: 'Nitrogen', color: '#3b82f6', radius: 0.42, maxBonds: 3 },
  { element: 'Cl', name: 'Klorin', color: '#22c55e', radius: 0.48, maxBonds: 1 },
  { element: 'S', name: 'Belerang', color: '#eab308', radius: 0.48, maxBonds: 2 },
  { element: 'P', name: 'Fosforus', color: '#f97316', radius: 0.46, maxBonds: 3 },
];

export const MoleculeBuilder: React.FC = () => {
  // Start with a default water molecule (H-O-H)
  const [atoms, setAtoms] = useState<CustomAtom[]>([
    { id: 'o-1', element: 'O', name: 'Oksigen', color: '#ef4444', radius: 0.4, maxBonds: 2, position: [0, 0, 0] },
    { id: 'h-1', element: 'H', name: 'Hidrogen', color: '#f8fafc', radius: 0.3, maxBonds: 1, position: [-0.9, -0.7, 0] },
    { id: 'h-2', element: 'H', name: 'Hidrogen', color: '#f8fafc', radius: 0.3, maxBonds: 1, position: [0.9, -0.7, 0] },
  ]);

  const [bonds, setBonds] = useState<CustomBond[]>([
    { id: 'b-1', sourceId: 'o-1', targetId: 'h-1', order: 1 },
    { id: 'b-2', sourceId: 'o-1', targetId: 'h-2', order: 1 },
  ]);

  const [selectedAtomId, setSelectedAtomId] = useState<string | null>(null);
  const [bondOrder, setBondOrder] = useState<1 | 2 | 3>(1);
  const [selectedPaletteElement, setSelectedPaletteElement] = useState(PALETTE_ELEMENTS[0]);

  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate Formula & Octet Validity
  const formulaInfo = useMemo(() => {
    const counts: Record<string, number> = {};
    atoms.forEach((a) => {
      counts[a.element] = (counts[a.element] || 0) + 1;
    });

    // Format hill system (C first, then H, then others alphabetical)
    let formula = '';
    if (counts['C']) {
      formula += `C${counts['C'] > 1 ? counts['C'] : ''}`;
      delete counts['C'];
    }
    if (counts['H']) {
      formula += `H${counts['H'] > 1 ? counts['H'] : ''}`;
      delete counts['H'];
    }
    Object.keys(counts)
      .sort()
      .forEach((el) => {
        formula += `${el}${counts[el] > 1 ? counts[el] : ''}`;
      });

    // Check atom valencies
    const atomValencyMap: Record<string, number> = {};
    bonds.forEach((b) => {
      atomValencyMap[b.sourceId] = (atomValencyMap[b.sourceId] || 0) + b.order;
      atomValencyMap[b.targetId] = (atomValencyMap[b.targetId] || 0) + b.order;
    });

    const violations: { atomId: string; element: string; used: number; max: number; status: 'under' | 'over' }[] = [];
    atoms.forEach((a) => {
      const used = atomValencyMap[a.id] || 0;
      if (used > a.maxBonds) {
        violations.push({ atomId: a.id, element: a.element, used, max: a.maxBonds, status: 'over' });
      } else if (used < a.maxBonds) {
        violations.push({ atomId: a.id, element: a.element, used, max: a.maxBonds, status: 'under' });
      }
    });

    return {
      formula: formula || 'Kosong',
      atomCount: atoms.length,
      bondCount: bonds.length,
      isStable: violations.length === 0 && atoms.length > 0,
      violations,
      atomValencyMap,
    };
  }, [atoms, bonds]);

  // 3D Canvas rendering
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambient);
    const dir1 = new THREE.DirectionalLight(0xffffff, 1.8);
    dir1.position.set(5, 8, 6);
    scene.add(dir1);

    // Atom meshes
    const atomMeshMap = new Map<string, THREE.Mesh>();
    const sphereGeo = new THREE.SphereGeometry(1, 32, 32);

    atoms.forEach((atom) => {
      const isSelected = selectedAtomId === atom.id;
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(isSelected ? '#0284c7' : atom.color),
        roughness: 0.3,
        metalness: 0.1,
      });
      const mesh = new THREE.Mesh(sphereGeo, mat);
      mesh.scale.setScalar(atom.radius);
      mesh.position.set(...atom.position);
      (mesh as any).userData = { atomId: atom.id };
      scene.add(mesh);
      atomMeshMap.set(atom.id, mesh);
    });

    // Bond meshes (Cylinders)
    const bondGeo = new THREE.CylinderGeometry(0.06, 0.06, 1, 16);
    const bondMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.4 });

    bonds.forEach((bond) => {
      const atomA = atoms.find((a) => a.id === bond.sourceId);
      const atomB = atoms.find((a) => a.id === bond.targetId);
      if (!atomA || !atomB) return;

      const posA = new THREE.Vector3(...atomA.position);
      const posB = new THREE.Vector3(...atomB.position);
      const distance = posA.distanceTo(posB);
      const midpoint = new THREE.Vector3().addVectors(posA, posB).multiplyScalar(0.5);

      const mesh = new THREE.Mesh(bondGeo, bondMat);
      mesh.position.copy(midpoint);
      mesh.scale.set(1, distance, 1);

      const direction = new THREE.Vector3().subVectors(posB, posA).normalize();
      const orientation = new THREE.Quaternion();
      orientation.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
      mesh.quaternion.copy(orientation);

      scene.add(mesh);
    });

    // Raycasting for clicking atoms
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(Array.from(atomMeshMap.values()));

      if (intersects.length > 0) {
        const clickedAtomId = (intersects[0].object as any).userData?.atomId as string;
        if (clickedAtomId) {
          if (selectedAtomId && selectedAtomId !== clickedAtomId) {
            // Create bond between selectedAtomId and clickedAtomId!
            const exists = bonds.some(
              (b) =>
                (b.sourceId === selectedAtomId && b.targetId === clickedAtomId) ||
                (b.sourceId === clickedAtomId && b.targetId === selectedAtomId)
            );
            if (!exists) {
              setBonds((prev) => [
                ...prev,
                {
                  id: `b-${Date.now()}-${Math.random()}`,
                  sourceId: selectedAtomId,
                  targetId: clickedAtomId,
                  order: bondOrder,
                },
              ]);
            }
            setSelectedAtomId(null);
          } else {
            setSelectedAtomId(clickedAtomId === selectedAtomId ? null : clickedAtomId);
          }
        }
      } else {
        setSelectedAtomId(null);
      }
    };

    renderer.domElement.addEventListener('click', handleClick);

    const overAtomIds = new Set(
      formulaInfo.violations.filter((v) => v.status === 'over').map((v) => v.atomId)
    );

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      controls.update();

      // Steric clash vibration effect for illegal overbonded atoms
      if (overAtomIds.size > 0) {
        atoms.forEach((atom, i) => {
          if (overAtomIds.has(atom.id)) {
            const mesh = atomMeshMap.get(atom.id);
            if (mesh) {
              mesh.position.x = atom.position[0] + Math.sin(Date.now() * 0.05 + i) * 0.035;
              mesh.position.y = atom.position[1] + Math.cos(Date.now() * 0.05 + i) * 0.035;
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.emissive.setHex(0xdc2626);
              mat.emissiveIntensity = 0.5 + Math.sin(Date.now() * 0.01) * 0.4;
            }
          }
        });
      }

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
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleClick);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [atoms, bonds, selectedAtomId, bondOrder]);

  // Add atom to scene
  const handleAddAtom = () => {
    const newId = `atom-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    // Random position near center
    const rx = (Math.random() - 0.5) * 2;
    const ry = (Math.random() - 0.5) * 2;
    const rz = (Math.random() - 0.5) * 2;

    const newAtom: CustomAtom = {
      id: newId,
      element: selectedPaletteElement.element,
      name: selectedPaletteElement.name,
      color: selectedPaletteElement.color,
      radius: selectedPaletteElement.radius,
      maxBonds: selectedPaletteElement.maxBonds,
      position: [rx, ry, rz],
    };

    setAtoms((prev) => [...prev, newAtom]);

    // If an atom was already selected, immediately link them!
    if (selectedAtomId) {
      setBonds((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          sourceId: selectedAtomId,
          targetId: newId,
          order: bondOrder,
        },
      ]);
      setSelectedAtomId(null);
    }
  };

  // 3D Force-Directed Relaxation to spread atoms realistically
  const handleRelaxGeometry = () => {
    if (atoms.length < 2) return;

    const newAtoms = atoms.map((a) => ({ ...a, pos: new THREE.Vector3(...a.position) }));
    const idealDist = 1.3;

    // Run 50 iterations of spring repulsion / bond attraction
    for (let iter = 0; iter < 50; iter++) {
      // Repulsion between all atom pairs
      for (let i = 0; i < newAtoms.length; i++) {
        for (let j = i + 1; j < newAtoms.length; j++) {
          const delta = new THREE.Vector3().subVectors(newAtoms[i].pos, newAtoms[j].pos);
          const dist = Math.max(0.1, delta.length());
          if (dist < 3.0) {
            const force = ((3.0 - dist) / dist) * 0.04;
            delta.multiplyScalar(force);
            newAtoms[i].pos.add(delta);
            newAtoms[j].pos.sub(delta);
          }
        }
      }

      // Attraction along bonds
      bonds.forEach((b) => {
        const atomA = newAtoms.find((a) => a.id === b.sourceId);
        const atomB = newAtoms.find((a) => a.id === b.targetId);
        if (atomA && atomB) {
          const delta = new THREE.Vector3().subVectors(atomB.pos, atomA.pos);
          const dist = delta.length();
          const disp = (dist - idealDist) * 0.15;
          delta.normalize().multiplyScalar(disp);
          atomA.pos.add(delta);
          atomB.pos.sub(delta);
        }
      });
    }

    setAtoms(
      newAtoms.map((a) => ({
        id: a.id,
        element: a.element,
        name: a.name,
        color: a.color,
        radius: a.radius,
        maxBonds: a.maxBonds,
        position: [a.pos.x, a.pos.y, a.pos.z],
      }))
    );
  };

  const handleClear = () => {
    setAtoms([]);
    setBonds([]);
    setSelectedAtomId(null);
  };

  const handleSimulateDissociation = () => {
    const overAtoms = formulaInfo.violations.filter((v) => v.status === 'over');
    if (overAtoms.length === 0) return;

    playPop();
    playViolentSpatter();

    // Snap excess bonds on overbonded atoms to restore stability
    const overIds = new Set(overAtoms.map((v) => v.atomId));
    setBonds((prev) => {
      const toRemove = new Set<string>();
      overIds.forEach((id) => {
        const connected = prev.filter((b) => b.sourceId === id || b.targetId === id);
        const atom = atoms.find((a) => a.id === id);
        const max = atom?.maxBonds || 4;
        let total = connected.reduce((acc, b) => acc + b.order, 0);
        for (const b of connected) {
          if (total > max) {
            toRemove.add(b.id);
            total -= b.order;
          }
        }
      });
      return prev.filter((b) => !toRemove.has(b.id));
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {/* Top Header Card */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
            <Sparkles size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Perancang Molekul Kustom 3D
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Rakit molekul dari atom, cek validasi valensi kaidah oktet, dan relaksasi geometri 3D
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            className="btn btn-secondary"
            onClick={handleRelaxGeometry}
            style={{ fontSize: '12px', gap: '6px' }}
            title="Optimasi sudut dan panjang ikatan kimia 3D"
          >
            <Play size={14} color="#0284c7" />
            Relaksasi Geometri 3D
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleClear}
            style={{ fontSize: '12px', gap: '6px' }}
          >
            <Trash2 size={14} />
            Hapus Semua
          </button>
        </div>
      </div>

      {/* Main Studio Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '16px' }}>
        {/* Left Palette & Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Palette Elements */}
          <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              1. Pilih Atom Unsur:
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
              {PALETTE_ELEMENTS.map((el) => {
                const isSelected = selectedPaletteElement.element === el.element;
                return (
                  <button
                    key={el.element}
                    onClick={() => setSelectedPaletteElement(el)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: isSelected ? '2px solid #0284c7' : '1px solid #e2e8f0',
                      background: isSelected ? '#f0f9ff' : '#ffffff',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    <span
                      style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        backgroundColor: el.color,
                        border: '1px solid rgba(0,0,0,0.1)',
                      }}
                    />
                    <strong>{el.element}</strong>
                    <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>({el.maxBonds} ikatan)</span>
                  </button>
                );
              })}
            </div>

            <button
              className="btn btn-primary"
              onClick={handleAddAtom}
              style={{ marginTop: '6px', justifyContent: 'center', gap: '6px', fontSize: '13px' }}
            >
              <Plus size={16} />
              Tambah Atom {selectedPaletteElement.element}
            </button>
          </div>

          {/* Bond Type Selector */}
          <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              2. Tipe Ikatan:
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                className={`filter-pill ${bondOrder === 1 ? 'active' : ''}`}
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setBondOrder(1)}
              >
                Tunggal (-)
              </button>
              <button
                className={`filter-pill ${bondOrder === 2 ? 'active' : ''}`}
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setBondOrder(2)}
              >
                Rangkap (=)
              </button>
              <button
                className={`filter-pill ${bondOrder === 3 ? 'active' : ''}`}
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setBondOrder(3)}
              >
                Tiga (≡)
              </button>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Klik 2 atom berurutan pada canvas 3D untuk menghubungkan ikatan.
            </span>
          </div>

          {/* Valency & Octet Status */}
          <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Kaidah Oktet & Kestabilan:
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              {formulaInfo.isStable ? (
                <span style={{ color: '#16a34a', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                  <ShieldCheck size={16} /> Stabil (Sesuai Valensi)
                </span>
              ) : (
                <span style={{ color: '#ea580c', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                  <AlertCircle size={16} /> Perlu Penyesuaian Valensi
                </span>
              )}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Rumus Kimia: <strong>{formulaInfo.formula}</strong> • {formulaInfo.atomCount} atom • {formulaInfo.bondCount} ikatan
            </div>

            {/* Real-World Failure / Overbonding Alert & Dissociation Simulation */}
            {formulaInfo.violations.some((v) => v.status === 'over') && (
              <div
                style={{
                  marginTop: '8px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#dc2626', fontSize: '12px', fontWeight: 700 }}>
                  <AlertCircle size={15} />
                  <span>Kegagalan Valensi di Alam Nyata!</span>
                </div>
                <p style={{ margin: 0, fontSize: '11px', color: '#991b1b', lineHeight: 1.5 }}>
                  Unsur periode 2 (seperti Karbon, Nitrogen, Oksigen) tidak memiliki subkulit 2d untuk menampung lebih dari 8 elektron oktet. Atom bergetar hebat akibat tolakan sterik antar-elektron!
                </p>
                <button
                  className="btn btn-primary"
                  onClick={handleSimulateDissociation}
                  style={{
                    fontSize: '11px',
                    padding: '6px 12px',
                    gap: '6px',
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    borderColor: '#b91c1c',
                    width: '100%',
                    justifyContent: 'center',
                  }}
                  title="Simulasikan pemutusan ikatan spontan akibat ketidakstabilan orbital di dunia nyata"
                >
                  <Zap size={14} />
                  💥 Simulasikan Disosiasi Nyata
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 3D Canvas Viewport */}
        <div
          ref={containerRef}
          style={{
            position: 'relative',
            width: '100%',
            height: '520px',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            background: 'radial-gradient(circle at 50% 40%, #ffffff 0%, #f8fafc 65%, #e2e8f0 100%)',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.05)',
            overflow: 'hidden',
          }}
        >
          {/* Top Instruction Pill */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              padding: '6px 14px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '999px',
              border: '1px solid var(--border-color)',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Link size={14} color="#0284c7" />
            {selectedAtomId ? 'Pilih atom kedua untuk membuat ikatan...' : 'Klik atom untuk mulai menghubungkan ikatan'}
          </div>
        </div>
      </div>
    </div>
  );
};
