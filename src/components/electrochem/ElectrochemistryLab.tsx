import React, { useState, useMemo, useEffect } from 'react';
import {
  Zap,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import {
  REDOX_COUPLES,
  CELL_PRESETS,
} from '../../data/electrochemData';
import type { CellPreset } from '../../data/electrochemData';

export const ElectrochemistryLab: React.FC = () => {
  const [anodeId, setAnodeId] = useState<string>('zn');
  const [cathodeId, setCathodeId] = useState<string>('cu');
  const [electronAnimStep, setElectronAnimStep] = useState<number>(0);

  const anode = useMemo(
    () => REDOX_COUPLES.find((c) => c.id === anodeId) || REDOX_COUPLES[6], // Default Zn
    [anodeId]
  );
  const cathode = useMemo(
    () => REDOX_COUPLES.find((c) => c.id === cathodeId) || REDOX_COUPLES[12], // Default Cu
    [cathodeId]
  );

  // Cell Potential: E°cell = E°cathode - E°anode
  const eCell = useMemo(() => {
    return parseFloat((cathode.standardPotential - anode.standardPotential).toFixed(2));
  }, [anode, cathode]);

  const isSpontaneous = eCell > 0;

  // Animation ticker for electron drift
  useEffect(() => {
    if (!isSpontaneous) return;
    const interval = setInterval(() => {
      setElectronAnimStep((prev) => (prev + 1) % 100);
    }, 40);
    return () => clearInterval(interval);
  }, [isSpontaneous]);

  const handleApplyPreset = (preset: CellPreset) => {
    setAnodeId(preset.anodeId);
    setCathodeId(preset.cathodeId);
  };

  const handleSwap = () => {
    const temp = anodeId;
    setAnodeId(cathodeId);
    setCathodeId(temp);
  };

  return (
    <div className="electro-container">
      {/* Header Card */}
      <div className="electro-header-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)',
              }}
            >
              <Zap size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Laboratorium Sel Elektrokimia & Sel Volta 3D
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Simulasi transfer elektron spontan, jembatan garam, dan penentuan tegangan sel standar E°
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="btn btn-secondary"
              onClick={handleSwap}
              style={{ fontSize: '12px', gap: '6px' }}
              title="Tukar elektroda anoda dan katoda"
            >
              <RotateCcw size={14} />
              Tukar Elektroda
            </button>
          </div>
        </div>

        {/* Preset Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Contoh Sel Populer:
          </span>
          {CELL_PRESETS.map((preset) => {
            const isActive = anodeId === preset.anodeId && cathodeId === preset.cathodeId;
            return (
              <button
                key={preset.name}
                className="preset-chip"
                style={
                  isActive
                    ? { background: '#0284c7', color: '#ffffff', borderColor: '#0284c7' }
                    : {}
                }
                onClick={() => handleApplyPreset(preset)}
              >
                {preset.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Control Panel + Animated Workbench */}
      <div className="electro-main-grid">
        {/* Left Controls Card */}
        <div className="electro-controls-card">
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} color="#0284c7" />
            Konfigurasi Setengah Sel
          </div>

          {/* Anode Selector */}
          <div className="electrode-select-box anode">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ color: '#ef4444', fontSize: '12px', textTransform: 'uppercase' }}>
                Anoda (-) • Oksidasi
              </strong>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700 }}>
                {anode.standardPotential > 0 ? `+${anode.standardPotential.toFixed(2)}` : anode.standardPotential.toFixed(2)} V
              </span>
            </div>
            <select
              className="select-dropdown"
              value={anodeId}
              onChange={(e) => setAnodeId(e.target.value)}
            >
              {REDOX_COUPLES.map((c) => (
                <option key={`anode-${c.id}`} value={c.id}>
                  {c.nameId} ({c.standardPotential > 0 ? `+${c.standardPotential.toFixed(2)}` : c.standardPotential.toFixed(2)} V)
                </option>
              ))}
            </select>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Larutan: <strong>{anode.solutionName}</strong>
            </span>
          </div>

          {/* Cathode Selector */}
          <div className="electrode-select-box cathode">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ color: '#3b82f6', fontSize: '12px', textTransform: 'uppercase' }}>
                Katoda (+) • Reduksi
              </strong>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700 }}>
                {cathode.standardPotential > 0 ? `+${cathode.standardPotential.toFixed(2)}` : cathode.standardPotential.toFixed(2)} V
              </span>
            </div>
            <select
              className="select-dropdown"
              value={cathodeId}
              onChange={(e) => setCathodeId(e.target.value)}
            >
              {REDOX_COUPLES.map((c) => (
                <option key={`cathode-${c.id}`} value={c.id}>
                  {c.nameId} ({c.standardPotential > 0 ? `+${c.standardPotential.toFixed(2)}` : c.standardPotential.toFixed(2)} V)
                </option>
              ))}
            </select>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Larutan: <strong>{cathode.solutionName}</strong>
            </span>
          </div>

          {/* Cell Reaction Equations */}
          <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Persamaan Reaksi Sel:
            </span>
            <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
              <span style={{ color: '#ef4444' }}>Oksidasi: </span>
              {anode.symbol} ⟶ {anode.ion} + {anode.electronCount}e⁻
            </div>
            <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
              <span style={{ color: '#3b82f6' }}>Reduksi: </span>
              {cathode.ion} + {cathode.electronCount}e⁻ ⟶ {cathode.symbol}
            </div>
            <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '6px', fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
              Notasi Sel: {anode.symbol} | {anode.ion} || {cathode.ion} | {cathode.symbol}
            </div>
          </div>
        </div>

        {/* Right Cell Animated Workbench */}
        <div className="cell-workbench">
          {/* Voltmeter HUD */}
          <div className="voltmeter-display">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={22} color={isSpontaneous ? '#eab308' : '#94a3b8'} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Voltmeter Digital (E°sel)
                </span>
                <span className="volts-value">
                  {eCell > 0 ? `+${eCell.toFixed(2)}` : eCell.toFixed(2)} V
                </span>
              </div>
            </div>

            <div style={{ width: '1px', height: '32px', background: 'var(--border-color)' }} />

            {/* Spontaneity Badge */}
            <div className={`spontaneous-badge ${isSpontaneous ? 'spontaneous' : 'non-spontaneous'}`}>
              {isSpontaneous ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
              {isSpontaneous ? 'Reaksi Spontan (Baterai Bekerja)' : 'Reaksi Tidak Spontan'}
            </div>

            {/* Mini Lightbulb Indicator */}
            {isSpontaneous && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: eCell > 1 ? '#d97706' : '#94a3b8',
                }}
              >
                <Lightbulb size={20} className={eCell > 1 ? 'animate-pulse' : ''} />
              </div>
            )}
          </div>

          {/* SVG Animated Beakers, Electrodes, Salt Bridge, and Wire */}
          <svg className="cell-svg-stage" viewBox="0 0 800 480">
            <defs>
              {/* Solution gradients */}
              <linearGradient id="anodeSolGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
                <stop offset="100%" stopColor={anode.solutionColor} />
              </linearGradient>
              <linearGradient id="cathodeSolGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
                <stop offset="100%" stopColor={cathode.solutionColor} />
              </linearGradient>

              {/* Salt bridge glass gradient */}
              <linearGradient id="saltBridgeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
                <stop offset="100%" stopColor="rgba(224,242,254,0.7)" />
              </linearGradient>
            </defs>

            {/* Table Surface */}
            <rect x="50" y="420" width="700" height="20" rx="4" fill="#cbd5e1" opacity="0.6" />

            {/* Left Beaker (Anode) */}
            <g transform="translate(140, 190)">
              {/* Glass container */}
              <rect x="0" y="0" width="180" height="230" rx="10" fill="none" stroke="#94a3b8" strokeWidth="3" />
              {/* Solution */}
              <rect x="3" y="60" width="174" height="166" rx="8" fill="url(#anodeSolGrad)" />
              <line x1="3" y1="60" x2="177" y2="60" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.4" />

              {/* Submerged Anode Bar */}
              <rect
                x="60"
                y="10"
                width="34"
                height="190"
                rx="4"
                fill={anode.color}
                stroke="#475569"
                strokeWidth="1.5"
                filter="drop-shadow(0 2px 6px rgba(0,0,0,0.1))"
              />
              <text x="77" y="100" fill="#0f172a" fontSize="13" fontWeight="800" textAnchor="middle">
                {anode.symbol}
              </text>
              <text x="77" y="120" fill="#ef4444" fontSize="11" fontWeight="700" textAnchor="middle">
                Anoda (-)
              </text>

              {/* Beaker Label */}
              <text x="90" y="250" fill="#64748b" fontSize="12" fontWeight="600" textAnchor="middle">
                {anode.solutionName}
              </text>
            </g>

            {/* Right Beaker (Cathode) */}
            <g transform="translate(480, 190)">
              {/* Glass container */}
              <rect x="0" y="0" width="180" height="230" rx="10" fill="none" stroke="#94a3b8" strokeWidth="3" />
              {/* Solution */}
              <rect x="3" y="60" width="174" height="166" rx="8" fill="url(#cathodeSolGrad)" />
              <line x1="3" y1="60" x2="177" y2="60" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.4" />

              {/* Submerged Cathode Bar */}
              <rect
                x="86"
                y="10"
                width="34"
                height="190"
                rx="4"
                fill={cathode.color}
                stroke="#475569"
                strokeWidth="1.5"
                filter="drop-shadow(0 2px 6px rgba(0,0,0,0.1))"
              />
              <text x="103" y="100" fill="#ffffff" fontSize="13" fontWeight="800" textAnchor="middle">
                {cathode.symbol}
              </text>
              <text x="103" y="120" fill="#3b82f6" fontSize="11" fontWeight="700" textAnchor="middle">
                Katoda (+)
              </text>

              {/* Beaker Label */}
              <text x="90" y="250" fill="#64748b" fontSize="12" fontWeight="600" textAnchor="middle">
                {cathode.solutionName}
              </text>
            </g>

            {/* Salt Bridge (Inverted U-Tube) */}
            <path
              d="M 280,310 L 280,210 Q 280,180 310,180 L 490,180 Q 520,180 520,210 L 520,310"
              fill="none"
              stroke="url(#saltBridgeGrad)"
              strokeWidth="28"
              strokeLinecap="round"
            />
            <path
              d="M 280,310 L 280,210 Q 280,180 310,180 L 490,180 Q 520,180 520,210 L 520,310"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2"
            />
            <text x="400" y="174" fill="#0284c7" fontSize="11" fontWeight="700" textAnchor="middle">
              Jembatan Garam (KNO₃ / Agar-agar)
            </text>

            {/* External Copper Wire Circuit */}
            <path
              id="wireCircuit"
              d="M 217,200 L 217,110 Q 217,90 237,90 L 370,90 M 430,90 L 563,90 Q 583,90 583,110 L 583,200"
              fill="none"
              stroke="#b45309"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Voltmeter / Bulb Circle in the middle of wire */}
            <circle cx="400" cy="90" r="24" fill="#ffffff" stroke="#0284c7" strokeWidth="3" />
            <text x="400" y="96" fill="#0284c7" fontSize="16" fontWeight="800" textAnchor="middle">
              V
            </text>

            {/* Animated Electron Drift Particles along wire (from left Anode to right Cathode) */}
            {isSpontaneous &&
              [0, 20, 40, 60, 80].map((offset) => {
                const pos = (electronAnimStep + offset) % 100;
                // Parametric position along wire path
                let cx = 217;
                let cy = 200;
                if (pos < 20) {
                  // Up from Anode
                  cx = 217;
                  cy = 200 - (pos / 20) * 110;
                } else if (pos < 45) {
                  // Across to Voltmeter
                  cx = 217 + ((pos - 20) / 25) * 153;
                  cy = 90;
                } else if (pos < 55) {
                  // Inside voltmeter
                  cx = 370 + ((pos - 45) / 10) * 60;
                  cy = 90;
                } else if (pos < 80) {
                  // Across from voltmeter to right corner
                  cx = 430 + ((pos - 55) / 25) * 153;
                  cy = 90;
                } else {
                  // Down to Cathode
                  cx = 583;
                  cy = 90 + ((pos - 80) / 20) * 110;
                }

                return (
                  <g key={`electron-${offset}`}>
                    <circle cx={cx} cy={cy} r="5" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
                    <text x={cx} y={cy + 3} fill="#713f12" fontSize="7" fontWeight="900" textAnchor="middle">
                      e⁻
                    </text>
                  </g>
                );
              })}
          </svg>
        </div>
      </div>

      {/* Electrochemical Series (Deret Volta) Bar */}
      <div className="volta-series-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
            <Info size={16} color="#0284c7" />
            Deret Volta & Potensial Reduksi Standar (E°)
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Semakin ke kiri = Reduktor kuat (mudah teroksidasi) • Semakin ke kanan = Oksidator kuat
          </span>
        </div>

        <div className="volta-scroll-bar">
          {REDOX_COUPLES.map((couple) => {
            const isAnode = couple.id === anodeId;
            const isCathode = couple.id === cathodeId;
            return (
              <div
                key={`volta-${couple.id}`}
                className={`volta-metal-chip ${isAnode ? 'is-anode' : ''} ${isCathode ? 'is-cathode' : ''}`}
                title={`${couple.nameId}: E° = ${couple.standardPotential > 0 ? `+${couple.standardPotential.toFixed(2)}` : couple.standardPotential.toFixed(2)} V`}
              >
                <strong>{couple.symbol}</strong>
                <span>
                  {couple.standardPotential > 0 ? `+${couple.standardPotential.toFixed(2)}` : couple.standardPotential.toFixed(2)}V
                </span>
                {isAnode && (
                  <span style={{ fontSize: '9px', fontWeight: 700, color: '#ef4444' }}>
                    ANODA
                  </span>
                )}
                {isCathode && (
                  <span style={{ fontSize: '9px', fontWeight: 700, color: '#3b82f6' }}>
                    KATODA
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
