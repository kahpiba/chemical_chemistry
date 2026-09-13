import React from 'react';
import {
  Atom,
  Boxes,
  FlaskConical,
  Sparkles,
  Layers,
  Flame,
  Trophy,
  ArrowLeftRight,
  GitCommit,
  Scale,
  Zap,
  Compass,
  FileText,
} from 'lucide-react';

export type ActiveTab =
  | 'periodic'
  | 'molecules'
  | 'chains'
  | 'reactions'
  | 'stoichiometry'
  | 'electrochem'
  | 'orbitals'
  | 'flame'
  | 'compare'
  | 'quiz';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenAbout: () => void;
  onOpenWorksheet: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenAbout,
  onOpenWorksheet,
}) => {
  return (
    <header className="app-header glass-panel">
      <div className="header-brand">
        <div className="brand-icon">
          <Atom size={24} />
        </div>
        <div>
          <div className="brand-title">
            <span>Chemical Atlas</span>
            <span className="brand-tag">3D Explorer</span>
          </div>
        </div>
      </div>

      <nav className="nav-tabs" role="tablist">
        <button
          className={`nav-tab ${activeTab === 'periodic' ? 'active' : ''}`}
          onClick={() => onTabChange('periodic')}
          role="tab"
          aria-selected={activeTab === 'periodic'}
        >
          <Layers size={16} />
          <span>Tabel Periodik</span>
        </button>

        <button
          className={`nav-tab ${activeTab === 'molecules' ? 'active' : ''}`}
          onClick={() => onTabChange('molecules')}
          role="tab"
          aria-selected={activeTab === 'molecules'}
        >
          <Boxes size={16} />
          <span>Molekul 3D</span>
        </button>

        <button
          className={`nav-tab ${activeTab === 'chains' ? 'active' : ''}`}
          onClick={() => onTabChange('chains')}
          role="tab"
          aria-selected={activeTab === 'chains'}
        >
          <GitCommit size={16} />
          <span>Rantai Kimia</span>
        </button>

        <button
          className={`nav-tab ${activeTab === 'reactions' ? 'active' : ''}`}
          onClick={() => onTabChange('reactions')}
          role="tab"
          aria-selected={activeTab === 'reactions'}
        >
          <FlaskConical size={16} />
          <span>Lab Reaksi</span>
        </button>

        <button
          className={`nav-tab ${activeTab === 'stoichiometry' ? 'active' : ''}`}
          onClick={() => onTabChange('stoichiometry')}
          role="tab"
          aria-selected={activeTab === 'stoichiometry'}
        >
          <Scale size={16} />
          <span>Penyetara Reaksi</span>
        </button>

        <button
          className={`nav-tab ${activeTab === 'electrochem' ? 'active' : ''}`}
          onClick={() => onTabChange('electrochem')}
          role="tab"
          aria-selected={activeTab === 'electrochem'}
        >
          <Zap size={16} />
          <span>Elektrokimia</span>
        </button>

        <button
          className={`nav-tab ${activeTab === 'orbitals' ? 'active' : ''}`}
          onClick={() => onTabChange('orbitals')}
          role="tab"
          aria-selected={activeTab === 'orbitals'}
        >
          <Compass size={16} />
          <span>Orbital 3D</span>
        </button>

        <button
          className={`nav-tab ${activeTab === 'flame' ? 'active' : ''}`}
          onClick={() => onTabChange('flame')}
          role="tab"
          aria-selected={activeTab === 'flame'}
        >
          <Flame size={16} />
          <span>Uji Nyala</span>
        </button>

        <button
          className={`nav-tab ${activeTab === 'compare' ? 'active' : ''}`}
          onClick={() => onTabChange('compare')}
          role="tab"
          aria-selected={activeTab === 'compare'}
        >
          <ArrowLeftRight size={16} />
          <span>Bandingkan</span>
        </button>

        <button
          className={`nav-tab ${activeTab === 'quiz' ? 'active' : ''}`}
          onClick={() => onTabChange('quiz')}
          role="tab"
          aria-selected={activeTab === 'quiz'}
        >
          <Trophy size={16} />
          <span>Quiz Arena</span>
        </button>
      </nav>

      <div className="header-actions">
        <button
          className="btn btn-secondary"
          onClick={onOpenWorksheet}
          style={{ fontSize: '12px', gap: '6px', padding: '6px 12px' }}
          title="Buka dan cetak Lembar Kerja Peserta Didik (LKPD)"
        >
          <FileText size={14} color="#0284c7" />
          <span>LKPD Siswa</span>
        </button>

        <div className="stat-chip">
          <Sparkles size={14} color="#0284c7" />
          <span>10 Modul Edukasi</span>
        </div>

        <button className="btn btn-ghost" onClick={onOpenAbout} title="Tentang Chemical Atlas">
          Tentang
        </button>
      </div>
    </header>
  );
};
