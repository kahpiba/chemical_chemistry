import React, { useState, useMemo } from 'react';
import {
  Zap,
  Sun,
  Moon,
  Sparkles,
  Calculator,
  Radio,
  Info,
} from 'lucide-react';
import {
  BOHR_HYDROGEN_SERIES,
  GAS_DISCHARGE_ELEMENTS,
} from '../../data/bohrSpectraData';
import type {
  GasDischargeElement,
  BohrTransitionSeries,
} from '../../data/bohrSpectraData';
import { playClick, playPop } from '../../utils/audio';

export const BohrSpectroscopyLab: React.FC = () => {
  const [selectedSeries, setSelectedSeries] = useState<BohrTransitionSeries>(BOHR_HYDROGEN_SERIES[0]);
  const [selectedGas, setSelectedGas] = useState<GasDischargeElement>(GAS_DISCHARGE_ELEMENTS[0]);
  const [spectrumMode, setSpectrumMode] = useState<'emission' | 'absorption'>('emission');
  const [activeTabMode, setActiveTabMode] = useState<'bohr_hydrogen' | 'gas_tubes'>('bohr_hydrogen');

  // Custom Rydberg calculation states
  const [nInitial, setNInitial] = useState<number>(3);
  const [nFinal, setNFinal] = useState<number>(2);

  // Rydberg Calculation for Hydrogen
  const rydbergResult = useMemo(() => {
    if (nInitial <= nFinal) {
      return { valid: false, message: 'n_awal harus lebih besar dari n_akhir untuk emisi foton.' };
    }
    const R_H = 1.097373e7; // m^-1
    const invLambda = R_H * (1 / (nFinal * nFinal) - 1 / (nInitial * nInitial));
    const lambdaM = 1 / invLambda;
    const lambdaNm = lambdaM * 1e9;
    const energyEv = 13.6057 * (1 / (nFinal * nFinal) - 1 / (nInitial * nInitial));

    // Approximate RGB color from wavelength (nm)
    let color = '#94a3b8';
    if (lambdaNm < 380) color = '#6366f1'; // UV
    else if (lambdaNm <= 440) color = '#8b5cf6'; // Violet
    else if (lambdaNm <= 490) color = '#06b6d4'; // Cyan/Blue
    else if (lambdaNm <= 560) color = '#22c55e'; // Green
    else if (lambdaNm <= 590) color = '#eab308'; // Yellow
    else if (lambdaNm <= 635) color = '#f97316'; // Orange
    else if (lambdaNm <= 750) color = '#ef4444'; // Red
    else color = '#991b1b'; // IR

    return {
      valid: true,
      lambdaNm: parseFloat(lambdaNm.toFixed(1)),
      energyEv: parseFloat(energyEv.toFixed(2)),
      color,
      region:
        lambdaNm < 380
          ? 'Sinar Ultraviolet (UV)'
          : lambdaNm > 750
          ? 'Sinar Inframerah (IR)'
          : 'Cahaya Tampak (Visible)',
    };
  }, [nInitial, nFinal]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Header Card */}
      <div className="glass-panel" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #8b5cf6, #d946ef)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
              }}
            >
              <Zap size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Spektroskopi Emisi & Model Atom Bohr
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Kuantisasi energi elektron, deret spektrum hidrogen Balmer & garis serapan Fraunhofer
              </span>
            </div>
          </div>

          {/* Mode Tabs: Bohr Hydrogen vs Gas Discharge Tubes */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`filter-pill ${activeTabMode === 'bohr_hydrogen' ? 'active' : ''}`}
              onClick={() => setActiveTabMode('bohr_hydrogen')}
              style={{ fontSize: '12px', gap: '6px' }}
            >
              <Radio size={14} />
              Deret Kuantum Hidrogen
            </button>
            <button
              className={`filter-pill ${activeTabMode === 'gas_tubes' ? 'active' : ''}`}
              onClick={() => setActiveTabMode('gas_tubes')}
              style={{ fontSize: '12px', gap: '6px' }}
            >
              <Sparkles size={14} />
              Tabung Lucutan Gas Plasma
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage */}
      {activeTabMode === 'bohr_hydrogen' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: '16px' }} className="crystal-grid-layout">
          {/* Left Column: Bohr Model Orbit Animation & Spectrum Bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Hydrogen Series Selector */}
            <div className="glass-panel" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                Pilih Deret Spektrum Hidrogen:
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                {BOHR_HYDROGEN_SERIES.map((ser) => (
                  <button
                    key={ser.id}
                    className={`filter-pill ${selectedSeries.id === ser.id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedSeries(ser);
                      setNFinal(ser.nFinal);
                      setNInitial(ser.nFinal + 1);
                      playClick();
                    }}
                    style={{ fontSize: '12px' }}
                  >
                    {ser.name.split('(')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Spectrum Bar Visualizer (Emission vs Absorption) */}
            <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Spektogram Optik ({spectrumMode === 'emission' ? 'Spektrum Emisi Garis Terang' : 'Spektrum Absorpsi Garis Gelap'})
                </span>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    className={`filter-pill ${spectrumMode === 'emission' ? 'active' : ''}`}
                    onClick={() => setSpectrumMode('emission')}
                    style={{ fontSize: '11px', padding: '4px 10px', gap: '4px' }}
                  >
                    <Moon size={12} />
                    Mode Emisi
                  </button>
                  <button
                    className={`filter-pill ${spectrumMode === 'absorption' ? 'active' : ''}`}
                    onClick={() => setSpectrumMode('absorption')}
                    style={{ fontSize: '11px', padding: '4px 10px', gap: '4px' }}
                  >
                    <Sun size={12} />
                    Mode Absorpsi
                  </button>
                </div>
              </div>

              {/* Spectral Bar Display */}
              <div
                style={{
                  position: 'relative',
                  height: '74px',
                  borderRadius: '10px',
                  background:
                    spectrumMode === 'emission'
                      ? '#0f172a'
                      : 'linear-gradient(90deg, #6366f1 0%, #3b82f6 20%, #06b6d4 35%, #10b981 50%, #eab308 65%, #f97316 80%, #ef4444 100%)',
                  border: '1px solid #cbd5e1',
                  overflow: 'hidden',
                  boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.2)',
                }}
              >
                {/* Visible Spectral Lines */}
                {selectedSeries.transitions.map((t, idx) => {
                  // Map 380 nm - 750 nm to percentage width
                  const pct = Math.max(3, Math.min(97, ((t.wavelength - 380) / (750 - 380)) * 100));

                  return (
                    <div
                      key={`trans-${idx}`}
                      style={{
                        position: 'absolute',
                        left: `${pct}%`,
                        top: 0,
                        bottom: 0,
                        width: '3px',
                        background: spectrumMode === 'emission' ? t.color : '#000000',
                        boxShadow:
                          spectrumMode === 'emission'
                            ? `0 0 10px ${t.color}, 0 0 4px #ffffff`
                            : 'none',
                        cursor: 'pointer',
                        zIndex: 2,
                      }}
                      title={`${t.name}: ${t.wavelength} nm`}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          top: '6px',
                          left: '6px',
                          background: 'rgba(15, 23, 42, 0.85)',
                          color: '#ffffff',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '9px',
                          fontFamily: 'var(--font-mono)',
                          whiteSpace: 'nowrap',
                          pointerEvents: 'none',
                        }}
                      >
                        {t.wavelength} nm ({t.name.split(' ')[0]})
                      </span>
                    </div>
                  );
                })}

                {/* Scale Ticks */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '4px',
                    left: '8px',
                    right: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '9px',
                    fontFamily: 'var(--font-mono)',
                    color: spectrumMode === 'emission' ? '#94a3b8' : '#ffffff',
                    fontWeight: 700,
                    textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                  }}
                >
                  <span>380 nm (UV-Violet)</span>
                  <span>480 nm</span>
                  <span>580 nm</span>
                  <span>680 nm</span>
                  <span>750 nm (Merah/IR)</span>
                </div>
              </div>
            </div>

            {/* Bohr Concentric Orbits Visualization (SVG) */}
            <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Diagram Orbit Kuantum Bohr (Transisi Elektron n={nInitial} → n={nFinal})
                </span>
                <span style={{ fontSize: '11px', color: '#8b5cf6', fontWeight: 700 }}>
                  Foton Terpancar: λ = {rydbergResult.lambdaNm} nm ({rydbergResult.energyEv} eV)
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', background: '#f8fafc', borderRadius: '12px', padding: '10px' }}>
                <svg viewBox="0 0 340 320" style={{ width: '100%', maxHeight: '280px' }}>
                  {/* Nucleus */}
                  <circle cx="170" cy="160" r="14" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                  <text x="170" y="164" fontSize="10" fontWeight="bold" fill="#ffffff" textAnchor="middle">
                    +1
                  </text>

                  {/* Electron Orbits n = 1 to 6 */}
                  {[1, 2, 3, 4, 5, 6].map((n) => {
                    const r = 26 + n * 21;
                    const isTarget = n === nFinal;
                    const isOrigin = n === nInitial;

                    return (
                      <g key={`orbit-${n}`}>
                        <circle
                          cx="170"
                          cy="160"
                          r={r}
                          fill="none"
                          stroke={isOrigin ? '#3b82f6' : isTarget ? '#8b5cf6' : '#cbd5e1'}
                          strokeWidth={isOrigin || isTarget ? 2 : 1}
                          strokeDasharray={isOrigin || isTarget ? 'none' : '3 3'}
                        />
                        <text
                          x={170 + r + 4}
                          y="164"
                          fontSize="9"
                          fill={isOrigin ? '#3b82f6' : isTarget ? '#8b5cf6' : '#94a3b8'}
                          fontFamily="var(--font-mono)"
                          fontWeight={isOrigin || isTarget ? 'bold' : 'normal'}
                        >
                          n={n}
                        </text>
                      </g>
                    );
                  })}

                  {/* Transition Arrow (from nInitial to nFinal) */}
                  {nInitial > nFinal && (
                    <g>
                      <line
                        x1={170}
                        y1={160 - (26 + nInitial * 21)}
                        x2={170}
                        y2={160 - (26 + nFinal * 21)}
                        stroke={rydbergResult.color || '#8b5cf6'}
                        strokeWidth="2.5"
                        markerEnd="url(#arrow)"
                      />
                      {/* Emitted Photon Wave (Wiggle) */}
                      <path
                        d={`M 170 ${160 - (26 + nFinal * 21)} Q 195 ${160 - (26 + nFinal * 21) - 15} 220 ${160 - (26 + nFinal * 21) + 10} T 270 ${160 - (26 + nFinal * 21)}`}
                        fill="none"
                        stroke={rydbergResult.color || '#8b5cf6'}
                        strokeWidth="2"
                        strokeDasharray="4 2"
                      />
                      <circle
                        cx="270"
                        cy={160 - (26 + nFinal * 21)}
                        r="4"
                        fill={rydbergResult.color || '#8b5cf6'}
                      />
                      <text
                        x="276"
                        y={160 - (26 + nFinal * 21) + 4}
                        fontSize="9"
                        fontWeight="bold"
                        fill={rydbergResult.color || '#8b5cf6'}
                      >
                        hν (Foton)
                      </text>
                    </g>
                  )}
                </svg>
              </div>
            </div>
          </div>

          {/* Right Column: Rydberg Calculator & Theory */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Interactive Rydberg Formula Calculator */}
            <div className="glass-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calculator size={18} color="#8b5cf6" />
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Kalkulator Formula Rydberg
                </h3>
              </div>

              {/* Orbit Selectors */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Kulit Awal (n_awal):</span>
                  <select
                    className="stoich-val-input"
                    style={{ width: '100%', marginTop: '4px', textAlign: 'left' }}
                    value={nInitial}
                    onChange={(e) => {
                      setNInitial(parseInt(e.target.value));
                      playPop();
                    }}
                  >
                    {[2, 3, 4, 5, 6].map((n) => (
                      <option key={`ni-${n}`} value={n}>
                        n = {n}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Kulit Akhir (n_akhir):</span>
                  <select
                    className="stoich-val-input"
                    style={{ width: '100%', marginTop: '4px', textAlign: 'left' }}
                    value={nFinal}
                    onChange={(e) => {
                      setNFinal(parseInt(e.target.value));
                      playPop();
                    }}
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={`nf-${n}`} value={n}>
                        n = {n}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Formula & Result Display */}
              {rydbergResult.valid ? (
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    Rumus: 1/λ = R_H × (1/n₁² - 1/n₂²)
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600 }}>Panjang Gelombang (λ):</span>
                    <strong style={{ fontSize: '15px', color: rydbergResult.color, fontFamily: 'var(--font-mono)' }}>
                      {rydbergResult.lambdaNm} nm
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600 }}>Energi Foton (ΔE):</span>
                    <strong style={{ fontSize: '13px', color: '#0284c7', fontFamily: 'var(--font-mono)' }}>
                      {rydbergResult.energyEv} eV
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600 }}>Wilayah Spektrum:</span>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#6d28d9' }}>
                      {rydbergResult.region}
                    </span>
                  </div>
                </div>
              ) : (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '10px', borderRadius: '8px', color: '#dc2626', fontSize: '12px' }}>
                  {rydbergResult.message}
                </div>
              )}
            </div>

            {/* Postulat Bohr Card */}
            <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', background: '#fdf4ff', borderColor: '#f0abfc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#86198f', fontSize: '13px', fontWeight: 700 }}>
                <Sparkles size={15} />
                Postulat Kuantum Niels Bohr (1913)
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: '#701a75', lineHeight: 1.55 }}>
                1. Elektron mengorbit inti hanya pada lintasan stasioner diskrit tertentu tanpa memancarkan energi.
                <br />
                2. Foton dipancarkan atau diserap hanya saat elektron bertransisi (melompat) antar-tingkat energi kuantum: <strong>ΔE = E₂ - E₁ = h·ν = h·c/λ</strong>.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Gas Discharge Tubes Mode */
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: '16px' }} className="crystal-grid-layout">
          {/* Left: Glowing Gas Discharge Tube Lamp */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Simulasi Tabung Lucutan Gas Tegangan Tinggi (Gas Discharge Lamp)
              </span>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                Z = {selectedGas.atomicNumber} • Gas {selectedGas.name}
              </span>
            </div>

            {/* Glowing Lamp Graphic */}
            <div
              style={{
                background: '#090d16',
                borderRadius: '16px',
                height: '240px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: `0 0 40px ${selectedGas.glowColor}25`,
              }}
            >
              {/* Glass Tube Frame */}
              <div
                style={{
                  width: '75%',
                  height: '46px',
                  borderRadius: '23px',
                  background: selectedGas.glowColor,
                  boxShadow: `0 0 50px ${selectedGas.glowColor}, 0 0 100px ${selectedGas.glowColor}80, inset 0 0 15px #ffffff`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '18px',
                  letterSpacing: '2px',
                  textShadow: '0 0 10px rgba(0,0,0,0.8)',
                  position: 'relative',
                }}
              >
                {/* Plasma Core Glow */}
                <div
                  style={{
                    width: '90%',
                    height: '14px',
                    borderRadius: '7px',
                    background: '#ffffff',
                    opacity: 0.85,
                  }}
                />
                <span style={{ position: 'absolute' }}>{selectedGas.symbol}</span>
              </div>
            </div>

            {/* Emission Lines Spectrum */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                Spektrum Garis Emisi Karakteristik {selectedGas.name}:
              </span>

              <div
                style={{
                  position: 'relative',
                  height: '60px',
                  background: '#0f172a',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid #334155',
                }}
              >
                {selectedGas.lines.map((line, idx) => {
                  const pct = Math.max(3, Math.min(97, ((line.wavelength - 380) / (750 - 380)) * 100));
                  return (
                    <div
                      key={`gas-line-${idx}`}
                      style={{
                        position: 'absolute',
                        left: `${pct}%`,
                        top: 0,
                        bottom: 0,
                        width: '3px',
                        background: line.color,
                        boxShadow: `0 0 8px ${line.color}`,
                      }}
                      title={`${line.label}: ${line.wavelength} nm`}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          top: '4px',
                          left: '6px',
                          background: 'rgba(0,0,0,0.8)',
                          color: '#ffffff',
                          padding: '1px 5px',
                          borderRadius: '3px',
                          fontSize: '8.5px',
                          fontFamily: 'var(--font-mono)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {line.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Gas Element Selector & Real World Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="glass-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Pilih Tabung Gas:
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {GAS_DISCHARGE_ELEMENTS.map((gas) => (
                  <button
                    key={gas.id}
                    className={`preset-chip ${selectedGas.id === gas.id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedGas(gas);
                      playClick();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 14px',
                      justifyContent: 'flex-start',
                      background: selectedGas.id === gas.id ? '#f1f5f9' : '#ffffff',
                      borderColor: selectedGas.id === gas.id ? '#0284c7' : '#e2e8f0',
                    }}
                  >
                    <span
                      style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        background: gas.glowColor,
                        border: '1px solid rgba(0,0,0,0.2)',
                      }}
                    />
                    <div style={{ textAlign: 'left' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>{gas.name}</strong>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Simbol: {gas.symbol} (Z = {gas.atomicNumber})</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Description & Application */}
            <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0284c7', fontSize: '13px', fontWeight: 700 }}>
                <Info size={15} />
                Aplikasi Sains & Industri
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {selectedGas.description}
              </p>
              <div style={{ marginTop: '4px', padding: '8px 10px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', fontSize: '11px', color: '#166534' }}>
                <strong>Pemanfaatan:</strong> {selectedGas.realWorldApplication}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
