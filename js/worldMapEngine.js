/**
 * BioShelter Studio - Interactive World Climate & Temperature Map Engine
 * Renders global thermodynamic heatmaps, geo-located temperature telemetry stations,
 * active climate hazard markers (🔴 Red for Extreme Heatwaves, 🟢 Green for Paradise Comfort Havens),
 * wind speed & direction vector overlays, and enables 1-click climate synchronization to the 3D simulator.
 */

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
        weatherStatement: 'Intense direct solar radiation with strong Loo wind gusts up to 28 km/h. High diurnal swing (ΔT > 20°C). Massive rammed-earth thermal mass damping required.'
    },
    {
        id: 'station_dubai',
        name: 'Rub al Khali / Dubai Corridor',
        country: 'United Arab Emirates',
        coordinates: '25.2048° N, 55.2708° E',
        lat: 25.2048,
        lng: 55.2708,
        tempC: 46.8,
        tempMin: 31.0,
        humidity: 48,
        solarGhi: 940,
        wetBulbC: 32.4,
        windSpeedMps: 4.2,
        windSpeedKmh: 15.1,
        windDirectionDeg: 310,
        windFrom: 'North-West (NW / Shamal)',
        windTo: 'South-East (SE)',
        windDirectionText: 'NW (310°) ➔ SE (130°)',
        zoneId: 'hot_arid',
        climateType: 'BWh - Extreme Coastal Arid',
        status: 'High Wet-Bulb Stress ⚠️',
        severity: 'high',
        category: 'extreme_hot',
        weatherStatement: 'Hot coastal humidity creates extreme thermal distress. Northwesterly Shamal winds carry fine dust particles. Badgir wind-catchers with evaporative water cooling active.'
    },
    {
        id: 'station_cairo',
        name: 'Cairo / Sahara Eastern Flank',
        country: 'Egypt',
        coordinates: '30.0444° N, 31.2357° E',
        lat: 30.0444,
        lng: 31.2357,
        tempC: 42.5,
        tempMin: 24.0,
        humidity: 22,
        solarGhi: 910,
        wetBulbC: 22.5,
        windSpeedMps: 3.8,
        windSpeedKmh: 13.7,
        windDirectionDeg: 350,
        windFrom: 'North (N / Etesian)',
        windTo: 'South (S)',
        windDirectionText: 'N (350°) ➔ S (170°)',
        zoneId: 'hot_arid',
        climateType: 'BWh - Subtropical Hot Desert',
        status: 'Extreme Solar Flux',
        severity: 'moderate',
        category: 'extreme_hot',
        weatherStatement: 'Sahara desert dry air with steady northern Mediterranean breeze. Nubian earthen vault architecture provides optimal solar shielding.'
    },
    {
        id: 'station_phoenix',
        name: 'Phoenix / Sonoran Desert',
        country: 'United States',
        coordinates: '33.4484° N, -112.0740° W',
        lat: 33.4484,
        lng: -112.0740,
        tempC: 45.8,
        tempMin: 30.2,
        humidity: 14,
        solarGhi: 970,
        wetBulbC: 21.8,
        windSpeedMps: 4.5,
        windSpeedKmh: 16.2,
        windDirectionDeg: 270,
        windFrom: 'West (W)',
        windTo: 'East (E)',
        windDirectionText: 'W (270°) ➔ E (90°)',
        zoneId: 'hot_arid',
        climateType: 'BWh - Hot Desert Basin',
        status: 'Heat Advisory Active',
        severity: 'high',
        category: 'extreme_hot',
        weatherStatement: 'Persistent urban heat island overlaid on Sonoran Desert basin. Night temperatures fail to drop below 30°C. Earth-berming and deep overhangs essential.'
    },

    // 🟢 2. PARADISE COMFORT DESTINATIONS (20°C - 26°C, IDEAL PLACES TO ENJOY LIFE)
    {
        id: 'station_medellin',
        name: 'Medellín / Aburrá Valley',
        country: 'Colombia',
        coordinates: '6.2442° N, -75.5812° W',
        lat: 6.2442,
        lng: -75.5812,
        tempC: 23.5,
        tempMin: 17.8,
        humidity: 64,
        solarGhi: 680,
        wetBulbC: 18.5,
        windSpeedMps: 2.4,
        windSpeedKmh: 8.6,
        windDirectionDeg: 45,
        windFrom: 'North-East (NE)',
        windTo: 'South-West (SW)',
        windDirectionText: 'NE (45°) ➔ SW (225°)',
        zoneId: 'temperate',
        climateType: 'Cfb - City of Eternal Spring 🌸',
        status: 'Perpetual Spring Comfort Eden 🟢',
        severity: 'paradise',
        category: 'paradise_comfort',
        isParadise: true,
        weatherStatement: 'World-renowned "City of Eternal Spring" maintains steady 23.5°C year-round with gentle valley breezes, lush mountain flora, and zero extreme thermal spikes.'
    },
    {
        id: 'station_madeira',
        name: 'Funchal / Madeira Island',
        country: 'Portugal',
        coordinates: '32.6669° N, -16.9241° W',
        lat: 32.6669,
        lng: -16.9241,
        tempC: 22.8,
        tempMin: 18.2,
        humidity: 62,
        solarGhi: 690,
        wetBulbC: 17.4,
        windSpeedMps: 3.1,
        windSpeedKmh: 11.2,
        windDirectionDeg: 10,
        windFrom: 'North (N)',
        windTo: 'South (S)',
        windDirectionText: 'N (10°) ➔ S (190°)',
        zoneId: 'temperate',
        climateType: 'Csa - Subtropical Oceanic Garden Eden 🌴',
        status: 'Pristine Atlantic Paradise 🟢',
        severity: 'paradise',
        category: 'paradise_comfort',
        isParadise: true,
        weatherStatement: 'Subtropical Gulf Stream thermal buffering creates perpetual temperate spring warmth with crisp ocean air, vibrant botanical gardens, and balmy sea breezes.'
    },
    {
        id: 'station_sandiego',
        name: 'San Diego / La Jolla Coast',
        country: 'United States',
        coordinates: '32.7157° N, -117.1611° W',
        lat: 32.7157,
        lng: -117.1611,
        tempC: 22.4,
        tempMin: 16.5,
        humidity: 58,
        solarGhi: 720,
        wetBulbC: 16.8,
        windSpeedMps: 3.5,
        windSpeedKmh: 12.6,
        windDirectionDeg: 290,
        windFrom: 'West-Northwest (WNW)',
        windTo: 'East-Southeast (ESE)',
        windDirectionText: 'WNW (290°) ➔ ESE (110°)',
        zoneId: 'temperate',
        climateType: 'BSh / Csa - Mediterranean Marine Coastal 🏖️',
        status: 'Optimal Bioclimatic Comfort 🟢',
        severity: 'paradise',
        category: 'paradise_comfort',
        isParadise: true,
        weatherStatement: 'Pacific Ocean thermoregulation delivers over 300 sunny days annually with low humidity, refreshing sea breezes, and effortless indoor-outdoor bioclimatic living.'
    },
    {
        id: 'station_tenerife',
        name: 'Santa Cruz / Tenerife',
        country: 'Spain',
        coordinates: '28.4636° N, -16.2518° W',
        lat: 28.4636,
        lng: -16.2518,
        tempC: 24.1,
        tempMin: 19.5,
        humidity: 56,
        solarGhi: 760,
        wetBulbC: 17.8,
        windSpeedMps: 3.8,
        windSpeedKmh: 13.7,
        windDirectionDeg: 40,
        windFrom: 'North-East (NE / Alisios)',
        windTo: 'South-West (SW)',
        windDirectionText: 'NE (40°) ➔ SW (220°)',
        zoneId: 'temperate',
        climateType: 'BWh / Csa - Island of Eternal Summer ☀️',
        status: 'Subtropical Sunshine Haven 🟢',
        severity: 'paradise',
        category: 'paradise_comfort',
        isParadise: true,
        weatherStatement: 'Consistently rated by bioclimatologists as having one of the world\'s lowest thermal distress scores. Steady northeast trade winds provide natural comfort.'
    },
    {
        id: 'station_kunming',
        name: 'Kunming / Yunnan Plateau',
        country: 'China',
        coordinates: '25.0406° N, 102.7129° E',
        lat: 25.0406,
        lng: 102.7129,
        tempC: 21.6,
        tempMin: 14.2,
        humidity: 55,
        solarGhi: 710,
        wetBulbC: 15.6,
        windSpeedMps: 2.2,
        windSpeedKmh: 7.9,
        windDirectionDeg: 225,
        windFrom: 'South-West (SW)',
        windTo: 'North-East (NE)',
        windDirectionText: 'SW (225°) ➔ NE (45°)',
        zoneId: 'temperate',
        climateType: 'Cwb - Spring City of the Orient (春城) 🌸',
        status: 'Blossom Plateau Haven 🟢',
        severity: 'paradise',
        category: 'paradise_comfort',
        isParadise: true,
        weatherStatement: 'High altitude (1,890m) and low latitude create an uninterrupted blossom season where flowers flourish and outdoor activities are pleasurable all 12 months.'
    },
    {
        id: 'station_ooty',
        name: 'Ooty / Nilgiri Hills (2,240m)',
        country: 'India',
        coordinates: '11.4102° N, 76.6950° E',
        lat: 11.4102,
        lng: 76.6950,
        tempC: 19.8,
        tempMin: 12.0,
        humidity: 58,
        solarGhi: 690,
        wetBulbC: 14.5,
        windSpeedMps: 2.6,
        windSpeedKmh: 9.4,
        windDirectionDeg: 270,
        windFrom: 'West (W)',
        windTo: 'East (E)',
        windDirectionText: 'W (270°) ➔ E (90°)',
        zoneId: 'temperate',
        climateType: 'Cwb - Queen of Hill Stations 🍵',
        status: 'Mountain Tea Country Retreat 🟢',
        severity: 'paradise',
        category: 'paradise_comfort',
        isParadise: true,
        weatherStatement: 'Crisp mountain air and rolling tea plantations provide absolute thermal relief from low-land tropical heat, with cool evenings and fresh pine-scented breezes.'
    },
    {
        id: 'station_lakecomo',
        name: 'Lake Como / Lugano Border',
        country: 'Italy / Switzerland',
        coordinates: '45.9867° N, 9.2562° E',
        lat: 45.9867,
        lng: 9.2562,
        tempC: 23.0,
        tempMin: 16.0,
        humidity: 56,
        solarGhi: 680,
        wetBulbC: 16.4,
        windSpeedMps: 2.0,
        windSpeedKmh: 7.2,
        windDirectionDeg: 180,
        windFrom: 'South (S / Breva)',
        windTo: 'North (N)',
        windDirectionText: 'S (180°) ➔ N (0°)',
        zoneId: 'temperate',
        climateType: 'Cfa - Sub-Alpine Lake Solace ⛵',
        status: 'Alpine Lake Eden 🟢',
        severity: 'paradise',
        category: 'paradise_comfort',
        isParadise: true,
        weatherStatement: 'Sub-Alpine lake microclimate protected from northern winter chills, generating gentle thermal lake breezes that keep summer days wonderfully comfortable.'
    },
    {
        id: 'station_maui',
        name: 'Wailea / Maui Island',
        country: 'United States',
        coordinates: '20.6900° N, -156.4420° W',
        lat: 20.6900,
        lng: -156.4420,
        tempC: 25.5,
        tempMin: 21.0,
        humidity: 64,
        solarGhi: 820,
        wetBulbC: 20.2,
        windSpeedMps: 4.2,
        windSpeedKmh: 15.1,
        windDirectionDeg: 70,
        windFrom: 'East-Northeast (ENE)',
        windTo: 'West-Southwest (WSW)',
        windDirectionText: 'ENE (70°) ➔ WSW (250°)',
        zoneId: 'warm_humid',
        climateType: 'Af / As - Pacific Trade Wind Eden 🌴',
        status: 'Tropical Island Sanctuary 🟢',
        severity: 'paradise',
        category: 'paradise_comfort',
        isParadise: true,
        weatherStatement: 'Persistent 15 km/h Pacific trade winds naturally cool the leeward coastlines, offering ideal swimming and beach conditions with minimal humidity discomfort.'
    },

    // 🔵 3. TEMPERATE & TROPICAL COASTAL REGIONS
    {
        id: 'station_sundarbans',
        name: 'Sundarbans Delta / Bay of Bengal',
        country: 'India / Bangladesh',
        coordinates: '21.9497° N, 89.1833° E',
        lat: 21.9497,
        lng: 89.1833,
        tempC: 34.8,
        tempMin: 27.5,
        humidity: 86,
        solarGhi: 780,
        wetBulbC: 32.5,
        windSpeedMps: 5.8,
        windSpeedKmh: 20.9,
        windDirectionDeg: 160,
        windFrom: 'South-Southeast (SSE)',
        windTo: 'North-Northwest (NNW)',
        windDirectionText: 'SSE (160°) ➔ NNW (340°)',
        zoneId: 'warm_humid',
        climateType: 'Aw - Tropical Monsoon Coastal',
        status: 'Cyclone & Surge Risk 🌊',
        severity: 'high',
        category: 'tropical_coastal',
        weatherStatement: 'High moisture flux and monsoon squalls. Raised stilt bamboo architecture and continuous cross-ventilation essential.'
    },
    {
        id: 'station_delhi',
        name: 'New Delhi / Indo-Gangetic Plain',
        country: 'India',
        coordinates: '28.6139° N, 77.2090° E',
        lat: 28.6139,
        lng: 77.2090,
        tempC: 43.5,
        tempMin: 28.0,
        humidity: 48,
        solarGhi: 860,
        wetBulbC: 30.2,
        windSpeedMps: 3.2,
        windSpeedKmh: 11.5,
        windDirectionDeg: 300,
        windFrom: 'North-West (NW)',
        windTo: 'South-East (SE)',
        windDirectionText: 'NW (300°) ➔ SE (120°)',
        zoneId: 'composite',
        climateType: 'Cwa - Composite Subtropical',
        status: 'High Diurnal Variance',
        severity: 'high',
        category: 'composite',
        weatherStatement: 'Subtropical composite climate with dramatic seasonal shifts from 45°C summer heatwaves to dense winter fog.'
    },
    {
        id: 'station_london',
        name: 'London / Thames Valley Basin',
        country: 'United Kingdom',
        coordinates: '51.5074° N, -0.1278° W',
        lat: 51.5074,
        lng: -0.1278,
        tempC: 22.8,
        tempMin: 14.5,
        humidity: 58,
        solarGhi: 550,
        wetBulbC: 16.5,
        windSpeedMps: 3.6,
        windSpeedKmh: 13.0,
        windDirectionDeg: 230,
        windFrom: 'South-West (SW)',
        windTo: 'North-East (NE)',
        windDirectionText: 'SW (230°) ➔ NE (50°)',
        zoneId: 'temperate',
        climateType: 'Cfb - Oceanic Mild',
        status: 'Comfort Zone Baseline',
        severity: 'low',
        category: 'temperate',
        weatherStatement: 'Mild maritime oceanic climate with balanced humidity and moderate sunshine.'
    },
    {
        id: 'station_tokyo',
        name: 'Tokyo Bay / Kanto Plain',
        country: 'Japan',
        coordinates: '35.6762° N, 139.6503° E',
        lat: 35.6762,
        lng: 139.6503,
        tempC: 27.5,
        tempMin: 20.5,
        humidity: 65,
        solarGhi: 680,
        wetBulbC: 21.8,
        windSpeedMps: 3.0,
        windSpeedKmh: 10.8,
        windDirectionDeg: 170,
        windFrom: 'South (S)',
        windTo: 'North (N)',
        windDirectionText: 'S (170°) ➔ N (350°)',
        zoneId: 'temperate',
        climateType: 'Cfa - Humid Subtropical',
        status: 'Balanced Comfort Limit',
        severity: 'low',
        category: 'temperate',
        weatherStatement: 'Pacific coastal warmth with seasonal typhoons and pleasant spring/autumn transitions.'
    },

    // 🟣 4. COLD ALPINE & HIGH-ALTITUDE MOUNTAINOUS (< 15°C)
    {
        id: 'station_leh',
        name: 'Leh / Ladakh High Plateau (3,500m)',
        country: 'India',
        coordinates: '34.1526° N, 77.5771° E',
        lat: 34.1526,
        lng: 77.5771,
        tempC: 12.4,
        tempMin: -4.5,
        humidity: 22,
        solarGhi: 1020,
        wetBulbC: 3.2,
        windSpeedMps: 4.8,
        windSpeedKmh: 17.3,
        windDirectionDeg: 45,
        windFrom: 'North-East (NE)',
        windTo: 'South-West (SW)',
        windDirectionText: 'NE (45°) ➔ SW (225°)',
        zoneId: 'cold_mountainous',
        climateType: 'ET - Alpine High-Altitude Cold Desert ❄️',
        status: 'Solar Trombe Wall Recommended',
        severity: 'moderate',
        category: 'cold_alpine',
        weatherStatement: 'Sub-zero nighttime temperatures combined with intense thin-air solar irradiance (1,020 W/m²). Passive solar Trombe walls capture vital thermal energy.'
    },
    {
        id: 'station_alps',
        name: 'Zermatt / Swiss Alps Ridge (2,800m)',
        country: 'Switzerland',
        coordinates: '45.9765° N, 7.7491° E',
        lat: 45.9765,
        lng: 7.7491,
        tempC: 6.2,
        tempMin: -8.0,
        humidity: 45,
        solarGhi: 820,
        wetBulbC: 0.5,
        windSpeedMps: 5.5,
        windSpeedKmh: 19.8,
        windDirectionDeg: 315,
        windFrom: 'North-West (NW)',
        windTo: 'South-East (SE)',
        windDirectionText: 'NW (315°) ➔ SE (135°)',
        zoneId: 'cold_mountainous',
        climateType: 'Dfc - Subarctic Alpine Glacial',
        status: 'Sub-Zero Insulation Priority ❄️',
        severity: 'high',
        category: 'cold_alpine',
        weatherStatement: 'High-altitude sub-zero alpine conditions with extreme wind chill factors. Super-insulated compact envelope and triple glazing required.'
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
        this.activeFilter = 'all';
        this.stations = GLOBAL_STATIONS;

        this.initEvents();
    }

    setTheme(isDark) {
        this.isDark = isDark;
        this.render();
    }

    setFilter(category) {
        this.activeFilter = category;
        if (category === 'all') {
            this.stations = GLOBAL_STATIONS;
        } else if (category === 'extreme_hot') {
            this.stations = GLOBAL_STATIONS.filter(s => s.category === 'extreme_hot');
        } else if (category === 'paradise_comfort') {
            this.stations = GLOBAL_STATIONS.filter(s => s.category === 'paradise_comfort' || s.isParadise);
        } else if (category === 'cold_alpine') {
            this.stations = GLOBAL_STATIONS.filter(s => s.category === 'cold_alpine');
        } else {
            this.stations = GLOBAL_STATIONS;
        }
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
                if (dist <= 20) {
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

        this.canvas.addEventListener('click', () => {
            if (this.hoveredStation) {
                this.selectedStation = this.hoveredStation;
                this.render();
                if (this.onSelectStation) {
                    this.onSelectStation(this.selectedStation);
                }
            }
        });
    }

    geoToScreen(lat, lng) {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const padX = 35;
        const padY = 25;
        const mapW = w - padX * 2;
        const mapH = h - padY * 2;

        const x = padX + ((lng + 180) / 360) * mapW;
        const y = padY + ((90 - lat) / 180) * mapH;
        return { x, y };
    }

    getTempColor(tempC) {
        if (tempC >= 45) return '#ef4444'; // Crimson Red: Extreme Heatwave
        if (tempC >= 38) return '#f97316'; // Orange Red: High Heat
        if (tempC >= 30) return '#f59e0b'; // Amber: Warm
        if (tempC >= 20) return '#10b981'; // Emerald Green: Paradise Comfort (20-28°C)
        if (tempC >= 10) return '#38bdf8'; // Sky Blue: Cool
        return '#818cf8'; // Indigo/Purple: Cold Alpine
    }

    render() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        ctx.clearRect(0, 0, w, h);

        // Ocean Background
        ctx.fillStyle = this.isDark ? '#070f20' : '#e0f2fe';
        ctx.fillRect(0, 0, w, h);

        // Graticules
        this.drawGraticule();

        // Continents
        this.drawWorldContinents();

        // Thermal Belts
        this.drawThermalBelts();

        // Stations
        this.drawStationPins();

        // HUD / Tooltip Card
        this.drawHUDCard();
    }

    drawGraticule() {
        const ctx = this.ctx;
        ctx.strokeStyle = this.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)';
        ctx.lineWidth = 1;

        for (let lng = -180; lng <= 180; lng += 30) {
            const { x } = this.geoToScreen(0, lng);
            ctx.beginPath();
            ctx.moveTo(x, 20);
            ctx.lineTo(x, this.canvas.height - 20);
            ctx.stroke();
        }

        for (let lat = -60; lat <= 60; lat += 30) {
            const { y } = this.geoToScreen(lat, 0);
            ctx.beginPath();
            ctx.moveTo(35, y);
            ctx.lineTo(this.canvas.width - 35, y);
            ctx.stroke();
        }

        // Equator highlight
        const eq = this.geoToScreen(0, 0);
        ctx.strokeStyle = this.isDark ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.3)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(35, eq.y);
        ctx.lineTo(this.canvas.width - 35, eq.y);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    drawWorldContinents() {
        const ctx = this.ctx;
        ctx.fillStyle = this.isDark ? 'rgba(30, 41, 59, 0.75)' : 'rgba(203, 213, 225, 0.8)';
        ctx.strokeStyle = this.isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(15, 23, 42, 0.25)';
        ctx.lineWidth = 1.2;

        const continents = [
            // North America
            [[-165, 65], [-140, 70], [-100, 72], [-65, 60], [-60, 45], [-75, 30], [-80, 25], [-95, 18], [-105, 20], [-120, 35], [-125, 50], [-165, 65]],
            // South America
            [[-80, 10], [-60, 10], [-35, -5], [-40, -22], [-55, -35], [-68, -55], [-75, -45], [-80, -20], [-80, 10]],
            // Eurasia
            [[-10, 36], [0, 45], [10, 55], [30, 70], [60, 72], [100, 75], [170, 68], [140, 40], [120, 30], [105, 10], [80, 10], [70, 25], [50, 28], [35, 32], [25, 36], [0, 38], [-10, 36]],
            // Africa
            [[-17, 30], [10, 37], [32, 31], [50, 12], [42, -12], [30, -34], [18, -34], [10, 4], [-15, 12], [-17, 30]],
            // Australia
            [[113, -22], [130, -12], [145, -15], [153, -28], [140, -38], [115, -35], [113, -22]]
        ];

        continents.forEach(poly => {
            ctx.beginPath();
            poly.forEach((pt, idx) => {
                const { x, y } = this.geoToScreen(pt[1], pt[0]);
                if (idx === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        });
    }

    drawThermalBelts() {
        const ctx = this.ctx;
        // Tropical Thermal Red/Orange Glow Belt
        const { y: yNorth } = this.geoToScreen(35, 0);
        const { y: ySouth } = this.geoToScreen(-35, 0);

        const grad = ctx.createLinearGradient(0, yNorth, 0, ySouth);
        grad.addColorStop(0, 'rgba(239, 68, 68, 0.0)');
        grad.addColorStop(0.3, 'rgba(239, 68, 68, 0.08)');
        grad.addColorStop(0.5, 'rgba(245, 158, 11, 0.12)');
        grad.addColorStop(0.7, 'rgba(239, 68, 68, 0.08)');
        grad.addColorStop(1, 'rgba(239, 68, 68, 0.0)');

        ctx.fillStyle = grad;
        ctx.fillRect(35, yNorth, this.canvas.width - 70, ySouth - yNorth);
    }

    drawStationPins() {
        const ctx = this.ctx;

        this.stations.forEach(st => {
            const { x, y } = this.geoToScreen(st.lat, st.lng);
            const isSelected = this.selectedStation && this.selectedStation.id === st.id;
            const isHovered = this.hoveredStation && this.hoveredStation.id === st.id;
            const col = this.getTempColor(st.tempC);

            // Pulsing Outer Heat Ring
            ctx.beginPath();
            ctx.arc(x, y, isSelected ? 16 : (isHovered ? 12 : 8), 0, Math.PI * 2);
            ctx.fillStyle = col + (isSelected ? '44' : '22');
            ctx.fill();

            // Intermediate Ring
            ctx.beginPath();
            ctx.arc(x, y, isSelected ? 9 : 6, 0, Math.PI * 2);
            ctx.fillStyle = col;
            ctx.fill();

            // Core Pin
            ctx.beginPath();
            ctx.arc(x, y, isSelected ? 4.5 : 3, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();

            // Temperature Label Tag
            ctx.font = 'bold 10px "JetBrains Mono", monospace';
            ctx.fillStyle = isSelected ? '#ffffff' : col;
            ctx.fillText(`${st.tempC}°C`, x + 10, y - 6);

            // Paradise Icon or Fire Icon
            if (st.isParadise) {
                ctx.font = '10px sans-serif';
                ctx.fillText('🌴', x - 18, y - 6);
            } else if (st.tempC >= 45) {
                ctx.font = '10px sans-serif';
                ctx.fillText('🔥', x - 18, y - 6);
            }
        });
    }

    drawHUDCard() {
        const ctx = this.ctx;
        const st = this.hoveredStation || this.selectedStation;
        if (!st) return;

        const cardW = 320;
        const cardH = 150;
        const cardX = 45;
        const cardY = this.canvas.height - cardH - 35;

        // Card Glass Background
        ctx.fillStyle = this.isDark ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.95)';
        ctx.strokeStyle = this.getTempColor(st.tempC);
        ctx.lineWidth = 1.5;

        // Rounded Box
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, cardH, 10);
        ctx.fill();
        ctx.stroke();

        // Card Title & Country
        ctx.font = 'bold 12px "Outfit", sans-serif';
        ctx.fillStyle = this.isDark ? '#f8fafc' : '#0f172a';
        ctx.fillText(`${st.name}, ${st.country}`, cardX + 14, cardY + 22);

        // Status Badge
        ctx.font = 'bold 10px "Inter", sans-serif';
        ctx.fillStyle = this.getTempColor(st.tempC);
        ctx.fillText(`${st.status}`, cardX + 14, cardY + 38);

        // Temperature & Humidity Row
        ctx.font = 'bold 18px "JetBrains Mono", monospace';
        ctx.fillStyle = this.getTempColor(st.tempC);
        ctx.fillText(`${st.tempC}°C`, cardX + 14, cardY + 65);

        ctx.font = '11px "Inter", sans-serif';
        ctx.fillStyle = this.isDark ? '#94a3b8' : '#475569';
        ctx.fillText(`Wet-Bulb: ${st.wetBulbC}°C | RH: ${st.humidity}%`, cardX + 90, cardY + 62);

        // Wind Speed & Direction Row
        ctx.font = 'bold 11px "Inter", sans-serif';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(`💨 Wind: ${st.windSpeedMps || 3.5} m/s (${st.windSpeedKmh || 12.6} km/h) | ${st.windDirectionText || 'NW ➔ SE'}`, cardX + 14, cardY + 86);

        // Brief Weather Statement snippet
        ctx.font = '10px "Inter", sans-serif';
        ctx.fillStyle = this.isDark ? '#cbd5e1' : '#334155';
        const stmt = st.weatherStatement || 'Passive bioclimatic microclimate active.';
        const snippet = stmt.length > 70 ? stmt.substring(0, 67) + '...' : stmt;
        ctx.fillText(snippet, cardX + 14, cardY + 108);

        // Click Callout
        ctx.font = 'bold 10px "Outfit", sans-serif';
        ctx.fillStyle = '#10b981';
        ctx.fillText('⚡ Click to load this microclimate into 3D BioShelter Studio', cardX + 14, cardY + 130);
    }
}
