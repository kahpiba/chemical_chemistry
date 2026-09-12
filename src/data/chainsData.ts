/**
 * Chemical Chains & Polymers Data & Calculation Engine.
 * Comprehensive hydrocarbon homologous series, polymers, and stoichiometry.
 */

export type HydrocarbonSeries = 'alkane' | 'alkene' | 'alkyne' | 'cycloalkane' | 'polymer';

export interface ChainItemData {
  carbonCount: number;
  iupacName: string;
  commonName?: string;
  formula: string;
  condensedFormula: string;
  molecularWeight: number; // g/mol
  boilingPoint: number; // °C
  meltingPoint: number; // °C
  density: number; // g/cm³ at 20°C
  phaseAtRoomTemp: 'Gas' | 'Cair' | 'Padat';
  deltaHCombustion: number; // kJ/mol
  uses: string;
  lore: string;
}

export interface PolymerData {
  id: string;
  name: string;
  tradeName?: string;
  monomerName: string;
  monomerFormula: string;
  repeatingUnit: string;
  polymerType: 'Adisi' | 'Kondensasi';
  density: number; // g/cm³
  meltingPoint: number; // °C
  properties: string[];
  applications: string;
  recyclingCode?: number;
}

// -------------------------------------------------------------
// HOMOLOGOUS ALKANE SERIES (C1 - C20)
// -------------------------------------------------------------
export const ALKANE_SERIES: ChainItemData[] = [
  {
    carbonCount: 1,
    iupacName: 'Metana',
    commonName: 'Gas Rawa / Gas Alam',
    formula: 'CH₄',
    condensedFormula: 'CH₄',
    molecularWeight: 16.043,
    boilingPoint: -161.5,
    meltingPoint: -182.5,
    density: 0.000656,
    phaseAtRoomTemp: 'Gas',
    deltaHCombustion: -890.8,
    uses: 'Bahan bakar pembangkit listrik (PLTG), LNG, dan biogas ramah lingkungan.',
    lore: 'Molekul hidrokarbon paling sederhana di alam semesta. Memiliki geometri tetrahedral simetris sempurna dengan sudut ikatan 109.5°.',
  },
  {
    carbonCount: 2,
    iupacName: 'Etana',
    formula: 'C₂H₆',
    condensedFormula: 'CH₃-CH₃',
    molecularWeight: 30.070,
    boilingPoint: -88.6,
    meltingPoint: -182.8,
    density: 0.00126,
    phaseAtRoomTemp: 'Gas',
    deltaHCombustion: -1560.7,
    uses: 'Bahan baku utama industri petrokimia untuk pembuatan plastik polietilena via perengkahan (steam cracking).',
    lore: 'Konformasi silang (staggered) dari etana 12 kJ/mol lebih stabil daripada konformasi gerhana (eclipsed) akibat tolakan elektron pasangan ikatan C-H.',
  },
  {
    carbonCount: 3,
    iupacName: 'Propana',
    commonName: 'Gas LPG',
    formula: 'C₃H₈',
    condensedFormula: 'CH₃-CH₂-CH₃',
    molecularWeight: 44.097,
    boilingPoint: -42.1,
    meltingPoint: -187.7,
    density: 0.00187,
    phaseAtRoomTemp: 'Gas',
    deltaHCombustion: -2220.0,
    uses: 'Komponen utama tabung gas elpiji (LPG) rumah tangga dan gas pemanas portabel.',
    lore: 'Rantai karbon mulai membentuk struktur zigzag bersudut 109.5°. Mudah dicairkan di bawah tekanan sedang untuk disimpan dalam silinder baja.',
  },
  {
    carbonCount: 4,
    iupacName: 'Butana',
    commonName: 'Gas Korek Api',
    formula: 'C₄H₁₀',
    condensedFormula: 'CH₃-CH₂-CH₂-CH₃',
    molecularWeight: 58.124,
    boilingPoint: -0.5,
    meltingPoint: -138.4,
    density: 0.00248,
    phaseAtRoomTemp: 'Gas',
    deltaHCombustion: -2877.5,
    uses: 'Bahan bakar korek api gas (lighter), aerosol propelan, dan campuran gas elpiji.',
    lore: 'Memiliki isomer kerangka pertama dalam deret alkana: n-butana (rantai lurus) dan isobutana/2-metilpropana (rantai bercabang).',
  },
  {
    carbonCount: 5,
    iupacName: 'Pentana',
    formula: 'C₅H₁₂',
    condensedFormula: 'CH₃-(CH₂)₃-CH₃',
    molecularWeight: 72.151,
    boilingPoint: 36.1,
    meltingPoint: -129.7,
    density: 0.626,
    phaseAtRoomTemp: 'Cair',
    deltaHCombustion: -3535.0,
    uses: 'Pelarut non-polar laboratorium, bahan peniup busa polystyrene (styrofoam).',
    lore: 'Alkana pertama yang berwujud cair pada suhu kamar normal. Sangat mudah menguap dengan aroma bensin ringan.',
  },
  {
    carbonCount: 6,
    iupacName: 'Heksana',
    formula: 'C₆H₁₄',
    condensedFormula: 'CH₃-(CH₂)₄-CH₃',
    molecularWeight: 86.178,
    boilingPoint: 68.7,
    meltingPoint: -95.3,
    density: 0.655,
    phaseAtRoomTemp: 'Cair',
    deltaHCombustion: -4163.0,
    uses: 'Pelarut ekstraksi minyak nabati (kelapa sawit, kedelai, kacang) dan pembersih industri.',
    lore: 'Memiliki 5 isomer struktur. Rantai karbonnya sangat fleksibel dan dapat berputar bebas pada poros ikatan tunggal C-C.',
  },
  {
    carbonCount: 7,
    iupacName: 'Heptana',
    formula: 'C₇H₁₆',
    condensedFormula: 'CH₃-(CH₂)₅-CH₃',
    molecularWeight: 100.205,
    boilingPoint: 98.4,
    meltingPoint: -90.6,
    density: 0.684,
    phaseAtRoomTemp: 'Cair',
    deltaHCombustion: -4817.0,
    uses: 'Standar referensi angka oktan bensin dengan nilai 0 (sangat mudah mengalami knocking mesin).',
    lore: 'n-Heptana menyebabkan ketukan mesin (knocking) parah karena mudah terbakar prematur di dalam silinder mesin kompresi tinggi.',
  },
  {
    carbonCount: 8,
    iupacName: 'Oktana',
    commonName: 'Komponen Bensin',
    formula: 'C₈H₁₈',
    condensedFormula: 'CH₃-(CH₂)₆-CH₃',
    molecularWeight: 114.232,
    boilingPoint: 125.7,
    meltingPoint: -56.8,
    density: 0.703,
    phaseAtRoomTemp: 'Cair',
    deltaHCombustion: -5470.0,
    uses: 'Komponen utama bahan bakar bensin kendaraan (RON 90, 92 Pertamax, 98 Turbo via isomer iso-oktana).',
    lore: 'Isomernya, 2,2,4-trimetilpentana (iso-oktana), dijadikan standar nilai 100 pada skala oktan karena terbakar sangat mulus tanpa ketukan.',
  },
  {
    carbonCount: 9,
    iupacName: 'Nonana',
    formula: 'C₉H₂₀',
    condensedFormula: 'CH₃-(CH₂)₇-CH₃',
    molecularWeight: 128.259,
    boilingPoint: 150.8,
    meltingPoint: -53.5,
    density: 0.718,
    phaseAtRoomTemp: 'Cair',
    deltaHCombustion: -6125.0,
    uses: 'Fraksi minyak tanah (kerosin), solar, dan pelarut cat/tiner industri.',
    lore: 'Memiliki 35 isomer struktur yang mungkin terjadi secara teoritis.',
  },
  {
    carbonCount: 10,
    iupacName: 'Dekana',
    formula: 'C₁₀H₂₂',
    condensedFormula: 'CH₃-(CH₂)₈-CH₃',
    molecularWeight: 142.286,
    boilingPoint: 174.1,
    meltingPoint: -29.7,
    density: 0.730,
    phaseAtRoomTemp: 'Cair',
    deltaHCombustion: -6778.0,
    uses: 'Komponen penting bahan bakar penerbangan (Avtur / Jet-A1) dan solar mesin diesel.',
    lore: 'Kerapatan massa jenis dan viskositasnya mulai meningkat nyata seiring bertambahnya gaya tarik antarmolekul dispersi London.',
  },
  {
    carbonCount: 11,
    iupacName: 'Undekana',
    formula: 'C₁₁H₂₄',
    condensedFormula: 'CH₃-(CH₂)₉-CH₃',
    molecularWeight: 156.313,
    boilingPoint: 195.9,
    meltingPoint: -25.6,
    density: 0.740,
    phaseAtRoomTemp: 'Cair',
    deltaHCombustion: -7431.0,
    uses: 'Minyak tanah, feromon penanda jejak beberapa spesies semut dan serangga.',
    lore: 'Serangga seperti semut menggunakan undekana sebagai sinyal alarm kimiawi feromon untuk memperingatkan koloninya.',
  },
  {
    carbonCount: 12,
    iupacName: 'Dodekana',
    formula: 'C₁₂H₂₆',
    condensedFormula: 'CH₃-(CH₂)₁₀-CH₃',
    molecularWeight: 170.340,
    boilingPoint: 216.3,
    meltingPoint: -9.6,
    density: 0.749,
    phaseAtRoomTemp: 'Cair',
    deltaHCombustion: -8086.0,
    uses: 'Pelarut ekstraksi industri nuklir, bahan pengencer tinta cetak, dan komponen solar.',
    lore: 'Titik leburnya sudah mendekati suhu es (-9.6°C), sehingga mulai membeku pada musim dingin di daerah subtropis.',
  },
  {
    carbonCount: 14,
    iupacName: 'Tetradekana',
    formula: 'C₁₄H₃₀',
    condensedFormula: 'CH₃-(CH₂)₁₂-CH₃',
    molecularWeight: 198.394,
    boilingPoint: 253.5,
    meltingPoint: 5.9,
    density: 0.763,
    phaseAtRoomTemp: 'Cair',
    deltaHCombustion: -9394.0,
    uses: 'Bahan bakar minyak solar (diesel oil) dan pelumas rantai mesin.',
    lore: 'Mulai memadat pada suhu 5.9°C. Alasan mengapa minyak solar membutuhkan aditif anti-gelling di musim dingin.',
  },
  {
    carbonCount: 16,
    iupacName: 'Heksadekana',
    commonName: 'Setana',
    formula: 'C₁₆H₃₄',
    condensedFormula: 'CH₃-(CH₂)₁₄-CH₃',
    molecularWeight: 226.448,
    boilingPoint: 286.9,
    meltingPoint: 18.2,
    density: 0.773,
    phaseAtRoomTemp: 'Cair',
    deltaHCombustion: -10700.0,
    uses: 'Standar referensi angka setana (Cetane Number = 100) untuk kualitas bahan bakar mesin diesel.',
    lore: 'Angka setana mengukur seberapa cepat bahan bakar menyala spontan saat dikompresi di dalam silinder diesel tanpa busi.',
  },
  {
    carbonCount: 18,
    iupacName: 'Oktadekana',
    formula: 'C₁₈H₃₈',
    condensedFormula: 'CH₃-(CH₂)₁₆-CH₃',
    molecularWeight: 254.502,
    boilingPoint: 316.1,
    meltingPoint: 28.2,
    density: 0.777,
    phaseAtRoomTemp: 'Padat',
    deltaHCombustion: -12000.0,
    uses: 'Lilin parafin, bahan penyimpanan energi panas laten (Phase Change Materials / PCM).',
    lore: 'Alkana pertama dalam deret homolog ini yang berwujud padatan lilin putih pada suhu kamar normal (25°C).',
  },
  {
    carbonCount: 20,
    iupacName: 'Ikosana',
    formula: 'C₂₀H₄₂',
    condensedFormula: 'CH₃-(CH₂)₁₈-CH₃',
    molecularWeight: 282.556,
    boilingPoint: 343.0,
    meltingPoint: 36.8,
    density: 0.789,
    phaseAtRoomTemp: 'Padat',
    deltaHCombustion: -13310.0,
    uses: 'Lilin parafin keras, salep pelindung vaselin (petroleum jelly), pelumas mesin industri berat.',
    lore: 'Rantai 20 karbon membentuk kristal padatan lilin yang licin dan tahan terhadap serangan asam atau basa kuat.',
  },
];

// -------------------------------------------------------------
// POLYMERS DATA (MACROMOLECULES)
// -------------------------------------------------------------
export const POLYMER_CATALOG: PolymerData[] = [
  {
    id: 'polyethylene',
    name: 'Polietilena (PE)',
    tradeName: 'HDPE / LDPE',
    monomerName: 'Etena (Etilena)',
    monomerFormula: 'CH₂=CH₂',
    repeatingUnit: '[-CH₂-CH₂-]',
    polymerType: 'Adisi',
    density: 0.95,
    meltingPoint: 130,
    properties: ['Fleksibel', 'Tahan air & kimia', 'Isolator listrik unggul', 'Dapat didaur ulang'],
    applications: 'Kantong plastik kresek, botol deterjen, wadah makanan, pipa saluran air HDPE.',
    recyclingCode: 2,
  },
  {
    id: 'polypropylene',
    name: 'Polipropilena (PP)',
    monomerName: 'Propena (Propilena)',
    monomerFormula: 'CH₂=CH-CH₃',
    repeatingUnit: '[-CH₂-CH(CH₃)-]',
    polymerType: 'Adisi',
    density: 0.91,
    meltingPoint: 165,
    properties: ['Titik leleh tinggi', 'Tahan panas microwave', 'Ringan & liat', 'Tahan lelah tekuk'],
    applications: 'Kotak makanan Tupperware, tutup botol minuman, sedotan plastik, tali tambang sintetis.',
    recyclingCode: 5,
  },
  {
    id: 'polyvinyl_chloride',
    name: 'Polivinil Klorida (PVC)',
    tradeName: 'Paralon',
    monomerName: 'Vinil Klorida (Kloroetena)',
    monomerFormula: 'CH₂=CH-Cl',
    repeatingUnit: '[-CH₂-CH(Cl)-]',
    polymerType: 'Adisi',
    density: 1.38,
    meltingPoint: 212,
    properties: ['Kaku & kokoh', 'Tahan api alami', 'Tahan cuaca ekstrem', 'Tahan korosi'],
    applications: 'Pipa saluran air paralon, kusen jendela uPVC, pelapis kabel listrik, kartu ATM.',
    recyclingCode: 3,
  },
  {
    id: 'polystyrene',
    name: 'Polistirena (PS)',
    tradeName: 'Styrofoam',
    monomerName: 'Stirena (Vinilbenzena)',
    monomerFormula: 'CH₂=CH-C₆H₅',
    repeatingUnit: '[-CH₂-CH(C₆H₅)-]',
    polymerType: 'Adisi',
    density: 1.05,
    meltingPoint: 240,
    properties: ['Bening kristal jika padat', 'Peredam benturan hebat jika dibusa', 'Isolator panas'],
    applications: 'Kemasan makanan styrofoam, wadah es krim, sendok/garpu plastik sekali pakai, casing CD.',
    recyclingCode: 6,
  },
  {
    id: 'ptfe_teflon',
    name: 'Politetrafluoroetilena (PTFE)',
    tradeName: 'Teflon',
    monomerName: 'Tetrafluoroetena',
    monomerFormula: 'CF₂=CF₂',
    repeatingUnit: '[-CF₂-CF₂-]',
    polymerType: 'Adisi',
    density: 2.20,
    meltingPoint: 327,
    properties: ['Sangat licin (koefisien gesek terendah)', 'Tahan panas hingga 260°C', 'Anti-lengket ekstrem'],
    applications: 'Lapisan wajan anti-lengket, pita seal pipa ledeng, katup jantung buatan medis.',
  },
  {
    id: 'nylon_66',
    name: 'Nilon-6,6 (Poliamida)',
    tradeName: 'Nylon',
    monomerName: 'Asam Adipat + Heksametilendiamina',
    monomerFormula: 'HOOC(CH₂)₄COOH + H₂N(CH₂)₆NH₂',
    repeatingUnit: '[-NH(CH₂)₆NH-CO(CH₂)₄CO-]',
    polymerType: 'Kondensasi',
    density: 1.14,
    meltingPoint: 265,
    properties: ['Kekuatan tarik luar biasa', 'Elastis & ulet', 'Tahan gesekan mekanik tinggi'],
    applications: 'Serat pakaian parasut, senar pancing, bulu sikat gigi, roda gigi sintetis mesin.',
    recyclingCode: 7,
  },
];

// -------------------------------------------------------------
// REAL-TIME CHEMICAL CALCULATION UTILITIES
// -------------------------------------------------------------

export interface ChainCalculationsResult {
  formula: string;
  condensedFormula: string;
  name: string;
  molecularWeight: number; // g/mol
  percentC: number; // %
  percentH: number; // %
  estimatedBoilingPoint: number; // °C
  estimatedMeltingPoint: number; // °C
  phase: 'Gas' | 'Cair' | 'Padat';
  density: number; // g/cm³
  // Stoichiometry
  o2MolesRequired: number; // per mol fuel
  co2MolesProduced: number; // per mol fuel
  h2oMolesProduced: number; // per mol fuel
  co2VolumeSTP: number; // Liters per mol fuel at STP
  deltaHCombustion: number; // kJ/mol
  specificEnergy: number; // kJ/g
  carbonIntensity: number; // g CO2 per g fuel burned
}

/**
 * Calculate all physical and chemical properties dynamically for any carbon chain length (n).
 */
export function calculateChainProperties(
  n: number,
  series: HydrocarbonSeries
): ChainCalculationsResult {
  let cCount = n;
  let hCount = 2 * n + 2; // Default Alkane
  let prefix = getIUPACPrefix(n);
  let name = `${prefix}ana`;

  if (series === 'alkene') {
    cCount = Math.max(2, n);
    hCount = 2 * cCount;
    prefix = getIUPACPrefix(cCount);
    name = cCount === 2 ? 'Etena' : `1-${prefix}ena`;
  } else if (series === 'alkyne') {
    cCount = Math.max(2, n);
    hCount = 2 * cCount - 2;
    prefix = getIUPACPrefix(cCount);
    name = cCount === 2 ? 'Etuna' : `1-${prefix}una`;
  } else if (series === 'cycloalkane') {
    cCount = Math.max(3, n);
    hCount = 2 * cCount;
    prefix = getIUPACPrefix(cCount);
    name = `Siklo${prefix.toLowerCase()}ana`;
  }

  // Formula string
  const formula = `C${cCount > 1 ? cCount : ''}H${hCount}`;

  // Condensed Formula
  let condensedFormula = '';
  if (series === 'alkane') {
    if (cCount === 1) condensedFormula = 'CH₄';
    else if (cCount === 2) condensedFormula = 'CH₃-CH₃';
    else if (cCount === 3) condensedFormula = 'CH₃-CH₂-CH₃';
    else condensedFormula = `CH₃-(CH₂)₍${cCount - 2}₎-CH₃`;
  } else if (series === 'alkene') {
    if (cCount === 2) condensedFormula = 'CH₂=CH₂';
    else if (cCount === 3) condensedFormula = 'CH₂=CH-CH₃';
    else condensedFormula = `CH₂=CH-(CH₂)₍${cCount - 3}₎-CH₃`;
  } else if (series === 'alkyne') {
    if (cCount === 2) condensedFormula = 'CH≡CH';
    else if (cCount === 3) condensedFormula = 'CH≡C-CH₃';
    else condensedFormula = `CH≡C-(CH₂)₍${cCount - 3}₎-CH₃`;
  } else {
    condensedFormula = `(CH₂)₍${cCount}₎ [Cincin]`;
  }

  // Molecular Weight (Mr)
  const cWeight = 12.011;
  const hWeight = 1.008;
  const molecularWeight = Number((cCount * cWeight + hCount * hWeight).toFixed(3));

  // Mass composition %
  const percentC = Number(((cCount * cWeight / molecularWeight) * 100).toFixed(1));
  const percentH = Number(((hCount * hWeight / molecularWeight) * 100).toFixed(1));

  // Predicted Boiling Point via London dispersion formula:
  // BP roughly correlates with log/linear function of carbon count
  let estimatedBoilingPoint = -162 + (cCount - 1) * 28.5 - Math.log(cCount) * 4;
  if (series === 'alkene') estimatedBoilingPoint -= 5;
  if (series === 'alkyne') estimatedBoilingPoint += 8;
  if (series === 'cycloalkane') estimatedBoilingPoint += 15;
  estimatedBoilingPoint = Number(estimatedBoilingPoint.toFixed(1));

  // Predicted Melting Point
  let estimatedMeltingPoint = -183 + (cCount - 1) * 12.0;
  estimatedMeltingPoint = Number(estimatedMeltingPoint.toFixed(1));

  // Phase at room temperature (25°C)
  let phase: 'Gas' | 'Cair' | 'Padat' = 'Cair';
  if (estimatedBoilingPoint < 25) {
    phase = 'Gas';
  } else if (estimatedMeltingPoint > 25 || cCount >= 18) {
    phase = 'Padat';
  }

  // Density estimation (g/cm³)
  let density = 0.0018 * (molecularWeight / 44.0);
  if (phase === 'Cair' || phase === 'Padat') {
    density = Number((0.60 + Math.min(0.25, cCount * 0.011)).toFixed(3));
  } else {
    density = Number(density.toFixed(5));
  }

  // Combustion Stoichiometry:
  // Cn Hm + (n + m/4) O2 -> n CO2 + (m/2) H2O
  const o2MolesRequired = cCount + hCount / 4;
  const co2MolesProduced = cCount;
  const h2oMolesProduced = hCount / 2;
  const co2VolumeSTP = Number((co2MolesProduced * 22.414).toFixed(1));

  // Enthalpy of Combustion: ~ -650 kJ/mol per CH2 unit + baseline
  const deltaHCombustion = Number((-280 - cCount * 653).toFixed(1));
  const specificEnergy = Number((Math.abs(deltaHCombustion) / molecularWeight).toFixed(1)); // kJ/g

  // Carbon Intensity: g of CO2 per g of fuel burned
  const co2MassProduced = co2MolesProduced * 44.01;
  const carbonIntensity = Number((co2MassProduced / molecularWeight).toFixed(2));

  return {
    formula,
    condensedFormula,
    name,
    molecularWeight,
    percentC,
    percentH,
    estimatedBoilingPoint,
    estimatedMeltingPoint,
    phase,
    density,
    o2MolesRequired,
    co2MolesProduced,
    h2oMolesProduced,
    co2VolumeSTP,
    deltaHCombustion,
    specificEnergy,
    carbonIntensity,
  };
}

export function getIUPACPrefix(n: number): string {
  const prefixes: { [k: number]: string } = {
    1: 'Met',
    2: 'Et',
    3: 'Prop',
    4: 'But',
    5: 'Pent',
    6: 'Heks',
    7: 'Hept',
    8: 'Okt',
    9: 'Non',
    10: 'Dek',
    11: 'Undek',
    12: 'Dodek',
    13: 'Tridek',
    14: 'Tetradek',
    15: 'Pentadek',
    16: 'Heksadek',
    17: 'Heptadek',
    18: 'Oktadek',
    19: 'Nonadek',
    20: 'Ikos',
  };
  return prefixes[n] || `${n}-karb`;
}
