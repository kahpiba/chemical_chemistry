// Calculation logic for Solutions, Dilution (M1V1 = M2V2), and Acid-Base / Buffer / Hydrolysis pH

export interface DilutionResult {
  v1: number; // mL
  m1: number; // M
  v2: number; // mL
  m2: number; // M
  vWaterAdded: number; // mL
  dilutionFactor: number;
}

export function calculateDilution(v1: number, m1: number, v2: number): DilutionResult {
  const safeV2 = Math.max(v1, v2);
  const m2 = safeV2 > 0 ? (m1 * v1) / safeV2 : 0;
  const vWaterAdded = safeV2 - v1;
  const dilutionFactor = v1 > 0 ? safeV2 / v1 : 1;

  return {
    v1,
    m1,
    v2: safeV2,
    m2: parseFloat(m2.toFixed(4)),
    vWaterAdded: parseFloat(vWaterAdded.toFixed(1)),
    dilutionFactor: parseFloat(dilutionFactor.toFixed(2)),
  };
}

export type SolutionType = 'strong_acid' | 'strong_base' | 'weak_acid' | 'weak_base' | 'buffer_acid' | 'buffer_base' | 'salt_hydrolysis';

export interface PHCalculationInput {
  type: SolutionType;
  concentration: number; // Molarity (M)
  valency?: number; // 1 for HCl, 2 for H2SO4, 1 for NaOH, 2 for Ba(OH)2
  ka?: number; // Acid dissociation constant (e.g. 1.8e-5 for CH3COOH)
  kb?: number; // Base dissociation constant (e.g. 1.8e-5 for NH3)
  saltConcentration?: number; // For buffer or hydrolysis
  saltType?: 'strong_strong' | 'weak_acid_strong_base' | 'strong_acid_weak_base';
}

export interface PHResult {
  ph: number;
  poh: number;
  hConcentration: number;
  ohConcentration: number;
  indicatorColor: string;
  formulaUsed: string;
  classification: 'Sangat Asam' | 'Asam Lemah' | 'Netral' | 'Basa Lemah' | 'Sangat Basa';
}

const KW = 1.0e-14;

export function calculatePH(input: PHCalculationInput): PHResult {
  let hConc = 1.0e-7;
  let formula = '';

  const conc = Math.max(0.000001, input.concentration);
  const val = input.valency || 1;

  switch (input.type) {
    case 'strong_acid': {
      hConc = conc * val;
      formula = `[H⁺] = a × M = ${val} × ${conc} M`;
      break;
    }
    case 'strong_base': {
      const ohConc = conc * val;
      hConc = KW / Math.max(1.0e-14, ohConc);
      formula = `[OH⁻] = b × M = ${val} × ${conc} M; [H⁺] = Kw / [OH⁻]`;
      break;
    }
    case 'weak_acid': {
      const ka = input.ka || 1.8e-5;
      hConc = Math.sqrt(ka * conc);
      formula = `[H⁺] = √(Ka × M) = √(${ka.toExponential(1)} × ${conc})`;
      break;
    }
    case 'weak_base': {
      const kb = input.kb || 1.8e-5;
      const ohConc = Math.sqrt(kb * conc);
      hConc = KW / Math.max(1.0e-14, ohConc);
      formula = `[OH⁻] = √(Kb × M); [H⁺] = Kw / [OH⁻]`;
      break;
    }
    case 'buffer_acid': {
      // Henderson-Hasselbalch: [H+] = Ka * ([Asam] / [Garam])
      const ka = input.ka || 1.8e-5;
      const saltC = Math.max(0.0001, input.saltConcentration || 0.1);
      hConc = ka * (conc / saltC);
      formula = `pH = pKa + log([Garam]/[Asam]) (Henderson-Hasselbalch)`;
      break;
    }
    case 'buffer_base': {
      // pOH = pKb + log([Garam]/[Basa])
      const kb = input.kb || 1.8e-5;
      const saltC = Math.max(0.0001, input.saltConcentration || 0.1);
      const ohConc = kb * (conc / saltC);
      hConc = KW / Math.max(1.0e-14, ohConc);
      formula = `pOH = pKb + log([Garam]/[Basa])`;
      break;
    }
    case 'salt_hydrolysis': {
      const st = input.saltType || 'weak_acid_strong_base';
      if (st === 'strong_strong') {
        hConc = 1.0e-7;
        formula = `Garam netral: tidak terhidrolisis ([H⁺] = 10⁻⁷ M)`;
      } else if (st === 'weak_acid_strong_base') {
        const ka = input.ka || 1.8e-5;
        const ohConc = Math.sqrt((KW / ka) * conc);
        hConc = KW / Math.max(1.0e-14, ohConc);
        formula = `[OH⁻] = √((Kw/Ka) × M_garam)`;
      } else {
        const kb = input.kb || 1.8e-5;
        hConc = Math.sqrt((KW / kb) * conc);
        formula = `[H⁺] = √((Kw/Kb) × M_garam)`;
      }
      break;
    }
  }

  // Calculate pH
  hConc = Math.max(1.0e-14, Math.min(1.0, hConc));
  const rawPh = -Math.log10(hConc);
  const ph = Math.max(0, Math.min(14, parseFloat(rawPh.toFixed(2))));
  const poh = parseFloat((14 - ph).toFixed(2));
  const ohConc = KW / hConc;

  // Universal indicator color scale
  const indicatorColor = getPHColor(ph);

  let classification: PHResult['classification'] = 'Netral';
  if (ph < 3.0) classification = 'Sangat Asam';
  else if (ph < 6.8) classification = 'Asam Lemah';
  else if (ph <= 7.2) classification = 'Netral';
  else if (ph <= 11.5) classification = 'Basa Lemah';
  else classification = 'Sangat Basa';

  return {
    ph,
    poh,
    hConcentration: hConc,
    ohConcentration: ohConc,
    indicatorColor,
    formulaUsed: formula,
    classification,
  };
}

/**
 * Universal Indicator Color mapping for pH 0 to 14
 */
export function getPHColor(ph: number): string {
  if (ph <= 1) return '#ef4444'; // Merah tua
  if (ph <= 2) return '#f97316'; // Merah-oranye
  if (ph <= 3) return '#fb923c'; // Oranye
  if (ph <= 4) return '#facc15'; // Oranye-kuning
  if (ph <= 5) return '#fde047'; // Kuning
  if (ph <= 6) return '#a3e635'; // Kuning kehijauan
  if (ph <= 7.2) return '#22c55e'; // Hijau netral
  if (ph <= 8) return '#10b981'; // Hijau kebiruan
  if (ph <= 9) return '#06b6d4'; // Sian / biru muda
  if (ph <= 10) return '#0284c7'; // Biru
  if (ph <= 11) return '#3b82f6'; // Biru kobalt
  if (ph <= 12) return '#6366f1'; // Nila / Indigo
  if (ph <= 13) return '#8b5cf6'; // Ungu
  return '#7c3aed'; // Violet pekat
}

// Preset chemical solutions for students
export interface SolutionPreset {
  name: string;
  chemical: string;
  type: SolutionType;
  defaultM: number;
  valency?: number;
  ka?: number;
  kb?: number;
  description: string;
}

export const COMMON_SOLUTIONS: SolutionPreset[] = [
  {
    name: 'Asam Klorida (HCl)',
    chemical: 'HCl',
    type: 'strong_acid',
    defaultM: 0.1,
    valency: 1,
    description: 'Asam lambung & asam kuat monoprotik terionisasi 100% di dalam air.',
  },
  {
    name: 'Asam Sulfat (H₂SO₄)',
    chemical: 'H₂SO₄',
    type: 'strong_acid',
    defaultM: 0.05,
    valency: 2,
    description: 'Asam kuat diprotik air aki baterai mobil, melepaskan 2 ion H⁺.',
  },
  {
    name: 'Asam Asetat / Cuka (CH₃COOH)',
    chemical: 'CH₃COOH',
    type: 'weak_acid',
    defaultM: 0.1,
    ka: 1.8e-5,
    description: 'Asam cuka dapur terionisasi sebagian (Ka = 1.8 × 10⁻⁵).',
  },
  {
    name: 'Natrium Hidroksida (NaOH)',
    chemical: 'NaOH',
    type: 'strong_base',
    defaultM: 0.1,
    valency: 1,
    description: 'Soda api basa kuat serbaguna untuk pembersih dan industri sabun.',
  },
  {
    name: 'Amonia (NH₃)',
    chemical: 'NH₃',
    type: 'weak_base',
    defaultM: 0.1,
    kb: 1.8e-5,
    description: 'Basa lemah pembersih kaca dengan aroma menyengat (Kb = 1.8 × 10⁻⁵).',
  },
  {
    name: 'Buffer Asetat (Darah / Biologi)',
    chemical: 'CH₃COOH + CH₃COONa',
    type: 'buffer_acid',
    defaultM: 0.1,
    ka: 1.8e-5,
    description: 'Larutan penyangga penahan pH asam terhadap penambahan asam/basa sedikit.',
  },
  {
    name: 'Garam Natrium Asetat (CH₃COONa)',
    chemical: 'CH₃COONa',
    type: 'salt_hydrolysis',
    defaultM: 0.1,
    ka: 1.8e-5,
    description: 'Hidrolisis parsial anion asetat menghasilkan lingkungan basa (pH > 7).',
  },
];
