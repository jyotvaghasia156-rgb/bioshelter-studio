/**
 * BioShelter Studio - Bioclimatic Optimization & Passive Strategy Engine
 * Evaluates thermal bottlenecks and synthesizes area-specific passive retrofits with baseline comparison.
 */

import { ASSEMBLY_PRESETS } from './materialDatabase.js';
import { runThermalSimulation } from './thermalSolver.js';

export function analyzeAndGenerateRecommendations(currentConfig, climateData, currentSim) {
    const zoneId = climateData.zone.id;
    const summary = currentSim.summary;
    const hourly = currentSim.hourly;
    const recs = [];

    const isHotArid = zoneId === 'hot_arid';
    const isWarmHumid = zoneId === 'warm_humid';
    const isComposite = zoneId === 'composite';
    const isCold = zoneId === 'cold_mountainous';
    const isTemperate = zoneId === 'temperate';

    // 1. Roof Thermal Performance Diagnostics
    if (summary.roofU > 1.2 && (isHotArid || isComposite || isWarmHumid)) {
        recs.push({
            id: 'roof_insulation',
            category: 'Envelope Insulation',
            priority: 'CRITICAL',
            title: 'Incorporate High-R Bio-Insulated Roof Layer',
            problem: Current roof U-value ( W/m²·K) allows high conductive solar gain into the shelter core.,
            solution: 'Upgrade to a 150mm Thatch layer on bamboo framing, or add 50mm Wood-Fiber / PUF insulation board beneath roof covering.',
            impact: 'Lowers peak indoor temperature by ~3.2°C to 4.5°C and eliminates midday radiant ceiling discomfort.',
            applyPatch: {
                roofAssembly: ASSEMBLY_PRESETS.roofs.thatched_high_pitch
            }
        });
    }

    if (summary.roofU > 0.8 && isCold) {
        recs.push({
            id: 'roof_cold_insulation',
            category: 'Envelope Insulation',
            priority: 'CRITICAL',
            title: 'Apply Multi-Layer Compact Earth & Wood-Fiber Roof',
            problem: High conductive heat loss through the roof in freezing alpine climate (U =  W/m²·K).,
            solution: 'Install 100mm wood-fiber insulation with 50mm compacted earthen mud cap.',
            impact: 'Reduces nighttime heat loss by 55%, preventing sub-zero indoor drops.',
            applyPatch: {
                roofAssembly: ASSEMBLY_PRESETS.roofs.insulated_compact_flat
            }
        });
    }

    // 2. Thermal Mass & Time Lag Diagnostics
    if (summary.wallTimeLag < 6.0 && isHotArid) {
        recs.push({
            id: 'wall_thermal_mass',
            category: 'Thermal Inertia',
            priority: 'HIGH',
            title: 'Upgrade to 300mm Monolithic Rammed Earth / CSEB Walls',
            problem: Current wall time lag ( hrs) is too short to damp the desert diurnal peak (>18°C DTR).,
            solution: 'Construct walls with 300mm stabilized rammed earth or 230mm interlocking CSEB blocks to achieve an 8 to 10-hour thermal lag.',
            impact: 'Flattens indoor temperature swing by 60%, shifting the outdoor 14:00 peak heat to cool nighttime hours (23:00).',
            applyPatch: {
                wallAssembly: ASSEMBLY_PRESETS.walls.rammed_earth_300
            }
        });
    }

    // 3. Shading & Overhang Optimization
    const overhang = Number(currentConfig.overhangDepth || 0.4);
    if (overhang < 0.6 && (isHotArid || isWarmHumid || isComposite)) {
        recs.push({
            id: 'deep_overhangs',
            category: 'Solar Shading',
            priority: 'HIGH',
            title: 'Extend Eaves Overhang to 0.8m + Exterior Bamboo Louvers',
            problem: Insufficient shading overhang (m) exposes windows and upper wall perimeter to direct high-angle solar radiation.,
            solution: 'Extend roof eaves to 0.80m and add horizontal bamboo louver louvers on South/West facades.',
            impact: 'Blocks >80% of direct window solar radiation, reducing peak greenhouse gain by up to 1.8°C.',
            applyPatch: {
                overhangDepth: 0.8
            }
        });
    }

    // 4. Ventilation Strategy Diagnostics
    if (currentConfig.ventMode !== 'night_purge' && isHotArid) {
        recs.push({
            id: 'night_purge_vent',
            category: 'Bioclimatic Ventilation',
            priority: 'HIGH',
            title: 'Implement Night-Purge Natural Flushing Strategy',
            problem: 'Shelter is ventilated during hot daytime or sealed improperly at night, missing cool nighttime desert air.',
            solution: 'Operate high-level and low-level vents exclusively between 20:00 and 07:00 when outdoor temperature is below 27°C, keeping envelope sealed during daytime.',
            impact: 'Flushes stored daytime thermal mass heat, starting the morning with a pre-cooled indoor temperature ~4.0°C lower.',
            applyPatch: {
                ventMode: 'night_purge'
            }
        });
    }

    if (currentConfig.ventMode !== 'continuous_cross' && isWarmHumid) {
        recs.push({
            id: 'continuous_cross_vent',
            category: 'Bioclimatic Ventilation',
            priority: 'CRITICAL',
            title: 'Maximize Continuous Cross-Ventilation & Elevated Plinth',
            problem: 'Warm-humid climate requires constant air velocity (>0.8 m/s) to maintain physiological sweat evaporation.',
            solution: 'Configure large operable permeable openings (WWR ~25%) aligned with prevailing coastal breeze, and raise shelter on 1.0m stilts.',
            impact: 'Boosts indoor air velocity to 0.8-1.2 m/s, yielding a 2.5°C apparent physiological cooling effect on PMV.',
            applyPatch: {
                ventMode: 'continuous_cross',
                foundationType: 'stilt_elevated',
                wwr: 25
            }
        });
    }

    // 5. Typology-Specific Enhancements
    if (isCold && currentConfig.typology !== 'trombe') {
        recs.push({
            id: 'trombe_wall_passive_solar',
            category: 'Passive Solar Heating',
            priority: 'HIGH',
            title: 'Integrate South-Facing Glazed Trombe Wall Collector',
            problem: 'High sub-zero heating load during alpine winter nights.',
            solution: 'Install double-glazed South Trombe wall with high-mass stone/CSEB storage and upper/lower air circulation dampers.',
            impact: 'Captures daytime direct solar gain (GHI > 1000 W/m²) and radiates thermal heat inward through the night.',
            applyPatch: {
                typology: 'trombe',
                wallAssembly: ASSEMBLY_PRESETS.walls.stone_straw_insul_350
            }
        });
    }

    if (isHotArid && currentConfig.typology !== 'wind_tower') {
        recs.push({
            id: 'wind_tower_badgir',
            category: 'Passive Cooling Typology',
            priority: 'MEDIUM',
            title: 'Incorporate Vernacular Badgir (Wind-Catcher Tower)',
            problem: 'Ground-level wind is obstructed or sluggish during peak summer days.',
            solution: 'Add a 2.2m rooftop wind-catcher scoop that captures high-velocity upper breezes and channels air downwards over clay porous pots for evaporative cooling.',
            impact: 'Increases stack and wind cooling by 35% without electrical power.',
            applyPatch: {
                typology: 'wind_tower'
            }
        });
    }

    // Generate Optimized Configuration by aggregating patches
    let optimizedConfig = { ...currentConfig };
    recs.forEach(rec => {
        if (rec.applyPatch) {
            optimizedConfig = { ...optimizedConfig, ...rec.applyPatch };
        }
    });

    // Run Simulation on the Optimized Configuration for Side-by-Side Comparison
    const optimizedSim = runThermalSimulation(optimizedConfig, climateData);

    return {
        recommendations: recs,
        optimizedConfig,
        optimizedSim
    };
}
