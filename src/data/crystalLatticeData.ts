export interface LatticeAtom {
  element: string;
  name: string;
  color: string;
  radius: number;
  position: [number, number, number]; // Normalized coordinate relative to origin
}

export interface LatticeBond {
  fromIndex: number;
  toIndex: number;
  isVanDerWaals?: boolean;
}

export interface CrystalLattice {
  id: string;
  name: string;
  formula: string;
  system: string; // e.g. Kubik (FCC), Heksagonal
  bravais: string; // e.g. Face-Centered Cubic
  spaceGroup: string; // e.g. Fm-3m
  coordinationNumber: string; // e.g. "6 : 6"
  apf: string; // Atomic Packing Factor e.g. "67%" or "74%"
  atomsPerUnitCell: string; // e.g. "4 Na⁺ + 4 Cl⁻"
  latticeParams: {
    a: string;
    b: string;
    c: string;
    angles: string;
  };
  description: string;
  scientificSignificance: string;
  atoms: LatticeAtom[];
  bonds: LatticeBond[];
}

// Generate NaCl unit cell (FCC rock salt structure)
// Scale unit cell size L = 2.0 (-1.0 to 1.0)
const generateNaCl = (): { atoms: LatticeAtom[]; bonds: LatticeBond[] } => {
  const atoms: LatticeAtom[] = [];
  const bonds: LatticeBond[] = [];
  const coords = [-1, 0, 1];

  coords.forEach((x) => {
    coords.forEach((y) => {
      coords.forEach((z) => {
        // Alternating sum of indices determines whether it's Na+ or Cl-
        const isNa = (x + y + z + 3) % 2 === 1;
        atoms.push({
          element: isNa ? 'Na⁺' : 'Cl⁻',
          name: isNa ? 'Kation Natrium' : 'Anion Klorida',
          color: isNa ? '#818cf8' : '#22c55e',
          radius: isNa ? 0.22 : 0.36,
          position: [x * 1.0, y * 1.0, z * 1.0],
        });
      });
    });
  });

  // Connect adjacent neighbor atoms (distance = 1.0)
  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
      const p1 = atoms[i].position;
      const p2 = atoms[j].position;
      const distSq = (p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2 + (p1[2] - p2[2]) ** 2;
      if (Math.abs(distSq - 1.0) < 0.05) {
        bonds.push({ fromIndex: i, toIndex: j });
      }
    }
  }

  return { atoms, bonds };
};

// Generate Diamond unit cell (Giant Covalent network)
const generateDiamond = (): { atoms: LatticeAtom[]; bonds: LatticeBond[] } => {
  const atoms: LatticeAtom[] = [];
  const bonds: LatticeBond[] = [];

  // FCC points for Carbon (-1 to 1)
  const fccPoints: [number, number, number][] = [
    // Corners
    [-1, -1, -1], [1, -1, -1], [-1, 1, -1], [1, 1, -1],
    [-1, -1, 1], [1, -1, 1], [-1, 1, 1], [1, 1, 1],
    // Face centers
    [0, -1, 0], [0, 1, 0], [-1, 0, 0], [1, 0, 0], [0, 0, -1], [0, 0, 1],
    // 4 Interpenetrating tetrahedral sub-lattice points (at quarter positions)
    [-0.5, -0.5, -0.5], [0.5, 0.5, -0.5], [-0.5, 0.5, 0.5], [0.5, -0.5, 0.5]
  ];

  fccPoints.forEach(([x, y, z]) => {
    atoms.push({
      element: 'C',
      name: 'Karbon sp³',
      color: '#475569',
      radius: 0.26,
      position: [x * 1.1, y * 1.1, z * 1.1],
    });
  });

  // Tetrahedral bonds to adjacent carbons
  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
      const p1 = atoms[i].position;
      const p2 = atoms[j].position;
      const dist = Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2 + (p1[2] - p2[2]) ** 2);
      if (dist >= 0.8 && dist <= 1.05) {
        bonds.push({ fromIndex: i, toIndex: j });
      }
    }
  }

  return { atoms, bonds };
};

// Generate Graphite (2 layers of hexagonal graphene sheets)
const generateGraphite = (): { atoms: LatticeAtom[]; bonds: LatticeBond[] } => {
  const atoms: LatticeAtom[] = [];
  const bonds: LatticeBond[] = [];

  const layerY = [-0.75, 0.75]; // Two layers separated by van der Waals gap

  layerY.forEach((y, layerIdx) => {
    const shiftX = layerIdx === 1 ? 0.35 : 0;
    const shiftZ = layerIdx === 1 ? 0.2 : 0;
    const ringCenters = [
      [-0.7, -0.7], [0.7, -0.7],
      [-0.7, 0.7], [0.7, 0.7],
      [0, 0]
    ];

    const r = 0.55;
    const createdInLayer: number[] = [];

    ringCenters.forEach(([cx, cz]) => {
      for (let k = 0; k < 6; k++) {
        const angle = (k * Math.PI) / 3;
        const x = cx + shiftX + r * Math.cos(angle);
        const z = cz + shiftZ + r * Math.sin(angle);

        // Check if point already exists nearby
        const existing = atoms.findIndex(
          (a) =>
            Math.abs(a.position[1] - y) < 0.1 &&
            (a.position[0] - x) ** 2 + (a.position[2] - z) ** 2 < 0.04
        );

        if (existing === -1) {
          atoms.push({
            element: 'C',
            name: 'Karbon sp²',
            color: layerIdx === 0 ? '#334155' : '#475569',
            radius: 0.24,
            position: [x, y, z],
          });
          createdInLayer.push(atoms.length - 1);
        }
      }
    });

    // In-plane covalent bonds
    for (let i = 0; i < createdInLayer.length; i++) {
      for (let j = i + 1; j < createdInLayer.length; j++) {
        const idx1 = createdInLayer[i];
        const idx2 = createdInLayer[j];
        const p1 = atoms[idx1].position;
        const p2 = atoms[idx2].position;
        const dist = Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[2] - p2[2]) ** 2);
        if (dist >= 0.45 && dist <= 0.65) {
          bonds.push({ fromIndex: idx1, toIndex: idx2 });
        }
      }
    }
  });

  return { atoms, bonds };
};

// Generate Iron (alpha-Fe BCC)
const generateIronBCC = (): { atoms: LatticeAtom[]; bonds: LatticeBond[] } => {
  const atoms: LatticeAtom[] = [];
  const bonds: LatticeBond[] = [];

  // Corners of cubic unit cell (-1 to 1)
  const corners: [number, number, number][] = [
    [-1, -1, -1], [1, -1, -1], [-1, 1, -1], [1, 1, -1],
    [-1, -1, 1], [1, -1, 1], [-1, 1, 1], [1, 1, 1],
  ];

  corners.forEach(([x, y, z]) => {
    atoms.push({
      element: 'Fe',
      name: 'Besi Sudut (Fe)',
      color: '#64748b',
      radius: 0.32,
      position: [x * 1.1, y * 1.1, z * 1.1],
    });
  });

  // Body center atom
  atoms.push({
    element: 'Fe',
    name: 'Besi Pusat Badan (Fe)',
    color: '#0284c7', // highlighted center
    radius: 0.36,
    position: [0, 0, 0],
  });

  // Bonds from center (index 8) to all 8 corners
  const centerIdx = 8;
  for (let i = 0; i < 8; i++) {
    bonds.push({ fromIndex: centerIdx, toIndex: i });
  }

  // Unit cell edge wireframe bonds
  const edgePairs = [
    [0, 1], [1, 3], [3, 2], [2, 0], // bottom face
    [4, 5], [5, 7], [7, 6], [6, 4], // top face
    [0, 4], [1, 5], [2, 6], [3, 7], // vertical pillars
  ];
  edgePairs.forEach(([from, to]) => {
    bonds.push({ fromIndex: from, toIndex: to, isVanDerWaals: true });
  });

  return { atoms, bonds };
};

// Generate Copper (Cu FCC)
const generateCopperFCC = (): { atoms: LatticeAtom[]; bonds: LatticeBond[] } => {
  const atoms: LatticeAtom[] = [];
  const bonds: LatticeBond[] = [];

  // 8 Corners
  const corners: [number, number, number][] = [
    [-1, -1, -1], [1, -1, -1], [-1, 1, -1], [1, 1, -1],
    [-1, -1, 1], [1, -1, 1], [-1, 1, 1], [1, 1, 1],
  ];
  corners.forEach(([x, y, z]) => {
    atoms.push({
      element: 'Cu',
      name: 'Tembaga Sudut',
      color: '#ea580c',
      radius: 0.32,
      position: [x * 1.1, y * 1.1, z * 1.1],
    });
  });

  // 6 Face Centers
  const faces: [number, number, number][] = [
    [0, -1, 0], [0, 1, 0],
    [-1, 0, 0], [1, 0, 0],
    [0, 0, -1], [0, 0, 1],
  ];
  faces.forEach(([x, y, z]) => {
    atoms.push({
      element: 'Cu',
      name: 'Tembaga Pusat Muka',
      color: '#f97316',
      radius: 0.34,
      position: [x * 1.1, y * 1.1, z * 1.1],
    });
  });

  // Bonds connecting face-centers to corners
  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
      const p1 = atoms[i].position;
      const p2 = atoms[j].position;
      const dist = Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2 + (p1[2] - p2[2]) ** 2);
      if (dist >= 1.4 && dist <= 1.65) {
        bonds.push({ fromIndex: i, toIndex: j });
      }
    }
  }

  return { atoms, bonds };
};

// Generate Hexagonal Ice (H2O Ih open cage)
const generateIce = (): { atoms: LatticeAtom[]; bonds: LatticeBond[] } => {
  const atoms: LatticeAtom[] = [];
  const bonds: LatticeBond[] = [];

  // Six-membered ring of water molecules forming an open hexagonal cage
  const ringAngles = [0, 60, 120, 180, 240, 300].map((deg) => (deg * Math.PI) / 180);
  const r = 1.1;

  ringAngles.forEach((angle, i) => {
    const ox = r * Math.cos(angle);
    const oz = r * Math.sin(angle);
    const oy = (i % 2 === 0 ? 0.25 : -0.25);

    const oIdx = atoms.length;
    atoms.push({
      element: 'O',
      name: 'Oksigen (Es)',
      color: '#ef4444',
      radius: 0.32,
      position: [ox, oy, oz],
    });

    // Attached Hydrogen
    const h1Angle = angle + 0.3;
    atoms.push({
      element: 'H',
      name: 'Hidrogen',
      color: '#f8fafc',
      radius: 0.18,
      position: [ox + 0.35 * Math.cos(h1Angle), oy - 0.2, oz + 0.35 * Math.sin(h1Angle)],
    });
    bonds.push({ fromIndex: oIdx, toIndex: oIdx + 1 });
  });

  // Hexagonal O-O hydrogen bond ring
  for (let i = 0; i < 6; i++) {
    const next = (i + 1) % 6;
    bonds.push({ fromIndex: i * 2, toIndex: next * 2, isVanDerWaals: true });
  }

  return { atoms, bonds };
};

const naclData = generateNaCl();
const diamondData = generateDiamond();
const graphiteData = generateGraphite();
const ironData = generateIronBCC();
const copperData = generateCopperFCC();
const iceData = generateIce();

export const CRYSTAL_LATTICES: CrystalLattice[] = [
  {
    id: 'nacl',
    name: 'Garam Dapur (Natrium Klorida)',
    formula: 'NaCl',
    system: 'Kubik (Cubic)',
    bravais: 'Face-Centered Cubic (FCC)',
    spaceGroup: 'Fm-3m (#225)',
    coordinationNumber: '6 : 6 (Oktahedral)',
    apf: '67.0% (Efisiensi Pengepakan)',
    atomsPerUnitCell: '4 Na⁺ + 4 Cl⁻ = 4 Rumus NaCl',
    latticeParams: {
      a: '5.64 Å',
      b: '5.64 Å',
      c: '5.64 Å',
      angles: 'α = β = γ = 90°',
    },
    description:
      'Kisi batuan garam (rock salt) klasik di mana kation Na⁺ berukuran kecil menempati seluruh rongga oktahedral yang dibentuk oleh kemasan rapat kubus anion Cl⁻ yang lebih besar.',
    scientificSignificance:
      'Model fundamental kristal ionik padat dengan gaya elektrostatis Coulomb yang sangat kuat, menghasilkan titik leleh tinggi (801 °C) dan sifat rapuh terbelah sepanjang bidang kristal (cleavage plane).',
    atoms: naclData.atoms,
    bonds: naclData.bonds,
  },
  {
    id: 'diamond',
    name: 'Intan / Berlian (Diamond)',
    formula: 'C (Alotrop Karbon)',
    system: 'Kubik Intan (Diamond Cubic)',
    bravais: 'Face-Centered Cubic dengan Motif 2-Atom',
    spaceGroup: 'Fd-3m (#227)',
    coordinationNumber: '4 (Tetrahedral)',
    apf: '34.0% (Struktur Sangkar Terbuka Kokoh)',
    atomsPerUnitCell: '8 Atom Karbon per Sel Satuan',
    latticeParams: {
      a: '3.57 Å',
      b: '3.57 Å',
      c: '3.57 Å',
      angles: 'α = β = γ = 90°',
    },
    description:
      'Setiap atom karbon terhibridisasi sp³ dan berikatan kovalen sempurna dengan 4 atom tetangga pada sudut ikatan 109.5° membentuk jaringan raksasa 3D yang sangat kuat.',
    scientificSignificance:
      'Material alami terkeras di bumi (Skala Mohs 10) dengan konduktivitas termal tertinggi namun merupakan isolator listrik sempurna karena tidak memiliki elektron valensi bebas.',
    atoms: diamondData.atoms,
    bonds: diamondData.bonds,
  },
  {
    id: 'graphite',
    name: 'Grafit (Graphite)',
    formula: 'C (Alotrop Karbon Berlapis)',
    system: 'Heksagonal (Hexagonal)',
    bravais: 'Heksagonal Primitif',
    spaceGroup: 'P6₃/mmc (#194)',
    coordinationNumber: '3 dalam lapisan (Planar Trigonal)',
    apf: '17.0% (Densitas Ruang Rendah karena Celah Antarlapis)',
    atomsPerUnitCell: '4 Atom Karbon per Sel Satuan',
    latticeParams: {
      a: '2.46 Å',
      b: '2.46 Å',
      c: '6.71 Å (Jarak Lapis 3.35 Å)',
      angles: 'α = β = 90°, γ = 120°',
    },
    description:
      'Tersusun atas lembaran-lembaran cincin heksagonal karbon sp² (graphene) yang sangat kuat dalam bidang 2D, namun hanya dihubungkan oleh gaya dispersi Van der Waals yang lemah antarlapisan.',
    scientificSignificance:
      'Lapisan dapat saling bergeser dengan mudah (menjadikannya pelumas kering dan bahan pensil) serta mampu menghantarkan listrik dengan sangat baik karena delokalisasi elektron π.',
    atoms: graphiteData.atoms,
    bonds: graphiteData.bonds,
  },
  {
    id: 'iron_bcc',
    name: 'Besi Alfa (α-Ferrite)',
    formula: 'Fe',
    system: 'Kubik (Cubic)',
    bravais: 'Body-Centered Cubic (BCC)',
    spaceGroup: 'Im-3m (#229)',
    coordinationNumber: '8 (Kubus Pusat)',
    apf: '68.0% (BCC Packing)',
    atomsPerUnitCell: '2 Atom Besi (8×⅛ sudut + 1 pusat)',
    latticeParams: {
      a: '2.87 Å',
      b: '2.87 Å',
      c: '2.87 Å',
      angles: 'α = β = γ = 90°',
    },
    description:
      'Bentuk allotrop stabil dari besi murni pada suhu ruang (< 912 °C). Memiliki satu atom tepat di pusat kubus dan 8 atom di setiap sudut kubus.',
    scientificSignificance:
      'Fasa feromagnetik pada suhu kamar yang menjadi basis baja karbon struktural dalam rekayasa metalurgi dan konstruksi modern.',
    atoms: ironData.atoms,
    bonds: ironData.bonds,
  },
  {
    id: 'copper_fcc',
    name: 'Tembaga Murni (Copper)',
    formula: 'Cu',
    system: 'Kubik (Cubic)',
    bravais: 'Face-Centered Cubic (FCC / CCP)',
    spaceGroup: 'Fm-3m (#225)',
    coordinationNumber: '12 (Paling Rapat)',
    apf: '74.0% (Kerapatan Kemasan Maksimum Teoritis)',
    atomsPerUnitCell: '4 Atom Tembaga (8×⅛ sudut + 6×½ muka)',
    latticeParams: {
      a: '3.61 Å',
      b: '3.61 Å',
      c: '3.61 Å',
      angles: 'α = β = γ = 90°',
    },
    description:
      'Struktur kemasan rapat kubus berpusat muka (FCC) di mana setiap atom tembaga bersentuhan langsung dengan 12 atom tetangga terdekatnya.',
    scientificSignificance:
      'Memiliki banyak bidang slip kristalografi {111} sehingga tembaga sangat ulet (ductile), mudah ditempa menjadi kawat halus, dan memiliki konduktivitas listrik luar biasa tinggi.',
    atoms: copperData.atoms,
    bonds: copperData.bonds,
  },
  {
    id: 'ice_ih',
    name: 'Es Batu (Hexagonal Ice Ih)',
    formula: 'H₂O (Padat)',
    system: 'Heksagonal',
    bravais: 'Heksagonal Berongga (Open Cage)',
    spaceGroup: 'P6₃/mmc',
    coordinationNumber: '4 (Ikatan Hidrogen Tetrahedral)',
    apf: 'Terbuka / Berongga (Porus Mikro)',
    atomsPerUnitCell: '4 Molekul H₂O per Sel Satuan',
    latticeParams: {
      a: '4.52 Å',
      b: '4.52 Å',
      c: '7.36 Å',
      angles: 'α = β = 90°, γ = 120°',
    },
    description:
      'Molekul air tertata dalam geometri sangkar heksagonal terbuka yang diikat oleh ikatan hidrogen O-H···O yang kaku pada suhu di bawah 0 °C.',
    scientificSignificance:
      'Menjelaskan anomali fisika air di mana es padat memiliki massa jenis lebih rendah (0.917 g/cm³) daripada air cair (1.0 g/cm³), menyebabkan es mengapung dan danau membeku dari permukaan atas ke bawah.',
    atoms: iceData.atoms,
    bonds: iceData.bonds,
  },
];
