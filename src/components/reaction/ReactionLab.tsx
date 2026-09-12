import React, { useState, useMemo } from 'react';
import {
  FlaskConical,
  RotateCcw,
  Sparkles,
  Flame,
  ShieldAlert,
  BookOpen,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { REAGENTS, REACTIONS } from '../../data/reactions';
import type { Reagent, ReactionData } from '../../data/reactions';
import { ReactionCanvas } from './ReactionCanvas';

export const ReactionLab: React.FC = () => {
  const [selectedReagentIds, setSelectedReagentIds] = useState<string[]>([]);
  const [isReacting, setIsReacting] = useState<boolean>(false);

  // Selected reagent objects
  const selectedReagents = useMemo(() => {
    return selectedReagentIds
      .map((id) => REAGENTS.find((r) => r.id === id))
      .filter((r): r is Reagent => !!r);
  }, [selectedReagentIds]);

  // Check if current combination matches any known reaction
  const matchingReaction = useMemo(() => {
    return REACTIONS.find((rx) =>
      rx.requiredReagents.every((reqId) => selectedReagentIds.includes(reqId))
    ) || null;
  }, [selectedReagentIds]);

  // Toggle reagent selection in/out of beaker
  const handleToggleReagent = (id: string) => {
    if (isReacting) {
      // If already reacting, reset first
      setIsReacting(false);
    }
    if (selectedReagentIds.includes(id)) {
      setSelectedReagentIds((prev) => prev.filter((item) => item !== id));
    } else {
      setSelectedReagentIds((prev) => [...prev, id]);
    }
  };

  // Load a preset reaction directly
  const handleSelectPreset = (rx: ReactionData) => {
    setSelectedReagentIds(rx.requiredReagents);
    setIsReacting(true);
  };

  // Trigger Reaction
  const handleTriggerReaction = () => {
    if (matchingReaction) {
      setIsReacting(true);
    }
  };

  // Reset Lab Beaker
  const handleReset = () => {
    setSelectedReagentIds([]);
    setIsReacting(false);
  };

  return (
    <div className="reaction-lab-view">
      {/* Preset Reactions Quick Bar */}
      <div className="presets-bar glass-panel">
        <span className="presets-label">
          <Sparkles size={14} color="#38bdf8" style={{ display: 'inline', marginRight: '4px' }} />
          Preset Reaksi Populer:
        </span>
        {REACTIONS.map((rx) => {
          const isActive = matchingReaction?.id === rx.id && isReacting;
          return (
            <button
              key={rx.id}
              className={`preset-chip ${isActive ? 'active' : ''}`}
              onClick={() => handleSelectPreset(rx)}
            >
              {rx.titleId}
            </button>
          );
        })}
      </div>

      {/* Main 3-Column Workbench */}
      <div className="lab-workbench-grid">
        {/* Left Column: Reagent Cabinet */}
        <div className="reagent-cabinet glass-panel">
          <div className="cabinet-title">
            <span>Rak Bahan Kimia (Reagents)</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {selectedReagentIds.length} dipilih
            </span>
          </div>

          <div className="reagents-list">
            {REAGENTS.map((reagent) => {
              const isSelected = selectedReagentIds.includes(reagent.id);
              return (
                <div
                  key={reagent.id}
                  className={`reagent-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleToggleReagent(reagent.id)}
                >
                  <div className="reagent-info">
                    <div
                      className="reagent-indicator-dot"
                      style={{ backgroundColor: reagent.color }}
                    />
                    <div className="reagent-names">
                      <strong>{reagent.nameId}</strong>
                      <span>{reagent.formula}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {reagent.hazard && (
                      <span className="hazard-icon-chip" title={reagent.hazard}>
                        {reagent.hazard === 'corrosive' ? 'Korosif' : reagent.hazard === 'flammable' ? 'Flammable' : 'Toksik'}
                      </span>
                    )}
                    {isSelected && <CheckCircle2 size={16} color="#38bdf8" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Column: Interactive Reaction Stage */}
        <div className="reaction-stage glass-panel">
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <FlaskConical size={20} color="#0284c7" />
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
              Gelas Kimia Utama (250 mL)
            </span>
          </div>

          {/* Liquid & Beaker Simulation Canvas */}
          <ReactionCanvas
            selectedReagents={selectedReagents}
            activeReaction={matchingReaction}
            isReacting={isReacting}
          />

          {/* Stage Controls */}
          <div className="stage-actions">
            <button
              className="btn btn-primary"
              disabled={selectedReagents.length === 0}
              onClick={handleTriggerReaction}
              style={{ padding: '10px 24px', fontSize: '14px' }}
            >
              <Flame size={18} />
              <span>{isReacting ? 'Reaksi Sedang Berlangsung' : 'Campurkan & Reaksikan!'}</span>
            </button>

            <button className="btn btn-ghost" onClick={handleReset} title="Bilas Bejana">
              <RotateCcw size={16} />
              <span>Bilas Gelas Kimia</span>
            </button>
          </div>

          {/* Status Hint */}
          <div style={{ marginTop: '14px', fontSize: '12px', color: 'var(--text-muted)' }}>
            {selectedReagents.length === 0
              ? 'Pilih 1 atau lebih reagen dari rak di sebelah kiri untuk dimasukkan ke gelas kimia.'
              : matchingReaction
              ? isReacting
                ? 'Reaksi kimia aktif! Amati perubahan warna, suhu, gas, atau endapan.'
                : 'Reagen cocok untuk reaksi kimia! Klik tombol "Campurkan & Reaksikan".'
              : 'Reagen tercampur. Belum terdeteksi reaksi kimia spesifik. Tambahkan reagen pasangan yang sesuai.'}
          </div>
        </div>

        {/* Right Column: Reaction Analysis & Molecular Mechanism */}
        <div className="reaction-details-card glass-panel">
          {matchingReaction && isReacting ? (
            <>
              <div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#0284c7',
                    letterSpacing: '1px',
                  }}
                >
                  Analisis Reaksi Kimia
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>
                  {matchingReaction.titleId}
                </h3>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {matchingReaction.title}
                </span>
              </div>

              {/* Balanced Chemical Equation Banner */}
              <div className="equation-banner">
                <label>Persamaan Reaksi Kimia Setara</label>
                <div className="equation-text">{matchingReaction.balancedEquation}</div>
              </div>

              {/* Thermodynamic Enthalpy Badge */}
              <div
                className={`thermo-badge ${
                  matchingReaction.deltaH < 0 ? 'exothermic' : 'endothermic'
                }`}
              >
                <span>Entalpi Reaksi (ΔH):</span>
                <span>
                  {matchingReaction.deltaH} kJ/mol (
                  {matchingReaction.deltaH < 0 ? 'Eksotermik / Lepas Kalor' : 'Endotermik / Serap Kalor'})
                </span>
              </div>

              {/* Summary */}
              <div className="reaction-narrative">
                <h4>Ringkasan Fenomena</h4>
                <p>{matchingReaction.summary}</p>
              </div>

              {/* Molecular Explanation */}
              <div className="reaction-narrative">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0284c7', marginBottom: '6px' }}>
                  <BookOpen size={16} />
                  <h4>Mekanisme Tingkat Molekuler</h4>
                </div>
                <p>{matchingReaction.molecularExplanation}</p>
              </div>

              {/* Real World Uses */}
              <div className="reaction-narrative">
                <h4 style={{ color: '#059669' }}>Penerapan di Industri & Kehidupan</h4>
                <p>{matchingReaction.realWorldApplication}</p>
              </div>

              {/* Safety Alert */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  background: '#fff1f2',
                  border: '1px solid #fecdd3',
                  borderRadius: '8px',
                  padding: '12px',
                }}
              >
                <ShieldAlert size={18} color="#e11d48" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '12px', color: '#9f1239', lineHeight: 1.5, margin: 0 }}>
                  <strong>Keselamatan Laboratorium:</strong> {matchingReaction.safetyWarning}
                </p>
              </div>
            </>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
                gap: '12px',
                color: 'var(--text-muted)',
                padding: '40px 20px',
              }}
            >
              <HelpCircle size={40} color="#94a3b8" />
              <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
                Laboratorium Reaksi Interaktif
              </h4>
              <p style={{ fontSize: '13px', lineHeight: 1.6 }}>
                Campurkan reagen kimia seperti <strong>HCl + NaOH</strong> untuk netralisasi,{' '}
                <strong>AgNO₃ + NaCl</strong> untuk endapan, atau pilih salah satu tombol{' '}
                <strong>Preset Reaksi Populer</strong> di atas untuk melihat simulasi visual instan!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
