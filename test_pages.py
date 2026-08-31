import urllib.request
import json
import sys

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

BASE_URL = "http://localhost:8000"

PAGES = [
    "index.html",
    "world-map.html",
    "sos-command.html",
    "hazards.html",
    "nearby-bunkers.html",
    "comfort-places.html",
    "physics-graphs.html",
    "bioclimatic-optimizer.html",
    "soil-directory.html",
    "materials-lab.html",
    "custom-materials.html",
    "psychrometric.html",
    "weather-solar.html",
    "community.html",
    "sih_presentation.html",
    "college_guide.html",
    "profile-settings.html",
    "login.html",
    "otp.html",
    "reports-exports.html"
]

SCRIPTS = [
    "js/app.js",
    "js/state.js",
    "js/three-viewport.js",
    "js/simulation-engine.js",
    "js/blueprint-renderer.js",
    "js/ecosystem-data.js",
    "js/export-manager.js",
    "js/worldMapEngine.js",
    "js/sosEngine.js",
    "js/soilEngine.js",
    "js/climateEngine.js",
    "js/weatherEngine.js",
    "js/bunkerDatabase.js",
    "js/comfortMatcherEngine.js",
    "js/authEngine.js",
    "js/userDataStore.js",
    "js/apiClient.js",
    "js/psychrometricChart.js",
    "js/materialDatabase.js",
    "js/recommendationEngine.js",
    "js/thermalSolver.js",
    "js/shelterBlueprintEngine.js",
    "js/themeManager.js",
    "styles/main.css",
    "css/style.css",
    "css/components.css"
]

ENDPOINTS = [
    ("/api/health", "GET"),
    ("/api/shelters", "GET"),
    ("/api/hazards", "GET"),
    ("/api/materials", "GET"),
    ("/api/projects", "GET"),
    ("/api/users", "GET"),
    ("/api/comfort/destinations", "GET"),
    ("/api/weather/stations", "GET"),
    ("/api/sos/broadcasts", "GET"),
]

print("=" * 60)
print("  BioShelter Studio - Comprehensive Verification Suite")
print("=" * 60)

passed = 0
failed = 0

print("\n[1] Verifying All 20 HTML Pages...", flush=True)
for page in PAGES:
    url = f"{BASE_URL}/{page}"
    try:
        with urllib.request.urlopen(url, timeout=5) as req:
            content = req.read().decode('utf-8', errors='ignore')
            if req.status == 200 and len(content) > 500:
                print(f"  [OK] {page:<28} (HTTP 200, {len(content):,} bytes)", flush=True)
                passed += 1
            else:
                print(f"  [FAIL] {page:<28} (Status: {req.status}, Length: {len(content)})", flush=True)
                failed += 1
    except Exception as e:
        print(f"  [FAIL] {page:<28} (Error: {e})", flush=True)
        failed += 1

print("\n[2] Verifying All 25 JS & CSS Asset Modules...", flush=True)
for script in SCRIPTS:
    url = f"{BASE_URL}/{script}"
    try:
        with urllib.request.urlopen(url, timeout=5) as req:
            content = req.read()
            if req.status == 200 and len(content) > 100:
                print(f"  [OK] {script:<30} (HTTP 200, {len(content):,} bytes)", flush=True)
                passed += 1
            else:
                print(f"  [FAIL] {script:<30} (Status: {req.status})", flush=True)
                failed += 1
    except Exception as e:
        print(f"  [FAIL] {script:<30} (Error: {e})", flush=True)
        failed += 1

print("\n[3] Verifying Backend REST API Endpoints...", flush=True)
for endpoint, method in ENDPOINTS:
    url = f"{BASE_URL}{endpoint}"
    try:
        with urllib.request.urlopen(url, timeout=5) as req:
            data = json.loads(req.read().decode('utf-8'))
            if req.status == 200 and data.get("success", True):
                print(f"  [OK] {endpoint:<28} ({method} HTTP 200 - OK)", flush=True)
                passed += 1
            else:
                print(f"  [FAIL] {endpoint:<28} (Response: {data})", flush=True)
                failed += 1
    except Exception as e:
        print(f"  [FAIL] {endpoint:<28} (Error: {e})", flush=True)
        failed += 1

print("\n" + "=" * 60, flush=True)
print(f"  Verification Results: {passed} PASSED, {failed} FAILED", flush=True)
print("=" * 60, flush=True)

if failed > 0:
    sys.exit(1)
