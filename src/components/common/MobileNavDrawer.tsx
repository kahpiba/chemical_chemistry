import React, { useEffect } from 'react';
import { X, FileText, Award, Volume2, VolumeX, Info, Atom } from 'lucide-react';
import type { ActiveTab } from './Header';
import { NAV_CATEGORIES } from '../../data/navigationModules';
import { NavIcon } from './NavIcon';
import { playClick } from '../../utils/audio';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenAbout: () => void;
  onOpenWorksheet: () => void;
  onOpenCertificate: () => void;
  muted: boolean;
  onToggleMute: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  onOpenAbout,
  onOpenWorksheet,
  onOpenCertificate,
  muted,
  onToggleMute,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelectTab = (tab: ActiveTab) => {
    playClick();
    onTabChange(tab);
    onClose();
  };

  return (
    <div className="mobile-drawer-overlay" onClick={onClose}>
      <div className="mobile-drawer-pane" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="mobile-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #0284c7, #0ea5e9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
              }}
            >
              <Atom size={18} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
                Chemical Atlas
              </div>
              <div style={{ fontSize: '10px', fontWeight: 600, color: '#0284c7', textTransform: 'uppercase' }}>
                Navigasi 14 Modul
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: '6px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              background: '#ffffff',
              color: '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Tutup Menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="mobile-drawer-body">
          {NAV_CATEGORIES.map((category) => (
            <div key={category.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="mobile-drawer-category-title">
                <NavIcon name={category.icon} size={14} color="#0284c7" />
                <span>{category.title}</span>
              </div>

              <div className="mobile-drawer-grid">
                {category.items.map((item) => {
                  const isSelected = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      className={`mobile-drawer-item ${isSelected ? 'active' : ''}`}
                      onClick={() => handleSelectTab(item.id)}
                    >
                      <div className="mobile-drawer-item-icon">
                        <NavIcon name={item.iconName} size={16} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: isSelected ? '#0284c7' : '#1e293b' }}>
                            {item.title}
                          </span>
                          {item.badge && (
                            <span
                              style={{
                                fontSize: '9px',
                                fontWeight: 700,
                                padding: '1px 6px',
                                borderRadius: '4px',
                                background: isSelected ? '#bae6fd' : '#f1f5f9',
                                color: isSelected ? '#0369a1' : '#64748b',
                              }}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <div
                          style={{
                            fontSize: '11px',
                            color: '#64748b',
                            marginTop: '2px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {item.shortDesc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Drawer Footer Actions */}
        <div
          style={{
            padding: '16px',
            borderTop: '1px solid #e2e8f0',
            background: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              onClick={() => {
                onClose();
                onOpenWorksheet();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px 10px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                color: '#0284c7',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <FileText size={14} />
              <span>LKPD Siswa</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenCertificate();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px 10px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                color: '#d97706',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Award size={14} />
              <span>Sertifikat</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
            <button
              onClick={onToggleMute}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'none',
                border: 'none',
                fontSize: '12px',
                color: '#64748b',
                cursor: 'pointer',
              }}
            >
              {muted ? <VolumeX size={14} color="#dc2626" /> : <Volume2 size={14} color="#16a34a" />}
              <span>{muted ? 'Audio: Nonaktif' : 'Audio: Aktif'}</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenAbout();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'none',
                border: 'none',
                fontSize: '12px',
                color: '#64748b',
                cursor: 'pointer',
              }}
            >
              <Info size={14} />
              <span>Tentang Aplikasi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
