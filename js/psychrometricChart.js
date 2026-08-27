/**
 * BioShelter Studio - Psychrometric & Bioclimatic Givoni Chart Canvas Engine
 * Mathematically derived psychrometric curves and bioclimatic comfort zone overlays.
 */

export class PsychrometricBioclimaticChart {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.ctx = canvasElement.getContext('2d');
        this.simulationData = null;
        this.climateData = null;

        // Chart coordinate domain
        this.tMin = -5; // °C Dry Bulb
        this.tMax = 50; // °C
        this.wMin = 0;  // g/kg dry air (Humidity Ratio)
        this.wMax = 32; // g/kg
        this.padding = { top: 40, right: 60, bottom: 50, left: 60 };
        this.isDark = true;

        this.initEvents();
    }

    setTheme(isDark) {
        this.isDark = isDark;
        this.render();
    }

    initEvents() {
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }

    // Psychrometric saturation humidity ratio formula at 101.325 kPa (standard sea-level pressure)
    getSaturationHumidityRatio(tC) {
        // Tetens equation for saturation vapor pressure P_sat in kPa
        const pSat = 0.61078 * Math.exp((17.27 * tC) / (tC + 237.3));
        const pAtm = 101.325; // kPa
        // Humidity ratio W = 0.622 * (p_v / (p_atm - p_v)) in kg/kg -> * 1000 for g/kg
        const wKg = 0.622 * (pSat / (pAtm - pSat));
        return Math.max(0, wKg * 1000);
    }

    getHumidityRatio(tC, rhPercent) {
        const pSat = 0.61078 * Math.exp((17.27 * tC) / (tC + 237.3));
        const pV = (rhPercent / 100) * pSat;
        const pAtm = 101.325;
        if (pAtm - pV <= 0) return 35;
        const wKg = 0.622 * (pV / (pAtm - pV));
        return Math.max(0, wKg * 1000);
    }

    toScreenX(tC) {
        const plotW = this.canvas.width - this.padding.left - this.padding.right;
        return this.padding.left + ((tC - this.tMin) / (this.tMax - this.tMin)) * plotW;
    }

    toScreenY(wGKg) {
        const plotH = this.canvas.height - this.padding.top - this.padding.bottom;
        return this.canvas.height - this.padding.bottom - ((wGKg - this.wMin) / (this.wMax - this.wMin)) * plotH;
    }

    fromScreenX(x) {
        const plotW = this.canvas.width - this.padding.left - this.padding.right;
        return this.tMin + ((x - this.padding.left) / plotW) * (this.tMax - this.tMin);
    }

    fromScreenY(y) {
        const plotH = this.canvas.height - this.padding.top - this.padding.bottom;
        return this.wMin + ((this.canvas.height - this.padding.bottom - y) / plotH) * (this.wMax - this.wMin);
    }

    setData(climateData, simulationData) {
        this.climateData = climateData;
        this.simulationData = simulationData;
        this.render();
    }

    render() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;

        ctx.clearRect(0, 0, width, height);

        // Blueprint background according to theme
        ctx.fillStyle = this.isDark ? '#0b1329' : '#f8fafc';
        ctx.fillRect(0, 0, width, height);

        // Draw Bioclimatic Strategy Zones
        this.drawBioclimaticZones();

        // Draw Psychrometric Grid & RH curves
        this.drawPsychrometricCurves();

        // Draw Axes & Labels
        this.drawAxes();

        // Plot Diurnal Trajectories
        if (this.climateData && this.simulationData) {
            this.drawDiurnalCurves();
        }
    }

    drawBioclimaticZones() {
        const ctx = this.ctx;

        // 1. Passive Solar Heating Zone (12°C to 20°C, low RH)
        this.drawPolygonZone([
            { t: 10, w: 2 }, { t: 20, w: 2 }, { t: 20, w: 10 }, { t: 12, w: 7 }
        ], 'rgba(239, 68, 68, 0.12)', 'rgba(239, 68, 68, 0.4)', 'Passive Solar Heating');

        // 2. High Thermal Mass & Night Ventilation Zone (20°C to 38°C, W < 12 g/kg)
        this.drawPolygonZone([
            { t: 20, w: 4 }, { t: 38, w: 4 }, { t: 32, w: 12 }, { t: 22, w: 12 }
        ], 'rgba(245, 158, 11, 0.12)', 'rgba(245, 158, 11, 0.4)', 'Thermal Mass / Night Purge');

        // 3. Evaporative Cooling Zone (24°C to 42°C, dry air W < 8 g/kg)
        this.drawPolygonZone([
            { t: 26, w: 1 }, { t: 42, w: 1 }, { t: 30, w: 8 }, { t: 24, w: 8 }
        ], 'rgba(168, 85, 247, 0.12)', 'rgba(168, 85, 247, 0.4)', 'Evaporative Cooling');

        // 4. Natural Ventilation Zone (22°C to 32°C, moderate to high humidity)
        this.drawPolygonZone([
            { t: 22, w: 6 }, { t: 32, w: 8 }, { t: 30, w: 17 }, { t: 22, w: 14 }
        ], 'rgba(56, 189, 248, 0.15)', 'rgba(56, 189, 248, 0.5)', 'Natural Ventilation (0.5-1.5 m/s)');

        // 5. Base Comfort Zone (ASHRAE 55: 20°C - 26°C, RH 30% - 70%, W 4 - 12 g/kg)
        this.drawPolygonZone([
            { t: 20.5, w: 4.5 }, { t: 26.5, w: 5.5 }, { t: 26.0, w: 12.0 }, { t: 20.0, w: 10.5 }
        ], 'rgba(16, 185, 129, 0.28)', 'rgba(16, 185, 129, 0.85)', 'ASHRAE Comfort Zone');
    }

    drawPolygonZone(points, fillStyle, strokeStyle, label) {
        const ctx = this.ctx;
        ctx.beginPath();
        points.forEach((p, idx) => {
            const sx = this.toScreenX(p.t);
            const sy = this.toScreenY(p.w);
            if (idx === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
        });
        ctx.closePath();
        ctx.fillStyle = fillStyle;
        ctx.fill();
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Zone label
        const centerT = points.reduce((acc, p) => acc + p.t, 0) / points.length;
        const centerW = points.reduce((acc, p) => acc + p.w, 0) / points.length;
        ctx.fillStyle = strokeStyle;
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(label, this.toScreenX(centerT), this.toScreenY(centerW));
    }

    drawPsychrometricCurves() {
        const ctx = this.ctx;

        // Relative Humidity Curves (10%, 20%, 40%, 60%, 80%, 100%)
        const rhList = [10, 20, 40, 60, 80, 100];
        rhList.forEach(rh => {
            ctx.beginPath();
            let first = true;
            for (let t = this.tMin; t <= this.tMax; t += 0.5) {
                const w = this.getHumidityRatio(t, rh);
                if (w > this.wMax) break;

                const sx = this.toScreenX(t);
                const sy = this.toScreenY(w);
                if (first) {
                    ctx.moveTo(sx, sy);
                    first = false;
                } else {
                    ctx.lineTo(sx, sy);
                }
            }
            ctx.strokeStyle = (rh === 100) ? 'rgba(56, 189, 248, 0.8)' : 'rgba(100, 116, 139, 0.35)';
            ctx.lineWidth = (rh === 100) ? 2 : 1;
            ctx.stroke();

            // RH Label on curve
            const labelT = (rh === 100) ? 22 : (rh === 60 ? 30 : 40);
            const labelW = this.getHumidityRatio(labelT, rh);
            if (labelW <= this.wMax) {
                ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
                ctx.font = '9px monospace';
                ctx.textAlign = 'left';
                ctx.fillText(`${rh}% RH`, this.toScreenX(labelT) + 4, this.toScreenY(labelW) - 3);
            }
        });
    }

    drawAxes() {
        const ctx = this.ctx;
        const p = this.padding;
        const w = this.canvas.width;
        const h = this.canvas.height;

        const axisColor = this.isDark ? '#475569' : '#94a3b8';
        const gridColor = this.isDark ? '#334155' : '#e2e8f0';
        const textColor = this.isDark ? '#94a3b8' : '#475569';
        const titleColor = this.isDark ? '#f8fafc' : '#0f172a';

        // Axis Lines
        ctx.strokeStyle = axisColor;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        // X axis (Bottom)
        ctx.moveTo(p.left, h - p.bottom);
        ctx.lineTo(w - p.right, h - p.bottom);
        // Y axis (Right - Humidity Ratio)
        ctx.moveTo(w - p.right, h - p.bottom);
        ctx.lineTo(w - p.right, p.top);
        // Left boundary
        ctx.moveTo(p.left, h - p.bottom);
        ctx.lineTo(p.left, p.top);
        ctx.stroke();

        // X-axis ticks (Dry Bulb Temp °C)
        ctx.fillStyle = textColor;
        ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = 'center';
        for (let t = 0; t <= 50; t += 5) {
            const sx = this.toScreenX(t);
            const sy = h - p.bottom;

            ctx.strokeStyle = gridColor;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(sx, p.top);
            ctx.stroke();

            ctx.fillText(`${t}°C`, sx, sy + 18);
        }

        // Y-axis ticks (Humidity Ratio g/kg)
        ctx.textAlign = 'left';
        for (let wg = 0; wg <= 30; wg += 5) {
            const sy = this.toScreenY(wg);
            const sx = w - p.right;

            ctx.strokeStyle = gridColor;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.left, sy);
            ctx.lineTo(sx, sy);
            ctx.stroke();

            ctx.fillText(`${wg}`, sx + 8, sy + 4);
        }

        // Axis Titles
        ctx.fillStyle = this.isDark ? '#38bdf8' : '#0284c7';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Dry-Bulb Temperature (°C) [ASHRAE 55 Standard Atmospheric Pressure 101.325 kPa]', w / 2, h - 12);

        ctx.save();
        ctx.translate(w - 15, h / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Humidity Ratio W (g/kg dry air)', 0, 0);
        ctx.restore();

        // Chart Title & Legend
        ctx.fillStyle = titleColor;
        ctx.font = 'bold 13px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Bioclimatic Givoni Psychrometric Analysis', p.left, p.top - 15);
    }

    drawDiurnalCurves() {
        const ctx = this.ctx;
        const hourlyWeather = this.climateData.hourly;
        const hourlySim = this.simulationData.hourly;

        // 1. Draw Outdoor Diurnal Loop (Amber Dashed)
        ctx.beginPath();
        hourlyWeather.forEach((w, idx) => {
            const wg = this.getHumidityRatio(w.ambientTemp, w.relativeHumidity);
            const sx = this.toScreenX(w.ambientTemp);
            const sy = this.toScreenY(wg);
            if (idx === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
        });
        ctx.closePath();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // 2. Draw Indoor Operative Diurnal Loop (Solid Emerald/Cyan)
        ctx.beginPath();
        hourlySim.forEach((sim, idx) => {
            const wOut = hourlyWeather[idx];
            // Indoor moisture ratio (assuming constant absolute moisture + occupancy buffering)
            const wg = this.getHumidityRatio(wOut.ambientTemp, wOut.relativeHumidity) + 0.8;
            const sx = this.toScreenX(sim.operativeTemp);
            const sy = this.toScreenY(wg);
            if (idx === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
        });
        ctx.closePath();
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.stroke();

        // 3. Draw Hourly node dots
        hourlySim.forEach((sim, idx) => {
            const wOut = hourlyWeather[idx];
            const wg = this.getHumidityRatio(wOut.ambientTemp, wOut.relativeHumidity) + 0.8;
            const sx = this.toScreenX(sim.operativeTemp);
            const sy = this.toScreenY(wg);

            ctx.fillStyle = (idx === 14) ? '#ef4444' : (idx === 5 ? '#38bdf8' : '#10b981');
            ctx.beginPath();
            ctx.arc(sx, sy, (idx === 14 || idx === 5) ? 5 : 3.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Label key hours: 05:00 (Min), 14:00 (Max)
            if (idx === 14 || idx === 5) {
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 10px monospace';
                ctx.textAlign = 'center';
                ctx.fillText(${idx}:00, sx, sy - 8);
            }
        });

        // Legend Overlay
        const legX = this.padding.left + 15;
        const legY = this.padding.top + 15;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(legX - 8, legY - 8, 220, 60);
        ctx.strokeStyle = '#334155';
        ctx.strokeRect(legX - 8, legY - 8, 220, 60);

        // Outdoor legend line
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(legX, legY + 8);
        ctx.lineTo(legX + 25, legY + 8);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#f59e0b';
        ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Outdoor 24h State Loop', legX + 32, legY + 12);

        // Indoor legend line
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(legX, legY + 30);
        ctx.lineTo(legX + 25, legY + 30);
        ctx.stroke();
        ctx.fillStyle = '#10b981';
        ctx.fillText('Indoor Shelter Operative Loop', legX + 32, legY + 34);
    }

    handleMouseMove(e) {
        // Optional interactive tooltip hover
    }
}
