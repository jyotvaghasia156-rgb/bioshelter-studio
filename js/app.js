/**
 * BioShelter Studio - Main Application Controller
 */

import { stateStore } from './state.js';
import { BIOMES, STRUCTURE_TYPES, GLAZING_MATERIALS, SPECIES_DATABASE, PRESET_DESIGNS } from './ecosystem-data.js';
import { SimulationEngine } from './simulation-engine.js';
import { ThreeViewport } from './three-viewport.js';
import { BlueprintRenderer } from './blueprint-renderer.js';
import { ExportManager } from './export-manager.js';
import { formatAzimuthLabel } from './utils.js'; // BUG-01 FIX: shared utility

class BioShelterApp {
  constructor() {
    this.simEngine = new SimulationEngine(stateStore);
    this.exportManager = new ExportManager(stateStore);
    this.threeViewport = null;
    this.blueprintRenderer = null;
    this.charts = {};
    this.simTimer = null;
    this.activeSpeciesFilter = 'all'; // UI-08 FIX: preserve filter across tab switches

    // UI-14 FIX: handle case where DOMContentLoaded already fired (deferred modules)
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  init() {
    // 1. Load any saved state from storage
    stateStore.loadFromStorage();

    // 2. Initialize 3D Viewport & 2D Canvas
    this.threeViewport = new ThreeViewport('three-canvas-container', stateStore);
    this.blueprintRenderer = new BlueprintRenderer('blueprint-canvas', stateStore);

    // 3. Setup Process Ribbon Navigation
    this.setupProcessNavigation();

    // 4. Setup UI Forms for all 6 Processes
    this.setupProcess1SiteControls();
    this.setupProcess2GeometryControls();
    this.setupProcess3BioLoopControls();
    this.setupProcess4SimulationControls();
    this.setupProcess5EcosystemControls();
    this.setupProcess6ExportControls();

    // 5. Setup Viewport Overlays & Presets
    this.setupViewportControls();
    this.setupPresetSelector();
    this.syncFormControlsWithState();

    // 6. Subscribe to State Changes for Live Telemetry & Time Dock
    stateStore.on('*', () => this.updateTelemetry());
    stateStore.on('simHour', (h) => {
      const dockTime = document.getElementById('dock-sim-time');
      if (dockTime) dockTime.textContent = `${h.toString().padStart(2, '0')}:00 Solar`;
    });
    this.updateTelemetry();

    // 7. Initialize Charts for Simulation View
    this.initSimulationCharts();

    console.log('🌱 BioShelter Studio initialized successfully');
  }

  // --- PROCESS NAVIGATION ---
  setupProcessNavigation() {
    const processButtons = document.querySelectorAll('.process-step-btn');
    const processPanes = document.querySelectorAll('.process-pane');
    const stage3D = document.getElementById('three-stage-view');
    const stageBlueprint = document.getElementById('blueprint-stage-view');
    const stageCharts = document.getElementById('charts-stage-view');

    processButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const step = parseInt(btn.dataset.step, 10);
        stateStore.set('currentProcess', step);

        // Update active buttons
        processButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update active sidebar panes
        processPanes.forEach(p => p.classList.remove('active'));
        const activePane = document.getElementById(`pane-process-${step}`);
        if (activePane) activePane.classList.add('active');

        // Switch main viewport stage view
        if (step === 4) {
          // Simulation Charts View
          if (stage3D) stage3D.style.display = 'none';
          if (stageBlueprint) stageBlueprint.style.display = 'none';
          if (stageCharts) stageCharts.style.display = 'grid';
          this.updateSimulationCharts();
        } else if (step === 5) {
          // Ecosystem tab — re-apply active filter to keep catalog in sync (UI-08 FIX)
          if (stage3D) stage3D.style.display = 'block';
          if (stageBlueprint) stageBlueprint.style.display = 'none';
          if (stageCharts) stageCharts.style.display = 'none';
          if (this._renderSpecies) this._renderSpecies(this.activeSpeciesFilter);
          if (this.threeViewport) this.threeViewport.onResize();
        } else if (step === 6) {
          // Blueprint / BOM View
          if (stage3D) stage3D.style.display = 'none';
          if (stageBlueprint) stageBlueprint.style.display = 'block';
          if (stageCharts) stageCharts.style.display = 'none';
          if (this.blueprintRenderer) {
            this.blueprintRenderer.resizeCanvas();
            this.blueprintRenderer.render();
          }
          this.renderBOMTable();
        } else {
          // 3D Three.js Viewport
          if (stage3D) stage3D.style.display = 'block';
          if (stageBlueprint) stageBlueprint.style.display = 'none';
          if (stageCharts) stageCharts.style.display = 'none';
          if (this.threeViewport) this.threeViewport.onResize();
        }
      });
    });

    // UI-11 FIX: Mobile sidebar toggle handler
    const mobileToggle = document.getElementById('mobile-sidebar-toggle');
    const sidebar = document.querySelector('.process-sidebar');
    if (mobileToggle && sidebar) {
      mobileToggle.addEventListener('click', () => {
        const isOpen = sidebar.classList.toggle('mobile-open');
        mobileToggle.textContent = isOpen ? '✕' : '⚙️';
      });
    }
  }

  // --- PROCESS 1: SITE & SOLAR CLIMATE ---
  setupProcess1SiteControls() {
    const biomeSelect = document.getElementById('biome-select');
    const latSlider = document.getElementById('latitude-slider');
    const latVal = document.getElementById('latitude-val');
    const azimuthSlider = document.getElementById('azimuth-slider');
    const azimuthVal = document.getElementById('azimuth-val');
    const biomeDesc = document.getElementById('biome-desc');

    if (biomeSelect) {
      biomeSelect.addEventListener('change', (e) => {
        const biomeId = e.target.value;
        const biome = BIOMES[biomeId];
        stateStore.set('biomeId', biomeId);
        if (biome) {
          stateStore.set('customLatitude', biome.latitude);
          if (latSlider) latSlider.value = biome.latitude;
          if (latVal) latVal.textContent = `${biome.latitude}° N`;
          if (biomeDesc) biomeDesc.textContent = biome.description;
        }
      });
    }

    if (latSlider) {
      latSlider.addEventListener('input', (e) => {
        const lat = parseFloat(e.target.value);
        stateStore.set('customLatitude', lat);
        if (latVal) latVal.textContent = `${lat}° N`;
        document.querySelectorAll('.lat-preset-btn').forEach(b => b.classList.remove('active'));
      });
    }

    // Latitude Quick Presets
    const latButtons = document.querySelectorAll('.lat-preset-btn');
    latButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        latButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const lat = parseFloat(btn.dataset.lat);
        stateStore.set('customLatitude', lat);
        if (latSlider) latSlider.value = lat;
        if (latVal) latVal.textContent = `${lat}° N`;
        // UI-06 FIX: auto-select matching biome if button has data-biome attribute
        const matchedBiome = btn.dataset.biome;
        if (matchedBiome && biomeSelect) {
          biomeSelect.value = matchedBiome;
          stateStore.set('biomeId', matchedBiome);
          const biome = BIOMES[matchedBiome];
          if (biome && biomeDesc) biomeDesc.textContent = biome.description;
        }
      });
    });

    // BUG-01 FIX: use shared formatAzimuthLabel from utils.js (not a local copy)
    if (azimuthSlider) {
      azimuthSlider.addEventListener('input', (e) => {
        const az = parseFloat(e.target.value);
        stateStore.set('orientationAzimuth', az);
        if (azimuthVal) azimuthVal.textContent = formatAzimuthLabel(az);
        document.querySelectorAll('.az-preset-btn').forEach(b => b.classList.remove('active'));
      });
    }

    // Azimuth Quick Presets
    const azButtons = document.querySelectorAll('.az-preset-btn');
    azButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        azButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const az = parseFloat(btn.dataset.az);
        stateStore.set('orientationAzimuth', az);
        if (azimuthSlider) azimuthSlider.value = az;
        if (azimuthVal) azimuthVal.textContent = formatAzimuthLabel(az);
      });
    });
  }

  // --- PROCESS 2: STRUCTURE & GEOMETRY ---
  setupProcess2GeometryControls() {
    const structSelect = document.getElementById('structure-select');
    const diamSlider = document.getElementById('diameter-slider');
    const diamVal = document.getElementById('diameter-val');
    const heightSlider = document.getElementById('height-slider');
    const heightVal = document.getElementById('height-val');
    const glazingSelect = document.getElementById('glazing-select');
    const glazingRatioSlider = document.getElementById('glazing-ratio-slider');
    const glazingRatioVal = document.getElementById('glazing-ratio-val');
    const insulationSlider = document.getElementById('insulation-slider');
    const insulationVal = document.getElementById('insulation-val');

    if (structSelect) {
      structSelect.addEventListener('change', (e) => {
        stateStore.set('structureType', e.target.value);
      });
    }

    if (diamSlider) {
      diamSlider.addEventListener('input', (e) => {
        const d = parseFloat(e.target.value);
        stateStore.set('diameter', d);
        if (diamVal) diamVal.textContent = `${d.toFixed(1)} m`;
      });
    }

    if (heightSlider) {
      heightSlider.addEventListener('input', (e) => {
        const h = parseFloat(e.target.value);
        stateStore.set('height', h);
        if (heightVal) heightVal.textContent = `${h.toFixed(1)} m`;
      });
    }

    if (glazingSelect) {
      glazingSelect.addEventListener('change', (e) => {
        stateStore.set('glazingType', e.target.value);
      });
    }

    if (glazingRatioSlider) {
      glazingRatioSlider.addEventListener('input', (e) => {
        const ratio = parseFloat(e.target.value);
        stateStore.set('glazingRatio', ratio / 100);
        if (glazingRatioVal) glazingRatioVal.textContent = `${ratio}%`;
      });
    }

    if (insulationSlider) {
      insulationSlider.addEventListener('input', (e) => {
        const r = parseInt(e.target.value, 10);
        stateStore.set('northWallInsulationR', r);
        if (insulationVal) insulationVal.textContent = `R-${r}`;
      });
    }
  }

  // --- PROCESS 3: BIO-LOOP SUBSYSTEMS ---
  setupProcess3BioLoopControls() {
    const thermalSlider = document.getElementById('thermal-mass-slider');
    const thermalVal = document.getElementById('thermal-mass-val');
    const aquaSlider = document.getElementById('aquaponics-slider');
    const aquaVal = document.getElementById('aquaponics-val');
    const gahtSlider = document.getElementById('gaht-slider');
    const gahtVal = document.getElementById('gaht-val');
    const solarSlider = document.getElementById('solar-pv-slider');
    const solarVal = document.getElementById('solar-pv-val');
    const batterySlider = document.getElementById('battery-slider');
    const batteryVal = document.getElementById('battery-val');

    if (thermalSlider) {
      thermalSlider.addEventListener('input', (e) => {
        const l = parseInt(e.target.value, 10);
        stateStore.set('thermalMassLiters', l);
        if (thermalVal) thermalVal.textContent = `${l.toLocaleString()} L`;
      });
    }

    if (aquaSlider) {
      aquaSlider.addEventListener('input', (e) => {
        const m3 = parseFloat(e.target.value);
        stateStore.set('aquaponicsVolumeM3', m3);
        if (aquaVal) aquaVal.textContent = `${m3.toFixed(1)} m³`;
      });
    }

    if (gahtSlider) {
      gahtSlider.addEventListener('input', (e) => {
        const m = parseInt(e.target.value, 10);
        stateStore.set('gahtPipeLengthM', m);
        if (gahtVal) gahtVal.textContent = `${m} m`;
      });
    }

    if (solarSlider) {
      solarSlider.addEventListener('input', (e) => {
        const kw = parseFloat(e.target.value);
        stateStore.set('solarPvKw', kw);
        if (solarVal) solarVal.textContent = `${kw.toFixed(1)} kW`;
      });
    }

    if (batterySlider) {
      batterySlider.addEventListener('input', (e) => {
        const kwh = parseInt(e.target.value, 10);
        stateStore.set('batteryKwh', kwh);
        if (batteryVal) batteryVal.textContent = `${kwh} kWh`;
      });
    }
  }

  // --- PROCESS 4: SIMULATION CONTROLS ---
  setupProcess4SimulationControls() {
    const monthSelect = document.getElementById('sim-month-select');
    const hourSlider = document.getElementById('sim-hour-slider');
    const hourVal = document.getElementById('sim-hour-val');
    const weatherSelect = document.getElementById('weather-override-select');
    const playBtn = document.getElementById('sim-play-toggle');
    const speedBtn = document.getElementById('sim-speed-toggle');

    if (monthSelect) {
      monthSelect.addEventListener('change', (e) => {
        const m = parseInt(e.target.value, 10);
        stateStore.set('simMonth', m);
        this.updateSimulationCharts();
      });
    }

    if (hourSlider) {
      hourSlider.addEventListener('input', (e) => {
        const h = parseInt(e.target.value, 10);
        stateStore.set('simHour', h);
        if (hourVal) hourVal.textContent = `${h.toString().padStart(2, '0')}:00`;
        const dockTime = document.getElementById('dock-sim-time');
        if (dockTime) dockTime.textContent = `${h.toString().padStart(2, '0')}:00 Solar`;
      });
    }

    if (weatherSelect) {
      weatherSelect.addEventListener('change', (e) => {
        stateStore.set('weatherOverride', e.target.value);
        this.updateSimulationCharts();
      });
    }

    if (playBtn) {
      playBtn.addEventListener('click', () => {
        const isPlaying = !stateStore.get('simPlaying');
        stateStore.set('simPlaying', isPlaying);
        // UI-05 FIX: use plain unicode symbols (not emoji) for consistent cross-platform rendering
        playBtn.textContent = isPlaying ? '⏸' : '▶';

        if (isPlaying) {
          this.startSimulationLoop();
        } else {
          this.stopSimulationLoop();
        }
      });
    }

    // 1x, 5x, 10x, 20x Simulation Speed Control
    const speedButtons = document.querySelectorAll('.sim-speed-btn');
    speedButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        speedButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const sp = parseInt(btn.dataset.speed, 10) || 1;
        stateStore.set('simSpeed', sp);
        if (stateStore.get('simPlaying')) {
          this.startSimulationLoop();
        }
      });
    });
  }

  startSimulationLoop() {
    if (this.simTimer) clearInterval(this.simTimer);
    this.simTimer = setInterval(() => {
      let h = (stateStore.get('simHour') + 1) % 24;
      stateStore.set('simHour', h);
      const hourSlider = document.getElementById('sim-hour-slider');
      const hourVal = document.getElementById('sim-hour-val');
      if (hourSlider) hourSlider.value = h;
      if (hourVal) hourVal.textContent = `${h.toString().padStart(2, '0')}:00`;
    }, 1000 / (stateStore.get('simSpeed') || 1));
  }

  stopSimulationLoop() {
    if (this.simTimer) {
      clearInterval(this.simTimer);
      this.simTimer = null;
    }
  }

  // --- PROCESS 5: ECOSYSTEM & SPECIES ---
  setupProcess5EcosystemControls() {
    const catalogContainer = document.getElementById('species-catalog');
    const filterButtons = document.querySelectorAll('.species-filter-btn');

    const renderSpecies = (category = 'all') => {
      if (!catalogContainer) return;
      this.activeSpeciesFilter = category; // UI-08 FIX: track current filter
      catalogContainer.innerHTML = '';
      const activeList = stateStore.get('activeSpecies') || [];

      const filtered = category === 'all' 
        ? SPECIES_DATABASE 
        : SPECIES_DATABASE.filter(s => s.category === category);

      filtered.forEach(sp => {
        const isSelected = activeList.includes(sp.id);
        const card = document.createElement('div');
        card.className = `species-card ${isSelected ? 'selected' : ''}`;
        
        card.innerHTML = `
          <div class="species-header">
            <span class="species-icon">${sp.icon}</span>
            <div>
              <div class="species-name">${sp.name}</div>
              <div class="species-meta">
                <span>${sp.category.toUpperCase()}</span>
                <span>Optimal: ${sp.tempOptimal}°C</span>
              </div>
            </div>
          </div>
          <p style="font-size: 11px; color: var(--text-muted); line-height: 1.3;">${sp.notes}</p>
          <div class="synergy-tags">
            ${(sp.synergies || []).map(syn => `<span class="synergy-tag">✦ ${syn.replace('_', ' ')}</span>`).join('')}
          </div>
        `;

        card.addEventListener('click', () => {
          stateStore.toggleSpecies(sp.id);
          card.classList.toggle('selected');
          this.updateTelemetry();
        });

        catalogContainer.appendChild(card);
      });
    };

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderSpecies(btn.dataset.category);
      });
    });

    // UI-08 FIX: expose renderSpecies so process navigation can re-apply active filter on tab switch
    this._renderSpecies = renderSpecies;
    renderSpecies(this.activeSpeciesFilter);
  }

  // --- PROCESS 6: BLUEPRINTS & BOM EXPORT ---
  setupProcess6ExportControls() {
    const bpModeButtons = document.querySelectorAll('.blueprint-view-btn');
    bpModeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        bpModeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (this.blueprintRenderer) {
          this.blueprintRenderer.setViewMode(btn.dataset.mode);
        }
      });
    });

    const exportJsonBtn = document.getElementById('export-json-btn');
    const exportCsvBtn = document.getElementById('export-csv-btn');
    const printReportBtn = document.getElementById('print-report-btn');

    if (exportJsonBtn) exportJsonBtn.addEventListener('click', () => this.exportManager.exportProjectJson());
    if (exportCsvBtn) exportCsvBtn.addEventListener('click', () => this.exportManager.exportCSV());
    if (printReportBtn) printReportBtn.addEventListener('click', () => this.exportManager.printEngineeringReport());
  }

  renderBOMTable() {
    const container = document.getElementById('bom-table-body');
    const grandTotalEl = document.getElementById('bom-grand-total');
    const costPerSqmEl = document.getElementById('bom-cost-sqm');
    if (!container) return;

    const bom = this.exportManager.generateBOM();
    container.innerHTML = '';

    bom.items.forEach(it => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span style="color: var(--emerald-400); font-weight: 500;">${it.category}</span></td>
        <td><strong>${it.item}</strong><br><small style="color: var(--text-muted);">${it.notes}</small></td>
        <td style="font-family: var(--font-mono);">${it.quantity}</td>
        <td style="font-family: var(--font-mono);">$${it.unitPrice.toLocaleString()}</td>
        <td style="font-family: var(--font-mono); font-weight: 600; color: var(--emerald-400);">$${it.totalPrice.toLocaleString()}</td>
      `;
      container.appendChild(tr);
    });

    if (grandTotalEl) grandTotalEl.textContent = `$${bom.grandTotal.toLocaleString()}`;
    if (costPerSqmEl) costPerSqmEl.textContent = `$${bom.costPerSqm}/m²`;
  }

  // --- PRESET SELECTOR ---
  setupPresetSelector() {
    const presetCards = document.querySelectorAll('.preset-card');
    presetCards.forEach(card => {
      card.addEventListener('click', () => {
        presetCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const presetId = card.dataset.preset;
        // BUG-06 FIX: stop any running simulation before applying new preset
        this.stopSimulationLoop();
        stateStore.set('simPlaying', false);
        const playBtn = document.getElementById('sim-play-toggle');
        if (playBtn) playBtn.textContent = '▶';
        stateStore.loadPreset(presetId);
        this.syncFormControlsWithState();
      });
    });

    // UI-04 FIX: on page load, restore the active class to the saved preset card
    const savedPresetId = stateStore.get('presetId');
    if (savedPresetId) {
      presetCards.forEach(c => c.classList.remove('active'));
      const savedCard = document.querySelector(`.preset-card[data-preset="${savedPresetId}"]`);
      if (savedCard) savedCard.classList.add('active');
    }
  }

  syncFormControlsWithState() {
    const s = stateStore.getState();
    
    // Inputs sync
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val;
    };
    const setText = (id, txt) => {
      const el = document.getElementById(id);
      if (el) el.textContent = txt;
    };

    setVal('biome-select', s.biomeId);
    if (s.customLatitude !== undefined) {
      setVal('latitude-slider', s.customLatitude);
      setText('latitude-val', `${s.customLatitude}° N`);
    }
    if (s.orientationAzimuth !== undefined) {
      setVal('azimuth-slider', s.orientationAzimuth);
      // BUG-01 FIX: use shared utility, not local duplicate
      setText('azimuth-val', formatAzimuthLabel(s.orientationAzimuth));
    }
    setVal('structure-select', s.structureType);
    setVal('glazing-select', s.glazingType);
    if (s.glazingRatio !== undefined) {
      setVal('glazing-ratio-slider', Math.round(s.glazingRatio * 100));
      setText('glazing-ratio-val', `${Math.round(s.glazingRatio * 100)}%`);
    }
    // BUG-02 FIX: corrected key name from insulationRValue → northWallInsulationR
    if (s.northWallInsulationR !== undefined) {
      setVal('insulation-slider', s.northWallInsulationR);
      setText('insulation-val', `R-${s.northWallInsulationR}`);
    }
    setVal('diameter-slider', s.diameter);
    setText('diameter-val', `${s.diameter} m`);
    setVal('height-slider', s.height);
    setText('height-val', `${s.height} m`);
    setVal('thermal-mass-slider', s.thermalMassLiters);
    setText('thermal-mass-val', `${s.thermalMassLiters.toLocaleString()} L`);
    // BUG-03 FIX: corrected key name from gahtLengthMeters → gahtPipeLengthM
    if (s.gahtPipeLengthM !== undefined) {
      setVal('gaht-slider', s.gahtPipeLengthM);
      setText('gaht-val', `${s.gahtPipeLengthM} m`);
    }
    setVal('solar-pv-slider', s.solarPvKw);
    setText('solar-pv-val', `${s.solarPvKw} kW`);
    setVal('battery-slider', s.batteryKwh);
    setText('battery-val', `${s.batteryKwh} kWh`);

    if (s.simMonth !== undefined) setVal('sim-month-select', s.simMonth);
    if (s.simHour !== undefined) {
      setVal('sim-hour-slider', s.simHour);
      setText('sim-hour-val', `${s.simHour.toString().padStart(2, '0')}:00`);
    }
    if (s.weatherOverride !== undefined) setVal('weather-override-select', s.weatherOverride);

    this.renderBOMTable();
    this.updateTelemetry();
    // UI-09 FIX: only recalculate charts when Simulation tab (Process 4) is active
    if (stateStore.get('currentProcess') === 4) {
      this.updateSimulationCharts();
    }
  }

  // --- VIEWPORT OVERLAY CONTROLS ---
  setupViewportControls() {
    const btnRealistic = document.getElementById('view-mode-realistic');
    const btnThermal = document.getElementById('view-mode-thermal');
    const btnWireframe = document.getElementById('view-mode-wireframe');

    [btnRealistic, btnThermal, btnWireframe].forEach(btn => {
      if (!btn) return;
      btn.addEventListener('click', () => {
        [btnRealistic, btnThermal, btnWireframe].forEach(b => b && b.classList.remove('active'));
        btn.classList.add('active');
        stateStore.set('viewportMode', btn.dataset.mode);
      });
    });

    // 1x, 5x, 10x, 20x Camera Zoom Magnification Presets
    const zoomButtons = document.querySelectorAll('.zoom-preset-btn');
    zoomButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        zoomButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const zoom = btn.dataset.zoom || '1x';
        if (this.threeViewport) {
          this.threeViewport.setZoomLevel(zoom);
        }
      });
    });
  }

  // --- LIVE TELEMETRY UPDATES ---
  updateTelemetry() {
    const metrics = stateStore.getCalculatedMetrics();
    const nitro = this.simEngine.getNitrogenBalance();

    const setText = (id, txt) => {
      const el = document.getElementById(id);
      if (el) el.textContent = txt;
    };

    setText('telemetry-floor-area', `${metrics.floorArea} m²`);
    setText('telemetry-water-mass', `${(metrics.waterMassKg / 1000).toFixed(1)} tons`);
    setText('telemetry-food-yield', `${metrics.annualFoodYieldKg.toLocaleString()} kg/yr`);
    setText('telemetry-solar-gen', `${metrics.annualSolarKwh.toLocaleString()} kWh/yr`);
    setText('telemetry-nitro-status', nitro.status);
  }

  // --- CHART.JS SIMULATION GRAPHS ---
  initSimulationCharts() {
    if (typeof Chart === 'undefined') return;

    // 1. Diurnal Temperature Chart
    const ctxTemp = document.getElementById('chart-temperature');
    if (ctxTemp) {
      this.charts.temp = new Chart(ctxTemp, {
        type: 'line',
        data: { labels: [], datasets: [] },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { labels: { color: '#94a3b8' } } },
          scales: {
            x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.05)' } },
            y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.05)' } }
          }
        }
      });
    }

    // 2. CO2 & Relative Humidity Chart
    // BUG-05 FIX: declare BOTH y and y1 axes at init time — Chart.js v4 requires this
    const ctxCo2 = document.getElementById('chart-co2-humidity');
    if (ctxCo2) {
      this.charts.co2 = new Chart(ctxCo2, {
        type: 'line',
        data: { labels: [], datasets: [] },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { labels: { color: '#94a3b8' } } },
          scales: {
            x:  { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.05)' } },
            y:  { position: 'left',  ticks: { color: '#a855f7' }, grid: { color: 'rgba(255,255,255,0.05)' }, title: { display: true, text: 'CO₂ (ppm)', color: '#a855f7' } },
            y1: { position: 'right', ticks: { color: '#38bdf8' }, grid: { drawOnChartArea: false },           title: { display: true, text: 'Humidity (%)', color: '#38bdf8' } }
          }
        }
      });
    }

    // 3. Solar & Battery State of Charge
    const ctxPower = document.getElementById('chart-power-battery');
    if (ctxPower) {
      this.charts.power = new Chart(ctxPower, {
        type: 'line',
        data: { labels: [], datasets: [] },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { labels: { color: '#94a3b8' } } },
          scales: {
            x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.05)' } },
            y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.05)' } }
          }
        }
      });
    }

    // 4. Annual 12-Month Stability
    const ctxAnnual = document.getElementById('chart-annual-overview');
    if (ctxAnnual) {
      this.charts.annual = new Chart(ctxAnnual, {
        type: 'bar',
        data: { labels: [], datasets: [] },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { labels: { color: '#94a3b8' } } },
          scales: {
            x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.05)' } },
            y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.05)' } }
          }
        }
      });
    }

    this.updateSimulationCharts();
  }

  updateSimulationCharts() {
    if (!this.charts.temp) return;

    const s = stateStore.getState();
    const dayData = this.simEngine.simulateDay(s.simMonth, s.weatherOverride);
    const labels = dayData.map(d => d.hourLabel);

    // Temp Chart Update
    this.charts.temp.data = {
      labels,
      datasets: [
        {
          label: 'Shelter Interior Temp (°C)',
          data: dayData.map(d => d.shelterTemp),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.3
        },
        {
          label: 'Thermal Mass Water Temp (°C)',
          data: dayData.map(d => d.massTemp),
          borderColor: '#06b6d4',
          borderDash: [5, 5],
          tension: 0.3
        },
        {
          label: 'Outside Ambient Temp (°C)',
          data: dayData.map(d => d.ambientTemp),
          borderColor: '#64748b',
          tension: 0.3
        }
      ]
    };
    this.charts.temp.update();

    // CO2 & Humidity Update
    if (this.charts.co2) {
      this.charts.co2.data = {
        labels,
        datasets: [
          {
            label: 'CO2 Level (ppm)',
            data: dayData.map(d => d.co2Ppm),
            borderColor: '#a855f7',
            yAxisID: 'y',
            tension: 0.3
          },
          {
            label: 'Relative Humidity (%)',
            data: dayData.map(d => d.relativeHumidity),
            borderColor: '#38bdf8',
            yAxisID: 'y1',
            tension: 0.3
          }
        ]
      };
      this.charts.co2.options.scales = {
        y: { position: 'left', ticks: { color: '#a855f7' }, grid: { color: 'rgba(255,255,255,0.05)' } },
        y1: { position: 'right', ticks: { color: '#38bdf8' }, grid: { drawOnChartArea: false } }
      };
      this.charts.co2.update();
    }

    // Power & Battery Update
    if (this.charts.power) {
      this.charts.power.data = {
        labels,
        datasets: [
          {
            label: 'Solar PV Gen (kW)',
            data: dayData.map(d => d.solarGenKw),
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.2)',
            fill: true,
            tension: 0.3
          },
          {
            label: 'Battery SoC (%)',
            data: dayData.map(d => d.batterySocPercent),
            borderColor: '#10b981',
            borderDash: [4, 4],
            tension: 0.3
          }
        ]
      };
      this.charts.power.update();
    }

    // Annual Overview Update
    if (this.charts.annual) {
      const annualData = this.simEngine.simulateAnnualOverview();
      this.charts.annual.data = {
        labels: annualData.map(d => d.month),
        datasets: [
          {
            label: 'Shelter Avg Temp (°C)',
            data: annualData.map(d => d.avgShelterTemp),
            backgroundColor: 'rgba(16, 185, 129, 0.7)'
          },
          {
            label: 'Ambient Avg Temp (°C)',
            data: annualData.map(d => d.avgAmbientTemp),
            backgroundColor: 'rgba(100, 116, 139, 0.5)'
          }
        ]
      };
      this.charts.annual.update();
    }
  }
}

// Instantiate global app
window.bioshelterApp = new BioShelterApp();
