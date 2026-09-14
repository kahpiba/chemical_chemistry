import React, { useState, useMemo } from 'react';
import { Search, RotateCcw, Sparkles, Filter, X } from 'lucide-react';
import { ELEMENTS, CATEGORIES } from '../../data/elements';
import type { ElementData, ElementCategory } from '../../data/elements';
import { AtomScene } from './AtomScene';

interface PeriodicTableProps {
  onSelectElement: (el: ElementData) => void;
  selectedElement: ElementData | null;
}

export const PeriodicTable: React.FC<PeriodicTableProps> = ({
  onSelectElement,
  selectedElement,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ElementCategory | 'all'>('all');
  const [phaseFilter, setPhaseFilter] = useState<'all' | 'solid' | 'liquid' | 'gas'>('all');

  // Filtered elements set
  const matchingNumbers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return new Set(
      ELEMENTS.filter((el) => {
        const matchesCategory = activeCategory === 'all' || el.category === activeCategory;
        const matchesPhase = phaseFilter === 'all' || el.phase === phaseFilter;
        const matchesQuery =
          !q ||
          el.symbol.toLowerCase().includes(q) ||
          el.name.toLowerCase().includes(q) ||
          el.nameId.toLowerCase().includes(q) ||
          el.number.toString() === q;
        return matchesCategory && matchesPhase && matchesQuery;
      }).map((el) => el.number)
    );
  }, [searchQuery, activeCategory, phaseFilter]);

  // Current active preview element (default to Hydrogen or Carbon if none selected)
  const currentPreview = selectedElement || ELEMENTS[5]; // Default to Carbon (C)

  const isFiltered = Boolean(searchQuery || activeCategory !== 'all' || phaseFilter !== 'all');

  return (
    <div className="periodic-view">
      {/* Search & Category Filter Bar */}
      <div className="periodic-controls glass-panel">
        {/* Top Tier: Search Bar (Left) + Counter & Phase Control (Right) */}
        <div className="controls-top-row">
          <div className="search-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Cari simbol, nama, atau nomor atom (cth: Fe, Emas, 26)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                title="Hapus pencarian"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="controls-top-actions">
            {/* Matched Count Badge */}
            <div className="matched-counter-badge">
              <span>Menampilkan: <strong>{matchingNumbers.size}</strong> / 118 Unsur</span>
            </div>

            {/* Segmented Phase (Wujud Zat) Selector */}
            <div className="phase-segmented-control" role="group" aria-label="Filter Wujud Zat">
              <span className="control-section-label">Wujud:</span>
              {(['all', 'solid', 'liquid', 'gas'] as const).map((p) => {
                const label = p === 'all' ? 'Semua' : p === 'solid' ? 'Padat' : p === 'liquid' ? 'Cair' : 'Gas';
                const isSelected = phaseFilter === p;
                return (
                  <button
                    key={p}
                    type="button"
                    className={`phase-segment-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => setPhaseFilter(p)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Reset All Filters Button */}
            {isFiltered && (
              <button
                type="button"
                className="btn btn-secondary reset-filter-btn"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                  setPhaseFilter('all');
                }}
                title="Reset Semua Filter"
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Subtle Divider */}
        <div className="controls-divider" />

        {/* Bottom Tier: Category Chips */}
        <div className="controls-bottom-row">
          <div className="category-row-label">
            <Filter size={13} color="#0284c7" />
            <span>Golongan:</span>
          </div>

          <div className="category-filters-list">
            <button
              type="button"
              className={`filter-pill ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              Semua Golongan
            </button>
            {(Object.keys(CATEGORIES) as ElementCategory[]).map((catKey) => {
              const cat = CATEGORIES[catKey];
              const isActive = activeCategory === catKey;
              return (
                <button
                  key={catKey}
                  type="button"
                  className={`filter-pill ${isActive ? 'active' : ''}`}
                  style={isActive ? { backgroundColor: cat.color, borderColor: cat.color } : {}}
                  onClick={() => setActiveCategory(activeCategory === catKey ? 'all' : catKey)}
                >
                  <span
                    className="filter-color-dot"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span>{cat.nameId}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive 18-Column Grid */}
      <div className="periodic-table-wrapper glass-panel">
        <div className="periodic-grid">
          {ELEMENTS.map((el) => {
            const isMatch = matchingNumbers.has(el.number);
            const isSelected = currentPreview.number === el.number;
            const catColor = CATEGORIES[el.category].color;

            // Compute grid row & column
            let col = el.xpos;
            let row = el.ypos;

            // Offset lanthanides and actinides to separate bottom rows
            if (el.number >= 57 && el.number <= 71) {
              row = 9;
              col = el.number - 57 + 3;
            } else if (el.number >= 89 && el.number <= 103) {
              row = 10;
              col = el.number - 89 + 3;
            }

            return (
              <div
                key={el.number}
                className={`element-cell ${isSelected ? 'active' : ''} ${
                  !isMatch ? 'dimmed' : ''
                }`}
                style={{
                  gridColumn: col,
                  gridRow: row,
                  borderColor: isSelected ? catColor : undefined,
                }}
                onClick={() => onSelectElement(el)}
              >
                <div className="cell-top">
                  <span className="element-number">{el.number}</span>
                  <span className="element-mass">
                    {typeof el.atomicMass === 'number'
                      ? el.atomicMass.toFixed(1)
                      : el.atomicMass}
                  </span>
                </div>

                <div className="element-symbol" style={{ color: catColor }}>
                  {el.symbol}
                </div>

                <div className="element-name" title={el.nameId}>
                  {el.nameId}
                </div>

                <div
                  className="element-accent-bar"
                  style={{ backgroundColor: catColor }}
                />
              </div>
            );
          })}

          {/* Placeholders for Lanthanide & Actinide main table anchors */}
          <div
            className="cell-placeholder"
            style={{ gridColumn: 3, gridRow: 6 }}
            onClick={() => setActiveCategory('lanthanide')}
          >
            <span>57-71</span>
            <span>La-Lu</span>
          </div>

          <div
            className="cell-placeholder"
            style={{ gridColumn: 3, gridRow: 7 }}
            onClick={() => setActiveCategory('actinide')}
          >
            <span>89-103</span>
            <span>Ac-Lr</span>
          </div>
        </div>

        {/* IUPAC & Scientific Source Footnote */}
        <div className="periodic-citation-bar">
          <div className="citation-left">
            <span className="citation-badge">STANDAR IUPAC & CIAAW</span>
            <span className="citation-text">
              Data tabel periodik merujuk pada standar resmi <strong>IUPAC (International Union of Pure and Applied Chemistry)</strong> rilis terbaru <strong>4 Mei 2022</strong> (Standard Atomic Weights) dan <strong>NIST Physical Reference Data</strong>.
            </span>
          </div>
          <div className="citation-right">
            <span className="citation-date">Update Terakhir IUPAC: <strong>Mei 2022</strong></span>
          </div>
        </div>
      </div>

      {/* 3D Bohr Atom Simulation & Quick Stats Bar */}
      <div className="atom-explorer-container">
        <AtomScene element={currentPreview} />

        <div className="element-detail-card glass-panel">
          <div className="detail-header-badge">
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: CATEGORIES[currentPreview.category].color,
              }}
            >
              Model Atom Bohr 3D
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={14} color="#38bdf8" />
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>Real-time Orbits</span>
            </div>
          </div>

          <div className="detail-symbol-box">
            <div
              className="big-symbol"
              style={{ backgroundColor: CATEGORIES[currentPreview.category].color }}
            >
              <span>{currentPreview.number}</span>
              <span>{currentPreview.symbol}</span>
            </div>
            <div className="detail-names">
              <h3>{currentPreview.nameId}</h3>
              <p>
                {currentPreview.name} · Massa: {currentPreview.atomicMass} u
              </p>
            </div>
          </div>

          <div className="properties-grid">
            <div className="property-item">
              <span className="property-label">Golongan / Periode</span>
              <p className="property-val">
                Gol {currentPreview.group} · Periode {currentPreview.period}
              </p>
            </div>
            <div className="property-item">
              <span className="property-label">Konfigurasi Elektron</span>
              <p className="property-val" style={{ fontSize: '11px' }}>
                {currentPreview.electronConfiguration}
              </p>
            </div>
            <div className="property-item">
              <span className="property-label">Elektronegativitas</span>
              <p className="property-val">
                {currentPreview.electronegativity
                  ? `${currentPreview.electronegativity} Pauling`
                  : 'N/A'}
              </p>
            </div>
            <div className="property-item">
              <span className="property-label">Wujud Standar (298K)</span>
              <p className="property-val" style={{ textTransform: 'capitalize' }}>
                {currentPreview.phase === 'solid' ? 'Padat' : currentPreview.phase === 'liquid' ? 'Cair' : 'Gas'}
              </p>
            </div>
          </div>

          {/* Shells */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span className="property-label">Jumlah Elektron per Kulit Orbital:</span>
            <div className="electron-shells-display">
              {currentPreview.shells.map((count, idx) => (
                <div key={idx} className="shell-chip">
                  {String.fromCharCode(75 + idx)}: {count}e⁻
                </div>
              ))}
            </div>
          </div>

          <p className="element-bio-summary">
            {currentPreview.summary}
          </p>
        </div>
      </div>
    </div>
  );
};
