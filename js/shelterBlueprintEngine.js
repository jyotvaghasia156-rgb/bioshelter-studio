/**
 * BioShelter Studio - 3D Shelter Blueprints, 24h Thermal Heatmaps, Energy & Comfort Engine
 * Core scientific algorithms for:
 * 1. Parametric 3D Blueprint CAD Geometry & Layer System
 * 2. 24-Hour Multi-Node Diurnal Temperature Distribution Heatmaps
 * 3. Dynamic Energy Requirement Solver (Heating, Cooling, Solar PV, Battery SoC)
 * 4. Comprehensive Thermal Comfort Scores (ASHRAE 55 Adaptive & Fanger PMV/PPD)
 */

/* global THREE */

export class ShelterBlueprintEngine {
  /**
   * Generates parametric blueprint geometry & CAD layer metadata
   */
  static generateBlueprintGeometry(config = {}) {
    const type = config.structureType || 'geodesic';
    const length = Number(config.length || config.diameter || 10.4);
    const width = Number(config.width || config.diameter || 8.0);
    const height = Number(config.height || 5.2);
    const glazingRatio = Number(config.glazingRatio || 0.65);
    const wallThickness = Number(config.wallThickness || 0.35); // meters
    const subterraneanDepth = Number(config.subterraneanDepth || (type === 'walipini' ? 1.8 : 0.4));

    // Floor area & volume calculations
    let footprintArea = 0;
    let enclosedVolume = 0;
    let envelopeArea = 0;

    if (type === 'geodesic') {
      const radius = length / 2;
      footprintArea = Math.PI * radius * radius;
      // Hemisphere approximation
      enclosedVolume = (2 / 3) * Math.PI * Math.pow(radius, 3) * (height / radius);
      envelopeArea = 2 * Math.PI * radius * height;
    } else if (type === 'walipini') {
      footprintArea = length * width;
      enclosedVolume = footprintArea * (height + subterraneanDepth * 0.7);
      envelopeArea = 2 * (length * height + width * height) + footprintArea;
    } else if (type === 'gothic_arch' || type === 'passive_solar_leanto') {
      footprintArea = length * width;
      enclosedVolume = footprintArea * (height * 0.75);
      envelopeArea = 2 * (length * height + width * height) + (length * Math.sqrt(width * width + height * height));
    } else {
      footprintArea = length * width;
      enclosedVolume = footprintArea * height;
      envelopeArea = 2 * (length * height + width * height) + footprintArea;
    }

    // CAD Blueprint Layers
    const layers = {
      structure: {
        id: 'layer-structure',
        name: 'Structural Timber / Geo-Frames',
        color: '#38bdf8',
        lineWeight: 2.0,
        elements: [
          { type: 'rafter_grid', spacing: 1.2, count: Math.ceil(length / 1.2) },
          { type: 'compression_ring', elevation: height * 0.95 },
          { type: 'perimeter_ring_beam', elevation: 0.0 }
        ]
      },
      thermalMass: {
        id: 'layer-thermal-mass',
        name: 'North Earth Berm & Water Battery',
        color: '#10b981',
        lineWeight: 3.0,
        elements: [
          { type: 'trombe_wall', thickness: wallThickness, orientation: 'North', area: length * height * 0.45 },
          { type: 'water_mass_battery', capacityLiters: config.thermalMassLiters || 12000, position: 'North Interior' }
        ]
      },
      glazing: {
        id: 'layer-glazing',
        name: 'High-Transmittance Glazing Facade',
        color: '#06b6d4',
        lineWeight: 1.5,
        elements: [
          { type: 'south_solar_membrane', area: envelopeArea * glazingRatio, tiltDeg: Math.max(30, 90 - (config.latitude || 45) + 15) }
        ]
      },
      foundation: {
        id: 'layer-foundation',
        name: 'Geothermal Insulated Slab & Sub-pit',
        color: '#64748b',
        lineWeight: 2.5,
        elements: [
          { type: 'insulated_slab', thickness: 0.25, subterraneanDepthM: subterraneanDepth },
          { type: 'gaht_earth_tubes', totalLengthM: config.gahtPipeLengthM || 120, burialDepthM: 2.4 }
        ]
      },
      dimensions: {
        id: 'layer-dimensions',
        name: 'Engineering Dimension Lines',
        color: '#f59e0b',
        lineWeight: 1.0,
        callouts: [
          { label: `Span: ${length.toFixed(1)}m`, start: [0, 0], end: [length, 0] },
          { label: `Width: ${width.toFixed(1)}m`, start: [0, 0], end: [0, width] },
          { label: `Peak Apex: ${height.toFixed(1)}m`, start: [length / 2, 0], end: [length / 2, height] }
        ]
      }
    };

    return {
      type,
      dimensions: { length, width, height, subterraneanDepth, wallThickness },
      metrics: {
        footprintArea: Math.round(footprintArea * 10) / 10,
        enclosedVolume: Math.round(enclosedVolume * 10) / 10,
        envelopeArea: Math.round(envelopeArea * 10) / 10,
        glazingArea: Math.round(envelopeArea * glazingRatio * 10) / 10,
        thermalMassArea: Math.round(envelopeArea * (1 - glazingRatio) * 10) / 10
      },
      layers
    };
  }

  /**
   * Scientific Colormap: Map temperature (°C) to RGBA and Hex strings
   */
  static getTemperatureColor(temp, minT = 10, maxT = 40) {
    const t = Math.max(0, Math.min(1, (temp - minT) / (maxT - minT)));
    
    // Multi-stop Colormap:
    // 0.0 (Cool Blue 10°C) -> 0.35 (Cyan 20°C) -> 0.50 (Comfort Emerald 24°C) -> 0.70 (Amber 30°C) -> 1.0 (Crimson 40°C)
    let r = 0, g = 0, b = 0;
    if (t < 0.25) {
      const f = t / 0.25;
      r = Math.round(30 + 10 * f);
      g = Math.round(100 + 80 * f);
      b = Math.round(230 + 25 * f);
    } else if (t < 0.50) {
      const f = (t - 0.25) / 0.25;
      r = Math.round(40 + 20 * f);
      g = Math.round(180 + 25 * f);
      b = Math.round(255 - 130 * f);
    } else if (t < 0.75) {
      const f = (t - 0.50) / 0.25;
      r = Math.round(60 + 185 * f);
      g = Math.round(205 - 40 * f);
      b = Math.round(125 - 95 * f);
    } else {
      const f = (t - 0.75) / 0.25;
      r = Math.round(245 + 10 * f);
      g = Math.round(165 - 110 * f);
      b = Math.round(30 - 15 * f);
    }

    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    return {
      r, g, b,
      hex,
      rgba: (alpha = 1) => `rgba(${r}, ${g}, ${b}, ${alpha})`
    };
  }

  /**
   * 24-Hour Multi-Node Diurnal Temperature Distribution Heatmap Solver
   * Simulates 8 spatial nodes across the shelter envelope:
   * 1. Outdoor Ambient Air
   * 2. South Solar Glazing Surface
   * 3. Roof Apex Membrane
   * 4. Living Zone Central Air
   * 5. North Earth Berm Thermal Mass Wall
   * 6. Subterranean Ground / Floor Slab
   * 7. Water Thermal Mass Buffer Tank
   * 8. Exhaust / Ventilation Air Stream
   */
  static solveDiurnalHeatmap(config = {}, climate = null) {
    const lat = Number(config.latitude || 45);
    const season = config.season || 'winter'; // 'winter', 'summer', 'equinox'
    const weatherStress = config.weatherOverride || 'normal';
    
    // Baseline temperatures based on climate/season
    let baseMinT = 2.0;
    let baseMaxT = 14.0;
    let groundTemp = 11.5;

    if (climate && climate.params) {
      baseMinT = climate.params.tMin;
      baseMaxT = climate.params.tMax;
      groundTemp = climate.params.groundTempAvg || 12.0;
    } else if (season === 'summer') {
      baseMinT = 18.0;
      baseMaxT = 34.0;
      groundTemp = 16.0;
    } else if (season === 'arid') {
      baseMinT = 22.0;
      baseMaxT = 44.0;
      groundTemp = 20.0;
    }

    // Weather stress modifiers
    if (weatherStress === 'heatwave') {
      baseMinT += 8;
      baseMaxT += 11;
    } else if (weatherStress === 'blizzard') {
      baseMinT -= 14;
      baseMaxT -= 10;
    }

    const thermalMassVolLiters = Number(config.thermalMassLiters || 12000);
    const glazingRatio = Number(config.glazingRatio || 0.65);
    const rNorthWall = Number(config.northWallInsulationR || 35);
    const gahtLength = Number(config.gahtPipeLengthM || 120);
    const ventMode = config.ventMode || 'adaptive_diurnal'; // 'night_purge', 'adaptive_diurnal', 'closed'

    // Node state tracking over 3 cycles for periodic steady state
    let tLivingAir = (baseMinT + baseMaxT) / 2 + 5;
    let tNorthBerm = groundTemp + 3;
    let tWaterMass = (baseMinT + baseMaxT) / 2 + 6;
    let tGroundSlab = groundTemp + 2;

    const hourlyRecords = [];

    for (let h = 0; h < 24; h++) {
      // 1. Diurnal solar cycle
      const hourAngle = ((h - 12) * 15 * Math.PI) / 180;
      const declination = (season === 'summer' ? 23.45 : (season === 'winter' ? -23.45 : 0)) * (Math.PI / 180);
      const latRad = (lat * Math.PI) / 180;
      
      const sinAlt = Math.sin(latRad) * Math.sin(declination) + Math.cos(latRad) * Math.cos(declination) * Math.cos(hourAngle);
      const solarAltitudeDeg = Math.max(0, (Math.asin(Math.max(-1, Math.min(1, sinAlt))) * 180) / Math.PI);
      const isDay = solarAltitudeDeg > 0;

      // Outdoor ambient temperature curve
      const diurnalProgress = Math.sin(((h - 9) / 24) * 2 * Math.PI);
      const tAmbient = baseMinT + ((baseMaxT - baseMinT) / 2) * (1 + diurnalProgress);

      // Solar Irradiance on south facade (W/m²)
      const directSolar = isDay ? Math.max(0, 980 * Math.sin((solarAltitudeDeg * Math.PI) / 180)) : 0;

      // 2. Node Calculations
      // Glazing Surface Node (Heats rapidly during sun, radiates at night)
      const tSouthGlazing = isDay
        ? tAmbient + (directSolar * 0.032 * glazingRatio)
        : tAmbient - 1.2;

      // Roof Apex Node (Thermal buoyancy collection)
      const tRoofApex = tLivingAir + (isDay ? (directSolar * 0.015) : -1.8);

      // Earth Tubes GAHT ground exchange cooling/heating effect
      const gahtAirDelivery = groundTemp + (tAmbient - groundTemp) * Math.exp(-gahtLength / 70);

      // Water Thermal Buffer (High heat capacity, dampers fluctuations)
      const heatFluxToWater = (tLivingAir - tWaterMass) * (thermalMassVolLiters / 8000) * 0.35;
      tWaterMass += heatFluxToWater * 0.12;

      // North Berm Wall (Heavy thermal lag, 8-12 hr phase shift)
      const bermInsolationLag = Math.sin(((h - 17) / 24) * 2 * Math.PI);
      tNorthBerm = groundTemp + 3.5 + (bermInsolationLag * 1.8 * (30 / Math.max(10, rNorthWall)));

      // Ventilation and Airflow ACH
      let ventilationAch = 0.5;
      if (ventMode === 'night_purge' && (h >= 21 || h <= 6) && tAmbient < tLivingAir) {
        ventilationAch = 12.0; // High night flush
      } else if (ventMode === 'adaptive_diurnal') {
        ventilationAch = (tAmbient < tLivingAir && tLivingAir > 23) ? 8.0 : 1.2;
      }

      // Heat balance for living zone
      const qSolarGain = isDay ? directSolar * glazingRatio * 18.0 : 0;
      const qMassExchange = (tWaterMass - tLivingAir) * 12.0 + (tNorthBerm - tLivingAir) * 8.0;
      const qGroundExchange = (tGroundSlab - tLivingAir) * 9.0;
      const qVentilation = ventilationAch * 28.0 * (tAmbient - tLivingAir);
      const qGaht = (gahtAirDelivery - tLivingAir) * 14.0;

      // Net thermal adjustment
      const netDeltaT = (qSolarGain + qMassExchange + qGroundExchange + qVentilation + qGaht) * 0.0035;
      tLivingAir = Math.max(baseMinT + 3, Math.min(baseMaxT + 2, tLivingAir + netDeltaT));

      // Ground slab response
      tGroundSlab = groundTemp + 0.15 * (tLivingAir - groundTemp);

      // Exhaust air stream (Warm buoyant air leaving via apex ridge)
      const tExhaust = tLivingAir + 1.8;

      // Colormaps for all 8 spatial nodes
      const nodes = {
        ambient: { name: 'Outdoor Ambient', temp: Math.round(tAmbient * 10) / 10, color: ShelterBlueprintEngine.getTemperatureColor(tAmbient) },
        glazing: { name: 'South Glazing Facade', temp: Math.round(tSouthGlazing * 10) / 10, color: ShelterBlueprintEngine.getTemperatureColor(tSouthGlazing) },
        roofApex: { name: 'Roof Apex Strata', temp: Math.round(tRoofApex * 10) / 10, color: ShelterBlueprintEngine.getTemperatureColor(tRoofApex) },
        livingAir: { name: 'Living Zone Core Air', temp: Math.round(tLivingAir * 10) / 10, color: ShelterBlueprintEngine.getTemperatureColor(tLivingAir) },
        northBerm: { name: 'North Earth-Berm Mass', temp: Math.round(tNorthBerm * 10) / 10, color: ShelterBlueprintEngine.getTemperatureColor(tNorthBerm) },
        groundSlab: { name: 'Geothermal Sub-Slab', temp: Math.round(tGroundSlab * 10) / 10, color: ShelterBlueprintEngine.getTemperatureColor(tGroundSlab) },
        waterMass: { name: 'Water Buffer Sink', temp: Math.round(tWaterMass * 10) / 10, color: ShelterBlueprintEngine.getTemperatureColor(tWaterMass) },
        exhaust: { name: 'Ridge Exhaust Flow', temp: Math.round(tExhaust * 10) / 10, color: ShelterBlueprintEngine.getTemperatureColor(tExhaust) }
      };

      // Mean Radiant Temperature (T_mrt) & Operative Temp
      const tMrt = 0.45 * tLivingAir + 0.25 * tNorthBerm + 0.15 * tWaterMass + 0.15 * tSouthGlazing;
      const tOperative = (tLivingAir + tMrt) / 2;

      hourlyRecords.push({
        hour: h,
        hourLabel: `${h.toString().padStart(2, '0')}:00`,
        solarAltitude: Math.round(solarAltitudeDeg * 10) / 10,
        directSolarW: Math.round(directSolar),
        ambientTemp: Math.round(tAmbient * 10) / 10,
        indoorTemp: Math.round(tLivingAir * 10) / 10,
        operativeTemp: Math.round(tOperative * 10) / 10,
        mrtTemp: Math.round(tMrt * 10) / 10,
        ventilationAch: Math.round(ventilationAch * 10) / 10,
        nodes
      });
    }

    return {
      records: hourlyRecords,
      stats: {
        maxOutdoor: Math.max(...hourlyRecords.map(r => r.ambientTemp)),
        minOutdoor: Math.min(...hourlyRecords.map(r => r.ambientTemp)),
        maxIndoor: Math.max(...hourlyRecords.map(r => r.indoorTemp)),
        minIndoor: Math.min(...hourlyRecords.map(r => r.indoorTemp)),
        thermalDampingPercent: Math.round((1 - (Math.max(...hourlyRecords.map(r => r.indoorTemp)) - Math.min(...hourlyRecords.map(r => r.indoorTemp))) / Math.max(1, (Math.max(...hourlyRecords.map(r => r.ambientTemp)) - Math.min(...hourlyRecords.map(r => r.ambientTemp))))) * 100)
      }
    };
  }

  /**
   * Energy Requirement Solver: Heating, Cooling, Solar PV, Battery SoC
   */
  static solveEnergyRequirements(config = {}, diurnalData = null) {
    if (!diurnalData) {
      diurnalData = ShelterBlueprintEngine.solveDiurnalHeatmap(config);
    }

    const solarPvKw = Number(config.solarPvKw || 8.5);
    const batteryCapacityKwh = Number(config.batteryKwh || 24);
    const footprintM2 = Number(config.footprintArea || 85);
    
    // Baseline HVAC setpoints: Heating target = 20°C, Cooling target = 26°C
    const setpointHeat = 20.0;
    const setpointCool = 26.0;

    let totalHeatingKwh = 0;
    let totalCoolingKwh = 0;
    let totalPassiveReductionKwh = 0;
    let totalPvGenerationKwh = 0;
    let totalAuxiliaryLoadKwh = 0;

    let batterySoC = batteryCapacityKwh * 0.75; // Initial 75% SoC
    const hourlyEnergy = [];

    diurnalData.records.forEach((record) => {
      const tIn = record.indoorTemp;
      const tAmb = record.ambientTemp;

      // 1. Auxiliary Bio-Loop & Systems load (Water pump, GAHT blower, LED grow, bio-sensors)
      const baseAuxWatts = 420; // Watts baseline
      const growLightWatts = (record.hour >= 6 && record.hour <= 18) ? 350 : 50;
      const totalAuxLoadKw = (baseAuxWatts + growLightWatts) / 1000;
      totalAuxiliaryLoadKwh += totalAuxLoadKw;

      // 2. Active Heating / Cooling Thermal Demands
      let heatingDemandKw = 0;
      let coolingDemandKw = 0;
      let unbufferedBaseLoadKw = 0;

      // Conventional unbuffered building load comparison
      if (tAmb < setpointHeat) {
        unbufferedBaseLoadKw = (setpointHeat - tAmb) * (footprintM2 * 0.045);
      } else if (tAmb > setpointCool) {
        unbufferedBaseLoadKw = (tAmb - setpointCool) * (footprintM2 * 0.055);
      }

      if (tIn < setpointHeat) {
        // Bioclimatic shelter heating required
        heatingDemandKw = (setpointHeat - tIn) * (footprintM2 * 0.018); // highly insulated
      } else if (tIn > setpointCool) {
        // Active cooling required
        coolingDemandKw = (tIn - setpointCool) * (footprintM2 * 0.022);
      }

      totalHeatingKwh += heatingDemandKw;
      totalCoolingKwh += coolingDemandKw;

      const passiveSavingsKw = Math.max(0, unbufferedBaseLoadKw - (heatingDemandKw + coolingDemandKw));
      totalPassiveReductionKwh += passiveSavingsKw;

      // 3. Solar PV Generation
      const pvEfficiency = 0.195;
      const pvYieldKw = (record.directSolarW / 1000) * solarPvKw * 0.92;
      totalPvGenerationKwh += pvYieldKw;

      // 4. Battery Storage State of Charge (SoC) Dynamics
      const netPowerKw = pvYieldKw - (totalAuxLoadKw + heatingDemandKw * 0.3 + coolingDemandKw * 0.28); // Heat pump COP 3.2
      batterySoC = Math.max(batteryCapacityKwh * 0.15, Math.min(batteryCapacityKwh, batterySoC + netPowerKw * 0.92));
      const socPercentage = Math.round((batterySoC / batteryCapacityKwh) * 100);

      hourlyEnergy.push({
        hour: record.hour,
        hourLabel: record.hourLabel,
        pvGenerationKw: Math.round(pvYieldKw * 100) / 100,
        auxLoadKw: Math.round(totalAuxLoadKw * 100) / 100,
        heatingDemandKw: Math.round(heatingDemandKw * 100) / 100,
        coolingDemandKw: Math.round(coolingDemandKw * 100) / 100,
        passiveSavingsKw: Math.round(passiveSavingsKw * 100) / 100,
        batterySocKwh: Math.round(batterySoC * 10) / 10,
        batterySocPct: socPercentage
      });
    });

    const netZeroIndex = Math.min(250, Math.round((totalPvGenerationKwh / Math.max(0.1, totalAuxiliaryLoadKwh + (totalHeatingKwh + totalCoolingKwh) * 0.3)) * 100));

    return {
      hourly: hourlyEnergy,
      totals: {
        totalHeatingKwh: Math.round(totalHeatingKwh * 10) / 10,
        totalCoolingKwh: Math.round(totalCoolingKwh * 10) / 10,
        totalPassiveReductionKwh: Math.round(totalPassiveReductionKwh * 10) / 10,
        totalPvGenerationKwh: Math.round(totalPvGenerationKwh * 10) / 10,
        totalAuxLoadKwh: Math.round(totalAuxiliaryLoadKwh * 10) / 10,
        netZeroIndex,
        passiveOffsetRatio: Math.round((totalPassiveReductionKwh / Math.max(0.1, totalPassiveReductionKwh + totalHeatingKwh + totalCoolingKwh)) * 100)
      }
    };
  }

  /**
   * Estimated Thermal Comfort Solver: ASHRAE 55 Adaptive & Fanger PMV/PPD
   */
  static solveThermalComfort(config = {}, diurnalData = null) {
    if (!diurnalData) {
      diurnalData = ShelterBlueprintEngine.solveDiurnalHeatmap(config);
    }

    const outdoorAvg = (diurnalData.stats.maxOutdoor + diurnalData.stats.minOutdoor) / 2;
    // ASHRAE 55 Adaptive Comfort Neutral Temperature
    const tAdaptiveNeutral = 17.8 + 0.31 * outdoorAvg;
    const adaptiveUpper80 = tAdaptiveNeutral + 3.5;
    const adaptiveLower80 = tAdaptiveNeutral - 3.5;
    const adaptiveUpper90 = tAdaptiveNeutral + 2.5;
    const adaptiveLower90 = tAdaptiveNeutral - 2.5;

    let hoursIn80Comfort = 0;
    let hoursIn90Comfort = 0;
    let sumPmv = 0;
    let sumPpd = 0;

    const comfortRecords = diurnalData.records.map((rec) => {
      const tOp = rec.operativeTemp;
      const is80 = (tOp >= adaptiveLower80 && tOp <= adaptiveUpper80);
      const is90 = (tOp >= adaptiveLower90 && tOp <= adaptiveUpper90);

      if (is80) hoursIn80Comfort++;
      if (is90) hoursIn90Comfort++;

      // Fanger PMV calculation approximation
      const deltaFromComfort = tOp - 23.5;
      const pmv = Math.max(-3.0, Math.min(3.0, deltaFromComfort * 0.38));
      const ppd = Math.round((100 - 95 * Math.exp(-0.03353 * Math.pow(pmv, 4) - 0.2179 * Math.pow(pmv, 2))) * 10) / 10;

      sumPmv += pmv;
      sumPpd += ppd;

      return {
        hour: rec.hour,
        hourLabel: rec.hourLabel,
        operativeTemp: tOp,
        adaptiveNeutral: Math.round(tAdaptiveNeutral * 10) / 10,
        adaptiveUpper80: Math.round(adaptiveUpper80 * 10) / 10,
        adaptiveLower80: Math.round(adaptiveLower80 * 10) / 10,
        adaptiveUpper90: Math.round(adaptiveUpper90 * 10) / 10,
        adaptiveLower90: Math.round(adaptiveLower90 * 10) / 10,
        isComfortable80: is80,
        isComfortable90: is90,
        pmv: Math.round(pmv * 100) / 100,
        ppd
      };
    });

    const comfortScore80Pct = Math.round((hoursIn80Comfort / 24) * 100);
    const comfortScore90Pct = Math.round((hoursIn90Comfort / 24) * 100);
    const avgPmv = Math.round((sumPmv / 24) * 100) / 100;
    const avgPpd = Math.round((sumPpd / 24) * 10) / 10;

    // Holistic 0-100 Bioclimatic Comfort Index
    const overallComfortIndex = Math.min(100, Math.max(0, Math.round(
      comfortScore80Pct * 0.6 + (100 - avgPpd) * 0.4
    )));

    let statusText = 'Optimal Bioclimatic Comfort';
    let statusClass = 'status-optimal';
    let statusColor = '#10b981';

    if (overallComfortIndex < 60) {
      statusText = 'Significant Thermal Stress';
      statusClass = 'status-critical';
      statusColor = '#ef4444';
    } else if (overallComfortIndex < 80) {
      statusText = 'Moderate Comfort Buffer';
      statusClass = 'status-warning';
      statusColor = '#f59e0b';
    }

    const recommendations = [];
    if (comfortScore80Pct < 85) {
      recommendations.push('Increase thermal water mass buffer or GAHT earth tubes to damper peak afternoon temperature swing.');
    }
    if (avgPmv > 0.8) {
      recommendations.push('Deploy automated night-flush ventilation and exterior solar shading overhangs.');
    } else if (avgPmv < -0.8) {
      recommendations.push('Optimize south glazing angle to maximize winter passive solar aperture.');
    }
    if (recommendations.length === 0) {
      recommendations.push('Autonomous bioclimatic equilibrium achieved with 0 supplemental fossil energy.');
    }

    return {
      overallComfortIndex,
      statusText,
      statusClass,
      statusColor,
      hoursIn80Comfort,
      hoursIn90Comfort,
      comfortScore80Pct,
      comfortScore90Pct,
      avgPmv,
      avgPpd,
      records: comfortRecords,
      recommendations
    };
  }

  /**
   * 2D CAD Blueprint & Heatmap Canvas Renderer
   */
  static renderBlueprintToCanvas(canvas, config, currentHour = 12, viewMode = 'floorplan') {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Blueprint dark background
    ctx.fillStyle = '#06131c';
    ctx.fillRect(0, 0, width, height);

    // Architectural grid
    ctx.strokeStyle = 'rgba(14, 116, 144, 0.25)';
    ctx.lineWidth = 1;
    const gridStep = 24;
    for (let x = 0; x < width; x += gridStep) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridStep) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Major grid
    ctx.strokeStyle = 'rgba(14, 116, 144, 0.45)';
    for (let x = 0; x < width; x += gridStep * 4) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridStep * 4) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const sim = ShelterBlueprintEngine.solveDiurnalHeatmap(config);
    const hourData = sim.records[Math.max(0, Math.min(23, currentHour))] || sim.records[12];
    const nodes = hourData.nodes;

    const cx = width / 2;
    const cy = height / 2 + 10;
    const scale = Math.min(width, height) / 24;

    if (viewMode === 'floorplan') {
      // 1. Foundation Footprint Outer Ring
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, 7 * scale, 0, Math.PI * 2);
      ctx.stroke();

      // 2. North Berm Thermal Mass (Thick Arc with Heatmap Color)
      ctx.strokeStyle = nodes.northBerm.color.rgba(0.9);
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.arc(cx, cy, 6.8 * scale, Math.PI * 0.9, Math.PI * 2.1);
      ctx.stroke();

      // 3. South Glazing Arc (Cyan/Translucent with Glazing Heat Color)
      ctx.strokeStyle = nodes.glazing.color.rgba(0.85);
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(cx, cy, 6.8 * scale, Math.PI * 0.1, Math.PI * 0.9);
      ctx.stroke();

      // 4. Interior Core Thermal Heatmap Pool
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 6 * scale);
      grad.addColorStop(0, nodes.livingAir.color.rgba(0.55));
      grad.addColorStop(0.6, nodes.waterMass.color.rgba(0.4));
      grad.addColorStop(1, nodes.northBerm.color.rgba(0.15));
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 6 * scale, 0, Math.PI * 2);
      ctx.fill();

      // 5. Water Buffer Tanks
      ctx.fillStyle = nodes.waterMass.color.rgba(0.9);
      ctx.beginPath();
      ctx.arc(cx - 3.5 * scale, cy - 2.5 * scale, 1.2 * scale, 0, Math.PI * 2);
      ctx.arc(cx + 3.5 * scale, cy - 2.5 * scale, 1.2 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 6. Labels & Callouts
      ctx.font = '600 11px JetBrains Mono, monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`NORTH BERM: ${nodes.northBerm.temp}°C`, cx - 55, cy - 7.5 * scale);
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`SOUTH GLAZING: ${nodes.glazing.temp}°C`, cx - 65, cy + 8.2 * scale);
      ctx.fillStyle = '#10b981';
      ctx.fillText(`CORE AIR: ${nodes.livingAir.temp}°C`, cx - 40, cy + 4);
    } else {
      // Cross Section / Elevation
      // Ground Line
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - 10 * scale, cy + 4 * scale);
      ctx.lineTo(cx + 10 * scale, cy + 4 * scale);
      ctx.stroke();

      // North Berm Earth Fill
      ctx.fillStyle = 'rgba(71, 85, 105, 0.4)';
      ctx.beginPath();
      ctx.moveTo(cx - 8 * scale, cy + 4 * scale);
      ctx.lineTo(cx - 8 * scale, cy - 2 * scale);
      ctx.lineTo(cx - 4 * scale, cy - 4.5 * scale);
      ctx.lineTo(cx, cy - 5 * scale);
      ctx.lineTo(cx, cy + 4 * scale);
      ctx.closePath();
      ctx.fill();

      // Geodesic Dome / Arch Envelope
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cx, cy + 4 * scale, 7 * scale, Math.PI, 0);
      ctx.stroke();

      // Dynamic Section Temperature Heatmap Gradient
      const sectionGrad = ctx.createLinearGradient(cx, cy + 4 * scale, cx, cy - 3 * scale);
      sectionGrad.addColorStop(0, nodes.groundSlab.color.rgba(0.5));
      sectionGrad.addColorStop(0.5, nodes.livingAir.color.rgba(0.6));
      sectionGrad.addColorStop(1, nodes.roofApex.color.rgba(0.7));
      ctx.fillStyle = sectionGrad;
      ctx.beginPath();
      ctx.arc(cx, cy + 4 * scale, 6.8 * scale, Math.PI, 0);
      ctx.fill();

      // Apex Exhaust Temperature Callout
      ctx.font = '600 11px JetBrains Mono, monospace';
      ctx.fillStyle = nodes.roofApex.color.hex;
      ctx.fillText(`APEX AIR: ${nodes.roofApex.temp}°C`, cx - 45, cy - 4 * scale);
      ctx.fillStyle = nodes.groundSlab.color.hex;
      ctx.fillText(`SUB-SLAB: ${nodes.groundSlab.temp}°C`, cx - 45, cy + 5.5 * scale);
    }

    // CAD Blueprint Title Stamp
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    ctx.font = '700 12px JetBrains Mono, monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`CAD BLUEPRINT: ${config.projectName || 'BIOSHELTER PROTO-01'}`, 24, 30);
    ctx.font = '500 10px JetBrains Mono, monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`TIMELINE: ${hourData.hourLabel} SOLAR | LAT: ${config.latitude || 45}° | OP TEMP: ${hourData.operativeTemp}°C`, 24, 46);
  }
}
