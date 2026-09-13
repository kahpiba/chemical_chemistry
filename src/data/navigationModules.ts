import type { ActiveTab } from '../components/common/Header';

export interface NavModuleItem {
  id: ActiveTab;
  title: string;
  shortDesc: string;
  badge?: string;
  iconName: string;
}

export interface NavCategoryGroup {
  id: 'structure' | 'reaction' | 'physchem' | 'assessment';
  title: string;
  icon: string;
  items: NavModuleItem[];
}

export const NAV_CATEGORIES: NavCategoryGroup[] = [
  {
    id: 'structure',
    title: 'Struktur & Molekul',
    icon: 'Atom',
    items: [
      {
        id: 'periodic',
        title: 'Tabel Periodik 118 Unsur',
        shortDesc: 'Model atom 3D Bohr, kulit elektron & standar NFPA 704',
        badge: 'Bohr 3D',
        iconName: 'Layers',
      },
      {
        id: 'molecules',
        title: 'Molekul 3D & Perancang Kustom',
        shortDesc: 'Eksplorasi ikatan kimia, urai struktur & tolakan sterik',
        badge: 'Interaktif',
        iconName: 'Boxes',
      },
      {
        id: 'chains',
        title: 'Rantai Kimia & Spektra IR',
        shortDesc: '8 deret homolog organik, polimer & spektrofotometri FTIR',
        badge: 'Organik',
        iconName: 'GitCommit',
      },
      {
        id: 'orbitals',
        title: 'Orbital 3D & Hibridisasi',
        shortDesc: 'Awan elektron kuantum s, p, d & hibridisasi ikatan',
        badge: 'Kuantum',
        iconName: 'Compass',
      },
    ],
  },
  {
    id: 'reaction',
    title: 'Lab & Reaksi',
    icon: 'FlaskConical',
    items: [
      {
        id: 'reactions',
        title: 'Virtual Reaction Lab',
        shortDesc: 'Simulasi pencampuran reagen nyata & bahaya gas beracun',
        badge: 'Bahaya Nyata',
        iconName: 'FlaskConical',
      },
      {
        id: 'titration',
        title: 'Titrasi Burette Presisi',
        shortDesc: 'Aparatus buret kaca, kran stopcock & kurva sigmoid pH',
        badge: 'Analitik',
        iconName: 'Pipette',
      },
      {
        id: 'stoichiometry',
        title: 'Penyetara Reaksi Cerdas',
        shortDesc: 'Matriks Gauss-Jordan & pereaksi pembatas stoikiometri',
        badge: 'Matematis',
        iconName: 'Scale',
      },
      {
        id: 'flame',
        title: 'Uji Nyala Api Bunsen',
        shortDesc: 'Spektra emisi nyala logam alkali & alkali tanah',
        badge: 'Spektroskopi',
        iconName: 'Flame',
      },
    ],
  },
  {
    id: 'physchem',
    title: 'Fisika Kimia & Larutan',
    icon: 'Droplets',
    items: [
      {
        id: 'solutions',
        title: 'Larutan & pH Penyangga',
        shortDesc: 'Pengenceran M₁V₁=M₂V₂, Henderson-Hasselbalch & hidrolisis',
        badge: 'Kalkulator',
        iconName: 'Droplets',
      },
      {
        id: 'equilibrium',
        title: 'Kesetimbangan Kimia',
        shortDesc: 'Piston gas dinamis, Asas Le Chatelier & energi aktivasi Ea',
        badge: 'Termodinamika',
        iconName: 'Repeat',
      },
      {
        id: 'electrochem',
        title: 'Lab Sel Elektrokimia',
        shortDesc: 'Sel volta spontan, aliran elektron & potensial reduksi E°',
        badge: 'Sel Volta',
        iconName: 'Zap',
      },
    ],
  },
  {
    id: 'assessment',
    title: 'Asesmen & Eksplorasi',
    icon: 'Trophy',
    items: [
      {
        id: 'quests',
        title: 'Detektif Kimia',
        shortDesc: 'Misi investigasi kualitatif misteri senyawa & skor reward',
        badge: 'Misi Lab',
        iconName: 'Sparkles',
      },
      {
        id: 'compare',
        title: 'Radar Pembanding Unsur',
        shortDesc: 'Komparasi multi-parameter 2 unsur kimia side-by-side',
        badge: 'Analisis',
        iconName: 'ArrowLeftRight',
      },
      {
        id: 'quiz',
        title: 'Quiz Arena Sains',
        shortDesc: 'Evaluasi pemahaman konsep kimia berwaktu & peringkat',
        badge: 'Kompetisi',
        iconName: 'Trophy',
      },
    ],
  },
];

export function getModuleCategory(tab: ActiveTab): NavCategoryGroup {
  for (const cat of NAV_CATEGORIES) {
    if (cat.items.some((item) => item.id === tab)) {
      return cat;
    }
  }
  return NAV_CATEGORIES[0];
}

export function getModuleInfo(tab: ActiveTab): NavModuleItem {
  for (const cat of NAV_CATEGORIES) {
    const found = cat.items.find((item) => item.id === tab);
    if (found) return found;
  }
  return NAV_CATEGORIES[0].items[0];
}
