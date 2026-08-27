/**
 * BioShelter Studio - Climate Engine
 * Diurnal Weather Synthesizer & Area-Specific Microclimate Models
 * Includes Full 33 Gujarat Districts & Major Indian Climate Zones (Google Meteorologic Grid)
 */

export const GUJARAT_DISTRICTS = {
    gj_kutch: {
        id: 'gj_kutch',
        name: 'Kutch / Bhuj (White Rann Desert)',
        state: 'Gujarat',
        region: 'North-West Arid Desert & Salt Plains',
        description: 'Extreme hot-arid desert climate with high diurnal delta (DTR > 22°C), severe summer heatwaves (45°C+), and intense saline dust winds. Vernacular Bhunga architecture with circular aerodynamics and thick mud insulation is optimal.',
        latitude: 23.2420,
        longitude: 69.6669,
        defaults: {
            tMax: 45.2,
            tMin: 22.0,
            rhDay: 18,
            rhNight: 48,
            ghiPeak: 995,
            windSpeedAvg: 4.8,
            windDirection: 'WSW',
            groundTempAvg: 29.0
        },
        bioclimaticZones: { comfortLow: 21.0, comfortHigh: 28.5, adaptiveNeutral: 27.5 },
        recommendedTypology: 'bhunga_circular_dome',
        recommendedWalls: 'rammed_earth_400',
        recommendedRoof: 'conical_thatch_mud',
        recommendedVentMode: 'night_purge',
        soilType: 'desert_sand',
        vernacularFeature: 'Circular Bhunga with conical thatched roof, earthquake-resistant ring-beam, and Lippan mud-mirror insulation.'
    },
    gj_ahmedabad: {
        id: 'gj_ahmedabad',
        name: 'Ahmedabad (Heritage Pols & Sabarmati)',
        state: 'Gujarat',
        region: 'Central Composite Semi-Arid',
        description: 'Hot semi-arid climate with peak summer dry-bulb of 44°C and heavy monsoon spikes. Traditional Pol houses utilize deep narrow streets, internal courtyards (Chowks), underground rainwater cisterns (Tanka), and intricate wooden jali screens.',
        latitude: 23.0225,
        longitude: 72.5714,
        defaults: {
            tMax: 43.8,
            tMin: 25.5,
            rhDay: 30,
            rhNight: 62,
            ghiPeak: 960,
            windSpeedAvg: 3.6,
            windDirection: 'SW',
            groundTempAvg: 27.5
        },
        bioclimaticZones: { comfortLow: 20.5, comfortHigh: 28.0, adaptiveNeutral: 26.5 },
        recommendedTypology: 'vernacular_courtyard',
        recommendedWalls: 'cseb_interlocking_230',
        recommendedRoof: 'double_skin_vented',
        recommendedVentMode: 'adaptive_diurnal',
        soilType: 'alluvial_loam',
        vernacularFeature: 'Pol house courtyard stack effect, Otla transition porches, and underground Tanka water cooling reservoirs.'
    },
    gj_surat: {
        id: 'gj_surat',
        name: 'Surat (Tapi Estuary & Coastal Hub)',
        state: 'Gujarat',
        region: 'South Coastal Warm-Humid',
        description: 'Coastal maritime climate with persistent high humidity (RH > 78%), warm sea breezes, and heavy monsoon rains. Requires maximum open cross-ventilation, shaded overhangs, and marine-grade corrosion-resistant lime renders.',
        latitude: 21.1702,
        longitude: 72.8311,
        defaults: {
            tMax: 36.5,
            tMin: 27.0,
            rhDay: 75,
            rhNight: 88,
            ghiPeak: 840,
            windSpeedAvg: 4.2,
            windDirection: 'W',
            groundTempAvg: 28.5
        },
        bioclimaticZones: { comfortLow: 23.0, comfortHigh: 29.5, adaptiveNeutral: 28.0 },
        recommendedTypology: 'stilt_vernacular',
        recommendedWalls: 'bamboo_mud_infill',
        recommendedRoof: 'thatched_high_pitch',
        recommendedVentMode: 'continuous_cross',
        soilType: 'black_cotton_clay',
        vernacularFeature: 'Elevated timber stilt plinths to prevent estuarine inundation with deep wind-catching jharokhas.'
    },
    gj_rajkot: {
        id: 'gj_rajkot',
        name: 'Rajkot (Heart of Saurashtra)',
        state: 'Gujarat',
        region: 'Saurashtra Semi-Arid Plateau',
        description: 'High solar irradiance with hot dry summers (43°C) and clear winter skies. Demands massive stone/earth thermal inertia and reflective cool-roof coatings.',
        latitude: 22.3039,
        longitude: 70.8022,
        defaults: {
            tMax: 43.0,
            tMin: 24.5,
            rhDay: 28,
            rhNight: 58,
            ghiPeak: 970,
            windSpeedAvg: 4.0,
            windDirection: 'WSW',
            groundTempAvg: 27.0
        },
        bioclimaticZones: { comfortLow: 21.0, comfortHigh: 28.0, adaptiveNeutral: 26.8 },
        recommendedTypology: 'vernacular_courtyard',
        recommendedWalls: 'rammed_earth_300',
        recommendedRoof: 'vaulted_earth_terracotta',
        recommendedVentMode: 'night_purge',
        soilType: 'black_cotton_clay',
        vernacularFeature: 'Saurashtra stone-lime composite masonry with shaded central courtyards.'
    },
    gj_vadodara: {
        id: 'gj_vadodara',
        name: 'Vadodara (Cultural Capital & Mahi Basin)',
        state: 'Gujarat',
        region: 'Central Alluvial Plain',
        description: 'Composite climate with intense summer dry periods followed by humid monsoon. Features deep shaded colonial verandas, brick arcades, and stepwell-inspired cooling.',
        latitude: 22.3072,
        longitude: 73.1812,
        defaults: {
            tMax: 42.5,
            tMin: 25.0,
            rhDay: 32,
            rhNight: 64,
            ghiPeak: 950,
            windSpeedAvg: 3.4,
            windDirection: 'SW',
            groundTempAvg: 27.2
        },
        bioclimaticZones: { comfortLow: 21.0, comfortHigh: 28.0, adaptiveNeutral: 26.5 },
        recommendedTypology: 'vernacular_courtyard',
        recommendedWalls: 'cseb_interlocking_230',
        recommendedRoof: 'double_skin_vented',
        recommendedVentMode: 'adaptive_diurnal',
        soilType: 'alluvial_loam',
        vernacularFeature: 'Brick arched verandas, high-ceiling clerestory heat-purge vents, and lush foliage buffers.'
    },
    gj_dang: {
        id: 'gj_dang',
        name: 'Dang / Saputara (Sahyadri Cloud Forest)',
        state: 'Gujarat',
        region: 'South Gujarat Mountain Hill Station',
        description: 'Gujarat\'s only hill station nestled in the Sahyadri mountains (altitude ~900m). Mild, pleasant temperatures (22-30°C in summer, 12-18°C in winter) with massive 2,500mm monsoon rainfall. Dense teak bamboo forests provide pure negative-ion air.',
        latitude: 20.7580,
        longitude: 73.7470,
        defaults: {
            tMax: 30.5,
            tMin: 18.0,
            rhDay: 60,
            rhNight: 85,
            ghiPeak: 820,
            windSpeedAvg: 3.8,
            windDirection: 'S',
            groundTempAvg: 21.0
        },
        bioclimaticZones: { comfortLow: 19.0, comfortHigh: 26.5, adaptiveNeutral: 24.0 },
        recommendedTypology: 'modular_transitional',
        recommendedWalls: 'bamboo_mud_infill',
        recommendedRoof: 'thatched_high_pitch',
        recommendedVentMode: 'comfort_vent',
        soilType: 'laterite_red_soil',
        vernacularFeature: 'Steep-pitched bamboo and Mangalore tile roofs designed for torrential monsoon runoff and natural hillside breeze capture.'
    },
    gj_jamnagar: {
        id: 'gj_jamnagar',
        name: 'Jamnagar (Gulf of Kutch Coastal)',
        state: 'Gujarat',
        region: 'Gulf of Kutch Marine Belt',
        description: 'Coastal semi-arid climate with high saline winds, warm summers (39°C), and moderate winters. Salt-mist resistant stone masonry and windward fenestrations are essential.',
        latitude: 22.4707,
        longitude: 70.0577,
        defaults: {
            tMax: 39.0,
            tMin: 24.5,
            rhDay: 62,
            rhNight: 80,
            ghiPeak: 920,
            windSpeedAvg: 4.5,
            windDirection: 'WNW',
            groundTempAvg: 27.5
        },
        bioclimaticZones: { comfortLow: 22.0, comfortHigh: 28.5, adaptiveNeutral: 27.0 },
        recommendedTypology: 'stilt_vernacular',
        recommendedWalls: 'cseb_interlocking_230',
        recommendedRoof: 'double_skin_vented',
        recommendedVentMode: 'continuous_cross',
        soilType: 'alluvial_loam',
        vernacularFeature: 'Yellow coastal sandstone construction with lime wash and deep sun-shading eaves.'
    },
    gj_bhavnagar: {
        id: 'gj_bhavnagar',
        name: 'Bhavnagar (Gulf of Khambhat Marine)',
        state: 'Gujarat',
        region: 'Saurashtra Coastline',
        description: 'Coastal maritime climate influenced by Gulf of Khambhat tidal currents. High summer temperatures (40°C) with brisk afternoon sea breezes.',
        latitude: 21.7645,
        longitude: 72.1519,
        defaults: {
            tMax: 40.0,
            tMin: 25.5,
            rhDay: 55,
            rhNight: 78,
            ghiPeak: 930,
            windSpeedAvg: 4.2,
            windDirection: 'SSW',
            groundTempAvg: 27.8
        },
        bioclimaticZones: { comfortLow: 21.5, comfortHigh: 28.5, adaptiveNeutral: 26.8 },
        recommendedTypology: 'vernacular_courtyard',
        recommendedWalls: 'rammed_earth_300',
        recommendedRoof: 'vaulted_earth_terracotta',
        recommendedVentMode: 'continuous_cross',
        soilType: 'black_cotton_clay',
        vernacularFeature: 'Marine-oriented cross-breeze capture with high-inertia ground floor and light upper pavilion.'
    },
    gj_junagadh: {
        id: 'gj_junagadh',
        name: 'Junagadh (Girnar Foothills & Gir Sanctuary)',
        state: 'Gujarat',
        region: 'Saurashtra Foothills',
        description: 'Sub-tropical foothills climate nestled around Mount Girnar. High summer daytime peaks (41.5°C) with cool evening mountain breezes from the deciduous Gir forest canopy.',
        latitude: 21.5222,
        longitude: 70.4579,
        defaults: {
            tMax: 41.5,
            tMin: 23.5,
            rhDay: 42,
            rhNight: 72,
            ghiPeak: 940,
            windSpeedAvg: 3.5,
            windDirection: 'SW',
            groundTempAvg: 26.5
        },
        bioclimaticZones: { comfortLow: 20.5, comfortHigh: 27.5, adaptiveNeutral: 26.0 },
        recommendedTypology: 'vernacular_courtyard',
        recommendedWalls: 'rammed_earth_300',
        recommendedRoof: 'vaulted_earth_terracotta',
        recommendedVentMode: 'adaptive_diurnal',
        soilType: 'black_cotton_clay',
        vernacularFeature: 'Basaltic trap rock masonry with deep veranda porticos and nocturnal mountain breeze vents.'
    },
    gj_porbandar: {
        id: 'gj_porbandar',
        name: 'Porbandar (Arabian Sea Shore & Limestone)',
        state: 'Gujarat',
        region: 'Arabian Sea Shoreline',
        description: 'Pristine coastal climate with high oceanic humidity (RH 80%+), constant sea breeze, and mild winters. Famous for Porbandar Miliolite limestone quarries which offer natural breathability and thermal damping.',
        latitude: 21.6417,
        longitude: 69.6293,
        defaults: {
            tMax: 35.0,
            tMin: 26.0,
            rhDay: 78,
            rhNight: 89,
            ghiPeak: 870,
            windSpeedAvg: 4.8,
            windDirection: 'SW',
            groundTempAvg: 28.0
        },
        bioclimaticZones: { comfortLow: 23.0, comfortHigh: 29.0, adaptiveNeutral: 27.5 },
        recommendedTypology: 'stilt_vernacular',
        recommendedWalls: 'cseb_interlocking_230',
        recommendedRoof: 'double_skin_vented',
        recommendedVentMode: 'continuous_cross',
        soilType: 'alluvial_loam',
        vernacularFeature: 'Porous white Porbandar stone ashlar masonry that breathes moisture and resists maritime saline decay.'
    },
    gj_gandhinagar: {
        id: 'gj_gandhinagar',
        name: 'Gandhinagar (Green Urban Forest Capital)',
        state: 'Gujarat',
        region: 'North-Central Urban Forest',
        description: 'Green capital with over 50% tree canopy coverage creating a beneficial localized urban microclimate that lowers ambient heat island peaks by 2-3°C.',
        latitude: 23.2156,
        longitude: 72.6369,
        defaults: {
            tMax: 42.5,
            tMin: 24.8,
            rhDay: 32,
            rhNight: 60,
            ghiPeak: 950,
            windSpeedAvg: 3.2,
            windDirection: 'SW',
            groundTempAvg: 26.8
        },
        bioclimaticZones: { comfortLow: 20.5, comfortHigh: 28.0, adaptiveNeutral: 26.2 },
        recommendedTypology: 'vernacular_courtyard',
        recommendedWalls: 'cseb_interlocking_230',
        recommendedRoof: 'double_skin_vented',
        recommendedVentMode: 'adaptive_diurnal',
        soilType: 'alluvial_loam',
        vernacularFeature: 'Urban biophilic integration with deep south-facing tree shading and green vegetative roof terraces.'
    },
    gj_patan: {
        id: 'gj_patan',
        name: 'Patan (UNESCO Rani Ki Vav Stepwell)',
        state: 'Gujarat',
        region: 'North Gujarat Saraswati Basin',
        description: 'Hot arid transition climate (44.5°C peak). Famous worldwide for the UNESCO World Heritage Rani ki Vav — an inverted subterranean 7-level stepwell that engineered passive evaporative microclimates lowering temperatures by up to 14°C below surface ground.',
        latitude: 23.8500,
        longitude: 72.1167,
        defaults: {
            tMax: 44.5,
            tMin: 23.0,
            rhDay: 22,
            rhNight: 52,
            ghiPeak: 980,
            windSpeedAvg: 3.9,
            windDirection: 'SW',
            groundTempAvg: 28.5
        },
        bioclimaticZones: { comfortLow: 21.0, comfortHigh: 28.5, adaptiveNeutral: 27.2 },
        recommendedTypology: 'wind_tower',
        recommendedWalls: 'rammed_earth_400',
        recommendedRoof: 'vaulted_earth_terracotta',
        recommendedVentMode: 'night_purge',
        soilType: 'desert_sand',
        vernacularFeature: 'Multi-tiered subterranean stepwell earth-buffering principles with integrated evaporative water bodies.'
    },
    gj_mehsana: {
        id: 'gj_mehsana',
        name: 'Mehsana (Modhera Sun Temple Axis)',
        state: 'Gujarat',
        region: 'North Gujarat Solar Axis',
        description: 'Home to the iconic 11th-century Modhera Sun Temple engineered to capture equinox solar geometry. Intense direct solar flux (975 W/m²) and hot dry summer winds.',
        latitude: 23.5880,
        longitude: 72.3693,
        defaults: {
            tMax: 44.0,
            tMin: 23.8,
            rhDay: 24,
            rhNight: 54,
            ghiPeak: 975,
            windSpeedAvg: 3.7,
            windDirection: 'SW',
            groundTempAvg: 28.0
        },
        bioclimaticZones: { comfortLow: 21.0, comfortHigh: 28.0, adaptiveNeutral: 27.0 },
        recommendedTypology: 'wind_tower',
        recommendedWalls: 'rammed_earth_300',
        recommendedRoof: 'vaulted_earth_terracotta',
        recommendedVentMode: 'night_purge',
        soilType: 'alluvial_loam',
        vernacularFeature: 'Solar-aligned architectural massing, stepped kund water evaporators, and deep louvered facades.'
    },
    gj_banaskantha: {
        id: 'gj_banaskantha',
        name: 'Banaskantha / Palanpur (Thar Border)',
        state: 'Gujarat',
        region: 'North Desert Frontier',
        description: 'Bordering the Thar Desert, experiences fierce dry heatwaves (45°C) and sudden sandstorms (Andhi). Requires airtight sandstorm-sealing and earth-bermed mass.',
        latitude: 24.1725,
        longitude: 72.4346,
        defaults: {
            tMax: 44.8,
            tMin: 22.5,
            rhDay: 19,
            rhNight: 48,
            ghiPeak: 990,
            windSpeedAvg: 4.4,
            windDirection: 'WSW',
            groundTempAvg: 29.0
        },
        bioclimaticZones: { comfortLow: 21.0, comfortHigh: 28.5, adaptiveNeutral: 27.5 },
        recommendedTypology: 'wind_tower',
        recommendedWalls: 'rammed_earth_400',
        recommendedRoof: 'vaulted_earth_terracotta',
        recommendedVentMode: 'night_purge',
        soilType: 'desert_sand',
        vernacularFeature: 'Subterranean earth-tube cooling loops with sandstorm dust baffle filters.'
    },
    gj_devbhumi_dwarka: {
        id: 'gj_devbhumi_dwarka',
        name: 'Devbhumi Dwarka (Western Marine Cape)',
        state: 'Gujarat',
        region: 'Westernmost Tip of India',
        description: 'Extreme maritime wind vortex on the western edge of India. Sustained wind speeds (6.8 m/s) provide phenomenal natural wind turbine and cooling potential.',
        latitude: 22.2442,
        longitude: 68.9685,
        defaults: {
            tMax: 34.0,
            tMin: 26.5,
            rhDay: 78,
            rhNight: 90,
            ghiPeak: 850,
            windSpeedAvg: 6.8,
            windDirection: 'SW',
            groundTempAvg: 28.0
        },
        bioclimaticZones: { comfortLow: 23.0, comfortHigh: 29.5, adaptiveNeutral: 28.0 },
        recommendedTypology: 'stilt_vernacular',
        recommendedWalls: 'cseb_interlocking_230',
        recommendedRoof: 'double_skin_vented',
        recommendedVentMode: 'continuous_cross',
        soilType: 'alluvial_loam',
        vernacularFeature: 'Aerodynamic wind-deflective dome geometries harnessing strong western Arabian sea gales.'
    },
    gj_valsad: {
        id: 'gj_valsad',
        name: 'Valsad (Konkan Monsoon Gateway)',
        state: 'Gujarat',
        region: 'Southmost Coastal High-Rainfall Belt',
        description: 'Gateway to the Konkan coast receiving intense monsoonal precipitation (>2,200mm). Tropical coastal warmth with high air humidity.',
        latitude: 20.6100,
        longitude: 72.9260,
        defaults: {
            tMax: 34.8,
            tMin: 25.0,
            rhDay: 76,
            rhNight: 90,
            ghiPeak: 840,
            windSpeedAvg: 4.1,
            windDirection: 'SW',
            groundTempAvg: 27.5
        },
        bioclimaticZones: { comfortLow: 23.0, comfortHigh: 29.2, adaptiveNeutral: 27.8 },
        recommendedTypology: 'stilt_vernacular',
        recommendedWalls: 'bamboo_mud_infill',
        recommendedRoof: 'thatched_high_pitch',
        recommendedVentMode: 'continuous_cross',
        soilType: 'laterite_red_soil',
        vernacularFeature: 'Deep Mangalore tile overhangs protecting from monsoonal rain driving while allowing continuous sea airflow.'
    }
};

export const INDIAN_DISTRICTS = {
    in_jaisalmer: {
        id: 'in_jaisalmer',
        name: 'Jaisalmer (Thar Desert Golden City, Rajasthan)',
        state: 'Rajasthan',
        region: 'Thar Great Desert Core',
        description: 'Peak arid desert heatwave (48°C+). Intricate yellow sandstone Jharokha stone screens, deep stepwells, and massive 450mm thermal mass walls.',
        latitude: 26.9157,
        longitude: 70.9083,
        defaults: { tMax: 48.0, tMin: 26.0, rhDay: 15, rhNight: 40, ghiPeak: 1020, windSpeedAvg: 4.6, windDirection: 'SW', groundTempAvg: 30.0 },
        bioclimaticZones: { comfortLow: 21.0, comfortHigh: 29.0, adaptiveNeutral: 28.0 },
        recommendedTypology: 'wind_tower',
        recommendedWalls: 'rammed_earth_400',
        recommendedRoof: 'vaulted_earth_terracotta',
        recommendedVentMode: 'night_purge',
        soilType: 'desert_sand',
        vernacularFeature: 'Intricate carved sandstone Jharokhas accelerating Venturi airflow while blocking 100% of solar radiation.'
    },
    in_leh_ladakh: {
        id: 'in_leh_ladakh',
        name: 'Leh Ladakh (High Altitude Cold Desert, Himalayas)',
        state: 'Ladakh',
        region: 'Trans-Himalayan Cold Desert (3,500m)',
        description: 'Sub-zero winters (-12°C) with intense high-altitude solar flux (1,080 W/m²). Vernacular Trombe walls, mud-straw bricks, and south-facing direct solar glazing keep interiors comfortable without fossil fuels.',
        latitude: 34.1526,
        longitude: 77.5771,
        defaults: { tMax: 14.0, tMin: -12.0, rhDay: 22, rhNight: 45, ghiPeak: 1080, windSpeedAvg: 4.8, windDirection: 'NE', groundTempAvg: 3.0 },
        bioclimaticZones: { comfortLow: 18.0, comfortHigh: 24.0, adaptiveNeutral: 21.0 },
        recommendedTypology: 'solar_trombe_wall',
        recommendedWalls: 'stone_straw_insul_350',
        recommendedRoof: 'insulated_compact_flat',
        recommendedVentMode: 'minimum_airtight',
        soilType: 'alpine_permafrost_scree',
        vernacularFeature: 'Dark solar Trombe walls storing daytime radiation and releasing it into sleeping quarters at sub-zero midnight.'
    },
    in_cherrapunji: {
        id: 'in_cherrapunji',
        name: 'Cherrapunji / Mawsynram (Khasi Hills, Meghalaya)',
        state: 'Meghalaya',
        region: 'World\'s Highest Rainfall Zone (11,800mm/yr)',
        description: 'Torrential monsoonal clouds, mist, and extreme humidity. Home to indigenous living root bridges, elevated bamboo stilt structures, and steep thatched roofs.',
        latitude: 25.2986,
        longitude: 91.5822,
        defaults: { tMax: 24.5, tMin: 15.0, rhDay: 88, rhNight: 98, ghiPeak: 680, windSpeedAvg: 4.0, windDirection: 'S', groundTempAvg: 19.0 },
        bioclimaticZones: { comfortLow: 19.5, comfortHigh: 26.0, adaptiveNeutral: 23.5 },
        recommendedTypology: 'stilt_vernacular',
        recommendedWalls: 'bamboo_mud_infill',
        recommendedRoof: 'thatched_high_pitch',
        recommendedVentMode: 'continuous_cross',
        soilType: 'laterite_red_soil',
        vernacularFeature: 'Bio-engineered Living Root Bridges (Ficus elastica) and elevated bamboo stilt sanctuaries.'
    },
    in_nagpur: {
        id: 'in_nagpur',
        name: 'Nagpur (Zero Mile Thermal Heart of India, Maharashtra)',
        state: 'Maharashtra',
        region: 'Vidarbha Central Plateau',
        description: 'Geographical center of India with extreme 47°C summer heatwaves. Heavy black cotton soil and rammed earth construction with night purge venting.',
        latitude: 21.1458,
        longitude: 79.0882,
        defaults: { tMax: 46.8, tMin: 26.5, rhDay: 22, rhNight: 55, ghiPeak: 980, windSpeedAvg: 3.6, windDirection: 'WNW', groundTempAvg: 29.0 },
        bioclimaticZones: { comfortLow: 21.0, comfortHigh: 28.5, adaptiveNeutral: 27.5 },
        recommendedTypology: 'vernacular_courtyard',
        recommendedWalls: 'rammed_earth_400',
        recommendedRoof: 'vaulted_earth_terracotta',
        recommendedVentMode: 'night_purge',
        soilType: 'black_cotton_clay',
        vernacularFeature: 'High thermal inertia envelope with sub-slab geothermal earth cooling loops.'
    },
    in_munnar: {
        id: 'in_munnar',
        name: 'Munnar (Western Ghats Shola Cloud Forest, Kerala)',
        state: 'Kerala',
        region: 'Western Ghats Biodiversity Hotspot (1,600m)',
        description: 'Misty mountain paradise with year-round Goldilocks comfort (15-25°C), fragrant tea estates, and zero-energy natural bioclimatic balance.',
        latitude: 10.0889,
        longitude: 77.0595,
        defaults: { tMax: 24.0, tMin: 14.5, rhDay: 65, rhNight: 88, ghiPeak: 840, windSpeedAvg: 3.2, windDirection: 'W', groundTempAvg: 19.5 },
        bioclimaticZones: { comfortLow: 19.0, comfortHigh: 26.0, adaptiveNeutral: 23.5 },
        recommendedTypology: 'modular_transitional',
        recommendedWalls: 'timber_fiber_insul',
        recommendedRoof: 'gable_insulated_tiles',
        recommendedVentMode: 'comfort_vent',
        soilType: 'laterite_red_soil',
        vernacularFeature: 'Gabled terracotta tile roof with timber trusses and natural forest air circulation.'
    }
};

export const CLIMATE_ZONES = {
    hot_arid: {
        id: 'hot_arid',
        name: 'Hot & Arid (Desert / Dry)',
        region: 'e.g., Thar (India), Kutch (Gujarat), Sahara, Arizona',
        description: 'High diurnal temperature variation (DTR > 15°C), intense direct solar radiation, very low relative humidity, strong dry winds.',
        latitude: 26.9,
        defaults: {
            tMax: 44.0,
            tMin: 24.0,
            rhDay: 20,
            rhNight: 45,
            ghiPeak: 980,
            windSpeedAvg: 3.8,
            windDirection: 'SW',
            groundTempAvg: 28.0
        },
        bioclimaticZones: { comfortLow: 21.0, comfortHigh: 28.5, adaptiveNeutral: 27.5 },
        recommendedTypology: 'wind_tower',
        recommendedWalls: 'rammed_earth_300',
        recommendedRoof: 'vaulted_earth_terracotta',
        recommendedVentMode: 'night_purge'
    },
    warm_humid: {
        id: 'warm_humid',
        name: 'Warm & Humid (Tropical / Coastal)',
        region: 'e.g., Surat / Valsad (Gujarat), Mumbai, Chennai, Kerala, SE Asia',
        description: 'High year-round temperatures with low diurnal variation (DTR < 6°C), persistent high humidity (>75%), high diffuse solar radiation.',
        latitude: 21.17,
        defaults: {
            tMax: 35.5,
            tMin: 27.0,
            rhDay: 75,
            rhNight: 88,
            ghiPeak: 840,
            windSpeedAvg: 4.2,
            windDirection: 'W',
            groundTempAvg: 28.0
        },
        bioclimaticZones: { comfortLow: 23.0, comfortHigh: 29.5, adaptiveNeutral: 28.0 },
        recommendedTypology: 'stilt_vernacular',
        recommendedWalls: 'bamboo_mud_infill',
        recommendedRoof: 'thatched_high_pitch',
        recommendedVentMode: 'continuous_cross'
    },
    composite: {
        id: 'composite',
        name: 'Composite (Subtropical / Semi-Arid)',
        region: 'e.g., Ahmedabad / Vadodara / Rajkot (Gujarat), New Delhi',
        description: 'Contrasting seasons: intensely hot & dry summer, monsoon humidity spike, and cool winter. Demands adaptable envelope dynamics.',
        latitude: 23.02,
        defaults: {
            tMax: 43.5,
            tMin: 25.5,
            rhDay: 30,
            rhNight: 62,
            ghiPeak: 960,
            windSpeedAvg: 3.6,
            windDirection: 'SW',
            groundTempAvg: 27.5
        },
        bioclimaticZones: { comfortLow: 20.5, comfortHigh: 28.0, adaptiveNeutral: 26.5 },
        recommendedTypology: 'vernacular_courtyard',
        recommendedWalls: 'cseb_interlocking_230',
        recommendedRoof: 'double_skin_vented',
        recommendedVentMode: 'adaptive_diurnal'
    },
    temperate: {
        id: 'temperate',
        name: 'Temperate / Hill Station',
        region: 'e.g., Saputara / Dang (Gujarat), Bengaluru, Pune, Munnar',
        description: 'Mild, comfortable temperatures year-round, moderate solar radiation, pleasant breezes, moderate relative humidity.',
        latitude: 20.75,
        defaults: {
            tMax: 30.5,
            tMin: 18.0,
            rhDay: 60,
            rhNight: 85,
            ghiPeak: 820,
            windSpeedAvg: 3.8,
            windDirection: 'S',
            groundTempAvg: 21.0
        },
        bioclimaticZones: { comfortLow: 19.0, comfortHigh: 26.5, adaptiveNeutral: 24.0 },
        recommendedTypology: 'modular_transitional',
        recommendedWalls: 'timber_fiber_insul',
        recommendedRoof: 'gable_insulated_tiles',
        recommendedVentMode: 'comfort_vent'
    },
    cold_mountainous: {
        id: 'cold_mountainous',
        name: 'Cold & Mountainous (Alpine / High-Altitude)',
        region: 'e.g., Leh Ladakh, Spiti Valley, Himalayas',
        description: 'Sub-zero temperatures, intense direct solar radiation at high altitude, low diffuse component, severe nighttime radiant cooling.',
        latitude: 34.15,
        defaults: {
            tMax: 14.0,
            tMin: -12.0,
            rhDay: 22,
            rhNight: 45,
            ghiPeak: 1080,
            windSpeedAvg: 4.8,
            windDirection: 'NE',
            groundTempAvg: 3.0
        },
        bioclimaticZones: { comfortLow: 18.0, comfortHigh: 24.0, adaptiveNeutral: 21.0 },
        recommendedTypology: 'solar_trombe_wall',
        recommendedWalls: 'stone_straw_insul_350',
        recommendedRoof: 'insulated_compact_flat',
        recommendedVentMode: 'minimum_airtight'
    },
    ...GUJARAT_DISTRICTS,
    ...INDIAN_DISTRICTS
};

export function generateDiurnalWeather(zoneId, customParams = {}) {
    const baseZone = CLIMATE_ZONES[zoneId] || GUJARAT_DISTRICTS[zoneId] || INDIAN_DISTRICTS[zoneId] || CLIMATE_ZONES.hot_arid;
    const params = { ...baseZone.defaults, ...customParams };

    const tMax = Number(params.tMax);
    const tMin = Number(params.tMin);
    const rhDay = Number(params.rhDay);
    const rhNight = Number(params.rhNight);
    const ghiPeak = Number(params.ghiPeak);
    const windAvg = Number(params.windSpeedAvg);
    const lat = Number(customParams.latitude || baseZone.latitude);

    const hours = [];
    const tMean = (tMax + tMin) / 2;
    const tAmp = (tMax - tMin) / 2;

    for (let h = 0; h < 24; h++) {
        let temp;
        if (h >= 5 && h <= 14) {
            const phi = ((h - 5) / 9) * Math.PI - Math.PI / 2;
            temp = tMean + tAmp * Math.sin(phi);
        } else if (h > 14) {
            const phi = ((h - 14) / 15) * Math.PI;
            temp = tMin + (tMax - tMin) * 0.5 * (1 + Math.cos(phi * 0.82));
        } else {
            const phi = ((h + 10) / 15) * Math.PI;
            temp = tMin + (tMax - tMin) * 0.5 * (1 + Math.cos(phi * 0.82));
        }

        const rhRange = rhNight - rhDay;
        const rhFraction = 1 - (temp - tMin) / Math.max(0.1, (tMax - tMin));
        const rh = Math.min(98, Math.max(12, rhDay + rhRange * rhFraction));

        let ghi = 0;
        let dni = 0;
        let dhi = 0;
        let sunElevation = 0;
        let sunAzimuth = 180;

        if (h >= 6 && h <= 18) {
            const solarAngle = ((h - 6) / 12) * Math.PI;
            ghi = Math.max(0, ghiPeak * Math.sin(solarAngle));
            dni = ghi * 0.80;
            dhi = ghi * 0.20;
            sunElevation = Math.max(0, Math.sin(solarAngle) * (90 - Math.abs(lat - 15)));
            sunAzimuth = 90 + ((h - 6) / 12) * 180;
        }

        const windFactor = 0.85 + 0.35 * Math.sin(((h - 9) / 24) * 2 * Math.PI);
        const windSpeed = Math.max(0.6, windAvg * windFactor);

        const dewPoint = temp - ((100 - rh) / 5);
        const tSky = temp - (8.5 - (rh / 25));

        // Wet-bulb calculation (Stull equation)
        const tw = temp * Math.atan(0.151977 * Math.pow(rh + 8.313659, 0.5)) +
            Math.atan(temp + rh) -
            Math.atan(rh - 1.676331) +
            0.00391838 * Math.pow(rh, 1.5) * Math.atan(0.023101 * rh) - 4.686035;

        // Vapor Pressure Deficit (VPD in kPa)
        const vpsat = 0.61078 * Math.exp((17.27 * temp) / (temp + 237.3));
        const vpair = vpsat * (rh / 100);
        const vpd = Math.max(0.05, vpsat - vpair);

        hours.push({
            hour: h,
            ambientTemp: Math.round(temp * 10) / 10,
            relativeHumidity: Math.round(rh),
            ghi: Math.round(ghi),
            dni: Math.round(dni),
            dhi: Math.round(dhi),
            sunElevation: Math.round(sunElevation * 10) / 10,
            sunAzimuth: Math.round(sunAzimuth * 10) / 10,
            windSpeed: Math.round(windSpeed * 10) / 10,
            tSky: Math.round(tSky * 10) / 10,
            dewPoint: Math.round(dewPoint * 10) / 10,
            wetBulb: Math.round(tw * 10) / 10,
            vpd: Math.round(vpd * 100) / 100
        });
    }

    return {
        zone: baseZone,
        params,
        hourly: hours
    };
}
