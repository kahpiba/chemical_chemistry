export interface QuestStep {
  stepNumber: number;
  title: string;
  instruction: string;
  testType: 'flame' | 'acid' | 'solubility' | 'calculation' | 'selection';
  options: {
    id: string;
    label: string;
    description: string;
    isCorrect: boolean;
    feedback: string;
  }[];
  hint: string;
}

export interface ChemistryQuest {
  id: string;
  title: string;
  badge: string;
  difficulty: 'Mudah' | 'Sedang' | 'Tantangan';
  topic: string;
  scenario: string;
  objective: string;
  steps: QuestStep[];
  conclusion: string;
  rewardPoints: number;
}

export const CHEMISTRY_QUESTS: ChemistryQuest[] = [
  {
    id: 'white_powder_mystery',
    title: 'Misteri Bubuk Putih di Dapur Laboratorium',
    badge: 'Detektif Forensik',
    difficulty: 'Mudah',
    topic: 'Identifikasi Kation, Anion & Uji Nyala',
    scenario:
      'Teknisi laboratorium menemukan toples kaca tanpa label yang tertinggal di dekat ruang persediaan. Di dalamnya terdapat serbuk kristal putih halus tak berbau. Apakah ini Gula (Sukrosa), Garam Dapur (NaCl), Baking Soda (NaHCO₃), atau Kapur (CaCO₃)?',
    objective:
      'Lakukan uji kualitatif laboratorium (kelarutan, uji nyala api Bunsen, dan reaksi asam) untuk mengungkap identitas kimia zat tersebut.',
    steps: [
      {
        stepNumber: 1,
        title: 'Langkah 1: Pengujian Kelarutan dalam Akuades',
        instruction:
          'Kamu mengambil 1 spatula bubuk ke dalam tabung reaksi berisi 10 mL air murni, lalu mengocoknya perlahan. Apa yang teramati?',
        testType: 'solubility',
        options: [
          {
            id: 'sol_insoluble',
            label: 'Bubuk tidak larut dan mengendap keruh di dasar tabung',
            description: 'Mengindikasikan zat sukar larut seperti Kalsium Karbonat (CaCO₃).',
            isCorrect: false,
            feedback: 'Salah. Di laboratorium nyata, bubuk putih ini langsung larut jernih tanpa endapan!',
          },
          {
            id: 'sol_soluble',
            label: 'Bubuk larut sempurna menghasilkan larutan jernih homogen',
            description: 'Menyingkirkan CaCO₃ (batu kapur sukar larut). Menyisakan NaCl, NaHCO₃, atau Sukrosa.',
            isCorrect: true,
            feedback: 'Tepat! Zat ini mudah larut dalam air, membuktikan bahwa zat bukan CaCO₃.',
          },
        ],
        hint: 'Kalsium karbonat (CaCO₃) memiliki Ksp sangat kecil (~3.3 × 10⁻⁹) sehingga tidak larut dalam air netral.',
      },
      {
        stepNumber: 2,
        title: 'Langkah 2: Uji Nyala Api Kawat Nikrom',
        instruction:
          'Celupkan kawat nikrom bersih ke dalam larutan sampel, lalu masukkan ke zona panas api pembakar Bunsen. Warna nyala apa yang terpancar?',
        testType: 'flame',
        options: [
          {
            id: 'flame_lilac',
            label: 'Warna Nyala Ungu Muda / Lilac',
            description: 'Karakteristik khas eksitasi elektron kation Kalium (K⁺).',
            isCorrect: false,
            feedback: 'Bukan ungu. Warna yang menyala sangat mencolok dan dominan di spektrum 589 nm.',
          },
          {
            id: 'flame_yellow',
            label: 'Warna Nyala Kuning Keemasan Terang (Intens)',
            description: 'Karakteristik emisi garis spektrum kation Natrium (Na⁺).',
            isCorrect: true,
            feedback: 'Brilian! Nyala kuning terang membuktikan adanya kation Natrium (Na⁺). Sampel adalah garam natrium!',
          },
          {
            id: 'flame_red',
            label: 'Warna Nyala Merah Bata (Brick Red)',
            description: 'Karakteristik kation Kalsium (Ca²⁺).',
            isCorrect: false,
            feedback: 'Bukan merah kalsium. Spektrum emisi menunjukkan panjang gelombang natrium.',
          },
        ],
        hint: 'Logam alkali golongan IA memiliki spektrum emisi nyala spesifik. Natrium (Na) menghasilkan emisi doublet kuning kuat.',
      },
      {
        stepNumber: 3,
        title: 'Langkah 3: Reaksi Penambahan Asam Cuka (CH₃COOH)',
        instruction:
          'Untuk membedakan Garam Dapur (NaCl) dengan Baking Soda (NaHCO₃), kamu meneteskan 5 tetes larutan asam cuka. Apa reaksi kimianya?',
        testType: 'acid',
        options: [
          {
            id: 'acid_no_reaction',
            label: 'Tidak ada perubahan atau gelembung apapun (Hening)',
            description: 'Menunjukkan ion klorida (Cl⁻) yang tidak bereaksi dengan asam lemah encer.',
            isCorrect: false,
            feedback: 'Kurang tepat! Tabung mendadak berdesis dan menghasilkan buih gas yang meluap!',
          },
          {
            id: 'acid_effervescence',
            label: 'Terjadi desisan hebat (effervescence) dan pembentukan gelembung gas CO₂',
            description: 'Reaksi: NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂(g)↑',
            isCorrect: true,
            feedback: 'Sempurna! Reaksi dekomposisi bikarbonat oleh proton menghasilkan gas karbon dioksida!',
          },
        ],
        hint: 'Anion bikarbonat (HCO₃⁻) bereaksi dengan asam membentuk H₂CO₃ yang seketika terurai menjadi H₂O dan gas CO₂.',
      },
      {
        stepNumber: 4,
        title: 'Langkah 4: Kesimpulan Akhir Detektif',
        instruction: 'Berdasarkan seluruh hasil investigasi ilmiah di atas, senyawa apakah bubuk misterius tersebut?',
        testType: 'selection',
        options: [
          {
            id: 'final_nacl',
            label: 'Garam Dapur (NaCl / Natrium Klorida)',
            description: 'Larut dalam air dan nyala kuning, tetapi tidak berdesis dengan asam.',
            isCorrect: false,
            feedback: 'NaCl tidak membebaskan gas CO₂ saat ditetesi cuka!',
          },
          {
            id: 'final_nahco3',
            label: 'Baking Soda (NaHCO₃ / Natrium Bikarbonat)',
            description: 'Larut dalam air, kation Na⁺ (nyala kuning), dan melepaskan CO₂ dengan asam.',
            isCorrect: true,
            feedback: 'KASUS TERPECAHKAN! Bubuk putih tersebut adalah Natrium Bikarbonat (NaHCO₃)!',
          },
          {
            id: 'final_caco3',
            label: 'Kapur Tulis (CaCO₃ / Kalsium Karbonat)',
            description: 'Kalsium karbonat sukar larut dalam air murni.',
            isCorrect: false,
            feedback: 'CaCO₃ tidak larut dalam air murni dan menghasilkan nyala merah bata.',
          },
        ],
        hint: 'Periksa kembali konsistensi hasil: Larut homogen + Kation Na⁺ + Menghasilkan gas CO₂ dengan asam.',
      },
    ],
    conclusion:
      'Analisis forensik selesai! Sampel teridentifikasi 100% sebagai Natrium Bikarbonat (NaHCO₃). Label toples telah diperbarui dan toples disimpan aman di lemari reagen bahan pangan/basa lemah.',
    rewardPoints: 150,
  },
  {
    id: 'polar_battery_engineer',
    title: 'Insinyur Baterai Darurat di Stasiun Kutub',
    badge: 'Insinyur Elektrokimia',
    difficulty: 'Sedang',
    topic: 'Sel Volta & Potensial Sel Standar (E°sel)',
    scenario:
      'Badai salju memutus suplai listrik ke sistem transmisi radio darurat di pos penelitian kutub. Radio membutuhkan tegangan minimal 2.0 Volt agar sinyal SOS dapat dipancarkan ke satelit penyelamat. Di bengkel terdapat pelat logam Seng (Zn), Tembaga (Cu), Magnesium (Mg), dan larutan elektrolit masing-masing.',
    objective:
      'Rancang kombinasi elektroda sel Volta dengan potensial sel standar (E°sel) tertinggi (> 2.0 V) agar radio dapat menyala.',
    steps: [
      {
        stepNumber: 1,
        title: 'Langkah 1: Analisis Data Potensial Reduksi Standar (E°)',
        instruction:
          'Periksa data elektrokimia di buku manual laboratorium:\n• Mg²⁺ + 2e⁻ → Mg (E° = -2.37 V)\n• Zn²⁺ + 2e⁻ → Zn (E° = -0.76 V)\n• Cu²⁺ + 2e⁻ → Cu (E° = +0.34 V)\nManakah pasangan elektroda yang menghasilkan E°sel = E°katoda - E°anoda paling tinggi?',
        testType: 'selection',
        options: [
          {
            id: 'pair_zn_cu',
            label: 'Pasangan Sel Daniell: Zn | Zn²⁺ || Cu²⁺ | Cu',
            description: 'E°sel = +0.34 - (-0.76) = +1.10 Volt',
            isCorrect: false,
            feedback: 'Tegangan hanya 1.10 V, belum cukup untuk mencapai batas minimal 2.0 V!',
          },
          {
            id: 'pair_mg_cu',
            label: 'Pasangan Sel Magnesium-Tembaga: Mg | Mg²⁺ || Cu²⁺ | Cu',
            description: 'E°sel = +0.34 - (-2.37) = +2.71 Volt',
            isCorrect: true,
            feedback: 'Luar biasa! E°sel = +2.71 V, melampaui ambang batas 2.0 V dengan margin keamanan tinggi!',
          },
          {
            id: 'pair_mg_zn',
            label: 'Pasangan Sel Magnesium-Seng: Mg | Mg²⁺ || Zn²⁺ | Zn',
            description: 'E°sel = -0.76 - (-2.37) = +1.61 Volt',
            isCorrect: false,
            feedback: 'E°sel = 1.61 V masih kurang dari 2.0 V yang dibutuhkan radio transmisi.',
          },
        ],
        hint: 'Untuk menghasilkan voltase tertinggi, pilih logam dengan E° paling positif sebagai Katoda dan logam dengan E° paling negatif sebagai Anoda.',
      },
      {
        stepNumber: 2,
        title: 'Langkah 2: Penentuan Kutub & Arah Aliran Elektron',
        instruction:
          'Pada pasangan sel Mg - Cu, logam manakah yang bertindak sebagai Anoda (kutub negatif tempat terjadinya oksidasi dan pelepasan elektron)?',
        testType: 'selection',
        options: [
          {
            id: 'anode_cu',
            label: 'Logam Tembaga (Cu)',
            description: 'Tembaga memiliki potensial reduksi lebih besar sehingga mengalami reduksi.',
            isCorrect: false,
            feedback: 'Keliru! Logam dengan E° lebih positif lebih mudah tereduksi sehingga menjadi Katoda.',
          },
          {
            id: 'anode_mg',
            label: 'Logam Magnesium (Mg)',
            description: 'Mg memiliki E° sangat negatif (-2.37 V), mudah teroksidasi: Mg(s) → Mg²⁺(aq) + 2e⁻',
            isCorrect: true,
            feedback: 'Tepat sekali! Magnesium menjadi Anoda, terkorosi melepaskan elektron menuju kabel sirkuit radio.',
          },
        ],
        hint: 'Ingat akronim KRAO: Katoda Reduksi (kutub +), Anoda Oksidasi (kutub -). Logam lebih reaktif (E° lebih kecil) teroksidasi di anoda.',
      },
      {
        stepNumber: 3,
        title: 'Langkah 3: Pemasangan Jembatan Garam',
        instruction:
          'Mengapa kamu wajib memasang jembatan garam (misal tabung berisi agar-agar KCl) di antara kedua wadah beker?',
        testType: 'selection',
        options: [
          {
            id: 'salt_bridge_neutral',
            label: 'Menjaga kenetralan listrik kedua larutan dengan mengalirkan ion anion & kation',
            description: 'Mencegah penumpukan muatan positif di anoda dan muatan negatif di katoda yang bisa menghentikan arus.',
            isCorrect: true,
            feedback: 'Tepat! Tanpa jembatan garam, polarisasi muatan seketika menghentikan aliran listrik.',
          },
          {
            id: 'salt_bridge_catalyst',
            label: 'Sebagai katalis kimia agar logam magnesium tidak larut terlalu cepat',
            description: 'Jembatan garam bukan katalis dan tidak menghentikan pelarutan logam.',
            isCorrect: false,
            feedback: 'Salah. Fungsi jembatan garam murni menyetarakan muatan listrik antarkompartemen.',
          },
        ],
        hint: 'Saat Mg larut menjadi Mg²⁺, wadah anoda kelebihan muatan (+). Ion Cl⁻ dari jembatan garam masuk menetralkannya.',
      },
    ],
    conclusion:
      'Baterai darurat Mg-Cu berhasil dirangkai dan menghasilkan tegangan stabil 2.68 V! Pemancar radio menyala dan tim evakuasi helikopter telah mengonfirmasi koordinat penjemputan.',
    rewardPoints: 200,
  },
  {
    id: 'acid_spill_neutralizer',
    title: 'Penawar Tumpahan Asam di Sungai Industri',
    badge: 'Ahli Lingkungan Hidup',
    difficulty: 'Tantangan',
    topic: 'Titrasi & Stoikiometri Netralisasi Asam-Basa',
    scenario:
      'Sebuah truk tangki di kawasan industri menumpahkan 200 Liter asam sulfat pekat (H₂SO₄) 0.5 M ke kolam penampungan air limbah pabrik. Nilai pH kolam anjlok ke 1.0 yang dapat mematikan seluruh ekosistem mikroorganisme. Tim darurat lingkungan memiliki persediaan serbuk Kalsium Oksida/Kapur Tohor (CaO, Mr = 56) dan Natrium Hidroksida (NaOH, Mr = 40).',
    objective:
      'Hitung jumlah mol ion hidrogen (H⁺) yang tumpah dan tentukan massa basa penawar yang tepat agar pH kembali normal (pH = 7.0).',
    steps: [
      {
        stepNumber: 1,
        title: 'Langkah 1: Menghitung Mol Ion H⁺ yang Harus Dinetralkan',
        instruction:
          'Tumpahan: Volume = 200 L, Konsentrasi H₂SO₄ = 0.5 M. Asam sulfat adalah asam diprotik bervalensi 2: H₂SO₄ → 2 H⁺ + SO₄²⁻. Berapa total mol ion H⁺ dalam kolam?',
        testType: 'calculation',
        options: [
          {
            id: 'calc_100',
            label: '100 mol H⁺',
            description: 'Perhitungan: 200 L × 0.5 M = 100 mol',
            isCorrect: false,
            feedback: 'Kurang tepat! Jangan lupa bahwa 1 molekul H₂SO₄ melepaskan DUA ion H⁺ (valensi = 2).',
          },
          {
            id: 'calc_200',
            label: '200 mol H⁺',
            description: 'Perhitungan: 200 L × 0.5 M × valensi 2 = 200 mol H⁺',
            isCorrect: true,
            feedback: 'Tepat sekali! Total ion H⁺ yang mencemari kolam adalah 200 mol.',
          },
          {
            id: 'calc_400',
            label: '400 mol H⁺',
            description: 'Terlalu banyak.',
            isCorrect: false,
            feedback: 'Perhitungan mol = M × V × valensi = 0.5 × 200 × 2 = 200 mol.',
          },
        ],
        hint: 'Rumus mol asam diprotik: n(H⁺) = M × V(Liter) × valensi asam.',
      },
      {
        stepNumber: 2,
        title: 'Langkah 2: Menghitung Kebutuhan Basa Natrium Hidroksida (NaOH)',
        instruction:
          'Reaksi netralisasi: H⁺ + OH⁻ → H₂O. Setiap 1 mol NaOH (Mr = 40) menyumbang 1 mol OH⁻. Berapa massa serbuk NaOH yang dibutuhkan untuk menetralkan tepat 200 mol H⁺?',
        testType: 'calculation',
        options: [
          {
            id: 'mass_4kg',
            label: '4.0 kg serbuk NaOH',
            description: 'Massa = 100 mol × 40 g/mol = 4000 g',
            isCorrect: false,
            feedback: 'Ingat bahwa ion H⁺ ada 200 mol, bukan 100 mol!',
          },
          {
            id: 'mass_8kg',
            label: '8.0 kg serbuk NaOH',
            description: 'Massa = 200 mol × 40 g/mol = 8000 g = 8.0 kg',
            isCorrect: true,
            feedback: 'Presisi luar biasa! 8.0 kg serbuk NaOH tepat menetralkan seluruh ion asam.',
          },
          {
            id: 'mass_16kg',
            label: '16.0 kg serbuk NaOH',
            description: 'Kelebihan basa akan membuat air kolam terlalu basa (pH > 12).',
            isCorrect: false,
            feedback: 'Terlalu berlebihan dan membahayakan lingkungan menjadi basa berbahaya.',
          },
        ],
        hint: 'Massa = mol × Mr = 200 mol × 40 g/mol = 8000 gram = 8 kg.',
      },
    ],
    conclusion:
      'Netralisasi presisi berhasil! Sensor pH kolam air limbah kembali stabil pada pH 7.1. Bahaya pencemaran sungai teratasi dan ekosistem perairan terselamatkan!',
    rewardPoints: 250,
  },
];
