/**
 * BioShelter Studio - 2D CAD Blueprint & Elevation Renderer
 * High-precision canvas engineering drawings with dimensions and annotations
 */

export class BlueprintRenderer {
  constructor(canvasId, stateStore) {
    this.canvas = document.getElementById(canvasId);
    this.store = stateStore;
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.viewMode = 'floorplan'; // floorplan, elevation, flow_schematic
    
    if (this.canvas) {
      this.init();
    }
  }

  init() {
    this.resizeCanvas();
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.render();
    });

    this.store.on('*', () => this.render());
    this.render();
  }

  setViewMode(mode) {
    this.viewMode = mode;
    this.render();
  }

  resizeCanvas() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = (rect.width || 600) * dpr;
    this.canvas.height = (rect.height || 400) * dpr;
    this.ctx.scale(dpr, dpr);
    this.displayWidth = rect.width || 600;
    this.displayHeight = rect.height || 400;
  }

  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.displayWidth;
    const h = this.displayHeight;

    // Clear background (Blueprint Navy / Dark Grid)
    ctx.fillStyle = '#06131c';
    ctx.fillRect(0, 0, w, h);

    // Draw Architectural Grid Lines
    this.drawCadGrid(ctx, w, h);

    if (this.viewMode === 'floorplan') {
      this.drawFloorPlan(ctx, w, h);
    } else if (this.viewMode === 'elevation') {
      this.drawElevation(ctx, w, h);
    } else {
      this.drawFlowSchematic(ctx, w, h);
    }

    // Draw Blueprint Title Block (CAD border stamp)
    this.drawTitleBlock(ctx, w, h);
  }

  drawCadGrid(ctx, w, h) {
    const gridSize = 25;
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = 'rgba(14, 116, 144, 0.25)';

    ctx.beginPath();
    for (let x = 0; x < w; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
    }
    for (let y = 0; y < h; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    ctx.stroke();

    // Major grid lines
    ctx.strokeStyle = 'rgba(14, 116, 144, 0.45)';
    ctx.beginPath();
    for (let x = 0; x < w; x += gridSize * 4) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
    }
    for (let y = 0; y < h; y += gridSize * 4) {
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    ctx.stroke();
  }

  drawFloorPlan(ctx, w, h) {
    const state = this.store.getState();
    const metrics = this.store.getCalculatedMetrics();
    const cx = w / 2;
    const cy = h / 2 - 15;
    const scale = (Math.min(w, h) * 0.65) / (state.diameter * 1.3);
    const r = (state.diameter / 2) * scale;

    ctx.save();

    // 1. Perimeter Shell (Geodesic / Circular or Rectangular)
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2.5;
    ctx.fillStyle = 'rgba(6, 182, 212, 0.04)';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 2. North High-Insulation Berm Wall (Thick hatched border)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(cx, cy, r + 2, Math.PI * 0.8, Math.PI * 2.2);
    ctx.stroke();

    // 3. Thermal Mass Water Wall (Stacked cylinders along North Arc)
    ctx.fillStyle = '#0284c7';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1;
    const drumCount = 12;
    for (let i = 0; i < drumCount; i++) {
      const angle = Math.PI * 0.85 + (i / (drumCount - 1)) * (Math.PI * 0.3);
      const dx = cx + Math.cos(angle) * (r * 0.82);
      const dy = cy + Math.sin(angle) * (r * 0.82);
      ctx.beginPath();
      ctx.arc(dx, dy, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // 4. Central Aquaponics Fish Tank
    ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy - r * 0.15, r * 0.28, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Text Label inside tank
    ctx.fillStyle = '#10b981';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('AQUACULTURE TANK', cx, cy - r * 0.15 - 4);
    ctx.fillText(`${state.aquaponicsVolumeM3} m³ (${Math.round(state.aquaponicsVolumeM3 * 264)} gal)`, cx, cy - r * 0.15 + 10);

    // 5. Living Soil & DWC Growing Beds
    ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;

    // West Bed
    ctx.beginPath();
    ctx.roundRect(cx - r * 0.75, cy + r * 0.1, r * 0.55, r * 0.45, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('POLY-GROW BED A', cx - r * 0.48, cy + r * 0.32);

    // East Bed
    ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
    ctx.beginPath();
    ctx.roundRect(cx + r * 0.2, cy + r * 0.1, r * 0.55, r * 0.45, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('DWC HYDROPONIC B', cx + r * 0.48, cy + r * 0.32);

    // 6. Airlock Entry Vestibule (South entry)
    ctx.strokeStyle = '#94a3b8';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.1)';
    ctx.beginPath();
    ctx.rect(cx - 20, cy + r - 8, 40, 24);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('AIRLOCK ENTRY', cx, cy + r + 26);

    // 7. Dimension Lines
    this.drawDimensionLine(ctx, cx - r, cy - r - 25, cx + r, cy - r - 25, `Ø ${state.diameter}m (${Math.round(state.diameter * 3.28)} ft)`);
    this.drawDimensionLine(ctx, cx + r + 25, cy - r, cx + r + 25, cy + r, `SPAN ${state.diameter}m`);

    // North Arrow Compass
    this.drawNorthArrow(ctx, cx - r - 35, cy - r);

    ctx.restore();
  }

  drawElevation(ctx, w, h) {
    const state = this.store.getState();
    const cx = w / 2;
    const groundY = h * 0.68;
    const scale = (w * 0.65) / (state.diameter * 1.3);
    const r = (state.diameter / 2) * scale;
    const archH = state.height * scale;

    ctx.save();

    // Ground line
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, groundY);
    ctx.lineTo(w - 40, groundY);
    ctx.stroke();

    // Earth hatching below ground
    ctx.fillStyle = 'rgba(51, 65, 85, 0.25)';
    ctx.fillRect(40, groundY, w - 80, h - groundY - 30);

    // Subterranean GAHT Earth Tubes
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 3;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.8, groundY + 35);
    ctx.bezierCurveTo(cx - r * 0.4, groundY + 45, cx + r * 0.4, groundY + 45, cx + r * 0.8, groundY + 35);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#38bdf8';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillText('GAHT SUBTERRANEAN TUBES (2.0m DEPTH)', cx, groundY + 55);

    // Dome Profile Elevation
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2.5;
    ctx.fillStyle = 'rgba(6, 182, 212, 0.08)';
    ctx.beginPath();
    ctx.arc(cx, groundY, r, Math.PI, 0);
    ctx.fill();
    ctx.stroke();

    // Glazing Struts
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1;
    for (let a = Math.PI * 0.15; a < Math.PI; a += Math.PI * 0.15) {
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * r, groundY - Math.sin(a) * r);
      ctx.lineTo(cx, groundY);
      ctx.stroke();
    }

    // Solar Angle Rays (Winter Solstice 22° vs Summer Solstice 68°)
    this.drawSolarRay(ctx, cx, groundY - archH * 0.5, 23, '#f59e0b', 'WINTER SOLSTICE (23° Low Solar Ingress)');
    this.drawSolarRay(ctx, cx, groundY - archH * 0.5, 68, '#ef4444', 'SUMMER SOLSTICE (68° Overhang Shaded)');

    // Dimension lines
    this.drawDimensionLine(ctx, cx + r + 20, groundY, cx + r + 20, groundY - archH, `H = ${state.height}m`);

    ctx.restore();
  }

  drawFlowSchematic(ctx, w, h) {
    const cx = w / 2;
    const cy = h / 2;

    ctx.save();
    ctx.font = '12px JetBrains Mono, monospace';
    ctx.textAlign = 'center';

    // Aquaponics Loop Diagram
    const nodes = [
      { label: 'FISH TANK\n(NH3 + Solids)', x: cx - 180, y: cy - 60, color: '#0284c7' },
      { label: 'SOLIDS FILTER\n(Swirl Separator)', x: cx - 60, y: cy - 120, color: '#64748b' },
      { label: 'BIO-FILTER\n(NO2 -> NO3)', x: cx + 60, y: cy - 120, color: '#10b981' },
      { label: 'GROW BEDS\n(Plant Uptake)', x: cx + 180, y: cy - 60, color: '#f59e0b' },
      { label: 'SUMP TANK &\nGAHT RETURN', x: cx, y: cy + 70, color: '#06b6d4' }
    ];

    nodes.forEach(n => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
      ctx.strokeStyle = n.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(n.x - 65, n.y - 25, 130, 50, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f8fafc';
      const lines = n.label.split('\n');
      ctx.fillText(lines[0], n.x, n.y - 3);
      if (lines[1]) {
        ctx.fillStyle = n.color;
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillText(lines[1], n.x, n.y + 13);
        ctx.font = '12px JetBrains Mono, monospace';
      }
    });

    // Connecting animated flow lines
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    // Tank to Solids
    this.drawArrow(ctx, cx - 120, cy - 60, cx - 110, cy - 100);
    // Solids to Bio
    this.drawArrow(ctx, 0, cy - 120, 0, cy - 120);
    // Bio to Grow Beds
    this.drawArrow(ctx, 110, cy - 100, 120, cy - 60);
    // Beds to Sump
    this.drawArrow(ctx, cx + 150, cy - 10, cx + 50, cy + 50);
    // Sump to Tank
    this.drawArrow(ctx, cx - 50, cy + 50, cx - 150, cy - 10);

    ctx.setLineDash([]);
    ctx.restore();
  }

  drawSolarRay(ctx, targetX, targetY, angleDeg, color, label) {
    const rad = (angleDeg * Math.PI) / 180;
    const len = 160;
    const startX = targetX - Math.cos(rad) * len;
    const startY = targetY - Math.sin(rad) * len;

    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(targetX, targetY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = color;
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.textAlign = 'right';
    ctx.fillText(label, startX - 8, startY);
  }

  drawDimensionLine(ctx, x1, y1, x2, y2, text) {
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Arrows / Ticks
    ctx.beginPath();
    ctx.arc(x1, y1, 2.5, 0, Math.PI * 2);
    ctx.arc(x2, y2, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = '#94a3b8';
    ctx.fill();

    // Text Label
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    ctx.fillStyle = '#f1f5f9';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(text, midX, midY - 6);
  }

  drawNorthArrow(ctx, x, y) {
    ctx.fillStyle = '#38bdf8';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(x, y - 18);
    ctx.lineTo(x - 6, y + 6);
    ctx.lineTo(x, y + 2);
    ctx.lineTo(x + 6, y + 6);
    ctx.closePath();
    ctx.fill();

    ctx.font = '10px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('TRUE N', x, y - 22);
  }

  drawTitleBlock(ctx, w, h) {
    const state = this.store.getState();
    const metrics = this.store.getCalculatedMetrics();
    
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.5)';
    ctx.lineWidth = 1;
    
    const bx = w - 240;
    const by = h - 75;
    ctx.fillRect(bx, by, 230, 65);
    ctx.strokeRect(bx, by, 230, 65);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 11px Outfit, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(state.projectName.toUpperCase(), bx + 10, by + 18);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px JetBrains Mono, monospace';
    ctx.fillText(`TYPE: ${state.structureType.toUpperCase()} | GLZ: ${state.glazingType.toUpperCase()}`, bx + 10, by + 32);
    ctx.fillText(`AREA: ${metrics.floorArea}m² | VOL: ${metrics.volumeM3}m³`, bx + 10, by + 45);
    ctx.fillText(`DWG NO: BSS-2026-ARCH-01 | SCALE: 1:100`, bx + 10, by + 58);

    ctx.restore();
  }

  drawArrow(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}
