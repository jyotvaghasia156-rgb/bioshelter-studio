/**
 * BioShelter Studio - Advanced Weather & Live Temperature Intelligence Engine
 * Comprehensive atmospheric physics, psychrometric moist air properties, solar/wind decomposition,
 * and Real-Time Live Online Temperature & Weather API integration (Open-Meteo & GPS Geolocation).
 */

export const WMO_WEATHER_CODES = {
    0: { label: 'Clear Sky ☀️', icon: '☀️', condition: 'Sunny' },
    1: { label: 'Mainly Clear 🌤️', icon: '🌤️', condition: 'Fair' },
    2: { label: 'Partly Cloudy ⛅', icon: '⛅', condition: 'Partly Cloudy' },
    3: { label: 'Overcast ☁️', icon: '☁️', condition: 'Cloudy' },
    45: { label: 'Foggy 🌫️', icon: '🌫️', condition: 'Fog' },
    48: { label: 'Depositing Rime Fog 🌫️', icon: '🌫️', condition: 'Freezing Fog' },
    51: { label: 'Light Drizzle 🌦️', icon: '🌦️', condition: 'Light Rain' },
    53: { label: 'Moderate Drizzle 🌦️', icon: '🌦️', condition: 'Drizzle' },
    55: { label: 'Dense Drizzle 🌧️', icon: '🌧️', condition: 'Heavy Drizzle' },
    61: { label: 'Slight Rain 🌧️', icon: '🌧️', condition: 'Light Rain' },
    63: { label: 'Moderate Rain 🌧️', icon: '🌧️', condition: 'Rain' },
    65: { label: 'Heavy Rain ⛈️', icon: '⛈️', condition: 'Heavy Rain' },
    71: { label: 'Slight Snow Fall ❄️', icon: '❄️', condition: 'Light Snow' },
    73: { label: 'Moderate Snow Fall ❄️', icon: '❄️', condition: 'Snow' },
    75: { label: 'Heavy Snow Fall 🌨️', icon: '🌨️', condition: 'Heavy Snow' },
    80: { label: 'Slight Rain Showers 🌦️', icon: '🌦️', condition: 'Showers' },
    81: { label: 'Moderate Rain Showers 🌧️', icon: '🌧️', condition: 'Showers' },
    82: { label: 'Violent Rain Showers ⛈️', icon: '⛈️', condition: 'Violent Showers' },
    95: { label: 'Thunderstorm ⚡', icon: '⚡', condition: 'Thunderstorm' },
    96: { label: 'Thunderstorm with Slight Hail ⛈️', icon: '⛈️', condition: 'Severe Thunderstorm' },
    99: { label: 'Thunderstorm with Heavy Hail 🌩️', icon: '🌩️', condition: 'Severe Storm' }
};

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

/**
 * Fetch Live Real-Time Temperature & Meteorology via Open-Meteo API
 * @param {number} lat Latitude
 * @param {number} lng Longitude
 * @param {string} locationLabel Optional label for display
 */
export async function fetchLiveTemperatureAndWeather(lat, lng, locationLabel = '') {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,direct_normal_irradiance,global_horizontal_irradiance,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Live Weather HTTP ${response.status}`);
        }
        const data = await response.json();
        const current = data.current || {};
        const daily = data.daily || {};
        const hourly = data.hourly || {};

        const tempC = current.temperature_2m !== undefined ? current.temperature_2m : 28.0;
        const apparentTempC = current.apparent_temperature !== undefined ? current.apparent_temperature : tempC;
        const humidity = current.relative_humidity_2m !== undefined ? current.relative_humidity_2m : 50;
        const windSpeedKmh = current.wind_speed_10m !== undefined ? current.wind_speed_10m : 12.0;
        const windSpeedMps = Math.round((windSpeedKmh / 3.6) * 10) / 10;
        const windDirDeg = current.wind_direction_10m !== undefined ? current.wind_direction_10m : 225;
        const wCode = current.weather_code !== undefined ? current.weather_code : 0;
        const weatherInfo = WMO_WEATHER_CODES[wCode] || { label: 'Clear ☀️', icon: '☀️', condition: 'Clear' };
        
        const tempMax = daily.temperature_2m_max && daily.temperature_2m_max[0] ? daily.temperature_2m_max[0] : tempC + 4;
        const tempMin = daily.temperature_2m_min && daily.temperature_2m_min[0] ? daily.temperature_2m_min[0] : tempC - 6;
        const uvMax = daily.uv_index_max && daily.uv_index_max[0] ? daily.uv_index_max[0] : 8.5;

        // Convert wind direction degrees to human cardinal direction
        const cardinals = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        const cardinalIdx = Math.round(windDirDeg / 22.5) % 16;
        const windCardinal = cardinals[cardinalIdx];
        const oppositeCardinal = cardinals[(cardinalIdx + 8) % 16];
        const windDirectionText = `${windCardinal} (${windDirDeg}°) ➔ ${oppositeCardinal}`;

        // Compute advanced physics
        const adv = calculateAdvancedWeatherMetrics(tempC, humidity, 850, windSpeedMps);

        return {
            success: true,
            isLive: true,
            locationLabel: locationLabel || `${lat.toFixed(2)}°N, ${lng.toFixed(2)}°E`,
            lat,
            lng,
            tempC: Math.round(tempC * 10) / 10,
            apparentTempC: Math.round(apparentTempC * 10) / 10,
            tempMax: Math.round(tempMax * 10) / 10,
            tempMin: Math.round(tempMin * 10) / 10,
            humidity: Math.round(humidity),
            windSpeedKmh: Math.round(windSpeedKmh * 10) / 10,
            windSpeedMps,
            windDirectionDeg: windDirDeg,
            windCardinal,
            windDirectionText,
            weatherCode: wCode,
            weatherLabel: weatherInfo.label,
            weatherIcon: weatherInfo.icon,
            weatherCondition: weatherInfo.condition,
            wetBulbC: adv.wetBulbTemp,
            dewPointC: adv.dewPointTemp,
            vpdKPa: adv.vpdKPa,
            uvIndex: uvMax,
            pressureHpa: current.surface_pressure || current.pressure_msl || 1013,
            timestamp: new Date().toLocaleTimeString(),
            hourly: (hourly.time || []).slice(0, 24).map((t, idx) => ({
                time: t.split('T')[1] || `${idx}:00`,
                tempC: hourly.temperature_2m ? hourly.temperature_2m[idx] : tempC,
                humidity: hourly.relative_humidity_2m ? hourly.relative_humidity_2m[idx] : humidity,
                dni: hourly.direct_normal_irradiance ? hourly.direct_normal_irradiance[idx] : 0,
                ghi: hourly.global_horizontal_irradiance ? hourly.global_horizontal_irradiance[idx] : 0,
                windSpeed: hourly.wind_speed_10m ? hourly.wind_speed_10m[idx] : windSpeedKmh
            }))
        };
    } catch (err) {
        console.warn('[LiveWeatherEngine] Fallback due to API error:', err);
        return {
            success: false,
            isLive: false,
            error: err.message,
            tempC: 32.5,
            apparentTempC: 35.0,
            tempMax: 41.0,
            tempMin: 24.0,
            humidity: 48,
            windSpeedKmh: 14.5,
            windSpeedMps: 4.0,
            windDirectionDeg: 225,
            windCardinal: 'SW',
            windDirectionText: 'SW (225°) ➔ NE (45°)',
            weatherCode: 0,
            weatherLabel: 'Clear Sky ☀️',
            weatherIcon: '☀️',
            wetBulbC: 23.5,
            dewPointC: 19.8,
            vpdKPa: 2.1,
            uvIndex: 9.0,
            pressureHpa: 1012,
            timestamp: new Date().toLocaleTimeString()
        };
    }
}

/**
 * Geocode a City or District name and fetch its live temperature
 * @param {string} query City / District / State name (e.g. "Ahmedabad", "Surat", "Rajkot", "Bhuj", "Tokyo")
 */
export async function fetchLiveWeatherByCity(query) {
    if (!query || query.trim() === '') return null;
    try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=1&language=en&format=json`;
        const res = await fetch(geoUrl);
        const data = await res.json();
        if (data.results && data.results.length > 0) {
            const loc = data.results[0];
            const label = `${loc.name}${loc.admin1 ? ', ' + loc.admin1 : ''}, ${loc.country || ''}`;
            const weather = await fetchLiveTemperatureAndWeather(loc.latitude, loc.longitude, label);
            weather.cityName = loc.name;
            weather.country = loc.country;
            weather.adminRegion = loc.admin1;
            return weather;
        } else {
            throw new Error(`Location "${query}" not found.`);
        }
    } catch (err) {
        console.warn('[LiveWeatherEngine] City lookup error:', err);
        return null;
    }
}

/**
 * Get User's Live GPS Location & Temperature via Browser Geolocation API
 */
export function fetchLiveWeatherByGPS() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser.'));
            return;
        }
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                const weather = await fetchLiveTemperatureAndWeather(lat, lng, '📍 Your Current GPS Location');
                resolve(weather);
            },
            (err) => {
                console.warn('[LiveWeatherEngine] GPS permission denied / error:', err);
                // Fallback to Gujarat coordinates (Ahmedabad)
                fetchLiveTemperatureAndWeather(23.0225, 72.5714, 'Ahmedabad, Gujarat (Default Location)').then(resolve).catch(reject);
            },
            { timeout: 8000, enableHighAccuracy: true }
        );
    });
}
