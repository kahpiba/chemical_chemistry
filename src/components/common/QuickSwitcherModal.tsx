import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronRight } from 'lucide-react';
import type { ActiveTab } from './Header';
import { NAV_CATEGORIES } from '../../data/navigationModules';
import { NavIcon } from './NavIcon';
import { playClick } from '../../utils/audio';

interface QuickSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: ActiveTab) => void;
}

export const QuickSwitcherModal: React.FC<QuickSwitcherModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  // Handle ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const allModules = NAV_CATEGORIES.flatMap((c) =>
    c.items.map((item) => ({ ...item, categoryTitle: c.title }))
  );

  const filtered = query.trim()
    ? allModules.filter(
        (m) =>
          m.title.toLowerCase().includes(query.toLowerCase()) ||
          m.shortDesc.toLowerCase().includes(query.toLowerCase()) ||
          m.categoryTitle.toLowerCase().includes(query.toLowerCase()) ||
          (m.badge && m.badge.toLowerCase().includes(query.toLowerCase()))
      )
    : allModules;

  const handleSelect = (tab: ActiveTab) => {
    playClick();
    onSelectTab(tab);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.5)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '60px 20px 20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '640px',
          maxWidth: '100%',
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.3)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'modalCardPop 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            borderBottom: '1px solid #e2e8f0',
            background: '#f8fafc',
          }}
        >
          <Search size={20} color="#0284c7" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari modul (contoh: titrasi, klorin, bohr, kesetimbangan, pH)..."
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              fontSize: '15px',
              outline: 'none',
              color: '#0f172a',
              fontWeight: 500,
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <X size={16} />
            </button>
          )}
          <span
            style={{
              fontSize: '11px',
              color: '#94a3b8',
              background: '#e2e8f0',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: 600,
            }}
          >
            ESC
          </span>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '8px' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '32px 20px', textAlign: 'center', color: '#64748b' }}>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Tidak ada modul yang cocok</p>
              <p style={{ margin: '4px 0 0', fontSize: '12px' }}>
                Coba kata kunci lain seperti <em>reaksi</em>, <em>molekul</em>, atau <em>orbital</em>.
              </p>
            </div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: '#f0f9ff',
                    border: '1px solid #bae6fd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0284c7',
                    flexShrink: 0,
                  }}
                >
                  <NavIcon name={item.iconName} size={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
                      {item.title}
                    </span>
                    <span
                      style={{
                        fontSize: '10px',
                        color: '#64748b',
                        background: '#f1f5f9',
                        padding: '1px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      {item.categoryTitle}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
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
                <ChevronRight size={16} color="#94a3b8" />
              </button>
            ))
          )}
        </div>

        {/* Footer info */}
        <div
          style={{
            padding: '10px 16px',
            background: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '11px',
            color: '#64748b',
          }}
        >
          <span>Klik salah satu modul untuk berpindah secara instan</span>
          <span>{filtered.length} dari {allModules.length} modul</span>
        </div>
      </div>
    </div>
  );
};
