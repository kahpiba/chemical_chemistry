import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  Compass,
  Sparkles,
  Eye,
} from 'lucide-react';
import { Scene3DHint } from '../common/Scene3DHint';

export type OrbitalId =
  | '1s'
  | '2s'
  | '2px'
  | '2py'
  | '2pz'
  | '3dz2'
  | '3dx2y2'
  | '3dxy'
  | 'sp'
  | 'sp2'
  | 'sp3'
  | 'sp3d'
  | 'sp3d2';

interface OrbitalMetadata {
  id: OrbitalId;
  name: string;
  category: 'Atomik (s, p, d)' | 'Hibridisasi';
  quantumNumbers: string;
  shape: string;
  nodalPlanes: string;
  maxElectrons: number;
  description: string;
  examples: string;
}

const ORBITAL_CATALOG: OrbitalMetadata[] = [
  {
    id: '1s',
    name: 'Orbital 1s',
    category: 'Atomik (s, p, d)',
    quantumNumbers: 'n = 1, l = 0, mₗ = 0',
    shape: 'Bola Simetris (Spherical)',
    nodalPlanes: '0 bidang simetri nodal',
    maxElectrons: 2,
    description: 'Awan elektron dengan probabilitas radial simetris paling dekat dengan inti atom. Kerapatan elektron tertinggi berada di dekat nukleus.',
    examples: 'Hidrogen (1s¹), Helium (1s²)',
  },
  {
    id: '2s',
    name: 'Orbital 2s',
    category: 'Atomik (s, p, d)',
    quantumNumbers: 'n = 2, l = 0, mₗ = 0',
    shape: 'Bola Konsentris (Radial Node)',
    nodalPlanes: '1 simpul radial (radial node)',
    maxElectrons: 2,
    description: 'Orbital s pada kulit kedua dengan radius lebih besar dan memiliki satu permukaan simpul bola di mana probabilitas elektron nol.',
    examples: 'Litium (2s¹), Berilium (2s²)',
  },
  {
    id: '2px',
    name: 'Orbital 2pₓ',
    category: 'Atomik (s, p, d)',
    quantumNumbers: 'n = 2, l = 1, mₗ = -1',
    shape: 'Balon Terpilin / Dumbbell (Sumbu X)',
    nodalPlanes: '1 bidang nodal (Bidang YZ)',
    maxElectrons: 2,
    description: 'Dua lobus awan elektron yang terorientasi di sepanjang sumbu horizontal X dengan tanda fungsi gelombang berlawanan (+ dan -).',
    examples: 'Karbon, Nitrogen, Oksigen',
  },
  {
    id: '2py',
    name: 'Orbital 2pᵧ',
    category: 'Atomik (s, p, d)',
    quantumNumbers: 'n = 2, l = 1, mₗ = 0',
    shape: 'Balon Terpilin / Dumbbell (Sumbu Y)',
    nodalPlanes: '1 bidang nodal (Bidang XZ)',
    maxElectrons: 2,
    description: 'Dua lobus elektron yang tegak lurus di sepanjang sumbu vertikal Y dengan simetri rotasi.',
    examples: 'Pembentukan ikatan π (pi) etena',
  },
  {
    id: '2pz',
    name: 'Orbital 2p_z',
    category: 'Atomik (s, p, d)',
    quantumNumbers: 'n = 2, l = 1, mₗ = +1',
    shape: 'Balon Terpilin / Dumbbell (Sumbu Z)',
    nodalPlanes: '1 bidang nodal (Bidang XY)',
    maxElectrons: 2,
    description: 'Dua lobus elektron yang menonjol keluar-masuk di sepanjang sumbu kedalaman Z.',
    examples: 'Ikatan rangkap tiga pada asetilena / alkuna',
  },
  {
    id: '3dz2',
    name: 'Orbital 3d_z²',
    category: 'Atomik (s, p, d)',
    quantumNumbers: 'n = 3, l = 2, mₗ = 0',
    shape: 'Dumbbell dengan Cincin Torus (Donat)',
    nodalPlanes: '2 permukaan nodal berbentuk kerucut',
    maxElectrons: 2,
    description: 'Bentuk unik orbital d dengan dua lobus besar di sepanjang sumbu Z dan cincin toroid kerapatan elektron tinggi di bidang ekuatorial XY.',
    examples: 'Kompleks logam transisi Fe, Co, Ni',
  },
  {
    id: '3dx2y2',
    name: 'Orbital 3d_x²-y²',
    category: 'Atomik (s, p, d)',
    quantumNumbers: 'n = 3, l = 2, mₗ = +2',
    shape: 'Semanggi 4 Daun (Sumbu X & Y)',
    nodalPlanes: '2 bidang nodal diagonal (45°)',
    maxElectrons: 2,
    description: 'Empat lobus yang berorientasi tepat di sepanjang sumbu X dan Y. Sangat penting dalam teori medan kristal (CFT) kompleks oktahedral.',
    examples: 'Pewarnaan larutan tembaga CuSO₄',
  },
  {
    id: 'sp',
    name: 'Hibrida sp (Linear 180°)',
    category: 'Hibridisasi',
    quantumNumbers: 'Pencampuran 1s + 1p',
    shape: 'Linear (2 Lobus Berlawanan)',
    nodalPlanes: 'Sudut ikatan 180°',
    maxElectrons: 4,
    description: 'Penggabungan satu orbital s dan satu orbital p menghasilkan 2 orbital hibrida sp simetris linear dengan sudut 180°.',
    examples: 'BeCl₂, CO₂, Asetilena (C₂H₂)',
  },
  {
    id: 'sp2',
    name: 'Hibrida sp² (Trigonal Planar 120°)',
    category: 'Hibridisasi',
    quantumNumbers: 'Pencampuran 1s + 2p',
    shape: 'Segitiga Datar (Trigonal Planar)',
    nodalPlanes: 'Sudut ikatan 120° pada satu bidang',
    maxElectrons: 6,
    description: 'Pencampuran 1 orbital s dan 2 orbital p membentuk 3 orbital hibrida identik yang mengarah ke sudut-sudut segitiga sama sisi.',
    examples: 'BF₃, Etena (C₂H₄), Karbonat (CO₃²⁻)',
  },
  {
    id: 'sp3',
    name: 'Hibrida sp³ (Tetrahedral 109.5°)',
    category: 'Hibridisasi',
    quantumNumbers: 'Pencampuran 1s + 3p',
    shape: 'Tetrahedral 3 Dimensi',
    nodalPlanes: 'Sudut ikatan 109.5°',
    maxElectrons: 8,
    description: 'Pencampuran 1 orbital s dan 3 orbital p menghasilkan 4 orbital hibrida sp³ yang mengarah ke empat sudut bangun ruang tetrahedron.',
    examples: 'Metana (CH₄), Air (H₂O), Amonia (NH₃)',
  },
  {
    id: 'sp3d',
    name: 'Hibrida sp³d (Trigonal Bipiramidal)',
    category: 'Hibridisasi',
    quantumNumbers: 'Pencampuran 1s + 3p + 1d',
    shape: 'Bipiramida Segitiga (90° & 120°)',
    nodalPlanes: 'Posisi aksial & ekuatorial',
    maxElectrons: 10,
    description: 'Melibatkan perluasan kulit valensi oktet menghasilkan 5 orbital terarah: 3 posisi ekuatorial (120°) dan 2 posisi aksial (90°).',
    examples: 'Fosforus Pentaklorida (PCl₅)',
  },
  {
    id: 'sp3d2',
    name: 'Hibrida sp³d² (Oktahedral 90°)',
    category: 'Hibridisasi',
    quantumNumbers: 'Pencampuran 1s + 3p + 2d',
    shape: 'Oktahedral Simetris Tinggi (90°)',
    nodalPlanes: '6 puncak sumbu identik',
    maxElectrons: 12,
    description: 'Enam orbital hibrida identik yang mengarah ke puncak-puncak oktahedron beraturan dengan sudut 90° di semua arah.',
    examples: 'Sulfur Heksafluorida (SF₆)',
  },
];

export const OrbitalExplorer: React.FC = () => {
  const [selectedId, setSelectedId] = useState<OrbitalId>('2px');
  const [showAxes, setShowAxes] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOrbital = ORBITAL_CATALOG.find((o) => o.id === selectedId) || ORBITAL_CATALOG[2];

  // Helper to create a parametric dumbbell lobe
  const createLobe = (color: number, scaleX = 0.9, scaleY = 1.8, scaleZ = 0.9) => {
    const geom = new THREE.SphereGeometry(1, 32, 32);
    // Stretch into egg/tear drop
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      // taper bottom
      const factor = (y + 1) * 0.5;
      pos.setX(i, pos.getX(i) * factor * scaleX);
      pos.setZ(i, pos.getZ(i) * factor * scaleZ);
      pos.setY(i, y * scaleY);
    }
    geom.computeVertexNormals();

    const mat = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.25,
      metalness: 0.1,
      transparent: true,
      opacity: 0.88,
    });
    return new THREE.Mesh(geom, mat);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 1.5, 6.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.2;

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambient);
    const dir1 = new THREE.DirectionalLight(0xffffff, 2.0);
    dir1.position.set(6, 10, 8);
    scene.add(dir1);
    const dir2 = new THREE.DirectionalLight(0x38bdf8, 1.2);
    dir2.position.set(-6, -6, -6);
    scene.add(dir2);

    // Coordinate Axes (X=red, Y=green, Z=blue)
    if (showAxes) {
      const axesHelper = new THREE.AxesHelper(3.2);
      scene.add(axesHelper);
    }

    // Central Nucleus Dot
    const nucleusGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const nucleusMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2 });
    const nucleus = new THREE.Mesh(nucleusGeo, nucleusMat);
    scene.add(nucleus);

    // Group for Orbital geometry
    const orbitalGroup = new THREE.Group();
    scene.add(orbitalGroup);

    // Color definitions for Wave Function Phases
    const POS_COLOR = 0x0284c7; // Biru (+ fase)
    const NEG_COLOR = 0xf97316; // Oranye (- fase)

    // Construct 3D Mesh according to selected orbital
    if (selectedId === '1s') {
      const sGeo = new THREE.SphereGeometry(1.4, 32, 32);
      const sMat = new THREE.MeshStandardMaterial({
        color: POS_COLOR,
        roughness: 0.3,
        transparent: true,
        opacity: 0.75,
      });
      orbitalGroup.add(new THREE.Mesh(sGeo, sMat));
    } else if (selectedId === '2s') {
      // Inner node + outer sphere
      const outerGeo = new THREE.SphereGeometry(2.0, 32, 32);
      const outerMat = new THREE.MeshStandardMaterial({
        color: POS_COLOR,
        roughness: 0.3,
        transparent: true,
        opacity: 0.45,
      });
      const innerGeo = new THREE.SphereGeometry(0.8, 32, 32);
      const innerMat = new THREE.MeshStandardMaterial({
        color: NEG_COLOR,
        roughness: 0.3,
        transparent: true,
        opacity: 0.85,
      });
      orbitalGroup.add(new THREE.Mesh(outerGeo, outerMat));
      orbitalGroup.add(new THREE.Mesh(innerGeo, innerMat));
    } else if (selectedId === '2px') {
      const lobe1 = createLobe(POS_COLOR);
      lobe1.rotation.z = -Math.PI / 2;
      lobe1.position.x = 1.0;
      const lobe2 = createLobe(NEG_COLOR);
      lobe2.rotation.z = Math.PI / 2;
      lobe2.position.x = -1.0;
      orbitalGroup.add(lobe1);
      orbitalGroup.add(lobe2);
    } else if (selectedId === '2py') {
      const lobe1 = createLobe(POS_COLOR);
      lobe1.position.y = 1.0;
      const lobe2 = createLobe(NEG_COLOR);
      lobe2.rotation.x = Math.PI;
      lobe2.position.y = -1.0;
      orbitalGroup.add(lobe1);
      orbitalGroup.add(lobe2);
    } else if (selectedId === '2pz') {
      const lobe1 = createLobe(POS_COLOR);
      lobe1.rotation.x = Math.PI / 2;
      lobe1.position.z = 1.0;
      const lobe2 = createLobe(NEG_COLOR);
      lobe2.rotation.x = -Math.PI / 2;
      lobe2.position.z = -1.0;
      orbitalGroup.add(lobe1);
      orbitalGroup.add(lobe2);
    } else if (selectedId === '3dz2') {
      // Z lobes
      const lobeZ1 = createLobe(POS_COLOR, 0.8, 1.6, 0.8);
      lobeZ1.position.y = 0.9;
      const lobeZ2 = createLobe(POS_COLOR, 0.8, 1.6, 0.8);
      lobeZ2.rotation.x = Math.PI;
      lobeZ2.position.y = -0.9;
      orbitalGroup.add(lobeZ1);
      orbitalGroup.add(lobeZ2);

      // Torus ring in XY plane (negative phase)
      const torusGeo = new THREE.TorusGeometry(1.1, 0.28, 16, 40);
      torusGeo.rotateX(Math.PI / 2);
      const torusMat = new THREE.MeshStandardMaterial({
        color: NEG_COLOR,
        roughness: 0.3,
        transparent: true,
        opacity: 0.85,
      });
      orbitalGroup.add(new THREE.Mesh(torusGeo, torusMat));
    } else if (selectedId === '3dx2y2' || selectedId === '3dxy') {
      const angles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
      const offset = selectedId === '3dxy' ? Math.PI / 4 : 0;
      angles.forEach((ang, idx) => {
        const color = idx % 2 === 0 ? POS_COLOR : NEG_COLOR;
        const lobe = createLobe(color, 0.7, 1.4, 0.7);
        lobe.rotation.z = ang + offset - Math.PI / 2;
        lobe.position.x = Math.cos(ang + offset) * 0.9;
        lobe.position.y = Math.sin(ang + offset) * 0.9;
        orbitalGroup.add(lobe);
      });
    } else if (selectedId === 'sp') {
      // 2 linear lobes (180°)
      const lobe1 = createLobe(POS_COLOR, 0.9, 1.8, 0.9);
      lobe1.rotation.z = -Math.PI / 2;
      lobe1.position.x = 0.9;
      const lobe2 = createLobe(POS_COLOR, 0.9, 1.8, 0.9);
      lobe2.rotation.z = Math.PI / 2;
      lobe2.position.x = -0.9;
      orbitalGroup.add(lobe1);
      orbitalGroup.add(lobe2);
    } else if (selectedId === 'sp2') {
      // 3 planar lobes (120°)
      const angles = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3];
      angles.forEach((ang) => {
        const lobe = createLobe(POS_COLOR, 0.8, 1.6, 0.8);
        lobe.rotation.z = ang - Math.PI / 2;
        lobe.position.x = Math.cos(ang) * 0.9;
        lobe.position.y = Math.sin(ang) * 0.9;
        orbitalGroup.add(lobe);
      });
    } else if (selectedId === 'sp3') {
      // 4 tetrahedral lobes (109.5°)
      const tetraDirs = [
        new THREE.Vector3(1, 1, 1).normalize(),
        new THREE.Vector3(-1, -1, 1).normalize(),
        new THREE.Vector3(-1, 1, -1).normalize(),
        new THREE.Vector3(1, -1, -1).normalize(),
      ];
      tetraDirs.forEach((dir) => {
        const lobe = createLobe(POS_COLOR, 0.75, 1.6, 0.75);
        const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        lobe.quaternion.copy(quat);
        lobe.position.copy(dir.clone().multiplyScalar(0.9));
        orbitalGroup.add(lobe);
      });
    } else if (selectedId === 'sp3d') {
      // 5 trigonal bipyramidal (3 equatorial 120°, 2 axial 90°)
      const dirs = [
        new THREE.Vector3(0, 1, 0), // Axial top
        new THREE.Vector3(0, -1, 0), // Axial bottom
        new THREE.Vector3(1, 0, 0), // Eq 1
        new THREE.Vector3(-0.5, 0, 0.866), // Eq 2
        new THREE.Vector3(-0.5, 0, -0.866), // Eq 3
      ];
      dirs.forEach((dir) => {
        const lobe = createLobe(POS_COLOR, 0.7, 1.5, 0.7);
        const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        lobe.quaternion.copy(quat);
        lobe.position.copy(dir.clone().multiplyScalar(0.9));
        orbitalGroup.add(lobe);
      });
    } else if (selectedId === 'sp3d2') {
      // 6 octahedral (along X, Y, Z axes)
      const dirs = [
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, -1, 0),
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0, 0, -1),
      ];
      dirs.forEach((dir) => {
        const lobe = createLobe(POS_COLOR, 0.7, 1.5, 0.7);
        const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        lobe.quaternion.copy(quat);
        lobe.position.copy(dir.clone().multiplyScalar(0.9));
        orbitalGroup.add(lobe);
      });
    }

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      controls.update();
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
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [selectedId, showAxes]);

  return (
    <div className="orbitals-container">
      {/* Header Card */}
      <div className="orbitals-header-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0284c7, #818cf8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
              }}
            >
              <Compass size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Eksplorasi Bentuk Orbital Elektron & Hibridisasi 3D
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Visualisasi 3D fungsi gelombang probabilitas elektron (s, p, d) dan teori hibridisasi ikatan kimia
              </span>
            </div>
          </div>

          <button
            className={`btn ${showAxes ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setShowAxes(!showAxes)}
            style={{ fontSize: '12px', gap: '6px' }}
          >
            <Eye size={14} />
            {showAxes ? 'Sembunyikan Sumbu Koordinat' : 'Tampilkan Sumbu (X, Y, Z)'}
          </button>
        </div>

        {/* Category Pills Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Pilih Orbital / Hibridisasi:
          </span>
          {ORBITAL_CATALOG.map((orb) => {
            const isActive = orb.id === selectedId;
            return (
              <button
                key={orb.id}
                className={`preset-chip ${isActive ? 'active' : ''}`}
                style={
                  isActive
                    ? { background: '#0284c7', color: '#ffffff', borderColor: '#0284c7' }
                    : {}
                }
                onClick={() => setSelectedId(orb.id)}
              >
                {orb.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Info Sidebar + 3D Viewport */}
      <div className="orbitals-grid">
        {/* Left Information Card */}
        <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontSize: '16px', fontWeight: 700 }}>
            <Sparkles size={18} color="#0284c7" />
            Parameter Fisika Kuantum
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ color: 'var(--text-muted)' }}>Bilangan Kuantum:</span>
              <strong style={{ fontFamily: 'var(--font-mono)' }}>{selectedOrbital.quantumNumbers}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ color: 'var(--text-muted)' }}>Bentuk Ruang:</span>
              <strong>{selectedOrbital.shape}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ color: 'var(--text-muted)' }}>Bidang Simpul (Nodal):</span>
              <strong>{selectedOrbital.nodalPlanes}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ color: 'var(--text-muted)' }}>Kapasitas Elektron Maks:</span>
              <strong style={{ color: '#0284c7' }}>{selectedOrbital.maxElectrons} elektron (Pauli)</strong>
            </div>
          </div>

          <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Deskripsi Fisis:
            </span>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              {selectedOrbital.description}
            </p>
          </div>

          <div style={{ padding: '12px', background: '#f0f9ff', borderRadius: '10px', border: '1px solid #bae6fd', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase' }}>
              Contoh Senyawa Kimia:
            </span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {selectedOrbital.examples}
            </span>
          </div>
        </div>

        {/* Right 3D Viewport */}
        <div ref={containerRef} className="orbital-viewport">
          <Scene3DHint storageKey="chem_orbital_hint_seen" customText="Geser kursor / sentuh untuk mengamati fungsi gelombang orbital 3D" />

          {/* Top-left HUD info */}
          <div className="orbital-hud-info">
            <h3>{selectedOrbital.name}</h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{selectedOrbital.shape}</span>
            <div className="phase-legend-bar">
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className="phase-dot" style={{ backgroundColor: '#0284c7' }} />
                Fase Positif (+)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className="phase-dot" style={{ backgroundColor: '#f97316' }} />
                Fase Negatif (-)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
