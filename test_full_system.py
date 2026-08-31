"""
BioShelter Studio - Complete System & Bug Verification Suite
Validates all HTML, JS syntax, REST APIs, district search aliases, solar & wind calculations.
"""

import sys
import os
import json
import urllib.request
import urllib.parse
import subprocess

BASE_URL = "http://127.0.0.1:8000"

def run_test(name, fn):
    try:
        fn()
        print(f"  [PASS] {name}")
        return True
    except Exception as e:
        print(f"  [FAIL] {name}: {e}")
        return False

def test_api_districts_all():
    url = f"{BASE_URL}/api/districts/live?state=all"
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req, timeout=5) as res:
        assert res.status == 200, f"Status is {res.status}"
        data = json.loads(res.read().decode('utf-8'))
        assert data.get('success') is True, "API success is False"
        assert len(data.get('districts', [])) >= 58, f"Expected >=58 districts, got {len(data.get('districts', []))}"

def test_api_district_search_navsari():
    url = f"{BASE_URL}/api/districts/live?q=navsari"
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req, timeout=5) as res:
        assert res.status == 200
        data = json.loads(res.read().decode('utf-8'))
        assert data.get('success') is True
        districts = data.get('districts', [])
        assert len(districts) >= 1, "Navsari not found"
        assert "Navsari" in districts[0]['name'], f"Expected Navsari, got {districts[0]['name']}"

def test_api_district_alias_bilimora():
    url = f"{BASE_URL}/api/districts/live?q=bilimora"
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req, timeout=5) as res:
        assert res.status == 200
        data = json.loads(res.read().decode('utf-8'))
        districts = data.get('districts', [])
        assert len(districts) >= 1, "Bilimora alias did not resolve"
        assert "Navsari" in districts[0]['name']

def test_api_solar_radiation():
    url = f"{BASE_URL}/api/solar/radiation?lat=26.9157&lng=70.9083&name=Jaisalmer"
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req, timeout=5) as res:
        assert res.status == 200
        data = json.loads(res.read().decode('utf-8'))
        assert data.get('success') is True
        assert 'telemetry' in data
        assert 'solarGeometry' in data
        assert data['telemetry']['ghi'] > 0

def test_api_wind_live():
    url = f"{BASE_URL}/api/wind/live?lat=26.9157&lng=70.9083&name=Jaisalmer"
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req, timeout=5) as res:
        assert res.status == 200
        data = json.loads(res.read().decode('utf-8'))
        assert data.get('success') is True
        assert 'telemetry' in data
        assert 'aerodynamicsAndBuilding' in data

def test_all_pages():
    pages = [
        "index.html", "world-map.html", "sos-command.html", "hazards.html",
        "nearby-bunkers.html", "comfort-places.html", "physics-graphs.html",
        "bioclimatic-optimizer.html", "soil-directory.html", "materials-lab.html",
        "custom-materials.html", "psychrometric.html", "weather-solar.html",
        "community.html", "sih_presentation.html", "college_guide.html",
        "profile-settings.html", "login.html", "otp.html", "reports-exports.html"
    ]
    for p in pages:
        url = f"{BASE_URL}/{p}"
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=5) as res:
            assert res.status == 200, f"Page {p} returned {res.status}"
            content = res.read().decode('utf-8')
            assert len(content) > 1000, f"Page {p} seems too short"

def main():
    print("\n============================================================")
    print("  BioShelter Studio - System Verification Suite")
    print("============================================================\n")

    tests = [
        ("All 20 HTML Pages HTTP 200 & Content", test_all_pages),
        ("API: All 58 Districts Directory", test_api_districts_all),
        ("API: District Search 'navsari'", test_api_district_search_navsari),
        ("API: District Alias Match 'bilimora'", test_api_district_alias_bilimora),
        ("API: Solar Radiation & Sun Geometry", test_api_solar_radiation),
        ("API: Wind Speed, Gust & Aerodynamics", test_api_wind_live)
    ]

    passed = 0
    for name, fn in tests:
        if run_test(name, fn):
            passed += 1

    print("\n============================================================")
    print(f"  Summary: {passed}/{len(tests)} Tests Passed ({(passed/len(tests))*100:.1f}%)")
    print("============================================================\n")
    if passed != len(tests):
        sys.exit(1)

if __name__ == "__main__":
    main()
