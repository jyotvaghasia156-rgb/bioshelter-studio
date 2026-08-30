import sys
import traceback
from server import compute_solar_radiation_profile

try:
    print("Testing direct compute_solar_radiation_profile...")
    res = compute_solar_radiation_profile(26.9157, 70.9083, "Thar Desert")
    print("Success!")
    print("GHI:", res["telemetry"]["ghi"])
    print("DNI:", res["telemetry"]["dni"])
    print("Hourly count:", len(res["hourlyProfile"]))
except Exception as e:
    traceback.print_exc()
