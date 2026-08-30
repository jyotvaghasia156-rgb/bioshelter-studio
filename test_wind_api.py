#!/usr/bin/env python3
"""
Test Live Wind Speed API Endpoints
"""
import urllib.request
import json

def test_wind_endpoints():
    print("Testing 1-Second Live Wind Speed API Endpoints...")

    # 1. Test GET by coordinates (Thar Desert)
    url1 = "http://localhost:8000/api/wind/live?lat=26.9157&lng=70.9083&name=Thar%20Desert"
    with urllib.request.urlopen(url1, timeout=5) as resp:
        assert resp.status == 200
        data = json.loads(resp.read().decode('utf-8'))
        assert data.get("success") is True
        assert "telemetry" in data
        assert "aerodynamicsAndBuilding" in data
        t = data["telemetry"]
        a = data["aerodynamicsAndBuilding"]
        print(f"[OK] GET /api/wind/live (Thar Desert): Speed={t['speedMps']} m/s ({t['speedKmh']} km/h), Beaufort={t['beaufortScale']} ({t['beaufortDescription']}), Dir={t['directionDeg']} deg ({t['cardinalDirection']})")
        print(f"[OK] Aerodynamics: Pressure={a['stagnationPressurePa']} Pa, Airflow={a['windcatcherAirflowM3h']} m3/h, Hc={a['convectiveCoefficientHc']} W/m2K")

    # 2. Test City Search
    url2 = "http://localhost:8000/api/wind/live?q=tokyo"
    with urllib.request.urlopen(url2, timeout=5) as resp:
        assert resp.status == 200
        data2 = json.loads(resp.read().decode('utf-8'))
        assert data2.get("success") is True
        print(f"[OK] GET /api/wind/live?q=tokyo: Location={data2['location']['name']}, Speed={data2['telemetry']['speedMps']} m/s")

    # 3. Test POST Endpoint
    req = urllib.request.Request(
        "http://localhost:8000/api/wind/live",
        data=json.dumps({"lat": 34.1526, "lng": 77.5771, "locationName": "Leh Ladakh"}).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=5) as resp:
        assert resp.status == 200
        data3 = json.loads(resp.read().decode('utf-8'))
        assert data3.get("success") is True
        print(f"[OK] POST /api/wind/live (Ladakh): Speed={data3['telemetry']['speedMps']} m/s, Gust={data3['telemetry']['gustMps']} m/s")

    print("\nALL LIVE WIND SPEED API TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_wind_endpoints()
