import React from 'react';
import { X, ShieldAlert, BookOpen, Layers } from 'lucide-react';
import { CATEGORIES } from '../../data/elements';
import type { ElementData } from '../../data/elements';
import { MOLECULE_CATEGORIES } from '../../data/molecules';
import type { MoleculeData } from '../../data/molecules';

interface DetailDrawerProps {
  element: ElementData | null;
  molecule: MoleculeData | null;
  onClose: () => void;
  onOpenInAtomViewer?: (el: ElementData) => void;
}

export const DetailDrawer: React.FC<DetailDrawerProps> = ({
  element,
  molecule,
  onClose,
  onOpenInAtomViewer,
}) => {
  // Listen for Escape key to close drawer
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!element && !molecule) return null;

  return (
    <>
      {/* Semi-transparent Backdrop Overlay with click-to-close */}
      <div
        className="drawer-backdrop"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.25)',
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
          zIndex: 99,
          animation: 'drawerFadeIn 0.2s ease-out',
        }}
        onClick={onClose}
      />

      <div
        className="detail-drawer-container"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '450px',
          maxWidth: '92vw',
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          borderLeft: '1px solid #cbd5e1',
          boxShadow: '-10px 0 40px rgba(15, 23, 42, 0.15)',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <style>{`
          @keyframes drawerFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `}</style>

      {/* Drawer Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: element
                ? CATEGORIES[element.category].color
                : molecule
                ? MOLECULE_CATEGORIES[molecule.category].color
                : '#0284c7',
              fontWeight: 700,
            }}
          >
            {element ? 'Detail Unsur Kimia' : 'Detail Molekul & Senyawa'}
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Tutup Panel"
        >
          <X size={20} />
        </button>
      </div>

      {/* Drawer Body Scroll */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {element && (
          <>
            {/* Big Identity Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <div
                style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '12px',
                  background: CATEGORIES[element.category].color,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: `0 6px 18px ${CATEGORIES[element.category].color}35`,
                }}
              >
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', opacity: 0.9 }}>
                  {element.number}
                </span>
                <span style={{ fontSize: '32px', fontWeight: 800, lineHeight: 1 }}>
                  {element.symbol}
                </span>
              </div>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>
                  {element.nameId}
                </h2>
                <p style={{ fontSize: '13px', color: '#64748b' }}>
                  {element.name} · Massa: {element.atomicMass} u
                </p>
                <span
                  style={{
                    display: 'inline-block',
                    marginTop: '6px',
                    fontSize: '11px',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    background: CATEGORIES[element.category].bgLight,
                    color: CATEGORIES[element.category].color,
                    fontWeight: 700,
                  }}
                >
                  {CATEGORIES[element.category].nameId}
                </span>
              </div>
            </div>

            {/* Quick Bohr Action */}
            {onOpenInAtomViewer && (
              <button
                className="btn btn-primary"
                onClick={() => onOpenInAtomViewer(element)}
                style={{ width: '100%' }}
              >
                <Layers size={16} />
                <span>Simulasi Model Atom 3D Bohr</span>
              </button>
            )}

            {/* Properties Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
              }}
            >
              <div className="property-item">
                <span className="property-label">Periode / Golongan</span>
                <p className="property-val">
                  Periode {element.period} · Gol {element.group}
                </p>
              </div>
              <div className="property-item">
                <span className="property-label">Blok Orbital</span>
                <p className="property-val">Blok {element.block.toUpperCase()}</p>
              </div>
              <div className="property-item">
                <span className="property-label">Konfigurasi Elektron</span>
                <p className="property-val" style={{ fontSize: '11px' }}>
                  {element.electronConfiguration || '-'}
                </p>
              </div>
              <div className="property-item">
                <span className="property-label">Elektronegativitas</span>
                <p className="property-val">
                  {element.electronegativity ? `${element.electronegativity} Pauling` : 'N/A'}
                </p>
              </div>
              <div className="property-item">
                <span className="property-label">Titik Lebur</span>
                <p className="property-val">
                  {element.meltingPoint ? `${(element.meltingPoint - 273.15).toFixed(1)} °C` : 'N/A'}
                </p>
              </div>
              <div className="property-item">
                <span className="property-label">Titik Didih</span>
                <p className="property-val">
                  {element.boilingPoint ? `${(element.boilingPoint - 273.15).toFixed(1)} °C` : 'N/A'}
                </p>
              </div>
            </div>

            {/* Electron Shells Distribution */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span className="property-label">Distribusi Kulit Elektron (K, L, M, N...)</span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {element.shells.map((count, i) => (
                  <div key={i} className="shell-chip">
                    Kulit {String.fromCharCode(75 + i)}: {count}e⁻
                  </div>
                ))}
              </div>
            </div>

            {/* Summary & Lore */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0284c7' }}>
                <BookOpen size={16} />
                <span style={{ fontSize: '13px', fontWeight: 700 }}>Informasi & Penggunaan</span>
              </div>
              <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#334155' }}>
                {element.summary}
              </p>
              <p style={{ fontSize: '11px', color: '#64748b' }}>
                Ditemukan oleh: <strong>{element.discoveredBy}</strong>
              </p>
            </div>
          </>
        )}

        {molecule && (
          <>
            {/* Big Identity Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <div
                style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #0284c7, #0ea5e9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 6px 18px rgba(2, 132, 199, 0.25)',
                }}
              >
                <span style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                  {molecule.formula}
                </span>
              </div>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a' }}>
                  {molecule.nameId}
                </h2>
                <p style={{ fontSize: '13px', color: '#64748b' }}>
                  {molecule.name} · Massa Molar: {molecule.molarMass} g/mol
                </p>
                <span
                  style={{
                    display: 'inline-block',
                    marginTop: '6px',
                    fontSize: '11px',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    background: '#f0f9ff',
                    color: '#0284c7',
                    fontWeight: 700,
                  }}
                >
                  {MOLECULE_CATEGORIES[molecule.category].nameId}
                </span>
              </div>
            </div>

            {/* Properties Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
              }}
            >
              <div className="property-item">
                <span className="property-label">Geometri Molekul</span>
                <p className="property-val" style={{ fontSize: '12px' }}>{molecule.geometry}</p>
              </div>
              <div className="property-item">
                <span className="property-label">Kepolaran</span>
                <p className="property-val">{molecule.polarity}</p>
              </div>
              <div className="property-item">
                <span className="property-label">Jumlah Atom</span>
                <p className="property-val">{molecule.atoms.length} atom</p>
              </div>
              <div className="property-item">
                <span className="property-label">Jumlah Ikatan</span>
                <p className="property-val">{molecule.bonds.length} ikatan</p>
              </div>
            </div>

            {/* Description */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0284c7' }}>
                <BookOpen size={16} />
                <span style={{ fontSize: '13px', fontWeight: 700 }}>Struktur & Karakteristik</span>
              </div>
              <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#334155' }}>
                {molecule.description}
              </p>
            </div>

            {/* Real World Applications */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#059669' }}>
                Peran & Aplikasi Nyata
              </span>
              <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#334155' }}>
                {molecule.realWorldUsage}
              </p>
            </div>

            {/* Safety Warning */}
            {molecule.safetyNotes && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  background: '#fff1f2',
                  border: '1px solid #fecdd3',
                  borderRadius: '8px',
                  padding: '12px',
                }}
              >
                <ShieldAlert size={18} color="#e11d48" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '12px', color: '#9f1239', lineHeight: 1.5, margin: 0 }}>
                  <strong>Catatan Keselamatan:</strong> {molecule.safetyNotes}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Drawer Footer */}
      <div
        style={{
          padding: '16px 24px',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <button className="btn btn-ghost" onClick={onClose}>
          Tutup
        </button>
      </div>
    </div>
    </>
  );
};
