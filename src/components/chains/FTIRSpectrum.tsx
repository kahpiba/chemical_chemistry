import React, { useState, useMemo } from 'react';
import type { HydrocarbonSeries } from '../../data/chainsData';
import { Activity, Sparkles, HelpCircle } from 'lucide-react';

interface FTIRSpectrumProps {
  series: HydrocarbonSeries;
  carbonCount: number;
}

interface FTIRBand {
  id: string;
  wavenumber: number; // in cm-1
  width: number;
  depth: number; // 0 (no absorption) to 1 (100% absorption)
  bond: string;
  vibration: 'Ulur (Stretching)' | 'Tekuk (Bending)';
  intensity: 'Kuat & Lebar' | 'Sangat Kuat & Tajam' | 'Sedang' | 'Kuat' | 'Kuat & Tajam';
  description: string;
}

export const FTIRSpectrum: React.FC<FTIRSpectrumProps> = ({ series, carbonCount }) => {
  const [hoveredBand, setHoveredBand] = useState<FTIRBand | null>(null);

  // Compute diagnostic FTIR bands for current molecule
  const bands: FTIRBand[] = useMemo(() => {
    const list: FTIRBand[] = [];

    // All organic molecules have aliphatic C-H stretching
    list.push({
      id: 'sp3-ch',
      wavenumber: 2920,
      width: 140,
      depth: 0.65,
      bond: 'C(sp³) - H',
      vibration: 'Ulur (Stretching)',
      intensity: 'Kuat',
      description: 'Vibrasi ulur ikatan C-H alifatik pada rantai alkil hidrokarbon.',
    });

    list.push({
      id: 'ch2-bend',
      wavenumber: 1460,
      width: 60,
      depth: 0.4,
      bond: 'C - H (CH₂ / CH₃)',
      vibration: 'Tekuk (Bending)',
      intensity: 'Sedang',
      description: 'Vibrasi tekuk gunting (scissoring) gugus metilena dan metil.',
    });

    if (series === 'alcohol') {
      list.push({
        id: 'oh-alcohol',
        wavenumber: 3350,
        width: 280,
        depth: 0.8,
        bond: 'O - H (Alkohol)',
        vibration: 'Ulur (Stretching)',
        intensity: 'Kuat & Lebar',
        description: 'Pita serapan parabolik sangat lebar khas ikatan hidrogen antar-molekul gugus hidroksil (-OH).',
      });
      list.push({
        id: 'co-alcohol',
        wavenumber: 1060,
        width: 80,
        depth: 0.7,
        bond: 'C - O',
        vibration: 'Ulur (Stretching)',
        intensity: 'Kuat',
        description: 'Serapan kuat ikatan tunggal C-O pada alkohol primer/sekunder.',
      });
    }

    if (series === 'carboxylic_acid') {
      list.push({
        id: 'oh-acid',
        wavenumber: 3000,
        width: 500,
        depth: 0.75,
        bond: 'O - H (Asam Karboksilat)',
        vibration: 'Ulur (Stretching)',
        intensity: 'Kuat & Lebar',
        description: 'Pita serapan raksasa sangat lebar (2500 - 3300 cm⁻¹) akibat dimerisasi ikatan hidrogen kuat gugus -COOH.',
      });
      list.push({
        id: 'co-carbonyl-acid',
        wavenumber: 1715,
        width: 50,
        depth: 0.88,
        bond: 'C = O (Karbonil Asam)',
        vibration: 'Ulur (Stretching)',
        intensity: 'Sangat Kuat & Tajam',
        description: 'Puncak serapan tajam paling diagnostik dari gugus karbonil asam karboksilat.',
      });
      list.push({
        id: 'co-single-acid',
        wavenumber: 1240,
        width: 70,
        depth: 0.6,
        bond: 'C - O',
        vibration: 'Ulur (Stretching)',
        intensity: 'Kuat',
        description: 'Vibrasi ulur C-O asam karboksilat.',
      });
    }

    if (series === 'aldehyde') {
      list.push({
        id: 'co-carbonyl-ald',
        wavenumber: 1725,
        width: 50,
        depth: 0.85,
        bond: 'C = O (Karbonil Aldehida)',
        vibration: 'Ulur (Stretching)',
        intensity: 'Sangat Kuat & Tajam',
        description: 'Pita serapan tajam khas gugus karbonil aldehida alifatik.',
      });
      list.push({
        id: 'ch-fermi-1',
        wavenumber: 2820,
        width: 40,
        depth: 0.35,
        bond: 'C - H (Aldehida - Fermi 1)',
        vibration: 'Ulur (Stretching)',
        intensity: 'Sedang',
        description: 'Puncak kembar pertama resonansi Fermi C-H aldehida.',
      });
      list.push({
        id: 'ch-fermi-2',
        wavenumber: 2720,
        width: 40,
        depth: 0.35,
        bond: 'C - H (Aldehida - Fermi 2)',
        vibration: 'Ulur (Stretching)',
        intensity: 'Sedang',
        description: 'Puncak kembar kedua resonansi Fermi C-H aldehida.',
      });
    }

    if (series === 'alkene') {
      list.push({
        id: 'sp2-ch',
        wavenumber: 3080,
        width: 50,
        depth: 0.45,
        bond: '=C(sp²) - H',
        vibration: 'Ulur (Stretching)',
        intensity: 'Sedang',
        description: 'Serapan di sebelah kiri 3000 cm⁻¹ menandakan adanya hidrogen alkenil =C-H.',
      });
      list.push({
        id: 'cc-double',
        wavenumber: 1645,
        width: 45,
        depth: 0.55,
        bond: 'C = C',
        vibration: 'Ulur (Stretching)',
        intensity: 'Sedang',
        description: 'Vibrasi ulur ikatan rangkap dua C=C non-konjugasi.',
      });
    }

    if (series === 'alkyne') {
      list.push({
        id: 'sp-ch',
        wavenumber: 3300,
        width: 40,
        depth: 0.75,
        bond: '≡C(sp) - H',
        vibration: 'Ulur (Stretching)',
        intensity: 'Kuat & Tajam',
        description: 'Puncak sangat tajam dan kuat di 3300 cm⁻¹ khas alkuna terminal.',
      });
      list.push({
        id: 'cc-triple',
        wavenumber: 2120,
        width: 35,
        depth: 0.5,
        bond: 'C ≡ C',
        vibration: 'Ulur (Stretching)',
        intensity: 'Sedang',
        description: 'Vibrasi ikatan rangkap tiga C≡C di daerah spektral yang relatif sepi.',
      });
    }

    if (series === 'haloalkane') {
      list.push({
        id: 'c-cl',
        wavenumber: 720,
        width: 70,
        depth: 0.75,
        bond: 'C - Cl',
        vibration: 'Ulur (Stretching)',
        intensity: 'Kuat',
        description: 'Serapan kuat ikatan karbon-klorin pada daerah sidik jari (fingerprint region).',
      });
    }

    return list;
  }, [series]);

  // Generate SVG path for the FTIR curve from 4000 cm-1 down to 400 cm-1
  // Canvas width: 800, height: 320
  // X: 4000 cm-1 (left=60px) to 400 cm-1 (right=760px)
  const W_START = 4000;
  const W_END = 400;
  const X_LEFT = 70;
  const X_RIGHT = 760;
  const Y_TOP = 40; // 100% Transmittance
  const Y_BOTTOM = 280; // 0% Transmittance

  const wavenumberToX = (wn: number) => {
    return X_LEFT + ((W_START - wn) / (W_START - W_END)) * (X_RIGHT - X_LEFT);
  };

  const transmittanceToY = (pct: number) => {
    return Y_TOP + (1 - pct) * (Y_BOTTOM - Y_TOP);
  };

  // Generate continuous transmission curve with Gaussian absorption dips
  const curvePath = useMemo(() => {
    const points: [number, number][] = [];
    const step = 8; // cm-1 per point

    for (let wn = W_START; wn >= W_END; wn -= step) {
      let baseline = 0.94 + Math.sin(wn * 0.005) * 0.015; // baseline noise

      // Subtract absorption peaks
      for (const b of bands) {
        const diff = wn - b.wavenumber;
        const gaussian = Math.exp(-0.5 * Math.pow(diff / (b.width / 2.355), 2));
        baseline -= b.depth * gaussian * 0.85;
      }

      baseline = Math.max(0.08, Math.min(0.98, baseline));
      const x = wavenumberToX(wn);
      const y = transmittanceToY(baseline);
      points.push([x, y]);
    }

    if (points.length === 0) return '';
    let d = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i][0].toFixed(1)} ${points[i][1].toFixed(1)}`;
    }
    return d;
  }, [bands]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
      {/* Spectrum Stage */}
      <div
        className="glass-panel"
        style={{
          position: 'relative',
          padding: '16px 20px',
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="#0284c7" />
            <strong style={{ fontSize: '15px', color: 'var(--text-primary)' }}>
              Spektra Inframerah FTIR Simulative (Rantai C{carbonCount})
            </strong>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Arahkan kursor pada puncak serapan untuk detail vibrasi
          </span>
        </div>

        <svg viewBox="0 0 800 320" style={{ width: '100%', height: '300px' }}>
          {/* Grid lines */}
          {[4000, 3500, 3000, 2500, 2000, 1500, 1000, 500].map((wn) => {
            const x = wavenumberToX(wn);
            return (
              <g key={`grid-${wn}`}>
                <line x1={x} y1={Y_TOP} x2={x} y2={Y_BOTTOM} stroke="#f1f5f9" strokeWidth="1" />
                <text x={x} y={Y_BOTTOM + 18} fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="var(--font-mono)">
                  {wn}
                </text>
              </g>
            );
          })}

          {/* Transmittance Axis labels */}
          {[100, 75, 50, 25, 0].map((t) => {
            const y = transmittanceToY(t / 100);
            return (
              <g key={`y-${t}`}>
                <line x1={X_LEFT} y1={y} x2={X_RIGHT} y2={y} stroke="#f1f5f9" strokeWidth="1" />
                <text x={X_LEFT - 10} y={y + 3} fill="#94a3b8" fontSize="10" textAnchor="end" fontFamily="var(--font-mono)">
                  {t}%
                </text>
              </g>
            );
          })}

          {/* Diagnostic region separator line at 1500 cm-1 */}
          <line
            x1={wavenumberToX(1500)}
            y1={Y_TOP}
            x2={wavenumberToX(1500)}
            y2={Y_BOTTOM}
            stroke="#cbd5e1"
            strokeWidth="1.5"
            strokeDasharray="4,4"
          />
          <text x={wavenumberToX(2750)} y={Y_TOP + 16} fill="#0284c7" fontSize="10" fontWeight="700" textAnchor="middle">
            Daerah Gugus Fungsi (4000 - 1500 cm⁻¹)
          </text>
          <text x={wavenumberToX(950)} y={Y_TOP + 16} fill="#64748b" fontSize="10" fontWeight="700" textAnchor="middle">
            Daerah Sidik Jari (1500 - 400 cm⁻¹)
          </text>

          {/* Interactive highlight bands */}
          {bands.map((b) => {
            const bx = wavenumberToX(b.wavenumber);
            const bWidthPx = (b.width / (W_START - W_END)) * (X_RIGHT - X_LEFT);
            const isHovered = hoveredBand?.id === b.id;
            return (
              <rect
                key={`band-rect-${b.id}`}
                x={bx - bWidthPx / 2}
                y={Y_TOP}
                width={bWidthPx}
                height={Y_BOTTOM - Y_TOP}
                fill={isHovered ? 'rgba(2, 132, 199, 0.15)' : 'transparent'}
                cursor="pointer"
                onMouseEnter={() => setHoveredBand(b)}
                onMouseLeave={() => setHoveredBand(null)}
              />
            );
          })}

          {/* FTIR Absorption Spectrum Curve */}
          <path d={curvePath} fill="none" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Peak labels */}
          {bands.map((b) => {
            const bx = wavenumberToX(b.wavenumber);
            const by = transmittanceToY(0.92 - b.depth * 0.85);
            return (
              <g key={`pin-${b.id}`} transform={`translate(${bx}, ${by})`}>
                <circle r="4" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
                <line x1="0" y1="6" x2="0" y2="24" stroke="#0284c7" strokeWidth="1" strokeDasharray="2,2" />
                <text x="0" y="36" fill="#0f172a" fontSize="10" fontWeight="700" textAnchor="middle" fontFamily="var(--font-mono)">
                  {b.wavenumber} cm⁻¹
                </text>
              </g>
            );
          })}

          {/* Axis Titles */}
          <text x={(X_LEFT + X_RIGHT) / 2} y={Y_BOTTOM + 36} fill="#64748b" fontSize="11" fontWeight="700" textAnchor="middle">
            Bilangan Gelombang / Wavenumber (cm⁻¹)
          </text>
          <text x="20" y={(Y_TOP + Y_BOTTOM) / 2} fill="#64748b" fontSize="11" fontWeight="700" textAnchor="middle" transform={`rotate(-90 20 ${(Y_TOP + Y_BOTTOM) / 2})`}>
            % Transmitansi (%T)
          </text>
        </svg>
      </div>

      {/* Info Card on Hovered Peak */}
      {hoveredBand ? (
        <div
          className="glass-panel"
          style={{
            padding: '14px 18px',
            background: '#f0f9ff',
            borderColor: '#bae6fd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={18} color="#0284c7" />
            <div>
              <strong style={{ color: '#0284c7', fontSize: '14px' }}>
                Puncak {hoveredBand.wavenumber} cm⁻¹: {hoveredBand.bond}
              </strong>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Modus: <strong>{hoveredBand.vibration}</strong> • Intensitas: {hoveredBand.intensity}
              </div>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-primary)', maxWidth: '420px', textAlign: 'right' }}>
            {hoveredBand.description}
          </p>
        </div>
      ) : (
        <div
          style={{
            padding: '10px 16px',
            background: '#f8fafc',
            borderRadius: '10px',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: 'var(--text-muted)',
          }}
        >
          <HelpCircle size={16} />
          Arahkan kursor pada puncak serapan spektra di atas untuk melihat ikatan kimia dan modus vibrasi molekul.
        </div>
      )}
    </div>
  );
};
