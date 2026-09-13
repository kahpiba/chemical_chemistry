import { useState } from 'react';
import { Header } from './components/common/Header';
import type { ActiveTab } from './components/common/Header';
import { DetailDrawer } from './components/common/DetailDrawer';
import { PeriodicTable } from './components/periodic/PeriodicTable';
import { MoleculeScene } from './components/molecular/MoleculeScene';
import { MoleculeShelf, MoleculeHUD } from './components/molecular/MoleculeControls';
import { MoleculeBuilder } from './components/molecular/MoleculeBuilder';
import { ReactionLab } from './components/reaction/ReactionLab';
import { EquationBalancer } from './components/stoichiometry/EquationBalancer';
import { ElectrochemistryLab } from './components/electrochem/ElectrochemistryLab';
import { OrbitalExplorer } from './components/orbitals/OrbitalExplorer';
import { FlameTestLab } from './components/flame/FlameTestLab';
import { QuizArena } from './components/quiz/QuizArena';
import { ElementComparison } from './components/periodic/ElementComparison';
import { ChemicalChains } from './components/chains/ChemicalChains';
import { WorksheetModal } from './components/worksheet/WorksheetModal';
import { ELEMENTS } from './data/elements';
import type { ElementData } from './data/elements';
import { MOLECULES } from './data/molecules';
import type { MoleculeData, MoleculeAtom } from './data/molecules';
import { Sparkles, Atom, X, Boxes, Wrench } from 'lucide-react';
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
  const [moleculeSubMode, setMoleculeSubMode] = useState<'catalog' | 'builder'>('catalog');

  // Modal States
  const [drawerElement, setDrawerElement] = useState<ElementData | null>(null);
  const [drawerMolecule, setDrawerMolecule] = useState<MoleculeData | null>(null);
  const [aboutOpen, setAboutOpen] = useState<boolean>(false);
  const [worksheetOpen, setWorksheetOpen] = useState<boolean>(false);

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
    <div className="app-container">
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
      />

      {/* Main Content Body */}
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
              </>
            ) : (
              <MoleculeBuilder />
            )}
          </div>
        )}

        {activeTab === 'chains' && <ChemicalChains />}
        {activeTab === 'reactions' && <ReactionLab />}
        {activeTab === 'stoichiometry' && <EquationBalancer />}
        {activeTab === 'electrochem' && <ElectrochemistryLab />}
        {activeTab === 'orbitals' && <OrbitalExplorer />}
        {activeTab === 'flame' && <FlameTestLab />}
        {activeTab === 'compare' && <ElementComparison />}
        {activeTab === 'quiz' && <QuizArena />}
      </main>

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
      <WorksheetModal
        isOpen={worksheetOpen}
        onClose={() => setWorksheetOpen(false)}
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
            zIndex: 200,
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
                  Tentang Chemical Atlas
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Interactive 3D Chemistry Explorer · 10 Modul Pembelajaran
                </span>
              </div>
            </div>

            <p style={{ fontSize: '13px', lineHeight: 1.7, color: 'var(--text-secondary)', margin: 0 }}>
              <strong>Chemical Atlas</strong> adalah platform edukasi kimia interaktif komprehensif yang
              dirancang untuk siswa, guru, dan penggemar sains guna memahami dunia atom, molekul, dan reaksi kimia secara visual, intuitif, dan matematis.
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
                10 Modul Pembelajaran Unggulan:
              </div>
              <ul style={{ fontSize: '12px', color: 'var(--text-secondary)', paddingLeft: '20px', lineHeight: 1.6, margin: 0 }}>
                <li><strong>Tabel Periodik 118 Unsur</strong> model atom 3D Bohr & konfigurasi elektron kulit.</li>
                <li><strong>Molekul 3D & Perancang Kustom</strong> eksplorasi ikatan, fitur Urai Struktur (Explode) & Atom Legend.</li>
                <li><strong>Rantai Kimia & Spektra IR FTIR</strong> 8 deret homolog organik, polimer, dan grafik serapan inframerah.</li>
                <li><strong>Virtual Reaction Lab</strong> simulasi pencampuran senyawa dengan sensor digital pH meter dan titrasi.</li>
                <li><strong>Penyetara Reaksi Cerdas</strong> eliminasi matriks Gauss-Jordan dan kalkulator stoikiometri pereaksi pembatas.</li>
                <li><strong>Lab Sel Elektrokimia</strong> simulasi sel volta baterai spontan, aliran elektron, jembatan garam, dan Deret Volta.</li>
                <li><strong>Orbital 3D & Hibridisasi</strong> awan probabilitas elektron s, p, d dan hibridisasi ikatan kimia sp-sp³d².</li>
                <li><strong>Uji Nyala Api</strong> simulasi spektrum emisi Bunsen burner logam alkali dan alkali tanah.</li>
                <li><strong>Radar Pembanding Unsur</strong> analisis komparasi multi-parameter 2 unsur kimia side-by-side.</li>
                <li><strong>Lembar Kerja LKPD Siswa</strong> format printable dengan mode kunci jawaban untuk pendidik.</li>
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
