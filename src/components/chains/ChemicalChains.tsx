import React, { useState, useMemo } from 'react';
import {
  GitCommit,
  BookOpen,
  Eye,
  Sliders,
  Factory,
} from 'lucide-react';
import {
  POLYMER_CATALOG,
  calculateChainProperties,
  getIUPACPrefix,
} from '../../data/chainsData';
import type { HydrocarbonSeries, PolymerData } from '../../data/chainsData';
import { ChainCanvas } from './ChainCanvas';
import { ChainCalculations } from './ChainCalculations';
import '../../styles/chains.css';

export const ChemicalChains: React.FC = () => {
  const [series, setSeries] = useState<HydrocarbonSeries>('alkane');
  const [carbonCount, setCarbonCount] = useState<number>(8); // Default: Oktana (C8)
  const [selectedPolymer, setSelectedPolymer] = useState<PolymerData>(POLYMER_CATALOG[0]);
  const [displayMode, setDisplayMode] = useState<'skeletal' | 'ballstick' | 'lewis'>('skeletal');

  // Dynamic calculations for current hydrocarbon
  const calculations = useMemo(() => {
    return calculateChainProperties(carbonCount, series);
  }, [carbonCount, series]);

  // Handle series switch
  const handleSeriesChange = (newSeries: HydrocarbonSeries) => {
    setSeries(newSeries);
    if (newSeries === 'alkene' || newSeries === 'alkyne') {
      setCarbonCount((prev) => Math.max(2, Math.min(12, prev)));
    } else if (newSeries === 'cycloalkane') {
      setCarbonCount((prev) => Math.max(3, Math.min(8, prev)));
    } else if (newSeries === 'alkane') {
      setCarbonCount((prev) => Math.max(1, Math.min(20, prev)));
    } else {
      setCarbonCount((prev) => Math.max(1, Math.min(12, prev)));
    }
  };

  // Quick preset picks by series
  const quickPicks = useMemo(() => {
    if (series === 'alcohol') {
      return [
        { n: 1, label: 'C₁ Metanol (Spiritus)' },
        { n: 2, label: 'C₂ Etanol (Alkohol 70%)' },
        { n: 3, label: 'C₃ Propanol (Antiseptik)' },
        { n: 4, label: 'C₄ Butanol (Pelarut)' },
        { n: 8, label: 'C₈ Oktanol (Perisa)' },
      ];
    }
    if (series === 'carboxylic_acid') {
      return [
        { n: 1, label: 'C₁ Asam Format (Semut)' },
        { n: 2, label: 'C₂ Asam Asetat (Cuka)' },
        { n: 3, label: 'C₃ Asam Propionat (Roti)' },
        { n: 4, label: 'C₄ Asam Butirat (Mentega)' },
        { n: 6, label: 'C₆ Asam Kaproat' },
      ];
    }
    if (series === 'aldehyde') {
      return [
        { n: 1, label: 'C₁ Metanal (Formalin)' },
        { n: 2, label: 'C₂ Etanal (Asetaldehida)' },
        { n: 3, label: 'C₃ Propanal' },
        { n: 4, label: 'C₄ Butanal' },
      ];
    }
    if (series === 'haloalkane') {
      return [
        { n: 1, label: 'C₁ Klorometana' },
        { n: 2, label: 'C₂ Kloroetana' },
        { n: 3, label: 'C₃ Kloropropana' },
        { n: 4, label: 'C₄ Klorobutana' },
      ];
    }
    if (series === 'alkene') {
      return [
        { n: 2, label: 'C₂ Etena (Etilena)' },
        { n: 3, label: 'C₃ Propena (Propilena)' },
        { n: 4, label: 'C₄ Butena' },
        { n: 6, label: 'C₆ Heksena' },
      ];
    }
    if (series === 'alkyne') {
      return [
        { n: 2, label: 'C₂ Etuna (Gas Karbit)' },
        { n: 3, label: 'C₃ Propuna' },
        { n: 4, label: 'C₄ Butuna' },
      ];
    }
    return [
      { n: 1, label: 'C₁ Metana (Biogas)' },
      { n: 3, label: 'C₃ Propana (LPG)' },
      { n: 4, label: 'C₄ Butana (Korek)' },
      { n: 8, label: 'C₈ Oktana (Bensin)' },
      { n: 10, label: 'C₁₀ Dekana (Avtur)' },
      { n: 16, label: 'C₁₆ Setana (Solar)' },
      { n: 20, label: 'C₂₀ Ikosana (Lilin)' },
    ];
  }, [series]);

  const maxCarbons = series === 'cycloalkane' ? 8 : series === 'alkane' ? 20 : 12;
  const minCarbons = series === 'cycloalkane' ? 3 : (series === 'alkene' || series === 'alkyne') ? 2 : 1;

  return (
    <div className="chemical-chains-view">
      {/* 1. Header Category Selector Bar */}
      <div className="chains-topbar glass-panel">
        <div className="chains-series-pills">
          <span className="series-bar-label">
            <GitCommit size={14} color="#0284c7" style={{ display: 'inline', marginRight: '4px' }} />
            Tipe Senyawa:
          </span>

          <button
            className={`series-pill ${series === 'alkane' ? 'active' : ''}`}
            onClick={() => handleSeriesChange('alkane')}
          >
            Alkana (CₙH₂ₙ₊₂)
          </button>

          <button
            className={`series-pill ${series === 'alkene' ? 'active' : ''}`}
            onClick={() => handleSeriesChange('alkene')}
          >
            Alkena (CₙH₂ₙ)
          </button>

          <button
            className={`series-pill ${series === 'alkyne' ? 'active' : ''}`}
            onClick={() => handleSeriesChange('alkyne')}
          >
            Alkuna (CₙH₂ₙ₋₂)
          </button>

          <button
            className={`series-pill ${series === 'cycloalkane' ? 'active' : ''}`}
            onClick={() => handleSeriesChange('cycloalkane')}
          >
            Sikloalkana
          </button>

          <button
            className={`series-pill ${series === 'alcohol' ? 'active' : ''}`}
            onClick={() => handleSeriesChange('alcohol')}
          >
            Alkohol (-OH)
          </button>

          <button
            className={`series-pill ${series === 'carboxylic_acid' ? 'active' : ''}`}
            onClick={() => handleSeriesChange('carboxylic_acid')}
          >
            Asam Karboksilat (-COOH)
          </button>

          <button
            className={`series-pill ${series === 'aldehyde' ? 'active' : ''}`}
            onClick={() => handleSeriesChange('aldehyde')}
          >
            Aldehida (-CHO)
          </button>

          <button
            className={`series-pill ${series === 'haloalkane' ? 'active' : ''}`}
            onClick={() => handleSeriesChange('haloalkane')}
          >
            Haloalkana (-Cl)
          </button>

          <button
            className={`series-pill ${series === 'polymer' ? 'active' : ''}`}
            onClick={() => handleSeriesChange('polymer')}
          >
            Polimer (Makromolekul)
          </button>
        </div>

        {/* Display Mode Toggle */}
        <div className="chains-display-modes">
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Tampilan:</span>
          <button
            className={`mode-btn ${displayMode === 'skeletal' ? 'active' : ''}`}
            onClick={() => setDisplayMode('skeletal')}
            title="Struktur Garis Ikatan (Skeletal)"
          >
            Skeletal (Zigzag)
          </button>
          <button
            className={`mode-btn ${displayMode === 'ballstick' ? 'active' : ''}`}
            onClick={() => setDisplayMode('ballstick')}
            title="Model Bola dan Pasak 3D"
          >
            Bola & Batang
          </button>
          <button
            className={`mode-btn ${displayMode === 'lewis' ? 'active' : ''}`}
            onClick={() => setDisplayMode('lewis')}
            title="Struktur Lewis Lengkap"
          >
            Lewis
          </button>
        </div>
      </div>

      {/* 2. Interactive Chain Slider / Selection Bar */}
      {series !== 'polymer' ? (
        <div className="chains-controls-bar glass-panel">
          <div className="slider-control-group">
            <div className="slider-header-info">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={16} color="#0284c7" />
                <strong>Panjang Rantai Karbon:</strong>
                <span className="carbon-badge">{carbonCount} Atom C</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                  ({getIUPACPrefix(carbonCount).toLowerCase()}...)
                </span>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#0284c7' }}>
                Geser untuk menambah / memotong rantai
              </span>
            </div>

            <input
              type="range"
              min={minCarbons}
              max={maxCarbons}
              value={carbonCount}
              onChange={(e) => setCarbonCount(Number(e.target.value))}
              className="chain-slider"
            />

            <div className="slider-ticks">
              <span>C{minCarbons}</span>
              {series === 'alkane' && (
                <>
                  <span>C₅</span>
                  <span>C₁₀</span>
                  <span>C₁₅</span>
                </>
              )}
              <span>C{maxCarbons}</span>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          {quickPicks.length > 0 && (
            <div className="quick-picks-bar">
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>
                Pilihan Cepat:
              </span>
              {quickPicks.map((pick) => (
                <button
                  key={pick.n}
                  className={`quick-pick-chip ${carbonCount === pick.n ? 'active' : ''}`}
                  onClick={() => setCarbonCount(pick.n)}
                >
                  {pick.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Polymer Catalog Chips Bar */
        <div className="chains-controls-bar glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>
              Pilih Jenis Polimer:
            </span>
            {POLYMER_CATALOG.map((p) => (
              <button
                key={p.id}
                className={`quick-pick-chip ${selectedPolymer.id === p.id ? 'active' : ''}`}
                onClick={() => setSelectedPolymer(p)}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Main Split View: Canvas + Real-Time Calculations */}
      <div className="chains-workbench-grid">
        {/* Left Column: Interactive Canvas Visualizer */}
        <div className="chains-canvas-card glass-panel">
          <div className="chains-canvas-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Eye size={18} color="#0284c7" />
              <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                Visualisasi Struktur Rantai Kimia
              </h4>
            </div>
            <span className="chains-angle-tag">
              Sudut Ikatan:{' '}
              {series === 'alkene' ? '120° (sp² Trigonal Planar)' : series === 'alkyne' ? '180° (sp Linear)' : '109.5° (sp³ Tetrahedral)'}
            </span>
          </div>

          <ChainCanvas
            carbonCount={carbonCount}
            series={series}
            polymer={selectedPolymer}
            displayMode={displayMode}
          />

          <div className="chains-canvas-footer">
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              💡 <strong>Tips Interaktif:</strong> Rantai karbon hidrokarbon dialam tidak lurus kaku, melainkan membentuk pola zigzag 3D dinamis karena tolakan pasangan elektron ikatan (VSEPR).
            </span>
          </div>
        </div>

        {/* Right Column: Physical & Thermodynamic Calculations */}
        <div className="chains-details-column">
          <ChainCalculations
            calc={calculations}
            series={series}
            polymer={selectedPolymer}
          />
        </div>
      </div>

      {/* 4. Educational Lore: Petroleum Fractions & Homologous Series */}
      <div className="chains-educational-grid">
        {/* Card 1: Petroleum Distillation Fractions */}
        <div className="edu-card glass-panel">
          <div className="edu-card-header">
            <Factory size={18} color="#0284c7" />
            <h4>Fraksi Minyak Bumi & Kegunaan Rantai Karbon</h4>
          </div>
          <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>
            Minyak bumi mentah (*crude oil*) adalah campuran kompleks hidrokarbon alkana rantai lurus dan bercabang yang dipisahkan dalam menara distilasi bertingkat berdasarkan perbedaan titik didihnya:
          </p>

          <table className="petroleum-table">
            <thead>
              <tr>
                <th>Rentang Karbon</th>
                <th>Titik Didih</th>
                <th>Fraksi & Produk Jadi</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>C₁ - C₄</strong></td>
                <td>&lt; 20 °C</td>
                <td>Gas Elpiji (LPG) & Bahan Baku Petrokimia</td>
              </tr>
              <tr>
                <td><strong>C₅ - C₈</strong></td>
                <td>40 - 120 °C</td>
                <td>Bensin Kendaraan (Gasoline / Premium / Pertamax)</td>
              </tr>
              <tr>
                <td><strong>C₉ - C₁₂</strong></td>
                <td>120 - 200 °C</td>
                <td>Pelarut Nafta & Pembersih Kimia</td>
              </tr>
              <tr>
                <td><strong>C₁₂ - C₁₆</strong></td>
                <td>200 - 300 °C</td>
                <td>Minyak Tanah (Kerosin) & Bahan Bakar Pesawat (Avtur)</td>
              </tr>
              <tr>
                <td><strong>C₁₄ - C₁₈</strong></td>
                <td>250 - 350 °C</td>
                <td>Minyak Solar Mesin Diesel</td>
              </tr>
              <tr>
                <td><strong>C₂₀+</strong></td>
                <td>&gt; 350 °C</td>
                <td>Oli Pelumas, Lilin Parafin, dan Residu Aspal Jalan</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Card 2: IUPAC Nomenclature Rules & Isomers */}
        <div className="edu-card glass-panel">
          <div className="edu-card-header">
            <BookOpen size={18} color="#059669" />
            <h4>Kaidah Tata Nama IUPAC & Sifat Fisik Rantai</h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', color: '#334155', lineHeight: 1.6 }}>
            <div>
              <strong style={{ color: '#0284c7' }}>1. Hubungan Panjang Rantai dengan Titik Didih:</strong>
              <p style={{ margin: '2px 0 0 0' }}>
                Setiap penambahan 1 gugus <code>-CH₂-</code> menaikkan titik didih sekitar <strong>+20°C s.d. +30°C</strong>. Hal ini disebabkan oleh semakin luasnya area kontak permukaan molekul yang memperkuat gaya tarik dispersi London (van der Waals).
              </p>
            </div>

            <div>
              <strong style={{ color: '#0284c7' }}>2. Pengaruh Percabangan (Isomer Rantai):</strong>
              <p style={{ margin: '2px 0 0 0' }}>
                Alkana bercabang memiliki titik didih <em>lebih rendah</em> dibandingkan alkana rantai lurus dengan jumlah atom C yang sama. Bentuk bercabang membuat molekul lebih bulat (*spherical*), sehingga luas permukaan kontak antarmolekul mengecil.
              </p>
            </div>

            <div>
              <strong style={{ color: '#0284c7' }}>3. Rumus Deret Homolog Kimia Organik:</strong>
              <div className="homolog-formula-pills">
                <span className="h-pill">Alkana: CₙH₂ₙ₊₂</span>
                <span className="h-pill">Alkena: CₙH₂ₙ</span>
                <span className="h-pill">Alkuna: CₙH₂ₙ₋₂</span>
                <span className="h-pill">Sikloalkana: CₙH₂ₙ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
