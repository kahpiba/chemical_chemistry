import React, { useState, useMemo, useEffect } from 'react';
import {
  FlaskConical,
  RotateCcw,
  Sparkles,
  Flame,
  ShieldAlert,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Volume2,
  VolumeX,
  FileText,
  Camera,
  Zap,
} from 'lucide-react';
import { REAGENTS, REACTIONS } from '../../data/reactions';
import type { Reagent, ReactionData } from '../../data/reactions';
import { ReactionCanvas } from './ReactionCanvas';
import { LabReportModal } from './LabReportModal';
import {
  playClick,
  playBeakerClink,
  playFizzing,
  playSizzle,
  playPop,
  playPour,
  playSuccess,
  playBunsenIgnite,
  setMuted,
  isMuted,
} from '../../utils/audio';

export const ReactionLab: React.FC = () => {
  const [selectedReagentIds, setSelectedReagentIds] = useState<string[]>([]);
  const [isReacting, setIsReacting] = useState<boolean>(false);
  const [isHeating, setIsHeating] = useState<boolean>(false);
  const [isStirring, setIsStirring] = useState<boolean>(false);
  const [heaterBoost, setHeaterBoost] = useState<number>(0);
  const [muted, setLocalMuted] = useState<boolean>(isMuted());
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // Selected reagent objects
  const selectedReagents = useMemo(() => {
    return selectedReagentIds
      .map((id) => REAGENTS.find((r) => r.id === id))
      .filter((r): r is Reagent => !!r);
  }, [selectedReagentIds]);

  // Check if current combination matches any known reaction
  const matchingReaction = useMemo(() => {
    return (
      REACTIONS.find((rx) =>
        rx.requiredReagents.every((reqId) => selectedReagentIds.includes(reqId))
      ) || null
    );
  }, [selectedReagentIds]);

  // Dynamic pH calculation
  const currentPH = useMemo(() => {
    if (selectedReagents.length === 0) return 7.0;
    if (matchingReaction && isReacting) {
      return matchingReaction.effects.pHEnd ?? 7.0;
    }
    if (matchingReaction) {
      return matchingReaction.effects.pHStart ?? 7.0;
    }
    const phVals = selectedReagents.map((r) => r.pH ?? 7.0);
    const minPH = Math.min(...phVals);
    const maxPH = Math.max(...phVals);
    if (minPH < 6.0) return minPH;
    if (maxPH > 8.0) return maxPH;
    return phVals.reduce((a, b) => a + b, 0) / phVals.length;
  }, [selectedReagents, matchingReaction, isReacting]);

  // Dynamic temperature simulation with heater boost
  const currentTemp = useMemo(() => {
    let base = 25.0;
    if (matchingReaction && isReacting) {
      base = matchingReaction.effects.temperatureEnd;
    }
    return Math.min(100, base + heaterBoost);
  }, [matchingReaction, isReacting, heaterBoost]);

  // Heating timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isHeating) {
      interval = setInterval(() => {
        setHeaterBoost((prev) => Math.min(75, prev + 2.5));
      }, 400);
    } else {
      interval = setInterval(() => {
        setHeaterBoost((prev) => Math.max(0, prev - 1.5));
      }, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isHeating]);

  // Audio mute toggle
  const handleToggleMute = () => {
    const next = !muted;
    setLocalMuted(next);
    setMuted(next);
  };

  // Toggle reagent selection in/out of beaker
  const handleToggleReagent = (id: string) => {
    playPour();
    if (isReacting) {
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
    playClick();
    setSelectedReagentIds(rx.requiredReagents);
    setIsReacting(true);
    triggerReactionAudio(rx);
  };

  // Trigger audio based on reaction effects
  const triggerReactionAudio = (rx: ReactionData) => {
    playBeakerClink();
    if (rx.effects.hasGas) {
      const stopFizz = playFizzing();
      setTimeout(() => stopFizz(), 3200);
    }
    if (rx.effects.glowOrSparks) {
      setTimeout(() => playPop(), 250);
      setTimeout(() => playSizzle(), 600);
    }
    setTimeout(() => playSuccess(), 1200);
  };

  // Trigger Reaction
  const handleTriggerReaction = () => {
    if (matchingReaction) {
      setIsReacting(true);
      triggerReactionAudio(matchingReaction);
    }
  };

  // Toggle Bunsen Heater
  const handleToggleHeater = () => {
    if (!isHeating) {
      playBunsenIgnite();
    } else {
      playClick();
    }
    setIsHeating((prev) => !prev);
  };

  // Toggle Magnetic Stirrer
  const handleToggleStirrer = () => {
    playClick();
    setIsStirring((prev) => !prev);
  };

  // Reset Lab Beaker
  const handleReset = () => {
    playPour();
    setSelectedReagentIds([]);
    setIsReacting(false);
    setIsHeating(false);
    setIsStirring(false);
    setHeaterBoost(0);
  };

  // Snapshot exporter (generates high-res PNG on HTML Canvas)
  const handleCaptureSnapshot = () => {
    playClick();
    const canvas = document.createElement('canvas');
    canvas.width = 900;
    canvas.height = 650;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradient (clean light theme)
    const bgGrad = ctx.createLinearGradient(0, 0, 900, 650);
    bgGrad.addColorStop(0, '#f8fafc');
    bgGrad.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 900, 650);

    // Decorative Header Card
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(15, 23, 42, 0.08)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 4;
    ctx.roundRect(30, 30, 840, 90, 14);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.fillStyle = '#0284c7';
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.fillText('CHEMICAL CHEMISTRY — LABORATORIUM REAKSI VIRTUAL', 55, 68);

    ctx.fillStyle = '#64748b';
    ctx.font = '13px system-ui, sans-serif';
    ctx.fillText(
      `Snapshot Praktikum Kimia | Tanggal: ${new Date().toLocaleDateString('id-ID')}`,
      55,
      96
    );

    // Beaker Drawing
    const beakerX = 450;
    const beakerY = 440;
    const beakerW = 220;
    const beakerH = 260;

    // Draw Liquid
    const liquidColor = matchingReaction && isReacting
      ? matchingReaction.effects.liquidColorEnd
      : selectedReagents[selectedReagents.length - 1]?.color || '#e0f2fe';

    ctx.fillStyle = liquidColor;
    ctx.roundRect(beakerX - beakerW / 2 + 6, beakerY - 140, beakerW - 12, 140, [0, 0, 24, 24]);
    ctx.fill();

    // Draw Beaker outline
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.4)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(beakerX - beakerW / 2, beakerY - beakerH + 40);
    ctx.lineTo(beakerX - beakerW / 2, beakerY);
    ctx.arcTo(beakerX - beakerW / 2, beakerY + 10, beakerX - beakerW / 2 + 20, beakerY + 10, 20);
    ctx.lineTo(beakerX + beakerW / 2 - 20, beakerY + 10);
    ctx.arcTo(beakerX + beakerW / 2, beakerY + 10, beakerX + beakerW / 2, beakerY, 20);
    ctx.lineTo(beakerX + beakerW / 2, beakerY - beakerH + 40);
    ctx.stroke();

    // Info panel on left
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(15, 23, 42, 0.06)';
    ctx.shadowBlur = 12;
    ctx.roundRect(40, 150, 250, 460, 14);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.fillText('Data Parameter Eksperimen', 60, 185);

    ctx.fillStyle = '#475569';
    ctx.font = '13px system-ui, sans-serif';
    ctx.fillText(`Suhu Larutan: ${currentTemp.toFixed(1)} °C`, 60, 225);
    ctx.fillText(`Derajat pH: ${currentPH.toFixed(2)}`, 60, 260);
    ctx.fillText(`Pemanas Bunsen: ${isHeating ? 'Aktif' : 'Mati'}`, 60, 295);
    ctx.fillText(`Pengaduk Magnetik: ${isStirring ? 'Aktif' : 'Mati'}`, 60, 330);

    ctx.fillStyle = '#0284c7';
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.fillText('Reagen Terlarut:', 60, 375);
    ctx.fillStyle = '#334155';
    ctx.font = '12px system-ui, sans-serif';
    selectedReagents.forEach((r, idx) => {
      ctx.fillText(`• ${r.nameId} (${r.formula})`, 65, 405 + idx * 24);
    });

    // Info panel on right
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(15, 23, 42, 0.06)';
    ctx.shadowBlur = 12;
    ctx.roundRect(610, 150, 250, 460, 14);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.fillText('Analisis Reaksi Kimia', 630, 185);

    if (matchingReaction) {
      ctx.fillStyle = '#0284c7';
      ctx.font = 'bold 13px system-ui, sans-serif';
      ctx.fillText(matchingReaction.titleId, 630, 220);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(matchingReaction.balancedEquation, 630, 255);

      ctx.fillStyle = matchingReaction.deltaH < 0 ? '#ef4444' : '#0284c7';
      ctx.font = 'bold 12px system-ui, sans-serif';
      ctx.fillText(`ΔH: ${matchingReaction.deltaH} kJ/mol`, 630, 290);

      ctx.fillStyle = '#475569';
      ctx.font = '11px system-ui, sans-serif';
      const words = matchingReaction.summary.split(' ');
      let line = '';
      let y = 330;
      for (let w of words) {
        if (ctx.measureText(line + w).width > 210) {
          ctx.fillText(line, 630, y);
          line = w + ' ';
          y += 18;
          if (y > 560) break;
        } else {
          line += w + ' ';
        }
      }
      ctx.fillText(line, 630, y);
    } else {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px system-ui, sans-serif';
      ctx.fillText('Belum ada reaksi aktif.', 630, 220);
    }

    // Trigger download
    const link = document.createElement('a');
    link.download = `chemical-atlas-lab-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="reaction-lab-view">
      {/* Preset Reactions Quick Bar & Audio Toggle */}
      <div className="presets-bar glass-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, overflowX: 'auto' }}>
          <span className="presets-label">
            <Sparkles size={14} color="#0284c7" style={{ display: 'inline', marginRight: '4px' }} />
            Preset Reaksi:
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

        {/* Audio Sound FX Toggle */}
        <button
          className="btn btn-ghost"
          onClick={handleToggleMute}
          title={muted ? 'Nyalakan Efek Suara Lab' : 'Matikan Suara (Mute)'}
          style={{ padding: '6px 10px', flexShrink: 0 }}
        >
          {muted ? <VolumeX size={16} color="#94a3b8" /> : <Volume2 size={16} color="#0284c7" />}
          <span style={{ fontSize: '11px' }}>{muted ? 'Audio Mati' : 'Audio Aktif'}</span>
        </button>
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
                    {reagent.pH !== undefined && (
                      <span
                        className="ph-pill-chip"
                        style={{
                          backgroundColor:
                            reagent.pH < 6
                              ? 'rgba(239, 68, 68, 0.1)'
                              : reagent.pH > 8
                              ? 'rgba(59, 130, 246, 0.1)'
                              : 'rgba(16, 185, 129, 0.1)',
                          color:
                            reagent.pH < 6
                              ? '#dc2626'
                              : reagent.pH > 8
                              ? '#2563eb'
                              : '#059669',
                        }}
                      >
                        pH {reagent.pH}
                      </span>
                    )}
                    {reagent.hazard && (
                      <span className="hazard-icon-chip" title={reagent.hazard}>
                        {reagent.hazard === 'corrosive'
                          ? 'Korosif'
                          : reagent.hazard === 'flammable'
                          ? 'Flammable'
                          : 'Toksik'}
                      </span>
                    )}
                    {isSelected && <CheckCircle2 size={16} color="#0284c7" />}
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
              top: '16px',
              left: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <FlaskConical size={18} color="#0284c7" />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
              Meja Kerja Reaksi & Analisis
            </span>
          </div>

          {/* Liquid & Beaker Simulation Canvas */}
          <ReactionCanvas
            selectedReagents={selectedReagents}
            activeReaction={matchingReaction}
            isReacting={isReacting}
            isHeating={isHeating}
            isStirring={isStirring}
            currentTemp={currentTemp}
            currentPH={currentPH}
          />

          {/* Laboratory Apparatus Secondary Controls (Heater, Stirrer, Snapshot) */}
          <div className="apparatus-controls-bar">
            <button
              className={`apparatus-btn ${isHeating ? 'active-heat' : ''}`}
              onClick={handleToggleHeater}
              title="Pemanas Bunsen Hotplate"
            >
              <Flame size={15} />
              <span>{isHeating ? 'Pemanas: ON (Mendidih)' : 'Pemanas Bunsen'}</span>
            </button>

            <button
              className={`apparatus-btn ${isStirring ? 'active-stir' : ''}`}
              onClick={handleToggleStirrer}
              title="Pengaduk Magnetik Vortex"
            >
              <Zap size={15} />
              <span>{isStirring ? 'Pengaduk: ON' : 'Pengaduk Magnetik'}</span>
            </button>

            <button
              className="apparatus-btn"
              onClick={handleCaptureSnapshot}
              title="Unduh Gambar Hasil Lab (PNG)"
            >
              <Camera size={15} />
              <span>Snapshot Lab</span>
            </button>

            {matchingReaction && (
              <button
                className="apparatus-btn report-btn"
                onClick={() => {
                  playClick();
                  setIsReportModalOpen(true);
                }}
                title="Cetak Laporan Praktikum Resmi"
              >
                <FileText size={15} />
                <span>Cetak Laporan</span>
              </button>
            )}
          </div>

          {/* Stage Primary Actions */}
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
          <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
            {selectedReagents.length === 0
              ? 'Pilih 1 atau lebih reagen dari rak di sebelah kiri untuk dimasukkan ke gelas kimia.'
              : matchingReaction
              ? isReacting
                ? 'Reaksi kimia aktif! Amati perubahan warna, pH probe, suhu termometer, atau gas/endapan.'
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
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#0284c7',
                    marginBottom: '6px',
                  }}
                >
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
                Campurkan reagen kimia seperti <strong>HCl + NaOH</strong> untuk titrasi netralisasi,{' '}
                <strong>AgNO₃ + NaCl</strong> untuk endapan, atau pilih salah satu tombol{' '}
                <strong>Preset Reaksi Populer</strong> di atas untuk melihat simulasi visual instan!
              </p>
              <div
                style={{
                  marginTop: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  textAlign: 'left',
                  width: '100%',
                  fontSize: '12px',
                  background: 'rgba(2, 132, 199, 0.05)',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(2, 132, 199, 0.15)',
                }}
              >
                <strong style={{ color: '#0284c7' }}>Fitur Baru Terpasang:</strong>
                <span>• <strong>pH Meter Digital:</strong> Monitoring keasaman 0-14 secara real-time.</span>
                <span>• <strong>Pemanas Bunsen:</strong> Panaskan larutan hingga mendidih.</span>
                <span>• <strong>Pengaduk Magnetik:</strong> Putar vortex cairan di dasar bejana.</span>
                <span>• <strong>Laporan Praktikum:</strong> Cetak hasil lab resmi dalam format PDF.</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Printable Lab Report Modal */}
      {matchingReaction && (
        <LabReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          reaction={matchingReaction}
          selectedReagents={selectedReagents}
          currentTemp={currentTemp}
          currentPH={currentPH}
        />
      )}
    </div>
  );
};
