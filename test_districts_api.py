#!/usr/bin/env python3
"""
Comprehensive Test for District-Wise Live Temperature Telemetry API & Multi-District Search
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

    # 2. Test search query for "navsari"
    url2 = "http://localhost:8000/api/districts/live?q=navsari"
    with urllib.request.urlopen(url2, timeout=5) as resp:
        assert resp.status == 200
        data2 = json.loads(resp.read().decode('utf-8'))
        assert data2.get("success") is True
        assert len(data2["districts"]) >= 1
        d = data2["districts"][0]
        assert "Navsari" in d["name"]
        print(f"[OK] GET /api/districts/live?q=navsari: Found '{d['name']}', Temp={d['temperatureC']} C ({d['temperatureF']} F), FeelsLike={d['feelsLikeC']} C, Twb={d['wetBulbC']} C, Humidity={d['humidityPct']}%, Category={d['category']}")

    # 3. Test search query for alias "Bilimora" (Navsari sub-district)
    url3 = "http://localhost:8000/api/districts/live?q=bilimora"
    with urllib.request.urlopen(url3, timeout=5) as resp:
        assert resp.status == 200
        data3 = json.loads(resp.read().decode('utf-8'))
        assert data3.get("success") is True
        assert len(data3["districts"]) >= 1
        assert "Navsari" in data3["districts"][0]["name"]
        print(f"[OK] GET /api/districts/live?q=bilimora: Alias search correctly resolved to '{data3['districts'][0]['name']}'")

    # 4. Test search query for "tokyo" (Global District)
    url4 = "http://localhost:8000/api/districts/live?q=tokyo"
    with urllib.request.urlopen(url4, timeout=5) as resp:
        assert resp.status == 200
        data4 = json.loads(resp.read().decode('utf-8'))
        assert data4.get("success") is True
        assert len(data4["districts"]) >= 1
        assert "Tokyo" in data4["districts"][0]["name"]
        print(f"[OK] GET /api/districts/live?q=tokyo: Global search correctly returned '{data4['districts'][0]['name']}'")

    # 5. Test all regions combined
    url5 = "http://localhost:8000/api/districts/live?state=all"
    with urllib.request.urlopen(url5, timeout=5) as resp:
        assert resp.status == 200
        data5 = json.loads(resp.read().decode('utf-8'))
        assert data5.get("success") is True
        print(f"[OK] GET /api/districts/live?state=all: Found {len(data5['districts'])} total districts worldwide.")

    print("\nALL DISTRICT-WISE LIVE TEMPERATURE API TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_districts_endpoints()
