import React, { useState, useMemo } from 'react';
import {
  Scale,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Flame,
  RotateCcw,
  Copy,
  Check,
  Calculator,
  Beaker,
} from 'lucide-react';
import {
  balanceEquation,
  PRESET_REACTIONS,
  calculateMolarMass,
} from '../../utils/balancerLogic';
import type { BalancedResult, ReactionPreset } from '../../utils/balancerLogic';

export const EquationBalancer: React.FC = () => {
  const [inputEquation, setInputEquation] = useState<string>('Fe2O3 + CO -> Fe + CO2');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [copied, setCopied] = useState<boolean>(false);

  // Unit toggle: 'gram' or 'mol'
  const [inputUnit, setInputUnit] = useState<'gram' | 'mol'>('gram');

  // Stoichiometry mass inputs (in grams) for each reactant
  const [reactantGrams, setReactantGrams] = useState<Record<string, number>>({
    'Fe2O3': 160,
    'CO': 84,
  });

  // Stoichiometry mole inputs (in mol) for each reactant
  const [reactantMoles, setReactantMoles] = useState<Record<string, number>>({
    'Fe2O3': 1.0,
    'CO': 3.0,
  });

  // Actual yield in grams for Percent Yield calculation
  const [actualYieldGrams, setActualYieldGrams] = useState<string>('95');

  // Calculate balance result
  const balanceResult: BalancedResult = useMemo(() => {
    return balanceEquation(inputEquation);
  }, [inputEquation]);

  // Filter presets
  const filteredPresets = useMemo(() => {
    if (selectedCategory === 'Semua') return PRESET_REACTIONS;
    return PRESET_REACTIONS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  const categories = ['Semua', 'Pembakaran', 'Netralisasi', 'Pengendapan', 'Redoks', 'Industri'];

  // Copy balanced equation to clipboard
  const handleCopy = () => {
    if (balanceResult.success) {
      navigator.clipboard.writeText(balanceResult.balancedString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Helper to format chemical formula nicely with subscripts
  const formatFormula = (formula: string) => {
    const parts = formula.split(/(\d+)/);
    return (
      <span>
        {parts.map((part, idx) =>
          /^\d+$/.test(part) ? (
            <sub key={idx} className="subscript">
              {part}
            </sub>
          ) : (
            <span key={idx}>{part}</span>
          )
        )}
      </span>
    );
  };

  // Stoichiometry Calculations & MRS Table
  const stoichAnalysis = useMemo(() => {
    if (!balanceResult.success) return null;

    const reactants = balanceResult.reactants;
    const products = balanceResult.products;

    // Calculate moles and grams of each reactant based on selected unit
    const reactantData = reactants.map((r) => {
      const mr = calculateMolarMass(r.atoms);
      let moles = 0;
      let grams = 0;

      if (inputUnit === 'mol') {
        moles = reactantMoles[r.raw] ?? r.coefficient;
        grams = moles * mr;
      } else {
        grams = reactantGrams[r.raw] ?? mr * r.coefficient;
        moles = grams > 0 && mr > 0 ? grams / mr : 0;
      }

      const molePerCoeff = r.coefficient > 0 ? moles / r.coefficient : 0;
      return {
        raw: r.raw,
        coeff: r.coefficient,
        mr,
        grams,
        moles,
        molePerCoeff,
      };
    });

    // Identify limiting reactant (the one with the minimum moles / coefficient)
    let limitingReactant = reactantData[0];
    for (const r of reactantData) {
      if (r.molePerCoeff < limitingReactant.molePerCoeff) {
        limitingReactant = r;
      }
    }

    const limitingRatio = limitingReactant ? limitingReactant.molePerCoeff : 0;

    // Calculate theoretical yield for products
    const productData = products.map((p) => {
      const mr = calculateMolarMass(p.atoms);
      const molesFormed = p.coefficient * limitingRatio;
      const gramsFormed = molesFormed * mr;
      return {
        raw: p.raw,
        coeff: p.coefficient,
        mr,
        molesFormed,
        gramsFormed,
      };
    });

    // Calculate remaining unreacted reactants
    const remainingReactants = reactantData.map((r) => {
      const molesConsumed = r.coeff * limitingRatio;
      const molesLeft = Math.max(0, r.moles - molesConsumed);
      const gramsLeft = molesLeft * r.mr;
      return {
        raw: r.raw,
        molesConsumed,
        molesLeft,
        gramsLeft,
        isLimiting: r.raw === limitingReactant?.raw,
      };
    });

    // Consolidated MRS Table Columns (all reactants + products)
    const mrsColumns = [
      ...reactantData.map((r) => {
        const molesConsumed = r.coeff * limitingRatio;
        const molesLeft = Math.max(0, r.moles - molesConsumed);
        const gramsLeft = molesLeft * r.mr;
        return {
          raw: r.raw,
          coeff: r.coeff,
          mr: r.mr,
          isProduct: false,
          isLimiting: r.raw === limitingReactant?.raw,
          mInitial: r.moles,
          gInitial: r.grams,
          mDelta: -molesConsumed,
          mFinal: molesLeft,
          gFinal: gramsLeft,
        };
      }),
      ...productData.map((p) => {
        return {
          raw: p.raw,
          coeff: p.coeff,
          mr: p.mr,
          isProduct: true,
          isLimiting: false,
          mInitial: 0,
          gInitial: 0,
          mDelta: p.molesFormed,
          mFinal: p.molesFormed,
          gFinal: p.gramsFormed,
        };
      }),
    ];

    // Percent Yield Analysis for the primary product
    const primaryProduct = productData[0];
    const theoreticalYieldGrams = primaryProduct ? primaryProduct.gramsFormed : 0;
    const actualGrams = parseFloat(actualYieldGrams) || 0;
    const percentYield = theoreticalYieldGrams > 0 && actualGrams > 0
      ? (actualGrams / theoreticalYieldGrams) * 100
      : 0;

    // Mass conservation
    const totalMassInitial = reactantData.reduce((sum, r) => sum + r.grams, 0);
    const totalMassProducts = productData.reduce((sum, p) => sum + p.gramsFormed, 0);
    const totalMassRemaining = remainingReactants.reduce((sum, r) => sum + r.gramsLeft, 0);
    const totalMassFinal = totalMassProducts + totalMassRemaining;

    return {
      reactantData,
      limitingReactant,
      productData,
      remainingReactants,
      mrsColumns,
      primaryProduct,
      theoreticalYieldGrams,
      percentYield: parseFloat(percentYield.toFixed(1)),
      totalMassInitial: parseFloat(totalMassInitial.toFixed(2)),
      totalMassFinal: parseFloat(totalMassFinal.toFixed(2)),
      massConserved: Math.abs(totalMassInitial - totalMassFinal) < 0.1,
    };
  }, [balanceResult, reactantGrams, reactantMoles, inputUnit, actualYieldGrams]);

  const handlePresetSelect = (preset: ReactionPreset) => {
    setInputEquation(preset.equation);
  };

  return (
    <div className="balancer-container">
      {/* Header & Input Card */}
      <div className="balancer-header-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
              }}
            >
              <Scale size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Penyetara Reaksi Kimia & Kalkulator Stoikiometri
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Algoritma matriks eliminasi Gauss-Jordan & penentuan pereaksi pembatas otomatis
              </span>
            </div>
          </div>

          <button
            className="btn btn-secondary"
            onClick={() => {
              setInputEquation('C3H8 + O2 -> CO2 + H2O');
            }}
            style={{ fontSize: '12px', gap: '6px' }}
          >
            <RotateCcw size={14} />
            Reset Contoh
          </button>
        </div>

        {/* Input Bar */}
        <div className="balancer-input-wrapper">
          <Sparkles size={20} color="#0284c7" />
          <input
            type="text"
            className="balancer-input"
            value={inputEquation}
            onChange={(e) => setInputEquation(e.target.value)}
            placeholder="Ketik persamaan kimia, contoh: Fe2O3 + CO -> Fe + CO2 atau KMnO4 + HCl = KCl + MnCl2 + H2O + Cl2"
          />
          {inputEquation && (
            <button
              onClick={() => setInputEquation('')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              Hapus
            </button>
          )}
        </div>

        {/* Preset Chips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Pustaka Reaksi:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`preset-chip ${selectedCategory === cat ? 'active' : ''}`}
                style={
                  selectedCategory === cat
                    ? { background: '#0284c7', color: '#ffffff', borderColor: '#0284c7' }
                    : {}
                }
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="presets-shelf">
            {filteredPresets.map((preset) => (
              <button
                key={preset.name}
                className="preset-chip"
                onClick={() => handlePresetSelect(preset)}
                title={preset.description}
              >
                <strong>{preset.name}:</strong> <code>{preset.equation}</code>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Balanced Result Card */}
      {balanceResult.success ? (
        <div className="balanced-result-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#0284c7', fontSize: '13px', fontWeight: 700 }}>
            <CheckCircle2 size={18} />
            PERSAMAAN REAKSI BERHASIL DISETARAKAN
          </div>

          <div className="balanced-equation-display">
            {balanceResult.reactants.map((r, i) => (
              <React.Fragment key={`r-${i}`}>
                {i > 0 && <span style={{ color: '#94a3b8' }}>+</span>}
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                  {r.coefficient > 1 && (
                    <span className="coeff-badge">{r.coefficient}</span>
                  )}
                  {formatFormula(r.raw)}
                </span>
              </React.Fragment>
            ))}

            <ArrowRight size={24} color="#0284c7" style={{ margin: '0 8px' }} />

            {balanceResult.products.map((p, i) => (
              <React.Fragment key={`p-${i}`}>
                {i > 0 && <span style={{ color: '#94a3b8' }}>+</span>}
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                  {p.coefficient > 1 && (
                    <span className="coeff-badge">{p.coefficient}</span>
                  )}
                  {formatFormula(p.raw)}
                </span>
              </React.Fragment>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <button
              className="btn btn-secondary"
              onClick={handleCopy}
              style={{ fontSize: '12px', gap: '6px', padding: '6px 14px' }}
            >
              {copied ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
              {copied ? 'Tersalin!' : 'Salin Persamaan Setara'}
            </button>
          </div>
        </div>
      ) : (
        <div
          className="glass-panel"
          style={{
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: '#fff1f2',
            borderColor: '#fecdd3',
            color: '#be123c',
          }}
        >
          <AlertCircle size={24} />
          <div>
            <strong>Gagal Menyetarakan Reaksi:</strong>
            <p style={{ margin: '4px 0 0', fontSize: '13px' }}>
              {balanceResult.message || 'Periksa kembali rumus kimia dan tanda panah reaksi.'}
            </p>
          </div>
        </div>
      )}

      {/* Grid: Element Audit & Stoichiometry Calculator */}
      {balanceResult.success && stoichAnalysis && (
        <div className="balancer-grid-sections">
          {/* Element Audit Table */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontSize: '15px', fontWeight: 700 }}>
              <Scale size={18} color="#0284c7" />
              Verifikasi Kesetaraan Atom (LHS = RHS)
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
              Jumlah setiap jenis atom pada sisi reaktan harus tepat sama dengan sisi produk sesuai Hukum Kekekalan Massa.
            </p>

            <table className="audit-table">
              <thead>
                <tr>
                  <th>Unsur</th>
                  <th>Reaktan (Kiri)</th>
                  <th>Produk (Kanan)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {balanceResult.elementAudit.map((item) => (
                  <tr key={item.element}>
                    <td>
                      <strong>{item.element}</strong>
                    </td>
                    <td>{item.left} atom</td>
                    <td>{item.right} atom</td>
                    <td>
                      {item.balanced ? (
                        <span className="audit-badge-ok">
                          <Check size={12} /> Setara
                        </span>
                      ) : (
                        <span style={{ color: '#dc2626', fontWeight: 600, fontSize: '12px' }}>
                          Belum Setara
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Interactive Stoichiometry, MRS Table & Percent Yield */}
          <div className="stoich-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontSize: '15px', fontWeight: 700 }}>
                <Calculator size={18} color="#0284c7" />
                Kalkulator Stoikiometri & Tabel MRS
              </div>

              {/* Unit Switcher: Gram vs Mol */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f1f5f9', padding: '3px', borderRadius: '8px' }}>
                <button
                  className={`filter-pill ${inputUnit === 'gram' ? 'active' : ''}`}
                  onClick={() => setInputUnit('gram')}
                  style={{ padding: '3px 10px', fontSize: '11px', height: 'auto', border: 'none' }}
                >
                  Basis Massa (Gram)
                </button>
                <button
                  className={`filter-pill ${inputUnit === 'mol' ? 'active' : ''}`}
                  onClick={() => setInputUnit('mol')}
                  style={{ padding: '3px 10px', fontSize: '11px', height: 'auto', border: 'none' }}
                >
                  Basis Mol (mol)
                </button>
              </div>
            </div>

            {/* Step 1: Reactant Input Form */}
            <div className="stoich-inputs-row">
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                1. Masukkan Kuantitas Pereaksi Awal ({inputUnit === 'gram' ? 'Gram' : 'Mol'}):
              </span>
              {stoichAnalysis.reactantData.map((r) => {
                const isLimiting = stoichAnalysis.limitingReactant?.raw === r.raw;
                return (
                  <div key={r.raw} className="stoich-input-item">
                    <div className="stoich-compound-info">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <strong>{formatFormula(r.raw)}</strong>
                        {isLimiting && (
                          <span className="limiting-badge">
                            <Flame size={12} /> Pereaksi Pembatas
                          </span>
                        )}
                      </div>
                      <span>
                        Mr: {r.mr} g/mol • Koefisien: {r.coeff} • {r.moles.toFixed(3)} mol ({r.grams.toFixed(2)} g)
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        className="stoich-val-input"
                        value={
                          inputUnit === 'mol'
                            ? (reactantMoles[r.raw] ?? r.moles)
                            : (reactantGrams[r.raw] ?? r.grams)
                        }
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          if (inputUnit === 'mol') {
                            setReactantMoles((prev) => ({
                              ...prev,
                              [r.raw]: val,
                            }));
                          } else {
                            setReactantGrams((prev) => ({
                              ...prev,
                              [r.raw]: val,
                            }));
                          }
                        }}
                      />
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {inputUnit === 'mol' ? 'mol' : 'gram'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Step 2: Official MRS Table (Mula-mula, Reaksi, Sisa) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  2. Tabel MRS (Mula-mula, Reaksi, Sisa):
                </span>
                <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: 600 }}>
                  Pereaksi Pembatas: {stoichAnalysis.limitingReactant ? formatFormula(stoichAnalysis.limitingReactant.raw) : '-'}
                </span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="mrs-table">
                  <thead>
                    <tr>
                      <th style={{ width: '130px' }}>Tahapan Reaksi</th>
                      {stoichAnalysis.mrsColumns.map((col, idx) => (
                        <th key={`col-${idx}`} style={{ textAlign: 'center' }}>
                          <span style={{ color: col.isProduct ? '#16a34a' : '#0284c7', fontWeight: 800 }}>
                            {col.coeff > 1 ? `${col.coeff} ` : ''}
                            {col.raw}
                          </span>
                          <span style={{ display: 'block', fontSize: '10px', color: '#94a3b8', fontWeight: 400 }}>
                            Mr: {col.mr} g/mol
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="mrs-row-label">
                        <strong>M</strong> (Mula-mula)
                      </td>
                      {stoichAnalysis.mrsColumns.map((col, idx) => (
                        <td key={`m-${idx}`} style={{ textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
                          {col.mInitial.toFixed(3)} mol
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="mrs-row-label" style={{ color: '#d97706' }}>
                        <strong>R</strong> (Bereaksi)
                      </td>
                      {stoichAnalysis.mrsColumns.map((col, idx) => (
                        <td
                          key={`r-${idx}`}
                          style={{
                            textAlign: 'center',
                            fontFamily: 'var(--font-mono)',
                            color: col.isProduct ? '#16a34a' : '#dc2626',
                            fontWeight: 700,
                          }}
                        >
                          {col.isProduct ? `+${col.mDelta.toFixed(3)}` : col.mDelta.toFixed(3)} mol
                        </td>
                      ))}
                    </tr>
                    <tr style={{ background: '#f8fafc', fontWeight: 700 }}>
                      <td className="mrs-row-label" style={{ color: '#0284c7' }}>
                        <strong>S</strong> (Sisa / Akhir)
                      </td>
                      {stoichAnalysis.mrsColumns.map((col, idx) => (
                        <td
                          key={`s-${idx}`}
                          style={{
                            textAlign: 'center',
                            fontFamily: 'var(--font-mono)',
                            color: col.isLimiting ? '#ef4444' : 'var(--text-primary)',
                          }}
                        >
                          {col.isLimiting ? (
                            <span style={{ color: '#ef4444' }}>0.000 mol (Habis)</span>
                          ) : (
                            `${col.mFinal.toFixed(3)} mol`
                          )}
                          <span style={{ display: 'block', fontSize: '10px', color: '#64748b', fontWeight: 600 }}>
                            ≈ {col.gFinal.toFixed(2)} g
                          </span>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Step 3: Theoretical Product Yields & Percent Yield Calculator */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginTop: '6px' }}>
              {/* Theoretical Yield summary */}
              <div className="product-yield-card" style={{ padding: '12px 14px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Hasil Teoretis Maksimum:
                </span>
                {stoichAnalysis.productData.map((p) => (
                  <div key={p.raw} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', marginTop: '4px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Beaker size={14} color="#16a34a" />
                      <strong>{formatFormula(p.raw)}:</strong>
                    </span>
                    <span>
                      <strong style={{ color: '#16a34a', fontFamily: 'var(--font-mono)' }}>
                        {p.gramsFormed.toFixed(2)} g
                      </strong>{' '}
                      ({p.molesFormed.toFixed(3)} mol)
                    </span>
                  </div>
                ))}
              </div>

              {/* Percent Yield Calculator */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                    Kalkulator % Hasil Reaksi (Percent Yield):
                  </span>
                  {stoichAnalysis.primaryProduct && (
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      Produk: {stoichAnalysis.primaryProduct.raw}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#475569' }}>Massa Nyata Lab:</span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    className="stoich-val-input"
                    style={{ width: '90px' }}
                    value={actualYieldGrams}
                    onChange={(e) => setActualYieldGrams(e.target.value)}
                    placeholder="Massa nyata"
                  />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    gram
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', marginTop: '2px' }}>
                  <span style={{ color: '#64748b' }}>
                    Rumus: (Massa Nyata / Teoretis) × 100%
                  </span>
                  <strong
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '15px',
                      color:
                        stoichAnalysis.percentYield >= 90
                          ? '#16a34a'
                          : stoichAnalysis.percentYield >= 70
                          ? '#0284c7'
                          : '#d97706',
                    }}
                  >
                    {stoichAnalysis.percentYield}% Yield
                  </strong>
                </div>
              </div>
            </div>

            {/* Mass Conservation Law */}
            <div className="conservation-bar">
              <span>Hukum Kekekalan Massa (Lavoisier):</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Massa Awal: <strong>{stoichAnalysis.totalMassInitial} g</strong></span>
                <span>⟶</span>
                <span>Massa Akhir: <strong>{stoichAnalysis.totalMassFinal} g</strong></span>
                {stoichAnalysis.massConserved && (
                  <span className="audit-badge-ok" style={{ padding: '2px 6px' }}>
                    Kekal (100%)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
