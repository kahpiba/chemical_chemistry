import React, { useState, useRef, useEffect } from 'react';
import {
  Atom,
  ChevronDown,
  Menu,
  Search,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { playClick } from '../../utils/audio';
import { NAV_CATEGORIES, getModuleCategory, getModuleInfo } from '../../data/navigationModules';
import { NavIcon } from './NavIcon';

export type ActiveTab =
  | 'periodic'
  | 'molecules'
  | 'chains'
  | 'reactions'
  | 'titration'
  | 'stoichiometry'
  | 'electrochem'
  | 'orbitals'
  | 'solutions'
  | 'equilibrium'
  | 'quests'
  | 'flame'
  | 'compare'
  | 'quiz';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenAbout: () => void;
  onOpenWorksheet?: () => void;
  onOpenCertificate?: () => void;
  onOpenMobileDrawer: () => void;
  onOpenQuickSwitcher: () => void;
  muted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenAbout,
  onOpenMobileDrawer,
  onOpenQuickSwitcher,
  muted,
  onToggleMute,
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut: Ctrl+K or Cmd+K to open Quick Switcher
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenQuickSwitcher();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenQuickSwitcher]);

  const activeCategory = getModuleCategory(activeTab);
  const activeInfo = getModuleInfo(activeTab);

  const handleCategoryClick = (categoryId: string) => {
    setOpenDropdown(openDropdown === categoryId ? null : categoryId);
  };

  const handleSelectModule = (tabId: ActiveTab) => {
    playClick();
    onTabChange(tabId);
    setOpenDropdown(null);
  };

  return (
    <header className="app-header-container">
      <div className="app-header-main">
        {/* Brand Group */}
        <div className="header-brand-group">
          <button
            className="brand-badge-link"
            onClick={() => handleSelectModule('periodic')}
            title="Kembali ke Tabel Periodik"
          >
            <div className="brand-icon-box">
              <Atom size={22} />
            </div>
            <div className="brand-text-col">
              <span className="brand-app-name">Chemical Chemistry</span>
              <span className="brand-subtitle-tag">Virtual Lab 3D</span>
            </div>
          </button>

          {/* Active Module Indicator Badge (Desktop & Tablet) */}
          <div className="active-module-pill" title={`Kategori: ${activeCategory.title}`}>
            <NavIcon name={activeInfo.iconName} size={14} color="#0284c7" />
            <span>{activeInfo.title}</span>
          </div>
        </div>

        {/* Desktop Categorized Navigation Hub (4 Logical Clusters) */}
        <nav className="desktop-nav-hub" ref={dropdownRef} aria-label="Kategori Modul">
          {NAV_CATEGORIES.map((cat) => {
            const isCategoryActive = cat.id === activeCategory.id;
            const isOpen = openDropdown === cat.id;

            return (
              <div
                key={cat.id}
                className="category-nav-dropdown-trigger"
                onMouseEnter={() => setOpenDropdown(cat.id)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  className={`category-pill-btn ${isCategoryActive ? 'active' : ''} ${isOpen ? 'open' : ''}`}
                  onClick={() => handleCategoryClick(cat.id)}
                  aria-expanded={isOpen}
                >
                  <NavIcon name={cat.icon} size={15} color={isCategoryActive ? '#0284c7' : '#64748b'} />
                  <span>{cat.title}</span>
                  <ChevronDown size={14} className="category-chevron" />
                </button>

                {/* Floating Dropdown */}
                {isOpen && (
                  <div className="category-floating-dropdown">
                    {cat.items.map((item) => {
                      const isSelected = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          className={`dropdown-item-btn ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleSelectModule(item.id)}
                        >
                          <div className="dropdown-item-icon">
                            <NavIcon name={item.iconName} size={16} />
                          </div>
                          <div className="dropdown-item-info">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                              <span className="dropdown-item-title">{item.title}</span>
                              {item.badge && (
                                <span
                                  style={{
                                    fontSize: '9px',
                                    fontWeight: 700,
                                    padding: '1px 5px',
                                    borderRadius: '4px',
                                    background: isSelected ? '#bae6fd' : '#f1f5f9',
                                    color: isSelected ? '#0369a1' : '#64748b',
                                  }}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <span className="dropdown-item-desc">{item.shortDesc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Actions & Utilities */}
        <div className="header-actions-group">
          {/* Quick Switcher Button */}
          <button
            className="btn btn-secondary"
            onClick={onOpenQuickSwitcher}
            style={{ fontSize: '12px', gap: '6px', padding: '6px 12px' }}
            title="Cari dan buka 14 modul (Shortcut: Ctrl+K)"
          >
            <Search size={14} color="#0284c7" />
            <span>Jelajahi</span>
            <kbd
              style={{
                fontSize: '10px',
                background: '#e2e8f0',
                color: '#64748b',
                padding: '1px 4px',
                borderRadius: '3px',
                fontFamily: 'monospace',
                marginLeft: '2px',
              }}
            >
              ⌘K
            </kbd>
          </button>

          {/* Audio Toggle */}
          <button
            className="btn btn-secondary"
            onClick={onToggleMute}
            style={{ fontSize: '12px', gap: '4px', padding: '6px 10px' }}
            title={muted ? 'Aktifkan Suara Laboratorium' : 'Bisukan Suara'}
            aria-label={muted ? 'Aktifkan Suara Laboratorium' : 'Bisukan Suara'}
          >
            {muted ? <VolumeX size={15} color="#dc2626" /> : <Volume2 size={15} color="#16a34a" />}
          </button>

          {/* Tentang Modal Link */}
          <button
            className="btn btn-ghost"
            onClick={onOpenAbout}
            style={{ fontSize: '12px' }}
            aria-label="Informasi Tentang Chemical Chemistry"
          >
            Tentang
          </button>

          {/* Mobile Hamburger Button */}
          <button
            className="mobile-hamburger-btn"
            onClick={onOpenMobileDrawer}
            title="Buka Navigasi Lengkap"
            aria-label="Menu Navigasi"
          >
            <Menu size={18} />
            <span>Modul</span>
          </button>
        </div>
      </div>
    </header>
  );
};
