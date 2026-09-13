/**
 * NFPA 704 Standard Diamond & GHS Chemical Hazard Classification Engine
 */

export interface NFPARating {
  health: number; // 0 to 4 (Blue)
  flammability: number; // 0 to 4 (Red)
  instability: number; // 0 to 4 (Yellow)
  special?: 'W' | 'OX' | 'COR' | 'ACID' | 'ALK' | 'BIO' | 'RAD' | 'none'; // White
}

export type GHSPictogram = 
  | 'flame'
  | 'flame_over_circle' // Oxidizer
  | 'corrosion'
  | 'skull_crossbones' // Acute toxicity
  | 'exploding_bomb'
  | 'gas_cylinder'
  | 'health_hazard' // Carcinogen / organ toxicity
  | 'exclamation_mark' // Irritant
  | 'environment'; // Aquatic toxicity

export interface ChemicalHazardProfile {
  name: string;
  formula: string;
  nfpa: NFPARating;
  ghs: GHSPictogram[];
  signalWord: 'BAHAYA (DANGER)' | 'PERINGATAN (WARNING)' | 'AMAN';
  hazardStatements: string[];
  firstAid: string;
  storageRequirement: string;
}

// Global database of hazard ratings
export const HAZARD_PROFILES: Record<string, ChemicalHazardProfile> = {
  // Elements & Reagents
  Na_metal: {
    name: 'Logam Natrium Murni',
    formula: 'Na(s)',
    nfpa: { health: 3, flammability: 3, instability: 2, special: 'W' },
    ghs: ['flame', 'corrosion', 'exploding_bomb'],
    signalWord: 'BAHAYA (DANGER)',
    hazardStatements: [
      'Bereaksi sangat keras dengan air melepaskan gas hidrogen mudah meledak (H₂).',
      'Menyebabkan luka bakar parah pada kulit dan kerusakan mata permanen.',
      'Dapat terbakar spontan di udara lembap.',
    ],
    firstAid: 'Bilas dengan minyak mineral dan penanganan darurat tanpa air. Jauhkan dari air dan kelembapan!',
    storageRequirement: 'Wajib disimpan terendam dalam minyak parafin / mineral kering rapat di lemari tahan api.',
  },
  HCl: {
    name: 'Asam Klorida Pekat',
    formula: 'HCl(aq)',
    nfpa: { health: 3, flammability: 0, instability: 1, special: 'COR' },
    ghs: ['corrosion', 'skull_crossbones', 'exclamation_mark'],
    signalWord: 'BAHAYA (DANGER)',
    hazardStatements: [
      'Menyebabkan luka bakar asam parah pada kulit dan korosi saluran pernapasan.',
      'Uap asam klorida sangat menyengat dan merusak paru-paru.',
      'Dilarang dicampur dengan pemutih (NaClO) karena menghasilkan gas klorin mematikan.',
    ],
    firstAid: 'Bilas segera dengan air mengalir selama minimal 15 menit. Netralkan tumpahan dengan natrium bikarbonat.',
    storageRequirement: 'Simpan di lemari penyimpanan asam korosif berperekat anti-karat.',
  },
  H2SO4_conc: {
    name: 'Asam Sulfat Pekat 98%',
    formula: 'H₂SO₄(l)',
    nfpa: { health: 3, flammability: 0, instability: 2, special: 'W' },
    ghs: ['corrosion', 'health_hazard'],
    signalWord: 'BAHAYA (DANGER)',
    hazardStatements: [
      'Afinitas air ekstrem: melepaskan kalor dahsyat saat kontak dengan air.',
      'Jangan pernah menuangkan air ke asam pekat (dapat memercik mendidih hebat).',
      'Mendehidrasi senyawa organik dan merusak jaringan seketika.',
    ],
    firstAid: 'Tuang asam perlahan ke dalam air (AA = Asam ke Air), bukan sebaliknya! Bilas tumpahan dengan air melimpah.',
    storageRequirement: 'Gunakan botol kaca tebal bertutup rapat di lemari khusus asam mineral pekat.',
  },
  NaOH: {
    name: 'Natrium Hidroksida Kaustik',
    formula: 'NaOH(aq)',
    nfpa: { health: 3, flammability: 0, instability: 1, special: 'ALK' },
    ghs: ['corrosion'],
    signalWord: 'BAHAYA (DANGER)',
    hazardStatements: [
      'Basa kuat kaustik merusak jaringan lipid dan protein dengan saponifikasi.',
      'Menyebabkan kebutaan permanen seketika bila mengenai mata.',
    ],
    firstAid: 'Bilas mata segera dengan eyewash station selama 20 menit. Hubungi dokter secepatnya.',
    storageRequirement: 'Simpan terpisah dari asam dan logam reaktif dalam wadah polietilen (HDPE).',
  },
  NaClO: {
    name: 'Natrium Hipoklorit (Pemutih)',
    formula: 'NaClO(aq)',
    nfpa: { health: 2, flammability: 0, instability: 1, special: 'COR' },
    ghs: ['corrosion', 'environment'],
    signalWord: 'BAHAYA (DANGER)',
    hazardStatements: [
      'Oksidator klorin: beracun bagi organisme air.',
      'BAHAYA FATAL bila dicampur asam: melepaskan gas klorin (Cl₂) mematikan!',
    ],
    firstAid: 'Pindahkan korban ke udara segar segera jika terhirup uap. Bilas kulit dengan air.',
    storageRequirement: 'Simpan di tempat sejuk terlindung dari sinar matahari langsung dan jauh dari asam.',
  },
  H2O2: {
    name: 'Hidrogen Peroksida 30%',
    formula: 'H₂O₂(aq)',
    nfpa: { health: 3, flammability: 0, instability: 2, special: 'OX' },
    ghs: ['flame_over_circle', 'corrosion', 'exclamation_mark'],
    signalWord: 'BAHAYA (DANGER)',
    hazardStatements: [
      'Oksidator kuat yang dapat menyulut bahan mudah terbakar.',
      'Dekomposisi cepat oleh katalis dapat menimbulkan lonjakan tekanan hebat.',
    ],
    firstAid: 'Bilas dengan air mengalir. Berikan ventilasi yang baik.',
    storageRequirement: 'Simpan dalam wadah berventilasi di lemari khusus oksidator sejuk.',
  },
  Organic_Oil: {
    name: 'Minyak Parafin Organik',
    formula: 'C₁₄H₃₀(l)',
    nfpa: { health: 0, flammability: 1, instability: 0, special: 'none' },
    ghs: ['exclamation_mark'],
    signalWord: 'PERINGATAN (WARNING)',
    hazardStatements: [
      'Cairan hidrofobik non-polar yang tidak dapat bercampur dengan air.',
      'Dapat terbakar bila dipanaskan melampaui titik nyala (flash point).',
    ],
    firstAid: 'Cuci dengan sabun dan air. Jangan membuang langsung ke saluran air limbah.',
    storageRequirement: 'Simpan jauh dari sumber nyala api terbuka dan oksidator kuat.',
  },
  Cl2_gas: {
    name: 'Gas Klorin Murni',
    formula: 'Cl₂(g)',
    nfpa: { health: 4, flammability: 0, instability: 0, special: 'OX' },
    ghs: ['gas_cylinder', 'skull_crossbones', 'corrosion', 'environment'],
    signalWord: 'BAHAYA (DANGER)',
    hazardStatements: [
      'Gas kuning kehijauan sangat beracun dan mematikan bila terhirup (LC50 ~ 293 ppm).',
      'Bereaksi dengan kelembapan paru-paru membentuk asam hipoklorit dan asam klorida.',
      'Menyebabkan edema paru akut dan sesak napas berat.',
    ],
    firstAid: 'Evakuasi segera! Berikan oksigen murni dan perawatan medis intensif darurat.',
    storageRequirement: 'Hanya boleh diproduksi di bawah lemari asam (fume hood) bertaraf standar kimia.',
  },
  // Default Safe Water
  H2O: {
    name: 'Air Murni (Akuades)',
    formula: 'H₂O(l)',
    nfpa: { health: 0, flammability: 0, instability: 0, special: 'none' },
    ghs: [],
    signalWord: 'AMAN',
    hazardStatements: ['Aman digunakan, pelarut universal ramah lingkungan.'],
    firstAid: 'Tidak memerlukan tindakan pertolongan pertama.',
    storageRequirement: 'Simpan di botol semprot bersih bersuhu ruang.',
  },
};

/**
 * Get NFPA rating for any element or substance.
 */
export function getHazardProfile(idOrFormula: string): ChemicalHazardProfile {
  if (HAZARD_PROFILES[idOrFormula]) {
    return HAZARD_PROFILES[idOrFormula];
  }
  // Generic fallback
  return {
    name: idOrFormula,
    formula: idOrFormula,
    nfpa: { health: 1, flammability: 0, instability: 0, special: 'none' },
    ghs: ['exclamation_mark'],
    signalWord: 'PERINGATAN (WARNING)',
    hazardStatements: ['Tangani dengan prosedur standar keselamatan laboratorium.'],
    firstAid: 'Bilas dengan air mengalir jika terjadi kontak kulit/mata.',
    storageRequirement: 'Simpan di tempat kering dan sejuk.',
  };
}
