import React from 'react';
import { Layers, Boxes, FlaskConical, Menu, Pipette } from 'lucide-react';
import type { ActiveTab } from './Header';
import { playClick } from '../../utils/audio';

interface MobileBottomBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenDrawer: () => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  activeTab,
  onTabChange,
  onOpenDrawer,
}) => {
  const handleSelectTab = (tab: ActiveTab) => {
    playClick();
    onTabChange(tab);
  };

  return (
    <nav className="mobile-bottom-nav" aria-label="Navigasi Mobile Cepat">
      <button
        className={`bottom-nav-action ${activeTab === 'periodic' ? 'active' : ''}`}
        onClick={() => handleSelectTab('periodic')}
      >
        <Layers size={18} />
        <span>Unsur</span>
      </button>

      <button
        className={`bottom-nav-action ${activeTab === 'molecules' ? 'active' : ''}`}
        onClick={() => handleSelectTab('molecules')}
      >
        <Boxes size={18} />
        <span>Molekul</span>
      </button>

      <button
        className={`bottom-nav-action ${activeTab === 'reactions' ? 'active' : ''}`}
        onClick={() => handleSelectTab('reactions')}
      >
        <FlaskConical size={18} />
        <span>Reaksi</span>
      </button>

      <button
        className={`bottom-nav-action ${activeTab === 'titration' ? 'active' : ''}`}
        onClick={() => handleSelectTab('titration')}
      >
        <Pipette size={18} />
        <span>Titrasi</span>
      </button>

      <button
        className="bottom-nav-action"
        onClick={() => {
          playClick();
          onOpenDrawer();
        }}
      >
        <Menu size={18} />
        <span>Semua (14)</span>
      </button>
    </nav>
  );
};
