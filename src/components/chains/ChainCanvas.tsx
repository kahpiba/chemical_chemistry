import React, { useEffect, useRef, useState } from 'react';
import type { HydrocarbonSeries, PolymerData } from '../../data/chainsData';

interface ChainCanvasProps {
  carbonCount: number;
  series: HydrocarbonSeries;
  polymer?: PolymerData;
  displayMode: 'skeletal' | 'ballstick' | 'lewis';
}

export const ChainCanvas: React.FC<ChainCanvasProps> = ({
  carbonCount,
  series,
  polymer,
  displayMode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredCarbon, setHoveredCarbon] = useState<number | null>(null);
  const [animatedProgress, setAnimatedProgress] = useState<number>(carbonCount);
  const nodesRef = useRef<{ x: number; y: number; index: number }[]>([]);

  // Smooth animation transition when carbon count changes
  useEffect(() => {
    let frameId: number;
    const startTime = performance.now();
    const duration = 280; // ms
    const initial = animatedProgress;
    const target = carbonCount;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = initial + (target - initial) * ease;
      setAnimatedProgress(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [carbonCount]);

  // Handle canvas mouse move for interactive node highlighting
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let found: number | null = null;
    for (const node of nodesRef.current) {
      const dist = Math.hypot(node.x - mouseX, node.y - mouseY);
      if (dist < 20) {
        found = node.index;
        break;
      }
    }
    setHoveredCarbon(found);
  };

  const handleMouseLeave = () => {
    setHoveredCarbon(null);
  };

  // Main Canvas Render Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high-DPI retina display
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Clear Canvas with subtle laboratory grid
    ctx.clearRect(0, 0, width, height);

    // Subtle background grid
    ctx.strokeStyle = 'rgba(226, 232, 240, 0.45)';
    ctx.lineWidth = 1;
    const gridSize = 24;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // If Polymer Mode
    if (series === 'polymer' && polymer) {
      nodesRef.current = [];
      renderPolymerMode(ctx, width, height, polymer);
      return;
    }

    // If Cycloalkane Mode
    if (series === 'cycloalkane') {
      renderCycloalkaneMode(ctx, width, height, carbonCount, displayMode, nodesRef);
      return;
    }

    // Standard Aliphatic Chain (Alkane, Alkene, Alkyne)
    const n = Math.max(1, Math.round(animatedProgress));

    // Determine segment dimensions
    // Automatically fit chain on canvas width
    const marginX = 70;
    const availableWidth = width - marginX * 2;
    const stepX = Math.min(65, Math.max(22, availableWidth / Math.max(2, n)));
    const startX = (width - (n - 1) * stepX) / 2;
    const centerY = height / 2 + 10;
    const amplitudeY = Math.min(38, Math.max(18, stepX * 0.7));

    // Calculate node coordinates for all carbons
    const nodes: { x: number; y: number; index: number }[] = [];
    for (let i = 0; i < n; i++) {
      const x = startX + i * stepX;
      // Zigzag alternation: peak, valley, peak, valley
      const y = centerY + (i % 2 === 0 ? -amplitudeY : amplitudeY);
      nodes.push({ x, y, index: i + 1 });
    }
    nodesRef.current = nodes;

    // Draw Bonds
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (let i = 0; i < nodes.length - 1; i++) {
      const p1 = nodes[i];
      const p2 = nodes[i + 1];
      const isFirstBond = i === 0;

      if (series === 'alkyne' && isFirstBond) {
        // Triple Bond C ≡ C
        drawMultipleBond(ctx, p1, p2, 3, '#0284c7', 4, displayMode === 'skeletal' ? 3 : 2);
      } else if (series === 'alkene' && isFirstBond) {
        // Double Bond C = C
        drawMultipleBond(ctx, p1, p2, 2, '#0284c7', 4, displayMode === 'skeletal' ? 3 : 2);
      } else {
        // Single Bond C - C
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = displayMode === 'skeletal' ? 3.5 : 4.5;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }

    // Draw Hydrogens in Ball & Stick or Lewis Mode
    if (displayMode === 'ballstick' || displayMode === 'lewis') {
      nodes.forEach((node) => {
        const i = node.index - 1;
        const isTerminal = i === 0 || i === nodes.length - 1;
        const isUp = i % 2 === 0;

        // Hydrogens attached to Carbon
        const hOffsets: { dx: number; dy: number }[] = [];
        if (n === 1) {
          // Methane has 4 hydrogens
          hOffsets.push({ dx: 0, dy: -36 }, { dx: 36, dy: 0 }, { dx: 0, dy: 36 }, { dx: -36, dy: 0 });
        } else if (isTerminal) {
          // Terminal carbons have 3 hydrogens
          const dirX = i === 0 ? -1 : 1;
          hOffsets.push(
            { dx: dirX * 28, dy: isUp ? -24 : 24 },
            { dx: 0, dy: isUp ? -32 : 32 },
            { dx: dirX * 32, dy: 0 }
          );
        } else {
          // Secondary carbons have 2 hydrogens
          hOffsets.push({ dx: 0, dy: isUp ? -32 : 32 });
          hOffsets.push({ dx: 14, dy: isUp ? -24 : 24 });
        }

        // Draw H bonds and atoms
        hOffsets.forEach((off) => {
          const hX = node.x + off.dx;
          const hY = node.y + off.dy;

          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(hX, hY);
          ctx.stroke();

          if (displayMode === 'ballstick') {
            // Draw Hydrogen Ball (White sphere with shade)
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(hX, hY, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Specular shine
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.beginPath();
            ctx.arc(hX - 2.5, hY - 2.5, 2.5, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Lewis Symbol 'H'
            ctx.fillStyle = '#0f172a';
            ctx.font = 'bold 12px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('H', hX, hY);
          }
        });
      });
    }

    // Draw Carbon Atoms / Vertices
    nodes.forEach((node) => {
      const isHovered = hoveredCarbon === node.index;

      if (displayMode === 'skeletal') {
        // Skeletal shows vertices. Emphasize terminal carbons with small nodes or C symbol
        ctx.fillStyle = isHovered ? '#0284c7' : '#0f172a';
        ctx.beginPath();
        ctx.arc(node.x, node.y, isHovered ? 6 : 4, 0, Math.PI * 2);
        ctx.fill();

        // Carbon Number label above/below vertex
        ctx.fillStyle = '#64748b';
        ctx.font = '10px var(--font-mono, monospace)';
        ctx.textAlign = 'center';
        const labelY = node.y + (node.index % 2 === 0 ? 18 : -18);
        ctx.fillText(`C${node.index}`, node.x, labelY);
      } else if (displayMode === 'ballstick') {
        // Ball & Stick Carbon (3D sphere shading)
        const radius = 14;
        const grad = ctx.createRadialGradient(
          node.x - radius * 0.35,
          node.y - radius * 0.35,
          radius * 0.1,
          node.x,
          node.y,
          radius
        );
        if (isHovered) {
          grad.addColorStop(0, '#38bdf8');
          grad.addColorStop(1, '#0284c7');
        } else {
          grad.addColorStop(0, '#475569');
          grad.addColorStop(0.7, '#1e293b');
          grad.addColorStop(1, '#0f172a');
        }

        ctx.fillStyle = grad;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetY = 2;
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowColor = 'transparent';

        // White letter C in center
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`C`, node.x, node.y);

        // Number below
        ctx.fillStyle = '#64748b';
        ctx.font = '9px var(--font-mono, monospace)';
        const labelY = node.y + (node.index % 2 === 0 ? 24 : -24);
        ctx.fillText(`${node.index}`, node.x, labelY);
      } else {
        // Lewis Mode: Letter 'C'
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(node.x, node.y, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = isHovered ? '#0284c7' : '#0f172a';
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('C', node.x, node.y);

        // Subscript number
        ctx.fillStyle = '#64748b';
        ctx.font = '9px monospace';
        ctx.fillText(`${node.index}`, node.x + 10, node.y + 10);
      }
    });

    // Angle indicator arc for bond #2
    if (nodes.length >= 3 && displayMode === 'skeletal') {
      const p2 = nodes[1];

      ctx.strokeStyle = 'rgba(2, 132, 199, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(p2.x, p2.y, 16, Math.PI * 0.25, Math.PI * 0.75);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#0284c7';
      ctx.font = 'bold 10px var(--font-mono, monospace)';
      ctx.textAlign = 'center';
      const angleText = series === 'alkene' ? '120° (sp²)' : series === 'alkyne' ? '180° (sp)' : '109.5° (sp³)';
      ctx.fillText(angleText, p2.x, p2.y + 32);
    }
  }, [carbonCount, series, polymer, displayMode, hoveredCarbon, animatedProgress]);

  return (
    <div className="chain-canvas-wrapper">
      <canvas
        ref={canvasRef}
        className="chain-canvas"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
};

// Helper: draw double or triple bond lines
function drawMultipleBond(
  ctx: CanvasRenderingContext2D,
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  bondCount: number,
  color: string,
  lineWidth: number,
  spacing: number
) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const len = Math.hypot(dx, dy);
  const perpX = -dy / len;
  const perpY = dx / len;

  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;

  if (bondCount === 2) {
    const offset = spacing * 1.5;
    [-offset, offset].forEach((off) => {
      ctx.beginPath();
      ctx.moveTo(p1.x + perpX * off, p1.y + perpY * off);
      ctx.lineTo(p2.x + perpX * off, p2.y + perpY * off);
      ctx.stroke();
    });
  } else if (bondCount === 3) {
    const offset = spacing * 2.2;
    [-offset, 0, offset].forEach((off) => {
      ctx.beginPath();
      ctx.moveTo(p1.x + perpX * off, p1.y + perpY * off);
      ctx.lineTo(p2.x + perpX * off, p2.y + perpY * off);
      ctx.stroke();
    });
  }
}

// Helper: Cycloalkanes in Ring Conformation
function renderCycloalkaneMode(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  carbonCount: number,
  displayMode: string,
  nodesRef: React.MutableRefObject<{ x: number; y: number; index: number }[]>
) {
  const n = Math.min(8, Math.max(3, carbonCount));
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(95, height * 0.28);

  const ringNodes: { x: number; y: number; index: number }[] = [];
  for (let i = 0; i < n; i++) {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    ringNodes.push({ x, y, index: i + 1 });
  }
  nodesRef.current = ringNodes;

  // Draw polygon ring bonds
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = displayMode === 'skeletal' ? 3.5 : 4.5;
  ctx.beginPath();
  ctx.moveTo(ringNodes[0].x, ringNodes[0].y);
  for (let i = 1; i < ringNodes.length; i++) {
    ctx.lineTo(ringNodes[i].x, ringNodes[i].y);
  }
  ctx.closePath();
  ctx.stroke();

  // Subtle interior fill
  ctx.fillStyle = 'rgba(2, 132, 199, 0.05)';
  ctx.fill();

  // Draw node atoms
  ringNodes.forEach((node) => {
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(node.x, node.y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    const textAngle = -Math.PI / 2 + ((node.index - 1) * 2 * Math.PI) / n;
    const labelX = centerX + (radius + 20) * Math.cos(textAngle);
    const labelY = centerY + (radius + 20) * Math.sin(textAngle) + 4;
    ctx.fillText(`C${node.index}`, labelX, labelY);
  });
}

// Helper: Polymer Repeating Unit Mode
function renderPolymerMode(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  polymer: PolymerData
) {
  const centerX = width / 2;
  const centerY = height / 2;

  // Bracket dimensions
  const bracketW = 260;
  const bracketH = 130;
  const leftX = centerX - bracketW / 2;
  const rightX = centerX + bracketW / 2;
  const topY = centerY - bracketH / 2;
  const bottomY = centerY + bracketH / 2;

  // Repeating Unit Backbone inside brackets
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(leftX - 35, centerY);
  ctx.lineTo(rightX + 35, centerY);
  ctx.stroke();

  // Dashed lines indicating chain extension to infinity
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 3;
  ctx.setLineDash([5, 4]);
  ctx.beginPath();
  ctx.moveTo(leftX - 70, centerY);
  ctx.lineTo(leftX - 35, centerY);
  ctx.moveTo(rightX + 35, centerY);
  ctx.lineTo(rightX + 70, centerY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Polymer Brackets [ ... ]
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2.5;

  // Left Bracket [
  ctx.beginPath();
  ctx.moveTo(leftX + 16, topY);
  ctx.lineTo(leftX, topY);
  ctx.lineTo(leftX, bottomY);
  ctx.lineTo(leftX + 16, bottomY);
  ctx.stroke();

  // Right Bracket ]
  ctx.beginPath();
  ctx.moveTo(rightX - 16, topY);
  ctx.lineTo(rightX, topY);
  ctx.lineTo(rightX, bottomY);
  ctx.lineTo(rightX - 16, bottomY);
  ctx.stroke();

  // Subscript 'n' for degree of polymerization
  ctx.fillStyle = '#0284c7';
  ctx.font = 'italic bold 24px var(--font-mono, monospace)';
  ctx.textAlign = 'left';
  ctx.fillText('n', rightX + 6, bottomY + 8);

  // Monomer Formula Label inside
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 20px var(--font-mono, monospace)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(polymer.repeatingUnit, centerX, centerY);

  // Header Subtitle
  ctx.fillStyle = '#64748b';
  ctx.font = '12px system-ui, sans-serif';
  ctx.fillText(`Monomer Pembentuk: ${polymer.monomerName} (${polymer.monomerFormula})`, centerX, bottomY + 36);
}
