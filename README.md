# Chemical Chemistry (ChemLab 3D)

> **Platform Edukasi Kimia Interaktif 3D**: Jelajahi 118 unsur tabel periodik dengan simulasi atom Bohr 3D, uraikan ikatan molekul senyawa (*exploded view*), dan simulasikan reaksi kimia virtual secara visual dan nyata.

Chemical Chemistry menghadirkan pengalaman belajar kimia yang imersif, saintifik, dan berkinerja tinggi berbasis WebGL (Three.js), React 19, TypeScript, dan Vite.

---

## Fitur Utama

### 1. Tabel Periodik & Model Atom 3D Bohr
- **118 Unsur Lengkap**: Grid 18-kolom standar IUPAC dengan pemisahan deret Lantanida dan Aktinida.
- **Filter Cerdas**: Filter 10 golongan kimia (Alkali, Alkali Tanah, Logam Transisi, Metaloid, Non-logam, Halogen, Gas Mulia, dll.) serta wujud zat pada 298K (Padat, Cair, Gas).
- **Pencarian Cepat**: Cari instan berdasarkan lambang (Fe, Au), nama Indonesia/Inggris (Besi, Gold), atau nomor atom (26).
- **Simulasi 3D Model Atom Bohr**: Inti atom (proton & neutron) beranimasi dinamis dikelilingi partikel elektron yang beredar pada orbit kulit atomnya (K, L, M, N, O, P, Q) secara fisik sesuai konfigurasi elektron aslinya.

### 2. 3D Molecular Explorer & "Explode Molecule"
- **Koleksi Senyawa Lengkap**: Air ($H_2O$), Karbon Dioksida ($CO_2$), Metana ($CH_4$), Amonia ($NH_3$), Asam Klorida ($HCl$), Natrium Hidroksida ($NaOH$), Garam Dapur ($NaCl$), Asam Sulfat ($H_2SO_4$), Etanol ($C_2H_5OH$), Glukosa ($C_6H_{12}O_6$), dan Kafein ($C_8H_{10}N_4O_2$).
- **Fitur "Urai Struktur (Explode)" (Slider 0% – 100%)**:
  - Slider interaktif yang meregangkan dan memisahkan ikatan kovalen/ionik.
  - Molekul terurai menjadi atom-atom bebas di ruang 3D lengkap dengan label nama unsur dan muatan parsial ($\delta^+$, $\delta^-$, $+1$, $-1$).
- **Interaksi 3D**: Kontrol orbit kamera penuh, zoom, auto-rotate, dan tooltip interaktif pada tiap atom.

### 3. Laboratorium Reaksi Kimia Virtual (*Virtual Chemical Reaction Lab*)
- **Rak Bahan Kimia**: 16 reagen kimia (asam, basa, garam larut, bubuk kapur/soda kue, oksidator, logam seng/natrium, dan indikator fenolftalein).
- **Gelas Kimia Beker 250 mL dengan Simulasi Nyata**:
  - **Perubahan Warna & Titrasi**: Netralisasi asam-basa ($HCl + NaOH + PP$) dari merah muda menjadi bening netral.
  - **Pembentukan Endapan / Presipitasi**: Reaksi *Golden Rain* ($Pb(NO_3)_2 + 2KI \rightarrow PbI_2 \downarrow$ kristal kuning emas) dan $AgNO_3 + NaCl \rightarrow AgCl \downarrow$ (putih susu).
  - **Pelepasan Gas & Buih Gelembung**: Cuka + Soda Kue ($CH_3COOH + NaHCO_3 \rightarrow CO_2 \uparrow$) dan Seng + Asam ($Zn + 2HCl \rightarrow H_2 \uparrow$).
  - **Efek Termal Dinamis**: Termometer yang naik secara dinamis hingga $88^\circ\text{C}$ pada reaksi eksotermik kapur tohor ($CaO + H_2O$) dengan uap air panas, atau turun mendingin ($18.5^\circ\text{C}$) pada reaksi endotermik cuka & soda kue.
  - **Nyala Api & Letupan Gas**: Logam Natrium dalam air ($2Na + 2H_2O$) dengan percikan api dan letupan gas hidrogen.
- **Analisis Reaksi**: Persamaan kimia setara, kalor entalpi $\Delta H$, mekanisme molekuler, dan aspek keselamatan laboratorium.

---

## Tech Stack

- **Frontend**: React 19, TypeScript
- **3D Graphics Engine**: Three.js (WebGL, OrbitControls, custom materials)
- **Build Tool**: Vite 8
- **Styling**: Vanilla CSS kustom (Scientific Glassmorphism, HSL Design Tokens, JetBrains Mono & Inter typography)
- **Icons**: Lucide React

---

## Menjalankan Secara Lokal

### Prasyarat
- Node.js versi 18+ atau 20+
- npm

### Langkah Instalasi
```bash
# 1. Clone repository
git clone https://github.com/kahpiba/chemical_chemistry.git
cd chemical_chemistry

# 2. Install dependensi
npm install

# 3. Jalankan development server
npm run dev
# Buka browser di http://localhost:5173/

# 4. Build produksi
npm run build
```

---

## Lisensi

Dilisensikan di bawah [MIT License](LICENSE).
