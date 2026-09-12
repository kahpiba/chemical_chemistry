import React, { useMemo } from 'react';
import type { ReactionData, Reagent } from '../../data/reactions';

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

  const phColor = getPHColor(currentPH);
  const phCategory = getPHCategory(currentPH);

  return (
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
        <div className="beaker-container">
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

          {/* Liquid Body */}
          {liquidHeight > 0 && (
            <div
              className={`liquid-body ${isStirring ? 'stirring' : ''}`}
              style={{
                height: `${liquidHeight}px`,
                backgroundColor: liquidColor,
              }}
            >
              {/* Liquid Surface with optional Stirrer Vortex */}
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
  );
};
