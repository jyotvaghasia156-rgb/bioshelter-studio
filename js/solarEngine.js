/**
 * BioShelter Studio - Solar Radiation & Sun-Path Geometry Engine
 * Handles real-time Google/Open-Meteo satellite solar flux queries,
 * astronomical clear-sky calculations, and animated HTML5 Canvas solar meters.
 */

export class SolarEngine {
    constructor() {
        this.cache = new Map();
        this.currentProfile = null;
    }

    /**
     * Fetches live solar radiation telemetry for any location
     */
    async fetchSolarRadiation(lat, lng, locationName = 'Selected Coordinate') {
        const cacheKey = `${Number(lat).toFixed(3)}_${Number(lng).toFixed(3)}`;
        if (this.cache.has(cacheKey)) {
            this.currentProfile = this.cache.get(cacheKey);
            return this.currentProfile;
        }

        try {
            const res = await fetch(`/api/solar/radiation?lat=${lat}&lng=${lng}&name=${encodeURIComponent(locationName)}`);
            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    this.cache.set(cacheKey, data);
                    this.currentProfile = data;
                    return data;
                }
            }
        } catch (e) {
            console.warn('[SolarEngine] Backend fetch failed, computing client-side fallback:', e);
        }

        // Client-side fallback computation
        const fallback = this.computeLocalSolarProfile(lat, lng, locationName);
        this.cache.set(cacheKey, fallback);
        this.currentProfile = fallback;
        return fallback;
    }

    /**
     * Search location by city query string
     */
    async queryCitySolar(queryStr) {
        try {
            const res = await fetch(`/api/solar/radiation?q=${encodeURIComponent(queryStr)}`);
            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    this.currentProfile = data;
                    return data;
                }
            }
        } catch (e) {
            console.warn('[SolarEngine] City search query failed:', e);
        }
        return this.computeLocalSolarProfile(26.9157, 70.9083, queryStr);
    }

    /**
     * Fetches top global solar observatory stations
     */
    async fetchSolarStations() {
        try {
            const res = await fetch('/api/solar/stations');
            if (res.ok) {
                const data = await res.json();
                if (data.success) return data.stations;
            }
        } catch (e) {
            console.warn('[SolarEngine] Fetching stations failed:', e);
        }
        return [
            { id: 'sol_thar', name: 'Thar Desert (Jaisalmer)', country: 'India', lat: 26.9157, lng: 70.9083, annualFluxKwhM2: 2350, badge: 'Hyper-Arid' },
            { id: 'sol_death_valley', name: 'Furnace Creek / Death Valley', country: 'USA', lat: 36.4614, lng: -116.8656, annualFluxKwhM2: 2420, badge: 'Lethal Heat Sink' },
            { id: 'sol_sahara', name: 'Aswan Solar Plateau', country: 'Egypt', lat: 24.0889, lng: 32.8998, annualFluxKwhM2: 2580, badge: 'Peak GHI' },
            { id: 'sol_ladakh', name: 'Leh Ladakh Plateau', country: 'India', lat: 34.1526, lng: 77.5771, annualFluxKwhM2: 2100, badge: 'Alpine Solar' },
            { id: 'sol_singapore', name: 'Singapore Equatorial', country: 'Singapore', lat: 1.3521, lng: 103.8198, annualFluxKwhM2: 1750, badge: 'Equator' }
        ];
    }

    /**
     * Client-side astronomical solar geometry and clear-sky irradiance
     */
    computeLocalSolarProfile(lat, lng, locationName) {
        lat = Number(lat);
        lng = Number(lng);
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
        const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        const declinationRad = (23.45 * Math.PI / 180.0) * Math.sin((360.0 / 365.0 * (284 + dayOfYear)) * Math.PI / 180.0);
        const latRad = lat * Math.PI / 180.0;
        const solarTimeHr = (now.getUTCHours() + now.getUTCMinutes() / 60.0 + lng / 15.0 + 24.0) % 24.0;
        const hourAngleRad = (15.0 * (solarTimeHr - 12.0)) * Math.PI / 180.0;

        const cosZenith = Math.sin(latRad) * Math.sin(declinationRad) + Math.cos(latRad) * Math.cos(declinationRad) * Math.cos(hourAngleRad);
        const zenithRad = Math.acos(Math.max(-1.0, Math.min(1.0, cosZenith)));
        const altitudeDeg = Math.max(0.0, 90.0 - (zenithRad * 180.0 / Math.PI));
        const gon = 1367.0 * (1.0 + 0.033 * Math.cos(360.0 * dayOfYear / 365.0 * Math.PI / 180.0));
        
        const am = altitudeDeg > 0.5 ? Math.min(38.0, 1.0 / (Math.max(0.01, cosZenith) + 0.50572 * Math.pow(Math.max(0.1, 96.07995 - (zenithRad * 180.0 / Math.PI)), -1.6364))) : 38.0;
        const isDay = altitudeDeg > 0.0;
        const dni = isDay ? Math.min(1100.0, Math.max(0.0, gon * Math.pow(0.7, Math.pow(Math.max(1.0, am), 0.678)))) : 0.0;
        const dhi = isDay ? Math.max(0.0, 0.18 * gon * Math.max(0.0, cosZenith)) : 0.0;
        const ghi = isDay ? (dni * Math.max(0.0, cosZenith) + dhi) : 0.0;
        const uv = Math.max(0.0, Math.round((ghi / 85.0) * 10) / 10);
        const tempC = Math.round((28.0 + 8.0 * Math.sin((solarTimeHr - 8) * 15.0 * Math.PI / 180.0)) * 10) / 10;

        const hourly = [];
        for (let h = 0; h < 24; h++) {
            const hSolar = (h + lng / 15.0 + 24.0) % 24.0;
            const hHa = (15.0 * (hSolar - 12.0)) * Math.PI / 180.0;
            const hCosZ = Math.max(0.0, Math.sin(latRad) * Math.sin(declinationRad) + Math.cos(latRad) * Math.cos(declinationRad) * Math.cos(hHa));
            const hDni = hCosZ > 0.02 ? Math.min(1100.0, Math.max(0.0, gon * Math.pow(0.7, Math.pow(Math.max(1.0, 1.0 / hCosZ), 0.678)))) : 0;
            const hDhi = hCosZ > 0.02 ? 0.18 * gon * hCosZ : 0;
            const hGhi = hDni * hCosZ + hDhi;
            hourly.push({
                hour: `${h.toString().padStart(2, '0')}:00`,
                hourInt: h,
                ghi: Math.round(hGhi * 10) / 10,
                dni: Math.round(hDni * 10) / 10,
                dhi: Math.round(hDhi * 10) / 10,
                tempC: Math.round((tempC - 6.0 + 12.0 * Math.sin((h - 6) * 15.0 * Math.PI / 180.0)) * 10) / 10,
                uvIndex: Math.round((hGhi / 85.0) * 10) / 10
            });
        }

        const totalDailyKwh = Math.round((hourly.reduce((a, b) => a + b.ghi, 0) / 1000.0) * 100) / 100;
        const pvYield5kw = Math.round(totalDailyKwh * 25.0 * 0.20 * 0.82 * 10) / 10;
        const soilOffset = Math.round(Math.min(18.5, 0.014 * ghi) * 10) / 10;

        return {
            success: true,
            location: {
                name: locationName,
                latitude: Math.round(lat * 1000) / 1000,
                longitude: Math.round(lng * 1000) / 1000,
                localSolarTime: `${Math.floor(solarTimeHr).toString().padStart(2, '0')}:${Math.floor((solarTimeHr % 1) * 60).toString().padStart(2, '0')}`
            },
            telemetry: {
                ghi: Math.round(ghi * 10) / 10,
                dni: Math.round(dni * 10) / 10,
                dhi: Math.round(dhi * 10) / 10,
                uvIndex: uv,
                uvRiskLevel: uv >= 11 ? 'Extreme (11+)' : (uv >= 8 ? 'Very High (8-10)' : (uv >= 6 ? 'High (6-7)' : (uv >= 3 ? 'Moderate (3-5)' : 'Low (0-2)'))),
                ambientTempC: tempC,
                humidityPct: Math.round(Math.max(20.0, 60.0 - 25.0 * (ghi / 1000.0))),
                isDaylight: isDay,
                source: 'Analytical Solar Model',
                timestamp: now.toISOString()
            },
            solarGeometry: {
                solarAltitudeDeg: Math.round(altitudeDeg * 10) / 10,
                solarZenithDeg: Math.round((zenithRad * 180.0 / Math.PI) * 10) / 10,
                airMass: Math.round(am * 100) / 100,
                optimalPvTiltDeg: Math.round(Math.abs(lat) * 0.9 * 10) / 10,
                optimalOrientation: lat >= 0 ? 'True South (180° Azimuth)' : 'True North (0° Azimuth)'
            },
            energyAndArchitecture: {
                dailyInsolationKwhPerM2: totalDailyKwh,
                pvDailyHarvest5kwKwh: pvYield5kw,
                soilThermalDampingDeltaC: soilOffset,
                recommendedEavesDepthM: Math.round(Math.max(0.45, Math.min(1.5, Math.tan(Math.max(15.0, 90.0 - altitudeDeg) * Math.PI / 180.0) * 0.45)) * 100) / 100,
                coolingLoadReductionPct: Math.round(Math.min(65.0, 15.0 + soilOffset * 2.8) * 10) / 10,
                radiationGaugePercent: Math.round(Math.min(100.0, (ghi / 1200.0) * 100.0) * 10) / 10
            },
            hourlyProfile: hourly
        };
    }

    /**
     * Draws an ultra-premium animated Radial Solar Irradiance Meter on an HTML5 canvas
     */
    renderSolarGaugeCanvas(canvas, ghi = 0, dni = 0, maxGhi = 1200, timeSec = 0) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Auto-detect and sync canvas dimensions
        const width = canvas.width || 440;
        const height = canvas.height || 260;
        const centerX = width / 2;
        const centerY = height * 0.68;
        const radius = Math.min(width * 0.38, height * 0.48);

        ctx.clearRect(0, 0, width, height);

        // 1. Sleek Background Gauge Dial Plate
        const bgGrad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, radius + 30);
        bgGrad.addColorStop(0, 'rgba(245, 158, 11, 0.08)');
        bgGrad.addColorStop(0.7, 'rgba(15, 23, 42, 0.4)');
        bgGrad.addColorStop(1, 'rgba(10, 15, 30, 0)');
        ctx.fillStyle = bgGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + 25, 0, Math.PI * 2);
        ctx.fill();

        const startAngle = Math.PI * 0.8;
        const endAngle = Math.PI * 2.2;
        const totalAngle = endAngle - startAngle;

        // 2. Background Track Arc
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.10)';
        ctx.lineWidth = 16;
        ctx.lineCap = 'round';
        ctx.stroke();

        // 3. Active Glowing Gradient Solar Arc
        const fillFraction = Math.max(0, Math.min(1.0, ghi / maxGhi));
        const currentAngle = startAngle + fillFraction * totalAngle;

        if (fillFraction > 0.005) {
            const grad = ctx.createLinearGradient(centerX - radius, centerY, centerX + radius, centerY);
            grad.addColorStop(0.0, '#10b981');  // Low (Green)
            grad.addColorStop(0.35, '#38bdf8'); // Mild (Sky Blue)
            grad.addColorStop(0.65, '#f59e0b'); // High (Amber)
            grad.addColorStop(1.0, '#ef4444');  // Extreme (Crimson)

            ctx.save();
            ctx.shadowColor = ghi > 800 ? '#ef4444' : '#f59e0b';
            ctx.shadowBlur = 16;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, startAngle, currentAngle);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 16;
            ctx.lineCap = 'round';
            ctx.stroke();
            ctx.restore();
        }

        // 4. Tick Marks and Labels (0, 300, 600, 900, 1200 W/m²)
        const ticks = [0, 300, 600, 900, 1200];
        ticks.forEach(val => {
            const tickFraction = val / maxGhi;
            const tickAngle = startAngle + tickFraction * totalAngle;
            const x1 = centerX + Math.cos(tickAngle) * (radius - 12);
            const y1 = centerY + Math.sin(tickAngle) * (radius - 12);
            const x2 = centerX + Math.cos(tickAngle) * (radius + 12);
            const y2 = centerY + Math.sin(tickAngle) * (radius + 12);

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Label
            const tx = centerX + Math.cos(tickAngle) * (radius - 26);
            const ty = centerY + Math.sin(tickAngle) * (radius - 26);
            ctx.fillStyle = '#94a3b8';
            ctx.font = 'bold 10px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${val}`, tx, ty);
        });

        // 5. Center Needle Pointer
        const needleAngle = startAngle + fillFraction * totalAngle;
        const needleLen = radius - 14;
        const tipX = centerX + Math.cos(needleAngle) * needleLen;
        const tipY = centerY + Math.sin(needleAngle) * needleLen;

        ctx.save();
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(tipX, tipY);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.restore();

        // 6. Center Rotating Corona Pulse
        const t = timeSec || (Date.now() / 1000);
        const pulse = 1.0 + Math.sin(t * 3.0) * 0.15;
        ctx.save();
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 14 * pulse;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 9 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = '#f59e0b';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();

        // 7. Central Numeric Reading
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${Math.round(ghi)} W/m²`, centerX, centerY + 34);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px sans-serif';
        ctx.fillText(`Direct Beam DNI: ${Math.round(dni)} W/m²`, centerX, centerY + 52);
    }

    /**
     * Draws Sun Position Solar Azimuth and Altitude Compass with animated solar corona
     */
    renderSunCompassCanvas(canvas, altitudeDeg = 45, azimuthDeg = 180, timeSec = 0) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width || 320;
        const height = canvas.height || 260;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.40;

        ctx.clearRect(0, 0, width, height);

        // 1. Celestial Rose Dome Background
        const grad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, radius);
        grad.addColorStop(0, 'rgba(14, 30, 24, 0.9)');
        grad.addColorStop(1, 'rgba(6, 15, 12, 0.95)');
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Concentric Altitude Rings (30° & 60°)
        [0.66, 0.33].forEach(ratio => {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius * ratio, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
            ctx.setLineDash([3, 3]);
            ctx.stroke();
            ctx.setLineDash([]);
        });

        // Cardinal Directions
        const cardinals = [
            { text: 'N', angle: -Math.PI / 2 },
            { text: 'E', angle: 0 },
            { text: 'S', angle: Math.PI / 2 },
            { text: 'W', angle: Math.PI }
        ];
        cardinals.forEach(c => {
            const x = centerX + Math.cos(c.angle) * (radius - 12);
            const y = centerY + Math.sin(c.angle) * (radius - 12);
            ctx.fillStyle = c.text === 'S' ? '#f59e0b' : '#94a3b8';
            ctx.font = 'bold 11px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(c.text, x, y);
        });

        // 2. Sun Position Heading & Ray
        const azRad = ((azimuthDeg - 90) * Math.PI) / 180.0;
        const altRatio = Math.max(0.08, Math.min(0.95, (90.0 - altitudeDeg) / 90.0));
        const sunRadius = radius * altRatio;
        const sunX = centerX + Math.cos(azRad) * sunRadius;
        const sunY = centerY + Math.sin(azRad) * sunRadius;

        // Solar Vector Line
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(sunX, sunY);
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.65)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Animated Sun Orb & Corona
        const t = timeSec || (Date.now() / 1000);
        const sunPulse = 1.0 + Math.sin(t * 4.0) * 0.18;

        ctx.save();
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 16 * sunPulse;
        ctx.beginPath();
        ctx.arc(sunX, sunY, 8 * sunPulse, 0, Math.PI * 2);
        ctx.fillStyle = '#f59e0b';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();

        // 3. Center Zenith Crosshair
        ctx.beginPath();
        ctx.arc(centerX, centerY, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#38bdf8';
        ctx.fill();
    }
}

export const solarEngine = new SolarEngine();
