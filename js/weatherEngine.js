/**
 * BioShelter Studio - Advanced Weather & Microclimate Intelligence Engine
 * Comprehensive atmospheric physics, psychrometric moist air properties, and solar/wind decomposition.
 */

export function calculateAdvancedWeatherMetrics(ambientTemp, relativeHumidity, ghi, windSpeed10m, altitudeMeters = 250) {
    const T = Number(ambientTemp);
    const RH = Math.min(99, Math.max(5, Number(relativeHumidity)));

    // 1. Stull Formulation for Wet-Bulb Temperature (°C)
    const Twb = T * Math.atan(0.151977 * Math.pow(RH + 8.313659, 0.5)) +
                Math.atan(T + RH) -
                Math.atan(RH - 1.676331) +
                0.00391838 * Math.pow(RH, 1.5) * Math.atan(0.023101 * RH) -
                4.686035;

    // 2. Magnus-Tetens Formulation for Dew-Point Temperature (°C)
    const a = 17.27;
    const b = 237.7;
    const alphaDew = ((a * T) / (b + T)) + Math.log(RH / 100.0);
    const Tdp = (b * alphaDew) / (a - alphaDew);

    // 3. Vapor Pressure & Vapor Pressure Deficit (VPD in kPa)
    const pSat = 0.61078 * Math.exp((17.27 * T) / (T + 237.3)); // Saturation vapor pressure kPa
    const pActual = (RH / 100.0) * pSat;
    const vpd = Math.max(0, pSat - pActual);

    // 4. Atmospheric Barometric Pressure vs Altitude (kPa)
    const pAtm = 101.325 * Math.pow(1 - (2.25577e-5 * altitudeMeters), 5.25588);

    // 5. Solar Radiation Components & UV Index
    const GHI = Math.max(0, Number(ghi));
    const DNI = GHI > 20 ? GHI * 0.82 : 0;
    const DHI = GHI > 20 ? GHI * 0.18 : 0;
    const uvIndex = Math.min(14, Math.max(0, Math.round((GHI / 1000) * 11.5 * 10) / 10));

    // 6. Wind Velocity Profile at Shelter Eaves Height (z = 3.5m)
    // Urban / rural terrain power law exponent alpha = 0.22
    const vEaves = windSpeed10m * Math.pow(3.5 / 10.0, 0.22);

    return {
        wetBulbTemp: Math.round(Twb * 10) / 10,
        dewPointTemp: Math.round(Tdp * 10) / 10,
        vpdKPa: Math.round(vpd * 100) / 100,
        barometricPressureKPa: Math.round(pAtm * 10) / 10,
        ghi: Math.round(GHI),
        dni: Math.round(DNI),
        dhi: Math.round(DHI),
        uvIndex,
        windSpeed10m: Math.round(windSpeed10m * 10) / 10,
        windSpeedEaves: Math.round(vEaves * 10) / 10
    };
}

export function generateWindRoseData(dominantDirection = 'SW', avgSpeed = 3.5) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions.map(dir => {
        const isDominant = dir === dominantDirection;
        const frequency = isDominant ? 34 : (dir.includes(dominantDirection[0]) ? 16 : 7);
        const speed = isDominant ? avgSpeed * 1.25 : avgSpeed * 0.75;
        return {
            direction: dir,
            frequencyPercent: frequency,
            avgSpeedMS: Math.round(speed * 10) / 10
        };
    });
}
