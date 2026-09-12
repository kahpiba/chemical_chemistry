/**
 * Flame Test Lab data — emission colors, spectra, and pyrotechnic facts
 * for alkali metals, alkaline earth metals, and transition metals.
 */

export interface FlameTestElement {
  symbol: string;
  name: string;
  nameId: string;
  atomicNumber: number;
  /** CSS color for the primary flame */
  flameColor: string;
  /** Human-readable color name */
  flameColorName: string;
  flameColorNameId: string;
  /** Emission line wavelengths in nm */
  emissionLines: { wavelength: number; color: string; intensity: number }[];
  /** Electron transition explanation */
  explanation: string;
  /** Real-world pyrotechnic or industrial use */
  realWorldUse: string;
  /** Orbital excitation description */
  orbitalNote: string;
}

export const FLAME_TEST_ELEMENTS: FlameTestElement[] = [
  {
    symbol: 'Li',
    name: 'Lithium',
    nameId: 'Litium',
    atomicNumber: 3,
    flameColor: '#dc2626',
    flameColorName: 'Crimson Red',
    flameColorNameId: 'Merah Terang (Crimson)',
    emissionLines: [
      { wavelength: 670.8, color: '#dc2626', intensity: 1.0 },
      { wavelength: 610.3, color: '#ea580c', intensity: 0.3 },
    ],
    explanation: 'Elektron tereksitasi dari orbital 2s ke 2p, lalu melepas foton merah pada ~670.8 nm saat kembali ke keadaan dasar.',
    realWorldUse: 'Kembang api merah terang, baterai lithium-ion, obat gangguan bipolar.',
    orbitalNote: '2s¹ → 2p¹ (transisi utama)',
  },
  {
    symbol: 'Na',
    name: 'Sodium',
    nameId: 'Natrium',
    atomicNumber: 11,
    flameColor: '#eab308',
    flameColorName: 'Intense Yellow',
    flameColorNameId: 'Kuning Terang (Intense Yellow)',
    emissionLines: [
      { wavelength: 589.0, color: '#eab308', intensity: 1.0 },
      { wavelength: 589.6, color: '#ca8a04', intensity: 0.95 },
    ],
    explanation: 'Doublet Natrium D-lines (589.0 dan 589.6 nm) adalah emisi paling kuat. Transisi 3p → 3s menghasilkan cahaya kuning intens yang mendominasi nyala api.',
    realWorldUse: 'Lampu jalan natrium (lampu kuning), garam dapur, kembang api kuning.',
    orbitalNote: '3s¹ → 3p¹ (Na D-lines doublet)',
  },
  {
    symbol: 'K',
    name: 'Potassium',
    nameId: 'Kalium',
    atomicNumber: 19,
    flameColor: '#a855f7',
    flameColorName: 'Lilac / Violet',
    flameColorNameId: 'Ungu Muda (Lilac)',
    emissionLines: [
      { wavelength: 766.5, color: '#dc2626', intensity: 0.8 },
      { wavelength: 769.9, color: '#dc2626', intensity: 0.75 },
      { wavelength: 404.4, color: '#7c3aed', intensity: 0.5 },
    ],
    explanation: 'Kalium memancarkan garis merah jauh (766–770 nm, tak terlihat jelas) dan sedikit ungu (404 nm). Kombinasinya terlihat sebagai nyala ungu muda/lilac oleh mata manusia.',
    realWorldUse: 'Kembang api ungu, pupuk KCl, suplemen elektrolit.',
    orbitalNote: '4s¹ → 4p¹ (transisi utama)',
  },
  {
    symbol: 'Ca',
    name: 'Calcium',
    nameId: 'Kalsium',
    atomicNumber: 20,
    flameColor: '#ea580c',
    flameColorName: 'Orange-Red',
    flameColorNameId: 'Merah-Jingga (Orange-Red)',
    emissionLines: [
      { wavelength: 622.0, color: '#ea580c', intensity: 1.0 },
      { wavelength: 616.2, color: '#f97316', intensity: 0.7 },
      { wavelength: 553.0, color: '#84cc16', intensity: 0.3 },
    ],
    explanation: 'Ion Ca²⁺ yang tereksitasi memancarkan cahaya oranye-merah dominan pada ~622 nm (transisi 4p → 4s).',
    realWorldUse: 'Kembang api oranye, kapur tulis CaCO₃, pembentuk tulang & gigi.',
    orbitalNote: '4s² → tereksitasi ke 3d/4p → relaksasi',
  },
  {
    symbol: 'Sr',
    name: 'Strontium',
    nameId: 'Stronsium',
    atomicNumber: 38,
    flameColor: '#ef4444',
    flameColorName: 'Scarlet Red',
    flameColorNameId: 'Merah Tua (Scarlet)',
    emissionLines: [
      { wavelength: 640.8, color: '#ef4444', intensity: 1.0 },
      { wavelength: 687.8, color: '#dc2626', intensity: 0.6 },
      { wavelength: 460.7, color: '#3b82f6', intensity: 0.25 },
    ],
    explanation: 'Stronsium menghasilkan nyala merah tua yang sangat cerah (640–688 nm), menjadikannya bahan utama kembang api merah.',
    realWorldUse: 'Kembang api merah profesional (SrCO₃), flare darurat, glow sticks.',
    orbitalNote: '5s² → tereksitasi ke 5p/4d',
  },
  {
    symbol: 'Ba',
    name: 'Barium',
    nameId: 'Barium',
    atomicNumber: 56,
    flameColor: '#84cc16',
    flameColorName: 'Apple Green',
    flameColorNameId: 'Hijau Apel (Apple Green)',
    emissionLines: [
      { wavelength: 553.6, color: '#84cc16', intensity: 1.0 },
      { wavelength: 524.2, color: '#22c55e', intensity: 0.6 },
      { wavelength: 614.2, color: '#ea580c', intensity: 0.2 },
    ],
    explanation: 'Barium menghasilkan nyala hijau apel terang karena emisi dominan pada ~553 nm (transisi 6s → 6p).',
    realWorldUse: 'Kembang api hijau (BaCl₂), media kontras rontgen (BaSO₄), cat luminescent.',
    orbitalNote: '6s² → tereksitasi ke 6p/5d',
  },
  {
    symbol: 'Cu',
    name: 'Copper',
    nameId: 'Tembaga',
    atomicNumber: 29,
    flameColor: '#06b6d4',
    flameColorName: 'Blue-Green',
    flameColorNameId: 'Biru-Hijau (Blue-Green)',
    emissionLines: [
      { wavelength: 510.5, color: '#22c55e', intensity: 0.8 },
      { wavelength: 521.8, color: '#06b6d4', intensity: 1.0 },
      { wavelength: 578.2, color: '#eab308', intensity: 0.3 },
    ],
    explanation: 'Tembaga menghasilkan nyala biru-hijau yang unik. CuCl₂ memberikan warna biru lebih intens karena ion Cu²⁺ tereksitasi.',
    realWorldUse: 'Kembang api biru-hijau, patina Patung Liberty, kawat listrik, koin.',
    orbitalNote: '3d¹⁰4s¹ → transisi kompleks 3d-4p',
  },
  {
    symbol: 'Cs',
    name: 'Cesium',
    nameId: 'Sesium',
    atomicNumber: 55,
    flameColor: '#818cf8',
    flameColorName: 'Blue-Violet',
    flameColorNameId: 'Biru-Ungu (Blue-Violet)',
    emissionLines: [
      { wavelength: 455.5, color: '#6366f1', intensity: 1.0 },
      { wavelength: 459.3, color: '#818cf8', intensity: 0.8 },
      { wavelength: 852.1, color: '#7f1d1d', intensity: 0.5 },
    ],
    explanation: 'Sesium memancarkan cahaya biru-ungu (455–459 nm) saat elektron 6s tereksitasi ke orbital 6p dan kembali.',
    realWorldUse: 'Jam atom cesium (standar waktu global), sel fotolistrik, drilling minyak.',
    orbitalNote: '6s¹ → 6p¹ (transisi utama)',
  },
  {
    symbol: 'Rb',
    name: 'Rubidium',
    nameId: 'Rubidium',
    atomicNumber: 37,
    flameColor: '#e879f9',
    flameColorName: 'Red-Violet',
    flameColorNameId: 'Merah-Ungu (Red-Violet)',
    emissionLines: [
      { wavelength: 780.0, color: '#dc2626', intensity: 0.9 },
      { wavelength: 794.8, color: '#b91c1c', intensity: 0.8 },
      { wavelength: 421.6, color: '#7c3aed', intensity: 0.4 },
    ],
    explanation: 'Rubidium memancarkan campuran merah jauh inframerah (780–795 nm) dan ungu (421 nm). Mata melihat ini sebagai warna merah-ungu.',
    realWorldUse: 'Sel fotolistrik, laser atom, penelitian fisika kuantum.',
    orbitalNote: '5s¹ → 5p¹ (transisi utama)',
  },
  {
    symbol: 'B',
    name: 'Boron',
    nameId: 'Boron',
    atomicNumber: 5,
    flameColor: '#22c55e',
    flameColorName: 'Bright Green',
    flameColorNameId: 'Hijau Terang',
    emissionLines: [
      { wavelength: 518.0, color: '#22c55e', intensity: 1.0 },
      { wavelength: 547.5, color: '#84cc16', intensity: 0.6 },
    ],
    explanation: 'Boron menghasilkan nyala hijau terang pada ~518 nm. Senyawa borat (boraks) sering digunakan dalam uji nyala api.',
    realWorldUse: 'Boraks pembersih, kaca borosilikat tahan panas (Pyrex), insektisida.',
    orbitalNote: '2s²2p¹ → transisi 2p',
  },
  {
    symbol: 'In',
    name: 'Indium',
    nameId: 'Indium',
    atomicNumber: 49,
    flameColor: '#6366f1',
    flameColorName: 'Indigo Blue',
    flameColorNameId: 'Biru Nila (Indigo)',
    emissionLines: [
      { wavelength: 451.1, color: '#6366f1', intensity: 1.0 },
      { wavelength: 410.2, color: '#7c3aed', intensity: 0.5 },
    ],
    explanation: 'Indium menghasilkan nyala biru nila khas pada 451 nm yang menjadi asal penamaan unsur ini (dari "indigo").',
    realWorldUse: 'Layar LCD/OLED (Indium Tin Oxide), solder, semikonduktor.',
    orbitalNote: '5s²5p¹ → transisi 5p-6s',
  },
  {
    symbol: 'Pb',
    name: 'Lead',
    nameId: 'Timbal',
    atomicNumber: 82,
    flameColor: '#94a3b8',
    flameColorName: 'Pale Blue-White',
    flameColorNameId: 'Biru-Putih Pucat',
    emissionLines: [
      { wavelength: 405.8, color: '#818cf8', intensity: 0.7 },
      { wavelength: 368.3, color: '#a78bfa', intensity: 0.5 },
    ],
    explanation: 'Timbal menghasilkan nyala biru-putih pucat yang lemah. Karena toksisitasnya, uji nyala Pb jarang dilakukan di lab siswa.',
    realWorldUse: 'Baterai aki, pelindung radiasi sinar-X, cat anti-karat historis (dihentikan).',
    orbitalNote: '6s²6p² → transisi kompleks',
  },
];
