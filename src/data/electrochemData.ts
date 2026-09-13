// Data for Standard Reduction Potentials (E° in Volts) & Electrochemical Series (Deret Volta)

export interface RedoxCouple {
  id: string;
  metal: string;
  nameId: string;
  symbol: string;
  ion: string;
  electronCount: number;
  standardPotential: number; // in Volts
  color: string; // Color of electrode bar
  solutionColor: string; // Color of electrolyte solution
  solutionName: string;
}

export const REDOX_COUPLES: RedoxCouple[] = [
  {
    id: 'li',
    metal: 'Litium',
    nameId: 'Litium (Li)',
    symbol: 'Li',
    ion: 'Li⁺',
    electronCount: 1,
    standardPotential: -3.04,
    color: '#94a3b8',
    solutionColor: 'rgba(241, 245, 249, 0.4)',
    solutionName: 'LiNO₃ 1.0 M',
  },
  {
    id: 'k',
    metal: 'Kalium',
    nameId: 'Kalium (K)',
    symbol: 'K',
    ion: 'K⁺',
    electronCount: 1,
    standardPotential: -2.93,
    color: '#cbd5e1',
    solutionColor: 'rgba(241, 245, 249, 0.4)',
    solutionName: 'KNO₃ 1.0 M',
  },
  {
    id: 'ca',
    metal: 'Kalsium',
    nameId: 'Kalsium (Ca)',
    symbol: 'Ca',
    ion: 'Ca²⁺',
    electronCount: 2,
    standardPotential: -2.87,
    color: '#e2e8f0',
    solutionColor: 'rgba(241, 245, 249, 0.4)',
    solutionName: 'Ca(NO₃)₂ 1.0 M',
  },
  {
    id: 'na',
    metal: 'Natrium',
    nameId: 'Natrium (Na)',
    symbol: 'Na',
    ion: 'Na⁺',
    electronCount: 1,
    standardPotential: -2.71,
    color: '#cbd5e1',
    solutionColor: 'rgba(241, 245, 249, 0.4)',
    solutionName: 'NaCl 1.0 M',
  },
  {
    id: 'mg',
    metal: 'Magnesium',
    nameId: 'Magnesium (Mg)',
    symbol: 'Mg',
    ion: 'Mg²⁺',
    electronCount: 2,
    standardPotential: -2.37,
    color: '#94a3b8',
    solutionColor: 'rgba(241, 245, 249, 0.4)',
    solutionName: 'MgSO₄ 1.0 M',
  },
  {
    id: 'al',
    metal: 'Aluminium',
    nameId: 'Aluminium (Al)',
    symbol: 'Al',
    ion: 'Al³⁺',
    electronCount: 3,
    standardPotential: -1.66,
    color: '#cbd5e1',
    solutionColor: 'rgba(241, 245, 249, 0.4)',
    solutionName: 'Al(NO₃)₃ 1.0 M',
  },
  {
    id: 'zn',
    metal: 'Seng',
    nameId: 'Seng (Zn)',
    symbol: 'Zn',
    ion: 'Zn²⁺',
    electronCount: 2,
    standardPotential: -0.76,
    color: '#94a3b8',
    solutionColor: 'rgba(241, 245, 249, 0.4)',
    solutionName: 'ZnSO₄ 1.0 M',
  },
  {
    id: 'fe',
    metal: 'Besi',
    nameId: 'Besi (Fe)',
    symbol: 'Fe',
    ion: 'Fe²⁺',
    electronCount: 2,
    standardPotential: -0.44,
    color: '#64748b',
    solutionColor: 'rgba(187, 247, 208, 0.4)', // Pucat kehijauan Fe2+
    solutionName: 'FeSO₄ 1.0 M',
  },
  {
    id: 'ni',
    metal: 'Nikel',
    nameId: 'Nikel (Ni)',
    symbol: 'Ni',
    ion: 'Ni²⁺',
    electronCount: 2,
    standardPotential: -0.25,
    color: '#475569',
    solutionColor: 'rgba(134, 239, 172, 0.4)', // Hijau zamrud Ni2+
    solutionName: 'NiSO₄ 1.0 M',
  },
  {
    id: 'sn',
    metal: 'Timah',
    nameId: 'Timah (Sn)',
    symbol: 'Sn',
    ion: 'Sn²⁺',
    electronCount: 2,
    standardPotential: -0.14,
    color: '#94a3b8',
    solutionColor: 'rgba(241, 245, 249, 0.4)',
    solutionName: 'SnCl₂ 1.0 M',
  },
  {
    id: 'pb',
    metal: 'Timbal',
    nameId: 'Timbal (Pb)',
    symbol: 'Pb',
    ion: 'Pb²⁺',
    electronCount: 2,
    standardPotential: -0.13,
    color: '#475569',
    solutionColor: 'rgba(241, 245, 249, 0.4)',
    solutionName: 'Pb(NO₃)₂ 1.0 M',
  },
  {
    id: 'h2',
    metal: 'Hidrogen (SHE)',
    nameId: 'Hidrogen (Standar)',
    symbol: 'H₂',
    ion: 'H⁺',
    electronCount: 1,
    standardPotential: 0.00,
    color: '#38bdf8',
    solutionColor: 'rgba(224, 242, 254, 0.4)',
    solutionName: 'HCl 1.0 M (SHE)',
  },
  {
    id: 'cu',
    metal: 'Tembaga',
    nameId: 'Tembaga (Cu)',
    symbol: 'Cu',
    ion: 'Cu²⁺',
    electronCount: 2,
    standardPotential: 0.34,
    color: '#d97706', // Cokelat tembaga
    solutionColor: 'rgba(56, 189, 248, 0.45)', // Biru khas CuSO4
    solutionName: 'CuSO₄ 1.0 M',
  },
  {
    id: 'ag',
    metal: 'Perak',
    nameId: 'Perak (Ag)',
    symbol: 'Ag',
    ion: 'Ag⁺',
    electronCount: 1,
    standardPotential: 0.80,
    color: '#e2e8f0', // Mengkilap perak
    solutionColor: 'rgba(241, 245, 249, 0.4)',
    solutionName: 'AgNO₃ 1.0 M',
  },
  {
    id: 'au',
    metal: 'Emas',
    nameId: 'Emas (Au)',
    symbol: 'Au',
    ion: 'Au³⁺',
    electronCount: 3,
    standardPotential: 1.50,
    color: '#eab308', // Kuning emas
    solutionColor: 'rgba(254, 240, 138, 0.45)',
    solutionName: 'AuCl₃ 1.0 M',
  },
];

export interface CellPreset {
  name: string;
  anodeId: string;
  cathodeId: string;
  description: string;
  application: string;
}

export const CELL_PRESETS: CellPreset[] = [
  {
    name: 'Sel Daniell (Zn - Cu)',
    anodeId: 'zn',
    cathodeId: 'cu',
    description: 'Sel elektrokimia klasik penemuan John Frederic Daniell (1836) dengan tegangan stabil 1.10 V.',
    application: 'Telegraf awal abad ke-19 dan standar pengajaran elektrokimia dunia.',
  },
  {
    name: 'Baterai Seng - Perak (Zn - Ag)',
    anodeId: 'zn',
    cathodeId: 'ag',
    description: 'Menghasilkan potensial sel tinggi +1.56 V dengan kerapatan energi sangat tinggi.',
    application: 'Baterai kancing jam tangan, alat bantu dengar, dan peralatan luar angkasa NASA Apollo.',
  },
  {
    name: 'Sel Magnesium - Tembaga (Mg - Cu)',
    anodeId: 'mg',
    cathodeId: 'cu',
    description: 'Sel dengan beda potensial sangat tinggi (+2.71 V) memanfaatkan logam magnesium yang sangat elektropositif.',
    application: 'Baterai air laut dan sistem katodik proteksi kapal laut.',
  },
  {
    name: 'Sel Aluminium - Nikel (Al - Ni)',
    anodeId: 'al',
    cathodeId: 'ni',
    description: 'Sel tegangan moderat (+1.41 V) dengan elektroda logam ringan industri.',
    application: 'Penelitian baterai logam-udara generasi berikutnya.',
  },
  {
    name: 'Sel Besi - Tembaga (Fe - Cu)',
    anodeId: 'fe',
    cathodeId: 'cu',
    description: 'Model korosi galvanik di mana besi terkorosi lebih cepat saat bersentuhan dengan tembaga (+0.78 V).',
    application: 'Studi pencegahan korosi pipa air bawah tanah dan lambung kapal.',
  },
];
