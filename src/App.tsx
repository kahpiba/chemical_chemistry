import { useState, useEffect, lazy, Suspense } from 'react';
import { Header } from './components/common/Header';
import type { ActiveTab } from './components/common/Header';
import { DetailDrawer } from './components/common/DetailDrawer';
import { PeriodicTable } from './components/periodic/PeriodicTable';
import { MoleculeShelf, MoleculeHUD } from './components/molecular/MoleculeControls';
import { MobileNavDrawer } from './components/common/MobileNavDrawer';
import { MobileBottomBar } from './components/common/MobileBottomBar';
import { QuickSwitcherModal } from './components/common/QuickSwitcherModal';
import { LabLoadingFallback } from './components/common/LabLoadingFallback';
import { isMuted, setMuted, playClick } from './utils/audio';
import { ELEMENTS } from './data/elements';
import type { ElementData } from './data/elements';
import { MOLECULES } from './data/molecules';
import type { MoleculeData, MoleculeAtom } from './data/molecules';
import { Sparkles, Atom, X, Boxes, Wrench, Box } from 'lucide-react';

// Code-split dynamic lab modules for instant initial load and low memory footprint
const MoleculeScene = lazy(() => import('./components/molecular/MoleculeScene').then((m) => ({ default: m.MoleculeScene })));
const MoleculeBuilder = lazy(() => import('./components/molecular/MoleculeBuilder').then((m) => ({ default: m.MoleculeBuilder })));
const CrystalLatticeViewer = lazy(() => import('./components/molecular/CrystalLatticeViewer').then((m) => ({ default: m.CrystalLatticeViewer })));
const ReactionLab = lazy(() => import('./components/reaction/ReactionLab').then((m) => ({ default: m.ReactionLab })));
const EquationBalancer = lazy(() => import('./components/stoichiometry/EquationBalancer').then((m) => ({ default: m.EquationBalancer })));
const ElectrochemistryLab = lazy(() => import('./components/electrochem/ElectrochemistryLab').then((m) => ({ default: m.ElectrochemistryLab })));
const OrbitalExplorer = lazy(() => import('./components/orbitals/OrbitalExplorer').then((m) => ({ default: m.OrbitalExplorer })));
const FlameTestLab = lazy(() => import('./components/flame/FlameTestLab').then((m) => ({ default: m.FlameTestLab })));
const QuizArena = lazy(() => import('./components/quiz/QuizArena').then((m) => ({ default: m.QuizArena })));
const ElementComparison = lazy(() => import('./components/periodic/ElementComparison').then((m) => ({ default: m.ElementComparison })));
const ChemicalChains = lazy(() => import('./components/chains/ChemicalChains').then((m) => ({ default: m.ChemicalChains })));
const SolutionsLab = lazy(() => import('./components/solutions/SolutionsLab').then((m) => ({ default: m.SolutionsLab })));
const EquilibriumLab = lazy(() => import('./components/equilibrium/EquilibriumLab').then((m) => ({ default: m.EquilibriumLab })));
const ChemistryQuests = lazy(() => import('./components/quests/ChemistryQuests').then((m) => ({ default: m.ChemistryQuests })));
const TitrationLab = lazy(() => import('./components/titration/TitrationLab').then((m) => ({ default: m.TitrationLab })));
const CertificateModal = lazy(() => import('./components/certificate/CertificateModal').then((m) => ({ default: m.CertificateModal })));
const WorksheetModal = lazy(() => import('./components/worksheet/WorksheetModal').then((m) => ({ default: m.WorksheetModal })));

import './styles/index.css';
import './styles/periodic.css';
import './styles/molecular.css';
import './styles/reaction.css';
import './styles/quiz.css';
import './styles/flame.css';
import './styles/chains.css';
import './styles/stoichiometry.css';
import './styles/electrochem.css';
import './styles/orbitals.css';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('periodic');
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(ELEMENTS[5]); // Default: Carbon (C)
  const [selectedMolecule, setSelectedMolecule] = useState<MoleculeData>(MOLECULES[0]); // Default: Water (H2O)
  const [explodeAmount, setExplodeAmount] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [moleculeSubMode, setMoleculeSubMode] = useState<'catalog' | 'builder' | 'crystal'>('catalog');

  // Modal States
  const [drawerElement, setDrawerElement] = useState<ElementData | null>(null);
  const [drawerMolecule, setDrawerMolecule] = useState<MoleculeData | null>(null);
  const [aboutOpen, setAboutOpen] = useState<boolean>(false);
  const [worksheetOpen, setWorksheetOpen] = useState<boolean>(false);
  const [certificateOpen, setCertificateOpen] = useState<boolean>(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  const [quickSwitcherOpen, setQuickSwitcherOpen] = useState<boolean>(false);
  const [muted, setLocalMuted] = useState<boolean>(() => isMuted());

  const handleToggleMute = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    setLocalMuted(nextMuted);
    if (!nextMuted) {
      playClick();
    }
  };

  // Handle ESC to close About modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && aboutOpen) {
        setAboutOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [aboutOpen]);

  // When an element is clicked in Periodic Table
  const handleSelectElement = (el: ElementData) => {
    setSelectedElement(el);
    setDrawerMolecule(null);
    setDrawerElement(el);
  };

  // When an atom is clicked inside the 3D molecule scene
  const handleSelectMoleculeAtom = (atom: MoleculeAtom | null) => {
    if (!atom) return;
    const matchingEl = ELEMENTS.find((e) => e.symbol === atom.element);
    if (matchingEl) {
      setDrawerMolecule(null);
      setDrawerElement(matchingEl);
    }
  };

  return (
    <div className="app-layout">
      {/* Top Application Header */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setDrawerElement(null);
          setDrawerMolecule(null);
        }}
        onOpenAbout={() => setAboutOpen(true)}
        onOpenWorksheet={() => setWorksheetOpen(true)}
        onOpenCertificate={() => setCertificateOpen(true)}
        onOpenMobileDrawer={() => setMobileDrawerOpen(true)}
        onOpenQuickSwitcher={() => setQuickSwitcherOpen(true)}
        muted={muted}
        onToggleMute={handleToggleMute}
      />

      {/* Main Content Body Container */}
      <div className="app-container">
        <main className="main-content">
        {activeTab === 'periodic' && (
          <PeriodicTable
            selectedElement={selectedElement}
            onSelectElement={handleSelectElement}
          />
        )}

        {activeTab === 'molecules' && (
          <div className="molecular-view">
            {/* Sub-Mode Toggle: Catalog vs Custom Builder */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '-4px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className={`filter-pill ${moleculeSubMode === 'catalog' ? 'active' : ''}`}
                  onClick={() => setMoleculeSubMode('catalog')}
                  style={{ gap: '6px', fontSize: '12px' }}
                >
                  <Boxes size={14} />
                  Koleksi Molekul 3D ({MOLECULES.length})
                </button>
                <button
                  className={`filter-pill ${moleculeSubMode === 'builder' ? 'active' : ''}`}
                  onClick={() => setMoleculeSubMode('builder')}
                  style={{ gap: '6px', fontSize: '12px' }}
                >
                  <Wrench size={14} />
                  Perancang Molekul Kustom 3D
                </button>
                <button
                  className={`filter-pill ${moleculeSubMode === 'crystal' ? 'active' : ''}`}
                  onClick={() => setMoleculeSubMode('crystal')}
                  style={{ gap: '6px', fontSize: '12px' }}
                >
                  <Box size={14} />
                  Kisi Kristal Padatan 3D
                </button>
              </div>
            </div>

            {moleculeSubMode === 'catalog' ? (
              <>
                <MoleculeShelf
                  selectedMolecule={selectedMolecule}
                  onSelectMolecule={(mol) => {
                    setSelectedMolecule(mol);
                    setExplodeAmount(0);
                  }}
                />

                <Suspense fallback={<LabLoadingFallback title="Memuat Simulasi Molekul 3D..." subtitle="Menghitung koordinat ikatan & muatan parsial atom..." />}>
                  <MoleculeScene
                    molecule={selectedMolecule}
                    explodeAmount={explodeAmount}
                    autoRotate={autoRotate}
                    onSelectAtom={handleSelectMoleculeAtom}
                  >
                    <MoleculeHUD
                      selectedMolecule={selectedMolecule}
                      explodeAmount={explodeAmount}
                      onExplodeChange={setExplodeAmount}
                      autoRotate={autoRotate}
                      onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
                      onOpenDetails={() => {
                        setDrawerElement(null);
                        setDrawerMolecule(selectedMolecule);
                      }}
                    />
                  </MoleculeScene>
                </Suspense>
              </>
            ) : moleculeSubMode === 'builder' ? (
              <Suspense fallback={<LabLoadingFallback title="Menyiapkan Perancang Molekul..." subtitle="Menginisialisasi kanvas editor 3D & palet atom..." />}>
                <MoleculeBuilder />
              </Suspense>
            ) : (
              <Suspense fallback={<LabLoadingFallback title="Memuat Kisi Kristal Padatan 3D..." subtitle="Mengonfigurasi unit cell & geometri kisi kristal..." />}>
                <CrystalLatticeViewer />
              </Suspense>
            )}
          </div>
        )}

        <Suspense fallback={<LabLoadingFallback />}>
          {activeTab === 'chains' && <ChemicalChains />}
          {activeTab === 'reactions' && <ReactionLab />}
          {activeTab === 'titration' && <TitrationLab />}
          {activeTab === 'stoichiometry' && <EquationBalancer />}
          {activeTab === 'solutions' && <SolutionsLab />}
          {activeTab === 'equilibrium' && <EquilibriumLab />}
          {activeTab === 'electrochem' && <ElectrochemistryLab />}
          {activeTab === 'orbitals' && <OrbitalExplorer />}
          {activeTab === 'quests' && <ChemistryQuests />}
          {activeTab === 'flame' && <FlameTestLab />}
          {activeTab === 'compare' && <ElementComparison />}
          {activeTab === 'quiz' && <QuizArena />}
        </Suspense>
      </main>
      </div>

      {/* Slide-out Inspector Drawer */}
      <DetailDrawer
        element={drawerElement}
        molecule={drawerMolecule}
        onClose={() => {
          setDrawerElement(null);
          setDrawerMolecule(null);
        }}
        onOpenInAtomViewer={(el) => {
          setSelectedElement(el);
          setActiveTab('periodic');
          setDrawerElement(null);
        }}
      />

      {/* Student LKPD Worksheet Modal */}
      {worksheetOpen && (
        <Suspense fallback={null}>
          <WorksheetModal
            isOpen={worksheetOpen}
            onClose={() => setWorksheetOpen(false)}
          />
        </Suspense>
      )}

      {/* Official Certificate Modal */}
      {certificateOpen && (
        <Suspense fallback={null}>
          <CertificateModal
            isOpen={certificateOpen}
            onClose={() => setCertificateOpen(false)}
          />
        </Suspense>
      )}

      {/* Mobile Slide-over Drawer */}
      <MobileNavDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setDrawerElement(null);
          setDrawerMolecule(null);
        }}
        onOpenAbout={() => setAboutOpen(true)}
        onOpenWorksheet={() => setWorksheetOpen(true)}
        onOpenCertificate={() => setCertificateOpen(true)}
        muted={muted}
        onToggleMute={handleToggleMute}
      />

      {/* Sticky Mobile Bottom Navigation Bar (< 768px) */}
      <MobileBottomBar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setDrawerElement(null);
          setDrawerMolecule(null);
        }}
        onOpenDrawer={() => setMobileDrawerOpen(true)}
      />

      {/* Quick Switcher Command Palette (Ctrl+K) */}
      <QuickSwitcherModal
        isOpen={quickSwitcherOpen}
        onClose={() => setQuickSwitcherOpen(false)}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setDrawerElement(null);
          setDrawerMolecule(null);
        }}
      />

      {/* About Modal */}
      {aboutOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1500,
            padding: '20px',
          }}
          onClick={() => setAboutOpen(false)}
        >
          <div
            className="glass-panel"
            style={{
              width: '580px',
              maxWidth: '100%',
              padding: '30px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              position: 'relative',
              background: '#ffffff',
              border: '1px solid var(--border-color)',
              boxShadow: '0 20px 50px rgba(15, 23, 42, 0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setAboutOpen(false)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <Atom size={26} />
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Tentang Chemical Chemistry
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Interactive 3D Chemistry Explorer · 14 Modul Pembelajaran Lengkap
                </span>
              </div>
            </div>

            <p style={{ fontSize: '13px', lineHeight: 1.7, color: 'var(--text-secondary)', margin: 0 }}>
              <strong>Chemical Chemistry</strong> adalah platform edukasi kimia interaktif komprehensif yang
              dirancang untuk siswa, guru, dan penggemar sains guna memahami dunia atom, molekul, reaksi bahaya nyata, dan instrumen laboratorium presisi tinggi secara visual, intuitif, dan matematis.
            </p>

            <div
              style={{
                background: '#f8fafc',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', fontSize: '13px', fontWeight: 600 }}>
                <Sparkles size={16} />
                14 Modul Pembelajaran Unggulan:
              </div>
              <ul style={{ fontSize: '12px', color: 'var(--text-secondary)', paddingLeft: '20px', lineHeight: 1.6, margin: 0 }}>
                <li><strong>Tabel Periodik 118 Unsur & Standar NFPA 704 / GHS</strong> model atom 3D Bohr, kulit elektron, dan klasifikasi bahaya resmi.</li>
                <li><strong>Molekul 3D & Perancang Kustom</strong> eksplorasi ikatan, tolakan sterik kuantum, disosiasi ikatan, dan Atom Legend.</li>
                <li><strong>Rantai Kimia & Spektra IR FTIR</strong> 8 deret homolog organik, polimer, dan grafik serapan inframerah.</li>
                <li><strong>Virtual Reaction Lab & Bahaya Nyata</strong> simulasi gas klorin Cl₂, thermal shock asam sulfat, dan pemisahan fasa tak campur.</li>
                <li><strong>Titrasi Asam-Basa Burette Presisi</strong> aparatus kaca interaktif, kurva sigmoid pH dinamis, tetesan cairan, dan mode ujian buta.</li>
                <li><strong>Penyetara Reaksi Cerdas</strong> eliminasi matriks Gauss-Jordan dan kalkulator stoikiometri pereaksi pembatas.</li>
                <li><strong>Kalkulator Larutan & pH Penyangga</strong> hukum pengenceran M₁V₁ = M₂V₂, Henderson-Hasselbalch, dan hidrolisis garam.</li>
                <li><strong>Simulasi Kesetimbangan Kimia</strong> tabung piston gas reversibel, Asas Le Chatelier, dan profil energi aktivasi (Ea).</li>
                <li><strong>Lab Sel Elektrokimia</strong> simulasi sel volta baterai spontan, aliran elektron, jembatan garam, dan Deret Volta.</li>
                <li><strong>Orbital 3D & Hibridisasi</strong> awan probabilitas elektron s, p, d dan hibridisasi ikatan kimia sp-sp³d².</li>
                <li><strong>Misi Detektif Kimia</strong> investigasi kasus misteri laboratorium dengan uji kualitatif & reward skor.</li>
                <li><strong>Uji Nyala Api</strong> simulasi spektrum emisi Bunsen burner logam alkali dan alkali tanah.</li>
                <li><strong>Radar Pembanding Unsur</strong> analisis komparasi multi-parameter 2 unsur kimia side-by-side.</li>
                <li><strong>Lembar Kerja Siswa (LKPD) & Sertifikat Kelulusan Resmi</strong> instrumen asesmen cetak A4 berstandar akademik.</li>
              </ul>
            </div>

            {/* Scientific Standards & Data Sources Box */}
            <div
              style={{
                background: '#f0f9ff',
                border: '1px solid #bae6fd',
                borderRadius: '10px',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0369a1', fontSize: '13px', fontWeight: 700 }}>
                  <Sparkles size={16} color="#0284c7" />
                  <span>Validitas & Sumber Rujukan Ilmiah:</span>
                </div>
                <span style={{ fontSize: '10px', fontWeight: 700, background: '#ffffff', color: '#0284c7', padding: '2px 8px', borderRadius: '4px', border: '1px solid #bae6fd' }}>
                  Update IUPAC: 4 Mei 2022
                </span>
              </div>
              <ul style={{ fontSize: '11px', color: '#334155', paddingLeft: '18px', lineHeight: 1.6, margin: 0 }}>
                <li><strong>IUPAC (International Union of Pure and Applied Chemistry)</strong>: Standar rilis tabel periodik terbaru (4 Mei 2022) & penetapan nama 118 unsur lengkap (28 Nov 2016).</li>
                <li><strong>CIAAW (Commission on Isotopic Abundances & Atomic Weights)</strong>: Nilai massa atom standar resmi (A_r).</li>
                <li><strong>NIST Physical Reference Data & ASD</strong>: Konfigurasi elektron kuantum, energi ionisasi, dan spektrum emisi atomik.</li>
                <li><strong>PubChem (NCBI) & CRC Handbook of Chemistry and Physics</strong>: Karakteristik termofisika, keelektronegatifan Pauling, dan klasifikasi bahaya NFPA 704 / GHS.</li>
              </ul>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '10px',
                borderTop: '1px solid var(--border-color)',
                fontSize: '11px',
                color: 'var(--text-muted)',
              }}
            >
              <span>Dibangun dengan React 19, Three.js, dan Vite</span>
              <button className="btn btn-primary" onClick={() => setAboutOpen(false)} style={{ padding: '6px 16px' }}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
