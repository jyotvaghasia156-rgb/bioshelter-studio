#!/usr/bin/env python3
"""
Test District-Wise Live Temperature Telemetry API Endpoints
"""
import urllib.request
import json

def test_districts_endpoints():
    print("Testing District-Wise Live Temperature API Endpoints...")

    # 1. Test GET all Gujarat districts
    url1 = "http://localhost:8000/api/districts/live?state=gujarat"
    with urllib.request.urlopen(url1, timeout=5) as resp:
        assert resp.status == 200
        data = json.loads(resp.read().decode('utf-8'))
        assert data.get("success") is True
        assert "districts" in data
        assert "statistics" in data
        districts = data["districts"]
        stats = data["statistics"]
        assert len(districts) == 33, f"Expected 33 Gujarat districts, got {len(districts)}"
        print(f"[OK] GET /api/districts/live?state=gujarat: Found {len(districts)} districts.")
        print(f"     Hottest: {stats['hottestDistrict']} ({stats['hottestTempC']} C)")
        print(f"     Coolest: {stats['coolestDistrict']} ({stats['coolestTempC']} C)")
        print(f"     Average: {stats['averageTempC']} C")
        print(f"     Heatwave Alerts: {stats['heatwaveAlertCount']}")

    # 2. Test search query (e.g. "Ahmedabad")
    url2 = "http://localhost:8000/api/districts/live?q=ahmedabad"
    with urllib.request.urlopen(url2, timeout=5) as resp:
        assert resp.status == 200
        data2 = json.loads(resp.read().decode('utf-8'))
        assert data2.get("success") is True
        d = data2["districts"][0]
        assert "Ahmedabad" in d["name"]
        print(f"[OK] GET /api/districts/live?q=ahmedabad: Temp={d['temperatureC']} C ({d['temperatureF']} F), FeelsLike={d['feelsLikeC']} C, Twb={d['wetBulbC']} C, Humidity={d['humidityPct']}%, Category={d['category']}")

    # 3. Test POST Endpoint with Indian/Global districts
    req = urllib.request.Request(
        "http://localhost:8000/api/districts/live",
        data=json.dumps({"state": "india", "sort": "temp_desc"}).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=5) as resp:
        assert resp.status == 200
        data3 = json.loads(resp.read().decode('utf-8'))
        assert data3.get("success") is True
        print(f"[OK] POST /api/districts/live (India Metros): Found {len(data3['districts'])} districts.")

    print("\nALL DISTRICT-WISE LIVE TEMPERATURE API TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_districts_endpoints()
