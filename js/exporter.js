/**
 * BioShelter Studio - Engineering Report Generator & Python Code Exporter
 * Generates comprehensive printable technical calculation dossiers and standalone Python simulation scripts.
 */

export function generatePythonSimulationScript(config, climateData, simulationData) {
    const zone = climateData.zone;
    const defaults = climateData.params;

    return `#!/usr/bin/env python3
"""
BioShelter Studio - Numerical Thermal Simulation Script
Area-Specific Thermal Comfort & Shelter Energy Balance Solver
Generated for: ${zone.name} (${zone.region})
Standards: ASHRAE 55-2023 / ISO 7730 / IMAC
"""

import math
import json

# --- 1. CLIMATE & WEATHER INPUTS ---
CLIMATE_ZONE = "${zone.name}"
LATITUDE = ${climateData.params.latitude || zone.latitude}
T_MAX = ${defaults.tMax}  # deg C
T_MIN = ${defaults.tMin}  # deg C
RH_DAY = ${defaults.rhDay}  # %
RH_NIGHT = ${defaults.rhNight}  # %
GHI_PEAK = ${defaults.ghiPeak}  # W/m2
WIND_AVG = ${defaults.windSpeedAvg}  # m/s
GROUND_TEMP = ${defaults.groundTempAvg}  # deg C

# --- 2. SHELTER GEOMETRY ---
LENGTH = ${config.length || 6.0}  # m (East-West)
WIDTH = ${config.width || 4.0}   # m (North-South)
HEIGHT = ${config.height || 3.0}  # m (Eaves)
ROOF_PITCH = ${config.roofPitch || 20}  # deg
WWR = ${(Number(config.wwr || 15)) / 100}  # Window-to-wall ratio
OVERHANG = ${config.overhangDepth || 0.4}  # m
OCCUPANTS = ${config.occupants || 3}

# Envelope Thermophysical Properties
WALL_U = ${simulationData.summary.wallU}  # W/m2.K
ROOF_U = ${simulationData.summary.roofU}  # W/m2.K
WALL_TIME_LAG = ${simulationData.summary.wallTimeLag}  # Hours
ROOF_TIME_LAG = ${simulationData.summary.roofTimeLag}  # Hours
WALL_DECREMENT = ${(simulationData.summary.wallTimeLag > 6) ? 0.35 : 0.75}

def generate_diurnal_weather():
    hours = []
    t_mean = (T_MAX + T_MIN) / 2.0
    t_amp = (T_MAX - T_MIN) / 2.0
    
    for h in range(24):
        if 5 <= h <= 14:
            phi = ((h - 5) / 9.0) * math.pi - math.pi / 2.0
            t_amb = t_mean + t_amp * math.sin(phi)
        elif h > 14:
            phi = ((h - 14) / 15.0) * math.pi
            t_amb = T_MIN + (T_MAX - T_MIN) * 0.5 * (1 + math.cos(phi * 0.82))
        else:
            phi = ((h + 10) / 15.0) * math.pi
            t_amb = T_MIN + (T_MAX - T_MIN) * 0.5 * (1 + math.cos(phi * 0.82))
            
        rh = max(10, min(98, RH_DAY + (RH_NIGHT - RH_DAY) * (1 - (t_amb - T_MIN)/max(0.1, (T_MAX - T_MIN)))))
        
        ghi = 0.0
        sun_elev = 0.0
        if 6 <= h <= 18:
            sol_ang = ((h - 6) / 12.0) * math.pi
            ghi = max(0.0, GHI_PEAK * math.sin(sol_ang))
            sun_elev = max(0.0, math.sin(sol_ang) * (90 - abs(LATITUDE - 15)))
            
        wind = max(0.5, WIND_AVG * (0.85 + 0.35 * math.sin(((h - 9) / 24.0) * 2 * math.pi)))
        
        hours.append({
            'hour': h,
            'ambient_temp': round(t_amb, 2),
            'rh': round(rh, 1),
            'ghi': round(ghi, 1),
            'sun_elevation': round(sun_elev, 1),
            'wind_speed': round(wind, 2)
        })
    return hours

def solve_transient_thermal():
    weather = generate_diurnal_weather()
    floor_area = LENGTH * WIDTH
    wall_area = 2 * (LENGTH * HEIGHT + WIDTH * HEIGHT)
    win_area = wall_area * WWR
    net_wall_area = max(0, wall_area - win_area)
    roof_area = floor_area / math.cos(math.radians(ROOF_PITCH))
    volume = floor_area * HEIGHT
    
    # Effective heat capacity (J/K)
    c_eff = volume * 1.2 * 1005 + (wall_area * 180000) + (floor_area * 80000)
    
    dt = 3600.0
    t_in = weather[0]['ambient_temp']
    
    results = []
    for cycle in range(3):
        results = []
        for h in range(24):
            w = weather[h]
            t_amb = w['ambient_temp']
            ghi = w['ghi']
            wind = w['wind_speed']
            
            t_sol_roof = t_amb + (0.45 * ghi - 5.0) / 17.0
            t_sol_wall = t_amb + (0.50 * (ghi * 0.45) - 3.0) / 17.0
            
            q_walls = WALL_U * net_wall_area * (t_sol_wall * WALL_DECREMENT + t_amb * (1 - WALL_DECREMENT) - t_in)
            q_roof = ROOF_U * roof_area * (t_sol_roof * 0.4 + t_amb * 0.6 - t_in)
            
            q_solar_win = win_area * 0.65 * (ghi * 0.35) * (1.0 - min(0.85, OVERHANG * 0.8))
            q_glaze_cond = 3.2 * win_area * (t_amb - t_in)
            
            ach = 4.5 if (t_amb < t_in) else 0.5
            m_dot_air = (ach * volume * 1.2) / 3600.0
            q_vent = m_dot_air * 1005 * (t_amb - t_in)
            
            q_ground = 0.45 * floor_area * (GROUND_TEMP - t_in)
            q_internal = OCCUPANTS * 75.0 + 30.0
            
            q_net = q_walls + q_roof + q_solar_win + q_glaze_cond + q_vent + q_ground + q_internal
            t_in += (q_net / c_eff) * dt
            
            t_mrt = 0.65 * t_in + 0.35 * t_sol_wall
            t_op = (t_in + t_mrt) / 2.0
            
            results.append({
                'hour': h,
                'ambient_temp': t_amb,
                'indoor_temp': round(t_in, 2),
                'operative_temp': round(t_op, 2),
                'q_net_watts': round(q_net, 1)
            })
            
    return results

if __name__ == '__main__':
    print('=' * 60)
    print(f'BioShelter Simulation: {CLIMATE_ZONE}')
    print('=' * 60)
    res = solve_transient_thermal()
    print('Hour | Ambient (C) | Indoor (C) | Operative (C)')
    print('-' * 60)
    for r in res:
        print(f"{r['hour']:02d}:00 | {r['ambient_temp']:11.1f} | {r['indoor_temp']:10.1f} | {r['operative_temp']:13.1f}")
    print('=' * 60)
`;
}

export function openPrintableEngineeringReport(config, climateData, simulationData, recommendations) {
    const win = window.open('', '_blank');
    if (!win) {
        alert('Please allow popups to open the Printable Engineering Report.');
        return;
    }

    const zone = climateData.zone;
    const summary = simulationData.summary;
    const hourly = simulationData.hourly;

    const reportHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>BioShelter Thermal Engineering Dossier - ${zone.name}</title>
    <style>
        @page { size: A4; margin: 18mm; }
        body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1e293b; line-height: 1.5; font-size: 13px; margin: 0; padding: 24px; background: #ffffff; }
        .header-bar { border-bottom: 3px solid #0284c7; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
        .header-title { font-size: 22px; font-weight: bold; color: #0f172a; margin: 0; }
        .header-subtitle { color: #64748b; font-size: 13px; margin: 4px 0 0 0; }
        .badge { background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 4px; font-weight: bold; font-size: 12px; display: inline-block; }
        h2 { font-size: 15px; color: #0369a1; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-top: 24px; text-transform: uppercase; letter-spacing: 0.5px; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
        .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 16px; }
        .card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 6px; }
        .card-num { font-size: 20px; font-weight: bold; color: #0284c7; }
        .card-label { font-size: 11px; color: #64748b; text-transform: uppercase; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
        th, td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; }
        th { background: #f1f5f9; color: #334155; font-weight: 600; }
        tr:nth-child(even) { background: #f8fafc; }
        .rec-box { background: #f0fdf4; border-left: 4px solid #16a34a; padding: 10px 14px; margin-bottom: 10px; border-radius: 0 4px 4px 0; }
        .formula-box { background: #1e293b; color: #f8fafc; font-family: monospace; padding: 12px; border-radius: 6px; font-size: 11px; line-height: 1.6; margin: 12px 0; }
        @media print {
            .no-print { display: none; }
            body { padding: 0; }
        }
    </style>
</head>
<body>
    <div class="no-print" style="margin-bottom: 16px; text-align: right;">
        <button onclick="window.print()" style="background: #0284c7; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer;">Print / Save as PDF</button>
    </div>

    <div class="header-bar">
        <div>
            <div class="header-title">BioShelter Studio &bull; Thermal Comfort Engineering Report</div>
            <div class="header-subtitle">Software-Based Model Development for Area-Specific Sustainable Shelter Design</div>
        </div>
        <div>
            <span class="badge">${zone.name}</span>
        </div>
    </div>

    <div class="grid-4">
        <div class="card">
            <div class="card-label">Comfort Score</div>
            <div class="card-num">${summary.comfortScorePercent}%</div>
        </div>
        <div class="card">
            <div class="card-label">Thermal Damping</div>
            <div class="card-num">${summary.thermalDampingRatio}%</div>
        </div>
        <div class="card">
            <div class="card-label">Peak Indoor Temp</div>
            <div class="card-num">${summary.maxIndoorTemp}&deg;C</div>
        </div>
        <div class="card">
            <div class="card-label">Wall Time Lag</div>
            <div class="card-num">${summary.wallTimeLag} hrs</div>
        </div>
    </div>

    <h2>1. Climate & Design Parameters</h2>
    <div class="grid-2">
        <div class="card">
            <strong>Target Bioclimatic Region:</strong> ${zone.region}<br>
            <strong>Latitude:</strong> ${climateData.params.latitude || zone.latitude}&deg; N<br>
            <strong>Diurnal Ambient Swing:</strong> ${climateData.params.tMin}&deg;C to ${climateData.params.tMax}&deg;C<br>
            <strong>Relative Humidity:</strong> ${climateData.params.rhDay}% (Day) / ${climateData.params.rhNight}% (Night)
        </div>
        <div class="card">
            <strong>Shelter Dimensions:</strong> ${config.length}m (L) &times; ${config.width}m (W) &times; ${config.height}m (H)<br>
            <strong>Roof Form:</strong> ${config.typology.toUpperCase()} (Pitch: ${config.roofPitch}&deg;)<br>
            <strong>Window-to-Wall Ratio (WWR):</strong> ${config.wwr}% with ${config.overhangDepth}m Overhang<br>
            <strong>Ventilation Strategy:</strong> ${config.ventMode.replace('_', ' ').toUpperCase()}
        </div>
    </div>

    <h2>2. Envelope Thermophysical Specifications</h2>
    <table>
        <thead>
            <tr>
                <th>Component</th>
                <th>Assembly Description</th>
                <th>U-Value (W/m&sup2;&middot;K)</th>
                <th>Time Lag (hrs)</th>
                <th>Solar Absorptance (&alpha;)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Exterior Walls</strong></td>
                <td>${config.wallAssembly ? config.wallAssembly.name : 'CSEB Interlocking Earth Brick (230mm)'}</td>
                <td>${summary.wallU}</td>
                <td>${summary.wallTimeLag}</td>
                <td>${config.wallAssembly ? config.wallAssembly.surfaceAbsorptance : 0.55}</td>
            </tr>
            <tr>
                <td><strong>Roof Assembly</strong></td>
                <td>${config.roofAssembly ? config.roofAssembly.name : 'Bio-Thatch on Bamboo Lattice (150mm)'}</td>
                <td>${summary.roofU}</td>
                <td>${summary.roofTimeLag}</td>
                <td>${config.roofAssembly ? config.roofAssembly.surfaceAbsorptance : 0.45}</td>
            </tr>
        </tbody>
    </table>

    <h2>3. Numerical Energy Balance Formulation</h2>
    <div class="formula-box">
Dynamic 1D Multi-Node Heat Storage Differential Equation:
  C_effective &middot; (dT_indoor / dt) = Q_envelope(t) + Q_glazing_solar(t) + Q_glazing_cond(t) + Q_vent(t) + Q_ground(t) + Q_internal

Where Harmonic Envelope Conductive Heat Flux with Decrement Factor (f) and Phase Shift (&phi;):
  Q_envelope(t) = &sum; A_j &middot; U_j &middot; [ T_sol-air,j(t - &phi;_j) &middot; f_j + T_ambient_mean &middot; (1 - f_j) - T_indoor(t) ]

Sol-Air Surface Temperature:
  T_sol-air(t) = T_ambient(t) + ( &alpha;_s &middot; I_solar(t) - &epsilon; &middot; &Delta;R ) / h_o

Natural Ventilation Mass Airflow (Vector sum of wind pressure & stack buoyancy):
  Q_vent_flow = &radic;[ (C_v &middot; A_open &middot; v_wind)&sup2; + (C_d &middot; A_open &middot; &radic;(2gH &middot; |&Delta;T| / T_avg))&sup2; ]
  Q_vent(t) = &rho;_air &middot; c_p,air &middot; Q_vent_flow &middot; (T_ambient - T_indoor)
    </div>

    <h2>4. 24-Hour Transient Diurnal Simulation Results</h2>
    <table>
        <thead>
            <tr>
                <th>Hour</th>
                <th>T_Ambient (&deg;C)</th>
                <th>T_Indoor (&deg;C)</th>
                <th>T_Operative (&deg;C)</th>
                <th>PMV Index</th>
                <th>PPD (%)</th>
                <th>ACH (1/h)</th>
                <th>Adaptive Status</th>
            </tr>
        </thead>
        <tbody>
            ${hourly.map(h => `
                <tr>
                    <td>${h.hour.toString().padStart(2, '0')}:00</td>
                    <td>${h.ambientTemp.toFixed(1)}</td>
                    <td><strong>${h.indoorTemp.toFixed(1)}</strong></td>
                    <td>${h.operativeTemp.toFixed(1)}</td>
                    <td style="color: ${h.pmv > 0.5 ? '#b91c1c' : (h.pmv < -0.5 ? '#1d4ed8' : '#15803d')}">${h.pmv > 0 ? '+' : ''}${h.pmv.toFixed(2)}</td>
                    <td>${h.ppd.toFixed(1)}%</td>
                    <td>${h.ach.toFixed(1)}</td>
                    <td><span style="color: ${h.isComfortableAdaptive ? '#15803d' : '#b91c1c'}; font-weight: bold;">${h.isComfortableAdaptive ? 'COMFORTABLE' : 'OUTSIDE LIMIT'}</span></td>
                </tr>
            `).join('')}
        </tbody>
    </table>

    <h2>5. Area-Specific Bioclimatic Recommendations</h2>
    ${recommendations && recommendations.length > 0 ? recommendations.map(r => `
        <div class="rec-box">
            <strong>[${r.priority}] ${r.title}</strong><br>
            <em>Problem:</em> ${r.problem}<br>
            <em>Recommended Solution:</em> ${r.solution}<br>
            <strong>Expected Impact:</strong> ${r.impact}
        </div>
    `).join('') : '<p>The current shelter configuration meets all bioclimatic thermal comfort targets for this climate zone.</p>'}

    <div style="margin-top: 30px; border-top: 1px solid #cbd5e1; padding-top: 8px; font-size: 11px; color: #94a3b8; text-align: center;">
        Generated by BioShelter Studio &bull; Thermal Comfort Modeling System &bull; Standards: ASHRAE 55-2023 / ISO 7730 / IMAC
    </div>
</body>
</html>
    `;

    win.document.open();
    win.document.write(reportHtml);
    win.document.close();
}

export function exportBIMGeoJSON(config, climateData, simulationData) {
    const data = {
        project: 'BioShelter Studio Thermal Model',
        version: '2.0.0',
        timestamp: new Date().toISOString(),
        climate: {
            zone: climateData.zone.name,
            region: climateData.zone.region,
            latitude: climateData.params.latitude || climateData.zone.latitude,
            diurnalRange: [climateData.params.tMin, climateData.params.tMax]
        },
        geometry: {
            length: config.length,
            width: config.width,
            height: config.height,
            roofPitch: config.roofPitch,
            typology: config.typology,
            wwr: config.wwr,
            overhangDepth: config.overhangDepth,
            foundation: config.foundationType
        },
        envelope: {
            walls: config.wallAssembly,
            roof: config.roofAssembly,
            wallU: simulationData.summary.wallU,
            roofU: simulationData.summary.roofU,
            wallTimeLag: simulationData.summary.wallTimeLag,
            roofTimeLag: simulationData.summary.roofTimeLag
        },
        performanceSummary: simulationData.summary,
        hourlyTimeSeries: simulationData.hourly
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bioshelter_${climateData.zone.id}_model.json`;
    a.click();
    URL.revokeObjectURL(url);
}
