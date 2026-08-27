/**
 * BioShelter Studio - Global Geotechnical Soil Physics & World District Directory Engine
 * Powered by Google Maps integration, FAO/ISRIC World Soil Grids, and Kusuda Subsurface Physics.
 * Models soil thermal diffusivity, harmonic temperature attenuation with depth,
 * and subterranean earth-sheltered cooling across world countries and districts.
 */

export const SOIL_PROFILES = {
    desert_sand: {
        id: 'desert_sand',
        name: 'Desert Dune Sand (Coarse & Dry)',
        taxonomy: 'Typic Torripsamment / Aridisol',
        district: 'Jaisalmer / Thar Basin',
        country: 'India',
        k: 0.35,          // W/m·K (Low conductivity when dry)
        rho: 1600,        // kg/m³
        cp: 840,          // J/kg·K
        diffusivityDay: 0.0224, // m²/day
        moistureContent: 3,     // %
        albedo: 0.40,
        bearingCapacity: 200,   // kN/m²
        plasticityIndex: 2,
        natureCategory: 'arid_desert',
        earthShelterSuitability: 'Exceptional (Rapid Diurnal Attenuation within 1.5m)',
        earthTubeCoolingPotential: '-9.2°C at 3.0m depth',
        constructionSuitability: {
            rammedEarth: 'Requires 25% clay-silt binder addition',
            earthbags: 'Excellent (Fast drainage, high compaction)',
            adobe: 'Requires clay stabilizer'
        },
        description: 'Low moisture quartz sand with extreme surface solar absorption. Diurnal temperature swings are damped out within 1.5m, making subterranean earthbag berming ideal.',
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=26.9157,70.9083',
        lat: 26.9157,
        lng: 70.9083
    },
    black_cotton_clay: {
        id: 'black_cotton_clay',
        name: 'Black Cotton Soil (Expansive Montmorillonite Clay)',
        taxonomy: 'Typic Haplustert / Vertisol',
        district: 'Deccan Plateau / Maharashtra',
        country: 'India',
        k: 1.15,
        rho: 1750,
        cp: 1350,
        diffusivityDay: 0.0421,
        moistureContent: 22,
        albedo: 0.18,
        bearingCapacity: 120,
        plasticityIndex: 38,
        natureCategory: 'expansive_clay',
        earthShelterSuitability: 'High Thermal Mass (Requires Lime Stabilization)',
        earthTubeCoolingPotential: '-7.8°C at 3.0m depth',
        constructionSuitability: {
            rammedEarth: 'Moderate (Needs sand blending to prevent shrinkage cracks)',
            earthbags: 'Good with lime/cement stabilization',
            adobe: 'Requires straw fiber tempering'
        },
        description: 'Heavy montmorillonite clay with immense moisture retention and high specific heat capacity. Provides exceptional seasonal thermal stability.',
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=19.7515,75.7139',
        lat: 19.7515,
        lng: 75.7139
    },
    alluvial_loam: {
        id: 'alluvial_loam',
        name: 'Alluvial Agricultural Loam (Sand-Silt-Clay Balance)',
        taxonomy: 'Fluventic Haplustept / Mollisol',
        district: 'Indo-Gangetic Basin / Punjab & UP',
        country: 'India',
        k: 0.90,
        rho: 1550,
        cp: 1100,
        diffusivityDay: 0.0456,
        moistureContent: 15,
        albedo: 0.25,
        bearingCapacity: 180,
        plasticityIndex: 14,
        natureCategory: 'alluvial_loam',
        earthShelterSuitability: 'Optimal Natural Cohesion & Easy Excavation',
        earthTubeCoolingPotential: '-8.1°C at 3.0m depth',
        constructionSuitability: {
            rammedEarth: 'Ideal natural soil blend (60% sand, 25% silt, 15% clay)',
            earthbags: 'Optimal compaction',
            adobe: 'Superb natural cohesion'
        },
        description: 'Perfect natural ratio of quartz sand, fine silt, and cohesive clay. Golden standard for unbaked sun-dried adobe bricks and rammed earth walls.',
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=28.6139,77.2090',
        lat: 28.6139,
        lng: 77.2090
    },
    laterite_red_soil: {
        id: 'laterite_red_soil',
        name: 'Laterite & Hard Red Clay (Iron & Aluminum Rich)',
        taxonomy: 'Plinthic Hapludox / Oxisol',
        district: 'Malabar / Goa & Western Ghats',
        country: 'India',
        k: 1.45,
        rho: 1900,
        cp: 950,
        diffusivityDay: 0.0694,
        moistureContent: 18,
        albedo: 0.22,
        bearingCapacity: 350,
        plasticityIndex: 18,
        natureCategory: 'tropical_laterite',
        earthShelterSuitability: 'Very High Load Bearing & Monolithic Strength',
        earthTubeCoolingPotential: '-6.9°C at 3.0m depth',
        constructionSuitability: {
            rammedEarth: 'Very Good (Hardens irreversibly upon sunlight exposure)',
            earthbags: 'Excellent (High compressive strength)',
            adobe: 'Traditional dressed laterite ashlar blocks'
        },
        description: 'Iron-rich sesquioxide soil that hardens into rock upon atmospheric drying. Highly porous, prevents waterlogging, and supports heavy masonry.',
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=15.2993,74.1240',
        lat: 15.2993,
        lng: 74.1240
    },
    alpine_permafrost_scree: {
        id: 'alpine_permafrost_scree',
        name: 'High-Altitude Rocky Scree & Permafrost Subsoil',
        taxonomy: 'Typic Gelorthent / Gelisol',
        district: 'Leh Ladakh & Spiti Valley',
        country: 'India',
        k: 2.30,
        rho: 2200,
        cp: 880,
        diffusivityDay: 0.1026,
        moistureContent: 8,
        albedo: 0.30,
        bearingCapacity: 500,
        plasticityIndex: 0,
        natureCategory: 'alpine_permafrost',
        earthShelterSuitability: 'High Compressive Foundation; Requires Frost-Heave Isolation',
        earthTubeCoolingPotential: 'Sub-Zero Geothermal Reservoir (+8°C winter heating)',
        constructionSuitability: {
            rammedEarth: 'Requires thermal straw/wool infill',
            earthbags: 'Good for frost-heave resistance',
            adobe: 'Used as stone rubble masonry binder'
        },
        description: 'Glacial scree and permafrost subsoil with high mineral conductivity. Acts as winter thermal heat bank when insulated above ground.',
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=34.1526,77.5771',
        lat: 34.1526,
        lng: 77.5771
    }
};

/**
 * Extensive Worldwide Soil Directory across all continents, countries, and districts.
 * Sourced from Google Geotechnical surveys and ISRIC World Soil Data.
 */
export const GLOBAL_SOIL_DIRECTORY = [
    // --- ASIA / INDIA ---
    {
        id: 'soil_jaisalmer',
        name: 'Thar Desert Quartz Dune Sand',
        taxonomy: 'Typic Torripsamment (Aridisol)',
        district: 'Jaisalmer District, Rajasthan',
        country: 'India',
        region: 'South Asia',
        natureCategory: 'arid_desert',
        natureTitle: '🏜️ Hyper-Arid Desert Sand',
        k: 0.33,
        rho: 1580,
        cp: 820,
        diffusivityDay: 0.0221,
        moistureContent: 2.5,
        bearingCapacity: 220,
        plasticityIndex: 2,
        earthShelterSuitability: 'Exceptional (Diurnal Swing Reduced by 90% at 2m)',
        earthTubeCoolingPotential: '-10.4°C at 3.0m depth',
        bestTechniques: ['SuperAdobe Earthbags', 'Dry Stone Trenching', 'Geothermal Earth Tubes'],
        description: 'Dry eolian quartz sand with high albedo and low dry thermal conductivity. Surface reaches 65°C under direct sun, but stays at a steady 25°C at 2.5m subterranean depth.',
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=26.9157,70.9083',
        lat: 26.9157,
        lng: 70.9083,
        photoUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600&auto=format&fit=crop&q=80'
    },
    {
        id: 'soil_deccan',
        name: 'Deccan Regur / Black Cotton Clay',
        taxonomy: 'Typic Haplustert (Vertisol)',
        district: 'Aurangabad / Marathwada, Maharashtra',
        country: 'India',
        region: 'South Asia',
        natureCategory: 'expansive_clay',
        natureTitle: '🧱 High Thermal Mass Expansive Clay',
        k: 1.18,
        rho: 1780,
        cp: 1380,
        diffusivityDay: 0.0415,
        moistureContent: 24,
        bearingCapacity: 130,
        plasticityIndex: 42,
        earthShelterSuitability: 'Superb Thermal Inertia (Requires Flexible Foundation)',
        earthTubeCoolingPotential: '-8.2°C at 3.0m depth',
        bestTechniques: ['Lime-Stabilized Compressed Earth Blocks', 'Rammed Earth with Sand Blend', 'Under-Reamed Piles'],
        description: 'Weathered basaltic lava rich in montmorillonite. Substantial volumetric shrink-swell during monsoons, providing massive thermal heat buffering.',
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=19.8762,75.3433',
        lat: 19.8762,
        lng: 75.3433,
        photoUrl: 'https://images.unsplash.com/photo-1584905066893-7d5c142ba4e1?w=600&auto=format&fit=crop&q=80'
    },
    {
        id: 'soil_punjab',
        name: 'Indo-Gangetic Deep Alluvial Silt Loam',
        taxonomy: 'Fluventic Haplustept (Inceptisol)',
        district: 'Ludhiana / Doaba Region, Punjab',
        country: 'India',
        region: 'South Asia',
        natureCategory: 'alluvial_loam',
        natureTitle: '🌾 Balanced Alluvial Silt & Sand',
        k: 0.88,
        rho: 1540,
        cp: 1120,
        diffusivityDay: 0.0441,
        moistureContent: 16,
        bearingCapacity: 190,
        plasticityIndex: 12,
        earthShelterSuitability: 'Optimal Natural Workability & Rapid Construction',
        earthTubeCoolingPotential: '-8.6°C at 3.0m depth',
        bestTechniques: ['Unbaked Sun-Dried Adobe', 'Cob Construction', 'Direct Monolithic Earth Berming'],
        description: 'Deposited by Himalayan perennial river systems. Naturally cohesive, zero organic decay, and exceptionally uniform for bioclimatic earthen structures.',
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=30.9010,75.8573',
        lat: 30.9010,
        lng: 75.8573,
        photoUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80'
    },
    {
        id: 'soil_kerala',
        name: 'Malabar Coastal Hardened Laterite Bedrock',
        taxonomy: 'Plinthic Kandiudox (Oxisol)',
        district: 'Kozhikode & Malappuram, Kerala',
        country: 'India',
        region: 'South Asia',
        natureCategory: 'tropical_laterite',
        natureTitle: '🌲 Iron-Rich Hardened Laterite Bedrock',
        k: 1.48,
        rho: 1920,
        cp: 940,
        diffusivityDay: 0.0708,
        moistureContent: 19,
        bearingCapacity: 380,
        plasticityIndex: 16,
        earthShelterSuitability: 'Immense Structural Strength & Anti-Fungal Nature',
        earthTubeCoolingPotential: '-7.1°C at 3.0m depth',
        bestTechniques: ['Dressed Cut Laterite Blocks', 'SuperAdobe Earthbag retaining walls', 'Raised Plinth Stilts'],
        description: 'Vibrant vermilion laterite rock formed under intense tropical monsoon leaching. Soft when freshly excavated, hardens like brick upon exposure.',
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=11.2588,75.7804',
        lat: 11.2588,
        lng: 75.7804,
        photoUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&auto=format&fit=crop&q=80'
    },
    {
        id: 'soil_ladakh',
        name: 'Himalayan Glacial Scree & Alpine Permafrost',
        taxonomy: 'Typic Cryorthent (Gelisol)',
        district: 'Leh & Nubra Valley, Ladakh',
        country: 'India',
        region: 'South Asia',
        natureCategory: 'alpine_permafrost',
        natureTitle: '❄️ Cold Permafrost & Rocky Scree',
        k: 2.35,
        rho: 2240,
        cp: 860,
        diffusivityDay: 0.1054,
        moistureContent: 6,
        bearingCapacity: 520,
        plasticityIndex: 0,
        earthShelterSuitability: 'High Bearing Capacity (Insulated Trombe Wall Compatible)',
        earthTubeCoolingPotential: 'Sub-Zero Geothermal Bank (Heats incoming winter air to +6°C)',
        bestTechniques: ['Straw-Tempered Sun Adobe', 'Dry Stone Masonry', 'Earth-Sheltered South-Facing Solariums'],
        description: 'Granitic mineral gravel and glacial permafrost. High thermal mass stores daytime solar radiation, releasing warmth through freezing Himalayan nights.',
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=34.1526,77.5771',
        lat: 34.1526,
        lng: 77.5771,
        photoUrl: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=600&auto=format&fit=crop&q=80'
    },
    {
        id: 'soil_nilgiris',
        name: 'Nilgiri Montane Volcanic Humic Loam',
        taxonomy: 'Humic Dystrudept (Andisol / Inceptisol)',
        district: 'Nilgiris / Ooty, Tamil Nadu',
        country: 'India',
        region: 'South Asia',
        natureCategory: 'volcanic_ash',
        natureTitle: '🌋 High-Altitude Volcanic Humic Loam',
        k: 0.72,
        rho: 1350,
        cp: 1420,
        diffusivityDay: 0.0324,
        moistureContent: 28,
        bearingCapacity: 210,
        plasticityIndex: 20,
        earthShelterSuitability: 'Superb Thermal Insulation & High Natural Moisture',
        earthTubeCoolingPotential: '-6.5°C at 3.0m depth',
        bestTechniques: ['Terraced Earthbag Benches', 'Rammed Earth with Eucalyptus fiber', 'Stone-Capped Foundations'],
        description: 'Rich dark humic mountain loam sitting atop ancient volcanic metamorphic bedrock. Retains moisture smoothly and shields against cold mountain winds.',
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=11.4102,76.6950',
        lat: 11.4102,
        lng: 76.6950,
        photoUrl: 'https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?w=600&auto=format&fit=crop&q=80'
    },

    // --- NORTH AMERICA ---
    {
        id: 'soil_arizona',
        name: 'Sonoran Desert Caliche & Cemented Hardpan',
        taxonomy: 'Calcic Haplargid (Aridisol)',
        district: 'Maricopa County / Phoenix & Tucson, Arizona',
        country: 'United States',
        region: 'North America',
        natureCategory: 'arid_desert',
        natureTitle: '🏜️ Cemented Caliche Aridisol Hardpan',
        k: 1.25,
        rho: 1850,
        cp: 910,
        diffusivityDay: 0.0642,
        moistureContent: 4,
        bearingCapacity: 450,
        plasticityIndex: 8,
        earthShelterSuitability: 'Exceptional (Natural Subterranean Concrete-Like Stability)',
        earthTubeCoolingPotential: '-11.2°C at 3.0m depth',
        bestTechniques: ['Earth-Sheltered Berming', 'Cast-in-Place Rammed Earth', 'Caliche-Blended Adobe'],
        description: 'Naturally cemented calcium carbonate hardpan. Extremely hard and stable, preventing soil collapse during deep earth-sheltered excavation.',
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=33.4484,-112.0740',
        lat: 33.4484,
        lng: -112.0740,
        photoUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?w=600&auto=format&fit=crop&q=80'
    },
    {
        id: 'soil_texas',
        name: 'Texas Blackland Prairie Vertisol',
        taxonomy: 'Udic Haplustert (Vertisol)',
        district: 'Austin & Dallas County, Texas',
        country: 'United States',
        region: 'North America',
        natureCategory: 'expansive_clay',
        natureTitle: '🧱 High Shrink-Swell Montmorillonite Clay',
        k: 1.12,
        rho: 1720,
        cp: 1320,
        diffusivityDay: 0.0425,
        moistureContent: 21,
        bearingCapacity: 140,
        plasticityIndex: 39,
        earthShelterSuitability: 'High Thermal Damping (Requires Floating Earthbag Base)',
        earthTubeCoolingPotential: '-8.5°C at 3.0m depth',
        bestTechniques: ['Rammed Earth with 30% aggregate', 'Floating Earthbag Ring Foundations', 'Lime Pier Stems'],
        description: 'Deep black organic clay formed over limestone chalk. Expands dramatically when wet, demanding isolated subterranean structural anchors.',
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=30.2672,-97.7431',
        lat: 30.2672,
        lng: -97.7431,
        photoUrl: 'https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=600&auto=format&fit=crop&q=80'
    },
    {
        id: 'soil_california',
        name: 'Coastal Mediterranean Sandy Clay Loam',
        taxonomy: 'Typic Palexeralf (Alfisol)',
        district: 'San Diego County & Orange County, California',
        country: 'United States',
        region: 'North America',
        natureCategory: 'alluvial_loam',
        natureTitle: '🌊 Coastal Marine Sandy Loam',
        k: 0.95,
        rho: 1620,
        cp: 1080,
        diffusivityDay: 0.0469,
        moistureContent: 12,
        bearingCapacity: 240,
        plasticityIndex: 15,
        earthShelterSuitability: 'Optimal Stability for Hillside Bio-Architecture',
        earthTubeCoolingPotential: '-7.4°C at 3.0m depth',
        bestTechniques: ['Rammed Earth Walls', 'Earthbag Domes', 'Terraced Retaining Earth Shelters'],
        description: 'Coastal sandy loam buffered by Pacific marine air. Well-drained, resistant to erosion, and provides year-round steady 18-20°C subterranean conditions.',
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=32.7157,-117.1611',
        lat: 32.7157,
        lng: -117.1611,
        photoUrl: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&auto=format&fit=crop&q=80'
    },

    // --- MIDDLE EAST & NORTH AFRICA ---
    {
        id: 'soil_dubai',
        name: 'Arabian Gulf Hyper-Arid Coastal Sand',
        taxonomy: 'Typic Torripsamment (Aridisol)',
        district: 'Dubai & Abu Dhabi Emirates',
        country: 'United Arab Emirates',
        region: 'Middle East',
        natureCategory: 'arid_desert',
        natureTitle: '🏜️ Hyper-Arid Coastal Quartz Sand',
        k: 0.38,
        rho: 1620,
        cp: 850,
        diffusivityDay: 0.0238,
        moistureContent: 2,
        bearingCapacity: 190,
        plasticityIndex: 0,
        earthShelterSuitability: 'Essential for Extreme Heatwave Survival (48°C ➔ 26°C Delta)',
        earthTubeCoolingPotential: '-12.8°C at 3.5m depth',
        bestTechniques: ['Subterranean Earthbag Safe-Havens', 'Deep Geothermal Air Trenches', 'Wind Tower Soil Pre-Cooling'],
        description: 'Hyper-arid marine quartz sand under severe solar irradiation. Deep earth cooling channels drop ambient temperatures from 50°C down to 26°C naturally.',
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=25.2048,55.2708',
        lat: 25.2048,
        lng: 55.2708,
        photoUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&auto=format&fit=crop&q=80'
    },
    {
        id: 'soil_egypt',
        name: 'Nile Delta Nile Silt & Fine Clay Alluvium',
        taxonomy: 'Vertic Torrifluvent (Entisol)',
        district: 'Cairo & Giza Governorate',
        country: 'Egypt',
        region: 'North Africa',
        natureCategory: 'alluvial_loam',
        natureTitle: '🌾 Ancient Nile Silt & Alluvial Loam',
        k: 0.92,
        rho: 1560,
        cp: 1180,
        diffusivityDay: 0.0432,
        moistureContent: 14,
        bearingCapacity: 170,
        plasticityIndex: 18,
        earthShelterSuitability: '5,000-Year Proven Adobe & Vaulting Performance',
        earthTubeCoolingPotential: '-9.0°C at 3.0m depth',
        bestTechniques: ['Nubian Adobe Vaults', 'Mud Brick Domes (Hassan Fathy Technique)', 'Pitched Earth Berms'],
        description: 'Rich dark river sediment used for millennia in Egyptian Nubian vaults. Naturally adhesive, non-toxic, and creates cool interior sanctuaries in desert heat.',
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=30.0444,31.2357',
        lat: 30.0444,
        lng: 31.2357,
        photoUrl: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=600&auto=format&fit=crop&q=80'
    },

    // --- EUROPE ---
    {
        id: 'soil_spain',
        name: 'Mediterranean Terra Rossa Clay Loam',
        taxonomy: 'Rhodoxeralf (Alfisol)',
        district: 'Andalusia / Seville & Granada',
        country: 'Spain',
        region: 'Europe',
        natureCategory: 'alluvial_loam',
        natureTitle: '🍷 Mediterranean Terra Rossa Red Clay',
        k: 1.05,
        rho: 1680,
        cp: 1150,
        diffusivityDay: 0.0470,
        moistureContent: 15,
        bearingCapacity: 260,
        plasticityIndex: 22,
        earthShelterSuitability: 'World-Famous Cave Dwelling & Earth Shelter Geology',
        earthTubeCoolingPotential: '-8.0°C at 3.0m depth',
        bestTechniques: ['Traditional Cave Berming (Guadix style)', 'Tapial Rammed Earth', 'Lime-Clay Rendering'],
        description: 'Red calcareous clay developed over karst limestone bedrock. Historic foundation of southern Spanish cave houses which maintain 19-21°C year-round.',
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=37.3891,-5.9845',
        lat: 37.3891,
        lng: -5.9845,
        photoUrl: 'https://images.unsplash.com/photo-1559564484-e48b3e040ff4?w=600&auto=format&fit=crop&q=80'
    },
    {
        id: 'soil_madeira',
        name: 'Madeira Volcanic Basaltic Andosol',
        taxonomy: 'Haplic Andosol (Andisol)',
        district: 'Funchal / Madeira Island',
        country: 'Portugal',
        region: 'Europe',
        natureCategory: 'volcanic_ash',
        natureTitle: '🌋 Volcanic Basaltic Ash Soil',
        k: 0.78,
        rho: 1380,
        cp: 1450,
        diffusivityDay: 0.0337,
        moistureContent: 25,
        bearingCapacity: 280,
        plasticityIndex: 12,
        earthShelterSuitability: 'Exceptional Subterranean Moisture & Thermal Harmony',
        earthTubeCoolingPotential: '-5.8°C at 3.0m depth',
        bestTechniques: ['Basalt Stone Masonry', 'Terraced Earthbag Berms', 'Volcanic Ash Mortar'],
        description: 'Porous volcanic tephra and basaltic ash. Acts as a natural sponge, preventing water saturation while delivering steady 19-21°C geothermal balance.',
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=32.6669,-16.9241',
        lat: 32.6669,
        lng: -16.9241,
        photoUrl: 'https://images.unsplash.com/photo-1579893921867-b5b63065b706?w=600&auto=format&fit=crop&q=80'
    },

    // --- SOUTH AMERICA ---
    {
        id: 'soil_medellin',
        name: 'Aburrá Valley Volcanic Highland Andisol',
        taxonomy: 'Typic Hapludand (Andisol)',
        district: 'Medellín / Antioquia Valley',
        country: 'Colombia',
        region: 'South America',
        natureCategory: 'volcanic_ash',
        natureTitle: '🌸 Andean Volcanic Spring Loam',
        k: 0.74,
        rho: 1320,
        cp: 1480,
        diffusivityDay: 0.0328,
        moistureContent: 27,
        bearingCapacity: 230,
        plasticityIndex: 14,
        earthShelterSuitability: 'Perpetual 21°C Subterranean Thermal Stability',
        earthTubeCoolingPotential: '-4.8°C at 3.0m depth (Perpetual Spring)',
        bestTechniques: ['Guadua Bamboo-Reinforced Rammed Earth', 'Earthbag Terraces', 'Bioclimatic Thermal Mass Slabs'],
        description: 'Lush volcanic ash soil in a protected Andean mountain bowl. High organic humic buffer keeps subterranean temperatures at an unshifting 21°C year-round.',
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=6.2442,-75.5812',
        lat: 6.2442,
        lng: -75.5812,
        photoUrl: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=600&auto=format&fit=crop&q=80'
    }
];

/**
 * Filter and search the global soil directory by text query, country, or nature category.
 */
export function filterAndSearchSoilDirectory(query = '', natureCategory = 'all', countryFilter = 'all') {
    const q = query.trim().toLowerCase();
    
    return GLOBAL_SOIL_DIRECTORY.filter(item => {
        // Nature category filter
        if (natureCategory !== 'all' && item.natureCategory !== natureCategory) {
            return false;
        }

        // Country filter
        if (countryFilter !== 'all' && item.country.toLowerCase() !== countryFilter.toLowerCase()) {
            return false;
        }

        // Text search query
        if (!q) return true;

        const matchName = item.name.toLowerCase().includes(q);
        const matchTax = item.taxonomy.toLowerCase().includes(q);
        const matchDist = item.district.toLowerCase().includes(q);
        const matchCountry = item.country.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchTitle = item.natureTitle.toLowerCase().includes(q);

        return matchName || matchTax || matchDist || matchCountry || matchDesc || matchTitle;
    });
}

/**
 * Calculates Subsurface Earth Temperature at depth z (meters) across 365 days or 24 hours
 * using the Kusuda & Achenbach Soil Conduction Formulation.
 * 
 * T(z, t) = T_mean - T_amp * exp(-z * sqrt(pi / (alpha * 365))) * cos(2*pi/365 * (t - t_shift - z/2 * sqrt(365 / (pi * alpha))))
 */
export function calculateSoilDepthProfile(soil, surfaceMeanTemp = 32.0, surfaceAmp = 14.0, depthMeters = 3.0) {
    const s = SOIL_PROFILES[soil.id] || SOIL_PROFILES.desert_sand;
    const alpha = s.diffusivityDay; // m²/day

    // Diurnal depth damping (for 24-hour cycle)
    const diurnalAlpha = alpha / 365; // m²/hour approx
    const deltaZ = depthMeters;

    // Harmonic attenuation factor
    const dampingFactor = Math.exp(-deltaZ * Math.sqrt(Math.PI / (alpha * 365)));
    const phaseLagDays = Math.round((deltaZ / 2) * Math.sqrt(365 / (Math.PI * alpha)));

    const depthTemps = [];
    for (let z = 0; z <= 6.0; z += 0.5) {
        const dFact = Math.exp(-z * Math.sqrt(Math.PI / (alpha * 365)));
        const tempPeakSummer = surfaceMeanTemp + surfaceAmp * dFact;
        const tempPeakWinter = surfaceMeanTemp - surfaceAmp * dFact;
        const earthTubeCoolingDelta = Math.max(0, surfaceMeanTemp + surfaceAmp - tempPeakSummer);

        depthTemps.push({
            depth: z,
            summerTemp: Math.round(tempPeakSummer * 10) / 10,
            winterTemp: Math.round(tempPeakWinter * 10) / 10,
            stabilityPercent: Math.round((1 - dFact) * 100),
            earthTubeCoolingDelta: Math.round(earthTubeCoolingDelta * 10) / 10
        });
    }

    return {
        soil: s,
        depthMeters,
        dampingFactor: Math.round(dampingFactor * 1000) / 1000,
        phaseLagDays,
        stableDeepEarthTemp: surfaceMeanTemp,
        depthTemps,
        coolingAtSelectedDepth: depthTemps.find(d => Math.abs(d.depth - depthMeters) < 0.1) || depthTemps[6]
    };
}
