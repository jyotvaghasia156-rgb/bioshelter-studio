/**
 * BioShelter Studio - Climate Engine
 * Diurnal Weather Synthesizer & Area-Specific Microclimate Models
 */

export const CLIMATE_ZONES = {
    hot_arid: {
        id: 'hot_arid',
        name: 'Hot & Arid (Desert / Dry)',
        region: 'e.g., Thar (India), Sahara, Middle East, Arizona (USA)',
        description: 'High diurnal temperature variation (DTR > 15°C), intense direct solar radiation, very low relative humidity, strong dry winds.',
        latitude: 26.9,
        defaults: {
            tMax: 44.0,
            tMin: 24.0,
            rhDay: 20,
            rhNight: 45,
            ghiPeak: 980,
            windSpeedAvg: 3.8,
            windDirection: 'SW',
            groundTempAvg: 28.0
        },
        bioclimaticZones: {
            comfortLow: 21.0,
            comfortHigh: 28.5,
            adaptiveNeutral: 27.5
        },
        recommendedTypology: 'wind_tower',
        recommendedWalls: 'rammed_earth_300',
        recommendedRoof: 'vaulted_earth_terracotta',
        recommendedVentMode: 'night_purge'
    },
    warm_humid: {
        id: 'warm_humid',
        name: 'Warm & Humid (Tropical / Coastal)',
        region: 'e.g., Coastal India, SE Asia, Caribbean, Amazon Basin',
        description: 'High year-round temperatures with low diurnal variation (DTR < 6°C), persistent high humidity (>75%), high diffuse solar radiation.',
        latitude: 10.0,
        defaults: {
            tMax: 33.5,
            tMin: 26.5,
            rhDay: 72,
            rhNight: 88,
            ghiPeak: 820,
            windSpeedAvg: 3.2,
            windDirection: 'W',
            groundTempAvg: 28.0
        },
        bioclimaticZones: {
            comfortLow: 23.0,
            comfortHigh: 29.5,
            adaptiveNeutral: 28.0
        },
        recommendedTypology: 'stilt_vernacular',
        recommendedWalls: 'bamboo_mud_infill',
        recommendedRoof: 'thatched_high_pitch',
        recommendedVentMode: 'continuous_cross'
    },
    composite: {
        id: 'composite',
        name: 'Composite (Subtropical / Semi-Arid)',
        region: 'e.g., New Delhi / Central Plains (India), Sahel, Texas',
        description: 'Contrasting seasons: intensely hot & dry summer, monsoon humidity spike, and cool winter. Demands adaptable envelope dynamics.',
        latitude: 28.6,
        defaults: {
            tMax: 40.5,
            tMin: 25.5,
            rhDay: 35,
            rhNight: 65,
            ghiPeak: 930,
            windSpeedAvg: 3.0,
            windDirection: 'NW',
            groundTempAvg: 27.0
        },
        bioclimaticZones: {
            comfortLow: 20.5,
            comfortHigh: 28.0,
            adaptiveNeutral: 26.5
        },
        recommendedTypology: 'vernacular_courtyard',
        recommendedWalls: 'cseb_interlocking_230',
        recommendedRoof: 'double_skin_vented',
        recommendedVentMode: 'adaptive_diurnal'
    },
    temperate: {
        id: 'temperate',
        name: 'Temperate / Highland',
        region: 'e.g., Bangalore / Pune (India), Nairobi (Kenya), Mediterranean',
        description: 'Mild, comfortable temperatures year-round, moderate solar radiation, pleasant breezes, moderate relative humidity.',
        latitude: 12.97,
        defaults: {
            tMax: 29.5,
            tMin: 18.5,
            rhDay: 45,
            rhNight: 70,
            ghiPeak: 850,
            windSpeedAvg: 3.5,
            windDirection: 'E',
            groundTempAvg: 22.0
        },
        bioclimaticZones: {
            comfortLow: 19.5,
            comfortHigh: 26.5,
            adaptiveNeutral: 24.5
        },
        recommendedTypology: 'modular_transitional',
        recommendedWalls: 'timber_fiber_insul',
        recommendedRoof: 'gable_insulated_tiles',
        recommendedVentMode: 'comfort_vent'
    },
    cold_mountainous: {
        id: 'cold_mountainous',
        name: 'Cold & Mountainous (Alpine / High-Altitude)',
        region: 'e.g., Ladakh / Himalayas (India), Andes, Tibetan Plateau',
        description: 'Sub-zero temperatures, intense direct solar radiation at high altitude, low diffuse component, severe nighttime radiant cooling.',
        latitude: 34.15,
        defaults: {
            tMax: 12.0,
            tMin: -8.0,
            rhDay: 28,
            rhNight: 55,
            ghiPeak: 1050,
            windSpeedAvg: 4.5,
            windDirection: 'NE',
            groundTempAvg: 4.0
        },
        bioclimaticZones: {
            comfortLow: 18.0,
            comfortHigh: 24.0,
            adaptiveNeutral: 21.0
        },
        recommendedTypology: 'solar_trombe_wall',
        recommendedWalls: 'stone_straw_insul_350',
        recommendedRoof: 'insulated_compact_flat',
        recommendedVentMode: 'minimum_airtight'
    }
};

export function generateDiurnalWeather(zoneId, customParams = {}) {
    const baseZone = CLIMATE_ZONES[zoneId] || CLIMATE_ZONES.hot_arid;
    const params = { ...baseZone.defaults, ...customParams };

    const tMax = Number(params.tMax);
    const tMin = Number(params.tMin);
    const rhDay = Number(params.rhDay);
    const rhNight = Number(params.rhNight);
    const ghiPeak = Number(params.ghiPeak);
    const windAvg = Number(params.windSpeedAvg);
    const lat = Number(customParams.latitude || baseZone.latitude);

    const hours = [];
    const tMean = (tMax + tMin) / 2;
    const tAmp = (tMax - tMin) / 2;

    for (let h = 0; h < 24; h++) {
        let temp;
        if (h >= 5 && h <= 14) {
            const phi = ((h - 5) / 9) * Math.PI - Math.PI / 2;
            temp = tMean + tAmp * Math.sin(phi);
        } else if (h > 14) {
            const phi = ((h - 14) / 15) * Math.PI;
            temp = tMin + (tMax - tMin) * 0.5 * (1 + Math.cos(phi * 0.82));
        } else {
            const phi = ((h + 10) / 15) * Math.PI;
            temp = tMin + (tMax - tMin) * 0.5 * (1 + Math.cos(phi * 0.82));
        }

        const rhRange = rhNight - rhDay;
        const rhFraction = 1 - (temp - tMin) / Math.max(0.1, (tMax - tMin));
        const rh = Math.min(98, Math.max(12, rhDay + rhRange * rhFraction));

        let ghi = 0;
        let dni = 0;
        let dhi = 0;
        let sunElevation = 0;
        let sunAzimuth = 180;

        if (h >= 6 && h <= 18) {
            const solarAngle = ((h - 6) / 12) * Math.PI;
            ghi = Math.max(0, ghiPeak * Math.sin(solarAngle));
            dni = ghi * 0.80;
            dhi = ghi * 0.20;
            sunElevation = Math.max(0, Math.sin(solarAngle) * (90 - Math.abs(lat - 15)));
            sunAzimuth = 90 + ((h - 6) / 12) * 180;
        }

        const windFactor = 0.85 + 0.35 * Math.sin(((h - 9) / 24) * 2 * Math.PI);
        const windSpeed = Math.max(0.6, windAvg * windFactor);

        const dewPoint = temp - ((100 - rh) / 5);
        const tSky = temp - (8.5 - (rh / 25));

        hours.push({
            hour: h,
            ambientTemp: Math.round(temp * 10) / 10,
            relativeHumidity: Math.round(rh),
            ghi: Math.round(ghi),
            dni: Math.round(dni),
            dhi: Math.round(dhi),
            sunElevation: Math.round(sunElevation * 10) / 10,
            sunAzimuth: Math.round(sunAzimuth * 10) / 10,
            windSpeed: Math.round(windSpeed * 10) / 10,
            tSky: Math.round(tSky * 10) / 10,
            dewPoint: Math.round(dewPoint * 10) / 10
        });
    }

    return {
        zone: baseZone,
        params,
        hourly: hours
    };
}
