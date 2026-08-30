/**
 * BioShelter Studio - Physics & Biological Simulation Engine
 * Multi-variable thermodynamic and biological cycle simulation
 */

import { BIOMES, GLAZING_MATERIALS, SPECIES_DATABASE } from './ecosystem-data.js';

export class SimulationEngine {
  constructor(stateStore) {
    this.store = stateStore;
  }

  // Calculate sun altitude and azimuth angle
  calculateSunPosition(latitudeDeg, dayOfYear, hour) {
    const latRad = (latitudeDeg * Math.PI) / 180;
    // Declination angle
    const declination = 23.45 * Math.sin(((2 * Math.PI) / 365) * (dayOfYear - 81)) * (Math.PI / 180);
    // Hour angle
    const hourAngle = ((hour - 12) * 15 * Math.PI) / 180;

    // Solar elevation (altitude)
    const sinAlt = Math.sin(latRad) * Math.sin(declination) + Math.cos(latRad) * Math.cos(declination) * Math.cos(hourAngle);
    const altitudeRad = Math.asin(Math.max(-1, Math.min(1, sinAlt)));
    const altitudeDeg = (altitudeRad * 180) / Math.PI;

    // Solar azimuth
    const cosAz = (Math.sin(declination) - Math.sin(latRad) * sinAlt) / (Math.cos(latRad) * Math.cos(altitudeRad));
    let azimuthRad = Math.acos(Math.max(-1, Math.min(1, cosAz)));
    if (hour > 12) azimuthRad = 2 * Math.PI - azimuthRad;
    const azimuthDeg = (azimuthRad * 180) / Math.PI;

    return {
      altitude: Math.max(0, altitudeDeg),
      azimuth: azimuthDeg,
      isDaylight: altitudeDeg > 0
    };
  }

  // Day of year for month midpoint
  getDayOfYear(month) {
    const days = [15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345];
    return days[Math.max(0, Math.min(11, month - 1))];
  }

  // Calculate 24-hour simulation curve
  simulateDay(month = 1, weatherOverride = 'normal') {
    const state = this.store.getState();
    const biome = BIOMES[state.biomeId] || BIOMES.temperate;
    const metrics = this.store.getCalculatedMetrics();
    const glazing = GLAZING_MATERIALS[state.glazingType] || GLAZING_MATERIALS.etfe_triple;
    
    const dayOfYear = this.getDayOfYear(month);
    const hourlyData = [];

    // Ambient seasonal baseline
    const isSummer = month >= 5 && month <= 9;
    const seasonalBaseTemp = isSummer ? biome.avgSummerTemp : biome.avgWinterTemp;
    
    // Subterranean constant earth temperature (~10-13°C)
    const deepEarthTemp = 11.5;

    // Thermal mass water buffer (kJ/K)
    const thermalCapKj = (metrics.waterMassKg * 4.184) + (metrics.volumeM3 * 1.2 * 1.005); // water + air thermal capacity
    let currentShelterTemp = seasonalBaseTemp + (isSummer ? 2 : 12); // starts buffered
    let currentMassTemp = currentShelterTemp;
    let batteryChargeKwh = state.batteryKwh * 0.8;

    for (let h = 0; h < 24; h++) {
      const sun = this.calculateSunPosition(biome.latitude, dayOfYear, h);
      
      // Ambient temperature diurnal swing
      const diurnalSine = Math.sin(((h - 9) / 24) * 2 * Math.PI);
      let ambientTemp = seasonalBaseTemp + (diurnalSine * (isSummer ? 7 : 5));

      // Weather override modifiers
      let cloudFactor = 1.0;
      if (weatherOverride === 'heatwave') {
        ambientTemp += 9;
      } else if (weatherOverride === 'blizzard') {
        ambientTemp -= 14;
        cloudFactor = 0.35;
      } else if (weatherOverride === 'overcast') {
        cloudFactor = 0.25;
      } else if (weatherOverride === 'storm') {
        ambientTemp -= 4;
        cloudFactor = 0.15;
      }

      // Solar Radiation (W/m²)
      const directSolarW = sun.isDaylight 
        ? Math.max(0, 950 * Math.sin((sun.altitude * Math.PI) / 180) * cloudFactor)
        : 0;
      
      // PAR Light (Photosynthetically Active Radiation in µmol/m²/s)
      const parLight = directSolarW * 2.1 * glazing.lightTransmittance;

      // Solar Heat Gain inside envelope (Watts)
      const glazedArea = metrics.envelopeArea * state.glazingRatio;
      const unglazedInsulatedArea = metrics.envelopeArea * (1 - state.glazingRatio);
      const solarHeatGainWatts = directSolarW * glazedArea * glazing.lightTransmittance * 0.85;

      // Envelope Conductive Heat Loss/Gain (Watts)
      const uGlazing = glazing.uValue;
      const uInsulatedWall = 5.678 / Math.max(5, state.northWallInsulationR); // Convert R to U (W/m²·K)
      const conductiveLossWatts = ((uGlazing * glazedArea) + (uInsulatedWall * unglazedInsulatedArea)) * (currentShelterTemp - ambientTemp);

      // Subterranean Ground-to-Air Heat Transfer (GAHT) effect
      const gahtAirflowM3s = (state.gahtAirflowCfm * 0.0004719) * (state.gahtPipeLengthM / 100);
      const gahtExchangeWatts = gahtAirflowM3s * 1200 * (deepEarthTemp - currentShelterTemp); // Positive when warming, negative when cooling

      // Biological Compost & Animal Metabolic Heat
      const compostHeatWatts = (state.compostMassKg / 1000) * 85; // 85W per ton active compost
      const aquaticHeatWatts = (state.aquaponicsVolumeM3) * 15; // pumps & microbial activity

      // Net Heat Flux into Air (Watts)
      const netThermalWatts = solarHeatGainWatts - conductiveLossWatts + gahtExchangeWatts + compostHeatWatts + aquaticHeatWatts;

      // Water Thermal Mass Absorption / Release
      const massCouplingCoeff = 850; // W/K exchange rate between air and water drums
      const massExchangeWatts = massCouplingCoeff * (currentMassTemp - currentShelterTemp);
      
      // Update water mass and shelter air temperature over 3600 seconds
      const deltaAirTemp = ((netThermalWatts + massExchangeWatts) * 3600) / (metrics.volumeM3 * 1200);
      const deltaMassTemp = ((-massExchangeWatts) * 3600) / (metrics.waterMassKg * 4184);

      currentShelterTemp += Math.max(-4, Math.min(4, deltaAirTemp));
      currentMassTemp += Math.max(-0.8, Math.min(0.8, deltaMassTemp));

      // CO2 Level Dynamics (ppm)
      // Base atmospheric 420 ppm
      let co2Ppm = 420;
      if (sun.isDaylight && parLight > 100) {
        // High plant photosynthesis drawdown balanced by mushroom production
        const hasMushrooms = state.activeSpecies.includes('oyster_mushrooms');
        const hasWorms = state.activeSpecies.includes('red_worms');
        const co2Boost = (hasMushrooms ? 350 : 0) + (hasWorms ? 120 : 0);
        co2Ppm = Math.max(380, 750 + co2Boost - (parLight * 0.45));
      } else {
        // Respiration buildup at night
        co2Ppm = 950 + (state.activeSpecies.includes('oyster_mushrooms') ? 450 : 0);
      }

      // Relative Humidity (%)
      // Transpiration increases with temp & light; GAHT condenses excess moisture
      let relativeHumidity = 55 + (Math.sin((h / 24) * 2 * Math.PI) * 12);
      if (currentShelterTemp > 28) relativeHumidity += 10;
      if (state.biomeId === 'arid') relativeHumidity = Math.max(35, relativeHumidity - 20);
      if (state.biomeId === 'subtropical') relativeHumidity = Math.min(95, relativeHumidity + 18);

      // Solar Electrical Generation (kW) & Battery State of Charge
      const solarGenKw = (directSolarW / 1000) * state.solarPvKw * 0.88;
      const baseElectricLoadKw = 0.85 + (state.aquaponicsVolumeM3 * 0.08) + (state.gahtAirflowCfm * 0.0003);
      const netElectricKw = solarGenKw - baseElectricLoadKw;
      batteryChargeKwh = Math.max(0, Math.min(state.batteryKwh, batteryChargeKwh + (netElectricKw * 1.0)));
      const batterySocPercent = (batteryChargeKwh / Math.max(1, state.batteryKwh)) * 100;

      // Dissolved Oxygen in Aquaponics (mg/L)
      const doSat = 14.6 - (0.35 * Math.max(10, Math.min(32, currentMassTemp)));
      const dissolvedOxygen = Math.max(4.5, doSat * 0.82);

      hourlyData.push({
        hour: h,
        hourLabel: `${h.toString().padStart(2, '0')}:00`,
        ambientTemp: Math.round(ambientTemp * 10) / 10,
        shelterTemp: Math.round(currentShelterTemp * 10) / 10,
        massTemp: Math.round(currentMassTemp * 10) / 10,
        directSolarW: Math.round(directSolarW),
        parLight: Math.round(parLight),
        co2Ppm: Math.round(co2Ppm),
        relativeHumidity: Math.round(relativeHumidity),
        solarGenKw: Math.round(solarGenKw * 100) / 100,
        electricLoadKw: Math.round(baseElectricLoadKw * 100) / 100,
        batterySocPercent: Math.round(batterySocPercent),
        dissolvedOxygen: Math.round(dissolvedOxygen * 10) / 10,
        sunAltitude: Math.round(sun.altitude * 10) / 10,
        sunAzimuth: Math.round(sun.azimuth * 10) / 10
      });
    }

    return hourlyData;
  }

  // Calculate annual 12-month summary for climate stability profile
  simulateAnnualOverview() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyProfiles = [];

    for (let m = 1; m <= 12; m++) {
      const dayData = this.simulateDay(m, 'normal');
      const temps = dayData.map(d => d.shelterTemp);
      const ambientTemps = dayData.map(d => d.ambientTemp);
      const solarGen = dayData.reduce((acc, d) => acc + d.solarGenKw, 0);

      monthlyProfiles.push({
        month: months[m - 1],
        minShelterTemp: Math.min(...temps),
        maxShelterTemp: Math.max(...temps),
        avgShelterTemp: Math.round((temps.reduce((a, b) => a + b, 0) / temps.length) * 10) / 10,
        minAmbientTemp: Math.min(...ambientTemps),
        maxAmbientTemp: Math.max(...ambientTemps),
        avgAmbientTemp: Math.round((ambientTemps.reduce((a, b) => a + b, 0) / ambientTemps.length) * 10) / 10,
        monthlySolarGenKwh: Math.round(solarGen * 30.5)
      });
    }

    return monthlyProfiles;
  }

  // Aquaponic Nitrogen Balance analysis
  getNitrogenBalance() {
    const state = this.store.getState();
    const fishVolume = state.aquaponicsVolumeM3;
    const activeFish = state.activeSpecies.filter(id => {
      const s = SPECIES_DATABASE.find(x => x.id === id);
      return s && s.category === 'aquatic';
    });

    const feedPerDayKg = fishVolume * 0.45; // ~450g feed per m3 per day
    const ammoniaProducedGramsDay = feedPerDayKg * 38; // ~38g total ammonia nitrogen per kg feed
    const nitrateProducedGramsDay = ammoniaProducedGramsDay * 3.6; // stoichiometric conversion

    const plantAreaM2 = state.floorArea ? state.floorArea * 0.4 : 35;
    const plantNitrateUptakeGramsDay = plantAreaM2 * 3.2; // average vegetative bed uptake

    const balanceRatio = Math.round((plantNitrateUptakeGramsDay / Math.max(1, nitrateProducedGramsDay)) * 100);

    return {
      feedPerDayKg: Math.round(feedPerDayKg * 100) / 100,
      ammoniaProducedGramsDay: Math.round(ammoniaProducedGramsDay * 10) / 10,
      nitrateProducedGramsDay: Math.round(nitrateProducedGramsDay * 10) / 10,
      plantNitrateUptakeGramsDay: Math.round(plantNitrateUptakeGramsDay * 10) / 10,
      balanceRatio, // 100% is perfectly balanced
      status: balanceRatio >= 85 && balanceRatio <= 115 ? 'Optimal Equilibrium' : (balanceRatio < 85 ? 'Nutrient Surplus (Expand Plant Beds)' : 'Nutrient Deficit (Add Fish Biomass)')
    };
  }
}
