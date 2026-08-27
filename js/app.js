/**
 * BioShelter Studio - Main Application Controller (Full Dynamic Suite)
 * Integrates 3D Digital Twin, Numerical Energy Balance, Geotechnical Soil Physics,
 * Google/Microsoft/Phone OTP Auth, Dark/Light Mode Theme Engine, Community Data Hub,
 * and Disaster SOS Emergency Broadcast Net.
 */

/* global Chart */

import { CLIMATE_ZONES, generateDiurnalWeather } from './climateEngine.js';
import { MATERIALS, ASSEMBLY_PRESETS, calculateAssemblyPhysics } from './materialDatabase.js';
import { runThermalSimulation } from './thermalSolver.js';
import { Shelter3DVisualizer } from './threeVisualizer.js';
import { PsychrometricBioclimaticChart } from './psychrometricChart.js';
import { analyzeAndGenerateRecommendations } from './recommendationEngine.js';
import { generatePythonSimulationScript, openPrintableEngineeringReport, exportBIMGeoJSON } from './exporter.js';
import { SOIL_PROFILES, calculateSoilDepthProfile } from './soilEngine.js';
import { calculateAdvancedWeatherMetrics } from './weatherEngine.js';
import { authInstance } from './authEngine.js';
import { EMERGENCY_BUNKERS, getBunkersForZone } from './bunkerDatabase.js';
import { userDataStore } from './userDataStore.js';
import { sosEngine, DISASTER_SCENARIOS } from './sosEngine.js';
import { WorldMapEngine, GLOBAL_STATIONS } from './worldMapEngine.js';
import { analyzeAndRankComfortPlaces, PARADISE_DESTINATIONS } from './comfortMatcherEngine.js';

class BioShelterApp {
    constructor() {
        this.theme = localStorage.getItem('bioshelter_theme_mode') || 'dark';

        this.state = {
            zoneId: 'hot_arid',
            soilId: 'desert_sand',
            selectedSoilDepth: 3.0,
            customClimateParams: {},
            config: {
                typology: 'wind_tower',
                length: 6.0,
                width: 4.0,
                height: 3.0,
                roofPitch: 15,
                orientation: 0,
                wwr: 15,
                overhangDepth: 0.6,
                occupants: 3,
                ventMode: 'night_purge',
                foundationType: 'slab',
                wallAssembly: JSON.parse(JSON.stringify(ASSEMBLY_PRESETS.walls.rammed_earth_300)),
                roofAssembly: JSON.parse(JSON.stringify(ASSEMBLY_PRESETS.roofs.vaulted_earth_terracotta))
            },
            currentHour: 13,
            isPlaying: false,
            activeTab: 'tab-3d'
        };

        this.climateData = null;
        this.simulationData = null;
        this.optimizationResults = null;
        this.soilResults = null;

        // Visualizers & Charts
        this.visualizer3D = null;
        this.psychroChart = null;
        this.diurnalTempChart = null;
        this.heatFluxChart = null;
        this.pmvChart = null;
        this.comparisonChart = null;
        this.soilDepthChart = null;
        this.weatherSolarChart = null;

        this.animationTimer = null;
        this.otpCountdownTimer = null;
    }

    init() {
        this.initTheme();
        this.initDOMReferences();
        this.init3DVisualizer();
        this.initPsychrometricChart();
        this.initCharts();
        this.bindEvents();
        this.bindAuthEvents();
        this.bindUserDataEvents();
        this.bindSOSEvents();
        this.bindComfortMatcherEvents();
        this.initWorldMap();
        this.checkBackendHealth();
        this.updateSimulation();
        this.renderCommunityShelters();
        this.renderHazardReports();
        this.renderCustomMaterials();
        this.renderSOSDispatchLogs();
        this.renderComfortPlaces();
        this.switchTab('tab-3d');
    }

    async checkBackendHealth() {
        const chip = document.getElementById('backend-health-chip');
        const text = document.getElementById('backend-status-text');
        if (!chip || !text) return;

        const testConnection = async () => {
            const start = performance.now();
            try {
                const res = await fetch('/api/health');
                const latency = Math.round(performance.now() - start);
                if (res.ok) {
                    const data = await res.json();
                    text.textContent = `Backend Online (${latency}ms)`;
                    chip.style.background = 'rgba(16,185,129,0.12)';
                    chip.style.borderColor = 'rgba(16,185,129,0.3)';
                    chip.style.color = '#10b981';
                    return { success: true, latency, data };
                } else {
                    throw new Error(`HTTP ${res.status}`);
                }
            } catch (e) {
                text.textContent = 'Local Cache Active';
                chip.style.background = 'rgba(56,189,248,0.12)';
                chip.style.borderColor = 'rgba(56,189,248,0.3)';
                chip.style.color = '#38bdf8';
                return { success: false, error: e.message };
            }
        };

        // Initial check
        testConnection();

        chip.addEventListener('click', async () => {
            text.textContent = 'Testing API...';
            const result = await testConnection();
            if (result.success) {
                alert(`⚡ BioShelter REST Backend Status: ONLINE\n\nLatency: ${result.latency}ms\nService: ${result.data.service || 'REST API'}\nDatabase Stats:\n• Users: ${result.data.database ? result.data.database.usersCount : 'Connected'}\n• Shelters: ${result.data.database ? result.data.database.sheltersCount : 'Active'}\n\nFrontend & Backend are 100% synchronized.`);
            } else {
                alert(`⚡ Backend Status: Offline / Cache Mode\nFrontend is operating using client-side reactive localStorage data store.`);
            }
        });

        // Recurring health check every 60s
        setInterval(testConnection, 60000);
    }

    /* --- Theme Engine (Dark & Light Mode) --- */
    initTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        this.updateThemeIcons();
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('bioshelter_theme_mode', this.theme);
        document.documentElement.setAttribute('data-theme', this.theme);
        this.updateThemeIcons();

        const isDark = this.theme === 'dark';
        if (this.visualizer3D) {
            this.visualizer3D.setTheme(isDark);
        }
        if (this.psychroChart) {
            this.psychroChart.setTheme(isDark);
        }
        if (this.worldMapEngine) {
            this.worldMapEngine.setTheme(isDark);
        }
        this.updateChartThemes(isDark);
    }

    updateThemeIcons() {
        const sun = document.getElementById('theme-icon-sun');
        const moon = document.getElementById('theme-icon-moon');
        if (sun && moon) {
            if (this.theme === 'light') {
                sun.style.display = 'block';
                moon.style.display = 'none';
            } else {
                sun.style.display = 'none';
                moon.style.display = 'block';
            }
        }
    }

    updateChartThemes(isDark) {
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.08)';
        const textColor = isDark ? '#94a3b8' : '#475569';

        const charts = [
            this.diurnalTempChart,
            this.heatFluxChart,
            this.pmvChart,
            this.comparisonChart,
            this.soilDepthChart,
            this.weatherSolarChart
        ];

        charts.forEach(chart => {
            if (!chart) return;
            if (chart.options.scales) {
                if (chart.options.scales.x) {
                    chart.options.scales.x.grid.color = gridColor;
                    chart.options.scales.x.ticks.color = textColor;
                }
                if (chart.options.scales.y) {
                    chart.options.scales.y.grid.color = gridColor;
                    chart.options.scales.y.ticks.color = textColor;
                }
                if (chart.options.scales.y1) {
                    chart.options.scales.y1.ticks.color = isDark ? '#38bdf8' : '#0284c7';
                }
            }
            if (chart.options.plugins && chart.options.plugins.legend && chart.options.plugins.legend.labels) {
                chart.options.plugins.legend.labels.color = textColor;
            }
            chart.update();
        });
    }

    initDOMReferences() {
        this.dom = {
            zoneSelect: document.getElementById('select-climate-zone'),
            zoneDescription: document.getElementById('zone-description'),
            zoneRegion: document.getElementById('zone-region'),
            typologySelect: document.getElementById('select-typology'),
            ventModeSelect: document.getElementById('select-vent-mode'),
            foundationSelect: document.getElementById('select-foundation'),

            // Sliders & value labels
            sliderLength: document.getElementById('slider-length'),
            valLength: document.getElementById('val-length'),
            sliderWidth: document.getElementById('slider-width'),
            valWidth: document.getElementById('val-width'),
            sliderHeight: document.getElementById('slider-height'),
            valHeight: document.getElementById('val-height'),
            sliderPitch: document.getElementById('slider-pitch'),
            valPitch: document.getElementById('val-pitch'),
            sliderWwr: document.getElementById('slider-wwr'),
            valWwr: document.getElementById('val-wwr'),
            sliderOverhang: document.getElementById('slider-overhang'),
            valOverhang: document.getElementById('val-overhang'),
            sliderOccupants: document.getElementById('slider-occupants'),
            valOccupants: document.getElementById('val-occupants'),

            // Time scrubber
            timeSlider: document.getElementById('time-scrubber-slider'),
            timeClock: document.getElementById('time-scrubber-clock'),
            btnPlayPause: document.getElementById('btn-play-pause'),
            btnThemeToggle: document.getElementById('btn-theme-toggle'),

            // HUD Elements
            hudIndoorTemp: document.getElementById('hud-indoor-temp'),
            hudOperativeTemp: document.getElementById('hud-operative-temp'),
            hudAmbientTemp: document.getElementById('hud-ambient-temp'),
            hudPpd: document.getElementById('hud-ppd'),
            hudAch: document.getElementById('hud-ach'),
            hudPmvIndicator: document.getElementById('hud-pmv-indicator'),
            hudPmvValue: document.getElementById('hud-pmv-value'),
            hudAdaptiveStatus: document.getElementById('hud-adaptive-status'),
            hudComfortScore: document.getElementById('hud-comfort-score'),
            hudDampingRatio: document.getElementById('hud-damping-ratio'),

            // 3D Viewport Controls
            btnToggleHeatmap: document.getElementById('btn-toggle-heatmap'),
            btnToggleAirflow: document.getElementById('btn-toggle-airflow'),
            btnToggleCutaway: document.getElementById('btn-toggle-cutaway'),
            btnResetCamera: document.getElementById('btn-reset-camera'),

            // Tabs
            tabButtons: document.querySelectorAll('.tab-btn'),
            tabPanes: document.querySelectorAll('.tab-pane'),

            // Material Builder
            selectWallPreset: document.getElementById('select-wall-preset'),
            selectRoofPreset: document.getElementById('select-roof-preset'),
            wallLayersList: document.getElementById('wall-layers-list'),
            roofLayersList: document.getElementById('roof-layers-list'),
            wallUVal: document.getElementById('wall-u-val'),
            wallLagVal: document.getElementById('wall-lag-val'),
            roofUVal: document.getElementById('roof-u-val'),
            roofLagVal: document.getElementById('roof-lag-val'),

            // Soil View
            selectSoilType: document.getElementById('select-soil-type'),
            sliderSoilDepth: document.getElementById('slider-soil-depth'),
            valSoilDepth: document.getElementById('val-soil-depth'),
            soilKVal: document.getElementById('soil-k-val'),
            soilDiffusivityVal: document.getElementById('soil-diffusivity-val'),
            soilMoistureVal: document.getElementById('soil-moisture-val'),
            soilBearingVal: document.getElementById('soil-bearing-val'),
            soilSuitabilityText: document.getElementById('soil-suitability-text'),
            soilGeothermalBenefit: document.getElementById('soil-geothermal-benefit'),

            // Weather View
            weatherWetBulbVal: document.getElementById('weather-wetbulb-val'),
            weatherDewPointVal: document.getElementById('weather-dewpoint-val'),
            weatherVpdVal: document.getElementById('weather-vpd-val'),
            weatherUvVal: document.getElementById('weather-uv-val'),
            weatherPressureVal: document.getElementById('weather-pressure-val'),
            weatherWindEavesVal: document.getElementById('weather-wind-eaves-val'),

            // Bunkers View
            bunkersList: document.getElementById('bunkers-list-container'),
            bunkerCountBadge: document.getElementById('bunker-count-badge'),

            // Optimizer View
            optimizerList: document.getElementById('optimizer-recommendations-list'),
            btnApplyOptimizations: document.getElementById('btn-apply-optimizations'),
            comparisonTableBody: document.getElementById('comparison-table-body'),

            // Exporter
            btnOpenReport: document.getElementById('btn-open-report'),
            btnDownloadPython: document.getElementById('btn-download-python'),
            btnCopyPython: document.getElementById('btn-copy-python'),
            btnExportBim: document.getElementById('btn-export-bim'),
            pythonCodePreview: document.getElementById('python-code-preview'),

            // Auth UI
            authSection: document.getElementById('auth-header-section'),
            loginModal: document.getElementById('login-modal'),
            btnCloseLoginModal: document.getElementById('btn-close-login-modal'),
            btnOpenLoginModal: document.getElementById('btn-open-login-modal'),
            btnLoginGoogle: document.getElementById('btn-login-google'),
            btnLoginMicrosoft: document.getElementById('btn-login-microsoft'),
            btnSaveProject: document.getElementById('btn-save-project'),

            // Phone OTP Elements
            inputPhoneCountry: document.getElementById('phone-country-code'),
            inputPhoneNumber: document.getElementById('input-phone-number'),
            inputPhoneName: document.getElementById('input-phone-name'),
            btnSendOtp: document.getElementById('btn-send-otp'),
            phoneStep1: document.getElementById('phone-step-1'),
            phoneStep2: document.getElementById('phone-step-2'),
            displayOtpPhone: document.getElementById('display-otp-phone'),
            otpDigits: document.querySelectorAll('.otp-pin-digit'),
            btnVerifyOtp: document.getElementById('btn-verify-otp'),
            btnResendOtp: document.getElementById('btn-resend-otp'),
            otpTimerCount: document.getElementById('otp-timer-count'),
            smsToast: document.getElementById('sms-toast-simulator'),
            smsToastCode: document.getElementById('sms-toast-code'),
            smsToastContent: document.getElementById('sms-toast-content'),
            inputAccountToken: document.getElementById('input-account-token'),
            btnVerifyAccountToken: document.getElementById('btn-verify-account-token'),

            // SOS & Disaster Banner
            topSosBanner: document.getElementById('top-sos-banner'),
            sosBannerTitle: document.getElementById('sos-banner-title'),
            sosBannerDesc: document.getElementById('sos-banner-desc'),
            btnSosNearestShelter: document.getElementById('btn-sos-nearest-shelter'),
            btnSosMuteSiren: document.getElementById('btn-sos-mute-siren'),
            btnSosDismissBanner: document.getElementById('btn-sos-dismiss-banner'),
            btnHeaderPanicSos: document.getElementById('btn-header-panic-sos'),
            btnFloatingPanic: document.getElementById('btn-floating-panic'),
            btnPanicHubTrigger: document.getElementById('btn-panic-hub-trigger'),
            sosDispatchFeed: document.getElementById('sos-dispatch-feed'),

            // Community Registry
            communityList: document.getElementById('community-shelters-list'),
            inputSearchCommunity: document.getElementById('input-search-community'),
            btnOpenSubmitShelter: document.getElementById('btn-open-submit-shelter-modal'),
            submitShelterModal: document.getElementById('submit-shelter-modal'),
            btnCloseShelterModal: document.getElementById('btn-close-shelter-modal'),
            formSubmitShelter: document.getElementById('form-submit-shelter'),

            // Citizen Hazards
            hazardFeed: document.getElementById('hazard-reports-feed'),
            btnOpenReportHazard: document.getElementById('btn-open-report-hazard-modal'),
            reportHazardModal: document.getElementById('report-hazard-modal'),
            btnCloseHazardModal: document.getElementById('btn-close-hazard-modal'),
            formReportHazard: document.getElementById('form-report-hazard'),

            // Custom Material Lab
            formCustomMaterial: document.getElementById('form-custom-material'),
            customMaterialsList: document.getElementById('custom-materials-list')
        };
    }

    init3DVisualizer() {
        const container = document.getElementById('three-canvas-container');
        if (container && window.THREE) {
            this.visualizer3D = new Shelter3DVisualizer(container);
            this.visualizer3D.setTheme(this.theme === 'dark');
        }
    }

    initPsychrometricChart() {
        const canvas = document.getElementById('psychro-canvas');
        if (canvas) {
            this.psychroChart = new PsychrometricBioclimaticChart(canvas);
            this.psychroChart.setTheme(this.theme === 'dark');
        }
    }

    initCharts() {
        const isDark = this.theme === 'dark';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.08)';
        const textColor = isDark ? '#94a3b8' : '#475569';

        // 1. Diurnal Temperature Chart
        const ctxTemp = document.getElementById('diurnal-temp-chart');
        if (ctxTemp && window.Chart) {
            this.diurnalTempChart = new Chart(ctxTemp, {
                type: 'line',
                data: {
                    labels: Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`),
                    datasets: [
                        { label: 'Ambient Outdoor Temp (°C)', data: [], borderColor: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.08)', borderDash: [5, 4], borderWidth: 2, tension: 0.3, fill: false },
                        { label: 'Shelter Indoor Temp (°C)', data: [], borderColor: '#38bdf8', backgroundColor: 'rgba(56, 189, 248, 0.1)', borderWidth: 2.5, tension: 0.3, fill: false },
                        { label: 'Operative Comfort Temp (°C)', data: [], borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.15)', borderWidth: 3, tension: 0.3, fill: true },
                        { label: 'Adaptive Upper Limit (80%)', data: [], borderColor: 'rgba(244, 63, 94, 0.5)', borderDash: [3, 3], borderWidth: 1.5, pointRadius: 0, fill: false },
                        { label: 'Adaptive Lower Limit (80%)', data: [], borderColor: 'rgba(56, 189, 248, 0.5)', borderDash: [3, 3], borderWidth: 1.5, pointRadius: 0, fill: false }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: { mode: 'index', intersect: false },
                    plugins: { legend: { labels: { color: textColor, font: { family: 'Inter', size: 11 } } } },
                    scales: {
                        x: { grid: { color: gridColor }, ticks: { color: textColor } },
                        y: { grid: { color: gridColor }, ticks: { color: textColor }, title: { display: true, text: 'Temperature (°C)', color: '#38bdf8' } }
                    }
                }
            });
        }

        // 2. Heat Flux Breakdown Chart
        const ctxFlux = document.getElementById('heat-flux-chart');
        if (ctxFlux && window.Chart) {
            this.heatFluxChart = new Chart(ctxFlux, {
                type: 'bar',
                data: {
                    labels: Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`),
                    datasets: [
                        { label: 'Envelope Conduction (W)', data: [], backgroundColor: '#f97316' },
                        { label: 'Glazing Solar Gain (W)', data: [], backgroundColor: '#eab308' },
                        { label: 'Ventilation Flux (W)', data: [], backgroundColor: '#06b6d4' },
                        { label: 'Ground Exchange (W)', data: [], backgroundColor: '#8b5cf6' },
                        { label: 'Internal Gains (W)', data: [], backgroundColor: '#ec4899' }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { stacked: true, grid: { color: gridColor }, ticks: { color: textColor } },
                        y: { stacked: true, grid: { color: gridColor }, ticks: { color: textColor }, title: { display: true, text: 'Heat Flux (Watts)', color: '#38bdf8' } }
                    },
                    plugins: { legend: { labels: { color: textColor } } }
                }
            });
        }

        // 3. PMV & ACH Chart
        const ctxPmv = document.getElementById('pmv-ach-chart');
        if (ctxPmv && window.Chart) {
            this.pmvChart = new Chart(ctxPmv, {
                type: 'line',
                data: {
                    labels: Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`),
                    datasets: [
                        { label: 'Fanger PMV Index', data: [], borderColor: '#a855f7', borderWidth: 2.5, tension: 0.3, yAxisID: 'y' },
                        { label: 'Ventilation Rate (ACH)', data: [], borderColor: '#38bdf8', backgroundColor: 'rgba(56, 189, 248, 0.2)', borderWidth: 1.5, fill: true, tension: 0.2, yAxisID: 'y1' }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { grid: { color: gridColor }, ticks: { color: textColor } },
                        y: { min: -3, max: 3, grid: { color: gridColor }, ticks: { color: '#a855f7' }, title: { display: true, text: 'PMV Index', color: '#a855f7' } },
                        y1: { position: 'right', min: 0, max: 30, grid: { drawOnChartArea: false }, ticks: { color: '#38bdf8' }, title: { display: true, text: 'ACH', color: '#38bdf8' } }
                    },
                    plugins: { legend: { labels: { color: textColor } } }
                }
            });
        }

        // 4. Comparison Chart
        const ctxComp = document.getElementById('comparison-chart');
        if (ctxComp && window.Chart) {
            this.comparisonChart = new Chart(ctxComp, {
                type: 'line',
                data: {
                    labels: Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`),
                    datasets: [
                        { label: 'Baseline Shelter T_op (°C)', data: [], borderColor: '#f43f5e', borderWidth: 2, tension: 0.3, fill: false },
                        { label: 'Optimized Shelter T_op (°C)', data: [], borderColor: '#10b981', borderWidth: 3, tension: 0.3, backgroundColor: 'rgba(16, 185, 129, 0.1)', fill: true }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { labels: { color: textColor } } },
                    scales: {
                        x: { grid: { color: gridColor }, ticks: { color: textColor } },
                        y: { grid: { color: gridColor }, ticks: { color: textColor } }
                    }
                }
            });
        }

        // 5. Soil Subsurface Depth Attenuation Chart (Kusuda Formulation)
        const ctxSoil = document.getElementById('soil-depth-chart');
        if (ctxSoil && window.Chart) {
            this.soilDepthChart = new Chart(ctxSoil, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [
                        { label: 'Surface (z = 0m)', data: [], borderColor: '#ef4444', borderWidth: 2, tension: 0.3 },
                        { label: 'Depth z = 1.0m', data: [], borderColor: '#f59e0b', borderWidth: 2, tension: 0.3 },
                        { label: 'Depth z = 2.0m', data: [], borderColor: '#38bdf8', borderWidth: 2, tension: 0.3 },
                        { label: 'Depth z = 3.0m (Earth-Sheltered)', data: [], borderColor: '#10b981', borderWidth: 3, tension: 0.3 },
                        { label: 'Deep Geothermal z = 5.0m', data: [], borderColor: '#a855f7', borderWidth: 2, borderDash: [4, 4], tension: 0.3 }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { labels: { color: textColor, font: { size: 10 } } } },
                    scales: {
                        x: { grid: { color: gridColor }, ticks: { color: textColor } },
                        y: { grid: { color: gridColor }, ticks: { color: textColor }, title: { display: true, text: 'Subsurface Temp (°C)', color: '#10b981' } }
                    }
                }
            });
        }

        // 6. Weather Solar & Radiation Component Chart
        const ctxWeather = document.getElementById('weather-solar-chart');
        if (ctxWeather && window.Chart) {
            this.weatherSolarChart = new Chart(ctxWeather, {
                type: 'line',
                data: {
                    labels: Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`),
                    datasets: [
                        { label: 'Global Horizontal (GHI W/m²)', data: [], borderColor: '#eab308', backgroundColor: 'rgba(234, 179, 8, 0.15)', borderWidth: 2.5, fill: true, tension: 0.3 },
                        { label: 'Direct Normal (DNI W/m²)', data: [], borderColor: '#f97316', borderWidth: 2, tension: 0.3 },
                        { label: 'Diffuse Horizontal (DHI W/m²)', data: [], borderColor: '#38bdf8', borderWidth: 1.5, borderDash: [4, 3], tension: 0.3 }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { labels: { color: textColor } } },
                    scales: {
                        x: { grid: { color: gridColor }, ticks: { color: textColor } },
                        y: { grid: { color: gridColor }, ticks: { color: textColor }, title: { display: true, text: 'Solar Radiation (W/m²)', color: '#eab308' } }
                    }
                }
            });
        }

        // 7. Interactive World Climate & Temperature Map
        const mapCanvas = document.getElementById('world-map-canvas');
        if (mapCanvas) {
            this.worldMapEngine = new WorldMapEngine(mapCanvas, (station) => this.onSelectWorldStation(station));
            this.worldMapEngine.setTheme(this.theme === 'dark');
        }
    }

    bindEvents() {
        const d = this.dom;

        // Theme Toggle
        if (d.btnThemeToggle) {
            d.btnThemeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Climate zone switch
        d.zoneSelect.addEventListener('change', (e) => {
            this.state.zoneId = e.target.value;
            const zone = CLIMATE_ZONES[this.state.zoneId];
            if (zone) {
                this.state.config.typology = zone.recommendedTypology || 'gable';
                d.typologySelect.value = this.state.config.typology;
                this.state.config.ventMode = zone.recommendedVentMode || 'adaptive_diurnal';
                d.ventModeSelect.value = this.state.config.ventMode;
                if (ASSEMBLY_PRESETS.walls[zone.recommendedWalls]) {
                    this.state.config.wallAssembly = JSON.parse(JSON.stringify(ASSEMBLY_PRESETS.walls[zone.recommendedWalls]));
                }
                if (ASSEMBLY_PRESETS.roofs[zone.recommendedRoof]) {
                    this.state.config.roofAssembly = JSON.parse(JSON.stringify(ASSEMBLY_PRESETS.roofs[zone.recommendedRoof]));
                }

                // Match soil type to climate zone
                if (this.state.zoneId === 'hot_arid') this.state.soilId = 'desert_sand';
                else if (this.state.zoneId === 'warm_humid') this.state.soilId = 'laterite_red_soil';
                else if (this.state.zoneId === 'composite') this.state.soilId = 'black_cotton_clay';
                else if (this.state.zoneId === 'cold_mountainous') this.state.soilId = 'alpine_permafrost_scree';
                else this.state.soilId = 'alluvial_loam';
                
                if (d.selectSoilType) d.selectSoilType.value = this.state.soilId;
            }
            this.updateSimulation();
        });

        // Soil Controls
        if (d.selectSoilType) {
            d.selectSoilType.addEventListener('change', (e) => {
                this.state.soilId = e.target.value;
                this.updateSoilSection();
            });
        }

        if (d.sliderSoilDepth) {
            d.sliderSoilDepth.addEventListener('input', (e) => {
                this.state.selectedSoilDepth = parseFloat(e.target.value);
                if (d.valSoilDepth) d.valSoilDepth.textContent = e.target.value;
                this.updateSoilSection();
            });
        }

        // Typology & Parameters
        d.typologySelect.addEventListener('change', (e) => {
            this.state.config.typology = e.target.value;
            this.updateSimulation();
        });

        d.ventModeSelect.addEventListener('change', (e) => {
            this.state.config.ventMode = e.target.value;
            this.updateSimulation();
        });

        d.foundationSelect.addEventListener('change', (e) => {
            this.state.config.foundationType = e.target.value;
            this.updateSimulation();
        });

        // Sliders
        const bindSlider = (slider, valDisplay, key, isFloat = true) => {
            slider.addEventListener('input', (e) => {
                const val = isFloat ? parseFloat(e.target.value) : parseInt(e.target.value, 10);
                this.state.config[key] = val;
                valDisplay.textContent = e.target.value;
                this.updateSimulation();
            });
        };

        bindSlider(d.sliderLength, d.valLength, 'length', true);
        bindSlider(d.sliderWidth, d.valWidth, 'width', true);
        bindSlider(d.sliderHeight, d.valHeight, 'height', true);
        bindSlider(d.sliderPitch, d.valPitch, 'roofPitch', false);
        bindSlider(d.sliderWwr, d.valWwr, 'wwr', false);
        bindSlider(d.sliderOverhang, d.valOverhang, 'overhangDepth', true);
        bindSlider(d.sliderOccupants, d.valOccupants, 'occupants', false);

        // Time scrubber
        d.timeSlider.addEventListener('input', (e) => {
            this.state.currentHour = parseInt(e.target.value, 10);
            this.updateHUDAndTime();
        });

        d.btnPlayPause.addEventListener('click', () => {
            this.togglePlayAnimation();
        });

        // Tabs Switching
        d.tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                this.switchTab(targetTab);
            });
        });

        // 3D Viewport Controls
        d.btnToggleHeatmap.addEventListener('click', () => {
            const active = d.btnToggleHeatmap.classList.toggle('active');
            if (this.visualizer3D) this.visualizer3D.setHeatmapVisible(active);
        });

        d.btnToggleAirflow.addEventListener('click', () => {
            const active = d.btnToggleAirflow.classList.toggle('active');
            if (this.visualizer3D) this.visualizer3D.setAirflowVisible(active);
        });

        d.btnToggleCutaway.addEventListener('click', () => {
            const active = d.btnToggleCutaway.classList.toggle('active');
            if (this.visualizer3D) this.visualizer3D.setCutaway(active);
        });

        d.btnResetCamera.addEventListener('click', () => {
            if (this.visualizer3D && this.visualizer3D.camera) {
                this.visualizer3D.camera.position.set(10, 8, 12);
                if (this.visualizer3D.controls) this.visualizer3D.controls.target.set(0, 1.5, 0);
            }
        });

        // Material Presets
        d.selectWallPreset.addEventListener('change', (e) => {
            const presetKey = e.target.value;
            if (ASSEMBLY_PRESETS.walls[presetKey]) {
                this.state.config.wallAssembly = JSON.parse(JSON.stringify(ASSEMBLY_PRESETS.walls[presetKey]));
                this.renderMaterialLayers();
                this.updateSimulation();
            }
        });

        d.selectRoofPreset.addEventListener('change', (e) => {
            const presetKey = e.target.value;
            if (ASSEMBLY_PRESETS.roofs[presetKey]) {
                this.state.config.roofAssembly = JSON.parse(JSON.stringify(ASSEMBLY_PRESETS.roofs[presetKey]));
                this.renderMaterialLayers();
                this.updateSimulation();
            }
        });

        // Apply All Optimizations Button
        d.btnApplyOptimizations.addEventListener('click', () => {
            if (this.optimizationResults && this.optimizationResults.optimizedConfig) {
                this.state.config = JSON.parse(JSON.stringify(this.optimizationResults.optimizedConfig));
                this.syncFormWithConfig();
                this.updateSimulation();
                alert('Bioclimatic passive optimizations applied successfully!');
            }
        });

        // Exporter Events
        d.btnOpenReport.addEventListener('click', () => {
            openPrintableEngineeringReport(this.state.config, this.climateData, this.simulationData, this.optimizationResults.recommendations);
        });

        d.btnDownloadPython.addEventListener('click', () => {
            const pyCode = generatePythonSimulationScript(this.state.config, this.climateData, this.simulationData);
            const blob = new Blob([pyCode], { type: 'text/x-python' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `simulate_shelter_${this.state.zoneId}.py`;
            a.click();
            URL.revokeObjectURL(url);
        });

        d.btnCopyPython.addEventListener('click', () => {
            const pyCode = generatePythonSimulationScript(this.state.config, this.climateData, this.simulationData);
            navigator.clipboard.writeText(pyCode).then(() => {
                alert('Python simulation script copied to clipboard!');
            });
        });

        d.btnExportBim.addEventListener('click', () => {
            exportBIMGeoJSON(this.state.config, this.climateData, this.simulationData);
        });

        // World Map Apply Climate Button
        const btnApplyMap = document.getElementById('btn-apply-map-climate');
        if (btnApplyMap) {
            btnApplyMap.addEventListener('click', () => {
                const station = this.selectedWorldStation || { city: 'Jodhpur', country: 'India', zone: 'hot_arid', tempMax: 44, tempMin: 28, climate: 'Hot-Arid Desert' };
                this.onSelectWorldStation(station);
                this.switchTab('tab-3d');
                alert(`✅ Applied Climate of ${station.city}, ${station.country} to 3D Simulation Twin!`);
            });
        }

        // Direct Enter Studio button in login tab
        const btnEnterStudio = document.getElementById('btn-enter-studio-direct');
        if (btnEnterStudio) {
            btnEnterStudio.addEventListener('click', () => {
                this.switchTab('tab-3d');
            });
        }

        // Cloud Save Project Button
        const btnSaveProject = document.getElementById('btn-save-project');
        if (btnSaveProject) {
            btnSaveProject.addEventListener('click', () => {
                const user = authInstance.getCurrentUser();
                const saved = userDataStore.saveShelterProject({
                    zoneId: this.state.zoneId,
                    config: this.state.config,
                    summary: this.simulationData ? this.simulationData.summary : {},
                    savedBy: user ? user.displayName : 'Guest Engineer',
                    savedAt: new Date().toISOString()
                });
                alert(`💾 BioShelter 3D Model & Parameters Saved to Cloud Workspace!`);
            });
        }
    }

    onSelectWorldStation(station) {
        this.selectedWorldStation = station;
        const targetZone = station.zone || (station.tempC >= 38 ? 'hot_arid' : (station.tempC <= 14 ? 'cold_mountainous' : (station.humidity >= 70 ? 'warm_humid' : 'temperate')));
        if (CLIMATE_ZONES[targetZone]) {
            this.state.zoneId = targetZone;
            if (this.dom.zoneSelect) this.dom.zoneSelect.value = targetZone;
        }
        
        const tMax = station.tempMax || station.tempC || 44;
        const tMin = station.tempMin || Math.max(8, tMax - 14);

        this.state.customClimateParams = {
            tMax: tMax,
            tMin: tMin,
            rhDay: Math.max(12, station.humidity ? station.humidity - 15 : 25),
            rhNight: Math.min(95, station.humidity ? station.humidity + 15 : 60),
            windSpeedAvg: station.windSpeedMps || station.windSpeed || 3.8,
            solarPeak: station.solarGhi || 950
        };

        this.updateSimulation();
    }

    /* --- Auth & Phone OTP Verification Bindings --- */
    bindAuthEvents() {
        const d = this.dom;

        // Full-screen Auth Landing Gate handling
        const gate = document.getElementById('auth-landing-gate');
        const gateTabBtns = document.querySelectorAll('.gate-tab-btn');
        const gatePanes = document.querySelectorAll('.gate-pane');
        const gateSuccessOverlay = document.getElementById('gate-success-overlay');

        if (gate) {
            let activeChannel = 'phone';
            let activeTarget = '+91 98765 43210';
            let activeName = 'Alex Henderson';

            // Direct Home Page Access: Always keep studio unlocked and gate hidden on load!
            gate.classList.add('unlocked');
            gate.style.display = 'none';

            // Close Gate Modal Button
            const btnCloseGate = document.getElementById('btn-close-gate-modal');
            if (btnCloseGate) {
                btnCloseGate.addEventListener('click', () => {
                    gate.style.display = 'none';
                    gate.classList.add('unlocked');
                });
            }

            // Master Unified Gate Tabs (Sign In / Sign Up / 6-Digit OTP)
            const tabBtnSignIn = document.getElementById('btn-master-tab-signin');
            const tabBtnSignUp = document.getElementById('btn-master-tab-signup');
            const tabBtnOtp = document.getElementById('btn-master-tab-otp');
            const secSignIn = document.getElementById('gate-section-signin');
            const secSignUp = document.getElementById('gate-section-signup');
            const secOtp = document.getElementById('gate-section-otp');

            const activateMasterTab = (tab) => {
                [tabBtnSignIn, tabBtnSignUp, tabBtnOtp].forEach(b => { if (b) b.classList.remove('active'); });
                if (secSignIn) secSignIn.style.display = (tab === 'signin') ? 'flex' : 'none';
                if (secSignUp) secSignUp.style.display = (tab === 'signup') ? 'flex' : 'none';
                if (secOtp) secOtp.style.display = (tab === 'otp') ? 'flex' : 'none';
            };

            if (tabBtnSignIn) tabBtnSignIn.addEventListener('click', () => { tabBtnSignIn.classList.add('active'); activateMasterTab('signin'); });
            if (tabBtnSignUp) tabBtnSignUp.addEventListener('click', () => { tabBtnSignUp.classList.add('active'); activateMasterTab('signup'); });
            if (tabBtnOtp) tabBtnOtp.addEventListener('click', () => { tabBtnOtp.classList.add('active'); activateMasterTab('otp'); });

            // Demo Profiles 1-Click Fill & Login
            const btnDemoSarah = document.getElementById('btn-gate-demo-sarah');
            if (btnDemoSarah) {
                btnDemoSarah.addEventListener('click', async () => {
                    const user = await authInstance.loginWithCredentials('sarah.lin@gmail.com', 'bioshelter2026');
                    unlockStudioWithAnimation('Dr. Sarah Lin Verified!', `Welcome back! Connecting with 3D Simulation Twin.`);
                });
            }
            const btnDemoAlex = document.getElementById('btn-gate-demo-alex');
            if (btnDemoAlex) {
                btnDemoAlex.addEventListener('click', async () => {
                    const user = await authInstance.loginWithCredentials('alex.henderson@outlook.com', 'bioshelter2026');
                    unlockStudioWithAnimation('Alex Henderson Verified!', `Welcome back! Connecting with 3D Simulation Twin.`);
                });
            }

            // Member Sign In Form Submit
            const formGateSignIn = document.getElementById('form-gate-signin');
            if (formGateSignIn) {
                formGateSignIn.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const ident = (document.getElementById('gate-signin-ident') || {}).value || '';
                    const pwd = (document.getElementById('gate-signin-pwd') || {}).value || '';
                    const res = await authInstance.loginWithCredentials(ident, pwd);
                    if (res.success) {
                        unlockStudioWithAnimation('Member Login Verified!', `Welcome back, ${res.user.displayName}! Connecting with 3D Studio.`);
                    } else {
                        alert(res.message);
                    }
                });
            }

            // Member Sign Up Form Submit (Stores ID in Database)
            const formGateSignUp = document.getElementById('form-gate-signup');
            if (formGateSignUp) {
                formGateSignUp.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const name = (document.getElementById('gate-signup-name') || {}).value || 'Citizen Engineer';
                    const email = (document.getElementById('gate-signup-email') || {}).value || '';
                    const phone = (document.getElementById('gate-signup-phone') || {}).value || '';
                    const role = (document.getElementById('gate-signup-role') || {}).value || 'Certified Disaster Responder';
                    const pwd = (document.getElementById('gate-signup-pwd') || {}).value || '';
                    const res = await authInstance.signUp({ name, email, phone, role, password: pwd });
                    if (res.success) {
                        unlockStudioWithAnimation('Member Account Enrolled!', `Welcome, ${res.user.displayName}! Assigned ID: ${res.user.id}.`);
                    } else {
                        alert(res.message);
                    }
                });
            }

            // Multi-Channel OTP Selection Tabs (Phone, Gmail, Microsoft)
            const channelTabs = document.querySelectorAll('[data-otp-channel]');
            const channelForms = {
                phone: document.getElementById('channel-form-phone'),
                gmail: document.getElementById('channel-form-gmail'),
                microsoft: document.getElementById('channel-form-microsoft')
            };

            channelTabs.forEach(btn => {
                btn.addEventListener('click', () => {
                    channelTabs.forEach(b => {
                        b.classList.remove('active');
                        b.style.background = '';
                        b.style.borderColor = '';
                    });
                    btn.classList.add('active');
                    activeChannel = btn.getAttribute('data-otp-channel');

                    // Show corresponding form
                    Object.keys(channelForms).forEach(ch => {
                        if (channelForms[ch]) {
                            channelForms[ch].style.display = (ch === activeChannel) ? 'flex' : 'none';
                        }
                    });
                });
            });

            // Helper to unlock gate with success animation
            const unlockStudioWithAnimation = (title, msg) => {
                if (secSignIn) secSignIn.style.display = 'none';
                if (secSignUp) secSignUp.style.display = 'none';
                if (secOtp) secOtp.style.display = 'none';
                const tabsBar = document.querySelectorAll('.gate-nav-tabs');
                tabsBar.forEach(t => { t.style.display = 'none'; });

                if (gateSuccessOverlay) {
                    gateSuccessOverlay.classList.add('active');
                    if (title) document.getElementById('gate-success-title').textContent = title;
                    if (msg) document.getElementById('gate-success-msg').textContent = msg;
                }
                setTimeout(() => {
                    gate.classList.add('unlocked');
                    gate.style.display = 'none';
                    if (gateSuccessOverlay) gateSuccessOverlay.classList.remove('active');
                    this.switchTab('tab-3d');
                    if (this.visualizer3D) {
                        setTimeout(() => this.visualizer3D.onWindowResize(), 50);
                    }
                    this.updateSimulation();
                    this.renderLoginPage();
                }, 600);
            };

            const gateOtpStep1 = document.getElementById('gate-otp-step-1');
            const gateOtpStep2 = document.getElementById('gate-otp-step-2');
            const gateOtpDigits = document.querySelectorAll('.gate-otp-digit');
            const btnGateVerifyOtp = document.getElementById('btn-gate-verify-otp');
            const btnGateResendOtp = document.getElementById('btn-gate-resend-otp');
            const btnGateQuickAutofill = document.getElementById('btn-gate-quick-autofill');
            const btnGateChangeChannel = document.getElementById('btn-gate-change-channel');

            const triggerStep2Verification = (channel, target, name, res) => {
                activeChannel = channel;
                activeTarget = target;
                activeName = name;

                if (gateOtpStep1) gateOtpStep1.style.display = 'none';
                if (gateOtpStep2) gateOtpStep2.style.display = 'flex';

                const targetDisplay = document.getElementById('gate-display-otp-target');
                if (targetDisplay) targetDisplay.textContent = target;

                const liveCodeDisplay = document.getElementById('gate-live-otp-code');
                if (liveCodeDisplay) liveCodeDisplay.textContent = res.code;

                const badgeEl = document.getElementById('gate-otp-dispatch-channel-badge');
                if (badgeEl) {
                    if (channel === 'gmail') {
                        badgeEl.innerHTML = '📧 Gmail Inbox Dispatch';
                    } else if (channel === 'microsoft') {
                        badgeEl.innerHTML = '🏢 Microsoft Exchange Dispatch';
                    } else {
                        badgeEl.innerHTML = '📱 Cellular SMS Dispatch';
                    }
                }

                // Auto pre-fill all 6 digits immediately
                const digits = res.code.split('');
                gateOtpDigits.forEach((input, i) => { input.value = digits[i] || ''; });

                this.showSmsPushToast(res.code, target);
                this.startGateOtpCountdown();
            };

            // 1. Send Mobile Phone OTP
            const btnSendPhone = document.getElementById('btn-gate-send-phone-otp') || document.getElementById('btn-gate-send-otp');
            if (btnSendPhone) {
                btnSendPhone.addEventListener('click', () => {
                    const phoneInput = document.getElementById('gate-phone-number');
                    let phone = phoneInput ? phoneInput.value.trim() : '98765 43210';
                    if (!phone) phone = '98765 43210';
                    const country = (document.getElementById('gate-phone-country') || {}).value || '+91';
                    const name = (document.getElementById('gate-phone-name') || {}).value || 'Alex Henderson';

                    const res = authInstance.requestOtp('phone', phone, name, country);
                    if (res.success) {
                        triggerStep2Verification('phone', res.target, name, res);
                    }
                });
            }

            // 2. Send Gmail ID OTP
            const btnSendGmail = document.getElementById('btn-gate-send-gmail-otp');
            if (btnSendGmail) {
                btnSendGmail.addEventListener('click', () => {
                    const emailInput = document.getElementById('gate-gmail-address');
                    let email = emailInput ? emailInput.value.trim() : 'sarah.lin.resilience@gmail.com';
                    if (!email) email = 'sarah.lin.resilience@gmail.com';
                    const name = (document.getElementById('gate-gmail-name') || {}).value || 'Dr. Sarah Lin';

                    const res = authInstance.requestOtp('gmail', email, name);
                    if (res.success) {
                        triggerStep2Verification('gmail', res.target, name, res);
                    }
                });
            }

            // 3. Send Microsoft ID OTP
            const btnSendMs = document.getElementById('btn-gate-send-ms-otp');
            if (btnSendMs) {
                btnSendMs.addEventListener('click', () => {
                    const emailInput = document.getElementById('gate-ms-address');
                    let email = emailInput ? emailInput.value.trim() : 'alex.henderson@outlook.com';
                    if (!email) email = 'alex.henderson@outlook.com';
                    const name = (document.getElementById('gate-ms-name') || {}).value || 'Alex Henderson';

                    const res = authInstance.requestOtp('microsoft', email, name);
                    if (res.success) {
                        triggerStep2Verification('microsoft', res.target, name, res);
                    }
                });
            }

            // 4. Quick Auto-Fill & Instant Unlock
            if (btnGateQuickAutofill) {
                btnGateQuickAutofill.addEventListener('click', () => {
                    const liveCode = document.getElementById('gate-live-otp-code').textContent.trim() || '849201';
                    const digits = liveCode.split('');
                    gateOtpDigits.forEach((input, i) => { input.value = digits[i] || ''; });
                    const result = authInstance.verifyOtp(liveCode, activeChannel, activeTarget, activeName);
                    if (result.success) {
                        unlockStudioWithAnimation(`${result.user.providerName} Verified!`, `Welcome, ${result.user.displayName}! Connecting with 3D Simulation Twin.`);
                    }
                });
            }

            // 5. Change Channel Button (Return to Step 1)
            if (btnGateChangeChannel) {
                btnGateChangeChannel.addEventListener('click', () => {
                    if (gateOtpStep1) gateOtpStep1.style.display = 'flex';
                    if (gateOtpStep2) gateOtpStep2.style.display = 'none';
                });
            }

            // 6. Auto advance PIN digits in gate
            gateOtpDigits.forEach((digitInput, idx) => {
                digitInput.addEventListener('input', (e) => {
                    if (e.target.value.length === 1 && idx < gateOtpDigits.length - 1) {
                        gateOtpDigits[idx + 1].focus();
                    }
                });
                digitInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Backspace' && !e.target.value && idx > 0) {
                        gateOtpDigits[idx - 1].focus();
                    }
                });
            });

            // 7. Verify OTP Code Button
            if (btnGateVerifyOtp) {
                btnGateVerifyOtp.addEventListener('click', () => {
                    let codeStr = '';
                    gateOtpDigits.forEach(input => { codeStr += input.value.trim(); });
                    if (!codeStr || codeStr.length !== 6) {
                        codeStr = document.getElementById('gate-live-otp-code').textContent.trim() || '849201';
                    }

                    const result = authInstance.verifyOtp(codeStr, activeChannel, activeTarget, activeName);
                    if (result.success) {
                        unlockStudioWithAnimation(`${result.user.providerName} Verified!`, `Welcome, ${result.user.displayName}! Connecting with 3D Simulation Twin.`);
                    } else {
                        alert(result.message);
                    }
                });
            }

            // 8. Resend OTP Button
            if (btnGateResendOtp) {
                btnGateResendOtp.addEventListener('click', () => {
                    const res = authInstance.requestOtp(activeChannel, activeTarget, activeName);
                    if (res.success) {
                        const liveCodeDisplay = document.getElementById('gate-live-otp-code');
                        if (liveCodeDisplay) liveCodeDisplay.textContent = res.code;
                        const digits = res.code.split('');
                        gateOtpDigits.forEach((input, i) => { input.value = digits[i] || ''; });
                        this.showSmsPushToast(res.code, activeTarget);
                        this.startGateOtpCountdown();
                    }
                });
            }

            // Google SSO modal triggers
            const googleModal = document.getElementById('google-auth-modal');
            const btnCloseGoogleModal = document.getElementById('btn-close-google-modal');
            const openGoogleModal = () => {
                if (googleModal) googleModal.classList.add('active');
            };

            if (btnCloseGoogleModal) {
                btnCloseGoogleModal.addEventListener('click', () => {
                    if (googleModal) googleModal.classList.remove('active');
                });
            }

            // Gate Google SSO Buttons
            const btnGateGoogle = document.getElementById('btn-gate-sso-google') || document.getElementById('btn-gate-login-google');
            if (btnGateGoogle) {
                btnGateGoogle.addEventListener('click', () => {
                    openGoogleModal();
                });
            }

            // Handle Click on Pre-configured Google Account Items
            document.querySelectorAll('.google-account-item').forEach(item => {
                item.addEventListener('click', async () => {
                    const email = item.getAttribute('data-google-email');
                    const name = item.getAttribute('data-google-name');
                    const role = item.getAttribute('data-google-role');
                    const user = await authInstance.loginWithGoogle(email, name, role);
                    if (googleModal) googleModal.classList.remove('active');
                    unlockStudioWithAnimation('Google Account Verified!', `Welcome, ${user.displayName}! Connecting with 3D Simulation Twin.`);
                });
            });

            // Handle Custom Google Form Login
            const formCustomGoogle = document.getElementById('form-custom-google-login');
            if (formCustomGoogle) {
                formCustomGoogle.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const email = document.getElementById('custom-google-email').value.trim();
                    const name = document.getElementById('custom-google-name').value.trim() || email.split('@')[0];
                    const user = await authInstance.loginWithGoogle(email, name, 'Verified Climatological Engineer');
                    if (googleModal) googleModal.classList.remove('active');
                    formCustomGoogle.reset();
                    unlockStudioWithAnimation('Google Account Verified!', `Welcome, ${user.displayName}! Connecting with 3D Simulation Twin.`);
                });
            }

            // Microsoft SSO Modal Triggers
            const msModal = document.getElementById('microsoft-auth-modal');
            const btnCloseMsModal = document.getElementById('btn-close-ms-modal');
            const openMsModal = () => {
                if (msModal) msModal.classList.add('active');
            };

            if (btnCloseMsModal) {
                btnCloseMsModal.addEventListener('click', () => {
                    if (msModal) msModal.classList.remove('active');
                });
            }

            // Gate Microsoft SSO Button
            const btnGateMs = document.getElementById('btn-gate-sso-microsoft') || document.getElementById('btn-gate-login-microsoft');
            if (btnGateMs) {
                btnGateMs.addEventListener('click', () => {
                    openMsModal();
                });
            }

            // Handle Click on Pre-configured Microsoft Account Items
            document.querySelectorAll('.ms-account-item').forEach(item => {
                item.addEventListener('click', async () => {
                    const email = item.getAttribute('data-ms-email');
                    const name = item.getAttribute('data-ms-name');
                    const role = item.getAttribute('data-ms-role');
                    const user = await authInstance.loginWithMicrosoft(email, name, role);
                    if (msModal) msModal.classList.remove('active');
                    unlockStudioWithAnimation('Microsoft Account Verified!', `Welcome, ${user.displayName}! Connecting with 3D Simulation Twin.`);
                });
            });

            // Handle Custom Microsoft Form Login
            const formCustomMs = document.getElementById('form-custom-ms-login');
            if (formCustomMs) {
                formCustomMs.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const email = document.getElementById('custom-ms-email').value.trim();
                    const name = document.getElementById('custom-ms-name').value.trim() || email.split('@')[0];
                    const user = await authInstance.loginWithMicrosoft(email, name, 'Senior Structural & Plinth Specialist');
                    if (msModal) msModal.classList.remove('active');
                    formCustomMs.reset();
                    unlockStudioWithAnimation('Microsoft Account Verified!', `Welcome, ${user.displayName}! Connecting with 3D Simulation Twin.`);
                });
            }

            // Gate License Token Verify
            const btnGateToken = document.getElementById('btn-gate-verify-token');
            if (btnGateToken) {
                btnGateToken.addEventListener('click', () => {
                    const token = document.getElementById('gate-input-token').value.trim();
                    const res = authInstance.verifyAccountCode(token);
                    if (res.success) {
                        unlockStudioWithAnimation('Engineering License Certified!', res.message);
                    } else {
                        alert(res.message);
                    }
                });
            }

            // Guest Explorer Access
            const btnGuest = document.getElementById('btn-gate-guest-access');
            if (btnGuest) {
                btnGuest.addEventListener('click', () => {
                    const user = authInstance.loginAsGuest();
                    unlockStudioWithAnimation('Guest Explorer Activated!', `Welcome, ${user.displayName}! Accessing full 3D simulation suite.`);
                });
            }

            const btnGuestModal = document.getElementById('btn-guest-login-modal');
            if (btnGuestModal) {
                btnGuestModal.addEventListener('click', () => {
                    authInstance.loginAsGuest();
                    d.loginModal.classList.remove('active');
                    if (gate) gate.classList.add('unlocked');
                    this.switchTab('tab-3d');
                });
            }
        }

        // Header Sign In / Switch Account button opens the single unified master gate
        if (d.btnOpenLoginModal) {
            d.btnOpenLoginModal.addEventListener('click', () => {
                if (gate) {
                    gate.style.display = 'flex';
                    gate.classList.remove('unlocked');
                    const tabsBar = document.querySelectorAll('.gate-nav-tabs');
                    tabsBar.forEach(t => { t.style.display = 'flex'; });
                    const secSignIn = document.getElementById('gate-section-signin');
                    if (secSignIn) secSignIn.style.display = 'flex';
                    const successOverlay = document.getElementById('gate-success-overlay');
                    if (successOverlay) successOverlay.classList.remove('active');
                } else if (d.loginModal) {
                    d.loginModal.classList.add('active');
                }
            });
        }
        if (d.btnCloseLoginModal) {
            d.btnCloseLoginModal.addEventListener('click', () => {
                if (d.loginModal) d.loginModal.classList.remove('active');
            });
        }

        // Auth Tabs (Phone, SSO, Verify)
        const authTabBtns = document.querySelectorAll('.auth-tab-btn');
        authTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                authTabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const targetPane = btn.getAttribute('data-auth-pane');
                document.querySelectorAll('.auth-pane').forEach(p => {
                    p.classList.toggle('active', p.id === targetPane);
                });
            });
        });

        // 1. Phone OTP - Step 1: Send SMS
        if (d.btnSendOtp) {
            d.btnSendOtp.addEventListener('click', () => {
                let phone = d.inputPhoneNumber.value.trim();
                if (!phone) {
                    phone = '98765 43210';
                    d.inputPhoneNumber.value = phone;
                }
                const code = d.inputPhoneCountry.value;
                const name = d.inputPhoneName.value.trim() || 'Citizen Engineer';

                const res = authInstance.requestPhoneOtp(phone, code);
                if (res.success) {
                    d.phoneStep1.style.display = 'none';
                    d.phoneStep2.style.display = 'block';
                    d.displayOtpPhone.textContent = res.phone;

                    // Auto pre-fill all 6 digits immediately
                    const digits = res.code.split('');
                    d.otpDigits.forEach((input, i) => { input.value = digits[i] || ''; });

                    // Show Simulated SMS Push Toast on screen
                    this.showSmsPushToast(res.code, res.phone);
                    this.startOtpCountdown();

                    setTimeout(() => {
                        alert(`📱 BIO-SHELTER SMS DISPATCH SUCCESS!\n\nYour 6-Digit Verification Code is: ${res.code}\n\n(We have automatically pre-filled the 6 boxes for you!)\nClick 'Verify Code' to proceed.`);
                    }, 50);
                }
            });
        }

        // Auto-advance OTP PIN digits
        if (d.otpDigits) {
            d.otpDigits.forEach((digitInput, idx) => {
                digitInput.addEventListener('input', (e) => {
                    if (e.target.value.length === 1 && idx < d.otpDigits.length - 1) {
                        d.otpDigits[idx + 1].focus();
                    }
                });
                digitInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Backspace' && !e.target.value && idx > 0) {
                        d.otpDigits[idx - 1].focus();
                    }
                });
            });
        }

        // 2. Phone OTP - Step 2: Verify Code
        if (d.btnVerifyOtp) {
            d.btnVerifyOtp.addEventListener('click', () => {
                let codeStr = '';
                d.otpDigits.forEach(input => { codeStr += input.value.trim(); });
                const name = d.inputPhoneName.value.trim() || 'Citizen Engineer';

                if (codeStr.length !== 6) {
                    alert('Please enter the complete 6-digit code.');
                    return;
                }

                const result = authInstance.verifyPhoneOtp(codeStr, name);
                if (result.success) {
                    d.loginModal.classList.remove('active');
                    alert(`Welcome, ${result.user.displayName}! Phone ${result.user.phone} verified and registered for Disaster SOS broadcasts.`);
                } else {
                    alert(result.message);
                }
            });
        }

        // Resend OTP
        if (d.btnResendOtp) {
            d.btnResendOtp.addEventListener('click', () => {
                const phone = d.inputPhoneNumber.value.trim();
                const code = d.inputPhoneCountry.value;
                const res = authInstance.requestPhoneOtp(phone, code);
                if (res.success) {
                    this.showSmsPushToast(res.code, res.phone);
                    this.startOtpCountdown();
                }
            });
        }

        // 3. Google Sign-In
        if (d.btnLoginGoogle) {
            d.btnLoginGoogle.addEventListener('click', () => {
                d.loginModal.classList.remove('active');
                const googleModal = document.getElementById('google-auth-modal');
                if (googleModal) googleModal.classList.add('active');
            });
        }

        // 4. Microsoft Sign-In
        if (d.btnLoginMicrosoft) {
            d.btnLoginMicrosoft.addEventListener('click', async () => {
                d.btnLoginMicrosoft.disabled = true;
                const user = await authInstance.loginWithMicrosoft();
                d.loginModal.classList.remove('active');
                d.btnLoginMicrosoft.disabled = false;
                alert(`Welcome back, ${user.displayName}! Signed in via Microsoft.`);
            });
        }

        // 5. Account Certification Token Verification
        if (d.btnVerifyAccountToken) {
            d.btnVerifyAccountToken.addEventListener('click', () => {
                const token = d.inputAccountToken.value.trim();
                const res = authInstance.verifyAccountCode(token);
                if (res.success) {
                    alert(res.message);
                    d.loginModal.classList.remove('active');
                } else {
                    alert(res.message);
                }
            });
        }

        // Save Project Button
        if (d.btnSaveProject) {
            d.btnSaveProject.addEventListener('click', () => {
                if (!authInstance.isAuthenticated()) {
                    d.loginModal.classList.add('active');
                    return;
                }
                const saved = authInstance.saveProject({
                    zoneId: this.state.zoneId,
                    config: this.state.config,
                    summary: this.simulationData.summary
                });
                if (saved) {
                    alert('Shelter model saved to your verified cloud workspace!');
                }
            });
        }

        // Listen for Auth State Changes
        authInstance.onAuthStateChanged((user) => {
            this.renderAuthHeader(user);
            const gate = document.getElementById('auth-landing-gate');
            if (gate) {
                if (user) {
                    gate.classList.add('unlocked');
                } else {
                    gate.classList.remove('unlocked');
                    const successOverlay = document.getElementById('gate-success-overlay');
                    if (successOverlay) successOverlay.classList.remove('active');
                    const tabsBar = document.querySelector('.gate-nav-tabs');
                    if (tabsBar) tabsBar.style.display = 'flex';
                    const panes = document.querySelectorAll('.gate-pane');
                    panes.forEach(p => p.style.display = '');
                }
            }
        });
    }

    startOtpCountdown() {
        if (this.otpCountdownTimer) clearInterval(this.otpCountdownTimer);
        let seconds = 60;
        const d = this.dom;
        if (d.btnResendOtp) d.btnResendOtp.disabled = true;

        this.otpCountdownTimer = setInterval(() => {
            seconds--;
            if (d.otpTimerCount) d.otpTimerCount.textContent = seconds;
            if (seconds <= 0) {
                clearInterval(this.otpCountdownTimer);
                if (d.btnResendOtp) d.btnResendOtp.disabled = false;
            }
        }, 1000);
    }

    startGateOtpCountdown() {
        if (this.gateOtpCountdownTimer) clearInterval(this.gateOtpCountdownTimer);
        let seconds = 60;
        const btnResend = document.getElementById('btn-gate-resend-otp');
        const timerCount = document.getElementById('gate-otp-timer-count');
        if (btnResend) btnResend.disabled = true;

        this.gateOtpCountdownTimer = setInterval(() => {
            seconds--;
            if (timerCount) timerCount.textContent = seconds;
            if (seconds <= 0) {
                clearInterval(this.gateOtpCountdownTimer);
                if (btnResend) btnResend.disabled = false;
            }
        }, 1000);
    }

    showSmsPushToast(code, phone) {
        const d = this.dom;
        if (!d.smsToast) return;

        d.smsToastContent.innerHTML = `Incoming SMS to <strong>${phone}</strong>: Your BioShelter 6-digit verification code is <span id="sms-toast-code-click" class="sms-toast-code-badge">${code}</span>. Click code to auto-paste.`;
        d.smsToast.classList.add('active');

        // Auto paste when code badge is clicked
        const codeBadge = document.getElementById('sms-toast-code-click');
        if (codeBadge) {
            codeBadge.addEventListener('click', () => {
                const digits = code.split('');
                d.otpDigits.forEach((input, i) => {
                    input.value = digits[i] || '';
                });
                document.querySelectorAll('.gate-otp-digit').forEach((input, i) => {
                    input.value = digits[i] || '';
                });
                document.querySelectorAll('.page-otp-digit').forEach((input, i) => {
                    input.value = digits[i] || '';
                });
            });
        }

        setTimeout(() => {
            d.smsToast.classList.remove('active');
        }, 8000);
    }

    renderAuthHeader(user) {
        const d = this.dom;
        if (!d.authSection) return;

        if (user) {
            const isGuest = user.provider === 'guest';
            const isVerified = user.verifiedPhone || user.verifiedAccount;
            d.authSection.innerHTML = `
                <div class="user-profile-badge" title="Logged in as ${user.displayName} (${user.phone || user.email})">
                    <img src="${user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'}" alt="Avatar" class="user-avatar-img">
                    <div class="user-info-text">
                        <span class="user-name">${user.displayName.split(' ')[0]} ${isVerified ? '✓' : ''}</span>
                        <span class="user-badge-role" style="${isGuest ? 'background: rgba(245,158,11,0.2); color: #f59e0b;' : ''}">${isGuest ? 'Guest Explorer' : user.providerName.split(' ')[0]}</span>
                    </div>
                    ${isGuest ? `<button id="btn-header-verify-upgrade" class="btn-resend-otp" style="font-size: 10px; padding: 2px 6px; margin: 0 4px; color: var(--accent-emerald); border-color: rgba(16,185,129,0.4);" title="Verify Phone / Google Account">Verify</button>` : ''}
                    <button id="btn-logout-user" class="btn-logout-tiny" title="Sign Out">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>
                    </button>
                </div>
            `;
            const btnUpgrade = document.getElementById('btn-header-verify-upgrade');
            if (btnUpgrade) {
                btnUpgrade.addEventListener('click', () => {
                    const gate = document.getElementById('auth-landing-gate');
                    if (gate) {
                        gate.classList.remove('unlocked');
                        const p1 = document.getElementById('gate-phone-step-1');
                        const p2 = document.getElementById('gate-phone-step-2');
                        if (p1) p1.style.display = 'flex';
                        if (p2) p2.style.display = 'none';
                    }
                });
            }
            const btnLogout = document.getElementById('btn-logout-user');
            if (btnLogout) {
                btnLogout.addEventListener('click', () => {
                    authInstance.logout();
                });
            }
        } else {
            d.authSection.innerHTML = `
                <button id="btn-open-login-modal" class="btn-sign-in-nav" style="padding: 6px 14px; font-size: 12px; font-weight: 700; cursor: pointer;">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
                    <span>Member Sign In / Sign Up</span>
                </button>
            `;
            const btnOpen = document.getElementById('btn-open-login-modal');
            if (btnOpen) {
                btnOpen.addEventListener('click', () => {
                    const gate = document.getElementById('auth-landing-gate');
                    if (gate) {
                        gate.classList.remove('unlocked');
                        const tabsBar = document.querySelectorAll('.gate-nav-tabs');
                        tabsBar.forEach(t => { t.style.display = 'flex'; });
                        const secSignIn = document.getElementById('gate-section-signin');
                        if (secSignIn) secSignIn.style.display = 'flex';
                        const successOverlay = document.getElementById('gate-success-overlay');
                        if (successOverlay) successOverlay.classList.remove('active');
                    }
                });
            }
        }
    }

    renderLoginPage() {
        const container = document.getElementById('login-page-dynamic-container');
        if (!container) return;

        const user = authInstance.getCurrentUser();

        if (!user) {
            container.innerHTML = `
                <div class="page-header-bar" style="margin-bottom: 20px; background: rgba(56, 189, 248, 0.05); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: var(--radius-lg); padding: 20px;">
                    <div class="page-header-info">
                        <h2 style="font-size: 20px;">BioShelter Identity, Verification &amp; Security Portal</h2>
                        <p style="font-size: 13px; margin-top: 4px;">Sign in with Google, Microsoft, or your Mobile Phone OTP to save certified models and receive disaster SOS alerts, or explore the studio directly.</p>
                    </div>
                    <div class="page-header-actions">
                        <button id="btn-enter-studio-direct" class="export-btn-primary" style="font-size: 13px; padding: 10px 20px; background: linear-gradient(135deg, #0284c7, #10b981);">
                            🚀 Enter 3D Simulation Studio &rarr;
                        </button>
                    </div>
                </div>

                <div class="login-page-grid">
                    <!-- 1. Mobile Phone OTP Verification Card -->
                    <div class="login-portal-card">
                        <div class="chart-title">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="color: var(--accent-emerald);"><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/></svg>
                            Mobile Phone 6-Digit SMS Login
                        </div>
                        <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.5;">
                            Enter your mobile phone number to receive an instant SMS verification token and subscribe your phone to live disaster evacuation broadcasts.
                        </p>

                        <div id="page-phone-step-1">
                            <div class="phone-input-row">
                                <select id="phone-page-country" class="phone-country-code">
                                    <option value="+1">🇺🇸 +1 (US/CA)</option>
                                    <option value="+91" selected>🇮🇳 +91 (IN)</option>
                                    <option value="+44">🇬🇧 +44 (UK)</option>
                                    <option value="+971">🇦🇪 +971 (UAE)</option>
                                    <option value="+49">🇩🇪 +49 (DE)</option>
                                    <option value="+81">🇯🇵 +81 (JP)</option>
                                    <option value="+61">🇦🇺 +61 (AU)</option>
                                </select>
                                <input type="tel" id="phone-page-number" class="phone-number-input" placeholder="98765 43210">
                            </div>
                            <div class="control-group" style="margin-top: 10px;">
                                <label class="control-label">Your Full Name</label>
                                <input type="text" id="phone-page-name" class="input-select" placeholder="e.g. Alex Henderson">
                            </div>
                            <button id="btn-page-send-otp" class="export-btn-primary" style="margin-top: 12px; width: 100%;">
                                Send 6-Digit SMS Code
                            </button>
                        </div>

                        <div id="page-phone-step-2" style="display: none; flex-direction: column; gap: 14px;">
                            <!-- Dynamic Live OTP Incoming Display Card -->
                            <div class="dynamic-otp-live-card">
                                <div class="dynamic-otp-header">
                                    <span style="display: flex; align-items: center; gap: 6px;">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                                        📱 Cellular SMS Dispatch
                                    </span>
                                    <span class="dynamic-otp-badge-live">LIVE OTP CODE</span>
                                </div>
                                <div class="dynamic-otp-code-row">
                                    <div>
                                        <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase;">Your 6-Digit Code:</div>
                                        <div id="page-live-otp-code" class="dynamic-otp-number">------</div>
                                    </div>
                                    <button id="btn-page-quick-autofill" class="btn-quick-autofill" title="Auto-Fill &amp; Verify Instantly">
                                        ⚡ Auto-Fill &amp; Activate
                                    </button>
                                </div>
                                <div class="dynamic-otp-timer-bar">
                                    <div id="page-otp-timer-bar-fill" class="dynamic-otp-timer-fill"></div>
                                </div>
                            </div>

                            <p style="font-size: 12px; color: var(--text-secondary); margin-top: -4px;">
                                Or enter the 6-digit code sent to <strong id="page-display-otp-phone" style="color: var(--accent-sky);">+91 9876543210</strong>:
                            </p>
                            <div class="otp-pin-container">
                                <input type="text" maxlength="1" class="otp-pin-digit page-otp-digit" data-idx="0">
                                <input type="text" maxlength="1" class="otp-pin-digit page-otp-digit" data-idx="1">
                                <input type="text" maxlength="1" class="otp-pin-digit page-otp-digit" data-idx="2">
                                <input type="text" maxlength="1" class="otp-pin-digit page-otp-digit" data-idx="3">
                                <input type="text" maxlength="1" class="otp-pin-digit page-otp-digit" data-idx="4">
                                <input type="text" maxlength="1" class="otp-pin-digit page-otp-digit" data-idx="5">
                            </div>
                            <div class="otp-resend-bar">
                                <span>Didn't receive SMS?</span>
                                <button id="btn-page-resend-otp" class="btn-resend-otp">Resend in <span id="page-otp-timer-count">60</span>s</button>
                            </div>
                            <button id="btn-page-verify-otp" class="export-btn-primary" style="margin-top: 6px; width: 100%; background: linear-gradient(135deg, #0284c7, #10b981);">
                                Verify &amp; Activate Account
                            </button>
                        </div>
                    </div>

                    <!-- 2. Single Sign-On (Google & Microsoft) Card -->
                    <div class="login-portal-card">
                        <div class="chart-title">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="color: var(--accent-sky);"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
                            OAuth 2.0 Single Sign-On
                        </div>
                        <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.5;">
                            Fast 1-click sign in with your enterprise or academic Google Workspace / Microsoft Azure Active Directory credentials.
                        </p>

                        <button id="btn-page-login-google" class="btn-sso-google">
                            <svg width="18" height="18" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                            </svg>
                            Sign in with Google Account
                        </button>

                        <button id="btn-page-login-microsoft" class="btn-sso-microsoft">
                            <svg width="18" height="18" viewBox="0 0 21 21">
                                <path fill="#f25022" d="M1 1h9v9H1z"/>
                                <path fill="#00a4ef" d="M1 11h9v9H1z"/>
                                <path fill="#7fba00" d="M11 1h9v9h-9z"/>
                                <path fill="#ffb900" d="M11 11h9v9h-9z"/>
                            </svg>
                            Sign in with Microsoft Account
                        </button>
                    </div>

                    <!-- 3. Account Certification Token Verification Card -->
                    <div class="login-portal-card">
                        <div class="chart-title">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="color: var(--accent-amber);"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                            License &amp; Account Verification
                        </div>
                        <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.5;">
                            Have an institutional verification token or engineering license PIN? Enter your 6-digit credential below:
                        </p>

                        <div class="control-group">
                            <label class="control-label">6-Digit License / Certification PIN</label>
                            <input type="text" id="input-page-account-token" class="input-select" placeholder="e.g. 849201" maxlength="6">
                        </div>

                        <button id="btn-page-verify-account-token" class="export-btn-primary" style="margin-top: 6px; width: 100%;">
                            Validate Certification Token
                        </button>
                    </div>

                    <!-- 4. Guest Mode Quick Access Card -->
                    <div class="login-portal-card">
                        <div class="chart-title">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="color: var(--accent-sky);"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
                            Guest Engineer Quick Mode
                        </div>
                        <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.5;">
                            Explore all 3D digital twins, psychrometric bioclimatic charts, planetary weather radar, and thermal simulations instantly without credentials.
                        </p>

                        <button id="btn-page-login-guest" class="export-btn-primary" style="margin-top: 14px; width: 100%; justify-content: center; background: linear-gradient(135deg, #475569, #0284c7);">
                            ⚡ Enter as Guest Engineer &rarr;
                        </button>
                    </div>
                </div>
            `;

            // Bind Phone OTP elements in page view
            const btnPageSendOtp = document.getElementById('btn-page-send-otp');
            const pagePhoneStep1 = document.getElementById('page-phone-step-1');
            const pagePhoneStep2 = document.getElementById('page-phone-step-2');
            const pageOtpDigits = container.querySelectorAll('.page-otp-digit');
            const btnPageVerifyOtp = document.getElementById('btn-page-verify-otp');
            const btnPageResendOtp = document.getElementById('btn-page-resend-otp');

            if (btnPageSendOtp) {
                btnPageSendOtp.addEventListener('click', () => {
                    const phoneInput = document.getElementById('phone-page-number');
                    let phone = phoneInput.value.trim();
                    if (!phone) {
                        phone = '98765 43210';
                        phoneInput.value = phone;
                    }
                    const code = document.getElementById('phone-page-country').value;
                    const name = document.getElementById('phone-page-name').value.trim() || 'Citizen Engineer';

                    const res = authInstance.requestPhoneOtp(phone, code);
                    if (res.success) {
                        pagePhoneStep1.style.display = 'none';
                        pagePhoneStep2.style.display = 'flex';
                        document.getElementById('page-display-otp-phone').textContent = res.phone;
                        const livePageCode = document.getElementById('page-live-otp-code');
                        if (livePageCode) livePageCode.textContent = res.code;

                        // Auto pre-fill all 6 digits immediately
                        const digits = res.code.split('');
                        pageOtpDigits.forEach((input, i) => { input.value = digits[i] || ''; });

                        this.showSmsPushToast(res.code, res.phone);

                        setTimeout(() => {
                            alert(`📱 BIO-SHELTER SMS DISPATCH SUCCESS!\n\nYour 6-Digit Verification Code is: ${res.code}\n\n(We have automatically pre-filled the 6 boxes for you!)\nClick 'Verify & Activate Account' to proceed.`);
                        }, 50);
                    }
                });
            }

            const btnPageQuickAutofill = document.getElementById('btn-page-quick-autofill');
            if (btnPageQuickAutofill) {
                btnPageQuickAutofill.addEventListener('click', () => {
                    const liveCode = document.getElementById('page-live-otp-code').textContent.trim();
                    const name = document.getElementById('phone-page-name').value.trim() || 'Citizen Engineer';
                    if (liveCode && liveCode.length === 6) {
                        const digits = liveCode.split('');
                        pageOtpDigits.forEach((input, i) => { input.value = digits[i] || ''; });
                        const result = authInstance.verifyPhoneOtp(liveCode, name);
                        if (result.success) {
                            alert(`Welcome, ${result.user.displayName}! Phone verified.`);
                            this.renderLoginPage();
                        }
                    }
                });
            }

            pageOtpDigits.forEach((digitInput, idx) => {
                digitInput.addEventListener('input', (e) => {
                    if (e.target.value.length === 1 && idx < pageOtpDigits.length - 1) {
                        pageOtpDigits[idx + 1].focus();
                    }
                });
                digitInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Backspace' && !e.target.value && idx > 0) {
                        pageOtpDigits[idx - 1].focus();
                    }
                });
            });

            if (btnPageVerifyOtp) {
                btnPageVerifyOtp.addEventListener('click', () => {
                    let codeStr = '';
                    pageOtpDigits.forEach(input => { codeStr += input.value.trim(); });
                    const name = document.getElementById('phone-page-name').value.trim() || 'Citizen Engineer';

                    if (codeStr.length !== 6) {
                        alert('Please enter the full 6-digit verification code.');
                        return;
                    }

                    const result = authInstance.verifyPhoneOtp(codeStr, name);
                    if (result.success) {
                        alert(`Welcome, ${result.user.displayName}! Phone verified.`);
                        this.renderLoginPage();
                    } else {
                        alert(result.message);
                    }
                });
            }

            if (btnPageResendOtp) {
                btnPageResendOtp.addEventListener('click', () => {
                    const phone = document.getElementById('phone-page-number').value.trim();
                    const code = document.getElementById('phone-page-country').value;
                    const res = authInstance.requestPhoneOtp(phone, code);
                    if (res.success) {
                        this.showSmsPushToast(res.code, res.phone);
                    }
                });
            }

            // Google SSO
            const btnPageGoogle = document.getElementById('btn-page-login-google');
            if (btnPageGoogle) {
                btnPageGoogle.addEventListener('click', () => {
                    const googleModal = document.getElementById('google-auth-modal');
                    if (googleModal) googleModal.classList.add('active');
                });
            }

            // Microsoft SSO
            const btnPageMs = document.getElementById('btn-page-login-microsoft');
            if (btnPageMs) {
                btnPageMs.addEventListener('click', async () => {
                    const user = await authInstance.loginWithMicrosoft();
                    alert(`Welcome, ${user.displayName}! Signed in with Microsoft.`);
                    this.renderLoginPage();
                });
            }

            // Token verify
            const btnPageToken = document.getElementById('btn-page-verify-account-token');
            if (btnPageToken) {
                btnPageToken.addEventListener('click', () => {
                    const token = document.getElementById('input-page-account-token').value.trim();
                    const res = authInstance.verifyAccountCode(token);
                    if (res.success) {
                        alert(res.message);
                        this.renderLoginPage();
                    } else {
                        alert(res.message);
                    }
                });
            }

            // Guest Mode Login in Page
            const btnPageGuest = document.getElementById('btn-page-login-guest');
            if (btnPageGuest) {
                btnPageGuest.addEventListener('click', () => {
                    authInstance.loginAsGuest();
                    const gate = document.getElementById('auth-landing-gate');
                    if (gate) gate.classList.add('unlocked');
                    this.switchTab('tab-3d');
                });
            }

            // Direct Continue to Studio Button
            const btnDirectEnter = document.getElementById('btn-enter-studio-direct');
            if (btnDirectEnter) {
                btnDirectEnter.addEventListener('click', () => {
                    this.switchTab('tab-3d');
                });
            }
        } else {
            // User IS Logged In -> Show Full Profile Dashboard
            const savedProjects = authInstance.getSavedProjects();

            container.innerHTML = `
                <div class="page-header-bar" style="margin-bottom: 20px;">
                    <div class="page-header-info">
                        <h2>Certified User Profile &amp; Cloud Workspace</h2>
                        <p>Manage your verified identity, emergency contact telemetry, and saved bioclimatic shelter models.</p>
                    </div>
                    <div class="page-header-actions">
                        <button id="btn-page-launch-studio" class="export-btn-primary" style="background: linear-gradient(135deg, #0284c7, #10b981);">
                            🚀 Launch 3D Simulation Studio &rarr;
                        </button>
                        <button id="btn-page-logout" class="export-btn-secondary" style="border-color: rgba(244, 63, 94, 0.4); color: var(--accent-rose);">
                            Sign Out
                        </button>
                    </div>
                </div>

                <div class="profile-dashboard-grid">
                    <!-- Left Sidebar Profile Card -->
                    <div class="profile-card-sidebar">
                        <img src="${user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'}" alt="Avatar" class="profile-large-avatar">
                        <div>
                            <h3 style="font-size: 16px; font-weight: 700; color: var(--text-primary);">${user.displayName}</h3>
                            <div style="font-size: 12px; color: var(--accent-sky); margin-top: 2px;">${user.role || 'Certified Resilient Engineer'}</div>
                            <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">${user.institution || 'BioShelter Global Council'}</div>
                        </div>

                        <div class="profile-verified-chip">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
                            Verified Account &bull; ${user.providerName}
                        </div>

                        <div class="hud-metric-box" style="width: 100%; text-align: left; margin-top: 10px;">
                            <div class="hud-metric-label">Emergency Phone</div>
                            <div class="hud-metric-val" style="font-size: 13px; color: var(--accent-emerald);">${user.phone || '+1 (555) 019-2834'}</div>
                        </div>

                        <div class="hud-metric-box" style="width: 100%; text-align: left;">
                            <div class="hud-metric-label">Emergency SOS Net Status</div>
                            <div class="hud-metric-val" style="font-size: 13px; color: var(--accent-emerald);">Active Subscriber ✓</div>
                        </div>
                    </div>

                    <!-- Right Main Details Deck -->
                    <div class="profile-details-deck">
                        <!-- 1. Saved Cloud Projects -->
                        <div class="assembly-card">
                            <div class="chart-title">Saved Cloud Shelter Models (${savedProjects.length})</div>
                            ${savedProjects.length === 0 ? `
                                <div style="text-align: center; color: var(--text-muted); padding: 24px; font-size: 12px;">
                                    No models saved to your cloud workspace yet. Customize a shelter and click "Save Model" in the top header!
                                </div>
                            ` : `
                                <div class="saved-projects-list">
                                    ${savedProjects.map(p => `
                                        <div class="project-item-card">
                                            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                                <strong style="font-size: 13px; color: var(--text-primary);">${p.config.typology.toUpperCase()} Shelter</strong>
                                                <span class="section-badge" style="font-size: 9px;">${p.zoneId}</span>
                                            </div>
                                            <div style="font-size: 11px; color: var(--text-muted);">
                                                Saved on: ${new Date(p.savedAt).toLocaleDateString()}
                                            </div>
                                            <div style="font-size: 11px; color: var(--accent-emerald); font-weight: 600;">
                                                Comfort Score: ${p.summary ? p.summary.comfortScorePercent : 88}%
                                            </div>
                                            <button class="btn-load-twin btn-load-saved-proj" data-proj-config='${JSON.stringify(p.config)}' style="margin-top: 6px; width: 100%; justify-content: center;">
                                                Load in 3D Simulator
                                            </button>
                                        </div>
                                    `).join('')}
                                </div>
                            `}
                        </div>

                        <!-- 2. Profile Settings Update Form -->
                        <div class="assembly-card">
                            <div class="chart-title">Update Contact &amp; Emergency Telemetry</div>
                            <form id="form-update-user-profile" style="display: flex; flex-direction: column; gap: 12px;">
                                <div class="grid-2-cols">
                                    <div class="control-group">
                                        <label class="control-label">Full Name</label>
                                        <input type="text" id="prof-name" class="input-select" value="${user.displayName || ''}">
                                    </div>
                                    <div class="control-group">
                                        <label class="control-label">Emergency Phone Number</label>
                                        <input type="tel" id="prof-phone" class="input-select" value="${user.phone || ''}">
                                    </div>
                                </div>
                                <div class="grid-2-cols">
                                    <div class="control-group">
                                        <label class="control-label">Professional Role</label>
                                        <input type="text" id="prof-role" class="input-select" value="${user.role || ''}">
                                    </div>
                                    <div class="control-group">
                                        <label class="control-label">Institution / Organization</label>
                                        <input type="text" id="prof-inst" class="input-select" value="${user.institution || ''}">
                                    </div>
                                </div>
                                <button type="submit" class="export-btn-primary" style="margin-top: 6px; align-self: flex-start;">
                                    Save Profile Updates
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            `;

            // Bind launch studio in page
            const btnPageLaunch = document.getElementById('btn-page-launch-studio');
            if (btnPageLaunch) {
                btnPageLaunch.addEventListener('click', () => {
                    this.switchTab('tab-3d');
                });
            }

            // Bind sign out in page
            const btnPageLogout = document.getElementById('btn-page-logout');
            if (btnPageLogout) {
                btnPageLogout.addEventListener('click', () => {
                    authInstance.logout();
                });
            }

            // Bind load saved project buttons
            container.querySelectorAll('.btn-load-saved-proj').forEach(btn => {
                btn.addEventListener('click', () => {
                    try {
                        const cfg = JSON.parse(btn.getAttribute('data-proj-config'));
                        this.state.config = { ...this.state.config, ...cfg };
                        this.syncFormWithConfig();
                        this.switchTab('tab-3d');
                        this.updateSimulation();
                    } catch (e) {
                        console.error('Error loading saved project:', e);
                    }
                });
            });

            // Bind update profile form
            const formProf = document.getElementById('form-update-user-profile');
            if (formProf) {
                formProf.addEventListener('submit', (e) => {
                    e.preventDefault();
                    authInstance.updateProfile({
                        displayName: document.getElementById('prof-name').value,
                        phone: document.getElementById('prof-phone').value,
                        role: document.getElementById('prof-role').value,
                        institution: document.getElementById('prof-inst').value
                    });
                    alert('Profile information updated successfully!');
                });
            }
        }
    }

    /* --- User Data Events: Community Shelters, Citizen Hazards, Custom Materials --- */
    bindUserDataEvents() {
        const d = this.dom;

        // 1. Community Shelter Modals & Search
        if (d.btnOpenSubmitShelter) {
            d.btnOpenSubmitShelter.addEventListener('click', () => {
                d.submitShelterModal.classList.add('active');
            });
        }
        if (d.btnCloseShelterModal) {
            d.btnCloseShelterModal.addEventListener('click', () => {
                d.submitShelterModal.classList.remove('active');
            });
        }

        if (d.formSubmitShelter) {
            d.formSubmitShelter.addEventListener('submit', (e) => {
                e.preventDefault();
                const user = authInstance.getCurrentUser();
                const newShelter = {
                    name: document.getElementById('new-shelter-name').value,
                    climateZone: document.getElementById('new-shelter-zone').value,
                    typology: document.getElementById('new-shelter-typology').value,
                    location: document.getElementById('new-shelter-location').value,
                    capacity: parseInt(document.getElementById('new-shelter-capacity').value, 10) || 30,
                    wallMaterial: document.getElementById('new-shelter-materials').value,
                    roofMaterial: 'Bioclimatic Composite Roof',
                    emergencyContact: document.getElementById('new-shelter-phone').value,
                    authorName: user ? user.displayName : 'Citizen Architect',
                    authorRole: user ? user.role : 'Community Volunteer',
                    status: 'Community Registered Haven',
                    coolingStrategy: 'Natural Cross-Flow & Soil Physics',
                    config: JSON.parse(JSON.stringify(this.state.config))
                };

                userDataStore.addCommunityShelter(newShelter);
                d.submitShelterModal.classList.remove('active');
                d.formSubmitShelter.reset();
                this.renderCommunityShelters();
                alert(`Community shelter "${newShelter.name}" published successfully!`);
            });
        }

        if (d.inputSearchCommunity) {
            d.inputSearchCommunity.addEventListener('input', () => {
                this.renderCommunityShelters(d.inputSearchCommunity.value);
            });
        }

        // 2. Citizen Hazard Reports Modal
        if (d.btnOpenReportHazard) {
            d.btnOpenReportHazard.addEventListener('click', () => {
                d.reportHazardModal.classList.add('active');
            });
        }
        if (d.btnCloseHazardModal) {
            d.btnCloseHazardModal.addEventListener('click', () => {
                d.reportHazardModal.classList.remove('active');
            });
        }

        if (d.formReportHazard) {
            d.formReportHazard.addEventListener('submit', (e) => {
                e.preventDefault();
                const user = authInstance.getCurrentUser();
                const newHazard = {
                    title: document.getElementById('hazard-input-title').value,
                    type: document.getElementById('hazard-input-type').value,
                    severity: document.getElementById('hazard-input-severity').value,
                    location: document.getElementById('hazard-input-location').value,
                    description: document.getElementById('hazard-input-desc').value,
                    reportedBy: user ? `${user.displayName} (${user.role})` : 'Citizen Responder',
                    actionsRecommended: 'Seek nearest earth-covered refuge immediately. Activate backup water filtration.'
                };

                userDataStore.addHazardReport(newHazard);
                d.reportHazardModal.classList.remove('active');
                d.formReportHazard.reset();
                this.renderHazardReports();

                // If Critical severity, trigger SOS broadcast
                if (newHazard.severity === 'critical') {
                    sosEngine.triggerDisaster({
                        type: newHazard.type,
                        title: newHazard.title,
                        severity: newHazard.severity,
                        epicenter: newHazard.location,
                        coordinates: 'Reported Geolocation',
                        instructions: newHazard.description,
                        recommendedShelter: 'Nearest Verified Bunker Refuge',
                        evacuationVector: 'Active Evacuation Vector'
                    });
                }
            });
        }

        // 3. Custom Material Lab Form
        if (d.formCustomMaterial) {
            d.formCustomMaterial.addEventListener('submit', (e) => {
                e.preventDefault();
                const matName = document.getElementById('mat-name').value;
                const matK = parseFloat(document.getElementById('mat-k').value);
                const matRho = parseFloat(document.getElementById('mat-rho').value);
                const matCp = parseFloat(document.getElementById('mat-cp').value);
                const matCarbon = parseFloat(document.getElementById('mat-carbon').value) || 0;

                const customMat = {
                    name: matName,
                    k: matK,
                    rho: matRho,
                    cp: matCp,
                    embodiedCarbon: matCarbon
                };

                const savedMat = userDataStore.addCustomMaterial(customMat);
                // Also register into global MATERIALS database for live calculation
                MATERIALS[savedMat.id] = savedMat;

                d.formCustomMaterial.reset();
                this.renderCustomMaterials();
                this.renderMaterialLayers();
                alert(`Custom material "${matName}" added to material library!`);
            });
        }

        // Subscribe to store updates
        userDataStore.subscribe(() => {
            this.renderCommunityShelters();
            this.renderHazardReports();
            this.renderCustomMaterials();
        });
    }

    renderCommunityShelters(query = '') {
        const d = this.dom;
        if (!d.communityList) return;

        let shelters = userDataStore.getCommunityShelters();
        if (query) {
            const q = query.toLowerCase();
            shelters = shelters.filter(s => s.name.toLowerCase().includes(q) || s.location.toLowerCase().includes(q) || s.climateZone.includes(q));
        }

        d.communityList.innerHTML = shelters.map(s => `
            <div class="community-card">
                <div class="community-card-header">
                    <div>
                        <div style="font-size: 15px; font-weight: 700; color: var(--text-primary);">${s.name}</div>
                        <div style="font-size: 11px; color: var(--text-secondary); margin-top: 2px;">${s.location} &bull; ${s.capacity} Occupants</div>
                    </div>
                    <span class="section-badge" style="background: rgba(16,185,129,0.15); color: #10b981;">${s.status.split(' ')[0]}</span>
                </div>

                <div class="community-author">
                    <span>Submitted by <strong>${s.authorName}</strong> (${s.authorRole})</span>
                </div>

                <div class="bunker-details-box">
                    <strong>Envelope:</strong> ${s.wallMaterial}<br>
                    <strong>Passive Cooling:</strong> ${s.coolingStrategy}<br>
                    <strong>Emergency Phone:</strong> ${s.emergencyContact || 'Available on request'}
                </div>

                <div class="community-card-footer">
                    <button class="btn-upvote" data-upvote-id="${s.id}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>
                        <span>${s.upvotes || 0} Upvotes</span>
                    </button>
                    <button class="btn-load-twin" data-load-config='${JSON.stringify(s.config || {})}'>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44c-.16.12-.36.18-.57.18s-.41-.06-.57-.18l-7.9-4.44A.991.991 0 013 16.5v-9c0-.38.21-.71.53-.88l7.9-4.44c.16-.12.36-.18.57-.18s.41.06.57.18l7.9 4.44c.32.17.53.5.53.88v9z"/></svg>
                        Load in 3D Twin
                    </button>
                </div>
            </div>
        `).join('');

        // Bind upvote & load buttons
        d.communityList.querySelectorAll('.btn-upvote').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-upvote-id');
                userDataStore.upvoteShelter(id);
            });
        });

        d.communityList.querySelectorAll('.btn-load-twin').forEach(btn => {
            btn.addEventListener('click', () => {
                try {
                    const cfg = JSON.parse(btn.getAttribute('data-load-config'));
                    this.state.config = { ...this.state.config, ...cfg };
                    this.syncFormWithConfig();
                    this.switchTab('tab-3d');
                    this.updateSimulation();
                } catch (e) {
                    console.error('Error loading community shelter model:', e);
                }
            });
        });
    }

    renderHazardReports() {
        const d = this.dom;
        if (!d.hazardFeed) return;

        const hazards = userDataStore.getHazardReports();
        d.hazardFeed.innerHTML = hazards.map(h => `
            <div class="hazard-card ${h.severity}">
                <div class="hazard-header">
                    <div>
                        <div class="hazard-title">${h.title}</div>
                        <div class="hazard-meta-row" style="margin-top: 4px;">
                            <span>${h.location}</span> &bull; 
                            <span>${new Date(h.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>
                    <span class="rec-priority-badge ${h.severity}">${h.severity.toUpperCase()}</span>
                </div>

                <div class="hazard-desc">${h.description}</div>

                <div class="hazard-action-box">
                    <strong>Evacuation / Life-Support Protocol:</strong> ${h.actionsRecommended || 'Evacuate to reinforced earthen refuge.'}
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: var(--text-muted);">
                    <span>Reported by: <strong>${h.reportedBy}</strong></span>
                    <span style="color: var(--accent-emerald); font-weight: 700;">${h.status}</span>
                </div>
            </div>
        `).join('');
    }

    renderCustomMaterials() {
        const d = this.dom;
        if (!d.customMaterialsList) return;

        const customMats = userDataStore.getCustomMaterials();
        if (customMats.length === 0) {
            d.customMaterialsList.innerHTML = `
                <div style="text-align: center; color: var(--text-muted); padding: 20px; font-size: 12px;">
                    No custom materials created yet. Use the form on the left to add your first material!
                </div>
            `;
            return;
        }

        d.customMaterialsList.innerHTML = customMats.map(m => `
            <div class="layer-row">
                <div class="layer-info">
                    <span class="layer-name">${m.name}</span>
                    <span class="layer-meta">k: ${m.k} W/m·K | ρ: ${m.rho} kg/m³ | cp: ${m.cp} J/kg·K</span>
                </div>
                <div style="font-size: 11px; color: var(--accent-emerald); font-weight: 700;">
                    ${m.embodiedCarbon} kg CO₂/m³
                </div>
            </div>
        `).join('');
    }

    /* --- Emergency Disaster SOS Net & Siren Bindings --- */
    bindSOSEvents() {
        const d = this.dom;

        // Header Panic SOS button
        if (d.btnHeaderPanicSos) {
            d.btnHeaderPanicSos.addEventListener('click', () => {
                const user = authInstance.getCurrentUser();
                sosEngine.triggerUserPanicSOS(user);
            });
        }

        // Floating Panic SOS button
        if (d.btnFloatingPanic) {
            d.btnFloatingPanic.addEventListener('click', () => {
                const user = authInstance.getCurrentUser();
                sosEngine.triggerUserPanicSOS(user);
            });
        }

        // Hub Panic SOS button
        if (d.btnPanicHubTrigger) {
            d.btnPanicHubTrigger.addEventListener('click', () => {
                const user = authInstance.getCurrentUser();
                sosEngine.triggerUserPanicSOS(user);
            });
        }

        // Scenario Preset Buttons in SOS Hub
        document.querySelectorAll('.scenario-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const scenarioKey = btn.getAttribute('data-scenario');
                sosEngine.triggerDisaster(scenarioKey);
            });
        });

        // SOS Banner Controls
        if (d.btnSosMuteSiren) {
            d.btnSosMuteSiren.addEventListener('click', () => {
                const isMuted = sosEngine.toggleMute();
                d.btnSosMuteSiren.innerHTML = isMuted ? 
                    `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg> Unmute Siren` :
                    `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg> Mute Siren`;
            });
        }

        if (d.btnSosDismissBanner) {
            d.btnSosDismissBanner.addEventListener('click', () => {
                sosEngine.dismissDisaster();
            });
        }

        if (d.btnSosNearestShelter) {
            d.btnSosNearestShelter.addEventListener('click', () => {
                this.switchTab('tab-bunkers');
            });
        }

        // Listen for SOS Engine changes
        sosEngine.subscribe(({ eventType, data }) => {
            if (eventType === 'disaster_triggered') {
                const disaster = data.disaster;
                d.topSosBanner.classList.add('active');
                d.sosBannerTitle.textContent = disaster.title;
                d.sosBannerDesc.textContent = `${disaster.epicenter} &bull; ${disaster.instructions}`;
                this.renderSOSDispatchLogs();

                // Show on-screen toast with broadcast preview
                this.showSmsPushToast('DISASTER SOS', 'All Registered Phones');
            } else if (eventType === 'disaster_dismissed') {
                d.topSosBanner.classList.remove('active');
            }
        });
    }

    renderSOSDispatchLogs() {
        const d = this.dom;
        if (!d.sosDispatchFeed) return;

        const history = sosEngine.getBroadcastHistory();
        if (history.length === 0) {
            d.sosDispatchFeed.innerHTML = `
                <div style="text-align: center; color: var(--text-muted); padding: 30px; font-size: 12px;">
                    No active broadcast dispatches yet. Trigger a disaster scenario or Panic SOS to test live SMS broadcasts.
                </div>
            `;
            return;
        }

        d.sosDispatchFeed.innerHTML = history.map(item => `
            <div class="dispatch-item">
                <div class="dispatch-item-head">
                    <strong style="color: #f87171;">${item.disasterTitle}</strong>
                    <span style="color: var(--text-muted); font-family: var(--font-mono);">${new Date(item.timestamp).toLocaleTimeString()}</span>
                </div>
                <div style="font-size: 11px; color: var(--text-secondary);">
                    Location: <strong>${item.epicenter}</strong> &bull; Dispatched to <strong>${item.recipientsCount} phone numbers</strong>
                </div>
                <div class="sms-bubble">${item.smsContent}</div>
                <div style="font-size: 10px; color: var(--accent-emerald); display: flex; align-items: center; gap: 4px;">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                    Multi-Channel SMS Gateway Status: 100% Broadcast Acknowledged
                </div>
            </div>
        `).join('');
    }

    switchTab(tabId) {
        this.state.activeTab = tabId;
        this.dom.tabButtons.forEach(b => b.classList.toggle('active', b.getAttribute('data-tab') === tabId));
        this.dom.tabPanes.forEach(p => p.classList.toggle('active', p.id === tabId));

        if (tabId === 'tab-3d' && this.visualizer3D) {
            setTimeout(() => this.visualizer3D.onWindowResize(), 50);
        }
        if (tabId === 'tab-psychro' && this.psychroChart) {
            setTimeout(() => this.psychroChart.render(), 50);
        }
        if (tabId === 'tab-soil') {
            this.updateSoilSection();
        }
        if (tabId === 'tab-weather') {
            this.updateWeatherSection();
        }
        if (tabId === 'tab-bunkers') {
            this.updateBunkersSection();
        }
        if (tabId === 'tab-community') {
            this.renderCommunityShelters();
        }
        if (tabId === 'tab-hazards') {
            this.renderHazardReports();
        }
        if (tabId === 'tab-sos-hub') {
            this.renderSOSDispatchLogs();
        }
        if (tabId === 'tab-world-map') {
            this.renderWorldMapTab();
        }
        if (tabId === 'tab-login') {
            this.renderLoginPage();
        }
    }

    togglePlayAnimation() {
        this.state.isPlaying = !this.state.isPlaying;
        const icon = this.dom.btnPlayPause.querySelector('svg');
        if (this.state.isPlaying) {
            if (icon) icon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
            this.animationTimer = setInterval(() => {
                this.state.currentHour = (this.state.currentHour + 1) % 24;
                this.dom.timeSlider.value = this.state.currentHour;
                this.updateHUDAndTime();
            }, 600);
        } else {
            if (icon) icon.innerHTML = '<path d="M8 5v14l11-7z"/>';
            clearInterval(this.animationTimer);
        }
    }

    updateSimulation() {
        // 1. Generate Climate Profile
        this.climateData = generateDiurnalWeather(this.state.zoneId, this.state.customClimateParams);

        // Update Zone UI description
        const zone = this.climateData.zone;
        this.dom.zoneDescription.textContent = zone.description;
        this.dom.zoneRegion.textContent = zone.region;

        // 2. Solve Thermal Model
        this.simulationData = runThermalSimulation(this.state.config, this.climateData);

        // 3. Run Bioclimatic Optimization Diagnostic
        this.optimizationResults = analyzeAndGenerateRecommendations(this.state.config, this.climateData, this.simulationData);

        // 4. Update 3D Digital Twin
        if (this.visualizer3D) {
            this.visualizer3D.buildShelter(this.state.config, this.simulationData);
        }

        // 5. Update Psychrometric Chart
        if (this.psychroChart) {
            this.psychroChart.setData(this.climateData, this.simulationData);
        }

        // 6. Update Chart.js Charts
        this.updateChartsData();

        // 7. Update Material Layers Editor
        this.renderMaterialLayers();

        // 8. Update Optimizer Tab View
        this.renderOptimizerView();

        // 9. Update Soil, Weather & Bunkers Sections
        this.updateSoilSection();
        this.updateWeatherSection();
        this.updateBunkersSection();

        // 10. Update Python Code Preview
        const pyCode = generatePythonSimulationScript(this.state.config, this.climateData, this.simulationData);
        if (this.dom.pythonCodePreview) {
            this.dom.pythonCodePreview.textContent = pyCode;
        }

        // 11. Update Real-time HUD
        this.updateHUDAndTime();
    }

    updateSoilSection() {
        const tMean = (this.climateData.params.tMax + this.climateData.params.tMin) / 2;
        const tAmp = (this.climateData.params.tMax - this.climateData.params.tMin) / 2;
        this.soilResults = calculateSoilDepthProfile(this.state.soilId, tMean, tAmp, this.state.selectedSoilDepth);

        const soil = this.soilResults.soil;
        const d = this.dom;

        if (d.soilKVal) d.soilKVal.textContent = `${soil.k} W/m·K`;
        if (d.soilDiffusivityVal) d.soilDiffusivityVal.textContent = `${soil.diffusivityDay} m²/day`;
        if (d.soilMoistureVal) d.soilMoistureVal.textContent = `${soil.moistureContent}%`;
        if (d.soilBearingVal) d.soilBearingVal.textContent = `${soil.bearingCapacity} kN/m²`;
        if (d.soilGeothermalBenefit) d.soilGeothermalBenefit.textContent = `${this.soilResults.steadyGeothermalTemp}°C (ΔT = ${this.soilResults.earthBermingCoolingBenefitC}°C cooling)`;

        if (d.soilSuitabilityText) {
            d.soilSuitabilityText.innerHTML = `
                <strong>Rammed Earth:</strong> ${soil.constructionSuitability.rammedEarth}<br>
                <strong>Earthbags (Superadobe):</strong> ${soil.constructionSuitability.earthbags}<br>
                <strong>Adobe Bricks:</strong> ${soil.constructionSuitability.adobe}
            `;
        }

        if (this.soilDepthChart) {
            const months = this.soilResults.monthlyProfiles;
            this.soilDepthChart.data.datasets[0].data = months.map(m => m.z_0m);
            this.soilDepthChart.data.datasets[1].data = months.map(m => m.z_1m);
            this.soilDepthChart.data.datasets[2].data = months.map(m => m.z_2m);
            this.soilDepthChart.data.datasets[3].data = months.map(m => m.z_3m);
            this.soilDepthChart.data.datasets[4].data = months.map(m => m.z_5m);
            this.soilDepthChart.update();
        }
    }

    updateWeatherSection() {
        const h = this.state.currentHour;
        const w = this.climateData.hourly[h];
        const adv = calculateAdvancedWeatherMetrics(w.ambientTemp, w.relativeHumidity, w.ghi, w.windSpeed, 250);

        const d = this.dom;
        if (d.weatherWetBulbVal) d.weatherWetBulbVal.textContent = `${adv.wetBulbTemp}°C`;
        if (d.weatherDewPointVal) d.weatherDewPointVal.textContent = `${adv.dewPointTemp}°C`;
        if (d.weatherVpdVal) d.weatherVpdVal.textContent = `${adv.vpdKPa} kPa`;
        if (d.weatherUvVal) d.weatherUvVal.textContent = `UV ${adv.uvIndex}`;
        if (d.weatherPressureVal) d.weatherPressureVal.textContent = `${adv.barometricPressureKPa} kPa`;
        if (d.weatherWindEavesVal) d.weatherWindEavesVal.textContent = `${adv.windSpeedEaves} m/s`;

        if (this.weatherSolarChart) {
            const hourly = this.climateData.hourly;
            this.weatherSolarChart.data.datasets[0].data = hourly.map(x => x.ghi);
            this.weatherSolarChart.data.datasets[1].data = hourly.map(x => x.dni);
            this.weatherSolarChart.data.datasets[2].data = hourly.map(x => x.dhi);
            this.weatherSolarChart.update();
        }
    }

    updateBunkersSection() {
        const bunkers = getBunkersForZone(this.state.zoneId);
        const d = this.dom;

        if (d.bunkerCountBadge) {
            d.bunkerCountBadge.textContent = `${bunkers.length} Verified Facilities in Region`;
        }

        if (d.bunkersList) {
            d.bunkersList.innerHTML = bunkers.map(b => `
                <div class="bunker-card">
                    <div class="bunker-header">
                        <div>
                            <div class="bunker-title">${b.name}</div>
                            <div class="bunker-coords">${b.region} &bull; ${b.coordinates} (${b.distanceKm} km away)</div>
                        </div>
                        <span class="bunker-badge-blast">${b.overpressureRatingPsi} PSI Blast Rated</span>
                    </div>

                    <div class="bunker-grid-specs">
                        <div class="bunker-spec-box">
                            <span class="spec-lbl">Overburden Soil Depth</span>
                            <span class="spec-val" style="color: var(--accent-emerald);">${b.soilOverburdenMeters}m Earth Berm</span>
                        </div>
                        <div class="bunker-spec-box">
                            <span class="spec-lbl">Subterranean Passive Temp</span>
                            <span class="spec-val" style="color: var(--accent-sky);">${b.thermalComfortModel.subterraneanSteadyTemp}°C Stable</span>
                        </div>
                        <div class="bunker-spec-box">
                            <span class="spec-lbl">Capacity</span>
                            <span class="spec-val">${b.capacityOccupants} Occupants</span>
                        </div>
                        <div class="bunker-spec-box">
                            <span class="spec-lbl">Autonomous Duration</span>
                            <span class="spec-val">${b.lifeSupport.maxAutonomousDurationDays} Days Safe</span>
                        </div>
                    </div>

                    <div class="bunker-details-box">
                        <strong>Passive Geothermal Cooling:</strong> ${b.thermalComfortModel.naturalCoolingStrategy}<br>
                        <strong>Air & CBRN Life Support:</strong> ${b.lifeSupport.airFiltration}<br>
                        <strong>Water & Power:</strong> ${b.lifeSupport.waterSupply} | ${b.lifeSupport.powerAutonomy}
                    </div>

                    <div class="bunker-amenities-row">
                        ${b.amenities.map(a => `<span class="amenity-chip">${a}</span>`).join('')}
                    </div>

                    <div class="bunker-contact-bar">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                        ${b.contactEmergency}
                    </div>

                    <div style="margin-top: 10px;">
                        <button class="btn-load-twin btn-plot-bunker-route" data-bunker-name="${b.name}" data-coords="${b.coordinates}" data-contact="${b.contactEmergency}" style="width: 100%; justify-content: center;">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                            Plot Emergency GPS Evacuation Route
                        </button>
                    </div>
                </div>
            `).join('');

            d.bunkersList.querySelectorAll('.btn-plot-bunker-route').forEach(btn => {
                btn.addEventListener('click', () => {
                    const name = btn.getAttribute('data-bunker-name');
                    const coords = btn.getAttribute('data-coords');
                    const contact = btn.getAttribute('data-contact');
                    alert(`🚨 EMERGENCY EVACUATION VECTOR INITIATED\n\nTarget Refuge: ${name}\nGeographic Coordinates: ${coords}\nRadio Link: ${contact}\n\nNavigating to verified subterranean refuge. Life support air and geothermal cooling active.`);
                });
            });
        }
    }

    updateHUDAndTime() {
        const h = this.state.currentHour;
        this.dom.timeClock.textContent = `${h.toString().padStart(2, '0')}:00`;

        const weatherHour = this.climateData.hourly[h];
        const simHour = this.simulationData.hourly[h];

        if (this.visualizer3D) {
            this.visualizer3D.updateSunPosition(h, weatherHour);
        }

        // Update Location, Wind, and Climatological Statement in HUD
        const station = this.selectedWorldStation || {
            name: this.climateData.zone.name,
            country: 'Regional Simulation Model',
            status: 'Hot-Arid Desert Active',
            tempC: this.climateData.params.tMax,
            windSpeedMps: this.climateData.params.windSpeedAvg || 3.8,
            windSpeedKmh: Math.round((this.climateData.params.windSpeedAvg || 3.8) * 3.6 * 10) / 10,
            windDirectionDeg: 245,
            windDirectionText: 'WSW (245°) ➔ ENE (65°)',
            weatherStatement: this.climateData.zone.description
        };

        const locNameEl = document.getElementById('hud-location-name');
        if (locNameEl) locNameEl.textContent = `📍 ${station.name}, ${station.country || ''}`;

        const badgeEl = document.getElementById('hud-climate-badge');
        if (badgeEl) {
            badgeEl.textContent = station.status || this.climateData.zone.name;
            if (station.tempC >= 40) {
                badgeEl.style.background = 'rgba(239,68,68,0.2)';
                badgeEl.style.color = '#ef4444';
            } else if (station.isParadise || (station.tempC >= 20 && station.tempC <= 28)) {
                badgeEl.style.background = 'rgba(16,185,129,0.2)';
                badgeEl.style.color = '#10b981';
            } else {
                badgeEl.style.background = 'rgba(56,189,248,0.2)';
                badgeEl.style.color = '#38bdf8';
            }
        }

        const stmtEl = document.getElementById('hud-weather-statement');
        if (stmtEl) stmtEl.textContent = station.weatherStatement || this.climateData.zone.description;

        const windSpeedEl = document.getElementById('hud-wind-speed-val');
        if (windSpeedEl) windSpeedEl.textContent = `${station.windSpeedMps || 3.8} m/s (${station.windSpeedKmh || 13.7} km/h)`;

        const windDirEl = document.getElementById('hud-wind-dir-text');
        if (windDirEl) windDirEl.textContent = station.windDirectionText || 'NW ➔ SE';

        const compassArrowEl = document.getElementById('hud-wind-compass-arrow');
        if (compassArrowEl) {
            compassArrowEl.style.transform = `rotate(${station.windDirectionDeg || 245}deg)`;
        }

        const coolingDeltaEl = document.getElementById('hud-cooling-delta');
        if (coolingDeltaEl) {
            const delta = (simHour.indoorTemp - simHour.ambientTemp).toFixed(1);
            if (delta < 0) {
                coolingDeltaEl.textContent = `${delta}°C Cooling`;
                coolingDeltaEl.style.color = '#10b981';
            } else {
                coolingDeltaEl.textContent = `+${delta}°C Gain`;
                coolingDeltaEl.style.color = '#f59e0b';
            }
        }

        // Update HUD Core Values
        this.dom.hudIndoorTemp.textContent = `${simHour.indoorTemp.toFixed(1)}°C`;
        this.dom.hudOperativeTemp.textContent = `${simHour.operativeTemp.toFixed(1)}°C`;
        this.dom.hudAmbientTemp.textContent = `${simHour.ambientTemp.toFixed(1)}°C`;
        this.dom.hudPpd.textContent = `${simHour.ppd.toFixed(1)}%`;
        this.dom.hudAch.textContent = `${simHour.ach.toFixed(1)} ACH`;
        this.dom.hudPmvValue.textContent = `${simHour.pmv > 0 ? '+' : ''}${simHour.pmv.toFixed(2)}`;

        const pmvPercent = Math.min(100, Math.max(0, ((simHour.pmv + 3) / 6) * 100));
        this.dom.hudPmvIndicator.style.left = `${pmvPercent}%`;

        if (simHour.isComfortableAdaptive) {
            this.dom.hudAdaptiveStatus.textContent = 'COMFORTABLE';
            this.dom.hudAdaptiveStatus.style.background = 'rgba(16, 185, 129, 0.2)';
            this.dom.hudAdaptiveStatus.style.color = '#34d399';
        } else {
            this.dom.hudAdaptiveStatus.textContent = 'OUTSIDE LIMIT';
            this.dom.hudAdaptiveStatus.style.background = 'rgba(244, 63, 94, 0.2)';
            this.dom.hudAdaptiveStatus.style.color = '#f87171';
        }

        this.dom.hudComfortScore.textContent = `${this.simulationData.summary.comfortScorePercent}%`;
        this.dom.hudDampingRatio.textContent = `${this.simulationData.summary.thermalDampingRatio}%`;

        this.updateWeatherSection();
    }

    bindComfortMatcherEvents() {
        const sliderTemp = document.getElementById('slider-comfort-target-temp');
        const valTemp = document.getElementById('val-comfort-target-temp');
        const sliderHum = document.getElementById('slider-comfort-target-humidity');
        const valHum = document.getElementById('val-comfort-target-humidity');
        const selLifestyle = document.getElementById('select-comfort-lifestyle');
        const sliderWind = document.getElementById('slider-comfort-max-wind');
        const valWind = document.getElementById('val-comfort-max-wind');
        const btnReset = document.getElementById('btn-reset-comfort-search');

        const triggerRecalc = () => {
            this.renderComfortPlaces();
        };

        if (sliderTemp && valTemp) {
            sliderTemp.addEventListener('input', (e) => {
                valTemp.textContent = `${parseFloat(e.target.value).toFixed(1)}°C`;
                triggerRecalc();
            });
        }

        if (sliderHum && valHum) {
            sliderHum.addEventListener('input', (e) => {
                valHum.textContent = `${e.target.value}%`;
                triggerRecalc();
            });
        }

        if (selLifestyle) {
            selLifestyle.addEventListener('change', () => {
                triggerRecalc();
            });
        }

        if (sliderWind && valWind) {
            sliderWind.addEventListener('input', (e) => {
                valWind.textContent = `${parseFloat(e.target.value).toFixed(1)} m/s (${Math.round(parseFloat(e.target.value) * 3.6)} km/h)`;
                triggerRecalc();
            });
        }

        if (btnReset) {
            btnReset.addEventListener('click', () => {
                if (sliderTemp) sliderTemp.value = 23.0;
                if (valTemp) valTemp.textContent = '23.0°C';
                if (sliderHum) sliderHum.value = 55;
                if (valHum) valHum.textContent = '55%';
                if (selLifestyle) selLifestyle.value = 'all';
                if (sliderWind) sliderWind.value = 5.0;
                if (valWind) valWind.textContent = '5.0 m/s (18 km/h)';
                triggerRecalc();
            });
        }

        // World map filter chips
        document.querySelectorAll('.map-filter-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                document.querySelectorAll('.map-filter-chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                const cat = chip.getAttribute('data-map-filter');
                if (this.worldMapEngine) {
                    this.worldMapEngine.setFilter(cat);
                }
            });
        });
    }

    renderComfortPlaces() {
        const grid = document.getElementById('comfort-places-ranked-grid');
        if (!grid) return;

        const targetTemp = parseFloat((document.getElementById('slider-comfort-target-temp') || {}).value || 23.0);
        const targetHum = parseFloat((document.getElementById('slider-comfort-target-humidity') || {}).value || 55);
        const lifestyle = (document.getElementById('select-comfort-lifestyle') || {}).value || 'all';
        const maxWind = parseFloat((document.getElementById('slider-comfort-max-wind') || {}).value || 5.0);

        const ranked = analyzeAndRankComfortPlaces({
            targetTemp,
            targetHumidity: targetHum,
            lifestyle,
            maxWind
        });

        const badgeCount = document.getElementById('comfort-results-count-badge');
        if (badgeCount) badgeCount.textContent = `${ranked.length} Paradise Destinations Ranked`;

        // 1. Update AI Analytics Summary & Metrics
        if (ranked.length > 0) {
            const top = ranked[0];
            const second = ranked[1];
            const summaryEl = document.getElementById('comfort-ai-summary-text');
            if (summaryEl) {
                summaryEl.innerHTML = `
                    Based on your target of <strong>${targetTemp.toFixed(1)}°C</strong> and <strong>${targetHum}% humidity</strong>, 
                    <strong>${top.name}, ${top.country}</strong> (${top.matchScore}% Match) and <strong>${second ? second.name : 'Madeira'}, ${second ? second.country : 'Portugal'}</strong> 
                    represent your optimal bioclimatic comfort zone with <strong>${top.comfortDaysPerYear} comfort days/year</strong>.
                `;
            }

            const tsiEl = document.getElementById('analytics-tsi-val');
            if (tsiEl) tsiEl.textContent = `${top.analytics.thermalStability} / 100`;

            const daysEl = document.getElementById('analytics-comfort-days-val');
            if (daysEl) daysEl.textContent = `${top.comfortDaysPerYear} Days`;

            const leiEl = document.getElementById('analytics-lei-val');
            if (leiEl) leiEl.textContent = `${top.analytics.lifeEnjoymentScore} / 100`;

            // 2. Render Bioclimatic Spider / Radar Chart
            this.renderComfortRadarChart(ranked.slice(0, 3));
        }

        grid.innerHTML = ranked.map((d, index) => {
            const isTop = index === 0;
            const matchCol = d.matchScore >= 90 ? '#10b981' : (d.matchScore >= 75 ? '#38bdf8' : '#f59e0b');

            return `
                <div class="community-card" style="border-color: ${isTop ? 'rgba(16,185,129,0.5)' : 'var(--border-glass)'}; background: ${isTop ? 'linear-gradient(135deg, rgba(16,185,129,0.06), var(--bg-card))' : 'var(--bg-card)'};">
                    ${isTop ? `<div style="position: absolute; top: 12px; right: 12px; background: linear-gradient(135deg, #10b981, #0284c7); color: white; font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 12px; text-transform: uppercase;">🌟 #1 Top Bioclimatic Match</div>` : ''}
                    
                    <div style="display: flex; gap: 14px; align-items: flex-start;">
                        <img src="${d.photoUrl}" alt="${d.name}" style="width: 80px; height: 80px; border-radius: 8px; object-fit: cover; border: 1px solid var(--border-glass);">
                        <div style="flex: 1;">
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2px;">
                                <h3 style="font-size: 16px; font-weight: 800; color: var(--text-primary);">${d.name}</h3>
                                <span style="font-size: 14px; font-weight: 900; color: ${matchCol}; background: ${matchCol}18; padding: 2px 8px; border-radius: 6px; border: 1px solid ${matchCol}40;">${d.matchScore}% Match</span>
                            </div>
                            <div style="font-size: 11px; color: var(--accent-sky); font-weight: 600;">${d.region}, ${d.country}</div>
                            <div style="font-size: 11px; color: var(--text-secondary); font-style: italic; margin-top: 2px;">"${d.tagline}"</div>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin: 12px 0; background: rgba(0,0,0,0.2); padding: 8px; border-radius: 8px;">
                        <div style="text-align: center;">
                            <div style="font-size: 9px; color: var(--text-muted); text-transform: uppercase;">Year-Round Temp</div>
                            <div style="font-size: 14px; font-weight: 800; color: var(--accent-emerald);">${d.tempAvg}°C</div>
                            <div style="font-size: 9px; color: var(--text-muted);">${d.tempMin}°C - ${d.tempMax}°C</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 9px; color: var(--text-muted); text-transform: uppercase;">Humidity</div>
                            <div style="font-size: 14px; font-weight: 800; color: var(--accent-sky);">${d.humidityAvg}%</div>
                            <div style="font-size: 9px; color: var(--text-muted);">${d.airQuality}</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 9px; color: var(--text-muted); text-transform: uppercase;">Wind Breeze</div>
                            <div style="font-size: 14px; font-weight: 800; color: #f59e0b;">${d.windSpeedAvg} m/s</div>
                            <div style="font-size: 9px; color: var(--text-muted);">${d.windDirection.split(' ')[0]}</div>
                        </div>
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: var(--text-secondary); margin-bottom: 8px;">
                        <span>Elevation: <strong>${d.elevationMeters || 120}m</strong></span>
                        <span>Sunshine: <strong>${d.sunshineHoursYear || 2400} hrs/yr</strong></span>
                        <span>Comfort Days: <strong>${d.comfortDaysPerYear || 320} d/yr</strong></span>
                    </div>

                    <p style="font-size: 11px; color: var(--text-secondary); line-height: 1.45; margin-bottom: 8px;">
                        ${d.weatherStatement}
                    </p>

                    <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 12px;">
                        ${d.idealFor.map(tag => `<span style="font-size: 10px; background: rgba(56,189,248,0.1); color: var(--accent-sky); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(56,189,248,0.2);">${tag}</span>`).join('')}
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                        <a href="${d.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${d.lat},${d.lng}`}" target="_blank" rel="noopener noreferrer" class="btn-sign-in-nav" style="text-decoration: none; justify-content: center; font-size: 11px; padding: 7px; background: rgba(56,189,248,0.12); border-color: rgba(56,189,248,0.3); color: var(--accent-sky); font-weight: 700;">
                            📍 Explore on Google Maps ↗
                        </a>
                        <button class="export-btn-primary btn-simulate-paradise" data-dest-id="${d.id}" style="justify-content: center; font-size: 11px; padding: 7px; background: linear-gradient(135deg, #0284c7, #10b981);">
                            🚀 Simulate in 3D &rarr;
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        grid.querySelectorAll('.btn-simulate-paradise').forEach(btn => {
            btn.addEventListener('click', () => {
                const destId = btn.getAttribute('data-dest-id');
                const dest = PARADISE_DESTINATIONS.find(x => x.id === destId);
                if (dest) {
                    this.onSelectWorldStation({
                        name: dest.name,
                        country: dest.country,
                        status: `Paradise Comfort Eden 🟢 (${dest.matchScore || 98}% Match)`,
                        tempC: dest.tempAvg,
                        tempMax: dest.tempMax,
                        tempMin: dest.tempMin,
                        humidity: dest.humidityAvg,
                        windSpeed: dest.windSpeedAvg,
                        windSpeedMps: dest.windSpeedAvg,
                        windSpeedKmh: Math.round(dest.windSpeedAvg * 3.6 * 10) / 10,
                        windDirectionDeg: 45,
                        windDirectionText: dest.windDirection,
                        weatherStatement: dest.weatherStatement,
                        zone: dest.zoneId,
                        isParadise: true
                    });
                    this.switchTab('tab-3d');
                    alert(`🌴 Loaded ${dest.name}, ${dest.country} into BioShelter 3D Simulation Twin!\n\nAverage Temp: ${dest.tempAvg}°C\nHumidity: ${dest.humidityAvg}%\nWind: ${dest.windSpeedAvg} m/s (${dest.windDirection})\n\nEnjoy exploring your ideal bioclimatic living environment!`);
                }
            });
        });
    }

    renderComfortRadarChart(topDestinations) {
        const ctx = document.getElementById('comfort-analytics-radar-chart');
        if (!ctx || !window.Chart) return;

        const isDark = this.theme === 'dark';
        const textColor = isDark ? '#94a3b8' : '#475569';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.1)';

        const colors = [
            { border: '#10b981', bg: 'rgba(16, 185, 129, 0.25)' },
            { border: '#38bdf8', bg: 'rgba(56, 189, 248, 0.2)' },
            { border: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' }
        ];

        const labels = [
            'Thermal Stability (TSI)',
            'Humidity Balance',
            'Wind Breeze Comfort',
            'Air Purity (AQI)',
            'Sunshine Vitality',
            'Life Enjoyment (LEI)'
        ];

        const datasets = topDestinations.map((d, i) => {
            const c = colors[i % colors.length];
            return {
                label: `${d.name} (${d.matchScore}% Match)`,
                data: [
                    d.analytics ? d.analytics.thermalStability : 90,
                    d.analytics ? d.analytics.humidityBalance : 90,
                    d.analytics ? d.analytics.windComfort : 90,
                    d.analytics ? d.analytics.airPurity : 90,
                    d.analytics ? d.analytics.sunshineVitality : 90,
                    d.analytics ? d.analytics.lifeEnjoymentScore : 90
                ],
                borderColor: c.border,
                backgroundColor: c.bg,
                borderWidth: 2,
                pointBackgroundColor: c.border,
                pointRadius: 3
            };
        });

        if (this.comfortRadarChart) {
            this.comfortRadarChart.data.datasets = datasets;
            this.comfortRadarChart.update();
        } else {
            this.comfortRadarChart = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: labels,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            angleLines: { color: gridColor },
                            grid: { color: gridColor },
                            pointLabels: {
                                color: textColor,
                                font: { family: 'Inter', size: 10, weight: '600' }
                            },
                            ticks: {
                                backdropColor: 'transparent',
                                color: textColor,
                                min: 50,
                                max: 100,
                                stepSize: 10,
                                font: { size: 8 }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: textColor,
                                font: { family: 'Inter', size: 10, weight: '700' },
                                boxWidth: 12
                            }
                        }
                    }
                }
            });
        }
    }

    updateChartsData() {
        const hourlySim = this.simulationData.hourly;
        const hourlyWeather = this.climateData.hourly;

        if (this.diurnalTempChart) {
            this.diurnalTempChart.data.datasets[0].data = hourlyWeather.map(w => w.ambientTemp);
            this.diurnalTempChart.data.datasets[1].data = hourlySim.map(s => s.indoorTemp);
            this.diurnalTempChart.data.datasets[2].data = hourlySim.map(s => s.operativeTemp);
            this.diurnalTempChart.data.datasets[3].data = hourlySim.map(s => s.adaptiveUpper80);
            this.diurnalTempChart.data.datasets[4].data = hourlySim.map(s => s.adaptiveLower80);
            this.diurnalTempChart.update();
        }

        if (this.heatFluxChart) {
            this.heatFluxChart.data.datasets[0].data = hourlySim.map(s => s.heatFluxes.conduction);
            this.heatFluxChart.data.datasets[1].data = hourlySim.map(s => s.heatFluxes.solarGlazing);
            this.heatFluxChart.data.datasets[2].data = hourlySim.map(s => s.heatFluxes.ventilation);
            this.heatFluxChart.data.datasets[3].data = hourlySim.map(s => s.heatFluxes.ground);
            this.heatFluxChart.data.datasets[4].data = hourlySim.map(s => s.heatFluxes.internal);
            this.heatFluxChart.update();
        }

        if (this.pmvChart) {
            this.pmvChart.data.datasets[0].data = hourlySim.map(s => s.pmv);
            this.pmvChart.data.datasets[1].data = hourlySim.map(s => s.ach);
            this.pmvChart.update();
        }

        if (this.comparisonChart && this.optimizationResults) {
            this.comparisonChart.data.datasets[0].data = hourlySim.map(s => s.operativeTemp);
            this.comparisonChart.data.datasets[1].data = this.optimizationResults.optimizedSim.hourly.map(s => s.operativeTemp);
            this.comparisonChart.update();
        }
    }

    renderMaterialLayers() {
        const wallPhysics = calculateAssemblyPhysics(this.state.config.wallAssembly, false);
        const roofPhysics = calculateAssemblyPhysics(this.state.config.roofAssembly, true);

        this.dom.wallUVal.textContent = `${wallPhysics.uValue} W/m²·K`;
        this.dom.wallLagVal.textContent = `${wallPhysics.timeLagHours} hrs (f = ${wallPhysics.decrementFactor})`;

        this.dom.roofUVal.textContent = `${roofPhysics.uValue} W/m²·K`;
        this.dom.roofLagVal.textContent = `${roofPhysics.timeLagHours} hrs (f = ${roofPhysics.decrementFactor})`;

        // Render Wall Layers list
        this.dom.wallLayersList.innerHTML = this.state.config.wallAssembly.layers.map((layer, idx) => {
            const mat = MATERIALS[layer.materialId] || MATERIALS.cseb;
            return `
                <div class="layer-row">
                    <div class="layer-info">
                        <span class="layer-name">${mat.name}</span>
                        <span class="layer-meta">k: ${mat.k} W/m·K | ρ: ${mat.rho} kg/m³</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <input type="number" class="layer-thickness-input" value="${Math.round(layer.thickness * 1000)}" data-type="wall" data-index="${idx}">
                        <span style="font-size: 11px; color: var(--text-muted);">mm</span>
                    </div>
                </div>
            `;
        }).join('');

        // Render Roof Layers list
        this.dom.roofLayersList.innerHTML = this.state.config.roofAssembly.layers.map((layer, idx) => {
            const mat = MATERIALS[layer.materialId] || MATERIALS.thatched_straw;
            return `
                <div class="layer-row">
                    <div class="layer-info">
                        <span class="layer-name">${mat.name}</span>
                        <span class="layer-meta">k: ${mat.k} W/m·K | ρ: ${mat.rho} kg/m³</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <input type="number" class="layer-thickness-input" value="${Math.round(layer.thickness * 1000)}" data-type="roof" data-index="${idx}">
                        <span style="font-size: 11px; color: var(--text-muted);">mm</span>
                    </div>
                </div>
            `;
        }).join('');

        // Bind thickness input changes
        document.querySelectorAll('.layer-thickness-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const type = e.target.getAttribute('data-type');
                const idx = parseInt(e.target.getAttribute('data-index'), 10);
                const newThickness = Math.max(1, parseInt(e.target.value, 10)) / 1000;
                if (type === 'wall') {
                    this.state.config.wallAssembly.layers[idx].thickness = newThickness;
                } else {
                    this.state.config.roofAssembly.layers[idx].thickness = newThickness;
                }
                this.updateSimulation();
            });
        });
    }

    renderOptimizerView() {
        const recs = this.optimizationResults.recommendations;
        const optSim = this.optimizationResults.optimizedSim;
        const baseSummary = this.simulationData.summary;
        const optSummary = optSim.summary;

        if (this.dom.optimizerList) {
            if (recs.length === 0) {
                this.dom.optimizerList.innerHTML = `
                    <div style="text-align: center; padding: 30px; color: var(--accent-emerald);">
                        <h3>Optimal Bioclimatic Performance Achieved!</h3>
                        <p style="font-size: 13px; color: var(--text-secondary); margin-top: 6px;">The shelter satisfies all adaptive thermal comfort criteria for this climate zone.</p>
                    </div>
                `;
            } else {
                this.dom.optimizerList.innerHTML = recs.map(r => `
                    <div class="recommendation-card ${r.priority}">
                        <div class="rec-header">
                            <span class="rec-title">${r.title}</span>
                            <span class="rec-priority-badge ${r.priority}">${r.priority}</span>
                        </div>
                        <div class="rec-body">
                            <strong>Observed Limitation:</strong> ${r.problem}<br>
                            <strong>Passive Solution:</strong> ${r.solution}
                        </div>
                        <div class="rec-impact">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
                            ${r.impact}
                        </div>
                    </div>
                `).join('');
            }
        }

        if (this.dom.comparisonTableBody) {
            const dScore = optSummary.comfortScorePercent - baseSummary.comfortScorePercent;
            const dPeak = optSummary.maxIndoorTemp - baseSummary.maxIndoorTemp;
            const dDamping = optSummary.thermalDampingRatio - baseSummary.thermalDampingRatio;

            this.dom.comparisonTableBody.innerHTML = `
                <tr>
                    <td><strong>Comfort Score (%)</strong></td>
                    <td>${baseSummary.comfortScorePercent}%</td>
                    <td><strong>${optSummary.comfortScorePercent}%</strong></td>
                    <td class="${dScore >= 0 ? 'delta-badge-pos' : 'delta-badge-neg'}">${dScore >= 0 ? '+' : ''}${dScore}%</td>
                </tr>
                <tr>
                    <td><strong>Peak Indoor Temp (°C)</strong></td>
                    <td>${baseSummary.maxIndoorTemp}°C</td>
                    <td><strong>${optSummary.maxIndoorTemp}°C</strong></td>
                    <td class="${dPeak <= 0 ? 'delta-badge-pos' : 'delta-badge-neg'}">${dPeak <= 0 ? '' : '+'}${dPeak.toFixed(1)}°C</td>
                </tr>
                <tr>
                    <td><strong>Thermal Damping Ratio (%)</strong></td>
                    <td>${baseSummary.thermalDampingRatio}%</td>
                    <td><strong>${optSummary.thermalDampingRatio}%</strong></td>
                    <td class="${dDamping >= 0 ? 'delta-badge-pos' : 'delta-badge-neg'}">${dDamping >= 0 ? '+' : ''}${dDamping}%</td>
                </tr>
                <tr>
                    <td><strong>Wall U-Value (W/m²·K)</strong></td>
                    <td>${baseSummary.wallU}</td>
                    <td><strong>${optSummary.wallU}</strong></td>
                    <td>${(optSummary.wallU - baseSummary.wallU).toFixed(2)}</td>
                </tr>
                <tr>
                    <td><strong>Roof U-Value (W/m²·K)</strong></td>
                    <td>${baseSummary.roofU}</td>
                    <td><strong>${optSummary.roofU}</strong></td>
                    <td>${(optSummary.roofU - baseSummary.roofU).toFixed(2)}</td>
                </tr>
            `;
        }
    }

    switchTab(tabId) {
        if (!tabId) return;
        this.state.activeTab = tabId;

        // Update Tab Buttons
        if (this.dom.tabButtons) {
            this.dom.tabButtons.forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
            });
        }

        // Update Tab Panes
        if (this.dom.tabPanes) {
            this.dom.tabPanes.forEach(pane => {
                pane.classList.toggle('active', pane.id === tabId);
            });
        }

        // Re-render and resize specific active views
        if (tabId === 'tab-3d') {
            if (this.visualizer3D && typeof this.visualizer3D.onWindowResize === 'function') {
                setTimeout(() => this.visualizer3D.onWindowResize(), 50);
            }
        } else if (tabId === 'tab-world-map') {
            this.renderWorldMapTab();
        } else if (tabId === 'tab-psychro') {
            if (this.psychroChart && typeof this.psychroChart.render === 'function') {
                setTimeout(() => this.psychroChart.render(), 50);
            }
        } else if (tabId === 'tab-login') {
            this.renderLoginPage();
        } else if (tabId === 'tab-community') {
            this.renderCommunityShelters();
        } else if (tabId === 'tab-hazards') {
            this.renderHazardReports();
        } else if (tabId === 'tab-materials') {
            this.renderCustomMaterials();
        } else if (tabId === 'tab-sos-broadcast') {
            this.renderSOSDispatchLogs();
        }
    }

    initWorldMap() {
        try {
            if (!this.worldMapEngine) {
                this.worldMapEngine = new WorldMapEngine('interactive-world-map-leaflet', (station) => {
                    this.onSelectWorldStation(station);
                });
            }
        } catch (e) {
            console.warn('World map init fallback:', e);
        }
    }

    renderWorldMapTab() {
        if (!this.worldMapEngine) {
            this.initWorldMap();
        }
        if (this.worldMapEngine && this.worldMapEngine.map) {
            setTimeout(() => {
                this.worldMapEngine.map.invalidateSize();
            }, 80);
        }
    }

    onSelectWorldStation(station) {
        this.renderWorldMapTab();
    }

    applyWorldStationToShelter(station) {
        if (!station) return;

        this.state.zoneId = station.zoneId;
        this.dom.zoneSelect.value = station.zoneId;

        // Custom Diurnal parameters matching the global station telemetry
        this.state.customClimateParams = {
            tMax: station.tempC,
            tMin: Math.max(-10, station.tempC - (station.zoneId === 'hot_arid' ? 16 : 8)),
            solarPeak: station.solarGhi,
            rhMean: station.humidity
        };

        this.updateSimulation();
        this.renderWorldMapTab();
        alert(`Planetary Climate Applied!\n\nLocation: ${station.name}, ${station.country}\nSurface Temp: ${station.tempC}°C\nSolar GHI: ${station.solarGhi} W/m²\nRelative Humidity: ${station.humidity}%\n\nThe 3D Digital Twin and thermal energy solver have been synchronized to ${station.name}!`);
    }

    syncFormWithConfig() {
        const c = this.state.config;
        const d = this.dom;
        d.typologySelect.value = c.typology;
        d.ventModeSelect.value = c.ventMode;
        d.foundationSelect.value = c.foundationType;
        d.sliderLength.value = c.length;
        d.valLength.textContent = c.length;
        d.sliderWidth.value = c.width;
        d.valWidth.textContent = c.width;
        d.sliderHeight.value = c.height;
        d.valHeight.textContent = c.height;
        d.sliderPitch.value = c.roofPitch;
        d.valPitch.textContent = c.roofPitch;
        d.sliderWwr.value = c.wwr;
        d.valWwr.textContent = c.wwr;
        d.sliderOverhang.value = c.overhangDepth;
        d.valOverhang.textContent = c.overhangDepth;
        d.sliderOccupants.value = c.occupants;
        d.valOccupants.textContent = c.occupants;
    }
}

// Instantiate on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.bioShelterApp = new BioShelterApp();
    window.bioShelterApp.init();
});
