export interface SpectralLine {
  wavelength: number; // nm
  color: string;
  intensity: number; // 0 to 1
  label: string;
  transition?: string;
}

export interface GasDischargeElement {
  id: string;
  name: string;
  symbol: string;
  atomicNumber: number;
  glowColor: string;
  glowRgba: string;
  description: string;
  lines: SpectralLine[];
  realWorldApplication: string;
}

export interface BohrTransitionSeries {
  id: string;
  name: string;
  nFinal: number;
  spectralRegion: string;
  description: string;
  transitions: {
    nInitial: number;
    wavelength: number; // nm
    color: string;
    energyEv: number;
    name: string;
  }[];
}

// Historical Bohr Series for Hydrogen Atom
export const BOHR_HYDROGEN_SERIES: BohrTransitionSeries[] = [
  {
    id: 'balmer',
    name: 'Deret Balmer (Cahaya Tampak)',
    nFinal: 2,
    spectralRegion: 'Visible Light (400 - 700 nm)',
    description:
      'Elektron tereksitasi jatuh kembali ke kulit n = 2. Menghasilkan spektrum garis diskrit cahaya tampak yang pertama kali dirumuskan Johann Balmer (1885) dan dibuktikan secara teoretis oleh Niels Bohr (1913).',
    transitions: [
      { nInitial: 3, wavelength: 656.3, color: '#ef4444', energyEv: 1.89, name: 'H-alfa (Hα) Merah' },
      { nInitial: 4, wavelength: 486.1, color: '#06b6d4', energyEv: 2.55, name: 'H-beta (Hβ) Sian' },
      { nInitial: 5, wavelength: 434.0, color: '#3b82f6', energyEv: 2.86, name: 'H-gamma (Hγ) Biru' },
      { nInitial: 6, wavelength: 410.2, color: '#8b5cf6', energyEv: 3.02, name: 'H-delta (Hδ) Violet' },
    ],
  },
  {
    id: 'lyman',
    name: 'Deret Lyman (Sinar Ultraviolet)',
    nFinal: 1,
    spectralRegion: 'Ultraviolet (UV: 90 - 125 nm)',
    description:
      'Transisi elektron langsung menuju keadaan dasar (ground state n = 1). Memancarkan foton berenergi kinetik sangat tinggi dalam panjang gelombang ultraviolet.',
    transitions: [
      { nInitial: 2, wavelength: 121.6, color: '#6366f1', energyEv: 10.20, name: 'Ly-alfa (Lyα)' },
      { nInitial: 3, wavelength: 102.6, color: '#4f46e5', energyEv: 12.09, name: 'Ly-beta (Lyβ)' },
      { nInitial: 4, wavelength: 97.3, color: '#4338ca', energyEv: 12.75, name: 'Ly-gamma (Lyγ)' },
      { nInitial: 5, wavelength: 95.0, color: '#3730a3', energyEv: 13.06, name: 'Ly-delta (Lyδ)' },
    ],
  },
  {
    id: 'paschen',
    name: 'Deret Paschen (Sinar Inframerah)',
    nFinal: 3,
    spectralRegion: 'Infrared (IR: 800 - 1900 nm)',
    description:
      'Transisi elektron menuju kulit n = 3. Memancarkan radiasi termal foton berenergi rendah dalam spektrum inframerah dekat.',
    transitions: [
      { nInitial: 4, wavelength: 1875.1, color: '#991b1b', energyEv: 0.66, name: 'Pa-alfa (Paα)' },
      { nInitial: 5, wavelength: 1281.8, color: '#b91c1c', energyEv: 0.97, name: 'Pa-beta (Paβ)' },
      { nInitial: 6, wavelength: 1093.8, color: '#dc2626', energyEv: 1.13, name: 'Pa-gamma (Paγ)' },
    ],
  },
];

// Gas Discharge Tube Lamps
export const GAS_DISCHARGE_ELEMENTS: GasDischargeElement[] = [
  {
    id: 'h2',
    name: 'Hidrogen (Hydrogen)',
    symbol: 'H',
    atomicNumber: 1,
    glowColor: '#e0aaff',
    glowRgba: 'rgba(224, 170, 255, 0.85)',
    description:
      'Pendaran plasma hidrogen menghasilkan warna lavender kemerahan yang merupakan superposisi dari garis merah Balmer (656 nm) dan garis sian-biru.',
    realWorldApplication: 'Penyelidikan astrofisika nebula antariksa & fusi nuklir bintang matahari.',
    lines: [
      { wavelength: 410.2, color: '#8b5cf6', intensity: 0.7, label: 'Hδ Violet' },
      { wavelength: 434.0, color: '#3b82f6', intensity: 0.8, label: 'Hγ Biru' },
      { wavelength: 486.1, color: '#06b6d4', intensity: 0.95, label: 'Hβ Sian' },
      { wavelength: 656.3, color: '#ef4444', intensity: 1.0, label: 'Hα Merah' },
    ],
  },
  {
    id: 'he',
    name: 'Helium (Helium)',
    symbol: 'He',
    atomicNumber: 2,
    glowColor: '#fde047',
    glowRgba: 'rgba(253, 224, 71, 0.85)',
    description:
      'Unsur pertama kali ditemukan dari spektrum matahari pada gerhana matahari 1868 (garis kuning D3 587.6 nm) sebelum pernah diisolasi di bumi.',
    realWorldApplication: 'Laser Helium-Neon (He-Ne), pendingin superkonduktor MRI, dan detektor kebocoran.',
    lines: [
      { wavelength: 447.1, color: '#3b82f6', intensity: 0.85, label: '447 nm' },
      { wavelength: 492.2, color: '#06b6d4', intensity: 0.7, label: '492 nm' },
      { wavelength: 501.6, color: '#10b981', intensity: 0.9, label: '502 nm' },
      { wavelength: 587.6, color: '#eab308', intensity: 1.0, label: '588 nm (D3)' },
      { wavelength: 667.8, color: '#ef4444', intensity: 0.95, label: '668 nm' },
      { wavelength: 706.5, color: '#dc2626', intensity: 0.8, label: '707 nm' },
    ],
  },
  {
    id: 'ne',
    name: 'Neon (Neon)',
    symbol: 'Ne',
    atomicNumber: 10,
    glowColor: '#ff4d00',
    glowRgba: 'rgba(255, 77, 0, 0.9)',
    description:
      'Gas mulia dengan lucutan listrik menghasilkan pendaran merah-oranye sangat terang dan tajam karena dominasi transisi elektron 3p ke 3s.',
    realWorldApplication: 'Lampu hias papan nama neon komersial, indikator tegangan tinggi, dan pelindung surge arrestor.',
    lines: [
      { wavelength: 585.2, color: '#f59e0b', intensity: 0.8, label: '585 nm' },
      { wavelength: 614.3, color: '#f97316', intensity: 0.95, label: '614 nm' },
      { wavelength: 626.6, color: '#ea580c', intensity: 0.9, label: '627 nm' },
      { wavelength: 640.2, color: '#ef4444', intensity: 1.0, label: '640 nm' },
      { wavelength: 650.6, color: '#dc2626', intensity: 0.85, label: '651 nm' },
      { wavelength: 703.2, color: '#b91c1c', intensity: 0.9, label: '703 nm' },
    ],
  },
  {
    id: 'na',
    name: 'Natrium (Sodium Vapor)',
    symbol: 'Na',
    atomicNumber: 11,
    glowColor: '#facc15',
    glowRgba: 'rgba(250, 204, 21, 0.9)',
    description:
      'Uap natrium memancarkan spektrum emisi monokromatik kuat pada panjang gelombang doublet 589.0 nm dan 589.6 nm (Garis D Natrium Fraunhofer).',
    realWorldApplication: 'Lampu penerangan jalan raya efisiensi tinggi (Low Pressure Sodium) karena tembus kabut tebal.',
    lines: [
      { wavelength: 589.0, color: '#eab308', intensity: 1.0, label: '589.0 nm (D2)' },
      { wavelength: 589.6, color: '#ca8a04', intensity: 0.95, label: '589.6 nm (D1)' },
    ],
  },
  {
    id: 'hg',
    name: 'Merkuri (Mercury Vapor)',
    symbol: 'Hg',
    atomicNumber: 80,
    glowColor: '#38bdf8',
    glowRgba: 'rgba(56, 189, 248, 0.85)',
    description:
      'Memancarkan spektrum ultraviolet kuat (254 nm) serta garis tampak biru (436 nm), hijau (546 nm), dan kuning ganda (577/579 nm).',
    realWorldApplication: 'Lampu TL fluorescent, lampu desinfektan UV pembunuh kuman kuman, dan spektroskopi analitik.',
    lines: [
      { wavelength: 404.7, color: '#7c3aed', intensity: 0.8, label: '405 nm' },
      { wavelength: 435.8, color: '#3b82f6', intensity: 0.95, label: '436 nm' },
      { wavelength: 546.1, color: '#10b981', intensity: 1.0, label: '546 nm (Hijau)' },
      { wavelength: 577.0, color: '#eab308', intensity: 0.85, label: '577 nm' },
      { wavelength: 579.1, color: '#ca8a04', intensity: 0.85, label: '579 nm' },
    ],
  },
];
