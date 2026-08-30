/**
 * BioShelter Studio - Reactive State Management
 */

import { PRESET_DESIGNS, BIOMES, STRUCTURE_TYPES, GLAZING_MATERIALS, SPECIES_DATABASE } from './ecosystem-data.js';

class StateStore {
  constructor() {
    this.listeners = new Map();
    this.state = this.getInitialState();
  }

  getInitialState() {
    const defaultPreset = PRESET_DESIGNS.homestead_ark;
    return {
      currentProcess: 1, // 1: Site, 2: Geometry, 3: Bio-Loops, 4: Physics Sim, 5: Ecosystem, 6: Blueprints/BOM
      presetId: 'homestead_ark',
      projectName: 'BioShelter Ark Alpha',
      
      // Process 1: Site & Solar
      biomeId: defaultPreset.biome,
      customLatitude: 45,
      orientationAzimuth: 180, // 180° = True South
      siteElevationM: 350,
      windExposure: 'moderate', // low, moderate, severe
      
      // Process 2: Structure & Geometry
      structureType: defaultPreset.structure,
      diameter: defaultPreset.diameter, // meters
      height: defaultPreset.height, // meters
      glazingType: defaultPreset.glazing,
      northWallInsulationR: 35, // hr·ft²·°F/BTU
      glazingRatio: 0.65, // % of envelope that is glazed vs insulated berm
      subterraneanDepthM: 1.2, // for walipini or sunken floor
      
      // Process 3: Bio-Loop Subsystems
      thermalMassLiters: defaultPreset.thermalMassLiters,
      aquaponicsVolumeM3: defaultPreset.aquaponicsVolumeM3,
      hydroponicBedAreaM2: 24,
      soilBedAreaM2: 32,
      compostMassKg: 1200,
      gahtPipeLengthM: defaultPreset.gahtPipeLengthM,
      gahtAirflowCfm: 650,
      solarPvKw: defaultPreset.solarPvKw,
      batteryKwh: defaultPreset.batteryKwh,
      rainCatchmentAreaM2: defaultPreset.rainCatchmentAreaM2,
      cisternVolumeLiters: 15000,
      
      // Process 4: Simulation Controls
      simMonth: 1, // 1 = January (Mid-Winter), 7 = July (Mid-Summer)
      simHour: 12, // 0 to 23
      simSpeed: 1, // 1x, 5x, 20x
      simPlaying: false,
      weatherOverride: 'normal', // normal, heatwave, blizzard, overcast, storm
      
      // Process 5: Active Ecosystem Species
      activeSpecies: [...defaultPreset.activeSpecies],
      
      // Process 6: BOM & Blueprints
      currency: 'USD',
      laborCostMultiplier: 1.2,
      
      // UI & 3D Viewport Flags
      viewportMode: 'realistic', // realistic, thermal_heatmap, wireframe, airflow_vectors
      layerVisibility: {
        structure: true,
        glazing: true,
        thermalMass: true,
        aquaponics: true,
        vegetation: true,
        earthTubes: true,
        sunVector: true
      }
    };
  }

  get(key) {
    return this.state[key];
  }

  getState() {
    return { ...this.state };
  }

  set(key, value) {
    if (this.state[key] === value) return;
    const oldValue = this.state[key];
    this.state[key] = value;
    this.emit(key, value, oldValue);
    this.emit('*', this.state);
    this.saveToStorage();
  }

  update(updates) {
    let changed = false;
    for (const [key, value] of Object.entries(updates)) {
      if (this.state[key] !== value) {
        const old = this.state[key];
        this.state[key] = value;
        this.emit(key, value, old);
        changed = true;
      }
    }
    if (changed) {
      this.emit('*', this.state);
      this.saveToStorage();
    }
  }

  loadPreset(presetId) {
    const preset = PRESET_DESIGNS[presetId];
    if (!preset) return;

    this.update({
      presetId,
      projectName: preset.name,
      biomeId: preset.biome,
      structureType: preset.structure,
      glazingType: preset.glazing,
      diameter: preset.diameter,
      height: preset.height,
      thermalMassLiters: preset.thermalMassLiters,
      aquaponicsVolumeM3: preset.aquaponicsVolumeM3,
      solarPvKw: preset.solarPvKw,
      batteryKwh: preset.batteryKwh,
      gahtPipeLengthM: preset.gahtPipeLengthM,
      rainCatchmentAreaM2: preset.rainCatchmentAreaM2,
      activeSpecies: [...preset.activeSpecies]
    });
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  emit(event, ...args) {
    if (this.listeners.has(event)) {
      for (const cb of this.listeners.get(event)) {
        try {
          cb(...args);
        } catch (e) {
          console.error(`Error in listener for event ${event}:`, e);
        }
      }
    }
  }

  toggleSpecies(speciesId) {
    const list = [...this.state.activeSpecies];
    const index = list.indexOf(speciesId);
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(speciesId);
    }
    this.set('activeSpecies', list);
  }

  saveToStorage() {
    try {
      localStorage.setItem('bioshelter_studio_state', JSON.stringify(this.state));
    } catch (e) {
      // Storage might be unavailable in some environments
    }
  }

  loadFromStorage() {
    try {
      const data = localStorage.getItem('bioshelter_studio_state');
      if (data) {
        const parsed = JSON.parse(data);
        this.update(parsed);
      }
    } catch (e) {
      console.warn('Could not load stored state:', e);
    }
  }

  // Calculated geometry metrics
  getCalculatedMetrics() {
    const { diameter, height, structureType, glazingType, thermalMassLiters, aquaponicsVolumeM3, activeSpecies, solarPvKw } = this.state;
    const radius = diameter / 2;
    const floorArea = Math.PI * radius * radius;
    
    // Envelope area approximation based on shape
    let envelopeArea = 2 * Math.PI * radius * height;
    if (structureType === 'geodesic') {
      envelopeArea = 2 * Math.PI * radius * radius * 1.05; // hemisphere-like
    } else if (structureType === 'walipini') {
      envelopeArea = floorArea * 1.35; // mostly glazing roof + pit walls
    } else if (structureType === 'passive_solar_leanto') {
      envelopeArea = floorArea * 1.45;
    }

    const volumeM3 = (2 / 3) * floorArea * height;
    const glazingMat = GLAZING_MATERIALS[glazingType] || GLAZING_MATERIALS.etfe_triple;

    // Biomass & harvest yield
    let annualFoodYieldKg = 0;
    let annualCalories = 0;
    let annualProteinKg = 0;

    activeSpecies.forEach(spId => {
      const sp = SPECIES_DATABASE.find(s => s.id === spId);
      if (!sp) return;
      if (sp.category === 'aquatic') {
        const fishKg = sp.yieldKgPerM3Year * aquaponicsVolumeM3;
        annualFoodYieldKg += fishKg;
        annualProteinKg += fishKg * (sp.proteinContentPercent / 100);
        annualCalories += fishKg * 1100;
      } else if (sp.category === 'crop') {
        const cropKg = sp.yieldKgPerM2Year * (floorArea * 0.4); // 40% growing footprint
        annualFoodYieldKg += cropKg;
        annualCalories += cropKg * (sp.caloriesPerKg || 250);
        annualProteinKg += cropKg * 0.03;
      }
    });

    // Thermal inertia rating (kWh per degree delta)
    const waterMassKg = thermalMassLiters + (aquaponicsVolumeM3 * 1000);
    const thermalCapKwhPerC = (waterMassKg * 4184) / 3600000; // 4.184 kJ/kg/C

    // Estimated annual solar generation
    const biome = BIOMES[this.state.biomeId] || BIOMES.temperate;
    const annualSolarKwh = solarPvKw * biome.solarIrradiance * 365 * 0.82; // 82% system efficiency

    return {
      floorArea: Math.round(floorArea * 10) / 10,
      envelopeArea: Math.round(envelopeArea * 10) / 10,
      volumeM3: Math.round(volumeM3 * 10) / 10,
      thermalCapKwhPerC: Math.round(thermalCapKwhPerC * 10) / 10,
      waterMassKg: Math.round(waterMassKg),
      annualFoodYieldKg: Math.round(annualFoodYieldKg),
      annualCalories: Math.round(annualCalories),
      annualProteinKg: Math.round(annualProteinKg * 10) / 10,
      annualSolarKwh: Math.round(annualSolarKwh),
      glazingUValue: glazingMat.uValue,
      glazingRValue: glazingMat.rValue
    };
  }
}

export const stateStore = new StateStore();
