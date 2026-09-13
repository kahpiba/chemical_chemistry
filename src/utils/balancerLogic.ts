// Utility for parsing chemical formulas, balancing equations via algebraic matrix method, and stoichiometry calculations

export interface AtomCount {
  [element: string]: number;
}

export interface Compound {
  raw: string;
  atoms: AtomCount;
  coefficient: number;
}

export interface BalancedResult {
  success: boolean;
  message?: string;
  reactants: Compound[];
  products: Compound[];
  balancedString: string;
  elementAudit: {
    element: string;
    left: number;
    right: number;
    balanced: boolean;
  }[];
}

// Atomic masses for molar mass calculations (g/mol)
export const ATOMIC_WEIGHTS: Record<string, number> = {
  H: 1.008, He: 4.003, Li: 6.941, Be: 9.012, B: 10.81, C: 12.011, N: 14.007,
  O: 15.999, F: 18.998, Ne: 20.180, Na: 22.990, Mg: 24.305, Al: 26.982, Si: 28.086,
  P: 30.974, S: 32.065, Cl: 35.453, K: 39.098, Ar: 39.948, Ca: 40.078, Sc: 44.956,
  Ti: 47.867, V: 50.942, Cr: 51.996, Mn: 54.938, Fe: 55.845, Co: 58.933, Ni: 58.693,
  Cu: 63.546, Zn: 65.38, Ga: 69.723, Ge: 72.64, As: 74.922, Se: 78.96, Br: 79.904,
  Kr: 83.798, Rb: 85.468, Sr: 87.62, Y: 88.906, Zr: 91.224, Ag: 107.868, Sn: 118.71,
  I: 126.904, Ba: 137.327, Pt: 195.084, Au: 196.967, Hg: 200.59, Pb: 207.2
};

/**
 * Parses a chemical formula with possible parentheses e.g. Ca(OH)2, Fe2(SO4)3, CH3COOH
 */
export function parseFormula(formula: string): AtomCount {
  const result: AtomCount = {};
  const cleaned = formula.trim().replace(/\s+/g, '');
  if (!cleaned) return result;

  // Regex to match element tokens, numbers, and parentheses
  const regex = /([A-Z][a-z]?|\(|\)|\d+)/g;
  const tokens = cleaned.match(regex);
  if (!tokens) return result;

  const stack: AtomCount[] = [{}];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token === '(') {
      stack.push({});
    } else if (token === ')') {
      const top = stack.pop() || {};
      let multiplier = 1;
      // Check if next token is a number
      if (i + 1 < tokens.length && /^\d+$/.test(tokens[i + 1])) {
        multiplier = parseInt(tokens[i + 1], 10);
        i++;
      }
      const current = stack[stack.length - 1];
      for (const el in top) {
        current[el] = (current[el] || 0) + top[el] * multiplier;
      }
    } else if (/^[A-Z][a-z]?$/.test(token)) {
      let count = 1;
      if (i + 1 < tokens.length && /^\d+$/.test(tokens[i + 1])) {
        count = parseInt(tokens[i + 1], 10);
        i++;
      }
      const current = stack[stack.length - 1];
      current[token] = (current[token] || 0) + count;
    }
  }

  const finalAtoms = stack[0];
  for (const el in finalAtoms) {
    result[el] = finalAtoms[el];
  }
  return result;
}

/**
 * Calculates molar mass (Mr) of a compound from formula
 */
export function calculateMolarMass(atoms: AtomCount): number {
  let mass = 0;
  for (const el in atoms) {
    const weight = ATOMIC_WEIGHTS[el] || 12.0; // fallback
    mass += weight * atoms[el];
  }
  return parseFloat(mass.toFixed(3));
}

// Greatest Common Divisor & Least Common Multiple
function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(Math.round((a * b) / gcd(a, b)));
}

/**
 * Balances a chemical equation string e.g. "Fe2O3 + CO -> Fe + CO2"
 */
export function balanceEquation(equationStr: string): BalancedResult {
  const arrowMatch = equationStr.match(/(?:->|-->|=>|==>|=)/);
  if (!arrowMatch) {
    return {
      success: false,
      message: 'Gunakan tanda panah "->" atau "=" untuk memisahkan reaktan dan produk.',
      reactants: [],
      products: [],
      balancedString: '',
      elementAudit: [],
    };
  }

  const parts = equationStr.split(/(?:->|-->|=>|==>|=)/);
  if (parts.length !== 2) {
    return {
      success: false,
      message: 'Persamaan harus memiliki sisi kiri (reaktan) dan sisi kanan (produk).',
      reactants: [],
      products: [],
      balancedString: '',
      elementAudit: [],
    };
  }

  const reactantStrings = parts[0].split('+').map((s) => s.trim()).filter(Boolean);
  const productStrings = parts[1].split('+').map((s) => s.trim()).filter(Boolean);

  if (reactantStrings.length === 0 || productStrings.length === 0) {
    return {
      success: false,
      message: 'Reaktan dan produk tidak boleh kosong.',
      reactants: [],
      products: [],
      balancedString: '',
      elementAudit: [],
    };
  }

  const reactants = reactantStrings.map((raw) => ({
    raw: raw.replace(/^\d+/, ''), // strip user leading coefficient if any
    atoms: parseFormula(raw.replace(/^\d+/, '')),
    coefficient: 1,
  }));

  const products = productStrings.map((raw) => ({
    raw: raw.replace(/^\d+/, ''),
    atoms: parseFormula(raw.replace(/^\d+/, '')),
    coefficient: 1,
  }));

  // Collect all unique elements
  const elementSet = new Set<string>();
  reactants.forEach((r) => Object.keys(r.atoms).forEach((el) => elementSet.add(el)));
  products.forEach((p) => Object.keys(p.atoms).forEach((el) => elementSet.add(el)));
  const elements = Array.from(elementSet);

  if (elements.length === 0) {
    return {
      success: false,
      message: 'Tidak ditemukan rumus kimia yang valid.',
      reactants: [],
      products: [],
      balancedString: '',
      elementAudit: [],
    };
  }

  // Build matrix for linear system
  // Rows = elements, Columns = compounds (reactants positive, products negative)
  const totalCompounds = reactants.length + products.length;
  const matrix: number[][] = [];

  for (const el of elements) {
    const row: number[] = [];
    reactants.forEach((r) => row.push(r.atoms[el] || 0));
    products.forEach((p) => row.push(-(p.atoms[el] || 0)));
    matrix.push(row);
  }

  // Solve matrix equation using rational Gaussian elimination
  const coefficients = solveMatrixNullspace(matrix, totalCompounds);

  if (!coefficients) {
    return {
      success: false,
      message: 'Reaksi ini tidak dapat disetarakan secara kimiawi (pastikan atom di kedua sisi sepadan).',
      reactants,
      products,
      balancedString: '',
      elementAudit: [],
    };
  }

  // Assign coefficients
  for (let i = 0; i < reactants.length; i++) {
    reactants[i].coefficient = coefficients[i];
  }
  for (let i = 0; i < products.length; i++) {
    products[i].coefficient = coefficients[reactants.length + i];
  }

  // Element Audit (check conservation)
  const elementAudit = elements.map((el) => {
    const left = reactants.reduce((sum, r) => sum + (r.atoms[el] || 0) * r.coefficient, 0);
    const right = products.reduce((sum, p) => sum + (p.atoms[el] || 0) * p.coefficient, 0);
    return {
      element: el,
      left,
      right,
      balanced: left === right,
    };
  });

  const balancedString =
    reactants.map((r) => `${r.coefficient > 1 ? r.coefficient : ''}${r.raw}`).join(' + ') +
    ' ⟶ ' +
    products.map((p) => `${p.coefficient > 1 ? p.coefficient : ''}${p.raw}`).join(' + ');

  return {
    success: true,
    reactants,
    products,
    balancedString,
    elementAudit,
  };
}

/**
 * Solves Ax = 0 for integer solution using Gaussian elimination
 */
function solveMatrixNullspace(A: number[][], numVars: number): number[] | null {
  const rows = A.length;
  const cols = numVars;

  // Clone matrix as Fraction representations [numerator, denominator]
  type Fraction = [number, number];
  const simplify = (f: Fraction): Fraction => {
    if (f[0] === 0) return [0, 1];
    let g = gcd(f[0], f[1]);
    let num = f[0] / g;
    let den = f[1] / g;
    if (den < 0) {
      num = -num;
      den = -den;
    }
    return [num, den];
  };

  const add = (a: Fraction, b: Fraction): Fraction => {
    return simplify([a[0] * b[1] + b[0] * a[1], a[1] * b[1]]);
  };

  const sub = (a: Fraction, b: Fraction): Fraction => {
    return simplify([a[0] * b[1] - b[0] * a[1], a[1] * b[1]]);
  };

  const mul = (a: Fraction, b: Fraction): Fraction => {
    return simplify([a[0] * b[0], a[1] * b[1]]);
  };

  const div = (a: Fraction, b: Fraction): Fraction => {
    if (b[0] === 0) return [0, 1];
    return simplify([a[0] * b[1], a[1] * b[0]]);
  };

  const M: Fraction[][] = A.map((row) => row.map((val) => [val, 1]));

  let lead = 0;
  for (let r = 0; r < rows; r++) {
    if (lead >= cols) break;
    let i = r;
    while (M[i][lead][0] === 0) {
      i++;
      if (i === rows) {
        i = r;
        lead++;
        if (lead === cols) break;
      }
    }
    if (lead === cols) break;

    // Swap rows
    const temp = M[i];
    M[i] = M[r];
    M[r] = temp;

    // Divide pivot row by pivot value
    const pivot = M[r][lead];
    for (let j = 0; j < cols; j++) {
      M[r][j] = div(M[r][j], pivot);
    }

    // Eliminate other rows
    for (let k = 0; k < rows; k++) {
      if (k !== r) {
        const factor = M[k][lead];
        for (let j = 0; j < cols; j++) {
          M[k][j] = sub(M[k][j], mul(factor, M[r][j]));
        }
      }
    }
    lead++;
  }

  // Set the free variable (last variable = 1) and back-substitute
  // Typically chemical equations have 1 degree of freedom
  const sol: Fraction[] = new Array(cols).fill([0, 1]);
  sol[cols - 1] = [1, 1];

  for (let r = rows - 1; r >= 0; r--) {
    let pivotCol = -1;
    for (let c = 0; c < cols; c++) {
      if (M[r][c][0] !== 0) {
        pivotCol = c;
        break;
      }
    }
    if (pivotCol !== -1 && pivotCol !== cols - 1) {
      let sum: Fraction = [0, 1];
      for (let c = pivotCol + 1; c < cols; c++) {
        sum = add(sum, mul(M[r][c], sol[c]));
      }
      sol[pivotCol] = sub([0, 1], sum);
    }
  }

  // Check if any solution coefficient is zero or non-positive
  // Find LCM of all denominators to turn all into integers
  let commonDen = 1;
  for (const s of sol) {
    if (s[1] > 0) {
      commonDen = lcm(commonDen, s[1]);
    }
  }

  const intCoeffs = sol.map((s) => (s[0] * commonDen) / s[1]);

  // If all are negative, negate
  const allNegative = intCoeffs.every((c) => c <= 0);
  const adjusted = allNegative ? intCoeffs.map((c) => -c) : intCoeffs;

  // Make sure all are strictly positive integers
  if (adjusted.some((c) => c <= 0)) {
    // Fallback: heuristic search for small coefficients if Gaussian had multiple free variables
    return heuristicBalance(A, numVars);
  }

  // Simplify by GCD of all coefficients
  let overallGcd = adjusted[0];
  for (let i = 1; i < adjusted.length; i++) {
    overallGcd = gcd(overallGcd, adjusted[i]);
  }

  return adjusted.map((c) => c / overallGcd);
}

function heuristicBalance(A: number[][], numVars: number): number[] | null {
  // Small integer trial search up to coefficient 12
  if (numVars > 6) return null;

  const maxC = 12;
  const loop = (depth: number, current: number[]): number[] | null => {
    if (depth === numVars) {
      // Check if A * current === 0
      for (const row of A) {
        let sum = 0;
        for (let j = 0; j < numVars; j++) {
          sum += row[j] * current[j];
        }
        if (sum !== 0) return null;
      }
      return current;
    }

    for (let c = 1; c <= maxC; c++) {
      const res = loop(depth + 1, [...current, c]);
      if (res) return res;
    }
    return null;
  };

  return loop(0, []);
}

// Preset popular chemistry reaction equations for schools & university prep
export interface ReactionPreset {
  name: string;
  category: 'Pembakaran' | 'Netralisasi' | 'Pengendapan' | 'Redoks' | 'Industri';
  equation: string;
  description: string;
}

export const PRESET_REACTIONS: ReactionPreset[] = [
  {
    name: 'Pembakaran Propana',
    category: 'Pembakaran',
    equation: 'C3H8 + O2 -> CO2 + H2O',
    description: 'Pembakaran sempurna bahan bakar elpiji (LPG) yang menghasilkan karbon dioksida dan uap air.',
  },
  {
    name: 'Pembakaran Glukosa (Respirasi Seluler)',
    category: 'Pembakaran',
    equation: 'C6H12O6 + O2 -> CO2 + H2O',
    description: 'Reaksi metabolisme biologis pelepasan energi biokimia ATP pada organisme aerob.',
  },
  {
    name: 'Netralisasi Asam Klorida & Natrium Hidroksida',
    category: 'Netralisasi',
    equation: 'HCl + NaOH -> NaCl + H2O',
    description: 'Reaksi asam kuat dan basa kuat membentuk garam dapur netral dan air murni.',
  },
  {
    name: 'Netralisasi Asam Sulfat & Kalium Hidroksida',
    category: 'Netralisasi',
    equation: 'H2SO4 + KOH -> K2SO4 + H2O',
    description: 'Pembentukan pupuk kalium sulfat melalui reaksi penetralan asam diprotik.',
  },
  {
    name: 'Pengendapan Perak Klorida (Uji Klorida)',
    category: 'Pengendapan',
    equation: 'AgNO3 + NaCl -> AgCl + NaNO3',
    description: 'Reaksi pengendapan endapan putih perak klorida (AgCl) yang peka cahaya.',
  },
  {
    name: 'Reduksi Bijih Besi (Tanur Tiup)',
    category: 'Redoks',
    equation: 'Fe2O3 + CO -> Fe + CO2',
    description: 'Reduksi hematit menggunakan gas karbon monoksida untuk menghasilkan besi murni pada tanur tiup industri baja.',
  },
  {
    name: 'Redoks Kalium Permanganat & Asam Klorida',
    category: 'Redoks',
    equation: 'KMnO4 + HCl -> KCl + MnCl2 + H2O + Cl2',
    description: 'Oksidasi asam klorida oleh oksidator kuat KMnO4 menghasilkan gas klorin beracun berwarna kuning kehijauan.',
  },
  {
    name: 'Sintesis Amonia (Proses Haber-Bosch)',
    category: 'Industri',
    equation: 'N2 + H2 -> NH3',
    description: 'Fiksasi nitrogen industri skala masif pemenang Hadiah Nobel untuk sintesis pupuk dunia.',
  },
  {
    name: 'Proses Kontak Asam Sulfat (Oksidasi SO2)',
    category: 'Industri',
    equation: 'SO2 + O2 -> SO3',
    description: 'Katalisis heterogen vanadium pentoksida (V2O5) dalam pembuatan asam sulfat pekat.',
  },
];
