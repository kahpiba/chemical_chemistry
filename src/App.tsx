import { useState } from 'react';
import { Header } from './components/common/Header';
import type { ActiveTab } from './components/common/Header';
import { DetailDrawer } from './components/common/DetailDrawer';
import { PeriodicTable } from './components/periodic/PeriodicTable';
import { MoleculeScene } from './components/molecular/MoleculeScene';
import { MoleculeControls } from './components/molecular/MoleculeControls';
import { ReactionLab } from './components/reaction/ReactionLab';
import { FlameTestLab } from './components/flame/FlameTestLab';
import { QuizArena } from './components/quiz/QuizArena';
import { ElementComparison } from './components/periodic/ElementComparison';
import { ELEMENTS } from './data/elements';
import type { ElementData } from './data/elements';
import { MOLECULES } from './data/molecules';
import type { MoleculeData, MoleculeAtom } from './data/molecules';
import { Sparkles, Atom, X } from 'lucide-react';
import './styles/index.css';
import './styles/periodic.css';
import './styles/molecular.css';
import './styles/reaction.css';
import './styles/quiz.css';
import './styles/flame.css';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('periodic');
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(ELEMENTS[5]); // Default: Carbon (C)
  const [selectedMolecule, setSelectedMolecule] = useState<MoleculeData>(MOLECULES[0]); // Default: Water (H2O)
  const [explodeAmount, setExplodeAmount] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  // Inspector Drawer State
  const [drawerElement, setDrawerElement] = useState<ElementData | null>(null);
  const [drawerMolecule, setDrawerMolecule] = useState<MoleculeData | null>(null);
  const [aboutOpen, setAboutOpen] = useState<boolean>(false);

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
        onTabChange={setActiveTab}
        onOpenAbout={() => setAboutOpen(true)}
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
            <MoleculeControls
              selectedMolecule={selectedMolecule}
              onSelectMolecule={(mol) => {
                setSelectedMolecule(mol);
                setExplodeAmount(0);
              }}
              explodeAmount={explodeAmount}
              onExplodeChange={setExplodeAmount}
              autoRotate={autoRotate}
              onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
              onOpenDetails={() => {
                setDrawerElement(null);
                setDrawerMolecule(selectedMolecule);
              }}
            />

            <MoleculeScene
              molecule={selectedMolecule}
              explodeAmount={explodeAmount}
              autoRotate={autoRotate}
              onSelectAtom={handleSelectMoleculeAtom}
            />
          </div>
        )}

        {activeTab === 'reactions' && <ReactionLab />}
        {activeTab === 'flame' && <FlameTestLab />}
        {activeTab === 'quiz' && <QuizArena />}
        {activeTab === 'compare' && <ElementComparison />}
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
              width: '560px',
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
                  Interactive 3D Chemistry Explorer
                </span>
              </div>
            </div>

            <p style={{ fontSize: '13px', lineHeight: 1.7, color: 'var(--text-secondary)', margin: 0 }}>
              <strong>Chemical Atlas</strong> adalah platform edukasi kimia interaktif modern yang
              terinspirasi dari konsep arsitektur visualisasi <em>Human Atlas</em>. Dirancang untuk
              membuat pembelajaran kimia menjadi sangat visual, intuitif, dan menarik.
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
                Fitur Unggulan:
              </div>
              <ul style={{ fontSize: '12px', color: 'var(--text-secondary)', paddingLeft: '20px', lineHeight: 1.6, margin: 0 }}>
                <li><strong>Tabel Periodik 118 Unsur</strong> dengan filter cerdas & model atom 3D Bohr dinamis.</li>
                <li><strong>3D Molecular Explorer</strong> dengan fitur revolusioner <em>Explode Molecule</em> (mengurai ikatan kimia).</li>
                <li><strong>Virtual Reaction Lab</strong> simulasi pencampuran senyawa kimia dengan reaksi visual (warna, gelembung gas, endapan, dan suhu termal).</li>
                <li><strong>Uji Nyala Api (Flame Test)</strong> visualisasi Bunsen burner animasi dengan spektrum emisi interaktif.</li>
                <li><strong>Quiz Arena</strong> gamifikasi kuis kimia dengan streak, timer, dan skor XP.</li>
                <li><strong>Perbandingan Unsur</strong> bandingkan 2 unsur secara visual side-by-side.</li>
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
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
