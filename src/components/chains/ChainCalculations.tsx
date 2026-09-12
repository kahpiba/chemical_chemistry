import React from 'react';
import { Thermometer, Scale, Info, ShieldCheck, Factory, Gauge } from 'lucide-react';
import type { ChainCalculationsResult, PolymerData, HydrocarbonSeries } from '../../data/chainsData';

interface ChainCalculationsProps {
  calc: ChainCalculationsResult;
  series: HydrocarbonSeries;
  polymer?: PolymerData;
}

export const ChainCalculations: React.FC<ChainCalculationsProps> = ({
  calc,
  series,
  polymer,
}) => {
  if (series === 'polymer' && polymer) {
    return (
      <div className="chain-calc-container">
        {/* Polymer Summary Header Card */}
        <div className="calc-card glass-panel highlight-border">
          <div className="calc-card-header">
            <span className="calc-card-tag">Makromolekul Polimer</span>
            <h3 className="calc-main-title">{polymer.name}</h3>
            {polymer.tradeName && (
              <span className="calc-sub-title">Nama Dagang: {polymer.tradeName}</span>
            )}
          </div>

          <div className="polymer-meta-grid">
            <div className="meta-box">
              <span className="meta-label">Monomer Pembentuk</span>
              <strong className="meta-value">{polymer.monomerName}</strong>
              <code className="meta-sub">{polymer.monomerFormula}</code>
            </div>

            <div className="meta-box">
              <span className="meta-label">Tipe Polimerisasi</span>
              <strong className="meta-value" style={{ color: '#0284c7' }}>
                {polymer.polymerType}
              </strong>
              <span className="meta-sub">
                {polymer.polymerType === 'Adisi' ? 'Pemutusan ikatan rangkap C=C' : 'Pelepasan molekul kecil H₂O'}
              </span>
            </div>

            <div className="meta-box">
              <span className="meta-label">Titik Leleh Tipikal</span>
              <strong className="meta-value">{polymer.meltingPoint} °C</strong>
              <span className="meta-sub">Termoplastik dapat dilelehkan</span>
            </div>

            <div className="meta-box">
              <span className="meta-label">Kerapatan (Densitas)</span>
              <strong className="meta-value">{polymer.density} g/cm³</strong>
              <span className="meta-sub">
                {polymer.recyclingCode ? `Kode Daur Ulang #${polymer.recyclingCode}` : 'Daur ulang khusus'}
              </span>
            </div>
          </div>

          {/* Properties chips */}
          <div style={{ marginTop: '14px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Karakteristik & Keunggulan Material:
            </span>
            <div className="polymer-properties-tags">
              {polymer.properties.map((prop, i) => (
                <span key={i} className="prop-tag">
                  <ShieldCheck size={12} color="#059669" />
                  {prop}
                </span>
              ))}
            </div>
          </div>

          {/* Applications */}
          <div className="calc-application-banner">
            <Factory size={16} color="#0284c7" />
            <div>
              <strong>Aplikasi Industri & Komersial:</strong>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px' }}>{polymer.applications}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Hydrocarbon Calculation View
  return (
    <div className="chain-calc-container">
      {/* 1. Molar Mass & Physical Parameters Card */}
      <div className="calc-card glass-panel">
        <div className="calc-card-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="calc-card-tag">Identitas & Parameter Fisik</span>
            <span
              className={`phase-badge ${
                calc.phase === 'Gas' ? 'phase-gas' : calc.phase === 'Cair' ? 'phase-liquid' : 'phase-solid'
              }`}
            >
              Fasa: {calc.phase} (25°C)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
            <h3 className="calc-main-title">{calc.name}</h3>
            <code className="calc-formula-badge">{calc.formula}</code>
          </div>
          <span className="calc-condensed">{calc.condensedFormula}</span>
        </div>

        {/* Physical Measurements Grid */}
        <div className="calc-metrics-grid">
          <div className="metric-box">
            <span className="metric-icon">
              <Scale size={16} color="#0284c7" />
            </span>
            <div>
              <label>Massa Molar (Mr)</label>
              <strong>{calc.molecularWeight} g/mol</strong>
            </div>
          </div>

          <div className="metric-box">
            <span className="metric-icon">
              <Thermometer size={16} color="#ef4444" />
            </span>
            <div>
              <label>Prediksi Titik Didih</label>
              <strong>{calc.estimatedBoilingPoint} °C</strong>
            </div>
          </div>

          <div className="metric-box">
            <span className="metric-icon">
              <Thermometer size={16} color="#3b82f6" />
            </span>
            <div>
              <label>Prediksi Titik Lebur</label>
              <strong>{calc.estimatedMeltingPoint} °C</strong>
            </div>
          </div>

          <div className="metric-box">
            <span className="metric-icon">
              <Gauge size={16} color="#10b981" />
            </span>
            <div>
              <label>Massa Jenis (Densitas)</label>
              <strong>{calc.density} g/cm³</strong>
            </div>
          </div>
        </div>

        {/* Mass Composition Progress Bar (% C vs % H) */}
        <div className="calc-composition-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700 }}>
            <span style={{ color: '#0f172a' }}>Karbon (C): {calc.percentC}%</span>
            <span style={{ color: '#0284c7' }}>Hidrogen (H): {calc.percentH}%</span>
          </div>
          <div className="composition-bar-track">
            <div className="composition-fill-c" style={{ width: `${calc.percentC}%` }} />
            <div className="composition-fill-h" style={{ width: `${calc.percentH}%` }} />
          </div>
        </div>
      </div>

      {/* 2. Combustion Stoichiometry & Thermodynamic Energy Card */}
      <div className="calc-card glass-panel">
        <div className="calc-card-header">
          <span className="calc-card-tag" style={{ color: '#ea580c' }}>
            Termokimia & Stoikiometri Pembakaran
          </span>
          <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '4px 0 0 0', color: '#0f172a' }}>
            Reaksi Pembakaran Sempurna
          </h4>
        </div>

        {/* Balanced Equation Box */}
        <div className="calc-equation-box">
          <code>
            {calc.formula} + {calc.o2MolesRequired} O₂ → {calc.co2MolesProduced} CO₂ + {calc.h2oMolesProduced} H₂O
          </code>
        </div>

        {/* Stoichiometric Data Grid */}
        <div className="calc-stoich-grid">
          <div className="stoich-item">
            <span className="stoich-label">Kebutuhan Oksigen</span>
            <strong className="stoich-val">{calc.o2MolesRequired} mol O₂</strong>
            <span className="stoich-hint">per mol {calc.name}</span>
          </div>

          <div className="stoich-item">
            <span className="stoich-label">Volume Gas CO₂ (STP)</span>
            <strong className="stoich-val">{calc.co2VolumeSTP} Liter</strong>
            <span className="stoich-hint">pada suhu 0°C & 1 atm</span>
          </div>

          <div className="stoich-item">
            <span className="stoich-label">Entalpi Pembakaran (ΔH°c)</span>
            <strong className="stoich-val" style={{ color: '#dc2626' }}>
              {calc.deltaHCombustion} kJ/mol
            </strong>
            <span className="stoich-hint">Reaksi Eksotermik Lepas Panas</span>
          </div>

          <div className="stoich-item">
            <span className="stoich-label">Nilai Kalor Spesifik</span>
            <strong className="stoich-val" style={{ color: '#ea580c' }}>
              {calc.specificEnergy} kJ/gram
            </strong>
            <span className="stoich-hint">Kerapatan Energi Bahan Bakar</span>
          </div>
        </div>

        {/* Carbon Footprint Note */}
        <div className="calc-carbon-footprint">
          <Info size={15} color="#64748b" style={{ flexShrink: 0, marginTop: '2px' }} />
          <p style={{ margin: 0, fontSize: '11px', color: '#475569', lineHeight: 1.5 }}>
            <strong>Indeks Emisi Karbon:</strong> Pembakaran 1 gram {calc.name} melepaskan{' '}
            <strong>{calc.carbonIntensity} gram CO₂</strong> ke atmosfer.
          </p>
        </div>
      </div>
    </div>
  );
};
