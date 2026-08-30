/**
 * BioShelter Studio - Real-Time 1-Second Live Wind Speed & Aerodynamics Engine
 * Streams continuous 1-second real-time wind telemetry from Google/Open-Meteo satellite feeds
 * and renders animated spinning cup anemometers, speedometer gauges, and aerodynamic loads.
 */

export class WindEngine {
    constructor() {
        this.cache = new Map();
        this.currentWind = null;
        this.streamTimer = null;
        this.subscribers = new Set();
        this.anemometerAngle = 0;
        this.anemometerAnimId = null;
    }

    /**
     * Fetch real-time wind telemetry from backend
     */
    async fetchLiveWind(lat = 26.9157, lng = 70.9083, locationName = 'Selected Station') {
        try {
            const res = await fetch(`/api/wind/live?lat=${lat}&lng=${lng}&name=${encodeURIComponent(locationName)}`);
            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    this.currentWind = data;
                    return data;
                }
            }
        } catch (e) {
            console.warn('[WindEngine] Backend live wind fetch failed:', e);
        }

        // Local fallback
        const fallback = this.computeLocalWind(lat, lng, locationName);
        this.currentWind = fallback;
        return fallback;
    }

    /**
     * Start continuous 1-second live telemetry pulse stream
     */
    startLiveStream(lat, lng, locationName, onTickCallback, intervalMs = 1000) {
        this.stopLiveStream();
        if (onTickCallback) this.subscribers.add(onTickCallback);

        // Immediate first fetch
        this.fetchLiveWind(lat, lng, locationName).then(data => {
            this.notifySubscribers(data);
        });

        // 1-second interval loop
        this.streamTimer = setInterval(async () => {
            const data = await this.fetchLiveWind(lat, lng, locationName);
            this.notifySubscribers(data);
        }, intervalMs);

        return this.streamTimer;
    }

    /**
     * Stop active stream
     */
    stopLiveStream() {
        if (this.streamTimer) {
            clearInterval(this.streamTimer);
            this.streamTimer = null;
        }
    }

    subscribe(callback) {
        this.subscribers.add(callback);
        if (this.currentWind) callback(this.currentWind);
    }

    unsubscribe(callback) {
        this.subscribers.delete(callback);
    }

    notifySubscribers(data) {
        this.subscribers.forEach(cb => {
            try { cb(data); } catch (err) { console.error('[WindEngine] Subscriber error:', err); }
        });
    }

    /**
     * Client-side fallback wind generator
     */
    computeLocalWind(lat, lng, locationName) {
        lat = Number(lat);
        lng = Number(lng);
        const now = new Date();
        const epochSec = now.getTime() / 1000;
        const microTurb = Math.sin(epochSec * 1.5) * 0.4 + Math.cos(epochSec * 3.7) * 0.25;

        const baseSpeedKmh = Math.max(4.0, 16.0 + 8.0 * Math.sin(Math.abs(lat) * 2.0 * Math.PI / 180.0));
        const liveSpeedMps = Math.max(0.2, (baseSpeedKmh / 3.6) + microTurb);
        const liveSpeedKmh = liveSpeedMps * 3.6;
        const liveGustMps = Math.max(liveSpeedMps * 1.15, (baseSpeedKmh * 1.35 / 3.6) + Math.abs(microTurb * 1.2));
        const liveDirDeg = ((lat * 15.0 + lng * 5.0) + Math.sin(epochSec * 0.8) * 3.5 + 360.0) % 360.0;

        const compassPoints = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        const compIdx = Math.floor((liveDirDeg + 11.25) / 22.5) % 16;
        const cardinal = compassPoints[compIdx];

        let beaufortScale = 0, beaufortDesc = 'Calm';
        if (liveSpeedMps < 0.5) { beaufortScale = 0; beaufortDesc = 'Calm'; }
        else if (liveSpeedMps <= 1.5) { beaufortScale = 1; beaufortDesc = 'Light Air'; }
        else if (liveSpeedMps <= 3.3) { beaufortScale = 2; beaufortDesc = 'Light Breeze'; }
        else if (liveSpeedMps <= 5.4) { beaufortScale = 3; beaufortDesc = 'Gentle Breeze'; }
        else if (liveSpeedMps <= 7.9) { beaufortScale = 4; beaufortDesc = 'Moderate Breeze'; }
        else if (liveSpeedMps <= 10.7) { beaufortScale = 5; beaufortDesc = 'Fresh Breeze'; }
        else if (liveSpeedMps <= 13.8) { beaufortScale = 6; beaufortDesc = 'Strong Breeze'; }
        else if (liveSpeedMps <= 17.1) { beaufortScale = 7; beaufortDesc = 'High Wind / Moderate Gale'; }
        else if (liveSpeedMps <= 20.7) { beaufortScale = 8; beaufortDesc = 'Gale'; }
        else if (liveSpeedMps <= 24.4) { beaufortScale = 9; beaufortDesc = 'Strong Gale'; }
        else if (liveSpeedMps <= 28.4) { beaufortScale = 10; beaufortDesc = 'Storm'; }
        else if (liveSpeedMps <= 32.6) { beaufortScale = 11; beaufortDesc = 'Violent Storm'; }
        else { beaufortScale = 12; beaufortDesc = 'Hurricane Force'; }

        const airDensity = 1.184;
        const stagnationPa = Math.round(0.5 * airDensity * Math.pow(liveSpeedMps, 2) * 10) / 10;
        const hc = Math.round((Math.max(5.7, 10.45 - liveSpeedMps + 10.0 * Math.sqrt(liveSpeedMps))) * 100) / 100;
        const windcatcherFlow = Math.round(0.60 * 2.0 * liveSpeedMps * 3600 * 10) / 10;

        return {
            success: true,
            location: { name: locationName, latitude: lat, longitude: lng },
            telemetry: {
                speedMps: Math.round(liveSpeedMps * 100) / 100,
                speedKmh: Math.round(liveSpeedKmh * 10) / 10,
                speedMph: Math.round(liveSpeedMps * 2.23694 * 10) / 10,
                speedKnots: Math.round(liveSpeedMps * 1.94384 * 10) / 10,
                gustMps: Math.round(liveGustMps * 100) / 100,
                gustKmh: Math.round(liveGustMps * 3.6 * 10) / 10,
                directionDeg: Math.round(liveDirDeg * 10) / 10,
                cardinalDirection: cardinal,
                beaufortScale: beaufortScale,
                beaufortDescription: beaufortDesc,
                airDensityKgM3: airDensity,
                surfacePressureHpa: 1013.2,
                temperatureC: 32.0,
                source: 'Analytical Wind Engine',
                epochTimestampMs: Math.floor(epochSec * 1000),
                timestamp: now.toISOString()
            },
            aerodynamicsAndBuilding: {
                stagnationPressurePa: stagnationPa,
                convectiveCoefficientHc: hc,
                windcatcherAirflowM3h: windcatcherFlow,
                windcatcherCfm: Math.round(windcatcherFlow * 0.588578 * 10) / 10,
                buildingWindLoadCategory: stagnationPa < 50 ? 'Low' : (stagnationPa < 200 ? 'Moderate' : 'High Wind Load'),
                passiveCoolingPotential: liveSpeedMps >= 3.0 ? 'High Passive Cooling Rate' : 'Low Breeze Potential'
            }
        };
    }

    /**
     * Renders an Analog/Digital Dual Speedometer Gauge on HTML5 canvas (m/s & km/h)
     */
    renderSpeedometerGaugeCanvas(canvas, speedMps = 0, gustMps = 0, maxMps = 25) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height * 0.74;
        const radius = Math.min(width * 0.42, height * 0.60);

        ctx.clearRect(0, 0, width, height);

        const startAngle = Math.PI * 0.8;
        const endAngle = Math.PI * 2.2;
        const totalAngle = endAngle - startAngle;

        // 1. Background Track
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 16;
        ctx.lineCap = 'round';
        ctx.stroke();

        // 2. Glowing Gradient Arc
        const fillFraction = Math.max(0, Math.min(1.0, speedMps / maxMps));
        const currentAngle = startAngle + fillFraction * totalAngle;

        if (fillFraction > 0.01) {
            const grad = ctx.createLinearGradient(centerX - radius, centerY, centerX + radius, centerY);
            grad.addColorStop(0.0, '#38bdf8');  // Light breeze (Cyan)
            grad.addColorStop(0.35, '#10b981'); // Moderate breeze (Emerald)
            grad.addColorStop(0.70, '#f59e0b'); // High wind (Amber)
            grad.addColorStop(1.0, '#ef4444');  // Gale / Storm (Crimson)

            ctx.save();
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, startAngle, currentAngle);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 16;
            ctx.lineCap = 'round';
            ctx.stroke();
            ctx.restore();
        }

        // 3. Tick Marks (0, 5, 10, 15, 20, 25 m/s)
        const ticks = [0, 5, 10, 15, 20, 25];
        ticks.forEach(val => {
            const fraction = val / maxMps;
            const angle = startAngle + fraction * totalAngle;
            const x1 = centerX + Math.cos(angle) * (radius - 12);
            const y1 = centerY + Math.sin(angle) * (radius - 12);
            const x2 = centerX + Math.cos(angle) * (radius + 12);
            const y2 = centerY + Math.sin(angle) * (radius + 12);

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 2;
            ctx.stroke();

            const tx = centerX + Math.cos(angle) * (radius - 24);
            const ty = centerY + Math.sin(angle) * (radius - 24);
            ctx.fillStyle = '#94a3b8';
            ctx.font = '10px JetBrains Mono, monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${val}`, tx, ty);
        });

        // 4. Gust Marker Needle
        if (gustMps > speedMps) {
            const gustFrac = Math.min(1.0, gustMps / maxMps);
            const gustAngle = startAngle + gustFrac * totalAngle;
            const gx = centerX + Math.cos(gustAngle) * (radius + 4);
            const gy = centerY + Math.sin(gustAngle) * (radius + 4);

            ctx.save();
            ctx.beginPath();
            ctx.arc(gx, gy, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#f43f5e';
            ctx.fill();
            ctx.restore();
        }

        // 5. Main Needle
        const needleAngle = startAngle + fillFraction * totalAngle;
        const needleLen = radius - 14;
        const tipX = centerX + Math.cos(needleAngle) * needleLen;
        const tipY = centerY + Math.sin(needleAngle) * needleLen;

        ctx.save();
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(tipX, tipY);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.restore();

        // 6. Hub
        ctx.beginPath();
        ctx.arc(centerX, centerY, 7, 0, Math.PI * 2);
        ctx.fillStyle = '#38bdf8';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 7. Center Display Readout
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${speedMps.toFixed(1)} m/s`, centerX, centerY + 34);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px Inter, sans-serif';
        ctx.fillText(`${(speedMps * 3.6).toFixed(1)} km/h | Gust: ${(gustMps * 3.6).toFixed(1)} km/h`, centerX, centerY + 52);
    }

    /**
     * Renders a real-time spinning 3-Cup Anemometer on HTML5 canvas
     */
    renderAnemometerCanvas(canvas, speedMps = 5.0) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const armLength = Math.min(width, height) * 0.32;
        const cupRadius = 12;

        // Update rotation angle based on speed
        const rotSpeed = Math.max(0.02, speedMps * 0.08);
        this.anemometerAngle = (this.anemometerAngle + rotSpeed) % (Math.PI * 2);

        ctx.clearRect(0, 0, width, height);

        // Mast / Stand
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX, height - 8);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Base Flange
        ctx.beginPath();
        ctx.moveTo(centerX - 20, height - 8);
        ctx.lineTo(centerX + 20, height - 8);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Central Rotor Hub
        ctx.beginPath();
        ctx.arc(centerX, centerY, 9, 0, Math.PI * 2);
        ctx.fillStyle = '#0ea5e9';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 3 Rotor Arms and Hemispherical Cups (120 degrees apart)
        for (let i = 0; i < 3; i++) {
            const angle = this.anemometerAngle + (i * Math.PI * 2) / 3;
            const armX = centerX + Math.cos(angle) * armLength;
            const armY = centerY + Math.sin(angle) * armLength;

            // Arm
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(armX, armY);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 2.5;
            ctx.stroke();

            // Aerodynamic Cup (hemisphere)
            ctx.save();
            ctx.translate(armX, armY);
            ctx.rotate(angle + Math.PI / 2);

            ctx.beginPath();
            ctx.arc(0, 0, cupRadius, 0, Math.PI, false);
            ctx.fillStyle = '#38bdf8';
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            ctx.restore();
        }

        // Live RPM readout
        const rpm = Math.round(speedMps * 38);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${rpm} RPM Rotor Speed`, centerX, 18);
    }

    /**
     * Renders a 360-degree aerodynamic Windvane Compass on HTML5 canvas
     */
    renderWindVaneCanvas(canvas, directionDeg = 225, cardinal = 'SW') {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.38;

        ctx.clearRect(0, 0, width, height);

        // 1. Compass Circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(14, 24, 21, 0.6)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // 2. Cardinal Labels
        const cardinals = [
            { text: 'N', angle: -Math.PI / 2 },
            { text: 'E', angle: 0 },
            { text: 'S', angle: Math.PI / 2 },
            { text: 'W', angle: Math.PI }
        ];
        cardinals.forEach(c => {
            const x = centerX + Math.cos(c.angle) * (radius - 12);
            const y = centerY + Math.sin(c.angle) * (radius - 12);
            ctx.fillStyle = c.text === 'N' ? '#ef4444' : '#94a3b8';
            ctx.font = 'bold 11px JetBrains Mono, monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(c.text, x, y);
        });

        // 3. Rotating Aerodynamic Wind Arrow (points in direction wind is blowing FROM)
        const rad = ((directionDeg - 90) * Math.PI) / 180.0;
        const arrowLen = radius - 8;
        const tipX = centerX + Math.cos(rad) * arrowLen;
        const tipY = centerY + Math.sin(rad) * arrowLen;
        const tailX = centerX - Math.cos(rad) * (arrowLen * 0.7);
        const tailY = centerY - Math.sin(rad) * (arrowLen * 0.7);

        // Tail Fin
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(tipX, tipY);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Arrow Head Tip
        ctx.save();
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(tipX, tipY, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#38bdf8';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();

        // Center hub
        ctx.beginPath();
        ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Direction Readout
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${Math.round(directionDeg)}° ${cardinal}`, centerX, centerY + 28);
    }
}

export const windEngine = new WindEngine();
