import React, { useMemo } from 'react';
import type { ReactionData, Reagent } from '../../data/reactions';

interface ReactionCanvasProps {
  selectedReagents: Reagent[];
  activeReaction: ReactionData | null;
  isReacting: boolean;
}

export const ReactionCanvas: React.FC<ReactionCanvasProps> = ({
  selectedReagents,
  activeReaction,
  isReacting,
}) => {
  // Fluid simulation state
  const liquidHeight = useMemo(() => {
    if (selectedReagents.length === 0) return 0;
    return Math.min(240, 60 + selectedReagents.length * 45);
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

  // Dynamic temperature calculation
  const currentTemp = useMemo(() => {
    if (!activeReaction || !isReacting) return 25;
    return activeReaction.effects.temperatureEnd;
  }, [activeReaction, isReacting]);

  // Generate random bubbles for gas evolution
  const bubbles = useMemo(() => {
    if (!activeReaction || !isReacting || !activeReaction.effects.hasGas) return [];
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      left: `${15 + Math.random() * 70}%`,
      size: `${4 + Math.random() * 8}px`,
      speed: `${0.8 + Math.random() * 1.2}s`,
      delay: `${Math.random() * 1.5}s`,
    }));
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

  return (
    <div className="stage-vessel-area">
      {/* Glass Laboratory Beaker */}
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

        {/* Liquid Body */}
        {liquidHeight > 0 && (
          <div
            className="liquid-body"
            style={{
              height: `${liquidHeight}px`,
              backgroundColor: liquidColor,
            }}
          >
            <div className="liquid-surface" />

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
          </div>
        )}

        {/* Steam Cloud rising above mouth */}
        {activeReaction && isReacting && activeReaction.effects.steamEffect && (
          <div className="steam-cloud" />
        )}

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

      {/* Dynamic Digital & Mercury Thermometer */}
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
