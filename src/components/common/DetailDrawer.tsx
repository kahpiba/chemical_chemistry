import React from 'react';
import { X, ShieldAlert, BookOpen, Layers } from 'lucide-react';
import { CATEGORIES } from '../../data/elements';
import type { ElementData } from '../../data/elements';
import { MOLECULE_CATEGORIES } from '../../data/molecules';
import type { MoleculeData } from '../../data/molecules';
import { getHazardProfile } from '../../utils/hazardsLogic';
import { ElementAppearanceCard } from './ElementAppearanceCard';
import '../../styles/reaction.css';

interface DetailDrawerProps {
  element: ElementData | null;
  molecule: MoleculeData | null;
  onClose: () => void;
  onOpenInAtomViewer?: (el: ElementData) => void;
}

const GHS_MAP: Record<string, { label: string; icon: string; bg: string; color: string }> = {
  'flame': { label: 'Mudah Terbakar', icon: '🔥', bg: '#fef2f2', color: '#b91c1c' },
  'flame_over_circle': { label: 'Oksidator Reaktif', icon: '⭕', bg: '#fefce8', color: '#a16207' },
  'corrosion': { label: 'Korosif Asam/Basa', icon: '⚠️', bg: '#fff7ed', color: '#c2410c' },
  'skull_crossbones': { label: 'Toksisitas Akut', icon: '☠️', bg: '#fef2f2', color: '#991b1b' },
  'exploding_bomb': { label: 'Mudah Meledak', icon: '💥', bg: '#fffbeb', color: '#b45309' },
  'gas_cylinder': { label: 'Gas Bertekanan', icon: '🛢️', bg: '#f0fdf4', color: '#15803d' },
  'health_hazard': { label: 'Bahaya Organ/Paru', icon: '🫁', bg: '#faf5ff', color: '#7e22ce' },
  'exclamation_mark': { label: 'Iritasi Kulit/Mata', icon: '⚡', bg: '#fffbeb', color: '#d97706' },
  'environment': { label: 'Bahaya Lingkungan', icon: '🐟', bg: '#f0fdfa', color: '#0f766e' },
};

const HazardCard: React.FC<{ identifier: string }> = ({ identifier }) => {
  const profile = getHazardProfile(identifier);
  if (!profile) return null;

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldAlert size={16} color="#d97706" />
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
            Standar Keselamatan & NFPA 704 (GHS)
          </span>
        </div>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: '4px',
            background: profile.signalWord.includes('BAHAYA') ? '#fee2e2' : profile.signalWord.includes('PERINGATAN') ? '#fef3c7' : '#f0fdf4',
            color: profile.signalWord.includes('BAHAYA') ? '#b91c1c' : profile.signalWord.includes('PERINGATAN') ? '#b45309' : '#15803d',
            letterSpacing: '0.5px',
          }}
        >
          {profile.signalWord}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
        {/* NFPA 704 Diamond */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <div className="nfpa-diamond-box">
            <div className="nfpa-quadrant nfpa-flammability" title={`Mudah Terbakar (Flammability): Tingkat ${profile.nfpa.flammability}`}>
              <span className="nfpa-val">{profile.nfpa.flammability}</span>
            </div>
            <div className="nfpa-quadrant nfpa-instability" title={`Ketidakstabilan (Instability): Tingkat ${profile.nfpa.instability}`}>
              <span className="nfpa-val">{profile.nfpa.instability}</span>
            </div>
            <div className="nfpa-quadrant nfpa-health" title={`Kesehatan (Health): Tingkat ${profile.nfpa.health}`}>
              <span className="nfpa-val">{profile.nfpa.health}</span>
            </div>
            <div className="nfpa-quadrant nfpa-special" title={`Bahaya Khusus: ${profile.nfpa.special || 'Normal'}`}>
              <span className="nfpa-val">{profile.nfpa.special || '-'}</span>
            </div>
          </div>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>NFPA 704</span>
        </div>

        {/* Hazard Statements & GHS Pictograms */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '220px' }}>
          {/* GHS Pictograms Pills */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {profile.ghs.map((pic) => {
              const info = GHS_MAP[pic] || { label: pic, icon: '⚠️', bg: '#f1f5f9', color: '#475569' };
              return (
                <span
                  key={pic}
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    background: info.bg,
                    color: info.color,
                    border: `1px solid ${info.color}30`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>{info.icon}</span>
                  <span>{info.label}</span>
                </span>
              );
            })}
          </div>

          {/* Hazard Statements */}
          <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>
            <ul style={{ margin: 0, paddingLeft: '16px' }}>
              {profile.hazardStatements.map((stmt, idx) => (
                <li key={idx}>{stmt}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

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
    <div
      className="detail-modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 'var(--z-modal-backdrop)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'modalBackdropFade 0.22s ease-out',
      }}
      onClick={onClose}
    >
      <style>{`
        @keyframes modalBackdropFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalCardPop {
          from { opacity: 0; transform: scale(0.94) translateY(12px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      <div
        className="detail-modal-card"
        style={{
          width: '800px',
          maxWidth: '95vw',
          maxHeight: '86vh',
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          borderRadius: '20px',
          border: '1px solid rgba(226, 232, 240, 0.9)',
          boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(15, 23, 42, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 'var(--z-modal)',
          animation: 'modalCardPop 0.24s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 24px',
            borderBottom: '1px solid #e2e8f0',
            background: 'rgba(248, 250, 252, 0.8)',
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
              {element ? 'Detail Informasi Unsur Kimia' : 'Detail Molekul & Senyawa'}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              color: '#64748b',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
            title="Tutup Popup"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body Scroll */}
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

            {/* Real Specimen Photography & Physical Appearance */}
            <ElementAppearanceCard element={element} />

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
                gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
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
                <span className="property-label">Wujud Kamar (25°C)</span>
                <p className="property-val" style={{ textTransform: 'capitalize' }}>
                  {element.phase === 'solid' ? 'Padat' : element.phase === 'liquid' ? 'Cair' : element.phase === 'gas' ? 'Gas' : 'Tidak Diketahui'}
                </p>
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
                <span className="property-label">Energi Ionisasi</span>
                <p className="property-val">
                  {element.ionizationEnergy ? `${element.ionizationEnergy} kJ/mol` : 'N/A'}
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
              <div className="property-item">
                <span className="property-label">Massa Jenis (Densitas)</span>
                <p className="property-val">
                  {element.density ? `${element.density} g/cm³` : 'N/A'}
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

            {/* NFPA 704 & GHS Classification */}
            <HazardCard identifier={element.symbol} />
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

            {/* NFPA 704 & GHS Classification */}
            <HazardCard identifier={molecule.formula} />
          </>
        )}
      </div>

      {/* Modal Footer */}
      <div
        style={{
          padding: '16px 24px',
          borderTop: '1px solid #e2e8f0',
          background: 'rgba(248, 250, 252, 0.8)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Tekan <strong>Esc</strong> atau klik di luar untuk menutup
        </span>
        <button className="btn btn-ghost" onClick={onClose}>
          Tutup
        </button>
      </div>
    </div>
  </div>
  );
};
