import React, { useState } from 'react';
import { Camera, Eye, Sparkles, Radio, Droplets, Gem } from 'lucide-react';
import { getElementAppearance } from '../../data/elementAppearances';
import type { ElementAppearance } from '../../data/elementAppearances';
import type { ElementData } from '../../data/elements';

interface ElementAppearanceCardProps {
  element: ElementData;
  compact?: boolean;
}

export const ElementAppearanceCard: React.FC<ElementAppearanceCardProps> = ({ element, compact = false }) => {
  const data: ElementAppearance | undefined = getElementAppearance(element.number);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'photo' | 'illustration'>('photo');

  // Reset image loading states when element changes
  React.useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
    setViewMode('photo');
  }, [element.number]);

  if (!data) return null;

  const hasPhoto = !!data.imageUrl && !imageError;

  // Fallback to illustration if no photo or error
  const activeMode = hasPhoto ? viewMode : 'illustration';

  return (
    <div
      className="element-appearance-card"
      style={{
        flexShrink: 0,
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: compact ? '12px' : '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
        position: 'relative',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Top Header & Mode Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'rgba(2, 132, 199, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0284c7',
            }}
          >
            <Camera size={16} />
          </div>
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', margin: 0, lineHeight: 1.2 }}>
              Wujud Fisik & Spesimen Nyata
            </h4>
            <span style={{ fontSize: '11px', color: '#64748b' }}>
              Bentuk fisik dan sampel materi di alam
            </span>
          </div>
        </div>

        {/* View Switcher Pill */}
        {hasPhoto && (
          <div
            style={{
              display: 'flex',
              background: '#f1f5f9',
              borderRadius: '8px',
              padding: '2px',
              border: '1px solid #e2e8f0',
            }}
          >
            <button
              onClick={() => setViewMode('photo')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: activeMode === 'photo' ? '#ffffff' : 'transparent',
                color: activeMode === 'photo' ? '#0284c7' : '#64748b',
                boxShadow: activeMode === 'photo' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <Camera size={12} />
              <span>Foto Spesimen</span>
            </button>
            <button
              onClick={() => setViewMode('illustration')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: activeMode === 'illustration' ? '#ffffff' : 'transparent',
                color: activeMode === 'illustration' ? '#0284c7' : '#64748b',
                boxShadow: activeMode === 'illustration' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <Eye size={12} />
              <span>Ilustrasi Bentuk</span>
            </button>
          </div>
        )}
      </div>

      {/* Media Display Frame */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: compact ? '160px' : '220px',
          minHeight: compact ? '160px' : '220px',
          flexShrink: 0,
          borderRadius: '12px',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)',
        }}
      >
        {/* Sample Type Badge Overlay */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '999px',
            padding: '3px 10px',
            color: '#f8fafc',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.2px',
          }}
        >
          {data.visualType === 'gas' && <Sparkles size={11} color="#38bdf8" />}
          {data.visualType === 'liquid' && <Droplets size={11} color="#60a5fa" />}
          {data.visualType === 'crystal' && <Gem size={11} color="#34d399" />}
          {data.visualType === 'metal' && <Sparkles size={11} color="#fbbf24" />}
          {data.visualType === 'synthetic' && <Radio size={11} color="#c084fc" />}
          <span>{data.sampleType}</span>
        </div>

        {/* Mode 1: High-Res Real Specimen Photo */}
        {activeMode === 'photo' && data.imageUrl && !imageError && (
          <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
            {!imageLoaded && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#1e293b',
                  color: '#94a3b8',
                  gap: '8px',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    border: '3px solid rgba(56, 189, 248, 0.2)',
                    borderTopColor: '#38bdf8',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                  }}
                />
                <span style={{ fontSize: '11px' }}>Memuat foto spesimen...</span>
              </div>
            )}
            <img
              src={data.imageUrl}
              alt={`${element.nameId} (${element.symbol}) - ${data.imageCaption}`}
              loading="lazy"
              referrerPolicy="no-referrer"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'center',
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
                opacity: imageLoaded ? 1 : 0,
                transform: 'scale(0.98)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
            />
          </div>
        )}

        {/* Mode 2: Scientific Visual Illustration (or Fallback) */}
        {(activeMode === 'illustration' || !data.imageUrl || imageError) && (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              background: `radial-gradient(circle at center, ${data.colorHex}25 0%, #0f172a 75%)`,
            }}
          >
            {/* Visual Icon Art */}
            {data.visualType === 'gas' && (
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Glowing Gas Ampoule */}
                <div
                  style={{
                    width: '140px',
                    height: '52px',
                    borderRadius: '26px',
                    background: `linear-gradient(90deg, rgba(255,255,255,0.1), ${data.colorHex}55, rgba(255,255,255,0.1))`,
                    border: '2px solid rgba(255,255,255,0.4)',
                    boxShadow: `0 0 35px ${data.colorHex}88, inset 0 0 15px ${data.colorHex}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '20px',
                    letterSpacing: '2px',
                    fontFamily: 'var(--font-mono)',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  {element.symbol}
                </div>
                <span style={{ position: 'absolute', bottom: '-26px', fontSize: '11px', color: '#94a3b8' }}>
                  Gas Terionisasi dalam Tabung Kaca
                </span>
              </div>
            )}

            {data.visualType === 'liquid' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle at 30% 30%, #ffffff 0%, ${data.colorHex} 50%, #0f172a 100%)`,
                    boxShadow: `0 8px 24px ${data.colorHex}66, inset 0 0 12px rgba(255,255,255,0.6)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: element.number === 80 ? '#0f172a' : '#ffffff',
                    fontWeight: 800,
                    fontSize: '24px',
                    fontFamily: 'var(--font-mono)',
                    border: '1px solid rgba(255,255,255,0.3)',
                  }}
                >
                  {element.symbol}
                </div>
                <span style={{ fontSize: '11px', color: '#cbd5e1' }}>
                  Tetesan Cairan Murni (Tegangan Permukaan)
                </span>
              </div>
            )}

            {data.visualType === 'crystal' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '84px',
                    height: '84px',
                    transform: 'rotate(45deg)',
                    borderRadius: '16px',
                    background: `linear-gradient(135deg, ${data.colorHex}, #0f172a)`,
                    border: '2px solid rgba(255,255,255,0.4)',
                    boxShadow: `0 8px 30px ${data.colorHex}55, inset 0 0 15px rgba(255,255,255,0.3)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      transform: 'rotate(-45deg)',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '24px',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {element.symbol}
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '6px' }}>
                  Struktur Polikristalin Alami
                </span>
              </div>
            )}

            {data.visualType === 'metal' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '110px',
                    height: '65px',
                    borderRadius: '8px',
                    background: `linear-gradient(145deg, #ffffff 0%, ${data.colorHex} 40%, #1e293b 100%)`,
                    border: '1px solid rgba(255,255,255,0.4)',
                    boxShadow: `0 10px 25px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.8)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0f172a',
                    fontWeight: 800,
                    fontSize: '22px',
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '1px',
                  }}
                >
                  {element.symbol}
                </div>
                <span style={{ fontSize: '11px', color: '#cbd5e1' }}>
                  Spesimen Ingot Logam Padat Murni
                </span>
              </div>
            )}

            {data.visualType === 'synthetic' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    position: 'relative',
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    border: '2px dashed #c084fc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'spin 12s linear infinite',
                  }}
                >
                  <Radio size={32} color="#c084fc" />
                </div>
                <span
                  style={{
                    position: 'absolute',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '18px',
                    fontFamily: 'var(--font-mono)',
                    marginTop: '-18px',
                  }}
                >
                  {element.symbol}
                </span>
                <span style={{ fontSize: '11px', color: '#c084fc', fontWeight: 600 }}>
                  Akselerator Partikel Sintetis (Waktu Paruh Singkat)
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Caption & Source Attribution (If Photo Mode) */}
      {activeMode === 'photo' && data.imageUrl && !imageError && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748b', flexShrink: 0 }}>
          <span style={{ fontStyle: 'italic' }}>
            📷 {data.imageCaption}
          </span>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
            Sumber: Wikimedia Commons
          </span>
        </div>
      )}

      {/* Physical Description Paragraph */}
      <div
        style={{
          background: '#f8fafc',
          borderRadius: '10px',
          padding: '12px 14px',
          border: '1px solid #f1f5f9',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Karakteristik Tampilan Fisik:
        </span>
        <p style={{ fontSize: '12.5px', lineHeight: 1.6, color: '#334155', margin: 0 }}>
          {data.appearanceId}
        </p>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
