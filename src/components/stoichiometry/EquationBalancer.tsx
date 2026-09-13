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

  // Stoichiometry mass inputs (in grams) for each reactant
  const [reactantGrams, setReactantGrams] = useState<Record<string, number>>({
    'Fe2O3': 160,
    'CO': 84,
  });

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

  // Stoichiometry Calculations
  const stoichAnalysis = useMemo(() => {
    if (!balanceResult.success) return null;

    const reactants = balanceResult.reactants;
    const products = balanceResult.products;

    // Calculate moles of each reactant based on user gram input
    const reactantData = reactants.map((r) => {
      const mr = calculateMolarMass(r.atoms);
      const grams = reactantGrams[r.raw] ?? mr * r.coefficient; // default to stoichiometric amount
      const moles = grams > 0 && mr > 0 ? grams / mr : 0;
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
      totalMassInitial: parseFloat(totalMassInitial.toFixed(2)),
      totalMassFinal: parseFloat(totalMassFinal.toFixed(2)),
      massConserved: Math.abs(totalMassInitial - totalMassFinal) < 0.1,
    };
  }, [balanceResult, reactantGrams]);

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

          {/* Interactive Stoichiometry & Limiting Reactant */}
          <div className="stoich-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontSize: '15px', fontWeight: 700 }}>
                <Calculator size={18} color="#0284c7" />
                Kalkulator Stoikiometri & Pereaksi Pembatas
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Ubah gram reaktan di bawah
              </span>
            </div>

            <div className="stoich-inputs-row">
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                1. Masukkan Massa Reaktan Awal:
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
                        Mr: {r.mr} g/mol • Koefisien: {r.coeff} • {r.moles.toFixed(3)} mol
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        className="stoich-val-input"
                        value={reactantGrams[r.raw] ?? r.grams}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setReactantGrams((prev) => ({
                            ...prev,
                            [r.raw]: val,
                          }));
                        }}
                      />
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        gram
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Product Yields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                2. Hasil Reaksi Teoritis (Produk Terbentuk):
              </span>
              <div className="product-yield-card">
                {stoichAnalysis.productData.map((p) => (
                  <div key={p.raw} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
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
