/**
 * BioShelter Studio - Numerical Thermal Simulation & Comfort Solver
 * Transient multi-node thermal balance solver + ASHRAE 55 PMV/PPD & Adaptive Comfort Engine
 */

import { calculateAssemblyPhysics, ASSEMBLY_PRESETS } from './materialDatabase.js';

export function runThermalSimulation(shelterConfig, climateData) {
    const hourlyWeather = climateData.hourly;
    const zone = climateData.zone;

    // Dimensions
    const L = Number(shelterConfig.length || 6.0); // m (East-West length)
    const W = Number(shelterConfig.width || 4.0);  // m (North-South width)
    const H = Number(shelterConfig.height || 3.0); // m (Wall height)
    const pitch = Number(shelterConfig.roofPitch || 20); // deg
    const orientation = Number(shelterConfig.orientation || 0); // 0 = South facing long wall
    const wwr = Number(shelterConfig.wwr || 15) / 100; // Window-to-wall ratio
    const overhang = Number(shelterConfig.overhangDepth || 0.4); // m
    const occupants = Number(shelterConfig.occupants || 3);
    const ventMode = shelterConfig.ventMode || 'adaptive_diurnal';
    const foundationType = shelterConfig.foundationType || 'slab';

    // Building Physics
    const wallAssembly = shelterConfig.wallAssembly || ASSEMBLY_PRESETS.walls.cseb_interlocking_230;
    const roofAssembly = shelterConfig.roofAssembly || ASSEMBLY_PRESETS.roofs.thatched_high_pitch;

    const wallPhysics = calculateAssemblyPhysics(wallAssembly, false);
    const roofPhysics = calculateAssemblyPhysics(roofAssembly, true);

    // Geometric areas
    const wallAreaSouth = L * H;
    const wallAreaNorth = L * H;
    const wallAreaEast = W * H;
    const wallAreaWest = W * H;
    const totalWallGrossArea = 2 * (L * H + W * H);
    const totalWindowArea = totalWallGrossArea * wwr;
    
    // Windows distribution
    const winAreaSouth = totalWindowArea * 0.4;
    const winAreaNorth = totalWindowArea * 0.3;
    const winAreaEast = totalWindowArea * 0.15;
    const winAreaWest = totalWindowArea * 0.15;

    const netWallAreaSouth = Math.max(0, wallAreaSouth - winAreaSouth);
    const netWallAreaNorth = Math.max(0, wallAreaNorth - winAreaNorth);
    const netWallAreaEast = Math.max(0, wallAreaEast - winAreaEast);
    const netWallAreaWest = Math.max(0, wallAreaWest - winAreaWest);

    const floorArea = L * W;
    const volume = floorArea * H + 0.5 * floorArea * Math.tan((pitch * Math.PI) / 180);
    const roofArea = floorArea / Math.cos((pitch * Math.PI) / 180);

    // Glazing properties
    const uGlazing = 3.2; // W/m²·K
    const shgc = 0.65;

    // Air capacitance (J/K) + indoor effective thermal capacitance from internal mass & partitions
    const airCapacitance = volume * 1.2 * 1005; // rho * cp
    const envelopeCapacitance = (totalWallGrossArea * wallPhysics.arealHeatCapacityKJ * 1000 * 0.25) +
                                (roofArea * roofPhysics.arealHeatCapacityKJ * 1000 * 0.2) +
                                (floorArea * 80000);
    const totalEffectiveCapacity = airCapacitance + envelopeCapacitance;

    // Simulation Time Loop: run 3 full 24h cycles to achieve periodic steady state
    const numCycles = 3;
    const dt = 3600; // 1 hour step in seconds
    let tIndoor = hourlyWeather[0].ambientTemp;

    let hourlyResults = [];

    for (let cycle = 0; cycle < numCycles; cycle++) {
        hourlyResults = [];

        for (let h = 0; h < 24; h++) {
            const w = hourlyWeather[h];
            const tAmb = w.ambientTemp;
            const ghi = w.ghi;
            const dni = w.dni;
            const dhi = w.dhi;
            const sunElev = w.sunElevation;
            const windSpd = w.windSpeed;
            const rh = w.relativeHumidity;

            // Surface Solar Irradiance calculations based on orientation & sun elevation
            const solFactorSouth = (sunElev > 0) ? Math.max(0, Math.cos((sunElev - 15) * Math.PI / 180)) : 0;
            const solFactorEast = (h >= 6 && h <= 12 && sunElev > 0) ? Math.max(0, Math.sin(((h - 6) / 6) * Math.PI)) : 0;
            const solFactorWest = (h >= 12 && h <= 18 && sunElev > 0) ? Math.max(0, Math.sin(((h - 12) / 6) * Math.PI)) : 0;
            const solFactorNorth = 0.15;

            const iSouth = dni * solFactorSouth + dhi * 0.5;
            const iEast = dni * solFactorEast + dhi * 0.5;
            const iWest = dni * solFactorWest + dhi * 0.5;
            const iNorth = dhi * solFactorNorth;
            const iRoof = ghi;

            // Shading factor from overhang
            const shadingFactor = Math.min(0.95, Math.max(0.1, (overhang / 1.0) * (sunElev / 60)));

            // Sol-Air Temperatures
            const ho = 17.0;
            const deltaR = 4.0;
            const tSolSouth = tAmb + (wallPhysics.surfaceAbsorptance * iSouth - wallPhysics.surfaceEmissivity * deltaR) / ho;
            const tSolNorth = tAmb + (wallPhysics.surfaceAbsorptance * iNorth - wallPhysics.surfaceEmissivity * deltaR) / ho;
            const tSolEast = tAmb + (wallPhysics.surfaceAbsorptance * iEast - wallPhysics.surfaceEmissivity * deltaR) / ho;
            const tSolWest = tAmb + (wallPhysics.surfaceAbsorptance * iWest - wallPhysics.surfaceEmissivity * deltaR) / ho;
            const tSolRoof = tAmb + (roofPhysics.surfaceAbsorptance * iRoof - roofPhysics.surfaceEmissivity * 6.0) / ho;

            // Conductive flux with thermal inertia
            const qCondSouth = wallPhysics.uValue * netWallAreaSouth * (tSolSouth * wallPhysics.decrementFactor + tAmb * (1 - wallPhysics.decrementFactor) - tIndoor);
            const qCondNorth = wallPhysics.uValue * netWallAreaNorth * (tSolNorth * wallPhysics.decrementFactor + tAmb * (1 - wallPhysics.decrementFactor) - tIndoor);
            const qCondEast = wallPhysics.uValue * netWallAreaEast * (tSolEast * wallPhysics.decrementFactor + tAmb * (1 - wallPhysics.decrementFactor) - tIndoor);
            const qCondWest = wallPhysics.uValue * netWallAreaWest * (tSolWest * wallPhysics.decrementFactor + tAmb * (1 - wallPhysics.decrementFactor) - tIndoor);
            const qCondRoof = roofPhysics.uValue * roofArea * (tSolRoof * roofPhysics.decrementFactor + tAmb * (1 - roofPhysics.decrementFactor) - tIndoor);

            const qCondEnvelope = qCondSouth + qCondNorth + qCondEast + qCondWest + qCondRoof;

            // Window Direct & Diffuse Solar Heat Gains
            const qSolarGlazing = (
                winAreaSouth * (iSouth * (1 - shadingFactor) * shgc) +
                winAreaNorth * (iNorth * shgc) +
                winAreaEast * (iEast * (1 - shadingFactor * 0.5) * shgc) +
                winAreaWest * (iWest * (1 - shadingFactor * 0.5) * shgc)
            );
            const qGlazingCond = uGlazing * totalWindowArea * (tAmb - tIndoor);

            // Natural Ventilation Calculation
            let ach = 0.5;
            let isOpenWindow = false;

            if (ventMode === 'continuous_cross') {
                isOpenWindow = true;
            } else if (ventMode === 'night_purge') {
                if (h >= 20 || h <= 7) {
                    isOpenWindow = (tAmb < tIndoor + 0.5);
                } else {
                    isOpenWindow = false;
                }
            } else if (ventMode === 'comfort_vent') {
                isOpenWindow = (tAmb < 32 && tIndoor > 24);
            } else if (ventMode === 'adaptive_diurnal') {
                isOpenWindow = (tAmb < tIndoor);
            } else if (ventMode === 'minimum_airtight') {
                isOpenWindow = false;
                ach = 0.35;
            }

            if (isOpenWindow) {
                const openArea = totalWindowArea * 0.40;
                const qvWind = 0.55 * openArea * windSpd;
                const deltaT = Math.abs(tIndoor - tAmb);
                const qvStack = 0.40 * openArea * Math.sqrt(Math.max(0, 2 * 9.81 * (H * 0.6) * deltaT / (273 + tIndoor)));
                const qvTotal = Math.sqrt(qvWind * qvWind + qvStack * qvStack);
                ach = Math.min(25, Math.max(1.0, (qvTotal * 3600) / volume));
            }

            const mDotAir = (ach * volume * 1.2) / 3600;
            const qVentilation = mDotAir * 1005 * (tAmb - tIndoor);

            // Ground heat flux
            let qGround = 0;
            if (foundationType === 'slab') {
                const uGround = 0.45;
                qGround = uGround * floorArea * (climateData.params.groundTempAvg - tIndoor);
            } else {
                const uElevatedFloor = 1.2;
                qGround = uElevatedFloor * floorArea * (tAmb - tIndoor);
            }

            // Internal Heat Gains
            const qOccupancy = occupants * 75;
            const qLighting = (h >= 18 && h <= 23) ? 40 : 10;
            const qInternal = qOccupancy + qLighting;

            // Net Heat Balance
            const qNet = qCondEnvelope + qSolarGlazing + qGlazingCond + qVentilation + qGround + qInternal;

            // Update Indoor Temperature via explicit Euler step
            tIndoor = tIndoor + (qNet / totalEffectiveCapacity) * dt;

            // Mean Radiant Temperature (T_mrt)
            const tWallAvg = (tSolSouth + tSolNorth + tSolEast + tSolWest) / 4;
            const tMrt = 0.65 * tIndoor + 0.20 * tWallAvg + 0.15 * tSolRoof;

            // Operative Temperature
            const tOperative = (tIndoor + tMrt) / 2;

            // Indoor Air Velocity estimate
            const indoorAirVelocity = isOpenWindow ? Math.min(1.5, Math.max(0.1, windSpd * 0.25)) : 0.1;

            // Fanger PMV and PPD
            const cloValue = (tIndoor < 20) ? 1.0 : (tIndoor > 28 ? 0.4 : 0.6);
            const pmvResult = calculateFangerPMV({
                tAir: tIndoor,
                tMrt: tMrt,
                vAir: indoorAirVelocity,
                rh: rh,
                met: 1.1,
                clo: cloValue
            });

            // Adaptive Thermal Comfort (ASHRAE 55 / IMAC)
            const tRunningMeanOutdoor = (climateData.params.tMax + climateData.params.tMin) / 2;
            const tAdaptiveNeutral = 17.8 + 0.31 * tRunningMeanOutdoor;
            const adaptiveUpper80 = tAdaptiveNeutral + 3.5;
            const adaptiveLower80 = tAdaptiveNeutral - 3.5;
            const isComfortableAdaptive = (tOperative >= adaptiveLower80 && tOperative <= adaptiveUpper80);

            hourlyResults.push({
                hour: h,
                ambientTemp: tAmb,
                indoorTemp: Math.round(tIndoor * 10) / 10,
                mrtTemp: Math.round(tMrt * 10) / 10,
                operativeTemp: Math.round(tOperative * 10) / 10,
                pmv: Math.round(pmvResult.pmv * 100) / 100,
                ppd: Math.round(pmvResult.ppd * 10) / 10,
                ach: Math.round(ach * 10) / 10,
                indoorAirVelocity: Math.round(indoorAirVelocity * 100) / 100,
                isComfortableAdaptive,
                adaptiveNeutral: Math.round(tAdaptiveNeutral * 10) / 10,
                adaptiveUpper80: Math.round(adaptiveUpper80 * 10) / 10,
                adaptiveLower80: Math.round(adaptiveLower80 * 10) / 10,
                heatFluxes: {
                    conduction: Math.round(qCondEnvelope),
                    solarGlazing: Math.round(qSolarGlazing + qGlazingCond),
                    ventilation: Math.round(qVentilation),
                    ground: Math.round(qGround),
                    internal: Math.round(qInternal),
                    qNet: Math.round(qNet)
                }
            });
        }
    }

    // Statistical Summary
    let totalComfortHours = 0;
    let maxIndoorTemp = -999;
    let minIndoorTemp = 999;
    let sumIndoorTemp = 0;
    let sumOperativeTemp = 0;
    let discomfortDegreeHoursCooling = 0;
    let discomfortDegreeHoursHeating = 0;

    hourlyResults.forEach(r => {
        if (r.isComfortableAdaptive) totalComfortHours++;
        if (r.indoorTemp > maxIndoorTemp) maxIndoorTemp = r.indoorTemp;
        if (r.indoorTemp < minIndoorTemp) minIndoorTemp = r.indoorTemp;
        sumIndoorTemp += r.indoorTemp;
        sumOperativeTemp += r.operativeTemp;

        if (r.operativeTemp > r.adaptiveUpper80) {
            discomfortDegreeHoursCooling += (r.operativeTemp - r.adaptiveUpper80);
        }
        if (r.operativeTemp < r.adaptiveLower80) {
            discomfortDegreeHoursHeating += (r.adaptiveLower80 - r.operativeTemp);
        }
    });

    const avgIndoorTemp = Math.round((sumIndoorTemp / 24) * 10) / 10;
    const avgOperativeTemp = Math.round((sumOperativeTemp / 24) * 10) / 10;
    const diurnalIndoorRange = Math.round((maxIndoorTemp - minIndoorTemp) * 10) / 10;
    const ambientDiurnalRange = Math.round((climateData.params.tMax - climateData.params.tMin) * 10) / 10;
    const thermalDampingRatio = Math.round((1 - diurnalIndoorRange / Math.max(1, ambientDiurnalRange)) * 100);
    const comfortScorePercent = Math.round((totalComfortHours / 24) * 100);

    return {
        hourly: hourlyResults,
        summary: {
            avgIndoorTemp,
            maxIndoorTemp: Math.round(maxIndoorTemp * 10) / 10,
            minIndoorTemp: Math.round(minIndoorTemp * 10) / 10,
            avgOperativeTemp,
            diurnalIndoorRange,
            thermalDampingRatio,
            comfortHours: totalComfortHours,
            comfortScorePercent,
            ddhCooling: Math.round(discomfortDegreeHoursCooling * 10) / 10,
            ddhHeating: Math.round(discomfortDegreeHoursHeating * 10) / 10,
            wallU: wallPhysics.uValue,
            roofU: roofPhysics.uValue,
            wallTimeLag: wallPhysics.timeLagHours,
            roofTimeLag: roofPhysics.timeLagHours
        }
    };
}

/**
 * Standard Fanger PMV / PPD Numerical Solver (ISO 7730 / ASHRAE 55)
 * Features under-relaxation for guaranteed numerical stability across extreme ranges.
 */
export function calculateFangerPMV({ tAir, tMrt, vAir, rh, met = 1.1, clo = 0.5 }) {
    const M = met * 58.15; // W/m²
    const W = 0;           // External work
    const Icl = 0.155 * clo; // m²·K/W

    // Water vapor pressure (Pa)
    const pVapor = (rh / 100) * 10 * Math.exp(16.6536 - 4030.183 / (tAir + 235));

    // Clothing area factor
    const fCl = (Icl <= 0.078) ? (1.0 + 1.29 * Icl) : (1.05 + 0.645 * Icl);

    let tCl = tAir + (35.5 - tAir) / (3.5 * (Icl + 0.1));
    const hcf = 12.1 * Math.sqrt(Math.max(0.01, vAir));

    // Iterative surface temperature calculation with under-relaxation
    for (let iter = 0; iter < 150; iter++) {
        const hcNatural = 2.38 * Math.pow(Math.abs(tCl - tAir), 0.25);
        const hc = Math.max(hcf, hcNatural);

        const radTerm = 3.96e-8 * fCl * (Math.pow(Math.max(0, tCl + 273.15), 4) - Math.pow(Math.max(0, tMrt + 273.15), 4));
        const convTerm = fCl * hc * (tCl - tAir);

        const tClTarget = 35.7 - 0.028 * (M - W) - Icl * (radTerm + convTerm);
        const tClNew = tCl + 0.25 * (tClTarget - tCl);

        if (Math.abs(tClNew - tCl) < 0.0001) break;
        tCl = tClNew;
    }

    const hcNatural = 2.38 * Math.pow(Math.abs(tCl - tAir), 0.25);
    const hc = Math.max(hcf, hcNatural);

    // Heat loss components
    const HL1 = 3.05 * 0.001 * (5733 - 6.99 * (M - W) - pVapor); // Skin diffusion
    const HL2 = (M - W > 58.15) ? (0.42 * (M - W - 58.15)) : 0;   // Sweating
    const HL3 = 1.7e-5 * M * (5867 - pVapor);                      // Latent respiration
    const HL4 = 0.0014 * M * (34 - tAir);                          // Dry respiration
    const HL5 = 3.96e-8 * fCl * (Math.pow(Math.max(0, tCl + 273.15), 4) - Math.pow(Math.max(0, tMrt + 273.15), 4)); // Radiation
    const HL6 = fCl * hc * (tCl - tAir);                           // Convection

    const thermalLoad = (M - W) - (HL1 + HL2 + HL3 + HL4 + HL5 + HL6);
    const pmv = (0.303 * Math.exp(-0.036 * M) + 0.028) * thermalLoad;
    const clampedPmv = Math.min(3.0, Math.max(-3.0, pmv));

    // PPD formulation
    const ppd = 100.0 - 95.0 * Math.exp(-0.03353 * Math.pow(clampedPmv, 4) - 0.2179 * Math.pow(clampedPmv, 2));

    return {
        pmv: clampedPmv,
        ppd: Math.min(99.9, Math.max(5.0, ppd))
    };
}
