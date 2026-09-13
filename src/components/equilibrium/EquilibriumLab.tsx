import React, { useState, useMemo } from 'react';
import {
  Scale,
  Snowflake,
  Zap,
  TrendingUp,
  Activity,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';
import { playGasPiston, playBunsenIgnite, playBeakerClink } from '../../utils/audio';
import '../../styles/equilibrium.css';

interface EquilibriumReaction {
  id: string;
  name: string;
  equation: string;
  reactantsText: string;
  productsText: string;
  deltaH: number; // kJ/mol, negative = exothermic forward
  reactantMolesGas: number;
  productMolesGas: number;
  description: string;
  colorReactant: string;
  colorProduct: string;
}

const REACTIONS: EquilibriumReaction[] = [
  {
    id: 'no2_n2o4',
    name: 'Disosiasi Dinitrogen Tetroksida',
    equation: '2 NO₂(g) ⇌ N₂O₄(g)',
    reactantsText: '2 mol NO₂ (Gas Cokelat Kemerahan)',
    productsText: '1 mol N₂O₄ (Gas Tidak Berwarna / Bening)',
    deltaH: -57.2,
    reactantMolesGas: 2,
    productMolesGas: 1,
    description:
      'Reaksi pembentukan N₂O₄ bersifat eksotermik (melepas kalor). Pengurangan volume (peningkatan tekanan) memicu pergeseran ke arah zat dengan koefisien gas lebih sedikit (N₂O₄).',
    colorReactant: 'rgba(180, 83, 9, 0.85)', // rich brown
    colorProduct: 'rgba(254, 243, 199, 0.2)', // transparent pale
  },
  {
    id: 'haber_bosch',
    name: 'Sintesis Amonia (Proses Haber-Bosch)',
    equation: 'N₂(g) + 3 H₂(g) ⇌ 2 NH₃(g)',
    reactantsText: '1 mol N₂ + 3 mol H₂ (Total 4 mol gas)',
    productsText: '2 mol NH₃ (Total 2 mol gas)',
    deltaH: -92.4,
    reactantMolesGas: 4,
    productMolesGas: 2,
    description:
      'Reaksi industri vital untuk pupuk nitrogen. Peningkatan tekanan kompresor secara drastis meningkatkan hasil produksi amonia karena koefisien kanan (2) lebih kecil dari kiri (4).',
    colorReactant: 'rgba(59, 130, 246, 0.4)',
    colorProduct: 'rgba(16, 185, 129, 0.4)',
  },
  {
    id: 'so2_so3',
    name: 'Oksidasi Belerang Dioksida (Proses Kontak)',
    equation: '2 SO₂(g) + O₂(g) ⇌ 2 SO₃(g)',
    reactantsText: '2 mol SO₂ + 1 mol O₂ (Total 3 mol gas)',
    productsText: '2 mol SO₃ (Total 2 mol gas)',
    deltaH: -198.0,
    reactantMolesGas: 3,
    productMolesGas: 2,
    description:
      'Langkah inti pembuatan asam sulfat (H₂SO₄). Menggunakan katalis vanadium(V) oksida (V₂O₅) untuk mempercepat laju reaksi pada suhu optimum.',
    colorReactant: 'rgba(245, 158, 11, 0.5)',
    colorProduct: 'rgba(99, 102, 241, 0.5)',
  },
];

export const EquilibriumLab: React.FC = () => {
  const [selectedReaction, setSelectedReaction] = useState<EquilibriumReaction>(REACTIONS[0]);

  // Parameters
  const [volume, setVolume] = useState<number>(2.0); // Liters: 0.8 to 4.0
  const [temperature, setTemperature] = useState<number>(298); // Kelvin: 220 to 450
  const [reactantAdded, setReactantAdded] = useState<number>(1.0); // Multiplier: 0.5 to 2.5
  const [hasCatalyst, setHasCatalyst] = useState<boolean>(false);

  // Equilibrium calculations based on Le Chatelier's Principle
  const simulation = useMemo(() => {
    // Standard Kc at 298 K
    const baseKc = 8.8; // for NO2/N2O4
    // Van 't Hoff approximation: ln(K2/K1) = -deltaH/R * (1/T2 - 1/T1)
    const R = 8.314e-3; // kJ/(mol*K)
    const exponent = -(selectedReaction.deltaH / R) * (1 / temperature - 1 / 298);
    const currentKc = Math.max(0.01, baseKc * Math.exp(exponent));

    // Effect of volume / pressure:
    // P is inversely proportional to V (P ~ 1/V)
    const pressure = 2.0 / volume; // normalized atm

    // Net shift score: positive means shift RIGHT (to products), negative means shift LEFT (to reactants)
    // 1. Pressure effect: deltaMoles = productMoles - reactantMoles
    const deltaMoles = selectedReaction.productMolesGas - selectedReaction.reactantMolesGas;
    const pressureEffect = -deltaMoles * (pressure - 1.0) * 1.5;

    // 2. Temp effect: If deltaH < 0 (exothermic), increasing T shifts LEFT (negative)
    const tempEffect = (selectedReaction.deltaH < 0 ? -1 : 1) * ((temperature - 298) / 80);

    // 3. Reactant addition effect: adding reactant shifts RIGHT
    const reactantEffect = (reactantAdded - 1.0) * 1.8;

    const netScore = pressureEffect + tempEffect + reactantEffect;

    // Fraction of products vs reactants (between 0.1 and 0.9)
    const productFraction = Math.min(0.92, Math.max(0.08, 0.5 + netScore * 0.18));
    const reactantFraction = 1 - productFraction;

    let shiftDirection: 'right' | 'left' | 'balanced' = 'balanced';
    let shiftText = 'Sistem berada dalam Kesetimbangan Dinamis (Q = Kc)';
    let shiftReason = 'Laju reaksi maju sama dengan laju reaksi balik.';

    if (netScore > 0.15) {
      shiftDirection = 'right';
      shiftText = 'Pergeseran Kesetimbangan ke Kanan (Membentuk Produk)';
      if (pressureEffect > 0.3) {
        shiftReason = `Peningkatan tekanan (Volume menyusut jadi ${volume.toFixed(1)} L) mendorong reaksi ke sisi dengan koefisien gas lebih sedikit.`;
      } else if (tempEffect > 0.3) {
        shiftReason = `Penurunan suhu (${temperature} K) menguntungkan reaksi eksotermik pembentukan produk.`;
      } else {
        shiftReason = 'Penambahan konsentrasi reaktan memicu sistem mengonsumsi reaktan untuk menghasilkan produk.';
      }
    } else if (netScore < -0.15) {
      shiftDirection = 'left';
      shiftText = 'Pergeseran Kesetimbangan ke Kiri (Membentuk Reaktan)';
      if (pressureEffect < -0.3) {
        shiftReason = `Penurunan tekanan (Volume membesar jadi ${volume.toFixed(1)} L) mendorong reaksi ke sisi dengan koefisien gas lebih banyak.`;
      } else if (tempEffect < -0.3) {
        shiftReason = `Peningkatan suhu (${temperature} K) memberi kalor, menggeser sistem ke arah endotermik (ke kiri).`;
      } else {
        shiftReason = 'Pengurangan konsentrasi reaktan menggeser reaksi ke kiri untuk mengimbangi gangguan.';
      }
    }

    // Cylinder chamber visual color
    let chamberBg = 'rgba(254, 243, 199, 0.25)';
    if (selectedReaction.id === 'no2_n2o4') {
      // High reactantFraction = deep brown NO2
      // Low reactantFraction = pale clear N2O4
      const alpha = Math.min(0.92, Math.max(0.08, reactantFraction * 0.9));
      chamberBg = `rgba(180, 83, 9, ${alpha.toFixed(2)})`;
    } else if (selectedReaction.id === 'haber_bosch') {
      const rAlpha = reactantFraction * 0.5;
      const pAlpha = productFraction * 0.5;
      chamberBg = `linear-gradient(180deg, rgba(59, 130, 246, ${rAlpha.toFixed(2)}) 0%, rgba(16, 185, 129, ${pAlpha.toFixed(2)}) 100%)`;
    } else {
      chamberBg = `linear-gradient(180deg, rgba(245, 158, 11, ${(reactantFraction * 0.4).toFixed(2)}) 0%, rgba(99, 102, 241, ${(productFraction * 0.4).toFixed(2)}) 100%)`;
    }

    return {
      currentKc,
      pressure,
      productFraction,
      reactantFraction,
      shiftDirection,
      shiftText,
      shiftReason,
      chamberBg,
    };
  }, [selectedReaction, volume, temperature, reactantAdded]);

  // Activation Energy graph calculations
  const eaData = useMemo(() => {
    // Standard Ea without catalyst ~ 75 kJ, with catalyst ~ 35 kJ
    const eaUncat = 75;
    const eaCat = 38;
    const effectiveEa = hasCatalyst ? eaCat : eaUncat;
    const deltaH = selectedReaction.deltaH;

    return {
      eaUncat,
      eaCat,
      effectiveEa,
      deltaH,
    };
  }, [hasCatalyst, selectedReaction]);

  const handleReset = () => {
    setVolume(2.0);
    setTemperature(298);
    setReactantAdded(1.0);
    setHasCatalyst(false);
  };

  // Height of cylinder gas content (proportional to volume: 0.8 L = 80px, 4.0 L = 260px)
  const cylinderContentHeight = Math.round(70 + ((volume - 0.8) / (4.0 - 0.8)) * 190);

  return (
    <div className="equilibrium-container">
      {/* Header Card */}
      <div className="eq-header-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)',
              }}
            >
              <Scale size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Simulasi Kesetimbangan Kimia & Asas Le Chatelier
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Eksplorasi pergeseran kesetimbangan gas reversibel, pengaruh Suhu, Volume/Tekanan, dan Energi Aktivasi (Ea)
              </span>
            </div>
          </div>

          {/* Reaction System Selector */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {REACTIONS.map((rx) => (
              <button
                key={rx.id}
                className={`filter-pill ${selectedReaction.id === rx.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedReaction(rx);
                  handleReset();
                  playBeakerClink();
                }}
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                {rx.equation}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="eq-grid">
        {/* Left Column: Piston Chamber & Thermal Visualizer */}
        <div className="eq-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="eq-card-title">
              <Activity size={18} color="#f59e0b" />
              Tabung Piston Gas Reversibel
            </h3>
            <span
              style={{
                fontSize: '11px',
                padding: '3px 8px',
                borderRadius: '6px',
                background: '#f1f5f9',
                fontWeight: 600,
                color: '#475569',
              }}
            >
              P = {simulation.pressure.toFixed(2)} atm | V = {volume.toFixed(1)} L
            </span>
          </div>

          {/* Piston Chamber */}
          <div className="piston-chamber-wrapper">
            <div className="cylinder-glass" style={{ height: '280px' }}>
              {/* Measurement ticks */}
              <div className="cylinder-ticks">
                <div className="cylinder-tick"><span>4.0L</span></div>
                <div className="cylinder-tick"><span>3.0L</span></div>
                <div className="cylinder-tick"><span>2.0L</span></div>
                <div className="cylinder-tick"><span>1.0L</span></div>
              </div>

              {/* Piston Rod and Head */}
              <div
                style={{
                  position: 'absolute',
                  bottom: `${cylinderContentHeight}px`,
                  left: 0,
                  width: '100%',
                  transition: 'bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  zIndex: 20,
                }}
              >
                <div className="piston-head" />
                <div className="piston-rod" />
              </div>

              {/* Gas Contents */}
              <div
                className="gas-contents"
                style={{
                  height: `${cylinderContentHeight}px`,
                  background: simulation.chamberBg,
                }}
              >
                {/* Visual Gas Molecules Floating */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignContent: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    padding: '16px',
                    opacity: 0.85,
                    pointerEvents: 'none',
                  }}
                >
                  {/* Reactant particles */}
                  {Array.from({ length: Math.round(simulation.reactantFraction * 14) }).map((_, i) => (
                    <div
                      key={`r-${i}`}
                      style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        background: '#92400e',
                        border: '1.5px solid #ffffff',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                        animation: `pulse ${(1.2 + (i % 5) * 0.2).toFixed(1)}s infinite alternate ease-in-out`,
                      }}
                      title="Reaktan"
                    />
                  ))}
                  {/* Product particles */}
                  {Array.from({ length: Math.round(simulation.productFraction * 8) }).map((_, i) => (
                    <div
                      key={`p-${i}`}
                      style={{
                        width: '22px',
                        height: '12px',
                        borderRadius: '8px',
                        background: '#0284c7',
                        border: '1.5px solid #ffffff',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                        animation: `pulse ${(1.4 + (i % 4) * 0.3).toFixed(1)}s infinite alternate ease-in-out`,
                      }}
                      title="Produk"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Thermal Source Effect (Flame if hot, Ice if cold) */}
            <div className="thermal-effect">
              {temperature > 310 ? (
                <div className="burner-flame">
                  <div className="flame-particle" />
                  <div className="flame-particle" />
                  <div className="flame-particle" />
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#dc2626', marginLeft: '6px' }}>
                    Pemanasan ({temperature} K / {(temperature - 273).toFixed(0)}°C)
                  </span>
                </div>
              ) : temperature < 275 ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0284c7' }}>
                  <Snowflake size={20} className="animate-spin" style={{ animationDuration: '6s' }} />
                  <span style={{ fontSize: '11px', fontWeight: 700 }}>
                    Pendinginan ({temperature} K / {(temperature - 273).toFixed(0)}°C)
                  </span>
                </div>
              ) : (
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  Suhu Ruang Standar (298 K / 25°C)
                </span>
              )}
            </div>
          </div>

          {/* Shift Result Banner */}
          <div
            className={`shift-banner ${
              simulation.shiftDirection === 'right'
                ? 'forward'
                : simulation.shiftDirection === 'left'
                ? 'reverse'
                : 'neutral'
            }`}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', fontWeight: 700 }}>
                  {simulation.shiftText}
                </span>
                <span style={{ fontSize: '11px', fontFamily: 'monospace' }}>
                  Kc ≈ {simulation.currentKc.toFixed(2)}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '12px', fontWeight: 400, opacity: 0.9 }}>
                {simulation.shiftReason}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Controls, Reaction Dynamics, and Ea Curve */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Reaction Information Card */}
          <div className="eq-card">
            <h3 className="eq-card-title">
              <Sparkles size={18} color="#3b82f6" />
              Persamaan Termokimia & Komposisi
            </h3>

            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '12px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {selectedReaction.equation}
                </span>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: selectedReaction.deltaH < 0 ? '#fee2e2' : '#dbeafe',
                    color: selectedReaction.deltaH < 0 ? '#dc2626' : '#1d4ed8',
                  }}
                >
                  ΔH = {selectedReaction.deltaH} kJ/mol ({selectedReaction.deltaH < 0 ? 'Eksoterm' : 'Endoterm'})
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                {selectedReaction.description}
              </p>
            </div>

            {/* Composition Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600 }}>
                <span style={{ color: '#92400e' }}>
                  Reaktan ({(simulation.reactantFraction * 100).toFixed(0)}%)
                </span>
                <span style={{ color: '#0369a1' }}>
                  Produk ({(simulation.productFraction * 100).toFixed(0)}%)
                </span>
              </div>
              <div
                style={{
                  height: '14px',
                  borderRadius: '7px',
                  background: '#e2e8f0',
                  overflow: 'hidden',
                  display: 'flex',
                }}
              >
                <div
                  style={{
                    width: `${(simulation.reactantFraction * 100).toFixed(0)}%`,
                    background: 'linear-gradient(90deg, #d97706, #b45309)',
                    transition: 'width 0.4s ease',
                  }}
                />
                <div
                  style={{
                    width: `${(simulation.productFraction * 100).toFixed(0)}%`,
                    background: 'linear-gradient(90deg, #0284c7, #0369a1)',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Interactive Parameters Sliders */}
          <div className="eq-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="eq-card-title">
                <Info size={18} color="#64748b" />
                Variabel Gangguan (Aksi Asas Le Chatelier)
              </h3>
              <button
                onClick={handleReset}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  border: 'none',
                  background: 'none',
                  color: '#64748b',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                <RotateCcw size={13} />
                Reset Parameter
              </button>
            </div>

            <div className="eq-controls-grid">
              {/* Volume & Pressure Slider */}
              <div className="eq-control-group">
                <div className="eq-slider-label">
                  <span>Volume Silinder (V)</span>
                  <span className="eq-slider-value">{volume.toFixed(1)} L</span>
                </div>
                <input
                  type="range"
                  min={0.8}
                  max={4.0}
                  step={0.1}
                  value={volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    playGasPiston();
                  }}
                  style={{ accentColor: '#3b82f6', width: '100%', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                  Geser ke kiri = Volume kecil (Tekanan tinggi)
                </span>
              </div>

              {/* Temperature Slider */}
              <div className="eq-control-group">
                <div className="eq-slider-label">
                  <span>Suhu Reaksi (T)</span>
                  <span className="eq-slider-value">{temperature} K ({(temperature - 273).toFixed(0)}°C)</span>
                </div>
                <input
                  type="range"
                  min={230}
                  max={430}
                  step={5}
                  value={temperature}
                  onChange={(e) => {
                    const newT = parseInt(e.target.value);
                    if (newT > 320 && temperature <= 320) playBunsenIgnite();
                    setTemperature(newT);
                  }}
                  style={{ accentColor: '#f59e0b', width: '100%', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                  Eksoterm menyukai suhu dingin; Endoterm menyukai panas
                </span>
              </div>

              {/* Reactant Concentration Slider */}
              <div className="eq-control-group">
                <div className="eq-slider-label">
                  <span>Konsentrasi Reaktan</span>
                  <span className="eq-slider-value">{reactantAdded.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={2.5}
                  step={0.1}
                  value={reactantAdded}
                  onChange={(e) => setReactantAdded(parseFloat(e.target.value))}
                  style={{ accentColor: '#10b981', width: '100%', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                  Tambah zat = sistem bergeser mengonsumsinya
                </span>
              </div>

              {/* Catalyst Toggle */}
              <div className="eq-control-group" style={{ justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Zap size={16} color={hasCatalyst ? '#f59e0b' : '#94a3b8'} />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      Katalisator Reaksi
                    </span>
                  </div>
                  <button
                    onClick={() => setHasCatalyst(!hasCatalyst)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: hasCatalyst ? '#f59e0b' : '#cbd5e1',
                      background: hasCatalyst ? '#fef3c7' : '#ffffff',
                      color: hasCatalyst ? '#b45309' : '#64748b',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {hasCatalyst ? 'AKTIF (Ea Rendah)' : 'NONAKTIF'}
                  </button>
                </div>
                <span style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>
                  Katalis mempercepat kesetimbangan, TIDAK mengubah posisi Kc!
                </span>
              </div>
            </div>
          </div>

          {/* Activation Energy Curve (Ea) */}
          <div className="eq-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="eq-card-title">
                <TrendingUp size={18} color="#8b5cf6" />
                Diagram Profil Energi & Katalis (Ea)
              </h3>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#6d28d9' }}>
                Ea = {eaData.effectiveEa} kJ/mol
              </span>
            </div>

            <div className="ea-graph-container">
              <svg viewBox="0 0 400 160" className="ea-svg">
                {/* Axis lines */}
                <line x1="40" y1="130" x2="380" y2="130" stroke="#cbd5e1" strokeWidth="2" />
                <line x1="40" y1="20" x2="40" y2="130" stroke="#cbd5e1" strokeWidth="2" />
                <text x="375" y="145" fontSize="10" fill="#64748b" textAnchor="end">Progres Reaksi</text>
                <text x="35" y="25" fontSize="10" fill="#64748b" textAnchor="end" transform="rotate(-90 35 25)">Energi (E)</text>

                {/* Reactant plateau */}
                <line x1="40" y1="95" x2="90" y2="95" stroke="#b45309" strokeWidth="3" />
                <text x="50" y="85" fontSize="10" fontWeight="700" fill="#b45309">Reaktan</text>

                {/* Uncatalyzed peak (dashed gray or solid orange) */}
                <path
                  d="M 90 95 Q 180 15, 270 115"
                  fill="none"
                  stroke={hasCatalyst ? '#cbd5e1' : '#f59e0b'}
                  strokeWidth={hasCatalyst ? '1.5' : '3'}
                  strokeDasharray={hasCatalyst ? '4 3' : 'none'}
                />

                {/* Catalyzed curve (if active, highlighted purple) */}
                {hasCatalyst && (
                  <path
                    d="M 90 95 Q 180 50, 270 115"
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="3"
                  />
                )}

                {/* Product plateau */}
                <line x1="270" y1="115" x2="360" y2="115" stroke="#0284c7" strokeWidth="3" />
                <text x="295" y="110" fontSize="10" fontWeight="700" fill="#0284c7">Produk</text>

                {/* Ea Arrow Annotation */}
                <line
                  x1="180"
                  y1="95"
                  x2="180"
                  y2={hasCatalyst ? 52 : 18}
                  stroke="#ef4444"
                  strokeWidth="1.5"
                  markerEnd="url(#arrow)"
                />
                <text
                  x="188"
                  y={hasCatalyst ? 65 : 40}
                  fontSize="10"
                  fontWeight="700"
                  fill="#ef4444"
                >
                  Ea {hasCatalyst ? '(Katalis)' : ''}
                </text>

                {/* Delta H Annotation */}
                <line x1="330" y1="95" x2="330" y2="115" stroke="#10b981" strokeWidth="1.5" />
                <text x="338" y="108" fontSize="9" fontWeight="700" fill="#10b981">ΔH</text>
              </svg>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
                <span>• Ea Tanpa Katalis: <b>75 kJ/mol</b></span>
                <span>• Ea Dengan Katalis: <b style={{ color: '#8b5cf6' }}>38 kJ/mol (Turun 49%)</b></span>
                <span>• ΔH: <b>{selectedReaction.deltaH} kJ/mol</b></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
