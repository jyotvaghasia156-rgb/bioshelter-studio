#!/usr/bin/env python3
"""
Test Location-Wise Solar Radiation API Endpoints
"""
import urllib.request
import json

def test_solar_endpoints():
    print("Testing Solar Radiation API Endpoints...")

    # 1. Test Thar Desert GET by coordinates
    url1 = "http://localhost:8000/api/solar/radiation?lat=26.9157&lng=70.9083&name=Thar%20Desert"
    with urllib.request.urlopen(url1, timeout=5) as resp:
        assert resp.status == 200
        data = json.loads(resp.read().decode('utf-8'))
        assert data.get("success") is True
        assert "telemetry" in data
        assert "solarGeometry" in data
        assert "energyAndArchitecture" in data
        assert "hourlyProfile" in data
        print(f"[OK] GET /api/solar/radiation (Thar Desert): GHI={data['telemetry']['ghi']} W/m2, DNI={data['telemetry']['dni']} W/m2, UV={data['telemetry']['uvIndex']}")

    # 2. Test City Search
    url2 = "http://localhost:8000/api/solar/radiation?q=cairo"
    with urllib.request.urlopen(url2, timeout=5) as resp:
        assert resp.status == 200
        data2 = json.loads(resp.read().decode('utf-8'))
        assert data2.get("success") is True
        print(f"[OK] GET /api/solar/radiation?q=cairo: Location={data2['location']['name']}, GHI={data2['telemetry']['ghi']} W/m2")

    # 3. Test Solar Stations
    url3 = "http://localhost:8000/api/solar/stations"
    with urllib.request.urlopen(url3, timeout=5) as resp:
        assert resp.status == 200
        data3 = json.loads(resp.read().decode('utf-8'))
        assert data3.get("success") is True
        assert len(data3.get("stations", [])) >= 5
        print(f"[OK] GET /api/solar/stations: Found {len(data3['stations'])} global observatory stations.")

    # 4. Test POST endpoint
    req = urllib.request.Request(
        "http://localhost:8000/api/solar/radiation",
        data=json.dumps({"lat": 36.4614, "lng": -116.8656, "locationName": "Death Valley"}).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=5) as resp:
        assert resp.status == 200
        data4 = json.loads(resp.read().decode('utf-8'))
        assert data4.get("success") is True
        print(f"[OK] POST /api/solar/radiation (Death Valley): GHI={data4['telemetry']['ghi']} W/m2, DNI={data4['telemetry']['dni']} W/m2")

    print("\nALL SOLAR RADIATION API TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_solar_endpoints()
