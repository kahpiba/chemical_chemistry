import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Flame,
  Eye,
  Lightbulb,
  Info,
  ArrowRight,
  Sparkles,
  Zap,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { FLAME_TEST_ELEMENTS } from '../../data/flameTestData';
import type { FlameTestElement } from '../../data/flameTestData';
import { BohrSpectroscopyLab } from './BohrSpectroscopyLab';
import { playBunsenIgnite, playClick, setMuted, isMuted } from '../../utils/audio';
import '../../styles/flame.css';

export const FlameTestLab: React.FC = () => {
  const [flameSubMode, setFlameSubMode] = useState<'bunsen' | 'bohr'>('bunsen');
  const [selectedElement, setSelectedElement] = useState<FlameTestElement | null>(null);
  const [isIgnited, setIsIgnited] = useState(false);
  const [showSpectrum, setShowSpectrum] = useState(false);
  const [audioMuted, setAudioMuted] = useState(isMuted());
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number>(0);

  // Bunsen burner flame animation
  const drawFlame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const time = performance.now() * 0.003;

    ctx.clearRect(0, 0, W, H);

    // Draw burner body
    const burnerX = W / 2;
    const burnerBottom = H - 20;
    const burnerTop = H * 0.55;
    const burnerW = 50;

    // Burner tube
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.moveTo(burnerX - burnerW / 2, burnerBottom);
    ctx.lineTo(burnerX - burnerW / 3, burnerTop);
    ctx.lineTo(burnerX + burnerW / 3, burnerTop);
    ctx.lineTo(burnerX + burnerW / 2, burnerBottom);
    ctx.closePath();
    ctx.fill();

    // Burner rim
    ctx.fillStyle = '#475569';
    ctx.fillRect(burnerX - burnerW / 2.5, burnerTop - 4, burnerW / 1.25, 8);

    // Burner base
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.ellipse(burnerX, burnerBottom + 5, burnerW * 0.9, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    if (!isIgnited || !selectedElement) {
      // Just draw the cold burner
      animFrameRef.current = requestAnimationFrame(drawFlame);
      return;
    }

    const flameColor = selectedElement.flameColor;

    // Draw flame layers (multiple for depth)
    for (let layer = 0; layer < 5; layer++) {
      const layerOffset = layer * 0.7;
      const flameH = 130 + Math.sin(time + layerOffset) * 20 + layer * 10;
      const flameW = 28 + Math.sin(time * 1.3 + layerOffset) * 8 - layer * 3;
      const flameY = burnerTop - flameH;

      ctx.save();
      ctx.globalAlpha = 0.6 - layer * 0.1;

      // Gradient for flame
      const gradient = ctx.createLinearGradient(burnerX, burnerTop, burnerX, flameY);
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(0.15, flameColor);
      gradient.addColorStop(0.6, flameColor);
      gradient.addColorStop(1, 'transparent');

      // Flame shape using bezier curves
      ctx.beginPath();
      const sway = Math.sin(time + layer) * 6;
      ctx.moveTo(burnerX - flameW, burnerTop);
      ctx.quadraticCurveTo(
        burnerX - flameW * 0.8 + sway,
        burnerTop - flameH * 0.5,
        burnerX + sway * 0.5,
        flameY
      );
      ctx.quadraticCurveTo(
        burnerX + flameW * 0.8 + sway,
        burnerTop - flameH * 0.5,
        burnerX + flameW,
        burnerTop
      );
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.restore();
    }

    // Inner bright core
    const coreH = 50 + Math.sin(time * 2) * 8;
    const coreGradient = ctx.createLinearGradient(
      burnerX,
      burnerTop,
      burnerX,
      burnerTop - coreH
    );
    coreGradient.addColorStop(0, '#ffffff');
    coreGradient.addColorStop(0.3, 'rgba(255,255,255,0.8)');
    coreGradient.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.ellipse(burnerX, burnerTop - coreH / 2, 10, coreH / 2, 0, 0, Math.PI * 2);
    ctx.fillStyle = coreGradient;
    ctx.globalAlpha = 0.7;
    ctx.fill();
    ctx.globalAlpha = 1;

    // Glow effect
    const glowGradient = ctx.createRadialGradient(
      burnerX, burnerTop - 60, 10,
      burnerX, burnerTop - 60, 120
    );
    glowGradient.addColorStop(0, flameColor + '40');
    glowGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGradient;
    ctx.fillRect(0, 0, W, H);

    // Sparks
    for (let i = 0; i < 3; i++) {
      const sparkX = burnerX + Math.sin(time * 3 + i * 2) * 30;
      const sparkY = burnerTop - 80 - Math.random() * 60;
      const sparkSize = 1.5 + Math.random() * 2;
      ctx.beginPath();
      ctx.arc(sparkX, sparkY, sparkSize, 0, Math.PI * 2);
      ctx.fillStyle = flameColor;
      ctx.globalAlpha = 0.3 + Math.random() * 0.4;
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    animFrameRef.current = requestAnimationFrame(drawFlame);
  }, [isIgnited, selectedElement]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 300;
      canvas.height = 400;
    }
    animFrameRef.current = requestAnimationFrame(drawFlame);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [drawFlame]);

  const handleSelectElement = (el: FlameTestElement) => {
    playClick();
    setSelectedElement(el);
    setIsIgnited(false);
    setShowSpectrum(false);
  };

  const handleIgnite = () => {
    if (!selectedElement) return;
    playBunsenIgnite();
    setIsIgnited(true);
    setTimeout(() => setShowSpectrum(true), 800);
  };

  const toggleMute = () => {
    const newState = !audioMuted;
    setAudioMuted(newState);
    setMuted(newState);
  };

  return (
    <div className="flame-lab-view">
      {/* Sub-mode switcher */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '-4px' }}>
        <button
          className={`filter-pill ${flameSubMode === 'bunsen' ? 'active' : ''}`}
          onClick={() => setFlameSubMode('bunsen')}
          style={{ gap: '6px', fontSize: '12px' }}
        >
          <Flame size={14} />
          Uji Nyala Api Bunsen (Flame Test)
        </button>
        <button
          className={`filter-pill ${flameSubMode === 'bohr' ? 'active' : ''}`}
          onClick={() => setFlameSubMode('bohr')}
          style={{ gap: '6px', fontSize: '12px' }}
        >
          <Zap size={14} />
          Spektroskopi Emisi & Model Bohr
        </button>
      </div>

      {flameSubMode === 'bunsen' ? (
        <>
          {/* Element selector */}
          <div className="flame-elements-bar glass-panel">
            <div className="flame-bar-header">
              <Sparkles size={14} color="#f59e0b" />
              <span>Pilih Unsur untuk Uji Nyala Api</span>
              <button className="btn-icon-sm" onClick={toggleMute} title={audioMuted ? 'Unmute' : 'Mute'}>
                {audioMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </div>
            <div className="flame-element-chips">
              {FLAME_TEST_ELEMENTS.map(el => (
                <button
                  key={el.symbol}
                  className={`flame-element-chip ${selectedElement?.symbol === el.symbol ? 'active' : ''}`}
                  onClick={() => handleSelectElement(el)}
                  style={{
                    '--el-color': el.flameColor,
                  } as React.CSSProperties}
                >
                  <span className="flame-chip-symbol">{el.symbol}</span>
                  <span className="flame-chip-name">{el.nameId}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main layout */}
          <div className="flame-workbench">
            {/* Left: Bunsen burner canvas */}
            <div className="flame-stage glass-panel">
              <div className="flame-stage-header">
                <div className="flame-status">
                  <span className={`status-dot ${isIgnited ? 'active' : ''}`} />
                  <span>{isIgnited ? 'Api Menyala' : 'Api Mati'}</span>
                </div>
                {selectedElement && (
                  <span className="flame-current-element">
                    Sampel: <strong>{selectedElement.nameId}</strong> ({selectedElement.symbol})
                  </span>
                )}
              </div>

              <div className="flame-canvas-container">
                <canvas ref={canvasRef} className="flame-canvas" />
                {isIgnited && selectedElement && (
                  <div
                    className="flame-glow"
                    style={{
                      '--glow-color': selectedElement.flameColor,
                    } as React.CSSProperties}
                  />
                )}
              </div>

              {/* Controls */}
              <div className="flame-controls">
                <button
                  className={`btn ${isIgnited ? 'btn-danger' : 'btn-primary'} flame-ignite-btn`}
                  onClick={isIgnited ? () => setIsIgnited(false) : handleIgnite}
                  disabled={!selectedElement}
                >
                  <Flame size={16} />
                  {isIgnited ? 'Padamkan Api' : 'Nyalakan Api!'}
                </button>
                {selectedElement && isIgnited && (
                  <button
                    className={`btn btn-secondary ${showSpectrum ? 'active' : ''}`}
                    onClick={() => setShowSpectrum(!showSpectrum)}
                  >
                    <Eye size={16} />
                    {showSpectrum ? 'Sembunyikan Spektrum' : 'Lihat Spektrum'}
                  </button>
                )}
              </div>
            </div>

            {/* Right: Spectrum & Explanation */}
            <div className="flame-info-panel glass-panel">
              {selectedElement && isIgnited ? (
                <>
                  <div className="flame-info-header">
                    <div
                      className="flame-info-icon"
                      style={{ background: selectedElement.flameColor }}
                    >
                      {selectedElement.symbol}
                    </div>
                    <div>
                      <h3>{selectedElement.nameId} ({selectedElement.name})</h3>
                      <span className="flame-atomic-num">Z = {selectedElement.atomicNumber}</span>
                    </div>
                  </div>

                  {/* Emission Spectrum Visualization */}
                  {showSpectrum && (
                    <div className="spectrum-section">
                      <h4>
                        <Zap size={14} />
                        Spektrum Emisi
                      </h4>
                      <div className="spectrum-bar">
                        {/* Rainbow gradient background */}
                        <div className="spectrum-gradient" />
                        {/* Emission lines */}
                        {selectedElement.emissionLines.map((line, i) => {
                          const pct = ((line.wavelength - 380) / (780 - 380)) * 100;
                          return (
                            <div
                              key={i}
                              className="emission-line"
                              style={{
                                left: `${pct}%`,
                                background: line.color,
                                opacity: line.intensity,
                                height: `${60 + line.intensity * 40}%`,
                              }}
                              title={`${line.wavelength} nm`}
                            >
                              <span className="line-label">{line.wavelength} nm</span>
                            </div>
                          );
                        })}
                        {/* Scale markers */}
                        <div className="spectrum-scale">
                          <span>380</span>
                          <span>480</span>
                          <span>580</span>
                          <span>680</span>
                          <span>780 nm</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Orbital transition */}
                  <div className="flame-narrative">
                    <h4>
                      <Lightbulb size={14} />
                      Transisi Elektron
                    </h4>
                    <div className="orbital-note">{selectedElement.orbitalNote}</div>
                    <p>{selectedElement.explanation}</p>
                  </div>

                  {/* Real world */}
                  <div className="flame-narrative">
                    <h4>
                      <Info size={14} />
                      Aplikasi Dunia Nyata
                    </h4>
                    <p>{selectedElement.realWorldUse}</p>
                  </div>
                </>
              ) : selectedElement ? (
                <div className="flame-prompt">
                  <ArrowRight size={24} color="#f59e0b" />
                  <h4>Siap menguji {selectedElement.nameId}!</h4>
                  <p>
                    Tekan tombol "Nyalakan Api!" pada Bunsen Burner untuk melihat warna nyala api
                    khas unsur {selectedElement.nameId} ({selectedElement.symbol}).
                  </p>
                </div>
              ) : (
                <div className="flame-prompt">
                  <Flame size={32} color="#94a3b8" />
                  <h4>Laboratorium Uji Nyala Api</h4>
                  <p>
                    Uji nyala api (flame test) adalah teknik analisis kimia kualitatif yang digunakan
                    untuk mengidentifikasi unsur logam berdasarkan warna nyala api yang dihasilkan.
                  </p>
                  <p>
                    Saat logam dipanaskan, elektronnya tereksitasi ke tingkat energi lebih tinggi.
                    Saat kembali ke keadaan dasar, elektron memancarkan foton dengan panjang gelombang spesifik.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <BohrSpectroscopyLab />
      )}
    </div>
  );
};
