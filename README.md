# ⚛️ Chemical Chemistry (Virtual Lab 3D)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-chemical--chemistry.vercel.app-0284c7?style=flat-square&logo=vercel&logoColor=white)](https://chemical-chemistry.vercel.app/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL%203D-000000?style=flat-square&logo=threedotjs&logoColor=white)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

> **Platform Edukasi Kimia Interaktif & Laboratorium Virtual 3D Komprehensif**  
> Jelajahi 118 unsur kimia dengan simulasi atom Bohr 3D, bongkar ikatan molekul (*exploded view*), simulasikan aparatus titrasi buret, uji nyala spektroskopi, sel elektrokimia, hingga investigasi kasus Detektif Kimia secara visual dan saintifik.

🌐 **Demo Langsung (Live Web App)**: [https://chemical-chemistry.vercel.app/](https://chemical-chemistry.vercel.app/)

---

## 🌟 Ikhtisar Platform

**Chemical Chemistry** dirancang untuk menghadirkan pengalaman belajar sains kimia yang mendalam, aman, dan memukau melalui simulasi grafis 3D berbasis WebGL (Three.js) dan arsitektur modern React 19. Aplikasi ini mengintegrasikan 14 modul laboratorium virtual yang mencakup konsep struktur atom, ikatan kimia, kinetika & termodinamika reaksi, kimia analitik, hingga kimia fisik.

---

## 📚 Peta 14 Modul Pembelajaran Unggulan

Platform ini terbagi ke dalam **4 Klaster Navigasi Utama**:

```
Chemical Chemistry Hub
├── ⚛️ 1. Struktur & Molekul (4 Modul)
│   ├── Tabel Periodik 118 Unsur & Standar NFPA 704
│   ├── Molekul 3D, Perancang Kustom & Kisi Kristal
│   ├── Rantai Kimia Organik & Spektrofotometri FTIR
│   └── Orbital 3D Kuantum & Hibridisasi
├── ⚗️ 2. Lab & Reaksi Kimia (4 Modul)
│   ├── Virtual Chemical Reaction Lab & Hazard Nyata
│   ├── Titrasi Asam-Basa Buret Presisi & Kurva Sigmoid
│   ├── Penyetara Reaksi Matriks Gauss-Jordan & Tabel MRS
│   └── Uji Nyala Api Bunsen & Spektroskopi Bohr
├── 💧 3. Fisika Kimia & Larutan (3 Modul)
│   ├── Kalkulator Larutan & pH Penyangga (Buffer)
│   ├── Simulasi Kesetimbangan Kimia (Asas Le Chatelier)
│   └── Laboratorium Sel Elektrokimia (Sel Volta)
└── 🏆 4. Asesmen & Eksplorasi Sains (3 Modul)
    ├── Misi Investigasi Detektif Kimia
    ├── Radar Pembanding Multi-Parameter Unsur
    └── Quiz Arena Sains Kompetitif
```

---

### ⚛️ Klaster 1: Struktur & Molekul

#### 1. Tabel Periodik 118 Unsur & Model Atom 3D Bohr
- **Grid 18-Kolom Standar IUPAC**: Menampilkan 118 unsur kimia lengkap dengan klasifikasi deret Lantanida dan Aktinida.
- **Simulasi Partikel Bohr 3D**: Inti atom (proton & neutron) berputar dinamis dikelilingi partikel elektron pada orbital kulit atom ($K, L, M, N, O, P, Q$) sesuai konfigurasi elektron aslinya.
- **Standar Bahaya NFPA 704 & GHS**: Informasi resmi tingkat bahaya kesehatan (*Health*), kemudahan terbakar (*Flammability*), reaktivitas (*Instability*), dan bahaya khusus (misal: radioaktif, oksidator kuat).
- **Filter Cerdas**: Filter 10 kelompok unsur (Alkali, Alkali Tanah, Logam Transisi, Metaloid, Non-logam, Halogen, Gas Mulia, dll.) serta wujud zat pada $298\text{ K}$ (Padat, Cair, Gas).

#### 2. Molekul 3D, Perancang Kustom & Kisi Kristal Padatan
- **Koleksi Senyawa Lengkap**: Air ($H_2O$), Karbon Dioksida ($CO_2$), Metana ($CH_4$), Amonia ($NH_3$), Asam Sulfat ($H_2SO_4$), Etanol ($C_2H_5OH$), Glukosa ($C_6H_{12}O_6$), Kafein ($C_8H_{10}N_4O_2$), dll.
- **Fitur "Urai Struktur (*Exploded View*)" (Slider 0% – 100%)**: Meregangkan dan menguraikan ikatan kimia molekul di ruang 3D, memperlihatkan muatan parsial ($\delta^+$, $\delta^-$, $+1$, $-1$) dan nama tiap atom.
- **Perancang Molekul Kustom 3D**: Bangun molekul sendiri secara bebas dengan memilih atom inti, atom pengikat, dan tipe ikatan (tunggal, rangkap dua, rangkap tiga).
- **Kisi Kristal Padatan 3D**: Visualisasi susunan kisi kristal kubus berpusat muka (*Face-Centered Cubic* NaCl), intan diamantoid, dan grafit berlapis heksagonal.

#### 3. Rantai Kimia Organik & Spektra IR FTIR
- **8 Deret Homolog Organik**: Eksplorasi rantai karbon Alkana, Alkena, Alkuna, Alkanol (Alkohol), Alkoksi Alkana (Eter), Alkanal (Aldehid), Alkanon (Keton), dan Asam Alkanoat (Asam Karboksilat).
- **Simulasi Polimerisasi**: Visualisasi pembentukan polietilena, polipropilena, dan poliester.
- **Spektra Inframerah (FTIR)**: Grafik serapan panjang gelombang inframerah interaktif dengan penanda gugus fungsi spesifik (seperti regangan $-OH$, $C=O$, dan $C-H$).

#### 4. Orbital 3D Kuantum & Hibridisasi
- **Awan Probabilitas Elektron Kuantum**: Visualisasi bentuk orbital $s$, orbital $p$ ($p_x, p_y, p_z$), serta orbital $d$ ($d_{xy}, d_{yz}, d_{xz}, d_{x^2-y^2}, d_{z^2}$).
- **Geometri Hibridisasi Ikatan**: Penjelasan interaktif geometri ruang orbital hibrida $sp$ (linear), $sp^2$ (trigonal planar), $sp^3$ (tetrahedral), $sp^3d$ (bipiramida trigonal), dan $sp^3d^2$ (oktahedral).

---

### ⚗️ Klaster 2: Lab & Reaksi Kimia

#### 5. Virtual Reaction Lab & Bahaya Nyata
- **Simulasi Pencampuran 16+ Reagen**: Asam kuat ($HCl, H_2SO_4, HNO_3$), basa kuat ($NaOH, KOH$), garam, oksidator ($H_2O_2$), logam aktif ($Na, Zn, Mg$), dan indikator warna.
- **Termodinamika & Termometer Dinamis**: Pengukuran suhu real-time dengan kenaikan kalor eksotermik (hingga $>88^\circ\text{C}$ pada $CaO + H_2O$) atau pendinginan endotermik ($18^\circ\text{C}$ pada $CH_3COOH + NaHCO_3$).
- **Visualisasi Reaksi Nyata**: Buih pelepasan gas ($CO_2, H_2$), endapan *Golden Rain* ($PbI_2$) kuning keemasan, dan letupan logam alkali.
- **Simulasi Bahaya Kimia Nyata (*Real Chemical Hazards*)**:
  - *Gas Klorin Beracun ($Cl_2$)* saat pemutih dicampur asam.
  - *Thermal Shock* dan percikan berbahaya saat air dituangkan ke asam sulfat pekat.

#### 6. Titrasi Asam-Basa Buret Presisi & Kurva Sigmoid
- **Aparatus Buret Kaca 50 mL**: Pengaturan kecepatan tetesan (*drip rate*), volume titran terpakai, dan wadah Erlenmeyer dengan pengaduk magnetik (*magnetic stirrer*).
- **Kurva Sigmoid pH Real-Time**: Pemetaan kurva pH otomatis terhadap volume titran dengan anotasi titik ekuivalen teoritis.
- **Pilihan Indikator Asam-Basa**: Fenolftalein (PP), Bromtimol Biru (BTB), dan Metil Jingga (MO).
- **Mode Ujian Praktikum Buta (*Blind Titration Exam*)**: Menguji keahlian analitik siswa untuk mencari konsentrasi analit yang dirahasiakan.

#### 7. Penyetara Reaksi Cerdas & Tabel MRS
- **Algoritma Gauss-Jordan**: Penyetaraan koefisien reaksi kimia kompleks secara instan menggunakan eliminasi matriks linear.
- **Tabel Mula-mula, Reaksi, Sisa (MRS)**: Analisis stoikiometri mol reaktan, identifikasi pereaksi pembatas (*limiting reactant*), dan sisa zat.
- **Kalkulator Persen Rendemen (*% Yield*)**: Perhitungan hasil teoritis versus hasil aktual eksperimen.

#### 8. Uji Nyala Api Bunsen & Spektroskopi Bohr
- **Uji Nyala Logam**: Warna nyala Bunsen burner khas untuk Kation Logam (Kuning $Na$, Merah Karmin $Li$, Lilac $K$, Merah Bata $Ca$, Hijau Zamrud $Cu, Ba$).
- **Dekomposisi Prisma Kaca**: Penguraian cahaya polikromatis nyala api menjadi garis spektrum diskrit.
- **Deret Balmer Hidrogen**: Transisi tingkat energi elektron orbital Bohr dengan emisi foton ($H_\alpha, H_\beta, H_\gamma, H_\delta$).
- **Lampu Tabung Gas Mulia**: Tabung pelepasan gas He, Ne, Ar, Kr, Xe bertegangan tinggi.

---

### 💧 Klaster 3: Fisika Kimia & Larutan

#### 9. Kalkulator Larutan & pH Penyangga (Buffer)
- **Hukum Pengenceran**: Simulasi perhitungan $M_1 \times V_1 = M_2 \times V_2$ dengan visualisasi perubahan kepekatan warna zat terlarut.
- **Larutan Penyangga (Henderson-Hasselbalch)**: Simulasi daya tahan buffer asam ($CH_3COOH/CH_3COONa$) dan buffer basa ($NH_3/NH_4Cl$) terhadap penambahan sedikit asam/basa.
- **Hidrolisis Garam**: Penentuan sifat asam/basa garam dari kation/anion pembentuknya.

#### 10. Simulasi Kesetimbangan Kimia (Asas Le Chatelier)
- **Piston Gas Dinamis Reversibel**: Simulasi reaksi kesetimbangan gas $N_2O_4 \text{ (tidak berwarna)} \rightleftharpoons 2NO_2 \text{ (coklat kemerahan)}$.
- **Manipulasi Faktor Kesetimbangan**: Pengaruh perubahan volume ruang, tekanan gas, temperatur pemanasan/pendinginan, dan katalisator.
- **Diagram Profil Energi Aktivasi ($E_a$)**: Visualisasi profil energi reaksi maju, reaksi balik, dan kompleks teraktivasi.

#### 11. Laboratorium Sel Elektrokimia (Sel Volta)
- **Rangkaian Sel Galvanik Dua Bejana**: Pasangan elektroda logam ($Zn, Cu, Ag, Fe, Mg, Al$) dalam larutan elektrolitnya.
- **Voltmeter Potensial Sel Standar ($E^\circ_{\text{cell}}$)**: Perhitungan potensial reduksi standar berdasarkan Deret Volta.
- **Animasi Aliran Partikel**: Aliran elektron melalui kawat sirkuit eksternal dan migrasi ion penyeimbang melalui jembatan garam (*salt bridge*).

---

### 🏆 Klaster 4: Asesmen & Eksplorasi Sains

#### 12. Misi Investigasi Detektif Kimia
- **Skenario Misteri Laboratorium**: Siswa berperan sebagai investigator forensik kimia untuk mengidentifikasi sampel misterius tak berlabel.
- **Alur Pengujian Kualitatif Terstruktur**: Melakukan serangkaian uji organoleptik, uji nyala, uji kelarutan, uji pH, dan pereaksi spesifik.
- **Sistem Skor & Evaluasi**: Reward poin akurasi investigasi berdasarkan efisiensi langkah uji.

#### 13. Radar Pembanding Multi-Parameter Unsur
- **Grafik Komparasi Side-by-Side**: Bandingkan dua unsur kimia secara langsung pada satu diagram radar interaktif.
- **Parameter Periodisitas**: Jari-jari atom, energi ionisasi pertama, keelektronegatifan skala Pauling, afinitas elektron, massa atom, serta titik leleh dan titik didih.

#### 14. Quiz Arena Sains
- **Evaluasi Pemahaman Interaktif**: Bank soal kimia berwaktu dengan umpan balik instan dan pembahasan rumus ilmiah.
- **Statistik Nilai**: Peringkat performa dan ringkasan penguasaan topik konsep kimia.

---

## 🎨 Desain Antarmuka & Pengalaman Pengguna (UI/UX)

- **Symmetrical 3-Column Header**: Tata letak navigasi proporsional dengan logo brand di kiri, Hub 4 Kategori terpusat simetris di tengah, dan tombol aksi di kanan.
- **Hover Bridge & Debounce Navigation**: Dropdown menu dilengkapi jembatan hover tanpa celah dan buffer debounce waktu penutupan $220\text{ ms}$ untuk kenyamanan kursor.
- **Command Palette / Quick Switcher (`⌘K` / `Ctrl+K`)**: Modal pencarian global secepat kilat untuk melompat langsung ke salah satu dari 14 modul.
- **Audio Feedback Laboratorium**: Efek audio sintetis Web Audio API saat tombol ditekan atau reaksi berlangsung (dapat dibisukan melalui tombol header).
- **Responsive Layout**: Dukungan penuh layar laptop, desktop ultrawide, tablet, hingga ponsel pintar via *Mobile Slide Drawer* dan *Sticky Bottom Bar*.
- **Progressive Web App (PWA & Offline Ready)**: Dilengkapi `manifest.json` dan Service Worker cerdas (`sw.js`) untuk caching aset statis, font, serta mendukung instalasi aplikasi ke desktop/layar utama (*Add to Home Screen*) dengan kemampuan akses offline.
- **Dynamic Code Splitting & Micro-Chunking**: Modul laboratorium 3D dimuat secara asinkron (*lazy-loaded*) dengan `React.lazy()` dan *vendor splitting* (Three.js & Lucide vendor isolation), memangkas beban unduhan awal hingga **67%** (dari ~1.32 MB menjadi ~411 kB) untuk performa akses yang luar biasa instan.

---

## 🛠️ Arsitektur & Teknologi

| Komponen | Teknologi / Pustaka | Peran & Kegunaan |
| :--- | :--- | :--- |
| **Framework** | **React 19** | Komponen UI reaktif, arsitektur modular, dan manajemen state modern |
| **Bahasa** | **TypeScript 5** | *Type-safety*, autocompletion data unsur, dan integritas logika reaksi |
| **3D Rendering** | **Three.js (WebGL)** | Render model atom Bohr, molekul ruang 3D, dan kisi kristal |
| **Build & Bundler** | **Vite 8 & Rollup** | Hot Module Replacement (HMR) instan, *vendor chunking*, dan code splitting |
| **PWA & Offline** | **Service Worker & Web Manifest** | Caching aset cerdas, instalabilitas aplikasi (*standalone*), dan kesiapan offline |
| **Ikonografi** | **Lucide React** | Ikon visual konsisten untuk seluruh instrumen laboratorium |
| **Styling** | **Vanilla CSS + Glassmorphism** | Desain bertema sains modern dengan variabel warna HSL dan blur backdrop |
| **Efek Suara** | **Web Audio API** | Sintesis audio interaktif tanpa dependensi file audio eksternal berat |

---

## 📁 Struktur Direktori Proyek

```
chemical_chemistry/
├── public/                     # Asset statis publik & favicon
├── src/
│   ├── assets/                 # Gambar dan media pendukung
│   ├── components/
│   │   ├── common/             # Header, QuickSwitcherModal, MobileNavDrawer, DetailDrawer
│   │   ├── compare/            # Modul Radar Pembanding Unsur
│   │   ├── electrochem/        # Modul Laboratorium Sel Elektrokimia
│   │   ├── equilibrium/        # Modul Simulasi Kesetimbangan Kimia
│   │   ├── flame/              # Modul Uji Nyala & Spektroskopi Bohr
│   │   ├── molecules/          # Modul 3D Molecule Explorer, Builder & Crystal Lattice
│   │   ├── orbitals/           # Modul Orbital 3D Kuantum & Hibridisasi
│   │   ├── periodic/           # Modul Tabel Periodik 118 Unsur & 3D Bohr Atom
│   │   ├── quests/             # Modul Misi Investigasi Detektif Kimia
│   │   ├── quiz/               # Modul Quiz Arena Sains
│   │   ├── reaction/           # Modul Virtual Reaction Lab & Hazard Nyata
│   │   ├── solutions/          # Modul Kalkulator Larutan & pH Penyangga
│   │   ├── stoichiometry/      # Modul Penyetara Reaksi & Tabel MRS
│   │   └── titration/          # Modul Titrasi Buret Presisi
│   ├── data/                   # Basis data 118 unsur, molekul, reagen, reaksi, dan navigasi
│   ├── styles/                 # Sistem stylesheet terpisah untuk tiap modul & tema
│   ├── utils/                  # Utilitas kalkulasi kimia, matriks matematika, dan audio
│   ├── App.tsx                 # Root layout & orkestrasi modul aplikasi
│   └── main.tsx                # Entry point aplikasi React
├── index.html                  # Dokumen HTML utama
├── package.json                # Metadata proyek & dependensi
├── tsconfig.json               # Konfigurasi kompilator TypeScript
└── vite.config.ts              # Konfigurasi bundler Vite
```

## 🔬 Sumber Rujukan & Validitas Ilmiah (*Scientific References & Standards*)

Seluruh data unsur, konstanta fisik, mekanisme reaksi, spektroskopi, dan klasifikasi bahaya dalam **Chemical Chemistry** disusun berdasarkan standar konsensus internasional lembaga sains resmi:

| Lembaga / Sumber Rujukan | Dokumen / Standar Resmi | Waktu Pembaruan Terakhir | Parameter Data yang Digunakan |
| :--- | :--- | :--- | :--- |
| **IUPAC** *(International Union of Pure and Applied Chemistry)* | **IUPAC Periodic Table of the Elements** | **4 Mei 2022** *(Latest Official Release)* | Penataan 18 golongan, 7 periode, pengesahan 118 unsur (termasuk penetapan nama resmi Nh, Mc, Ts, Og pada 28 Nov 2016). |
| **CIAAW** *(Commission on Isotopic Abundances & Atomic Weights)* | **Standard Atomic Weights of the Elements 2021/2022** | **Mei 2022** | Nilai massa atom relatif standar ($A_r$), kelimpahan isotop alamiah, dan ketidakpastian standar. |
| **NIST** *(National Institute of Standards and Technology)* | **NIST Atomic Spectra Database (ASD) & Physical Reference Data** | **Revisi Berkala (NIST ASD v5.11)** | Panjang gelombang garis emisi atomik Balmer-Rydberg, energi ionisasi, dan konfigurasi elektron tingkat dasar (*ground state*). |
| **CRC Press** | **CRC Handbook of Chemistry and Physics (104th & 105th Editions)** | **2023 – 2024** | Titik leleh, titik didih, densitas, afinitas elektron, keelektronegatifan skala Pauling, dan potensial reduksi standar ($E^\circ$). |
| **NCBI / PubChem** | **PubChem Compound & Element Database** | **Pembaruan Berkelanjutan** | Struktur 3D koordinat kristalografi, geometri molekul, muatan parsial, dan data spektra FTIR. |
| **NFPA & OSHA / GHS** | **NFPA 704 Standard System & UN GHS Rev. 9** | **Standar Global Aktif** | Diamond hazard NFPA 704 (Kesehatan, Kemudahan Terbakar, Instabilitas, Bahaya Khusus) dan piktogram GHS K3 laboratorium. |

### 📅 Riwayat Pembaruan Tabel Periodik IUPAC
1. **4 Mei 2022**: IUPAC merilis revisi tabel periodik resmi terbaru dengan pembaruan nilai bobot atom standar untuk sejumlah unsur berdasarkan pengukuran presisi tinggi CIAAW.
2. **28 November 2016**: IUPAC resmi meratifikasi nama dan lambang 4 unsur penutup Periode 7: **Nihonium (113, Nh)**, **Moscovium (115, Mc)**, **Tennessine (117, Ts)**, dan **Oganesson (118, Og)**.
3. **Status Mutakhir**: Seluruh 118 unsur kimia dari Hidrogen ($Z=1$) hingga Oganesson ($Z=118$) telah terpetakan secara lengkap, terverifikasi, dan valid.

---

## 🚀 Panduan Menjalankan Secara Lokal

### Prasyarat Sistem
- **Node.js**: Versi `18.0.0` atau yang lebih baru (direkomendasikan Node.js 20 LTS).
- **npm**: Versi `9.0.0` atau yang lebih baru.

### Langkah Instalasi & Menjalankan

1. **Clone Repository**:
   ```bash
   git clone https://github.com/kahpi/chemical_chemistry.git
   cd chemical_chemistry
   ```

2. **Instalasi Dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan Server Pengembangan (Development Server)**:
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:5173/` secara lokal.

4. **Kompilasi Bundle Produksi (Build)**:
   ```bash
   npm run build
   ```
   Hasil build siap saji akan dibuat di direktori `dist/`.

5. **Pratinjau Hasil Build**:
   ```bash
   npm run preview
   ```

---

## 🤝 Kontribusi

Kontribusi untuk memperkaya modul pembelajaran kimia, penambahan molekul 3D, atau penyempurnaan simulasi reaksi sangat disambut baik:

1. *Fork* repositori ini.
2. Buat *feature branch* baru: `git checkout -b fitur/nama-fitur-baru`.
3. Lakukan *commit* perubahan: `git commit -m 'feat: menambahkan modul termokimia baru'`.
4. *Push* ke branch Anda: `git push origin fitur/nama-fitur-baru`.
5. Buka *Pull Request* baru dengan deskripsi perubahan yang jelas.

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah naungan **[MIT License](LICENSE)** — bebas digunakan untuk keperluan edukasi, pembelajaran kelas, maupun pengembangan lebih lanjut.

---

<p align="center">
  Dibuat dengan ❤️ untuk kemajuan pendidikan sains dan kimia interaktif.
</p>
