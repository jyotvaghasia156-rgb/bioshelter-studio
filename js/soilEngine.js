/**
 * BioShelter Studio - Geotechnical Soil Physics & Subsurface Geothermal Engine
 * Models soil thermal diffusivity, Kusuda harmonic depth temperature attenuation, and earth-sheltering.
 */

export const SOIL_PROFILES = {
    desert_sand: {
        id: 'desert_sand',
        name: 'Desert Dune Sand (Coarse & Dry)',
        region: 'Hot & Arid Zones (Thar, Sahara, Middle East)',
        k: 0.35,          // W/m·K (Low conductivity when dry)
        rho: 1600,        // kg/m³
        cp: 840,          // J/kg·K
        diffusivityDay: 0.0224, // m²/day
        moistureContent: 3,     // %
        albedo: 0.40,
        bearingCapacity: 200,   // kN/m²
        constructionSuitability: {
            rammedEarth: 'Requires 25% clay-silt binder addition',
            earthbags: 'Excellent (Fast drainage, high compaction)',
            adobe: 'Requires clay stabilizer'
        },
        description: 'Low moisture sand with rapid surface heating. High diurnal surface swings attenuated rapidly within 1.5m depth.'
    },
    black_cotton_clay: {
        id: 'black_cotton_clay',
        name: 'Black Cotton Soil (Expansive Montmorillonite Clay)',
        region: 'Composite / Semi-Arid Plains (Central India, Deccan, Texas)',
        k: 1.15,
        rho: 1750,
        cp: 1350,
        diffusivityDay: 0.0421,
        moistureContent: 22,
        albedo: 0.18,
        bearingCapacity: 120,
        constructionSuitability: {
            rammedEarth: 'Moderate (Needs sand blending to prevent shrinkage cracks)',
            earthbags: 'Good with lime stabilization',
            adobe: 'Requires straw fiber tempering'
        },
        description: 'High moisture retention and substantial thermal mass. Provides strong seasonal geothermal stability.'
    },
    alluvial_loam: {
        id: 'alluvial_loam',
        name: 'Alluvial Agricultural Loam (Sand-Silt-Clay Balance)',
        region: 'Temperate / River Plains (Gangetic Basin, Nile, Mississippi)',
        k: 0.90,
        rho: 1550,
        cp: 1100,
        diffusivityDay: 0.0456,
        moistureContent: 15,
        albedo: 0.25,
        bearingCapacity: 180,
        constructionSuitability: {
            rammedEarth: 'Ideal natural soil blend (60% sand, 25% silt, 15% clay)',
            earthbags: 'Optimal compaction',
            adobe: 'Superb natural cohesion'
        },
        description: 'Balanced agricultural loam offering optimal natural cohesion for earthen architecture.'
    },
    laterite_red_soil: {
        id: 'laterite_red_soil',
        name: 'Laterite & Hard Red Clay (Iron & Aluminum Rich)',
        region: 'Warm & Humid / Coastal Tropics (Western Ghats, SE Asia, Amazon)',
        k: 1.45,
        rho: 1900,
        cp: 950,
        diffusivityDay: 0.0694,
        moistureContent: 18,
        albedo: 0.22,
        bearingCapacity: 350,
        constructionSuitability: {
            rammedEarth: 'Very Good (Hardens irreversibly in sunlight)',
            earthbags: 'Excellent (High compressive strength)',
            adobe: 'Traditional dressed laterite blocks'
        },
        description: 'Porous yet extremely durable bedrock. Ideal for quarrying raw building blocks and raised stilt foundations.'
    },
    alpine_permafrost_scree: {
        id: 'alpine_permafrost_scree',
        name: 'High-Altitude Rocky Scree & Permafrost Subsoil',
        region: 'Cold & Mountainous Zones (Ladakh, Himalayas, Andes, Alps)',
        k: 2.30,
        rho: 2200,
        cp: 880,
        diffusivityDay: 0.1026,
        moistureContent: 8,
        albedo: 0.30,
        bearingCapacity: 500,
        constructionSuitability: {
            rammedEarth: 'Requires thermal straw/wool infill',
            earthbags: 'Good for frost-heave resistance',
            adobe: 'Used as stone rubble masonry binder'
        },
        description: 'High thermal conductivity mineral soil with deep permafrost. Demands sub-slab thermal insulation barriers.'
    }
};

/**
 * Calculates Subsurface Earth Temperature at depth z (meters) across 365 days or 24 hours
 * Kusuda & Achenbach formulation:
 * T(z, t) = T_mean - T_amp * exp(-z * sqrt(pi / (365 * alpha))) * cos( (2*pi/365) * (t - t_shift - (z/2)*sqrt(365/(pi*alpha))) )
 */
export function calculateSoilDepthProfile(soilId, tMeanAnnual, tAmpAnnual, depthMeters = 3.0) {
    const soil = SOIL_PROFILES[soilId] || SOIL_PROFILES.desert_sand;
    const alpha = soil.diffusivityDay; // m²/day
    const tShift = 35; // Days after Jan 1 for minimum annual surface temperature

    const depths = [0, 0.5, 1.0, 2.0, 3.0, 5.0];
    const monthlyProfiles = [];

    // Calculate monthly average temperatures at different depths
    for (let month = 0; month < 12; month++) {
        const day = month * 30.4 + 15;
        const depthTemps = {};

        depths.forEach(z => {
            const damping = Math.exp(-z * Math.sqrt(Math.PI / (365 * alpha)));
            const phaseLag = (z / 2) * Math.sqrt(365 / (Math.PI * alpha));
            const angle = (2 * Math.PI / 365) * (day - tShift - phaseLag);
            const temp = tMeanAnnual - tAmpAnnual * damping * Math.cos(angle);
            depthTemps[`z_${z.toString().replace('.', '_')}m`] = Math.round(temp * 10) / 10;
        });

        monthlyProfiles.push({
            monthIndex: month,
            monthName: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month],
            ...depthTemps
        });
    }

    // 24-hour diurnal attenuation at selected depth
    const dampingDiurnal = Math.exp(-depthMeters * Math.sqrt(Math.PI / (1 * (alpha / 1))));
    const diurnalTemps = [];
    for (let h = 0; h < 24; h++) {
        const groundSurfaceOscillation = Math.sin(((h - 8) / 24) * 2 * Math.PI) * 8.0;
        const deepTemp = tMeanAnnual + groundSurfaceOscillation * dampingDiurnal;
        diurnalTemps.push({
            hour: h,
            surfaceTemp: Math.round((tMeanAnnual + groundSurfaceOscillation) * 10) / 10,
            depthTemp: Math.round(deepTemp * 10) / 10
        });
    }

    return {
        soil,
        depths,
        monthlyProfiles,
        diurnalTemps,
        steadyGeothermalTemp: Math.round(tMeanAnnual * 10) / 10,
        earthBermingCoolingBenefitC: Math.round((tAmpAnnual * 0.75) * 10) / 10
    };
}
