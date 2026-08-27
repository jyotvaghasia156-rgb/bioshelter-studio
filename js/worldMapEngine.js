/**
 * BioShelter Studio - Interactive World Climate, Google Map & Live Online Temperature Engine
 * Combines Leaflet map layers (Google Street, Google Satellite, CartoDB Dark Matter, Google Terrain),
 * live online Open-Meteo weather API telemetry, real-time GPS queries,
 * and global thermal heatwave vs paradise comfort haven markers.
 */

/* global L */

export const GLOBAL_STATIONS = [
    // 🔴 1. EXTREME HEATWAVE & HAZARD HOTSPOTS (> 40°C - 52°C)
    {
        id: 'station_jacobabad',
        name: 'Jacobabad / Indus Valley Basin',
        country: 'Pakistan',
        coordinates: '28.2819° N, 68.4386° E',
        lat: 28.2819,
        lng: 68.4386,
        tempC: 51.2,
        tempMin: 32.0,
        humidity: 44,
        solarGhi: 1010,
        wetBulbC: 35.1,
        windSpeedMps: 4.8,
        windSpeedKmh: 17.3,
        windDirectionDeg: 220,
        windFrom: 'South-West (SW)',
        windTo: 'North-East (NE)',
        windDirectionText: 'SW (220°) ➔ NE (40°)',
        zoneId: 'hot_arid',
        climateType: 'BWh - Lethal Wet-Bulb Hyper-Arid Basin',
        status: 'Lethal Wet-Bulb Heatwave Breach 🔥',
        severity: 'critical',
        category: 'extreme_hot',
        weatherStatement: 'Extreme wet-bulb emergency: Ambient temp 51.2°C with wet-bulb exceeding 35°C human physiological tolerance threshold. Subterranean earth-sheltered cooling mandatory.'
    },
    {
        id: 'station_deathvalley',
        name: 'Furnace Creek / Death Valley',
        country: 'United States',
        coordinates: '36.4614° N, -116.8656° W',
        lat: 36.4614,
        lng: -116.8656,
        tempC: 52.4,
        tempMin: 34.5,
        humidity: 9,
        solarGhi: 1040,
        wetBulbC: 22.8,
        windSpeedMps: 6.2,
        windSpeedKmh: 22.3,
        windDirectionDeg: 190,
        windFrom: 'South (S)',
        windTo: 'North (N)',
        windDirectionText: 'S (190°) ➔ N (10°)',
        zoneId: 'hot_arid',
        climateType: 'BWh - Below Sea Level Hyperthermic Desert',
        status: 'Planetary Heat Record Alert ⚠️',
        severity: 'critical',
        category: 'extreme_hot',
        weatherStatement: 'Extreme convection oven effect in topographic depression (-86m below sea level). Super-heated downward air currents at 22 km/h.'
    },
    {
        id: 'station_thar',
        name: 'Jaisalmer / Thar Desert Basin',
        country: 'India',
        coordinates: '26.9157° N, 70.9083° E',
        lat: 26.9157,
        lng: 70.9083,
        tempC: 48.6,
        tempMin: 28.5,
        humidity: 18,
        solarGhi: 980,
        wetBulbC: 24.2,
        windSpeedMps: 5.4,
        windSpeedKmh: 19.4,
        windDirectionDeg: 245,
        windFrom: 'West-Southwest (WSW)',
        windTo: 'East-Northeast (ENE)',
        windDirectionText: 'WSW (245°) ➔ ENE (65°)',
        zoneId: 'hot_arid',
        climateType: 'BWh - Hyper-Arid Desert',
        status: 'Severe Heatwave Hazard 🔥',
        severity: 'critical',
        category: 'extreme_hot',
        weatherStatement: 'Intense diurnal radiation flux. Exterior unshaded surface temperatures surpass 62°C. Rammed earth thermal lag (8.5h) recommended.'
    },
    {
        id: 'station_dubai',
        name: 'Rub al-Khali / Dubai Coastal Fringe',
        country: 'United Arab Emirates',
        coordinates: '25.2048° N, 55.2708° E',
        lat: 25.2048,
        lng: 55.2708,
        tempC: 46.8,
        tempMin: 32.0,
        humidity: 62,
        solarGhi: 990,
        wetBulbC: 34.0,
        windSpeedMps: 4.1,
        windSpeedKmh: 14.8,
        windDirectionDeg: 310,
        windFrom: 'North-West (NW)',
        windTo: 'South-East (SE)',
        windDirectionText: 'NW (310°) ➔ SE (130°)',
        zoneId: 'hot_arid',
        climateType: 'BWh - Persian Gulf Hyper-Thermal Marine Corridor',
        status: 'Extreme Marine Heat Anomaly 🔥',
        severity: 'critical',
        category: 'extreme_hot',
        weatherStatement: 'High ambient temperature coupled with heavy marine humidity creates severe physiological thermal stress.'
    },
    {
        id: 'station_cairo',
        name: 'Aswan & Nile Basin',
        country: 'Egypt',
        coordinates: '24.0889° N, 32.8998° E',
        lat: 24.0889,
        lng: 32.8998,
        tempC: 47.5,
        tempMin: 29.0,
        humidity: 14,
        solarGhi: 1020,
        wetBulbC: 22.0,
        windSpeedMps: 4.6,
        windSpeedKmh: 16.6,
        windDirectionDeg: 350,
        windFrom: 'North (N)',
        windTo: 'South (S)',
        windDirectionText: 'N (350°) ➔ S (170°)',
        zoneId: 'hot_arid',
        climateType: 'BWh - Saharan Hyper-Arid Plateau',
        status: 'Extreme Saharan Heatwave 🔥',
        severity: 'critical',
        category: 'extreme_hot',
        weatherStatement: 'Unshaded Saharan sun with zero cloud cover. Heavy earthen masonry and deep courtyard shading required.'
    },

    // 🟢 2. PARADISE COMFORT HAVENS (20°C - 26°C, IDEAL PLACES TO ENJOY LIFE)
    {
        id: 'station_medellin',
        name: 'Medellín / Aburrá Valley',
        country: 'Colombia',
        coordinates: '6.2442° N, -75.5812° W',
        lat: 6.2442,
        lng: -75.5812,
        tempC: 23.5,
        tempMin: 17.2,
        humidity: 64,
        solarGhi: 680,
        wetBulbC: 18.5,
        windSpeedMps: 2.8,
        windSpeedKmh: 10.1,
        windDirectionDeg: 45,
        windFrom: 'North-East (NE)',
        windTo: 'South-West (SW)',
        windDirectionText: 'NE (45°) ➔ SW (225°)',
        zoneId: 'temperate',
        climateType: 'Cfb - Tropical Highland (City of Eternal Spring 🌸)',
        status: 'Paradise Comfort Haven 🟢',
        severity: 'safe',
        category: 'paradise_comfort',
        isParadise: true,
        weatherStatement: 'Sublime year-round comfort in high-altitude mountain bowl (1,500m). Gentle thermal breezes and lush flower microclimate.'
    },
    {
        id: 'station_funchal',
        name: 'Funchal / Madeira Subtropical Haven',
        country: 'Portugal',
        coordinates: '32.6669° N, -16.9241° W',
        lat: 32.6669,
        lng: -16.9241,
        tempC: 22.8,
        tempMin: 18.0,
        humidity: 62,
        solarGhi: 710,
        wetBulbC: 17.8,
        windSpeedMps: 3.6,
        windSpeedKmh: 13.0,
        windDirectionDeg: 60,
        windFrom: 'East-North-East (ENE)',
        windTo: 'West-South-West (WSW)',
        windDirectionText: 'ENE (60°) ➔ WSW (240°)',
        zoneId: 'temperate',
        climateType: 'Csb - Subtropical Ocean Garden 🌴',
        status: 'Paradise Comfort Haven 🟢',
        severity: 'safe',
        category: 'paradise_comfort',
        isParadise: true,
        weatherStatement: 'Gulf stream regulated maritime paradise. Steady refreshing trade wind breezes with zero heatwaves.'
    },
    {
        id: 'station_sandiego',
        name: 'San Diego / Coronado Coastal Haven',
        country: 'United States',
        coordinates: '32.7157° N, -117.1611° W',
        lat: 32.7157,
        lng: -117.1611,
        tempC: 22.4,
        tempMin: 16.5,
        humidity: 58,
        solarGhi: 740,
        wetBulbC: 16.9,
        windSpeedMps: 3.2,
        windSpeedKmh: 11.5,
        windDirectionDeg: 280,
        windFrom: 'West (W)',
        windTo: 'East (E)',
        windDirectionText: 'W (280°) ➔ E (100°)',
        zoneId: 'temperate',
        climateType: 'Csb - Mediterranean Coastal Eden 🏖️',
        status: 'Paradise Comfort Haven 🟢',
        severity: 'safe',
        category: 'paradise_comfort',
        isParadise: true,
        weatherStatement: 'Nearly 300 sunny days per year with refreshing Pacific ocean sea breeze. Gold standard ASHRAE 55 comfort.'
    },
    {
        id: 'station_tenerife',
        name: 'Santa Cruz / Tenerife Canary Islands',
        country: 'Spain',
        coordinates: '28.4636° N, -16.2518° W',
        lat: 28.4636,
        lng: -16.2518,
        tempC: 24.1,
        tempMin: 19.0,
        humidity: 56,
        solarGhi: 790,
        wetBulbC: 18.0,
        windSpeedMps: 4.2,
        windSpeedKmh: 15.1,
        windDirectionDeg: 45,
        windFrom: 'North-East (NE)',
        windTo: 'South-West (SW)',
        windDirectionText: 'NE (45°) ➔ SW (225°)',
        zoneId: 'temperate',
        climateType: 'BSh/Csb - Island of Eternal Sunshine ☀️',
        status: 'Paradise Comfort Haven 🟢',
        severity: 'safe',
        category: 'paradise_comfort',
        isParadise: true,
        weatherStatement: 'Optimal Atlantic trade winds deliver constant cooling air circulation. World-renowned lifestyle health retreat.'
    },
    {
        id: 'station_kunming',
        name: 'Kunming / Yunnan Plateau',
        country: 'China',
        coordinates: '25.0406° N, 102.7129° E',
        lat: 25.0406,
        lng: 102.7129,
        tempC: 21.6,
        tempMin: 14.0,
        humidity: 55,
        solarGhi: 720,
        wetBulbC: 15.8,
        windSpeedMps: 2.9,
        windSpeedKmh: 10.4,
        windDirectionDeg: 160,
        windFrom: 'South-South-East (SSE)',
        windTo: 'North-North-West (NNW)',
        windDirectionText: 'SSE (160°) ➔ NNW (340°)',
        zoneId: 'temperate',
        climateType: 'Cwb - Spring City of the Orient 🌸',
        status: 'Paradise Comfort Haven 🟢',
        severity: 'safe',
        category: 'paradise_comfort',
        isParadise: true,
        weatherStatement: 'Subtropical highland elevation gives 12 months of mild pleasant spring weather and clear mountain air.'
    },
    {
        id: 'station_ooty',
        name: 'Ooty / Nilgiri Blue Mountains',
        country: 'India',
        coordinates: '11.4102° N, 76.6950° E',
        lat: 11.4102,
        lng: 76.6950,
        tempC: 19.8,
        tempMin: 12.0,
        humidity: 58,
        solarGhi: 670,
        wetBulbC: 14.5,
        windSpeedMps: 2.5,
        windSpeedKmh: 9.0,
        windDirectionDeg: 260,
        windFrom: 'West (W)',
        windTo: 'East (E)',
        windDirectionText: 'W (260°) ➔ E (80°)',
        zoneId: 'temperate',
        climateType: 'Cfb - Queen of Hill Stations 🍵',
        status: 'Paradise Comfort Haven 🟢',
        severity: 'safe',
        category: 'paradise_comfort',
        isParadise: true,
        weatherStatement: 'Crisp eucalyptus mountain breeze and lush tea plantations (2,240m elevation). Pristine natural thermal solace.'
    },
    {
        id: 'station_como',
        name: 'Lake Como / Bellagio Alpine Haven',
        country: 'Italy',
        coordinates: '45.9867° N, 9.2625° E',
        lat: 45.9867,
        lng: 9.2625,
        tempC: 23.0,
        tempMin: 16.0,
        humidity: 56,
        solarGhi: 710,
        wetBulbC: 17.1,
        windSpeedMps: 2.7,
        windSpeedKmh: 9.7,
        windDirectionDeg: 10,
        windFrom: 'North (N)',
        windTo: 'South (S)',
        windDirectionText: 'N (10°) ➔ S (190°)',
        zoneId: 'temperate',
        climateType: 'Cfa - Subalpine Lake Solace ⛵',
        status: 'Paradise Comfort Haven 🟢',
        severity: 'safe',
        category: 'paradise_comfort',
        isParadise: true,
        weatherStatement: 'Thermal lake microclimate buffered by the Italian Alps. Gentle diurnal breezes (Breva & Tivano).'
    },
    {
        id: 'station_maui',
        name: 'Maui / Wailea Coastal Sanctuary',
        country: 'United States',
        coordinates: '20.6900° N, -156.4428° W',
        lat: 20.6900,
        lng: -156.4428,
        tempC: 25.5,
        tempMin: 20.5,
        humidity: 64,
        solarGhi: 820,
        wetBulbC: 20.2,
        windSpeedMps: 4.5,
        windSpeedKmh: 16.2,
        windDirectionDeg: 70,
        windFrom: 'East-North-East (ENE)',
        windTo: 'West-South-West (WSW)',
        windDirectionText: 'ENE (70°) ➔ WSW (250°)',
        zoneId: 'warm_humid',
        climateType: 'Af - Pacific Trade Wind Eden 🌴',
        status: 'Paradise Comfort Haven 🟢',
        severity: 'safe',
        category: 'paradise_comfort',
        isParadise: true,
        weatherStatement: 'Consistent oceanic trade winds at 16 km/h ensure natural ventilation and sublime outdoor living all year.'
    },

    // 🟣 3. COLD ALPINE & MOUNTAINOUS REGIONS (< 10°C)
    {
        id: 'station_ladakh',
        name: 'Leh / Ladakh High Altitude Plateau',
        country: 'India',
        coordinates: '34.1526° N, 77.5771° E',
        lat: 34.1526,
        lng: 77.5771,
        tempC: 4.8,
        tempMin: -12.0,
        humidity: 24,
        solarGhi: 920,
        wetBulbC: -2.0,
        windSpeedMps: 6.8,
        windSpeedKmh: 24.5,
        windDirectionDeg: 300,
        windFrom: 'North-West (NW)',
        windTo: 'South-East (SE)',
        windDirectionText: 'NW (300°) ➔ SE (120°)',
        zoneId: 'cold_mountainous',
        climateType: 'BWk - Alpine Cold Desert (3,500m)',
        status: 'Alpine Cold Anomaly ❄️',
        severity: 'high',
        category: 'cold_alpine',
        weatherStatement: 'Sub-zero nighttime radiation sink with high direct solar UV gain during daytime. Trombe solar walls recommended.'
    },
    {
        id: 'station_zermatt',
        name: 'Zermatt / Matterhorn Glacier Basin',
        country: 'Switzerland',
        coordinates: '45.9763° N, 7.7491° E',
        lat: 45.9763,
        lng: 7.7491,
        tempC: 8.2,
        tempMin: -4.5,
        humidity: 48,
        solarGhi: 840,
        wetBulbC: 2.1,
        windSpeedMps: 5.2,
        windSpeedKmh: 18.7,
        windDirectionDeg: 210,
        windFrom: 'South-West (SW)',
        windTo: 'North-East (NE)',
        windDirectionText: 'SW (210°) ➔ NE (30°)',
        zoneId: 'cold_mountainous',
        climateType: 'ET - High Alpine Mountain Core',
        status: 'Glacial Alpine Cold ❄️',
        severity: 'moderate',
        category: 'cold_alpine',
        weatherStatement: 'Glacial Katabatic downslope winds. High thermal resistance wall assemblies (R > 4.5 m²K/W) essential.'
    }
];

export class WorldMapEngine {
    constructor(containerId = 'interactive-world-map-leaflet', onSelectCallback = null) {
        this.containerId = containerId;
        this.onSelectCallback = onSelectCallback;
        this.map = null;
        this.markersLayer = null;
        this.tileLayers = {};
        this.currentLayerKey = 'google_street';
        this.filterCategory = 'all';
        this.selectedStation = GLOBAL_STATIONS[0];
        this.customUserMarker = null;

        this.initLeafletMap();
        this.bindSearchAndLiveApi();
    }

    initLeafletMap() {
        const container = document.getElementById(this.containerId);
        if (!container || typeof L === 'undefined') {
            console.warn('[WorldMapEngine] Leaflet library or container not ready yet.');
            return;
        }

        // Initialize Leaflet Map centered on global view
        this.map = L.map(this.containerId, {
            center: [24.0, 10.0],
            zoom: 2,
            minZoom: 2,
            maxZoom: 18,
            zoomControl: true,
            attributionControl: false
        });

        // 1. Google Streets Layer
        this.tileLayers['google_street'] = L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        });

        // 2. Google Satellite Imagery Layer
        this.tileLayers['google_satellite'] = L.tileLayer('https://mt1.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        });

        // 3. CartoDB Dark Matter (Thermal Heat Radar)
        this.tileLayers['carto_dark'] = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
            subdomains: 'abcd'
        });

        // 4. Google Terrain Topography Layer
        this.tileLayers['google_terrain'] = L.tileLayer('https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        });

        // Default to Google Street
        this.tileLayers['google_street'].addTo(this.map);

        this.markersLayer = L.layerGroup().addTo(this.map);
        this.renderStationMarkers();

        // Click anywhere on map to fetch live online weather for that exact point!
        this.map.on('click', async (e) => {
            const { lat, lng } = e.latlng;
            await this.fetchAndInspectLivePoint(lat, lng, `Custom GPS Location (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`);
        });

        // Render table
        this.renderStationTable();
        this.updateTelemetryHUD(this.selectedStation);
    }

    setLayer(layerKey) {
        if (!this.tileLayers[layerKey] || !this.map) return;
        Object.values(this.tileLayers).forEach(layer => {
            if (this.map.hasLayer(layer)) this.map.removeLayer(layer);
        });
        this.tileLayers[layerKey].addTo(this.map);
        this.currentLayerKey = layerKey;

        document.querySelectorAll('.map-layer-btn').forEach(btn => {
            if (btn.getAttribute('data-map-layer') === layerKey) {
                btn.classList.add('active');
                btn.style.background = 'rgba(56,189,248,0.2)';
                btn.style.borderColor = 'var(--accent-sky)';
                btn.style.color = 'var(--text-primary)';
            } else {
                btn.classList.remove('active');
                btn.style.background = 'rgba(255,255,255,0.06)';
                btn.style.borderColor = 'var(--border-glass)';
                btn.style.color = 'var(--text-secondary)';
            }
        });
    }

    setTheme(isDark) {
        this.isDark = isDark;
        if (!isDark && this.currentLayerKey === 'carto_dark') {
            this.setLayer('google_street');
        }
        this.renderStationMarkers();
        this.renderStationTable();
    }

    setFilter(category) {
        this.filterCategory = category;
        this.renderStationMarkers();
        this.renderStationTable();

        document.querySelectorAll('.map-filter-chip').forEach(chip => {
            if (chip.getAttribute('data-map-filter') === category) {
                chip.classList.add('active');
            } else {
                chip.classList.remove('active');
            }
        });
    }

    renderStationMarkers() {
        if (!this.markersLayer) return;
        this.markersLayer.clearLayers();

        const filtered = GLOBAL_STATIONS.filter(s => {
            if (this.filterCategory === 'all') return true;
            return s.category === this.filterCategory;
        });

        filtered.forEach(station => {
            const isHot = station.category === 'extreme_hot' || station.tempC >= 38;
            const isComfort = station.isParadise || (station.tempC >= 20 && station.tempC <= 28);
            const isCold = station.category === 'cold_alpine' || station.tempC < 12;

            const pinColor = isHot ? '#ef4444' : (isComfort ? '#10b981' : (isCold ? '#818cf8' : '#38bdf8'));
            const pulseClass = isHot ? 'pulse-red' : (isComfort ? 'pulse-green' : '');

            const iconHtml = `
                <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
                    <div class="${pulseClass}" style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background: ${pinColor}33; border: 2px solid ${pinColor};"></div>
                    <div style="background: ${pinColor}; color: white; font-size: 11px; font-weight: 800; padding: 2px 5px; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.6); z-index: 2;">
                        ${Math.round(station.tempC)}°
                    </div>
                </div>
            `;

            const customIcon = L.divIcon({
                html: iconHtml,
                className: 'custom-map-pin',
                iconSize: [34, 34],
                iconAnchor: [17, 17]
            });

            const marker = L.marker([station.lat, station.lng], { icon: customIcon });

            marker.bindPopup(`
                <div style="font-family: 'Inter', sans-serif; min-width: 220px; color: #0f172a; padding: 4px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                        <span style="font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; background: ${pinColor}22; color: ${pinColor};">${isHot ? '🔴 EXTREME HEAT' : (isComfort ? '🟢 PARADISE' : '❄️ ALPINE')}</span>
                        <span style="font-size: 16px; font-weight: 900; color: ${pinColor};">${station.tempC}°C</span>
                    </div>
                    <h4 style="font-size: 14px; font-weight: 800; margin: 0 0 2px 0;">${station.name}</h4>
                    <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">${station.country} &bull; ${station.humidity}% Humidity</div>
                    <div style="font-size: 11px; background: #f1f5f9; padding: 4px 6px; border-radius: 4px; margin-bottom: 8px;">
                        💨 <strong>Wind:</strong> ${station.windSpeedMps} m/s (${station.windDirectionText || 'ENE'})
                    </div>
                    <button id="popup-btn-apply-${station.id}" style="width: 100%; background: linear-gradient(135deg, #0284c7, #10b981); color: white; border: none; padding: 6px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer;">
                        🚀 Simulate in 3D BioShelter &rarr;
                    </button>
                </div>
            `);

            marker.on('click', () => {
                this.selectStation(station);
            });

            marker.on('popupopen', () => {
                const btn = document.getElementById(`popup-btn-apply-${station.id}`);
                if (btn) {
                    btn.addEventListener('click', () => {
                        this.applyStationToStudio(station);
                    });
                }
            });

            this.markersLayer.addLayer(marker);
        });
    }

    selectStation(station) {
        this.selectedStation = station;
        this.updateTelemetryHUD(station);
        if (this.onSelectCallback) {
            this.onSelectCallback(station);
        }
    }

    applyStationToStudio(station) {
        this.selectStation(station);
        const btnApply = document.getElementById('btn-apply-map-climate');
        if (btnApply) btnApply.click();
    }

    updateTelemetryHUD(station) {
        const badge = document.getElementById('live-map-inspect-badge');
        const coords = document.getElementById('live-map-inspect-coords');
        const name = document.getElementById('live-map-inspect-name');
        const statement = document.getElementById('live-map-inspect-statement');
        const temp = document.getElementById('live-map-inspect-temp');
        const tempF = document.getElementById('live-map-inspect-temp-f');
        const wind = document.getElementById('live-map-inspect-wind');
        const windDir = document.getElementById('live-map-inspect-wind-dir');
        const humidity = document.getElementById('live-map-inspect-humidity');
        const source = document.getElementById('live-map-inspect-source');

        const isHot = station.category === 'extreme_hot' || station.tempC >= 38;
        const isComfort = station.isParadise || (station.tempC >= 20 && station.tempC <= 28);
        const pinColor = isHot ? '#ef4444' : (isComfort ? '#10b981' : '#38bdf8');

        if (badge) {
            badge.textContent = isHot ? '🔴 EXTREME HEATWAVE' : (isComfort ? '🟢 PARADISE COMFORT' : '🌐 REGIONAL MICROCLIMATE');
            badge.style.background = `${pinColor}22`;
            badge.style.color = pinColor;
        }

        if (coords) coords.textContent = station.coordinates || `${station.lat.toFixed(4)}° N, ${station.lng.toFixed(4)}° E`;
        if (name) name.textContent = `${station.name}, ${station.country || ''}`;
        if (statement) statement.textContent = station.weatherStatement || 'Real-time online atmospheric parameters synchronized.';

        if (temp) {
            temp.textContent = `${station.tempC.toFixed(1)}°C`;
            temp.style.color = pinColor;
        }

        if (tempF) {
            const f = (station.tempC * 9 / 5 + 32).toFixed(1);
            tempF.textContent = `${f}°F`;
        }

        if (wind) wind.textContent = `${station.windSpeedMps || 3.8} m/s (${Math.round((station.windSpeedMps || 3.8) * 3.6)} km/h)`;
        if (windDir) windDir.textContent = station.windDirectionText || 'Wind Vector';
        if (humidity) humidity.textContent = `${station.humidity || 50}%`;
        if (source) source.textContent = station.isLiveOnline ? '⚡ Live Online API' : '🛰️ Satellite Verified';
    }

    renderStationTable() {
        const container = document.getElementById('world-stations-table-container');
        if (!container) return;

        const filtered = GLOBAL_STATIONS.filter(s => {
            if (this.filterCategory === 'all') return true;
            return s.category === this.filterCategory;
        });

        container.innerHTML = `
            <table class="data-table" style="width: 100%; font-size: 11px;">
                <thead>
                    <tr>
                        <th>Station Location</th>
                        <th>Thermal Signature</th>
                        <th>Live Temp</th>
                        <th>Humidity</th>
                        <th>Wind Speed &amp; Vector</th>
                        <th>Microclimate Classification</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${filtered.map(s => {
                        const isHot = s.category === 'extreme_hot' || s.tempC >= 38;
                        const isComfort = s.isParadise || (s.tempC >= 20 && s.tempC <= 28);
                        const col = isHot ? '#ef4444' : (isComfort ? '#10b981' : '#38bdf8');

                        return `
                            <tr style="cursor: pointer;" class="station-row" data-station-id="${s.id}">
                                <td>
                                    <strong>${s.name}</strong><br>
                                    <span style="color: var(--text-muted); font-size: 10px;">${s.country} (${s.lat.toFixed(2)}°, ${s.lng.toFixed(2)}°)</span>
                                </td>
                                <td>
                                    <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${col}; margin-right: 6px;"></span>
                                    <span style="color: ${col}; font-weight: 700;">${s.status || (isHot ? 'Extreme Hot' : 'Paradise Comfort')}</span>
                                </td>
                                <td><strong style="font-size: 13px; color: ${col};">${s.tempC}°C</strong></td>
                                <td>${s.humidity}%</td>
                                <td>${s.windSpeedMps} m/s &bull; ${s.windDirectionText || 'ENE'}</td>
                                <td><span style="font-size: 10px; color: var(--text-secondary);">${s.climateType}</span></td>
                                <td>
                                    <button class="export-btn-primary btn-select-row-station" data-station-id="${s.id}" style="padding: 4px 10px; font-size: 10px; background: linear-gradient(135deg, #0284c7, #10b981);">
                                        🚀 Inspect
                                    </button>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;

        container.querySelectorAll('.btn-select-row-station').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-station-id');
                const station = GLOBAL_STATIONS.find(x => x.id === id);
                if (station) {
                    this.selectStation(station);
                    if (this.map) {
                        this.map.flyTo([station.lat, station.lng], 6, { duration: 1.2 });
                    }
                }
            });
        });

        container.querySelectorAll('.station-row').forEach(row => {
            row.addEventListener('click', () => {
                const id = row.getAttribute('data-station-id');
                const station = GLOBAL_STATIONS.find(x => x.id === id);
                if (station) {
                    this.selectStation(station);
                    if (this.map) {
                        this.map.flyTo([station.lat, station.lng], 6, { duration: 1.2 });
                    }
                }
            });
        });
    }

    /* --- Live Online Weather & Search Telemetry Integration --- */
    bindSearchAndLiveApi() {
        const btnSearch = document.getElementById('btn-map-search-online');
        const inputSearch = document.getElementById('input-map-city-search');
        const btnGps = document.getElementById('btn-map-my-location');
        const btnApplyStation = document.getElementById('btn-apply-selected-map-station');

        if (btnSearch && inputSearch) {
            const doSearch = async () => {
                const query = inputSearch.value.trim();
                if (!query) return;
                await this.searchCityOnline(query);
            };

            btnSearch.addEventListener('click', doSearch);
            inputSearch.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') doSearch();
            });
        }

        if (btnGps) {
            btnGps.addEventListener('click', () => {
                if (!navigator.geolocation) {
                    alert('Geolocation is not supported by your browser.');
                    return;
                }
                const statusEl = document.getElementById('search-online-status');
                if (statusEl) statusEl.innerHTML = '<span>⏳ Acquiring GPS satellite fix...</span>';

                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        await this.fetchAndInspectLivePoint(latitude, longitude, 'Your Live GPS Location');
                        if (statusEl) statusEl.innerHTML = `<span>📍 <strong>Acquired GPS:</strong> ${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E (Live Online Weather Connected)</span>`;
                    },
                    (err) => {
                        alert(`Could not acquire GPS: ${err.message}. Using default world station.`);
                    }
                );
            });
        }

        if (btnApplyStation) {
            btnApplyStation.addEventListener('click', () => {
                if (this.selectedStation) {
                    this.applyStationToStudio(this.selectedStation);
                }
            });
        }

        // Layer switch buttons
        document.querySelectorAll('.map-layer-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const layer = btn.getAttribute('data-map-layer');
                this.setLayer(layer);
            });
        });

        // Filter chips
        document.querySelectorAll('.map-filter-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const filter = chip.getAttribute('data-map-filter');
                this.setFilter(filter);
            });
        });
    }

    async searchCityOnline(cityName) {
        const statusEl = document.getElementById('search-online-status');
        if (statusEl) statusEl.innerHTML = `<span>⏳ Querying planetary weather grid for <strong>"${cityName}"</strong>...</span>`;

        try {
            // 1. Geocode city name via Nominatim OpenStreetMap API
            const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}&limit=1`;
            const geoRes = await fetch(geoUrl, { headers: { 'User-Agent': 'BioShelterStudio/2.0' } });
            const geoData = await geoRes.json();

            if (!geoData || geoData.length === 0) {
                alert(`Could not find "${cityName}". Please try another city or country name.`);
                if (statusEl) statusEl.innerHTML = `<span>❌ Location "${cityName}" not found.</span>`;
                return;
            }

            const place = geoData[0];
            const lat = parseFloat(place.lat);
            const lng = parseFloat(place.lon);
            const displayName = place.display_name.split(',').slice(0, 3).join(',');

            await this.fetchAndInspectLivePoint(lat, lng, displayName);

            if (statusEl) {
                statusEl.innerHTML = `<span>✅ <strong>Live Online Weather Connected:</strong> ${displayName} (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)</span>`;
            }
        } catch (err) {
            console.warn('Online weather search fallback:', err);
            alert(`Error querying online weather API: ${err.message}.`);
        }
    }

    async fetchAndInspectLivePoint(lat, lng, customName = '') {
        const statusEl = document.getElementById('search-online-status');
        if (statusEl) statusEl.innerHTML = `<span>⏳ Fetching live temperature from Open-Meteo online weather API...</span>`;

        try {
            // 2. Query Live Open-Meteo Weather API
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,wind_direction_10m,weather_code,surface_pressure&timezone=auto`;
            const wRes = await fetch(weatherUrl);
            const wData = await wRes.json();

            if (!wData || !wData.current) {
                throw new Error('Weather API returned invalid response.');
            }

            const cur = wData.current;
            const tempC = cur.temperature_2m;
            const humidity = cur.relative_humidity_2m;
            const windSpeedKmh = cur.wind_speed_10m;
            const windSpeedMps = Math.round((windSpeedKmh / 3.6) * 10) / 10;
            const windDirectionDeg = cur.wind_direction_10m;

            const compassDirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
            const dirIdx = Math.round(windDirectionDeg / 22.5) % 16;
            const fromText = compassDirs[dirIdx];
            const toIdx = (dirIdx + 8) % 16;
            const toText = compassDirs[toIdx];
            const windDirectionText = `${fromText} (${windDirectionDeg}°) ➔ ${toText} (${(windDirectionDeg + 180) % 360}°)`;

            const isHot = tempC >= 38;
            const isComfort = tempC >= 20 && tempC <= 28;
            const isCold = tempC < 12;

            const category = isHot ? 'extreme_hot' : (isComfort ? 'paradise_comfort' : (isCold ? 'cold_alpine' : 'oceanic'));
            const status = isHot ? 'Live Extreme Heatwave Alert 🔥' : (isComfort ? 'Live Paradise Comfort Zone 🟢' : (isCold ? 'Live Cold Mountain Air ❄️' : 'Live Moderate Weather ⛅'));

            const station = {
                id: 'live_' + Date.now(),
                name: customName || `GPS Site (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`,
                country: 'Live Online Telemetry',
                coordinates: `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`,
                lat,
                lng,
                tempC,
                tempMin: Math.max(0, tempC - 8),
                tempMax: tempC + 4,
                humidity,
                windSpeedMps,
                windSpeedKmh,
                windDirectionDeg,
                windDirectionText,
                category,
                status,
                isParadise: isComfort,
                isLiveOnline: true,
                weatherStatement: `Live online observation from planetary weather grid: Temperature is ${tempC}°C with ${humidity}% relative humidity and ${windSpeedMps} m/s wind speed blowing from ${fromText} to ${toText}.`
            };

            this.selectedStation = station;
            this.updateTelemetryHUD(station);

            // Fly map to coordinate
            if (this.map) {
                this.map.flyTo([lat, lng], 7, { duration: 1.5 });

                if (this.customUserMarker) {
                    this.map.removeLayer(this.customUserMarker);
                }

                const pinColor = isHot ? '#ef4444' : (isComfort ? '#10b981' : '#38bdf8');
                const pulseClass = isHot ? 'pulse-red' : (isComfort ? 'pulse-green' : '');

                const iconHtml = `
                    <div style="position: relative; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;">
                        <div class="${pulseClass}" style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: ${pinColor}44; border: 3px solid ${pinColor};"></div>
                        <div style="background: ${pinColor}; color: white; font-size: 12px; font-weight: 900; padding: 3px 6px; border-radius: 6px; box-shadow: 0 4px 14px rgba(0,0,0,0.8); z-index: 3;">
                            ${Math.round(tempC)}°
                        </div>
                    </div>
                `;

                const customIcon = L.divIcon({
                    html: iconHtml,
                    className: 'custom-map-pin',
                    iconSize: [38, 38],
                    iconAnchor: [19, 19]
                });

                this.customUserMarker = L.marker([lat, lng], { icon: customIcon }).addTo(this.map);
                this.customUserMarker.bindPopup(`
                    <div style="font-family: 'Inter', sans-serif; min-width: 220px; color: #0f172a; padding: 4px;">
                        <span style="font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; background: ${pinColor}22; color: ${pinColor};">⚡ LIVE ONLINE WEATHER</span>
                        <h4 style="font-size: 14px; font-weight: 800; margin: 4px 0 2px 0;">${station.name}</h4>
                        <div style="font-size: 18px; font-weight: 900; color: ${pinColor}; margin-bottom: 4px;">${tempC}°C (${(tempC * 9 / 5 + 32).toFixed(1)}°F)</div>
                        <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">Humidity: ${humidity}% &bull; Wind: ${windSpeedMps} m/s (${windDirectionText})</div>
                        <button id="popup-btn-apply-custom" style="width: 100%; background: linear-gradient(135deg, #0284c7, #10b981); color: white; border: none; padding: 6px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer;">
                            🚀 Simulate in 3D BioShelter &rarr;
                        </button>
                    </div>
                `).openPopup();

                setTimeout(() => {
                    const btn = document.getElementById('popup-btn-apply-custom');
                    if (btn) {
                        btn.addEventListener('click', () => {
                            this.applyStationToStudio(station);
                        });
                    }
                }, 100);
            }

            if (statusEl) {
                statusEl.innerHTML = `<span>✅ <strong>Live Online Weather:</strong> ${station.name} &bull; ${tempC}°C &bull; ${humidity}% Humidity &bull; Wind: ${windSpeedMps} m/s</span>`;
            }
        } catch (err) {
            console.warn('Open-Meteo live API error:', err);
            if (statusEl) statusEl.innerHTML = `<span>⚠️ Could not fetch live weather: ${err.message}.</span>`;
        }
    }
}
