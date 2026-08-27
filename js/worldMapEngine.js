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
    },

    // 🇮🇳 4. GUJARAT DISTRICTS & INDIAN BIOCLIMATIC STATIONS (GOOGLE ANALYSIS)
    {
        id: 'station_kutch',
        name: 'Kutch / Bhuj (White Rann Desert)',
        country: 'Gujarat, India',
        coordinates: '23.2420° N, 69.6669° E',
        lat: 23.2420,
        lng: 69.6669,
        tempC: 45.2,
        tempMin: 22.0,
        humidity: 18,
        solarGhi: 995,
        wetBulbC: 23.5,
        windSpeedMps: 4.8,
        windSpeedKmh: 17.3,
        windDirectionDeg: 245,
        windFrom: 'WSW',
        windTo: 'ENE',
        windDirectionText: 'WSW (245°) ➔ ENE (65°)',
        zoneId: 'gj_kutch',
        climateType: 'BWh - White Rann Desert Hyper-Arid & Salt Plains',
        status: 'Extreme Desert Heatwave 🔥',
        severity: 'critical',
        category: 'extreme_hot',
        weatherStatement: 'Extreme 45°C+ summer heatwave. Circular vernacular Bhunga construction with thick mud-straw mass & conical thatch roof provides optimal aerodynamic wind deflection and 14°C interior thermal cooling.'
    },
    {
        id: 'station_ahmedabad',
        name: 'Ahmedabad (Heritage Pols & Sabarmati)',
        country: 'Gujarat, India',
        coordinates: '23.0225° N, 72.5714° E',
        lat: 23.0225,
        lng: 72.5714,
        tempC: 43.8,
        tempMin: 25.5,
        humidity: 30,
        solarGhi: 960,
        wetBulbC: 26.2,
        windSpeedMps: 3.6,
        windSpeedKmh: 13.0,
        windDirectionDeg: 225,
        windFrom: 'SW',
        windTo: 'NE',
        windDirectionText: 'SW (225°) ➔ NE (45°)',
        zoneId: 'gj_ahmedabad',
        climateType: 'BSh - Composite Semi-Arid Urban Basin',
        status: 'Urban Heat Island Alert 🔥',
        severity: 'critical',
        category: 'extreme_hot',
        weatherStatement: 'Heritage Pol house courtyard stack effect, Otla transition verandas, underground Tanka rainwater cisterns, and timber jali screens achieve passive comfort.'
    },
    {
        id: 'station_surat',
        name: 'Surat (Tapi Estuary & Marine Corridor)',
        country: 'Gujarat, India',
        coordinates: '21.1702° N, 72.8311° E',
        lat: 21.1702,
        lng: 72.8311,
        tempC: 36.5,
        tempMin: 27.0,
        humidity: 78,
        solarGhi: 840,
        wetBulbC: 31.8,
        windSpeedMps: 4.2,
        windSpeedKmh: 15.1,
        windDirectionDeg: 270,
        windFrom: 'W',
        windTo: 'E',
        windDirectionText: 'W (270°) ➔ E (90°)',
        zoneId: 'gj_surat',
        climateType: 'Aw - Coastal Warm-Humid Marine Estuary',
        status: 'High Humidity Marine Discomfort 🌴',
        severity: 'moderate',
        category: 'oceanic',
        weatherStatement: 'High coastal humidity requires induced cross-ventilation, elevated foundation stilts against estuarine swelling, and breathable lime mortar renders.'
    },
    {
        id: 'station_rajkot',
        name: 'Rajkot (Heart of Saurashtra)',
        country: 'Gujarat, India',
        coordinates: '22.3039° N, 70.8022° E',
        lat: 22.3039,
        lng: 70.8022,
        tempC: 43.0,
        tempMin: 24.5,
        humidity: 28,
        solarGhi: 970,
        wetBulbC: 25.0,
        windSpeedMps: 4.0,
        windSpeedKmh: 14.4,
        windDirectionDeg: 245,
        windFrom: 'WSW',
        windTo: 'ENE',
        windDirectionText: 'WSW (245°) ➔ ENE (65°)',
        zoneId: 'gj_rajkot',
        climateType: 'BSh - Saurashtra Semi-Arid Plateau',
        status: 'Severe Arid Solar Radiation ☀️',
        severity: 'critical',
        category: 'extreme_hot',
        weatherStatement: 'High solar irradiance (970 W/m²). Saurashtra basalt stone masonry with white reflective lime terrace coating discharges diurnal heat.'
    },
    {
        id: 'station_saputara',
        name: 'Dang / Saputara (Sahyadri Cloud Forest)',
        country: 'Gujarat, India',
        coordinates: '20.7580° N, 73.7470° E',
        lat: 20.7580,
        lng: 73.7470,
        tempC: 24.5,
        tempMin: 18.0,
        humidity: 62,
        solarGhi: 820,
        wetBulbC: 18.2,
        windSpeedMps: 3.8,
        windSpeedKmh: 13.7,
        windDirectionDeg: 180,
        windFrom: 'S',
        windTo: 'N',
        windDirectionText: 'S (180°) ➔ N (0°)',
        zoneId: 'gj_dang',
        climateType: 'Cfb - Sahyadri Mountain Hill Station 🌸',
        status: 'Paradise Comfort Haven 🟢',
        severity: 'safe',
        category: 'paradise_comfort',
        isParadise: true,
        weatherStatement: 'Gujarat\'s only hill station (900m altitude). Pure mountain air, lush teak bamboo forests, and steep-pitched roofs for heavy monsoon runoff.'
    },
    {
        id: 'station_dwarka',
        name: 'Devbhumi Dwarka (Western Marine Cape)',
        country: 'Gujarat, India',
        coordinates: '22.2442° N, 68.9685° E',
        lat: 22.2442,
        lng: 68.9685,
        tempC: 34.0,
        tempMin: 26.5,
        humidity: 78,
        solarGhi: 850,
        wetBulbC: 29.5,
        windSpeedMps: 6.8,
        windSpeedKmh: 24.5,
        windDirectionDeg: 230,
        windFrom: 'SW',
        windTo: 'NE',
        windDirectionText: 'SW (230°) ➔ NE (50°)',
        zoneId: 'gj_devbhumi_dwarka',
        climateType: 'BSh - Arabian Sea High-Wind Vortex',
        status: 'Coastal Marine Wind Vortex 🌊',
        severity: 'moderate',
        category: 'oceanic',
        weatherStatement: 'Extreme western marine wind vortex (24.5 km/h) delivers constant sea breeze cooling. Aerodynamic stone dome geometry recommended.'
    },
    {
        id: 'station_patan',
        name: 'Patan (UNESCO Rani Ki Vav Stepwell)',
        country: 'Gujarat, India',
        coordinates: '23.8500° N, 72.1167° E',
        lat: 23.8500,
        lng: 72.1167,
        tempC: 44.5,
        tempMin: 23.0,
        humidity: 22,
        solarGhi: 980,
        wetBulbC: 24.5,
        windSpeedMps: 3.9,
        windSpeedKmh: 14.0,
        windDirectionDeg: 225,
        windFrom: 'SW',
        windTo: 'NE',
        windDirectionText: 'SW (225°) ➔ NE (45°)',
        zoneId: 'gj_patan',
        climateType: 'BWh - Saraswati Basin Desert Transition',
        status: 'Severe Desert Heatwave 🔥',
        severity: 'critical',
        category: 'extreme_hot',
        weatherStatement: 'Home to Rani ki Vav stepwell. Multi-tiered subterranean earth coupling reduces temperatures by 14°C completely passively.'
    },
    {
        id: 'station_navsari',
        name: 'Navsari (Parsi Heritage & Mango Orchards)',
        country: 'Gujarat, India',
        coordinates: '20.9500° N, 72.9333° E',
        lat: 20.9500,
        lng: 72.9333,
        tempC: 35.5,
        tempMin: 25.5,
        humidity: 72,
        solarGhi: 860,
        wetBulbC: 30.2,
        windSpeedMps: 3.8,
        windSpeedKmh: 13.7,
        windDirectionDeg: 225,
        windFrom: 'SW',
        windTo: 'NE',
        windDirectionText: 'SW (225°) ➔ NE (45°)',
        zoneId: 'gj_navsari',
        climateType: 'Aw - South Gujarat Coastal Orchard & Marine Plain',
        status: 'Pleasant Coastal Orchard Breeze 🌴',
        severity: 'safe',
        category: 'oceanic',
        weatherStatement: 'Pristine coastal climate with cooling Arabian sea breezes and lush mango chicory orchards. Parsi house Otla verandas with deep shading louvers provide effortless passive thermal comfort.'
    },
    {
        id: 'station_cherrapunji',
        name: 'Cherrapunji / Mawsynram (Khasi Hills)',
        country: 'Meghalaya, India',
        coordinates: '25.2986° N, 91.5822° E',
        lat: 25.2986,
        lng: 91.5822,
        tempC: 23.8,
        tempMin: 15.0,
        humidity: 90,
        solarGhi: 680,
        wetBulbC: 22.4,
        windSpeedMps: 4.0,
        windSpeedKmh: 14.4,
        windDirectionDeg: 180,
        windFrom: 'S',
        windTo: 'N',
        windDirectionText: 'S (180°) ➔ N (0°)',
        zoneId: 'in_cherrapunji',
        climateType: 'Cwb - World Highest Rainfall Cloud Sanctuary 🌧️',
        status: 'Subtropical Rain Sanctuary 🟢',
        severity: 'safe',
        category: 'paradise_comfort',
        isParadise: true,
        weatherStatement: 'Living root bridges and elevated bamboo stilt sanctuaries adapted to over 11,800mm annual monsoon precipitation.'
    },
    {
        id: 'station_munnar',
        name: 'Munnar (Western Ghats Shola Cloud Forest)',
        country: 'Kerala, India',
        coordinates: '10.0889° N, 77.0595° E',
        lat: 10.0889,
        lng: 77.0595,
        tempC: 22.5,
        tempMin: 14.5,
        humidity: 68,
        solarGhi: 840,
        wetBulbC: 17.8,
        windSpeedMps: 3.2,
        windSpeedKmh: 11.5,
        windDirectionDeg: 270,
        windFrom: 'W',
        windTo: 'E',
        windDirectionText: 'W (270°) ➔ E (90°)',
        zoneId: 'in_munnar',
        climateType: 'Cfb - High Altitude Shola Tea Paradise 🍃',
        status: 'Paradise Comfort Haven 🟢',
        severity: 'safe',
        category: 'paradise_comfort',
        isParadise: true,
        weatherStatement: 'Optimal Western Ghats mountain altitude (1,600m) delivers Goldilocks 22.5°C thermal comfort year-round without mechanical air conditioning.'
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

    switchLayer(layerKey) {
        return this.setLayer(layerKey);
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

    getFilteredStations() {
        return GLOBAL_STATIONS.filter(s => {
            if (!this.filterCategory || this.filterCategory === 'all') return true;
            if (this.filterCategory === 'extreme_hot' || this.filterCategory === 'heatwave') {
                return s.category === 'extreme_hot' || s.tempC >= 38;
            }
            if (this.filterCategory === 'paradise_comfort' || this.filterCategory === 'comfort_eden') {
                return s.isParadise || (s.tempC >= 20 && s.tempC <= 28);
            }
            if (this.filterCategory === 'cold_alpine' || this.filterCategory === 'alpine') {
                return s.category === 'cold_alpine' || s.tempC < 14;
            }
            return s.category === this.filterCategory;
        });
    }

    renderStationMarkers() {
        if (!this.markersLayer) return;
        this.markersLayer.clearLayers();

        const filtered = this.getFilteredStations();

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

        this.renderBioclimaticAnalysis(station);
    }

    generateBioclimaticAnalysis(station) {
        const t = station.tempC;
        const rh = station.humidity || 50;
        const ws = station.windSpeedMps || 3.5;
        const lat = Math.abs(station.lat);

        // 1. Wet-bulb calculation (Stull formula)
        const tw = t * Math.atan(0.151977 * Math.pow(rh + 8.313659, 0.5)) +
            Math.atan(t + rh) -
            Math.atan(rh - 1.676331) +
            0.00391838 * Math.pow(rh, 1.5) * Math.atan(0.023101 * rh) - 4.686035;

        // 2. Adaptive Comfort Temperature (ASHRAE 55)
        const tComf = 17.8 + 0.31 * Math.min(35, Math.max(10, t));
        const comfortDiff = Math.abs(t - tComf);
        let comfortScore = Math.max(10, Math.round(100 - comfortDiff * 4.5));
        if (tw >= 32) comfortScore = Math.min(comfortScore, 12);

        // 3. Thermal Category & Givoni Strategies
        let verdict = '';
        let strategy = '';
        let wallRecommendation = '';
        let roofRecommendation = '';
        let dampingReq = '';
        let ventStrategy = '';
        let solarOverhang = '';
        let groundSink = '';
        let analysisText = '';
        let stressLevel = 'LOW';
        let stressPercent = 20;

        if (t >= 42 || tw >= 30) {
            verdict = '🔥 CATASTROPHIC HEATWAVE / CRITICAL THERMAL THREAT';
            strategy = 'Subterranean Earth-Berming + Kusuda Geothermal Heat Sink + High-Velocity Night Flush';
            wallRecommendation = 'Rammed Earth (400mm) + Earthbag Berm (U = 0.52 W/m²·K, 12.5h lag)';
            roofRecommendation = 'Heavy Terracotta Vault + Soil Vegetative Green Layer (300mm)';
            dampingReq = 'High Thermal Mass (Damping Ratio > 82%, Time Lag > 12 hours)';
            ventStrategy = 'Daytime Envelope Sealing with High-Velocity Night Purge (> 12 ACH)';
            solarOverhang = `${(0.8 + lat * 0.015).toFixed(2)}m Deep Louvered Shading (Total Solar Cutoff)`;
            groundSink = `Earth-Tube Geothermal Exchange at 3.5m depth (${(t - 16).toFixed(1)}°C stable soil sink)`;
            stressLevel = 'CRITICAL SURVIVAL RISK';
            stressPercent = 95;
            analysisText = `This location is experiencing dangerous thermal stress. Ambient dry-bulb (${t.toFixed(1)}°C) and wet-bulb (${tw.toFixed(1)}°C) require high-mass earth coupling to prevent fatal indoor heat buildup. BioShelter subterranean berming reduces indoor peak operative temperatures by up to ${(t - 24.5).toFixed(1)}°C completely without electrical air conditioning.`;
        } else if (t >= 32) {
            if (rh >= 65) {
                verdict = '🌴 TROPICAL HIGH-HUMIDITY / MONSOON HEAT';
                strategy = 'Elevated Open Stilt Structure + Continuous Induced Cross-Ventilation';
                wallRecommendation = 'Breathable Bamboo Lattice + Lime Plaster Render (Lightweight)';
                roofRecommendation = 'Steep Pitched Thatched Straw with Ventilated Ridge Vent Cavity';
                dampingReq = 'Low Thermal Mass (Rapid Heat Dissipation, Time Lag < 3 hours)';
                ventStrategy = 'Continuous Natural Air Movement (Cross-Ventilation > 25 ACH)';
                solarOverhang = `${(0.9 + lat * 0.01).toFixed(2)}m Extended Eaves for Monsoonal Rain & Sun Shading`;
                groundSink = 'Elevated Floor Void to Prevent Ground Moisture Trapping';
                stressLevel = 'HIGH HUMIDITY DISCOMFORT';
                stressPercent = 75;
                analysisText = `High relative humidity (${rh}%) restricts human evaporative sweating. The primary bioclimatic defense is maximising indoor airflow velocity with windward orientation (${station.windDirectionText || 'optimal vector'}) and steep convective roof venting.`;
            } else {
                verdict = '🏜️ HOT ARID DESERT / INTENSE SOLAR IRRADIANCE';
                strategy = 'Heavy Thermal Mass + Solar Chimney Wind Scoop + Night Soil Purge';
                wallRecommendation = 'Compressed Stabilized Earth Blocks (CSEB) 350mm';
                roofRecommendation = 'Vaulted Nubian Earth Dome with Reflective White Lime Slurry';
                dampingReq = 'High Thermal Inertia (Decrement Factor f ≤ 0.22, Lag > 10 hours)';
                ventStrategy = 'Wind Tower (Badgir) with Evaporative Water Pitcher Cooling';
                solarOverhang = `${(0.7 + lat * 0.01).toFixed(2)}m South-Facing Fixed Overhangs`;
                groundSink = `Sub-Slab Geothermal Coupling (Earth temperature: 22°C)`;
                stressLevel = 'MODERATE-HIGH HEAT';
                stressPercent = 65;
                analysisText = `Diurnal temperature swings are substantial. Heavy earth walls store nighttime coolness and release it across peak solar noon, damping indoor temperature swings by ${(t * 0.35).toFixed(1)}°C.`;
            }
        } else if (t >= 19 && t <= 28 && rh >= 35 && rh <= 70) {
            verdict = '🟢 PARADISE COMFORT ZONE / GOLDILOCKS BIOCLIMATIC EDEN';
            strategy = 'Pure Passive Vernacular + Operable Glazing + Biophilic Outdoor Living';
            wallRecommendation = 'Timber Stud with Hemp-Lime Insulative Infill (U = 0.38 W/m²·K)';
            roofRecommendation = 'Green Living Sedge Roof with Rainwater Harvesting Layer';
            dampingReq = 'Balanced Thermal Mass (Decrement Factor f ≈ 0.45)';
            ventStrategy = 'Operable High-Low Hopper Windows for Gentle Natural Airflow';
            solarOverhang = '0.50m Standard Architectural Shading Overhang';
            groundSink = 'Direct Slab-on-Grade with Radiant Thermal Buffer';
            stressLevel = 'OPTIMAL ASHRAE 55 COMFORT';
            stressPercent = 10;
            analysisText = `This destination matches ideal human bioclimatic comfort. Ambient temperature (${t.toFixed(1)}°C) falls directly inside the ASHRAE 55 adaptive comfort polygon, requiring ZERO active heating or cooling energy.`;
        } else if (t < 10) {
            verdict = '❄️ SUB-ZERO / COLD ALPINE HEATING REGIME';
            strategy = 'Super-Insulated Envelope + Trombe Solar Mass Wall + Direct Solar Glazing';
            wallRecommendation = 'Straw Bale Infill (450mm) / Aerated Concrete (U = 0.18 W/m²·K)';
            roofRecommendation = 'Double-Insulated Snow-Shedding High-Pitch Roof (R-50)';
            dampingReq = 'High Insulation + Internal Dark Trombe Heat Storage Wall';
            ventStrategy = 'Airtight Envelope with Heat-Recovery Ventilation (HRV)';
            solarOverhang = 'Minimal Overhang (Maximize Winter Solar Heat Gain)';
            groundSink = 'Frost-Protected Shallow Foundation with Perimeter Insulation';
            stressLevel = 'COLD STRESS';
            stressPercent = 70;
            analysisText = `Cold ambient conditions (${t.toFixed(1)}°C) require minimizing thermal conduction envelope losses. Deep strawbale insulation and south-facing direct solar glazing keep indoor temperatures comfortable passively.`;
        } else {
            verdict = '⛅ TEMPERATE MARITIME / MILD MICROCLIMATE';
            strategy = 'Moderate Thermal Envelope + Seasonal Shading + Night Flush';
            wallRecommendation = 'Fired Clay Brick Cavity Wall with Wood-Fiber Board';
            roofRecommendation = 'Timber Truss with Slate Tiles & Breathable Membrane';
            dampingReq = 'Moderate Thermal Mass';
            ventStrategy = 'Daylight Natural Cross-Breeze';
            solarOverhang = '0.60m Fixed Eaves';
            groundSink = 'Standard Insulated Perimeter Slab';
            stressLevel = 'LOW';
            stressPercent = 25;
            analysisText = `Mild atmospheric conditions require standard bioclimatic tuning with seasonal cross-ventilation and daylight harvesting.`;
        }

        return {
            stationName: station.name,
            tempC: t,
            twC: Math.round(tw * 10) / 10,
            humidity: rh,
            windSpeedMps: ws,
            comfortScore,
            verdict,
            strategy,
            wallRecommendation,
            roofRecommendation,
            dampingReq,
            ventStrategy,
            solarOverhang,
            groundSink,
            stressLevel,
            stressPercent,
            analysisText,
            ashraeComfortable: comfortScore >= 75
        };
    }

    renderBioclimaticAnalysis(station) {
        const panels = document.querySelectorAll('#map-bioclimatic-analysis-panel');
        if (!panels || panels.length === 0) return;

        const analysis = this.generateBioclimaticAnalysis(station);
        const scoreColor = analysis.comfortScore >= 70 ? '#10b981' : (analysis.comfortScore >= 40 ? '#f59e0b' : '#ef4444');

        const html = `
            <!-- Top Header & Verdict -->
            <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 14px; border-bottom: 1px solid var(--border-glass); padding-bottom: 12px;">
                <div>
                    <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: var(--accent-sky); font-weight: 800; display: flex; align-items: center; gap: 6px;">
                        <span>🧠 Automated Bioclimatic Architectural Analysis &amp; Physics Solver</span>
                    </div>
                    <h4 style="font-size: 16px; font-weight: 800; color: var(--text-primary); margin: 4px 0 0 0;">
                        ${analysis.verdict}
                    </h4>
                </div>
                <div style="display: flex; gap: 12px; align-items: center;">
                    <div style="text-align: right;">
                        <div style="font-size: 9px; color: var(--text-muted); text-transform: uppercase;">ASHRAE 55 Comfort Index</div>
                        <div style="font-size: 20px; font-weight: 900; color: ${scoreColor};">
                            ${analysis.comfortScore}% Match
                        </div>
                    </div>
                    <div style="width: 44px; height: 44px; border-radius: 50%; background: ${scoreColor}22; border: 2px solid ${scoreColor}; display: flex; align-items: center; justify-content: center; font-size: 20px;">
                        ${analysis.comfortScore >= 70 ? '🟢' : (analysis.comfortScore >= 40 ? '🟡' : '🔴')}
                    </div>
                </div>
            </div>

            <!-- AI / Mathematical Physics Commentary -->
            <div style="padding: 12px 16px; background: rgba(0,0,0,0.3); border-radius: 8px; border-left: 4px solid var(--accent-sky); margin-bottom: 16px; font-size: 12px; color: var(--text-secondary); line-height: 1.6;">
                <strong style="color: var(--text-primary);">Diagnostic Summary for ${station.name}:</strong> ${analysis.analysisText}
            </div>

            <!-- 4-Grid Bioclimatic Blueprint Recommendation Columns -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; margin-bottom: 16px;">
                <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-glass); border-radius: 8px; padding: 12px;">
                    <div style="font-size: 10px; font-weight: 700; color: var(--accent-sky); text-transform: uppercase;">🧱 Recommended Wall &amp; Roof Physics</div>
                    <div style="font-size: 12px; font-weight: 700; color: var(--text-primary); margin-top: 4px;">${analysis.wallRecommendation}</div>
                    <div style="font-size: 11px; color: var(--text-secondary); margin-top: 3px;">Roof: ${analysis.roofRecommendation}</div>
                </div>

                <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-glass); border-radius: 8px; padding: 12px;">
                    <div style="font-size: 10px; font-weight: 700; color: var(--accent-emerald); text-transform: uppercase;">🌬️ Passive Aerodynamics &amp; Ventilation</div>
                    <div style="font-size: 12px; font-weight: 700; color: var(--text-primary); margin-top: 4px;">${analysis.ventStrategy}</div>
                    <div style="font-size: 11px; color: var(--text-secondary); margin-top: 3px;">Vector: ${station.windDirectionText || 'Dynamic Flow'}</div>
                </div>

                <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-glass); border-radius: 8px; padding: 12px;">
                    <div style="font-size: 10px; font-weight: 700; color: var(--accent-amber); text-transform: uppercase;">☀️ Solar Geometry &amp; Overhang Depth</div>
                    <div style="font-size: 12px; font-weight: 700; color: var(--text-primary); margin-top: 4px;">${analysis.solarOverhang}</div>
                    <div style="font-size: 11px; color: var(--text-secondary); margin-top: 3px;">Calculated for site latitude ${Math.abs(station.lat).toFixed(1)}°.</div>
                </div>

                <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-glass); border-radius: 8px; padding: 12px;">
                    <div style="font-size: 10px; font-weight: 700; color: #a855f7; text-transform: uppercase;">🌍 Kusuda Geothermal Ground Coupling</div>
                    <div style="font-size: 12px; font-weight: 700; color: var(--text-primary); margin-top: 4px;">${analysis.groundSink}</div>
                    <div style="font-size: 11px; color: var(--text-secondary); margin-top: 3px;">Wet-Bulb Temp: ${analysis.twC}°C &bull; Mass: ${analysis.dampingReq}</div>
                </div>
            </div>

            <!-- Live Stress & Comfort Multi-Gauges -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; font-size: 11px;">
                <div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                        <span style="color: var(--text-secondary);">Thermal Stress Level</span>
                        <span style="font-weight: 700; color: ${analysis.stressPercent > 70 ? '#ef4444' : '#10b981'};">${analysis.stressLevel} (${analysis.stressPercent}%)</span>
                    </div>
                    <div style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;">
                        <div style="height: 100%; width: ${analysis.stressPercent}%; background: ${analysis.stressPercent > 70 ? '#ef4444' : (analysis.stressPercent > 40 ? '#f59e0b' : '#10b981')};"></div>
                    </div>
                </div>

                <div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                        <span style="color: var(--text-secondary);">Passive Night Flush Feasibility</span>
                        <span style="font-weight: 700; color: var(--accent-sky);">${station.humidity < 60 ? 'HIGH (88%)' : 'MODERATE (45%)'}</span>
                    </div>
                    <div style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;">
                        <div style="height: 100%; width: ${station.humidity < 60 ? 88 : 45}%; background: #38bdf8;"></div>
                    </div>
                </div>

                <div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                        <span style="color: var(--text-secondary);">Earth Tube Cooling Viability</span>
                        <span style="font-weight: 700; color: var(--accent-emerald);">${Math.abs(station.tempC - 20) > 8 ? 'CRUCIAL (92%)' : 'SECONDARY (35%)'}</span>
                    </div>
                    <div style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;">
                        <div style="height: 100%; width: ${Math.abs(station.tempC - 20) > 8 ? 92 : 35}%; background: #10b981;"></div>
                    </div>
                </div>
            </div>
        `;

        panels.forEach(p => {
            p.innerHTML = html;
        });
    }

    renderStationTable() {
        const container = document.getElementById('world-stations-table-container');
        if (!container) return;

        const filtered = this.getFilteredStations();

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
        const btnSearch = document.getElementById('btn-map-search-online') || document.getElementById('btn-map-city-search');
        const inputSearch = document.getElementById('input-map-city-search');
        const btnGps = document.getElementById('btn-map-my-location') || document.getElementById('btn-map-gps-locate');
        const btnApplyStation = document.getElementById('btn-apply-selected-map-station') || document.getElementById('btn-apply-map-climate');

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
                const statusEls = document.querySelectorAll('#search-online-status');
                statusEls.forEach(s => { s.innerHTML = '<span>⏳ Acquiring GPS satellite fix...</span>'; });

                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        await this.fetchAndInspectLivePoint(latitude, longitude, 'Your Live GPS Location');
                        statusEls.forEach(s => { s.innerHTML = `<span>📍 <strong>Acquired GPS:</strong> ${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E (Live Online Weather Connected)</span>`; });
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
