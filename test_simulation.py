#!/usr/bin/env python3
"""
Unit and Validation Tests for BioShelter Studio Numerical Algorithms
"""

import math

def calculate_fanger_pmv(t_air, t_mrt, v_air, rh, met=1.1, clo=0.5):
    M = met * 58.15
    W = 0
    Icl = 0.155 * clo
    
    p_vapor = (rh / 100.0) * 10.0 * math.exp(16.6536 - 4030.183 / (t_air + 235.0))
    f_cl = (1.0 + 1.29 * Icl) if (Icl <= 0.078) else (1.05 + 0.645 * Icl)
    
    t_cl = t_air + (35.5 - t_air) / (3.5 * (Icl + 0.1))
    hcf = 12.1 * math.sqrt(max(0.01, v_air))
    
    for _ in range(150):
        hc_natural = 2.38 * math.pow(abs(t_cl - t_air), 0.25)
        hc = max(hcf, hc_natural)
        rad_term = 3.96e-8 * f_cl * (math.pow(max(0.0, t_cl + 273.15), 4) - math.pow(max(0.0, t_mrt + 273.15), 4))
        conv_term = f_cl * hc * (t_cl - t_air)
        t_cl_target = 35.7 - 0.028 * (M - W) - Icl * (rad_term + conv_term)
        
        t_cl_new = t_cl + 0.25 * (t_cl_target - t_cl)
        if abs(t_cl_new - t_cl) < 0.0001:
            break
        t_cl = t_cl_new
        
    hc_natural = 2.38 * math.pow(abs(t_cl - t_air), 0.25)
    hc = max(hcf, hc_natural)
    
    hl1 = 3.05 * 0.001 * (5733.0 - 6.99 * (M - W) - p_vapor)
    hl2 = (0.42 * (M - W - 58.15)) if (M - W > 58.15) else 0.0
    hl3 = 1.7e-5 * M * (5867.0 - p_vapor)
    hl4 = 0.0014 * M * (34.0 - t_air)
    hl5 = 3.96e-8 * f_cl * (math.pow(max(0.0, t_cl + 273.15), 4) - math.pow(max(0.0, t_mrt + 273.15), 4))
    hl6 = f_cl * hc * (t_cl - t_air)
    
    thermal_load = (M - W) - (hl1 + hl2 + hl3 + hl4 + hl5 + hl6)
    pmv = (0.303 * math.exp(-0.036 * M) + 0.028) * thermal_load
    clamped_pmv = max(-3.0, min(3.0, pmv))
    ppd = 100.0 - 95.0 * math.exp(-0.03353 * math.pow(clamped_pmv, 4) - 0.2179 * math.pow(clamped_pmv, 2))
    
    return clamped_pmv, ppd

def test_pmv_neutral_comfort():
    pmv, ppd = calculate_fanger_pmv(25.5, 25.5, 0.1, 50.0, 1.1, 0.5)
    print(f"Comfort Test: PMV = {pmv:.2f}, PPD = {ppd:.1f}%")
    assert abs(pmv) <= 0.5, f"Expected neutral comfort PMV (|PMV| <= 0.5), got {pmv}"
    assert ppd <= 10.0, f"Expected low PPD dissatisfaction (<= 10%), got {ppd}"

def test_pmv_hot_condition():
    pmv, ppd = calculate_fanger_pmv(38.0, 42.0, 0.1, 40.0, 1.1, 0.5)
    print(f"Hot Extreme Test: PMV = {pmv:.2f}, PPD = {ppd:.1f}%")
    assert pmv >= 2.5, f"Expected high PMV in extreme heat, got {pmv}"
    assert ppd >= 80.0, f"Expected high dissatisfaction, got {ppd}"

def test_thermal_lag_analytical():
    # Rammed Earth Wall 300mm: rho=2100, cp=1050, k=1.25
    thickness = 0.300
    alpha = 1.25 / (2100.0 * 1050.0) # m²/s
    time_lag = (0.5 * thickness * math.sqrt(86400.0 / (math.pi * alpha))) / 3600.0
    decrement = math.exp(-0.25 * time_lag)
    print(f"Rammed Earth (300mm Analytical): Time Lag = {time_lag:.2f} hrs, Decrement Factor = {decrement:.2f}")
    assert 8.0 <= time_lag <= 10.5, f"Time lag out of realistic range: {time_lag}"
    assert 0.05 <= decrement <= 0.20, f"Decrement factor out of realistic range: {decrement}"

if __name__ == '__main__':
    print("Running BioShelter validation test suite...")
    test_pmv_neutral_comfort()
    test_pmv_hot_condition()
    test_thermal_lag_analytical()
    print("All validation tests passed successfully!")
