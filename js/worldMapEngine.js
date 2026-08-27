/**
 * BioShelter Studio - Interactive World Climate & Temperature Map Engine
 * Renders global thermodynamic heatmaps, geo-located temperature telemetry stations,
 * active climate hazard markers, and enables 1-click climate synchronization to the 3D simulator.
 */

export const GLOBAL_STATIONS = [
    {
        id: 'station_thar',
        name: 'Jaisalmer / Thar Desert Basin',
        country: 'India',
        coordinates: '26.9157° N, 70.9083° E',
        lat: 26.9157,
        lng: 70.9083,
        tempC: 48.6,
        humidity: 18,
        solarGhi: 980,
        wetBulbC: 24.2,
        zoneId: 'hot_arid',
        climateType: 'BWh - Hyper-Arid Desert',
        status: 'Severe Heatwave Hazard 🔥',
        severity: 'critical'
    },
    {
        id: 'station_dubai',
        name: 'Rub al Khali / Dubai Corridor',
        country: 'United Arab Emirates',
        coordinates: '25.2048° N, 55.2708° E',
        lat: 25.2048,
        lng: 55.2708,
        tempC: 46.2,
        humidity: 42,
        solarGhi: 940,
        wetBulbC: 31.8,
        zoneId: 'hot_arid',
        climateType: 'BWh - Extreme Coastal Arid',
        status: 'High Wet-Bulb Stress ⚠️',
        severity: 'high'
    },
    {
        id: 'station_cairo',
        name: 'Cairo / Sahara Eastern Flank',
        country: 'Egypt',
        coordinates: '30.0444° N, 31.2357° E',
        lat: 30.0444,
        lng: 31.2357,
        tempC: 41.5,
        humidity: 24,
        solarGhi: 890,
        wetBulbC: 22.0,
        zoneId: 'hot_arid',
        climateType: 'BWh - Subtropical Hot Desert',
        status: 'Extreme Solar Flux',
        severity: 'moderate'
    },
    {
        id: 'station_phoenix',
        name: 'Phoenix / Sonoran Desert',
        country: 'United States',
        coordinates: '33.4484° N, -112.0740° W',
        lat: 33.4484,
        lng: -112.0740,
        tempC: 45.1,
        humidity: 14,
        solarGhi: 960,
        wetBulbC: 21.4,
        zoneId: 'hot_arid',
        climateType: 'BWh - Hot Desert Basin',
        status: 'Heat Advisory Active',
        severity: 'high'
    },
    {
        id: 'station_sundarbans',
        name: 'Sundarbans Delta / Bay of Bengal',
        country: 'India / Bangladesh',
        coordinates: '21.9497° N, 89.1833° E',
        lat: 21.9497,
        lng: 89.1833,
        tempC: 34.8,
        humidity: 86,
        solarGhi: 780,
        wetBulbC: 32.5,
        zoneId: 'warm_humid',
        climateType: 'Aw - Tropical Monsoon Coastal',
        status: 'Cyclone & Surge Risk 🌊',
        severity: 'high'
    },
    {
        id: 'station_manaus',
        name: 'Manaus / Amazon Rainforest Basin',
        country: 'Brazil',
        coordinates: '-3.1190° S, -60.0217° W',
        lat: -3.1190,
        lng: -60.0217,
        tempC: 33.2,
        humidity: 91,
        solarGhi: 710,
        wetBulbC: 31.6,
        zoneId: 'warm_humid',
        climateType: 'Af - Equatorial Rainforest',
        status: 'High Vapor Pressure Deficit',
        severity: 'moderate'
    },
    {
        id: 'station_singapore',
        name: 'Singapore Coastal Straits',
        country: 'Singapore',
        coordinates: '1.3521° N, 103.8198° E',
        lat: 1.3521,
        lng: 103.8198,
        tempC: 32.4,
        humidity: 84,
        solarGhi: 730,
        wetBulbC: 29.8,
        zoneId: 'warm_humid',
        climateType: 'Af - Equatorial Island Maritime',
        status: 'Continuous Cross-Ventilation Optimal',
        severity: 'moderate'
    },
    {
        id: 'station_delhi',
        name: 'New Delhi / Indo-Gangetic Plain',
        country: 'India',
        coordinates: '28.6139° N, 77.2090° E',
        lat: 28.6139,
        lng: 77.2090,
        tempC: 43.5,
        humidity: 48,
        solarGhi: 860,
        wetBulbC: 30.2,
        zoneId: 'composite',
        climateType: 'Cwa - Monsoon-Influenced Humid Subtropical',
        status: 'High Diurnal Variance',
        severity: 'high'
    },
    {
        id: 'station_london',
        name: 'London / Thames Valley Basin',
        country: 'United Kingdom',
        coordinates: '51.5074° N, -0.1278° W',
        lat: 51.5074,
        lng: -0.1278,
        tempC: 22.8,
        humidity: 58,
        solarGhi: 550,
        wetBulbC: 16.5,
        zoneId: 'temperate',
        climateType: 'Cfb - Oceanic Mild',
        status: 'Comfort Zone Baseline',
        severity: 'low'
    },
    {
        id: 'station_tokyo',
        name: 'Tokyo Bay / Kanto Plain',
        country: 'Japan',
        coordinates: '35.6762° N, 139.6503° E',
        lat: 35.6762,
        lng: 139.6503,
        tempC: 27.5,
        humidity: 65,
        solarGhi: 680,
        wetBulbC: 21.8,
        zoneId: 'temperate',
        climateType: 'Cfa - Humid Subtropical',
        status: 'Balanced Comfort Limit',
        severity: 'low'
    },
    {
        id: 'station_leh',
        name: 'Leh / Ladakh High Plateau (3,500m)',
        country: 'India',
        coordinates: '34.1526° N, 77.5771° E',
        lat: 34.1526,
        lng: 77.5771,
        tempC: 12.4,
        humidity: 22,
        solarGhi: 1020,
        wetBulbC: 3.2,
        zoneId: 'cold_mountainous',
        climateType: 'ET - Alpine High-Altitude Cold Desert',
        status: 'Solar Trombe Wall Recommended ❄️',
        severity: 'moderate'
    },
    {
        id: 'station_alps',
        name: 'Zermatt / Swiss Alps Ridge (2,800m)',
        country: 'Switzerland',
        coordinates: '45.9765° N, 7.7491° E',
        lat: 45.9765,
        lng: 7.7491,
        tempC: 6.2,
        humidity: 45,
        solarGhi: 820,
        wetBulbC: 0.5,
        zoneId: 'cold_mountainous',
        climateType: 'Dfc - Subarctic Alpine',
        status: 'Sub-Zero Insulation Priority',
        severity: 'high'
    },
    {
        id: 'station_sydney',
        name: 'Sydney Coastal Basin',
        country: 'Australia',
        coordinates: '-33.8688° S, 151.2093° E',
        lat: -33.8688,
        lng: 151.2093,
        tempC: 24.5,
        humidity: 52,
        solarGhi: 670,
        wetBulbC: 17.2,
        zoneId: 'temperate',
        climateType: 'Cfa - Humid Subtropical Marine',
        status: 'Temperate Vernacular Ideal',
        severity: 'low'
    },
    {
        id: 'station_nairobi',
        name: 'Nairobi Highland Plateau (1,795m)',
        country: 'Kenya',
        coordinates: '-1.2921° S, 36.8219° E',
        lat: -1.2921,
        lng: 36.8219,
        tempC: 23.8,
        humidity: 56,
        solarGhi: 790,
        wetBulbC: 17.0,
        zoneId: 'temperate',
        climateType: 'Cwb - Subtropical Highland',
        status: 'Year-Round Natural Comfort',
        severity: 'low'
    }
];

export class WorldMapEngine {
    constructor(canvasElement, onSelectStationCallback = null) {
        this.canvas = canvasElement;
        this.ctx = canvasElement.getContext('2d');
        this.onSelectStation = onSelectStationCallback;
        this.selectedStation = GLOBAL_STATIONS[0];
        this.hoveredStation = null;
        this.isDark = true;
        this.stations = GLOBAL_STATIONS;

        this.initEvents();
    }

    setTheme(isDark) {
        this.isDark = isDark;
        this.render();
    }

    initEvents() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            const mx = (e.clientX - rect.left) * scaleX;
            const my = (e.clientY - rect.top) * scaleY;

            let found = null;
            for (const st of this.stations) {
                const { x, y } = this.geoToScreen(st.lat, st.lng);
                const dist = Math.hypot(mx - x, my - y);
                if (dist <= 18) {
                    found = st;
                    break;
                }
            }

            if (found !== this.hoveredStation) {
                this.hoveredStation = found;
                this.canvas.style.cursor = found ? 'pointer' : 'default';
                this.render();
            }
        });

        this.canvas.addEventListener('click', (e) => {
            if (this.hoveredStation) {
                this.selectedStation = this.hoveredStation;
                this.render();
                if (this.onSelectStation) {
                    this.onSelectStation(this.selectedStation);
                }
            }
        });
    }

    // Equirectangular cylindrical map projection
    geoToScreen(lat, lng) {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const padX = 40;
        const padY = 30;
        const mapW = w - padX * 2;
        const mapH = h - padY * 2;

        const x = padX + ((lng + 180) / 360) * mapW;
        const y = padY + ((90 - lat) / 180) * mapH;
        return { x, y };
    }

    getTempColor(tempC) {
        if (tempC >= 45) return '#ef4444'; // Crimson Extreme Hot
        if (tempC >= 38) return '#f97316'; // Orange High
        if (tempC >= 30) return '#f59e0b'; // Amber Warm
        if (tempC >= 20) return '#10b981'; // Emerald Comfort
        if (tempC >= 10) return '#38bdf8'; // Sky Cool
        return '#818cf8'; // Indigo Cold
    }

    render() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        ctx.clearRect(0, 0, w, h);

        // Ocean Background
        ctx.fillStyle = this.isDark ? '#070f20' : '#e0f2fe';
        ctx.fillRect(0, 0, w, h);

        // Draw Graticule Grid Lines (Lat/Long)
        this.drawGraticule();

        // Draw World Continents Outline
        this.drawWorldContinents();

        // Draw Equatorial Thermal Gradient Belt
        this.drawThermalBelts();

        // Draw Stations and Temperature Heat Points
        this.drawStationPins();

        // Draw Selected Station Details Card / Tooltip
        this.drawHUDCard();
    }

    drawGraticule() {
        const ctx = this.ctx;
        ctx.strokeStyle = this.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)';
        ctx.lineWidth = 1;

        // Longitude meridians
        for (let lng = -180; lng <= 180; lng += 30) {
            const { x } = this.geoToScreen(0, lng);
            ctx.beginPath();
            ctx.moveTo(x, 20);
            ctx.lineTo(x, this.canvas.height - 20);
            ctx.stroke();
        }

        // Latitude parallels
        for (let lat = -60; lat <= 80; lat += 30) {
            const { y } = this.geoToScreen(lat, 0);
            ctx.beginPath();
            ctx.moveTo(30, y);
            ctx.lineTo(this.canvas.width - 30, y);
            ctx.stroke();
        }

        // Equator Line (Amber Dash)
        const { y: eqY } = this.geoToScreen(0, 0);
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(30, eqY);
        ctx.lineTo(this.canvas.width - 30, eqY);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    drawWorldContinents() {
        const ctx = this.ctx;
        ctx.fillStyle = this.isDark ? '#141e33' : '#cbd5e1';
        ctx.strokeStyle = this.isDark ? '#2b3b59' : '#94a3b8';
        ctx.lineWidth = 1.2;

        // High-resolution multi-polygon approximations for global landmasses & islands
        const continents = [
            // North America (Alaska to Florida & Mexico)
            [[-168, 65], [-160, 71], [-135, 69], [-95, 74], [-82, 60], [-60, 50], [-70, 42], [-76, 35], [-81, 25], [-88, 30], [-97, 26], [-90, 20], [-80, 8], [-77, 8], [-85, 15], [-105, 20], [-117, 32], [-124, 48], [-140, 60], [-165, 54]],
            // Greenland
            [[-50, 82], [-20, 80], [-25, 70], [-45, 60], [-55, 65], [-60, 78]],
            // South America
            [[-77, 8], [-60, 11], [-50, 2], [-35, -5], [-35, -12], [-41, -22], [-48, -28], [-58, -38], [-65, -55], [-75, -52], [-72, -40], [-71, -30], [-76, -15], [-80, -2], [-80, 5]],
            // Europe & Scandinavia
            [[-9, 36], [-8, 44], [-1, 46], [2, 51], [8, 55], [10, 60], [18, 70], [28, 71], [32, 60], [28, 45], [24, 38], [15, 38], [15, 42], [5, 44], [0, 40], [-5, 36]],
            // Great Britain & Ireland
            [[-5, 58], [-2, 58], [1, 52], [-5, 50], [-5, 55]],
            // Africa & Madagascar
            [[-6, 36], [10, 37], [25, 32], [33, 30], [35, 22], [44, 12], [51, 11], [42, -5], [35, -25], [28, -34], [18, -34], [12, -18], [9, 3], [-5, 5], [-17, 15], [-12, 28]],
            [[44, -12], [50, -14], [48, -25], [44, -25]],
            // Asia, Middle East & Indian Subcontinent
            [[35, 30], [45, 40], [50, 48], [60, 60], [80, 73], [110, 76], [140, 73], [170, 65], [180, 65], [170, 60], [142, 52], [130, 42], [122, 30], [108, 22], [102, 10], [98, 3], [104, 1], [98, 10], [88, 22], [80, 13], [77, 8], [73, 16], [70, 22], [60, 25], [56, 26], [50, 28], [40, 22], [35, 30]],
            // Japan Archipelago
            [[141, 45], [145, 43], [140, 36], [131, 32], [130, 34], [139, 38]],
            // Australia & New Zealand
            [[114, -22], [125, -15], [135, -12], [142, -11], [146, -20], [153, -28], [150, -37], [138, -36], [116, -35], [113, -26]],
            [[174, -36], [178, -38], [172, -44], [168, -46], [170, -42], [175, -40]],
            // Antarctica Coastline
            [[-180, -78], [-120, -75], [-60, -68], [0, -70], [60, -68], [120, -67], [180, -78], [180, -88], [-180, -88]]
        ];

        continents.forEach(poly => {
            ctx.beginPath();
            poly.forEach(([lng, lat], idx) => {
                const { x, y } = this.geoToScreen(lat, lng);
                if (idx === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        });

        // Add Major Latitude Text Labels on Left Axis
        ctx.fillStyle = this.isDark ? '#64748b' : '#94a3b8';
        ctx.font = '9px JetBrains Mono, monospace';
        ctx.textAlign = 'right';

        const latLabels = [
            { lat: 60, txt: '60°N' },
            { lat: 30, txt: '30°N (Tropic of Cancer)' },
            { lat: 0, txt: '0° (Equator)' },
            { lat: -30, txt: '30°S (Tropic of Capricorn)' },
            { lat: -60, txt: '60°S' }
        ];

        latLabels.forEach(l => {
            const { y } = this.geoToScreen(l.lat, 0);
            ctx.fillText(l.txt, this.canvas.width - 25, y - 4);
        });
    }

    drawThermalBelts() {
        const ctx = this.ctx;

        // Tropical / Hyper-Arid Heat Band Gradient across Equatorial & Saharan latitudes (+35°N to -20°S)
        const topY = this.geoToScreen(35, 0).y;
        const botY = this.geoToScreen(-20, 0).y;

        const grad = ctx.createLinearGradient(0, topY, 0, botY);
        grad.addColorStop(0, 'rgba(239, 68, 68, 0.0)');
        grad.addColorStop(0.3, 'rgba(249, 115, 22, 0.12)');
        grad.addColorStop(0.5, 'rgba(239, 68, 68, 0.18)');
        grad.addColorStop(0.7, 'rgba(249, 115, 22, 0.12)');
        grad.addColorStop(1, 'rgba(56, 189, 248, 0.0)');

        ctx.fillStyle = grad;
        ctx.fillRect(40, topY, this.canvas.width - 80, botY - topY);
    }

    drawStationPins() {
        const ctx = this.ctx;

        this.stations.forEach(st => {
            const { x, y } = this.geoToScreen(st.lat, st.lng);
            const isSelected = this.selectedStation && this.selectedStation.id === st.id;
            const isHovered = this.hoveredStation && this.hoveredStation.id === st.id;
            const col = this.getTempColor(st.tempC);

            // Pulsing outer aura for severe/critical stations
            if (st.severity === 'critical' || isSelected) {
                ctx.beginPath();
                ctx.arc(x, y, isSelected ? 16 : 12, 0, Math.PI * 2);
                ctx.fillStyle = st.severity === 'critical' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(56, 189, 248, 0.3)';
                ctx.fill();
            }

            // Core Pin circle
            ctx.beginPath();
            ctx.arc(x, y, isHovered || isSelected ? 8 : 6, 0, Math.PI * 2);
            ctx.fillStyle = col;
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = isSelected ? 2.5 : 1.5;
            ctx.stroke();

            // Temperature Tag Badge above pin
            const tagText = `${st.tempC.toFixed(1)}°C`;
            ctx.font = 'bold 10px JetBrains Mono, monospace';
            const textW = ctx.measureText(tagText).width;

            ctx.fillStyle = this.isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.95)';
            ctx.beginPath();
            ctx.roundRect(x - textW / 2 - 4, y - 24, textW + 8, 14, 4);
            ctx.fill();
            ctx.strokeStyle = col;
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.fillStyle = col;
            ctx.textAlign = 'center';
            ctx.fillText(tagText, x, y - 13);
        });
    }

    drawHUDCard() {
        const st = this.selectedStation;
        if (!st) return;

        const ctx = this.ctx;
        const cardW = 280;
        const cardH = 150;
        const cardX = this.canvas.width - cardW - 20;
        const cardY = 20;

        ctx.fillStyle = this.isDark ? 'rgba(11, 19, 38, 0.92)' : 'rgba(255, 255, 255, 0.95)';
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, cardH, 12);
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Title
        ctx.fillStyle = this.isDark ? '#f8fafc' : '#0f172a';
        ctx.font = 'bold 13px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(st.name, cardX + 14, cardY + 22);

        ctx.fillStyle = this.isDark ? '#94a3b8' : '#64748b';
        ctx.font = '10px Inter, sans-serif';
        ctx.fillText(`${st.country} • ${st.coordinates}`, cardX + 14, cardY + 36);

        // Large Temp Metric
        const col = this.getTempColor(st.tempC);
        ctx.fillStyle = col;
        ctx.font = 'bold 22px JetBrains Mono, monospace';
        ctx.fillText(`${st.tempC.toFixed(1)}°C`, cardX + 14, cardY + 64);

        ctx.fillStyle = this.isDark ? '#94a3b8' : '#475569';
        ctx.font = '11px Inter, sans-serif';
        ctx.fillText(`RH: ${st.humidity}% | Wet-Bulb: ${st.wetBulbC}°C`, cardX + 14, cardY + 80);
        ctx.fillText(`GHI Solar: ${st.solarGhi} W/m²`, cardX + 14, cardY + 95);

        // Status badge
        ctx.fillStyle = st.severity === 'critical' ? '#ef4444' : (st.severity === 'high' ? '#f59e0b' : '#10b981');
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.fillText(st.status, cardX + 14, cardY + 115);

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'italic 10px Inter, sans-serif';
        ctx.fillText('Click below to apply to 3D Shelter Simulation', cardX + 14, cardY + 134);
    }
}
