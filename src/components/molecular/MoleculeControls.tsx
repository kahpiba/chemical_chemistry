import React from 'react';
import { RotateCw, Pause, Info, Layers, Boxes } from 'lucide-react';
import { MOLECULES, MOLECULE_CATEGORIES } from '../../data/molecules';
import type { MoleculeData, MoleculeCategory } from '../../data/molecules';

interface MoleculeShelfProps {
  selectedMolecule: MoleculeData;
  onSelectMolecule: (mol: MoleculeData) => void;
}

export const MoleculeShelf: React.FC<MoleculeShelfProps> = ({
  selectedMolecule,
  onSelectMolecule,
}) => {
  const [activeCategory, setActiveCategory] = React.useState<MoleculeCategory | 'all'>('all');

  const filteredMolecules = React.useMemo(() => {
    if (activeCategory === 'all') return MOLECULES;
    return MOLECULES.filter((m) => m.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="glass-panel" style={{ padding: '12px 18px', background: '#ffffff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
          Kategori Senyawa:
        </span>
        <button
          className={`filter-pill ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          Semua ({MOLECULES.length})
        </button>
        {(Object.keys(MOLECULE_CATEGORIES) as MoleculeCategory[]).map((cat) => {
          const info = MOLECULE_CATEGORIES[cat];
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              className={`filter-pill ${isActive ? 'active' : ''}`}
              style={isActive ? { backgroundColor: info.color, borderColor: info.color } : {}}
              onClick={() => setActiveCategory(cat)}
            >
              <span className="filter-color-dot" style={{ backgroundColor: info.color }} />
              <span>{info.nameId}</span>
            </button>
          );
        })}
      </div>

      {/* Carousel of Molecule Cards */}
      <div className="molecule-shelf">
        {filteredMolecules.map((mol) => {
          const isSelected = selectedMolecule.id === mol.id;
          return (
            <div
              key={mol.id}
              className={`mol-select-card ${isSelected ? 'active' : ''}`}
              onClick={() => onSelectMolecule(mol)}
            >
              <div className="mol-badge-formula">{mol.formula}</div>
              <div className="mol-card-name">
                <strong>{mol.nameId}</strong>
                <span>{mol.molarMass} g/mol</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface MoleculeHUDProps {
  selectedMolecule: MoleculeData;
  explodeAmount: number;
  onExplodeChange: (val: number) => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  onOpenDetails: () => void;
}

export const MoleculeHUD: React.FC<MoleculeHUDProps> = ({
  selectedMolecule,
  explodeAmount,
  onExplodeChange,
  autoRotate,
  onToggleAutoRotate,
  onOpenDetails,
}) => {
  // Extract distinct elements from selected molecule for the Explode Legend
  const elementLegend = React.useMemo(() => {
    const map = new Map<string, { element: string; name: string; color: string; count: number; percentage: number }>();
    const total = selectedMolecule.atoms.length;
    selectedMolecule.atoms.forEach((atom) => {
      const existing = map.get(atom.element);
      if (existing) {
        existing.count += 1;
        existing.percentage = Math.round((existing.count / total) * 100);
      } else {
        map.set(atom.element, {
          element: atom.element,
          name: atom.name.split(' ')[0],
          color: atom.color,
          count: 1,
          percentage: Math.round((1 / total) * 100),
        });
      }
    });
    return Array.from(map.values());
  }, [selectedMolecule]);

  return (
    <>
      {/* Top Left Floating Title Badge */}
      <div className="mol-hud-top-left">
        <div className="mol-title-badge">
          <Boxes size={18} color="#0284c7" />
          <div>
            <h2>{selectedMolecule.nameId}</h2>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {selectedMolecule.name}
            </span>
          </div>
          <span className="mol-formula-pill">{selectedMolecule.formula}</span>
        </div>
      </div>

      {/* Top Right Actions */}
      <div className="mol-hud-top-right">
        <button
          className={`hud-btn ${autoRotate ? 'active' : ''}`}
          onClick={onToggleAutoRotate}
          title={autoRotate ? 'Hentikan Putaran Otomatis' : 'Putar 3D Otomatis'}
        >
          {autoRotate ? <Pause size={18} /> : <RotateCw size={18} />}
        </button>
        <button className="hud-btn" onClick={onOpenDetails} title="Detail Senyawa Lengkap">
          <Info size={18} />
        </button>
      </div>

      {/* Bottom Dock Complex: Explode Slider + Atom Legend */}
      <div className="mol-bottom-dock-container">
        {/* Legenda Unsur (Atom Legend for Explode Structure) */}
        <div className="mol-atom-legend">
          <span className="legend-label">Legenda Unsur:</span>
          <div className="legend-chips-list">
            {elementLegend.map((item) => (
              <div
                key={item.element}
                className="legend-chip"
                title={`${item.name} (${item.element}): ${item.count} atom (${item.percentage}% dari seluruh atom)`}
              >
                <span
                  className="legend-color-dot"
                  style={{
                    backgroundColor: item.color,
                    boxShadow: `0 0 6px ${item.color}88`,
                  }}
                />
                <span className="legend-sym">{item.element}</span>
                <span className="legend-name">{item.name}</span>
                <span className="legend-count">{item.count}×</span>
                <span className="legend-pct">({item.percentage}%)</span>
              </div>
            ))}
          </div>
          {explodeAmount > 0 && (
            <span className="legend-exploded-badge">
              Terurai {Math.round(explodeAmount * 100)}%
            </span>
          )}
        </div>

        {/* Bottom Dock: Explode Slider */}
        <div className="mol-bottom-dock">
          <div className="explode-control-group">
            <div className="explode-header">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={14} color="#0284c7" />
                <span>Urai Struktur (Explode)</span>
              </span>
              <span className="explode-percentage">
                {Math.round(explodeAmount * 100)}%
              </span>
            </div>
            <div className="explode-slider-container">
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Utuh</span>
              <input
                type="range"
                min={0}
                max={100}
                value={explodeAmount * 100}
                onChange={(e) => onExplodeChange(Number(e.target.value) / 100)}
                className="explode-slider"
              />
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Terurai</span>
            </div>
          </div>

          <div className="dock-divider" />

          <div className="dock-stat-item">
            <span>Komposisi</span>
            <strong>{selectedMolecule.atoms.length} Atom</strong>
          </div>

          <div className="dock-stat-item">
            <span>Ikatan</span>
            <strong>{selectedMolecule.bonds.length} Ikatan</strong>
          </div>

          <div className="dock-stat-item">
            <span>Geometri</span>
            <strong>{selectedMolecule.geometry.split(' ')[0]}</strong>
          </div>
        </div>
      </div>
    </>
  );
};
