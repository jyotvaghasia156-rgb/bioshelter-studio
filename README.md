# BioShelter Studio 🌍🏛️

**Area-Specific Thermal Comfort, Soil Geothermics, Community Shelters & Disaster SOS Broadcast Suite**

BioShelter Studio is an advanced web-based modeling, community resilience, and emergency response platform designed for architectural physicists, civil engineers, and disaster-relief responders. It enables parametric design of climate-resilient shelters optimized for human thermal comfort (ASHRAE 55 / ISO 7730) across 5 global climate zones with real-time geotechnical soil physics, weather intelligence, crowdsourced community shelters, citizen hazard reporting, and automated Emergency Disaster SOS Broadcasting.

---

## 🌟 Key Features

1. **Interactive 3D Digital Twin (Three.js)**
   - Parametric geometries: Arid Wind-Towers (*Badgir*), Earthen Vaults, Tropical Stilt Shelters, Alpine Solar Trombe Walls, and Gable Shelters.
   - Dynamic Celestial Sun-Path Arc tracking altitude and azimuth with soft PCF shadows across a 24-hour diurnal cycle.
   - Surface Thermal Gradient Heatmaps ($15^\circ\text{C}$ Cool Cyan $\to 25^\circ\text{C}$ Emerald $\to 45^\circ\text{C}+$ Crimson).
   - Animated Airflow Streamline Dynamics, Interior Cutaway views, and dynamic Dark/Light theme adaptations.

2. **Adaptive Dark & Light Theme Mode Engine**
   - High-contrast Cybernetic Glassmorphic Dark Mode (`#070b14`).
   - Crisp Architectural Luxury Light Mode (`#f1f5f9`).
   - Seamless one-click toggle with persistent localStorage theme state, real-time Three.js scene fog/background updates, and Chart.js color palette synchronization.

3. **Multi-Provider Authentication & Verification Engine**
   - **Google Account SSO**: Simulated OAuth 2.0 token handshake with avatar and user metadata.
   - **Microsoft Azure AD SSO**: Enterprise identity authentication for civil and relief organizations.
   - **Mobile Phone OTP Verification**: 6-digit SMS verification code dispatch, on-screen simulated SMS notification toast with 1-click auto-fill, and 60-second resend countdown timer.
   - **Account Certification Token Validator**: 6-digit credential verification for engineering licenses and verified badges (`Verified Phone ✓`, `Verified Identity ✓`).

4. **Community Shelter & Refuge Registry (User Data Entry)**
   - Public repository where registered and guest users can publish custom-designed shelters (name, zone, typology, capacity, envelope materials, emergency phone, coordinates).
   - Interactive search and filter engine with upvoting and **1-Click "Load in 3D Twin"** blueprint importer.

5. **Citizen Disaster & Hazard Incident Live Feed**
   - Real-time crowdsourced reporting tool for extreme climate emergencies (50°C Heatwaves, Flash Floods, Wildfire fronts, Haboob Sandstorms, Structural Collapses).
   - Severity level badges (Critical, High, Moderate) with automatic SOS broadcast triggering on critical reports.

6. **Emergency Disaster SOS Broadcast Net & Siren Synthesizer**
   - **Web Audio API Emergency Siren**: Synthesizes authentic dual-tone pulsating frequency alert siren without requiring external sound files (with Mute/Unmute controls).
   - **Flashing Top Warning Banner**: High-visibility glowing alert banner displaying disaster epicenter, evacuation instructions, and direct navigation to the nearest verified refuge.
   - **Multi-Channel SMS Broadcast Dispatcher**: Simulates instantaneous SMS transmission to all registered user phone numbers with delivery confirmation IDs and evacuation routes.
   - **One-Tap Panic SOS Distress Button**: Floating and header triggers for immediate location broadcast.

7. **Custom Biophysical Material Lab**
   - Custom material builder allowing users to define thermal conductivity ($k$), density ($\rho$), specific heat ($c_p$), and embodied carbon.
   - Real-time thermal lag and decrement factor calculation with dynamic injection into wall and roof envelope builders.

8. **Geotechnical Soil Physics & Earth-Sheltering (Kusuda Solver)**
   - 5 regional soil profiles: Desert Sand, Black Cotton Clay, Alluvial Loam, Laterite Bedrock, and Alpine Permafrost Scree.
   - Interactive Earth Berming depth slider ($0.5\text{m} - 6.0\text{m}$) recalculating Kusuda harmonic attenuation and year-round passive geothermal cooling benefit ($\Delta T \approx 16^\circ\text{C}$).

9. **Nearby Emergency Bunkers & Refuges Radar**
   - Area-specific catalog of subterranean blast shelters, cyclone havens, and geothermal survival facilities with blast overpressure ratings (PSI / bar).

10. **Interactive Global Climate & Surface Temperature World Map (`tab-world-map`)**
    - Planetary thermal radar with vector continent boundaries and real-time thermodynamic thermal belts.
    - Global telemetry stations (Thar Desert, Dubai, Sahara, Phoenix, Sundarbans, Amazon, Singapore, Delhi, London, Tokyo, Leh Ladakh, Swiss Alps, Sydney, Nairobi).
    - Color-coded thermal spectrum ($ \le 10^\circ\text{C}$ Cool Indigo $\to 25^\circ\text{C}$ Emerald $\to 48.6^\circ\text{C}+$ Catastrophic Heatwave Crimson).
    - **1-Click "Apply Selected Region to Shelter Studio"**: Instantly synchronizes local temperatures, solar radiation (GHI), and humidity from any worldwide location into the 3D twin and thermal energy solver!

11. **Bioclimatic Diagnostic Optimizer & Engineering Dossier Exporters**
    - Printable formal Engineering Dossier (PDF-ready conforming to ASHRAE 55 and ISO 7730).
    - Executable zero-dependency standalone Python numerical simulation script (`simulate_shelter.py`).
    - CAD / BIM GeoJSON model exporter.

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/jyotvaghasia156-rgb/bioshelter-studio.git
cd bioshelter-studio
```

### 2. Run Locally
- Using Python:
```bash
python serve.py
```
- Or using PowerShell:
```powershell
powershell -ExecutionPolicy Bypass -File serve.ps1
```
Then open `http://localhost:8000` in your web browser.

---

## 📁 Repository Structure

```
bioshelter-studio/
├── index.html                  # Main single-page web app with multi-tabs & modals
├── css/
│   ├── style.css               # Theme tokens (Dark/Light), layout, glassmorphism UI
│   └── components.css          # SOS banners, SMS toast, HUD gauges, Auth modals, Community cards
├── js/
│   ├── app.js                  # Main UI state orchestrator & event bus
│   ├── authEngine.js           # Google, Microsoft, Phone OTP 6-digit & Account verification
│   ├── sosEngine.js            # Web Audio siren synthesizer, SOS disaster broadcaster & SMS dispatcher
│   ├── userDataStore.js        # Reactive localStorage store for user shelters, hazards & materials
│   ├── climateEngine.js        # Diurnal weather & solar radiation math
│   ├── materialDatabase.js     # 35+ materials library & composite U-values
│   ├── thermalSolver.js        # Multi-node energy solver & PMV/Adaptive comfort
│   ├── threeVisualizer.js      # 3D Three.js Digital Twin, heatmaps & theme adapter
│   ├── psychrometricChart.js   # Canvas Givoni bioclimatic chart & theme adapter
│   ├── recommendationEngine.js # Diagnostic passive strategy optimizer
│   ├── exporter.js             # PDF dossier, Python script & BIM JSON exporter
│   ├── soilEngine.js           # Geotechnical soil physics & Kusuda depth solver
│   ├── weatherEngine.js        # Wet-bulb, VPD, solar decomposition & wind
│   └── bunkerDatabase.js       # Emergency shelters & nearby bunkers catalog
├── test_simulation.py          # Validation unit test suite
├── serve.py                    # Python HTTP server
├── serve.ps1                   # PowerShell HTTP server
└── README.md                   # Project documentation
```
