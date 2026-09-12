import React, { useState, useMemo } from 'react';
import {
  ArrowLeftRight,
  Search,
  TrendingUp,
  Thermometer,
  Droplets,
  Zap,
  Atom,
  Scale,
  Layers,
} from 'lucide-react';
import { ELEMENTS, CATEGORIES } from '../../data/elements';
import type { ElementData } from '../../data/elements';

interface ComparisonProperty {
  label: string;
  icon: React.ReactNode;
  getValue: (el: ElementData) => string | number | null;
  getNumeric: (el: ElementData) => number | null;
  unit: string;
  description: string;
}

const COMPARISON_PROPS: ComparisonProperty[] = [
  {
    label: 'Massa Atom',
    icon: <Scale size={14} />,
    getValue: (el) => typeof el.atomicMass === 'number' ? el.atomicMass.toFixed(4) : el.atomicMass,
    getNumeric: (el) => typeof el.atomicMass === 'number' ? el.atomicMass : null,
    unit: 'u',
    description: 'Massa rata-rata atom dalam satuan massa atom',
  },
  {
    label: 'Elektronegativitas',
    icon: <Zap size={14} />,
    getValue: (el) => el.electronegativity,
    getNumeric: (el) => el.electronegativity,
    unit: 'Pauling',
    description: 'Kemampuan atom menarik elektron dalam ikatan kimia',
  },
  {
    label: 'Energi Ionisasi',
    icon: <TrendingUp size={14} />,
    getValue: (el) => el.ionizationEnergy,
    getNumeric: (el) => el.ionizationEnergy,
    unit: 'eV',
    description: 'Energi minimum untuk melepas 1 elektron dari atom gas',
  },
  {
    label: 'Densitas',
    icon: <Layers size={14} />,
    getValue: (el) => el.density,
    getNumeric: (el) => el.density,
    unit: 'g/cm³',
    description: 'Massa per satuan volume pada suhu kamar',
  },
  {
    label: 'Titik Leleh',
    icon: <Thermometer size={14} />,
    getValue: (el) => el.meltingPoint,
    getNumeric: (el) => el.meltingPoint,
    unit: 'K',
    description: 'Suhu saat fase padat berubah menjadi cair',
  },
  {
    label: 'Titik Didih',
    icon: <Droplets size={14} />,
    getValue: (el) => el.boilingPoint,
    getNumeric: (el) => el.boilingPoint,
    unit: 'K',
    description: 'Suhu saat fase cair berubah menjadi gas',
  },
];

export const ElementComparison: React.FC = () => {
  const [elementA, setElementA] = useState<ElementData | null>(ELEMENTS.find(e => e.symbol === 'Na') ?? null);
  const [elementB, setElementB] = useState<ElementData | null>(ELEMENTS.find(e => e.symbol === 'Cl') ?? null);
  const [searchA, setSearchA] = useState('');
  const [searchB, setSearchB] = useState('');
  const [showDropdownA, setShowDropdownA] = useState(false);
  const [showDropdownB, setShowDropdownB] = useState(false);

  const filteredA = useMemo(() => {
    if (!searchA) return ELEMENTS.slice(0, 20);
    const s = searchA.toLowerCase();
    return ELEMENTS.filter(
      e => e.name.toLowerCase().includes(s) ||
           e.nameId.toLowerCase().includes(s) ||
           e.symbol.toLowerCase().includes(s) ||
           e.number.toString() === s
    ).slice(0, 15);
  }, [searchA]);

  const filteredB = useMemo(() => {
    if (!searchB) return ELEMENTS.slice(0, 20);
    const s = searchB.toLowerCase();
    return ELEMENTS.filter(
      e => e.name.toLowerCase().includes(s) ||
           e.nameId.toLowerCase().includes(s) ||
           e.symbol.toLowerCase().includes(s) ||
           e.number.toString() === s
    ).slice(0, 15);
  }, [searchB]);

  const renderBar = (valA: number | null, valB: number | null, colorA: string, colorB: string) => {
    if (valA == null && valB == null) return null;
    const max = Math.max(valA ?? 0, valB ?? 0) || 1;
    const pctA = valA != null ? (valA / max) * 100 : 0;
    const pctB = valB != null ? (valB / max) * 100 : 0;
    return (
      <div className="comparison-bars">
        <div className="comp-bar-track">
          <div className="comp-bar-fill a" style={{ width: `${pctA}%`, background: colorA }} />
        </div>
        <div className="comp-bar-track">
          <div className="comp-bar-fill b" style={{ width: `${pctB}%`, background: colorB }} />
        </div>
      </div>
    );
  };

  const getElementColor = (el: ElementData | null): string => {
    if (!el) return '#94a3b8';
    return CATEGORIES[el.category]?.color ?? '#94a3b8';
  };

  const colorA = getElementColor(elementA);
  const colorB = getElementColor(elementB);

  return (
    <div className="comparison-view">
      {/* Header */}
      <div className="comparison-header glass-panel">
        <ArrowLeftRight size={18} color="#0284c7" />
        <h3>Perbandingan Unsur</h3>
        <p>Bandingkan sifat fisik dan kimia dua unsur secara visual</p>
      </div>

      {/* Element Pickers */}
      <div className="comparison-pickers">
        {/* Picker A */}
        <div className="element-picker glass-panel" style={{ borderColor: colorA + '40' }}>
          {elementA ? (
            <div className="picked-element" style={{ '--el-accent': colorA } as React.CSSProperties}>
              <div className="picked-symbol" style={{ background: colorA }}>
                {elementA.symbol}
              </div>
              <div className="picked-info">
                <strong>{elementA.nameId}</strong>
                <span>{elementA.name} · Z={elementA.number}</span>
              </div>
            </div>
          ) : (
            <div className="picked-placeholder">
              <Atom size={24} color="#94a3b8" />
              <span>Pilih Unsur A</span>
            </div>
          )}
          <div className="picker-search">
            <Search size={14} />
            <input
              type="text"
              placeholder="Cari unsur..."
              value={searchA}
              onChange={e => { setSearchA(e.target.value); setShowDropdownA(true); }}
              onFocus={() => setShowDropdownA(true)}
              onBlur={() => setTimeout(() => setShowDropdownA(false), 200)}
            />
          </div>
          {showDropdownA && (
            <div className="picker-dropdown">
              {filteredA.map(el => (
                <button
                  key={el.number}
                  className="picker-option"
                  onMouseDown={() => {
                    setElementA(el);
                    setSearchA('');
                    setShowDropdownA(false);
                  }}
                >
                  <span className="picker-opt-symbol" style={{ background: CATEGORIES[el.category]?.color }}>
                    {el.symbol}
                  </span>
                  <span>{el.nameId}</span>
                  <span className="picker-opt-num">#{el.number}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* VS Badge */}
        <div className="vs-badge">VS</div>

        {/* Picker B */}
        <div className="element-picker glass-panel" style={{ borderColor: colorB + '40' }}>
          {elementB ? (
            <div className="picked-element" style={{ '--el-accent': colorB } as React.CSSProperties}>
              <div className="picked-symbol" style={{ background: colorB }}>
                {elementB.symbol}
              </div>
              <div className="picked-info">
                <strong>{elementB.nameId}</strong>
                <span>{elementB.name} · Z={elementB.number}</span>
              </div>
            </div>
          ) : (
            <div className="picked-placeholder">
              <Atom size={24} color="#94a3b8" />
              <span>Pilih Unsur B</span>
            </div>
          )}
          <div className="picker-search">
            <Search size={14} />
            <input
              type="text"
              placeholder="Cari unsur..."
              value={searchB}
              onChange={e => { setSearchB(e.target.value); setShowDropdownB(true); }}
              onFocus={() => setShowDropdownB(true)}
              onBlur={() => setTimeout(() => setShowDropdownB(false), 200)}
            />
          </div>
          {showDropdownB && (
            <div className="picker-dropdown">
              {filteredB.map(el => (
                <button
                  key={el.number}
                  className="picker-option"
                  onMouseDown={() => {
                    setElementB(el);
                    setSearchB('');
                    setShowDropdownB(false);
                  }}
                >
                  <span className="picker-opt-symbol" style={{ background: CATEGORIES[el.category]?.color }}>
                    {el.symbol}
                  </span>
                  <span>{el.nameId}</span>
                  <span className="picker-opt-num">#{el.number}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Property Comparison Table */}
      {elementA && elementB && (
        <div className="comparison-table glass-panel">
          {COMPARISON_PROPS.map(prop => {
            const valA = prop.getValue(elementA);
            const valB = prop.getValue(elementB);
            const numA = prop.getNumeric(elementA);
            const numB = prop.getNumeric(elementB);
            const winner =
              numA != null && numB != null
                ? numA > numB ? 'a' : numA < numB ? 'b' : 'tie'
                : null;

            return (
              <div key={prop.label} className="comparison-row">
                <div className={`comp-value left ${winner === 'a' ? 'winner' : ''}`}>
                  <span className="comp-val-num" style={{ color: colorA }}>
                    {valA != null ? valA : '—'}
                  </span>
                  {winner === 'a' && <span className="winner-badge">▲</span>}
                </div>

                <div className="comp-label">
                  <div className="comp-label-icon">{prop.icon}</div>
                  <span className="comp-label-text">{prop.label}</span>
                  <span className="comp-label-unit">({prop.unit})</span>
                  {renderBar(numA, numB, colorA, colorB)}
                </div>

                <div className={`comp-value right ${winner === 'b' ? 'winner' : ''}`}>
                  {winner === 'b' && <span className="winner-badge">▲</span>}
                  <span className="comp-val-num" style={{ color: colorB }}>
                    {valB != null ? valB : '—'}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Extra comparison: electron config & phase */}
          <div className="comparison-extras">
            <div className="comp-extra" style={{ borderColor: colorA + '30' }}>
              <strong style={{ color: colorA }}>{elementA.symbol}</strong>
              <span>Konfigurasi: {elementA.electronConfiguration}</span>
              <span>Kulit: [{elementA.shells.join(', ')}]</span>
              <span>Fase: {elementA.phase === 'solid' ? 'Padat' : elementA.phase === 'liquid' ? 'Cair' : elementA.phase === 'gas' ? 'Gas' : 'Tidak diketahui'}</span>
              <span>Blok: {elementA.block.toUpperCase()}</span>
            </div>
            <div className="comp-extra" style={{ borderColor: colorB + '30' }}>
              <strong style={{ color: colorB }}>{elementB.symbol}</strong>
              <span>Konfigurasi: {elementB.electronConfiguration}</span>
              <span>Kulit: [{elementB.shells.join(', ')}]</span>
              <span>Fase: {elementB.phase === 'solid' ? 'Padat' : elementB.phase === 'liquid' ? 'Cair' : elementB.phase === 'gas' ? 'Gas' : 'Tidak diketahui'}</span>
              <span>Blok: {elementB.block.toUpperCase()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
