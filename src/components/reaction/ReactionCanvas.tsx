import React, { useMemo, useEffect } from 'react';
import type { ReactionData, Reagent } from '../../data/reactions';
import { playGlassCrack, playViolentSpatter, playToxicGasHiss } from '../../utils/audio';
import { getHazardProfile } from '../../utils/hazardsLogic';
import { Skull } from 'lucide-react';

interface ReactionCanvasProps {
  selectedReagents: Reagent[];
  activeReaction: ReactionData | null;
  isReacting: boolean;
  isHeating?: boolean;
  isStirring?: boolean;
  currentTemp: number;
  currentPH: number;
}

export const getPHColor = (ph: number): string => {
  if (ph <= 2) return '#ef4444';
  if (ph <= 4) return '#f97316';
  if (ph <= 6) return '#eab308';
  if (ph <= 7.5) return '#10b981';
  if (ph <= 9) return '#06b6d4';
  if (ph <= 11) return '#3b82f6';
  return '#8b5cf6';
};

export const getPHCategory = (ph: number): string => {
  if (ph <= 2.5) return 'Asam Kuat';
  if (ph <= 6.5) return 'Asam Lemah';
  if (ph <= 7.5) return 'Netral';
  if (ph <= 11.5) return 'Basa Lemah';
  return 'Basa Kuat';
};

export const ReactionCanvas: React.FC<ReactionCanvasProps> = ({
  selectedReagents,
  activeReaction,
  isReacting,
  isHeating = false,
  isStirring = false,
  currentTemp,
  currentPH,
}) => {
  // Fluid simulation state
  const liquidHeight = useMemo(() => {
    if (selectedReagents.length === 0) return 0;
    return Math.min(230, 60 + selectedReagents.length * 40);
  }, [selectedReagents.length]);

  // Current liquid color
  const liquidColor = useMemo(() => {
    if (selectedReagents.length === 0) return 'transparent';
    if (activeReaction && isReacting) {
      return activeReaction.effects.liquidColorEnd;
    }
    if (activeReaction) {
      return activeReaction.effects.liquidColorStart;
    }
    // Blend colors of selected reagents
    return selectedReagents[selectedReagents.length - 1].color || '#e0f2fe';
  }, [selectedReagents, activeReaction, isReacting]);

  // Generate random bubbles for gas evolution or boiling
  const bubbles = useMemo(() => {
    const hasGas = (activeReaction && isReacting && activeReaction.effects.hasGas) || (isHeating && currentTemp > 75);
    if (!hasGas) return [];
    const count = isHeating && currentTemp > 85 ? 36 : 22;
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${12 + Math.random() * 76}%`,
      size: `${3 + Math.random() * 8}px`,
      speed: `${0.6 + Math.random() * 1.0}s`,
      delay: `${Math.random() * 1.5}s`,
    }));
  }, [activeReaction, isReacting, isHeating, currentTemp]);

  // Sound triggers for failure & hazardous reactions
  useEffect(() => {
    if (!activeReaction || !isReacting) return;
    if (activeReaction.effects.beakerCrack) {
      playGlassCrack();
      playViolentSpatter();
    } else if (activeReaction.effects.hazardType === 'toxic_gas') {
      playToxicGasHiss();
    } else if (activeReaction.effects.spatterEffect) {
      playViolentSpatter();
    }
  }, [activeReaction, isReacting]);

  // Sparks for sodium / explosive reactions
  const sparks = useMemo(() => {
    if (!activeReaction || !isReacting || !activeReaction.effects.glowOrSparks) return [];
    return Array.from({ length: 16 }).map((_, i) => ({
      id: i,
      dx: `${(Math.random() - 0.5) * 120}px`,
      dy: `${-30 - Math.random() * 80}px`,
      left: `${40 + Math.random() * 20}%`,
      delay: `${Math.random() * 0.4}s`,
    }));
  }, [activeReaction, isReacting]);

  // Spatter droplets for violent boiling
  const spatters = useMemo(() => {
    if (!activeReaction || !isReacting || !activeReaction.effects.spatterEffect) return [];
    return Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      dx: `${(Math.random() - 0.5) * 140}px`,
      dy: `${-60 - Math.random() * 90}px`,
      left: `${35 + Math.random() * 30}%`,
      delay: `${(i % 5) * 0.1}s`,
    }));
  }, [activeReaction, isReacting]);

  const phColor = getPHColor(currentPH);
  const phCategory = getPHCategory(currentPH);

  // NFPA profile for current reaction if hazardous
  const hazardProfile = useMemo(() => {
    if (!activeReaction || !activeReaction.effects.isHazardousFailure) return null;
    if (activeReaction.effects.hazardType === 'toxic_gas') return getHazardProfile('Cl2_gas');
    if (activeReaction.effects.hazardType === 'thermal_crack') return getHazardProfile('H2SO4_conc');
    return getHazardProfile('Na_metal');
  }, [activeReaction]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
      <div className="stage-vessel-area" id="reaction-lab-stage">
        {/* Digital pH Meter Unit (Left) */}
        <div className="ph-meter-wrapper">
          <div className="ph-meter-unit">
            <span className="ph-meter-label">pH Meter Digital</span>
            <div className="ph-digital-readout" style={{ color: phColor }}>
              {liquidHeight > 0 ? currentPH.toFixed(2) : '--.--'}
            </div>
            <span className="ph-category-badge" style={{ backgroundColor: `${phColor}18`, color: phColor }}>
              {liquidHeight > 0 ? phCategory : 'Sensor Siaga'}
            </span>

            {/* Universal Indicator Color Bar */}
            <div className="ph-spectrum-bar" title="Pita Indikator Universal pH 0 - 14">
              <div
                className="ph-indicator-pin"
                style={{
                  left: `${Math.min(100, Math.max(0, (currentPH / 14) * 100))}%`,
                  backgroundColor: phColor,
                }}
              />
            </div>
            <div className="ph-scale-legend">
              <span>0 (Asam)</span>
              <span>7 (Netral)</span>
              <span>14 (Basa)</span>
            </div>
          </div>
        </div>

        {/* Main Beaker with Heating Platform & Stirrer */}
        <div className="beaker-setup-column">
          <div className="beaker-container" style={{ position: 'relative' }}>
            <div className="beaker-lip" />

            {/* Graduation Marks */}
            <div className="beaker-marks">
              <div className="beaker-mark-line">250 ml</div>
              <div className="beaker-mark-line">200 ml</div>
              <div className="beaker-mark-line">150 ml</div>
              <div className="beaker-mark-line">100 ml</div>
              <div className="beaker-mark-line">50 ml</div>
            </div>

            {/* pH Probe Electrode Dipping into Liquid */}
            {liquidHeight > 0 && (
              <div
                className="ph-probe-electrode"
                style={{
                  height: `${Math.min(270, 300 - liquidHeight + 35)}px`,
                }}
              >
                <div className="ph-probe-wire" />
                <div className="ph-probe-stem" />
                <div className="ph-probe-bulb" style={{ borderColor: phColor }} />
              </div>
            )}

            {/* Immiscible 2-Phase Liquid vs Standard Liquid Body */}
            {liquidHeight > 0 && (
              activeReaction?.effects.isImmiscible ? (
                /* 2-Phase Immiscible Liquid (e.g. Oil + Water) */
                <div
                  className="liquid-body"
                  style={{
                    height: `${liquidHeight}px`,
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Top Phase (Oil) */}
                  <div
                    style={{
                      flex: 1,
                      background: activeReaction.effects.immiscibleColors?.[0] || '#fef08a',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <span className="phase-tag" style={{ top: '6px' }}>Fase Minyak (Non-Polar)</span>
                  </div>
                  {/* Phase Boundary Line */}
                  <div className="phase-boundary-line" />
                  {/* Bottom Phase (Water) */}
                  <div
                    style={{
                      flex: 1,
                      background: activeReaction.effects.immiscibleColors?.[1] || '#e0f2fe',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <span className="phase-tag" style={{ bottom: '6px' }}>Fase Air (Polar)</span>
                  </div>
                </div>
              ) : (
                /* Standard Uniform Liquid Body */
                <div
                  className={`liquid-body ${isStirring ? 'stirring' : ''}`}
                  style={{
                    height: `${liquidHeight}px`,
                    backgroundColor: liquidColor,
                  }}
                >
                  <div className={`liquid-surface ${isStirring ? 'vortex-surface' : ''}`} />

                  {/* Precipitate sediment layer */}
                  {activeReaction && isReacting && activeReaction.effects.hasPrecipitate && (
                    <div
                      className="precipitate-sediment"
                      style={
                        {
                          '--precipitate-color': activeReaction.effects.precipitateColor,
                        } as React.CSSProperties
                      }
                    />
                  )}

                  {/* Gas Bubbles */}
                  {bubbles.map((b) => (
                    <div
                      key={b.id}
                      className="bubble"
                      style={
                        {
                          left: b.left,
                          width: b.size,
                          height: b.size,
                          '--speed': b.speed,
                          animationDelay: b.delay,
                        } as React.CSSProperties
                      }
                    />
                  ))}

                  {/* Magnetic Stirring Pill at bottom of beaker */}
                  {isStirring && (
                    <div className="magnetic-stir-bar rotating" />
                  )}
                </div>
              )
            )}

            {/* Thermal Shock Glass Cracks Overlay */}
            {activeReaction && isReacting && activeReaction.effects.beakerCrack && (
              <div className="beaker-glass-crack">
                <svg viewBox="0 0 200 300" style={{ width: '100%', height: '100%' }}>
                  <path
                    d="M 20 280 L 70 200 L 40 150 L 95 110 L 60 40 M 70 200 L 130 180 L 160 240 M 95 110 L 140 100 L 180 60 M 130 180 L 110 270"
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ filter: 'drop-shadow(0 0 3px rgba(239, 68, 68, 0.8))' }}
                  />
                  <path
                    d="M 25 275 L 72 198 L 42 148 L 97 108"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                  />
                </svg>
              </div>
            )}

            {/* Violent Acid Spatter Droplets */}
            {spatters.map((s) => (
              <div
                key={s.id}
                className="spatter-droplet"
                style={
                  {
                    left: s.left,
                    top: `${300 - liquidHeight - 8}px`,
                    '--dx': s.dx,
                    '--dy': s.dy,
                    animationDelay: s.delay,
                  } as React.CSSProperties
                }
              />
            ))}

            {/* Toxic Gas Fumes Cloud (e.g. Chlorine gas Cl2) */}
            {activeReaction && isReacting && activeReaction.effects.isHazardousFailure && activeReaction.effects.hazardType === 'toxic_gas' && (
              <div
                className="toxic-gas-cloud"
                style={
                  {
                    '--gas-tint': activeReaction.effects.gasColor || 'rgba(163, 230, 53, 0.85)',
                  } as React.CSSProperties
                }
              />
            )}

            {/* Steam Cloud rising above mouth */}
            {((activeReaction && isReacting && activeReaction.effects.steamEffect) ||
              (isHeating && currentTemp > 65)) && <div className="steam-cloud" />}

            {/* Sparks & Flame for reactive metals */}
            {sparks.map((s) => (
              <div
                key={s.id}
                className="spark-dot"
                style={
                  {
                    left: s.left,
                    top: `${300 - liquidHeight - 10}px`,
                    '--dx': s.dx,
                    '--dy': s.dy,
                    animationDelay: s.delay,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>

          {/* Laboratory Bunsen Heater & Magnetic Stirrer Hotplate Stand */}
          <div className="hotplate-stand">
            {isHeating && (
              <div className="bunsen-burner-flame">
                <div className="flame-outer" />
                <div className="flame-inner" />
              </div>
            )}
            <div className={`hotplate-top ${isHeating ? 'heating' : ''}`}>
              <div className="hotplate-indicator-leds">
                <span className={`led-dot ${isHeating ? 'active-heat' : ''}`} title="Pemanas Aktif" />
                <span className={`led-dot ${isStirring ? 'active-stir' : ''}`} title="Pengaduk Aktif" />
              </div>
            </div>
            <div className="hotplate-base">
              <span>Hotplate & Magnetic Stirrer</span>
            </div>
          </div>
        </div>

        {/* Dynamic Digital & Mercury Thermometer (Right) */}
        <div className="thermometer-wrapper">
          <div className="thermometer-readout">
            {currentTemp.toFixed(1)} °C
          </div>

          <div className="thermometer-body">
            <div
              className="thermometer-fluid"
              style={{
                height: `${Math.min(100, Math.max(8, (currentTemp / 100) * 100))}%`,
                background:
                  currentTemp > 45
                    ? 'linear-gradient(to top, #ef4444, #f97316)'
                    : currentTemp < 22
                    ? 'linear-gradient(to top, #0284c7, #38bdf8)'
                    : 'linear-gradient(to top, #10b981, #fbbf24)',
              }}
            />
          </div>

          <div
            className="thermometer-bulb"
            style={{
              backgroundColor:
                currentTemp > 45 ? '#ef4444' : currentTemp < 22 ? '#0284c7' : '#10b981',
            }}
          />
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Termometer</span>
        </div>
      </div>

      {/* Emergency Hazard Banner & NFPA 704 Diamond Display */}
      {activeReaction && isReacting && activeReaction.effects.isHazardousFailure && hazardProfile && (
        <div className="hazard-emergency-banner">
          {/* NFPA 704 Diamond */}
          <div className="nfpa-diamond-box" title="Standar Keselamatan NFPA 704">
            <div className="nfpa-diamond-inner">
              <div className="nfpa-cell nfpa-flammability" title="Kemudahan Terbakar">{hazardProfile.nfpa.flammability}</div>
              <div className="nfpa-cell nfpa-instability" title="Ketidakstabilan / Reaktivitas">{hazardProfile.nfpa.instability}</div>
              <div className="nfpa-cell nfpa-health" title="Bahaya Kesehatan">{hazardProfile.nfpa.health}</div>
              <div className="nfpa-cell nfpa-special" title="Bahaya Khusus">{hazardProfile.nfpa.special !== 'none' ? hazardProfile.nfpa.special : ''}</div>
            </div>
          </div>

          {/* Alert Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Skull size={18} color="#dc2626" />
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#991b1b', textTransform: 'uppercase' }}>
                {hazardProfile.signalWord}: {activeReaction.titleId}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: '#7f1d1d', lineHeight: 1.5 }}>
              {activeReaction.safetyWarning}
            </p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
              {hazardProfile.hazardStatements.map((stmt, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '11px',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: 'rgba(239, 68, 68, 0.12)',
                    color: '#991b1b',
                    fontWeight: 600,
                  }}
                >
                  ⚠️ {stmt}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

