import React from 'react';
import { Atom, Boxes, FlaskConical, Sparkles, Layers, Flame, Trophy, ArrowLeftRight, GitCommit } from 'lucide-react';

export type ActiveTab = 'periodic' | 'molecules' | 'chains' | 'reactions' | 'flame' | 'quiz' | 'compare';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenAbout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenAbout,
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
          className={`nav-tab ${activeTab === 'flame' ? 'active' : ''}`}
          onClick={() => onTabChange('flame')}
          role="tab"
          aria-selected={activeTab === 'flame'}
        >
          <Flame size={16} />
          <span>Uji Nyala Api</span>
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
        <div className="stat-chip">
          <Sparkles size={14} color="#0284c7" />
          <span>118 Unsur · 7 Modul</span>
        </div>
        <button className="btn btn-ghost" onClick={onOpenAbout} title="Tentang Chemical Atlas">
          Tentang
        </button>
      </div>
    </header>
  );
};
