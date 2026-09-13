import React, { useState, useMemo } from 'react';
import {
  TestTube,
  Sparkles,
  Droplets,
  ArrowRight,
  Layers,
  RotateCcw,
} from 'lucide-react';
import {
  calculateDilution,
  calculatePH,
  COMMON_SOLUTIONS,
} from '../../utils/solutionsLogic';
import type {
  SolutionType,
  SolutionPreset,
} from '../../utils/solutionsLogic';
import '../../styles/solutions.css';

export const SolutionsLab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'dilution' | 'ph_buffer'>('dilution');

  // Dilution state: M1 V1 = M2 V2
  const [v1, setV1] = useState<number>(50); // mL
  const [m1, setM1] = useState<number>(2.0); // M
  const [v2, setV2] = useState<number>(250); // mL

  const dilutionResult = useMemo(() => {
    return calculateDilution(v1, m1, v2);
  }, [v1, m1, v2]);

  // pH Calculator State
  const [selectedPreset, setSelectedPreset] = useState<SolutionPreset>(COMMON_SOLUTIONS[0]);
  const [solutionType, setSolutionType] = useState<SolutionType>('strong_acid');
  const [concentration, setConcentration] = useState<number>(0.1);
  const [valency, setValency] = useState<number>(1);
  const [ka, setKa] = useState<number>(1.8e-5);
  const [saltConcentration, setSaltConcentration] = useState<number>(0.1);

  const phResult = useMemo(() => {
    return calculatePH({
      type: solutionType,
      concentration,
      valency,
      ka,
      kb: ka, // reuse for weak base
      saltConcentration,
    });
  }, [solutionType, concentration, valency, ka, saltConcentration]);

  const handleApplyPreset = (preset: SolutionPreset) => {
    setSelectedPreset(preset);
    setSolutionType(preset.type);
    setConcentration(preset.defaultM);
    if (preset.valency) setValency(preset.valency);
    if (preset.ka) setKa(preset.ka);
    if (preset.kb) setKa(preset.kb);
  };

  return (
    <div className="solutions-container">
      {/* Header Card */}
      <div className="solutions-header-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0284c7, #06b6d4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
              }}
            >
              <TestTube size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Kalkulator Larutan, Pengenceran & pH Penyangga
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Simulasi hukum pengenceran (M₁V₁ = M₂V₂), larutan penyangga Henderson-Hasselbalch, dan hidrolisis garam
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`filter-pill ${activeSubTab === 'dilution' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('dilution')}
              style={{ gap: '6px' }}
            >
              <Droplets size={14} />
              Pengenceran (M₁V₁ = M₂V₂)
            </button>
            <button
              className={`filter-pill ${activeSubTab === 'ph_buffer' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('ph_buffer')}
              style={{ gap: '6px' }}
            >
              <Layers size={14} />
              Kalkulator pH & Penyangga
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Tab 1: Dilution Simulator */}
      {activeSubTab === 'dilution' && (
        <div className="solutions-main-grid">
          {/* Controls */}
          <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} color="#0284c7" />
                Parameter Larutan & Pengenceran
              </span>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setV1(50);
                  setM1(2.0);
                  setV2(250);
                }}
                style={{ fontSize: '11px', padding: '4px 10px', gap: '4px' }}
              >
                <RotateCcw size={12} /> Reset
              </button>
            </div>

            {/* Slider 1: V1 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span>Volume Larutan Pekat Awal (V₁):</span>
                <strong style={{ fontFamily: 'var(--font-mono)', color: '#0284c7' }}>{v1} mL</strong>
              </div>
              <input
                type="range"
                min="5"
                max="200"
                step="5"
                value={v1}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setV1(val);
                  if (val > v2) setV2(val);
                }}
                className="explode-slider"
              />
            </div>

            {/* Slider 2: M1 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span>Konsentrasi Awal (M₁):</span>
                <strong style={{ fontFamily: 'var(--font-mono)', color: '#0284c7' }}>{m1.toFixed(2)} M</strong>
              </div>
              <input
                type="range"
                min="0.1"
                max="5.0"
                step="0.1"
                value={m1}
                onChange={(e) => setM1(Number(e.target.value))}
                className="explode-slider"
              />
            </div>

            {/* Slider 3: V2 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span>Volume Akhir Target (V₂):</span>
                <strong style={{ fontFamily: 'var(--font-mono)', color: '#0284c7' }}>{v2} mL</strong>
              </div>
              <input
                type="range"
                min={v1}
                max="500"
                step="10"
                value={v2}
                onChange={(e) => setV2(Number(e.target.value))}
                className="explode-slider"
              />
            </div>

            {/* Dilution Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '6px' }}>
              <div style={{ padding: '12px', background: '#f0f9ff', borderRadius: '10px', border: '1px solid #bae6fd' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Konsentrasi Akhir (M₂)
                </span>
                <div style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#0284c7' }}>
                  {dilutionResult.m2} M
                </div>
              </div>

              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Volume Air Ditambahkan (ΔV)
                </span>
                <div style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#16a34a' }}>
                  +{dilutionResult.vWaterAdded} mL
                </div>
              </div>
            </div>

            <div style={{ padding: '10px 14px', background: '#ffffff', borderRadius: '8px', border: '1px dashed #cbd5e1', fontSize: '12px', color: 'var(--text-secondary)' }}>
              Rumus Pengenceran: <code>M₁ × V₁ = M₂ × V₂</code> ⟶ Faktor Pengenceran: <strong>{dilutionResult.dilutionFactor}×</strong> lebih encer.
            </div>
          </div>

          {/* Visual Glassware Simulation Stage */}
          <div className="flask-stage">
            {/* Beaker 1: Initial concentrated */}
            <div className="flask-item">
              <div className="beaker-glass">
                {/* Liquid fill */}
                <div
                  className="beaker-liquid"
                  style={{
                    height: `${Math.min(90, (v1 / 200) * 80 + 10)}%`,
                    backgroundColor: 'rgba(2, 132, 199, 0.85)', // Pekat
                  }}
                >
                  <div className="beaker-liquid-surface" />
                </div>
                {/* Graduation marks */}
                {[25, 50, 75, 100, 125, 150].map((mk) => (
                  <div key={mk} className="beaker-grad-line" style={{ bottom: `${(mk / 160) * 100}%` }} />
                ))}
              </div>
              <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>Gelas 1 (Pekat)</strong>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {v1} mL • {m1.toFixed(2)} M
              </span>
            </div>

            {/* Arrow & Water Addition Indicator */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#0284c7', fontSize: '12px', fontWeight: 700 }}>
                <Droplets size={16} />
                +{dilutionResult.vWaterAdded} mL H₂O
              </div>
              <ArrowRight size={28} color="#94a3b8" />
            </div>

            {/* Beaker 2: Diluted */}
            <div className="flask-item">
              <div className="beaker-glass" style={{ width: '130px', height: '180px' }}>
                {/* Liquid fill */}
                <div
                  className="beaker-liquid"
                  style={{
                    height: `${Math.min(92, (v2 / 500) * 85 + 10)}%`,
                    backgroundColor: `rgba(56, 189, 248, ${Math.max(0.25, Math.min(0.85, dilutionResult.m2 / m1))})`, // Encer
                  }}
                >
                  <div className="beaker-liquid-surface" />
                </div>
                {/* Graduation marks */}
                {[50, 100, 150, 200, 250, 300, 400].map((mk) => (
                  <div key={mk} className="beaker-grad-line" style={{ bottom: `${(mk / 450) * 100}%` }} />
                ))}
              </div>
              <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>Gelas 2 (Encer)</strong>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {v2} mL • {dilutionResult.m2} M
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: pH Calculator & Buffer Simulator */}
      {activeSubTab === 'ph_buffer' && (
        <div className="solutions-main-grid">
          {/* Controls */}
          <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} color="#0284c7" />
              Pilih Jenis Sistem Larutan:
            </span>

            {/* Presets */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {COMMON_SOLUTIONS.map((p) => {
                const isActive = selectedPreset.name === p.name;
                return (
                  <button
                    key={p.name}
                    className={`preset-chip ${isActive ? 'active' : ''}`}
                    style={
                      isActive
                        ? { background: '#0284c7', color: '#ffffff', borderColor: '#0284c7' }
                        : {}
                    }
                    onClick={() => handleApplyPreset(p)}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>

            {/* Solution Type Pills */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              <button
                className={`filter-pill ${solutionType === 'strong_acid' ? 'active' : ''}`}
                style={{ justifyContent: 'center', fontSize: '11px' }}
                onClick={() => setSolutionType('strong_acid')}
              >
                Asam Kuat
              </button>
              <button
                className={`filter-pill ${solutionType === 'strong_base' ? 'active' : ''}`}
                style={{ justifyContent: 'center', fontSize: '11px' }}
                onClick={() => setSolutionType('strong_base')}
              >
                Basa Kuat
              </button>
              <button
                className={`filter-pill ${solutionType === 'weak_acid' ? 'active' : ''}`}
                style={{ justifyContent: 'center', fontSize: '11px' }}
                onClick={() => setSolutionType('weak_acid')}
              >
                Asam Lemah
              </button>
              <button
                className={`filter-pill ${solutionType === 'weak_base' ? 'active' : ''}`}
                style={{ justifyContent: 'center', fontSize: '11px' }}
                onClick={() => setSolutionType('weak_base')}
              >
                Basa Lemah
              </button>
              <button
                className={`filter-pill ${solutionType === 'buffer_acid' ? 'active' : ''}`}
                style={{ justifyContent: 'center', fontSize: '11px' }}
                onClick={() => setSolutionType('buffer_acid')}
              >
                Buffer Asam
              </button>
              <button
                className={`filter-pill ${solutionType === 'salt_hydrolysis' ? 'active' : ''}`}
                style={{ justifyContent: 'center', fontSize: '11px' }}
                onClick={() => setSolutionType('salt_hydrolysis')}
              >
                Hidrolisis Garam
              </button>
            </div>

            {/* Concentration Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span>Konsentrasi Zat (Molaritas):</span>
                <strong style={{ fontFamily: 'var(--font-mono)', color: '#0284c7' }}>{concentration} M</strong>
              </div>
              <input
                type="range"
                min="0.001"
                max="1.0"
                step="0.01"
                value={concentration}
                onChange={(e) => setConcentration(Number(e.target.value))}
                className="explode-slider"
              />
            </div>

            {/* Valency / Buffer Salt Concentration */}
            {(solutionType === 'strong_acid' || solutionType === 'strong_base') && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px' }}>Valensi Asam/Basa (jumlah H⁺ atau OH⁻):</span>
                <select
                  className="select-dropdown"
                  style={{ width: '80px' }}
                  value={valency}
                  onChange={(e) => setValency(Number(e.target.value))}
                >
                  <option value={1}>1 (e.g. HCl)</option>
                  <option value={2}>2 (e.g. H₂SO₄)</option>
                  <option value={3}>3 (e.g. H₃PO₄)</option>
                </select>
              </div>
            )}

            {solutionType === 'buffer_acid' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span>Konsentrasi Garam / Basa Konjugasi:</span>
                  <strong style={{ fontFamily: 'var(--font-mono)', color: '#0284c7' }}>{saltConcentration} M</strong>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="1.0"
                  step="0.01"
                  value={saltConcentration}
                  onChange={(e) => setSaltConcentration(Number(e.target.value))}
                  className="explode-slider"
                />
              </div>
            )}

            <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '12px' }}>
              <strong>Rumus Ionisasi:</strong>
              <div style={{ fontFamily: 'var(--font-mono)', color: '#0284c7', marginTop: '4px' }}>
                {phResult.formulaUsed}
              </div>
            </div>
          </div>

          {/* pH Digital Meter & Rainbow Indicator Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="ph-digital-meter">
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Sensor pH Digital Larutan
                </span>
                <div className="ph-value-display" style={{ color: phResult.indicatorColor }}>
                  pH {phResult.ph}
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  pOH: <strong>{phResult.poh}</strong> • [H⁺] = {phResult.hConcentration.toExponential(2)} M
                </span>
              </div>

              <div
                style={{
                  padding: '8px 16px',
                  borderRadius: '999px',
                  backgroundColor: `${phResult.indicatorColor}22`,
                  border: `1.5px solid ${phResult.indicatorColor}`,
                  color: phResult.indicatorColor,
                  fontWeight: 800,
                  fontSize: '13px',
                }}
              >
                {phResult.classification}
              </div>
            </div>

            {/* Rainbow Universal Indicator Bar */}
            <div className="glass-panel" style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Skala Indikator Universal pH (0 - 14):
              </span>
              <div className="ph-rainbow-bar">
                {Array.from({ length: 15 }).map((_, i) => (
                  <div
                    key={i}
                    className="ph-rainbow-segment"
                    style={{
                      backgroundColor:
                        i <= 1 ? '#ef4444' : i <= 3 ? '#f97316' : i <= 6 ? '#facc15' : i === 7 ? '#22c55e' : i <= 10 ? '#0284c7' : '#7c3aed',
                    }}
                  />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)' }}>
                <span>0 (Sangat Asam)</span>
                <span>7 (Netral)</span>
                <span>14 (Sangat Basa)</span>
              </div>
            </div>

            <div style={{ padding: '16px', background: '#ffffff', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              💡 <strong>Kaidah Asam-Basa:</strong> Larutan dengan pH &lt; 7 memiliki konsentrasi ion hidrogen $[H^+] &gt; [OH^-]$. Pada sistem larutan penyangga (buffer), penambahan sedikit asam atau basa kuat tidak akan mengubah pH larutan secara signifikan karena adanya pasangan asam-basa konjugasi.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
