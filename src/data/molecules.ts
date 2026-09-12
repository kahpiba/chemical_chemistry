export interface MoleculeAtom {
  id: string;
  element: string;
  name: string;
  color: string;
  radius: number;
  position: [number, number, number];
  explodedOffset: [number, number, number];
  charge?: string;
}

export interface MoleculeBond {
  atomA: number;
  atomB: number;
  order: 1 | 2 | 3;
}

export type MoleculeCategory = 'simple' | 'acid_base' | 'ionic_salt' | 'organic_bio';

export interface MoleculeData {
  id: string;
  name: string;
  nameId: string;
  formula: string;
  category: MoleculeCategory;
  molarMass: number;
  geometry: string;
  polarity: 'Polar' | 'Non-polar' | 'Ionik' | 'Sangat Polar' | 'Polar Moderat';
  description: string;
  realWorldUsage: string;
  safetyNotes: string;
  atoms: MoleculeAtom[];
  bonds: MoleculeBond[];
}

export const MOLECULE_CATEGORIES: Record<MoleculeCategory, { name: string; nameId: string; color: string }> = {
  simple: { name: 'Simple Molecules', nameId: 'Molekul Sederhana', color: '#38bdf8' },
  acid_base: { name: 'Acids & Bases', nameId: 'Asam & Basa', color: '#f43f5e' },
  ionic_salt: { name: 'Ionic Salts', nameId: 'Garam & Kristal Ionik', color: '#10b981' },
  organic_bio: { name: 'Organic & Bio', nameId: 'Organik & Hayati', color: '#fbbf24' },
};

export const MOLECULES: MoleculeData[] = [
  {
    id: 'water',
    name: 'Water',
    nameId: 'Air',
    formula: 'H₂O',
    category: 'simple',
    molarMass: 18.015,
    geometry: 'Bengkok (Bent, 104.5°)',
    polarity: 'Polar',
    description: 'Pelarut universal kehidupan. Memiliki ikatan hidrogen yang menghasilkan tegangan permukaan tinggi dan anomali densitas es yang mengapung di atas air cair.',
    realWorldUsage: 'Esensial bagi seluruh organisme hidup, pendingin reaktor, dan media transportasi biokimia seluler.',
    safetyNotes: 'Non-toksik, aman dikonsumsi.',
    atoms: [
      { id: 'O-1', element: 'O', name: 'Oksigen', color: '#ef4444', radius: 0.38, position: [0, 0.12, 0], explodedOffset: [0, 0.6, 0], charge: 'δ⁻' },
      { id: 'H-1', element: 'H', name: 'Hidrogen', color: '#cbd5e1', radius: 0.25, position: [-0.76, -0.48, 0], explodedOffset: [-1.2, -0.8, 0], charge: 'δ⁺' },
      { id: 'H-2', element: 'H', name: 'Hidrogen', color: '#cbd5e1', radius: 0.25, position: [0.76, -0.48, 0], explodedOffset: [1.2, -0.8, 0], charge: 'δ⁺' },
    ],
    bonds: [
      { atomA: 0, atomB: 1, order: 1 },
      { atomA: 0, atomB: 2, order: 1 },
    ],
  },
  {
    id: 'carbon-dioxide',
    name: 'Carbon Dioxide',
    nameId: 'Karbon Dioksida',
    formula: 'CO₂',
    category: 'simple',
    molarMass: 44.01,
    geometry: 'Linier (180°)',
    polarity: 'Non-polar',
    description: 'Gas rumah kaca alami dengan geometri linier sempurna. Momen dipol ikatan C=O saling meniadakan sehingga molekul bersifat non-polar secara keseluruhan.',
    realWorldUsage: 'Bahan baku fotosintesis tumbuhan, gas karbonasi minuman soda, dan pemadam kebakaran CO₂.',
    safetyNotes: 'Asfiksian pada konsentrasi tinggi (>5%), gas bertekanan.',
    atoms: [
      { id: 'C-1', element: 'C', name: 'Karbon', color: '#334155', radius: 0.36, position: [0, 0, 0], explodedOffset: [0, 0.7, 0], charge: 'δ⁺' },
      { id: 'O-1', element: 'O', name: 'Oksigen', color: '#ef4444', radius: 0.35, position: [-1.16, 0, 0], explodedOffset: [-1.6, 0, 0], charge: 'δ⁻' },
      { id: 'O-2', element: 'O', name: 'Oksigen', color: '#ef4444', radius: 0.35, position: [1.16, 0, 0], explodedOffset: [1.6, 0, 0], charge: 'δ⁻' },
    ],
    bonds: [
      { atomA: 0, atomB: 1, order: 2 },
      { atomA: 0, atomB: 2, order: 2 },
    ],
  },
  {
    id: 'methane',
    name: 'Methane',
    nameId: 'Metana',
    formula: 'CH₄',
    category: 'organic_bio',
    molarMass: 16.043,
    geometry: 'Tetrahedral (109.5°)',
    polarity: 'Non-polar',
    description: 'Alkana paling sederhana dan komponen utama gas alam (LNG). Memiliki ikatan kovalen C-H simetris empat arah.',
    realWorldUsage: 'Bahan bakar pembangkit listrik, pemanas kompor gas rumah tangga, dan bahan baku produksi gas hidrogen industri.',
    safetyNotes: 'Sangat mudah terbakar, dapat membentuk campuran eksplosif dengan udara.',
    atoms: [
      { id: 'C-1', element: 'C', name: 'Karbon', color: '#334155', radius: 0.38, position: [0, 0, 0], explodedOffset: [0, 0.8, 0] },
      { id: 'H-1', element: 'H', name: 'Hidrogen', color: '#cbd5e1', radius: 0.24, position: [0, 1.05, 0], explodedOffset: [0, 1.8, 0] },
      { id: 'H-2', element: 'H', name: 'Hidrogen', color: '#cbd5e1', radius: 0.24, position: [0.99, -0.35, 0], explodedOffset: [1.6, -0.6, 0] },
      { id: 'H-3', element: 'H', name: 'Hidrogen', color: '#cbd5e1', radius: 0.24, position: [-0.5, -0.35, 0.86], explodedOffset: [-0.9, -0.6, 1.5] },
      { id: 'H-4', element: 'H', name: 'Hidrogen', color: '#cbd5e1', radius: 0.24, position: [-0.5, -0.35, -0.86], explodedOffset: [-0.9, -0.6, -1.5] },
    ],
    bonds: [
      { atomA: 0, atomB: 1, order: 1 },
      { atomA: 0, atomB: 2, order: 1 },
      { atomA: 0, atomB: 3, order: 1 },
      { atomA: 0, atomB: 4, order: 1 },
    ],
  },
  {
    id: 'ammonia',
    name: 'Ammonia',
    nameId: 'Amonia',
    formula: 'NH₃',
    category: 'acid_base',
    molarMass: 17.031,
    geometry: 'Trigonal Piramidal (107°)',
    polarity: 'Polar',
    description: 'Basa lemah dengan sepasang elektron bebas pada atom nitrogen yang mampu mengikat ion hidrogen (H⁺). Berbau tajam menyengat khas.',
    realWorldUsage: 'Bahan baku vital produksi pupuk urea pertanian dunia dan bahan baku pembersih kaca serbaguna.',
    safetyNotes: 'Korosif terhadap saluran pernapasan, gas berbau sangat tajam dan toksik.',
    atoms: [
      { id: 'N-1', element: 'N', name: 'Nitrogen', color: '#2563eb', radius: 0.37, position: [0, 0.28, 0], explodedOffset: [0, 0.9, 0], charge: 'δ⁻' },
      { id: 'H-1', element: 'H', name: 'Hidrogen', color: '#cbd5e1', radius: 0.24, position: [0.94, -0.28, 0], explodedOffset: [1.6, -0.6, 0], charge: 'δ⁺' },
      { id: 'H-2', element: 'H', name: 'Hidrogen', color: '#cbd5e1', radius: 0.24, position: [-0.47, -0.28, 0.81], explodedOffset: [-0.9, -0.6, 1.4], charge: 'δ⁺' },
      { id: 'H-3', element: 'H', name: 'Hidrogen', color: '#cbd5e1', radius: 0.24, position: [-0.47, -0.28, -0.81], explodedOffset: [-0.9, -0.6, -1.4], charge: 'δ⁺' },
    ],
    bonds: [
      { atomA: 0, atomB: 1, order: 1 },
      { atomA: 0, atomB: 2, order: 1 },
      { atomA: 0, atomB: 3, order: 1 },
    ],
  },
  {
    id: 'hydrochloric-acid',
    name: 'Hydrogen Chloride',
    nameId: 'Asam Klorida',
    formula: 'HCl',
    category: 'acid_base',
    molarMass: 36.46,
    geometry: 'Linier',
    polarity: 'Sangat Polar',
    description: 'Asam kuat biner yang terionisasi sempurna dalam air menghasilkan ion H₃O⁺ dan Cl⁻. Cairan bening berasap dengan bau menusuk hidung.',
    realWorldUsage: 'Asam lambung alami pencerna makanan, pembersih kerak logam industri baja (*pickling*), dan pengatur pH.',
    safetyNotes: 'Sangat korosif, menyebabkan luka bakar kimiawi parah pada kulit dan mata.',
    atoms: [
      { id: 'H-1', element: 'H', name: 'Hidrogen', color: '#cbd5e1', radius: 0.25, position: [-0.64, 0, 0], explodedOffset: [-1.4, 0, 0], charge: 'δ⁺' },
      { id: 'Cl-1', element: 'Cl', name: 'Klorin', color: '#22c55e', radius: 0.44, position: [0.64, 0, 0], explodedOffset: [1.4, 0, 0], charge: 'δ⁻' },
    ],
    bonds: [
      { atomA: 0, atomB: 1, order: 1 },
    ],
  },
  {
    id: 'sodium-hydroxide',
    name: 'Sodium Hydroxide',
    nameId: 'Natrium Hidroksida (Soda Api)',
    formula: 'NaOH',
    category: 'acid_base',
    molarMass: 39.997,
    geometry: 'Linier / Kisi Ionik',
    polarity: 'Ionik',
    description: 'Basa kuat kaustik yang terdisosiasi penuh menjadi kation Na⁺ dan anion OH⁻ dalam air. Sangat eksotermik saat dilarutkan dalam air.',
    realWorldUsage: 'Bahan baku pembuatan sabun batangan (proses saponifikasi), pembuka sumbatan saluran air, dan pemurnian bauksit.',
    safetyNotes: 'Sangat kaustik/korosif, merusak jaringan biologis dengan cepat.',
    atoms: [
      { id: 'Na-1', element: 'Na', name: 'Natrium', color: '#9333ea', radius: 0.45, position: [-0.9, 0, 0], explodedOffset: [-1.6, 0, 0], charge: '+1' },
      { id: 'O-1', element: 'O', name: 'Oksigen', color: '#ef4444', radius: 0.35, position: [0.4, 0, 0], explodedOffset: [0.6, 0.4, 0], charge: '-1' },
      { id: 'H-1', element: 'H', name: 'Hidrogen', color: '#cbd5e1', radius: 0.23, position: [1.2, 0, 0], explodedOffset: [1.6, -0.4, 0] },
    ],
    bonds: [
      { atomA: 0, atomB: 1, order: 1 },
      { atomA: 1, atomB: 2, order: 1 },
    ],
  },
  {
    id: 'table-salt',
    name: 'Sodium Chloride',
    nameId: 'Natrium Klorida (Garam Dapur)',
    formula: 'NaCl',
    category: 'ionic_salt',
    molarMass: 58.44,
    geometry: 'Kisi Kristal Kubik Berpusat Muka (FCC)',
    polarity: 'Ionik',
    description: 'Kristal ionik klasik di mana setiap kation Na⁺ dikelilingi oleh 6 anion Cl⁻ dalam struktur kisi ortogonal yang sangat kuat dan rapuh.',
    realWorldUsage: 'Bumbu masakan utama, pengawet makanan, bahan baku industri klor-alkali, dan pencair salju jalan raya.',
    safetyNotes: 'Aman untuk makanan, hindari konsumsi berlebih pada penderita hipertensi.',
    atoms: [
      // Cluster 2x2x2 kisi kristal ionik
      { id: 'Na-1', element: 'Na', name: 'Natrium (Na⁺)', color: '#9333ea', radius: 0.38, position: [-0.5, -0.5, -0.5], explodedOffset: [-1.4, -1.4, -1.4], charge: '+1' },
      { id: 'Cl-1', element: 'Cl', name: 'Klorin (Cl⁻)', color: '#22c55e', radius: 0.46, position: [0.5, -0.5, -0.5], explodedOffset: [1.4, -1.4, -1.4], charge: '-1' },
      { id: 'Cl-2', element: 'Cl', name: 'Klorin (Cl⁻)', color: '#22c55e', radius: 0.46, position: [-0.5, 0.5, -0.5], explodedOffset: [-1.4, 1.4, -1.4], charge: '-1' },
      { id: 'Na-2', element: 'Na', name: 'Natrium (Na⁺)', color: '#9333ea', radius: 0.38, position: [0.5, 0.5, -0.5], explodedOffset: [1.4, 1.4, -1.4], charge: '+1' },
      { id: 'Cl-3', element: 'Cl', name: 'Klorin (Cl⁻)', color: '#22c55e', radius: 0.46, position: [-0.5, -0.5, 0.5], explodedOffset: [-1.4, -1.4, 1.4], charge: '-1' },
      { id: 'Na-3', element: 'Na', name: 'Natrium (Na⁺)', color: '#9333ea', radius: 0.38, position: [0.5, -0.5, 0.5], explodedOffset: [1.4, -1.4, 1.4], charge: '+1' },
      { id: 'Na-4', element: 'Na', name: 'Natrium (Na⁺)', color: '#9333ea', radius: 0.38, position: [-0.5, 0.5, 0.5], explodedOffset: [-1.4, 1.4, 1.4], charge: '+1' },
      { id: 'Cl-4', element: 'Cl', name: 'Klorin (Cl⁻)', color: '#22c55e', radius: 0.46, position: [0.5, 0.5, 0.5], explodedOffset: [1.4, 1.4, 1.4], charge: '-1' },
    ],
    bonds: [
      { atomA: 0, atomB: 1, order: 1 },
      { atomA: 0, atomB: 2, order: 1 },
      { atomA: 1, atomB: 3, order: 1 },
      { atomA: 2, atomB: 3, order: 1 },
      { atomA: 0, atomB: 4, order: 1 },
      { atomA: 1, atomB: 5, order: 1 },
      { atomA: 2, atomB: 6, order: 1 },
      { atomA: 3, atomB: 7, order: 1 },
      { atomA: 4, atomB: 5, order: 1 },
      { atomA: 4, atomB: 6, order: 1 },
      { atomA: 5, atomB: 7, order: 1 },
      { atomA: 6, atomB: 7, order: 1 },
    ],
  },
  {
    id: 'ethanol',
    name: 'Ethanol',
    nameId: 'Etanol (Alkohol)',
    formula: 'C₂H₅OH',
    category: 'organic_bio',
    molarMass: 46.07,
    geometry: 'Rantai Alifatik dengan Gugus Hidroksil (-OH)',
    polarity: 'Polar',
    description: 'Senyawa alkohol primer dengan rantai dua karbon dan satu gugus fungsi hidroksil (-OH) yang membentuk ikatan hidrogen.',
    realWorldUsage: 'Antiseptik hand sanitizer, pelarut parfum, bahan bakar biofuel alternatif, dan pelarut laboratorium.',
    safetyNotes: 'Cairan mudah terbakar, uap memabukkan jika dihirup berkepanjangan.',
    atoms: [
      { id: 'C-1', element: 'C', name: 'Karbon', color: '#334155', radius: 0.38, position: [-0.75, -0.2, 0], explodedOffset: [-1.2, -0.6, 0] },
      { id: 'C-2', element: 'C', name: 'Karbon', color: '#334155', radius: 0.38, position: [0.65, 0.35, 0], explodedOffset: [0.8, 0.7, 0] },
      { id: 'O-1', element: 'O', name: 'Oksigen', color: '#ef4444', radius: 0.35, position: [1.6, -0.6, 0], explodedOffset: [2.0, -1.1, 0], charge: 'δ⁻' },
      { id: 'H-O', element: 'H', name: 'Hidrogen (OH)', color: '#cbd5e1', radius: 0.24, position: [2.4, -0.2, 0], explodedOffset: [2.8, -0.2, 0], charge: 'δ⁺' },
      { id: 'H-1', element: 'H', name: 'Hidrogen', color: '#cbd5e1', radius: 0.24, position: [-1.4, 0.1, 0.8], explodedOffset: [-2.2, 0.2, 1.4] },
      { id: 'H-2', element: 'H', name: 'Hidrogen', color: '#cbd5e1', radius: 0.24, position: [-1.4, 0.1, -0.8], explodedOffset: [-2.2, 0.2, -1.4] },
      { id: 'H-3', element: 'H', name: 'Hidrogen', color: '#cbd5e1', radius: 0.24, position: [-0.75, -1.25, 0], explodedOffset: [-1.2, -2.0, 0] },
      { id: 'H-4', element: 'H', name: 'Hidrogen', color: '#cbd5e1', radius: 0.24, position: [0.65, 1.0, 0.8], explodedOffset: [0.9, 1.7, 1.3] },
      { id: 'H-5', element: 'H', name: 'Hidrogen', color: '#cbd5e1', radius: 0.24, position: [0.65, 1.0, -0.8], explodedOffset: [0.9, 1.7, -1.3] },
    ],
    bonds: [
      { atomA: 0, atomB: 1, order: 1 },
      { atomA: 1, atomB: 2, order: 1 },
      { atomA: 2, atomB: 3, order: 1 },
      { atomA: 0, atomB: 4, order: 1 },
      { atomA: 0, atomB: 5, order: 1 },
      { atomA: 0, atomB: 6, order: 1 },
      { atomA: 1, atomB: 7, order: 1 },
      { atomA: 1, atomB: 8, order: 1 },
    ],
  },
  {
    id: 'sulfuric-acid',
    name: 'Sulfuric Acid',
    nameId: 'Asam Sulfat',
    formula: 'H₂SO₄',
    category: 'acid_base',
    molarMass: 98.079,
    geometry: 'Tetrahedral di sekitar atom Belerang',
    polarity: 'Sangat Polar',
    description: 'Dikenal sebagai "Raja Bahan Kimia" karena volume produksinya yang terbesar di dunia. Asam diprotik kuat dan agen dehidrasi luar biasa.',
    realWorldUsage: 'Elektrolit aki timbal mobil, pembuatan pupuk fosfat, pengolahan minyak bumi, dan deterjen.',
    safetyNotes: 'Sangat berbahaya, menyebabkan luka bakar kimia parah dan reaksi pelepasan panas dahsyat saat bertemu air.',
    atoms: [
      { id: 'S-1', element: 'S', name: 'Belerang', color: '#eab308', radius: 0.42, position: [0, 0, 0], explodedOffset: [0, 0.8, 0] },
      { id: 'O-1', element: 'O', name: 'Oksigen (=O)', color: '#ef4444', radius: 0.35, position: [0, 1.25, 0], explodedOffset: [0, 2.0, 0] },
      { id: 'O-2', element: 'O', name: 'Oksigen (=O)', color: '#ef4444', radius: 0.35, position: [0, -1.25, 0], explodedOffset: [0, -2.0, 0] },
      { id: 'O-3', element: 'O', name: 'Oksigen (-OH)', color: '#ef4444', radius: 0.35, position: [-1.2, 0, 0.4], explodedOffset: [-1.8, 0, 0.7] },
      { id: 'O-4', element: 'O', name: 'Oksigen (-OH)', color: '#ef4444', radius: 0.35, position: [1.2, 0, -0.4], explodedOffset: [1.8, 0, -0.7] },
      { id: 'H-1', element: 'H', name: 'Hidrogen', color: '#cbd5e1', radius: 0.23, position: [-1.9, 0, 0.7], explodedOffset: [-2.7, 0, 1.2] },
      { id: 'H-2', element: 'H', name: 'Hidrogen', color: '#cbd5e1', radius: 0.23, position: [1.9, 0, -0.7], explodedOffset: [2.7, 0, -1.2] },
    ],
    bonds: [
      { atomA: 0, atomB: 1, order: 2 },
      { atomA: 0, atomB: 2, order: 2 },
      { atomA: 0, atomB: 3, order: 1 },
      { atomA: 0, atomB: 4, order: 1 },
      { atomA: 3, atomB: 5, order: 1 },
      { atomA: 4, atomB: 6, order: 1 },
    ],
  },
  {
    id: 'glucose',
    name: 'Glucose (D-Glucose)',
    nameId: 'Glukosa',
    formula: 'C₆H₁₂O₆',
    category: 'organic_bio',
    molarMass: 180.16,
    geometry: 'Cincin Piranosa (Bentuk Kursi)',
    polarity: 'Polar',
    description: 'Monosakarida terpenting dalam biologi. Hasil fotosintesis dan bahan bakar utama respirasi seluler untuk menghasilkan ATP tubuh.',
    realWorldUsage: 'Sumber energi sel otak dan otot, infus glukosa medis, pemanis industri makanan dan minuman.',
    safetyNotes: 'Senyawa nutrisi alami tubuh.',
    atoms: [
      { id: 'C-1', element: 'C', name: 'Karbon C1', color: '#334155', radius: 0.36, position: [1.1, -0.3, 0.2], explodedOffset: [1.8, -0.5, 0.3] },
      { id: 'C-2', element: 'C', name: 'Karbon C2', color: '#334155', radius: 0.36, position: [0.7, -1.2, -0.8], explodedOffset: [1.2, -2.0, -1.4] },
      { id: 'C-3', element: 'C', name: 'Karbon C3', color: '#334155', radius: 0.36, position: [-0.7, -1.1, -0.6], explodedOffset: [-1.2, -1.8, -1.0] },
      { id: 'C-4', element: 'C', name: 'Karbon C4', color: '#334155', radius: 0.36, position: [-1.1, 0.2, 0.1], explodedOffset: [-1.9, 0.3, 0.2] },
      { id: 'C-5', element: 'C', name: 'Karbon C5', color: '#334155', radius: 0.36, position: [-0.2, 1.2, 0.7], explodedOffset: [-0.3, 2.0, 1.2] },
      { id: 'O-ring', element: 'O', name: 'Oksigen Cincin', color: '#ef4444', radius: 0.34, position: [0.9, 0.8, 0.8], explodedOffset: [1.5, 1.3, 1.3] },
      { id: 'O-1', element: 'O', name: 'Oksigen OH-1', color: '#ef4444', radius: 0.34, position: [2.3, -0.4, 0.3], explodedOffset: [3.2, -0.6, 0.5] },
      { id: 'O-2', element: 'O', name: 'Oksigen OH-2', color: '#ef4444', radius: 0.34, position: [1.3, -2.3, -0.9], explodedOffset: [2.1, -3.2, -1.3] },
      { id: 'O-3', element: 'O', name: 'Oksigen OH-3', color: '#ef4444', radius: 0.34, position: [-1.4, -2.1, -0.8], explodedOffset: [-2.2, -3.1, -1.2] },
      { id: 'O-4', element: 'O', name: 'Oksigen OH-4', color: '#ef4444', radius: 0.34, position: [-2.3, 0.2, 0.2], explodedOffset: [-3.3, 0.3, 0.3] },
      { id: 'C-6', element: 'C', name: 'Karbon C6', color: '#334155', radius: 0.36, position: [-0.6, 2.2, -0.2], explodedOffset: [-1.0, 3.2, -0.3] },
      { id: 'O-6', element: 'O', name: 'Oksigen OH-6', color: '#ef4444', radius: 0.34, position: [-0.2, 3.3, 0.5], explodedOffset: [-0.3, 4.3, 0.8] },
    ],
    bonds: [
      { atomA: 0, atomB: 1, order: 1 },
      { atomA: 1, atomB: 2, order: 1 },
      { atomA: 2, atomB: 3, order: 1 },
      { atomA: 3, atomB: 4, order: 1 },
      { atomA: 4, atomB: 5, order: 1 },
      { atomA: 5, atomB: 0, order: 1 },
      { atomA: 0, atomB: 6, order: 1 },
      { atomA: 1, atomB: 7, order: 1 },
      { atomA: 2, atomB: 8, order: 1 },
      { atomA: 3, atomB: 9, order: 1 },
      { atomA: 4, atomB: 10, order: 1 },
      { atomA: 10, atomB: 11, order: 1 },
    ],
  },
  {
    id: 'caffeine',
    name: 'Caffeine',
    nameId: 'Kafein',
    formula: 'C₈H₁₀N₄O₂',
    category: 'organic_bio',
    molarMass: 194.19,
    geometry: 'Cincin Purin Heterosiklik Menyatu (Bisiklik)',
    polarity: 'Polar Moderat',
    description: 'Alkaloid xantin stimulan sistem saraf pusat paling banyak dikonsumsi di dunia. Bekerja dengan memblokir reseptor adenosin di otak sehingga menghambat rasa kantuk.',
    realWorldUsage: 'Kandungan aktif biji kopi, daun teh, minuman berenergi, dan pereda nyeri sakit kepala.',
    safetyNotes: 'Dosis berlebih dapat menyebabkan jantung berdebar dan insomnia.',
    atoms: [
      { id: 'N-1', element: 'N', name: 'Nitrogen N1', color: '#2563eb', radius: 0.36, position: [0, 1.2, 0], explodedOffset: [0, 1.9, 0] },
      { id: 'C-2', element: 'C', name: 'Karbon C2(=O)', color: '#334155', radius: 0.36, position: [1.1, 0.6, 0], explodedOffset: [1.7, 0.9, 0] },
      { id: 'O-2', element: 'O', name: 'Oksigen O2', color: '#ef4444', radius: 0.34, position: [2.1, 1.1, 0], explodedOffset: [3.0, 1.6, 0] },
      { id: 'N-3', element: 'N', name: 'Nitrogen N3', color: '#2563eb', radius: 0.36, position: [1.0, -0.7, 0], explodedOffset: [1.6, -1.1, 0] },
      { id: 'C-4', element: 'C', name: 'Karbon C4', color: '#334155', radius: 0.36, position: [-0.2, -1.3, 0], explodedOffset: [-0.3, -1.9, 0] },
      { id: 'C-5', element: 'C', name: 'Karbon C5', color: '#334155', radius: 0.36, position: [-1.2, -0.5, 0], explodedOffset: [-1.8, -0.7, 0] },
      { id: 'C-6', element: 'C', name: 'Karbon C6(=O)', color: '#334155', radius: 0.36, position: [-1.1, 0.8, 0], explodedOffset: [-1.7, 1.2, 0] },
      { id: 'O-6', element: 'O', name: 'Oksigen O6', color: '#ef4444', radius: 0.34, position: [-2.1, 1.5, 0], explodedOffset: [-3.0, 2.2, 0] },
      { id: 'N-7', element: 'N', name: 'Nitrogen N7', color: '#2563eb', radius: 0.36, position: [-2.3, -1.1, 0], explodedOffset: [-3.3, -1.6, 0] },
      { id: 'C-8', element: 'C', name: 'Karbon C8', color: '#334155', radius: 0.36, position: [-2.0, -2.3, 0], explodedOffset: [-2.9, -3.2, 0] },
      { id: 'N-9', element: 'N', name: 'Nitrogen N9', color: '#2563eb', radius: 0.36, position: [-0.7, -2.4, 0], explodedOffset: [-1.0, -3.4, 0] },
      { id: 'C-me1', element: 'C', name: 'Metil N1', color: '#334155', radius: 0.34, position: [0.1, 2.6, 0], explodedOffset: [0.2, 3.6, 0] },
      { id: 'C-me3', element: 'C', name: 'Metil N3', color: '#334155', radius: 0.34, position: [2.2, -1.4, 0], explodedOffset: [3.3, -2.1, 0] },
      { id: 'C-me7', element: 'C', name: 'Metil N7', color: '#334155', radius: 0.34, position: [-3.6, -0.6, 0], explodedOffset: [-4.9, -0.8, 0] },
    ],
    bonds: [
      { atomA: 0, atomB: 1, order: 1 },
      { atomA: 1, atomB: 2, order: 2 },
      { atomA: 1, atomB: 3, order: 1 },
      { atomA: 3, atomB: 4, order: 1 },
      { atomA: 4, atomB: 5, order: 2 },
      { atomA: 5, atomB: 6, order: 1 },
      { atomA: 6, atomB: 7, order: 2 },
      { atomA: 6, atomB: 0, order: 1 },
      { atomA: 5, atomB: 8, order: 1 },
      { atomA: 8, atomB: 9, order: 1 },
      { atomA: 9, atomB: 10, order: 2 },
      { atomA: 10, atomB: 4, order: 1 },
      { atomA: 0, atomB: 11, order: 1 },
      { atomA: 3, atomB: 12, order: 1 },
      { atomA: 8, atomB: 13, order: 1 },
    ],
  },
];
