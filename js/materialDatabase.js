/**
 * BioShelter Studio - Material Database & Envelope Physics Engine
 * Comprehensive database of vernacular, bio-based, and engineered materials
 * Calculates U-Values, Volumetric Heat Capacity, Decrement Factors, and Time Lag.
 */

export const MATERIALS = {
    // --- Earth & Earthen Masonry ---
    rammed_earth: {
        id: 'rammed_earth',
        name: 'Rammed Earth (Compacted Soil)',
        category: 'Earth & Adobe',
        k: 1.25,          // W/m·K (Thermal Conductivity)
        rho: 2100,        // kg/m³ (Density)
        cp: 1050,         // J/kg·K (Specific Heat)
        solarAbsorptance: 0.68,
        emissivity: 0.90,
        embodiedCarbon: 'Very Low (Local Soil)',
        description: 'Excellent thermal mass with high damping. Ideal for hot-arid zones.'
    },
    adobe_mud_brick: {
        id: 'adobe_mud_brick',
        name: 'Sun-Dried Adobe Mud Brick',
        category: 'Earth & Adobe',
        k: 0.75,
        rho: 1650,
        cp: 1000,
        solarAbsorptance: 0.65,
        emissivity: 0.90,
        embodiedCarbon: 'Negligible',
        description: 'Traditional earthen brick with good thermal inertia and breathability.'
    },
    cseb: {
        id: 'cseb',
        name: 'Compressed Stabilized Earth Block (CSEB 5% Cement)',
        category: 'Earth & Adobe',
        k: 0.95,
        rho: 1850,
        cp: 980,
        solarAbsorptance: 0.62,
        emissivity: 0.88,
        embodiedCarbon: 'Low',
        description: 'Engineered soil block with high structural stability and thermal mass.'
    },
    cob_straw_clay: {
        id: 'cob_straw_clay',
        name: 'Cob (Clay + Sand + Straw mix)',
        category: 'Earth & Adobe',
        k: 0.55,
        rho: 1450,
        cp: 1150,
        solarAbsorptance: 0.60,
        emissivity: 0.90,
        embodiedCarbon: 'Zero/Negative',
        description: 'Monolithic clay-straw wall offering balanced insulation and thermal capacity.'
    },
    mud_lime_plaster: {
        id: 'mud_lime_plaster',
        name: 'Mud & Lime Exterior Render (20mm)',
        category: 'Plaster & Finishes',
        k: 0.70,
        rho: 1600,
        cp: 950,
        solarAbsorptance: 0.45,
        emissivity: 0.88,
        embodiedCarbon: 'Low',
        description: 'Breathable outer protective render for earthen walls.'
    },

    // --- Bio-based & Vernacular ---
    bamboo_panel: {
        id: 'bamboo_panel',
        name: 'Woven Bamboo Mat / Split Culm Panel',
        category: 'Bio-based & Vernacular',
        k: 0.16,
        rho: 550,
        cp: 1600,
        solarAbsorptance: 0.55,
        emissivity: 0.85,
        embodiedCarbon: 'Carbon Negative',
        description: 'Ultra-lightweight, permeable, rapid-growth material ideal for warm-humid ventilation.'
    },
    thatched_straw: {
        id: 'thatched_straw',
        name: 'Thatch (Paddy Straw / Reeds / Palm Leaves)',
        category: 'Bio-based & Vernacular',
        k: 0.08,
        rho: 180,
        cp: 1800,
        solarAbsorptance: 0.50,
        emissivity: 0.90,
        embodiedCarbon: 'Carbon Negative',
        description: 'High natural thermal insulation, naturally breathable, excellent for roof solar shielding.'
    },
    timber_hardwood: {
        id: 'timber_hardwood',
        name: 'Sustainably Sourced Hardwood / Teak',
        category: 'Bio-based & Vernacular',
        k: 0.14,
        rho: 650,
        cp: 1600,
        solarAbsorptance: 0.65,
        emissivity: 0.90,
        embodiedCarbon: 'Carbon Sequestering',
        description: 'Structural framing and louvered envelope components.'
    },
    wood_fiber_board: {
        id: 'wood_fiber_board',
        name: 'Wood Fiber Insulation Board',
        category: 'Bio-based & Vernacular',
        k: 0.042,
        rho: 160,
        cp: 2100,
        solarAbsorptance: 0.40,
        emissivity: 0.85,
        embodiedCarbon: 'Low / Negative',
        description: 'High specific heat natural insulation with significant phase shift.'
    },
    hempcrete: {
        id: 'hempcrete',
        name: 'Hempcrete (Hemp Shiv + Lime Binder)',
        category: 'Bio-based & Vernacular',
        k: 0.075,
        rho: 330,
        cp: 1560,
        solarAbsorptance: 0.50,
        emissivity: 0.88,
        embodiedCarbon: 'Carbon Negative',
        description: 'Vapor-permeable insulation with moderate thermal mass and hygroscopic moisture buffering.'
    },

    // --- Masonry & Engineered Blocks ---
    aac_block: {
        id: 'aac_block',
        name: 'Autoclaved Aerated Concrete (AAC Block)',
        category: 'Masonry & Aggregates',
        k: 0.16,
        rho: 600,
        cp: 1050,
        solarAbsorptance: 0.55,
        emissivity: 0.90,
        embodiedCarbon: 'Moderate',
        description: 'Lightweight cellular concrete with built-in thermal resistance.'
    },
    flyash_brick: {
        id: 'flyash_brick',
        name: 'Fly Ash Lime Gypsum Brick',
        category: 'Masonry & Aggregates',
        k: 0.72,
        rho: 1750,
        cp: 920,
        solarAbsorptance: 0.60,
        emissivity: 0.90,
        embodiedCarbon: 'Low (Recycled by-product)',
        description: 'Eco-friendly alternative to fired red clay brick.'
    },
    stone_masonry: {
        id: 'stone_masonry',
        name: 'Dressed Sandstone / Granite Masonry',
        category: 'Masonry & Aggregates',
        k: 1.80,
        rho: 2400,
        cp: 880,
        solarAbsorptance: 0.70,
        emissivity: 0.92,
        embodiedCarbon: 'Low (Locally quarried)',
        description: 'Massive thermal heat sink for high-altitude cold and arid regions.'
    },

    // --- Modern / Prefab / Emergency ---
    cgi_sheet: {
        id: 'cgi_sheet',
        name: 'Corrugated Galvanized Iron (CGI Sheet 0.6mm)',
        category: 'Lightweight & Prefab',
        k: 50.0,
        rho: 7850,
        cp: 480,
        solarAbsorptance: 0.65,
        emissivity: 0.25,
        embodiedCarbon: 'High',
        description: 'Common in emergency disaster relief; causes acute overheating without sub-roof insulation.'
    },
    puf_sandwich_panel: {
        id: 'puf_sandwich_panel',
        name: 'Polyurethane Foam (PUF) Sandwich Panel 50mm',
        category: 'Lightweight & Prefab',
        k: 0.024,
        rho: 42,
        cp: 1450,
        solarAbsorptance: 0.35,
        emissivity: 0.85,
        embodiedCarbon: 'High',
        description: 'Extremely high thermal resistance per unit thickness, rapid deployment.'
    },
    canvas_tensile: {
        id: 'canvas_tensile',
        name: 'Heavy Duty Treated Canvas Fabric (2mm)',
        category: 'Lightweight & Prefab',
        k: 0.09,
        rho: 700,
        cp: 1300,
        solarAbsorptance: 0.35,
        emissivity: 0.80,
        embodiedCarbon: 'Moderate',
        description: 'Flexible membrane for emergency tents and temporary disaster relief structures.'
    },

    // --- Insulation & Phase Change ---
    glass_wool: {
        id: 'glass_wool',
        name: 'Glass Wool Batts / Blanket',
        category: 'Thermal Insulation',
        k: 0.036,
        rho: 32,
        cp: 840,
        solarAbsorptance: 0.30,
        emissivity: 0.85,
        embodiedCarbon: 'Moderate',
        description: 'Standard fibrous thermal & acoustic barrier.'
    },
    eps_insulation: {
        id: 'eps_insulation',
        name: 'Expanded Polystyrene (EPS Foam)',
        category: 'Thermal Insulation',
        k: 0.038,
        rho: 25,
        cp: 1200,
        solarAbsorptance: 0.25,
        emissivity: 0.85,
        embodiedCarbon: 'Moderate-High',
        description: 'Rigid lightweight insulation board.'
    },
    rice_husk_insul: {
        id: 'rice_husk_insul',
        name: 'Loose Agricultural Rice Husk Ash Fill',
        category: 'Thermal Insulation',
        k: 0.065,
        rho: 140,
        cp: 1400,
        solarAbsorptance: 0.40,
        emissivity: 0.85,
        embodiedCarbon: 'Very Low (Bio-waste)',
        description: 'Ultra-low-cost vernacular cavity insulation for rural shelters.'
    },
    pcm_paraffin_24: {
        id: 'pcm_paraffin_24',
        name: 'Phase Change Material (Paraffin PCM 24°C)',
        category: 'Thermal Insulation',
        k: 0.21,
        rho: 820,
        cp: 3200,
        solarAbsorptance: 0.30,
        emissivity: 0.88,
        embodiedCarbon: 'High',
        description: 'Latent heat storage absorbs daytime heat spikes and releases warmth at night at 24°C.'
    },

    // --- Glazing Materials ---
    single_clear_glass: {
        id: 'single_clear_glass',
        name: 'Single Clear Float Glass (4mm)',
        category: 'Glazing',
        uValue: 5.8,
        shgc: 0.86,
        vlt: 0.90,
        description: 'Basic standard single glazing.'
    },
    double_low_e_glass: {
        id: 'double_low_e_glass',
        name: 'Double Glazed Unit with Low-E Coating (6-12-6mm)',
        category: 'Glazing',
        uValue: 1.8,
        shgc: 0.38,
        vlt: 0.65,
        description: 'High performance insulated solar control glass.'
    },
    polycarbonate_multiwall: {
        id: 'polycarbonate_multiwall',
        name: 'Multi-Wall Polycarbonate Sheet (10mm)',
        category: 'Glazing',
        uValue: 3.0,
        shgc: 0.62,
        vlt: 0.72,
        description: 'Lightweight impact-resistant glazing, diffused daylighting.'
    },

    // --- Surface Finishes & Cool Roofs ---
    cool_roof_white_coating: {
        id: 'cool_roof_white_coating',
        name: 'High-Albedo Cool Roof Coating (SRI > 100)',
        category: 'Surface Finish',
        solarAbsorptance: 0.15,
        emissivity: 0.91,
        description: 'Reflects 85% of solar radiation, reducing sol-air temperature by up to 20°C.'
    },
    terracotta_tile: {
        id: 'terracotta_tile',
        name: 'Natural Terracotta Clay Tile',
        category: 'Surface Finish',
        solarAbsorptance: 0.60,
        emissivity: 0.90,
        description: 'Vernacular clay roof finish with high thermal re-radiation.'
    }
};

/**
 * Pre-configured Envelope Assembly Profiles
 */
export const ASSEMBLY_PRESETS = {
    walls: {
        rammed_earth_300: {
            id: 'rammed_earth_300',
            name: 'Rammed Earth Wall (300mm Monolithic)',
            layers: [
                { materialId: 'mud_lime_plaster', thickness: 0.020 },
                { materialId: 'rammed_earth', thickness: 0.300 },
                { materialId: 'mud_lime_plaster', thickness: 0.015 }
            ],
            surfaceAbsorptance: 0.50,
            surfaceEmissivity: 0.90
        },
        cseb_interlocking_230: {
            id: 'cseb_interlocking_230',
            name: 'CSEB Interlocking Earth Brick Wall (230mm)',
            layers: [
                { materialId: 'mud_lime_plaster', thickness: 0.015 },
                { materialId: 'cseb', thickness: 0.230 },
                { materialId: 'mud_lime_plaster', thickness: 0.015 }
            ],
            surfaceAbsorptance: 0.55,
            surfaceEmissivity: 0.90
        },
        bamboo_mud_infill: {
            id: 'bamboo_mud_infill',
            name: 'Bamboo Lattice with Mud/Lime Plaster (75mm)',
            layers: [
                { materialId: 'mud_lime_plaster', thickness: 0.015 },
                { materialId: 'bamboo_panel', thickness: 0.045 },
                { materialId: 'mud_lime_plaster', thickness: 0.015 }
            ],
            surfaceAbsorptance: 0.48,
            surfaceEmissivity: 0.88
        },
        aac_block_200: {
            id: 'aac_block_200',
            name: 'AAC Block Wall with Lime Render (200mm)',
            layers: [
                { materialId: 'mud_lime_plaster', thickness: 0.015 },
                { materialId: 'aac_block', thickness: 0.200 },
                { materialId: 'mud_lime_plaster', thickness: 0.015 }
            ],
            surfaceAbsorptance: 0.45,
            surfaceEmissivity: 0.88
        },
        stone_straw_insul_350: {
            id: 'stone_straw_insul_350',
            name: 'High-Altitude Stone Wall + Straw Infill (350mm)',
            layers: [
                { materialId: 'stone_masonry', thickness: 0.250 },
                { materialId: 'thatched_straw', thickness: 0.080 },
                { materialId: 'timber_hardwood', thickness: 0.020 }
            ],
            surfaceAbsorptance: 0.70,
            surfaceEmissivity: 0.92
        },
        cgi_uninsulated: {
            id: 'cgi_uninsulated',
            name: 'Corrugated Iron (CGI) Uninsulated Sheet (Emergency baseline)',
            layers: [
                { materialId: 'cgi_sheet', thickness: 0.001 }
            ],
            surfaceAbsorptance: 0.65,
            surfaceEmissivity: 0.30
        },
        puf_panel_50: {
            id: 'puf_panel_50',
            name: 'PUF Insulated Modular Wall Panel (50mm)',
            layers: [
                { materialId: 'puf_sandwich_panel', thickness: 0.050 }
            ],
            surfaceAbsorptance: 0.35,
            surfaceEmissivity: 0.85
        }
    },
    roofs: {
        thatched_high_pitch: {
            id: 'thatched_high_pitch',
            name: 'Thick Thatch Roof on Bamboo Frame (150mm)',
            layers: [
                { materialId: 'thatched_straw', thickness: 0.150 },
                { materialId: 'bamboo_panel', thickness: 0.020 }
            ],
            surfaceAbsorptance: 0.45,
            surfaceEmissivity: 0.90
        },
        vaulted_earth_terracotta: {
            id: 'vaulted_earth_terracotta',
            name: 'Vaulted CSEB Roof with White Lime Coating (150mm)',
            layers: [
                { materialId: 'terracotta_tile', thickness: 0.020 },
                { materialId: 'cseb', thickness: 0.130 },
                { materialId: 'mud_lime_plaster', thickness: 0.015 }
            ],
            surfaceAbsorptance: 0.22,
            surfaceEmissivity: 0.90
        },
        double_skin_vented: {
            id: 'double_skin_vented',
            name: 'Double-Skin Naturally Vented Roof (CGI + Cavity + Wood Fiber)',
            layers: [
                { materialId: 'cgi_sheet', thickness: 0.001 },
                { materialId: 'wood_fiber_board', thickness: 0.050 },
                { materialId: 'timber_hardwood', thickness: 0.015 }
            ],
            surfaceAbsorptance: 0.30,
            surfaceEmissivity: 0.85
        },
        cgi_bare_roof: {
            id: 'cgi_bare_roof',
            name: 'Bare CGI Roof Sheet (Emergency Disaster Baseline)',
            layers: [
                { materialId: 'cgi_sheet', thickness: 0.001 }
            ],
            surfaceAbsorptance: 0.70,
            surfaceEmissivity: 0.30
        },
        insulated_compact_flat: {
            id: 'insulated_compact_flat',
            name: 'Heavily Insulated Flat Roof (Ladakh/Alpine Style)',
            layers: [
                { materialId: 'mud_lime_plaster', thickness: 0.050 },
                { materialId: 'wood_fiber_board', thickness: 0.100 },
                { materialId: 'timber_hardwood', thickness: 0.030 }
            ],
            surfaceAbsorptance: 0.65,
            surfaceEmissivity: 0.90
        },
        puf_roof_50: {
            id: 'puf_roof_50',
            name: 'PUF Insulated Roof Panel with Cool Coating (50mm)',
            layers: [
                { materialId: 'puf_sandwich_panel', thickness: 0.050 }
            ],
            surfaceAbsorptance: 0.20,
            surfaceEmissivity: 0.90
        }
    }
};

/**
 * Calculates Composite Thermal Properties for multi-layer wall or roof
 * Uses exact 1D harmonic diffusion phase shift and damping formulas.
 */
export function calculateAssemblyPhysics(assembly, isRoof = false) {
    const rSi = isRoof ? 0.10 : 0.13;
    const rSe = 0.04;

    let totalR = rSi + rSe;
    let totalThickness = 0;
    let totalArealCapacity = 0; // J/m²·K
    let totalMass = 0;          // kg/m²
    let sumTimeLag = 0;

    assembly.layers.forEach(layer => {
        const mat = MATERIALS[layer.materialId] || MATERIALS.cseb;
        const d = layer.thickness;
        const rLayer = d / mat.k;
        totalR += rLayer;
        totalThickness += d;
        totalArealCapacity += mat.rho * mat.cp * d;
        totalMass += mat.rho * d;

        // Analytical harmonic phase shift for layer (P = 24 hrs = 86400 s):
        // alpha = k / (rho * cp) [m²/s]
        // phi_layer = 0.5 * d * sqrt(86400 / (pi * alpha)) / 3600 [hours]
        const alpha = mat.k / Math.max(1, mat.rho * mat.cp);
        const phiLayer = (0.5 * d * Math.sqrt(86400 / (Math.PI * alpha))) / 3600;
        sumTimeLag += phiLayer;
    });

    const uValue = 1 / totalR; // W/m²·K
    const timeLagHours = Math.min(16, Math.max(0.1, sumTimeLag));
    const decrementFactor = Math.min(1.0, Math.max(0.04, Math.exp(-0.25 * timeLagHours)));

    return {
        uValue: Math.round(uValue * 100) / 100,
        rTotal: Math.round(totalR * 100) / 100,
        thicknessMm: Math.round(totalThickness * 1000),
        massKgM2: Math.round(totalMass),
        arealHeatCapacityKJ: Math.round(totalArealCapacity / 1000),
        timeLagHours: Math.round(timeLagHours * 10) / 10,
        decrementFactor: Math.round(decrementFactor * 100) / 100,
        surfaceAbsorptance: assembly.surfaceAbsorptance || 0.5,
        surfaceEmissivity: assembly.surfaceEmissivity || 0.9
    };
}
