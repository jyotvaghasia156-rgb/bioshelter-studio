/**
 * BioShelter Studio - Global Comfort Haven & Vacation Climate Matcher Engine
 * Powered by Google Maps integration and ASHRAE 55 / Fanger Bioclimatic Analytics.
 * Ranks the world's most comfortable, enjoyable places to live and vacation based on
 * Thermal Stability Index (TSI), Psychrometric Enthalpy, and Life Enjoyment Index (LEI).
 */

export const PARADISE_DESTINATIONS = [
    {
        id: 'dest_medellin',
        name: 'Medellín',
        region: 'Antioquia / Aburrá Valley',
        country: 'Colombia',
        tagline: 'The City of Eternal Spring (La Ciudad de la Eterna Primavera)',
        tempAvg: 23.5,
        tempMax: 26.2,
        tempMin: 17.8,
        humidityAvg: 64,
        windSpeedAvg: 2.4,
        windDirection: 'NE (45°) ➔ SW',
        windDescription: 'Gentle Valley Convective Breeze',
        sunshineHoursYear: 2100,
        elevationMeters: 1495,
        comfortDaysPerYear: 340,
        monthlyTemps: [23.1, 23.4, 23.6, 23.5, 23.6, 23.7, 23.8, 23.6, 23.5, 23.2, 23.1, 23.0],
        comfortIndex: 98,
        climateType: 'Cfb - Subtropical Highland Spring',
        zoneId: 'temperate',
        lat: 6.2442,
        lng: -75.5812,
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=6.2442,-75.5812',
        analytics: {
            thermalStability: 96,
            humidityBalance: 92,
            windComfort: 94,
            airPurity: 88,
            sunshineVitality: 90,
            biophilicSolace: 98,
            lifeEnjoymentScore: 97
        },
        idealFor: ['🌸 Eternal Spring & Wellness', '☕ Cultural City & Cafés', '🌿 Botanical Gardens & Parks'],
        weatherStatement: 'Remarkably steady 23°C year-round microclimate nestled in a lush Andean valley. Zero extreme heatwaves or winter frost with 340 thermal comfort days annually.',
        photoUrl: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=800&auto=format&fit=crop&q=80',
        bestMonths: 'Year-Round (Best: Dec - Mar, Jul - Aug)',
        costTier: 'Affordable ($$)',
        airQuality: 'Good (AQI 32)'
    },
    {
        id: 'dest_madeira',
        name: 'Funchal / Madeira Island',
        region: 'Autonomous Region of Madeira',
        country: 'Portugal',
        tagline: 'Floating Garden of the Atlantic Ocean',
        tempAvg: 22.8,
        tempMax: 25.4,
        tempMin: 18.2,
        humidityAvg: 62,
        windSpeedAvg: 3.1,
        windDirection: 'N (0°) ➔ S',
        windDescription: 'Atlantic Maritime Sea Breeze',
        sunshineHoursYear: 2450,
        elevationMeters: 60,
        comfortDaysPerYear: 330,
        monthlyTemps: [19.5, 19.4, 20.0, 20.6, 21.8, 23.4, 25.1, 25.8, 25.0, 23.6, 21.6, 20.1],
        comfortIndex: 97,
        climateType: 'Csa - Subtropical Mediterranean Oceanic',
        zoneId: 'temperate',
        lat: 32.6669,
        lng: -16.9241,
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=32.6669,-16.9241',
        analytics: {
            thermalStability: 94,
            humidityBalance: 95,
            windComfort: 92,
            airPurity: 98,
            sunshineVitality: 93,
            biophilicSolace: 96,
            lifeEnjoymentScore: 96
        },
        idealFor: ['🏖️ Coastal Paradise & Swimming', '🏔️ Mountain Retreat & Hiking', '🌸 Eternal Spring & Wellness'],
        weatherStatement: 'Subtropical Gulf Stream thermal buffering creates perpetual temperate spring warmth with pristine ocean air and breathtaking volcanic sea cliffs.',
        photoUrl: 'https://images.unsplash.com/photo-1579893921867-b5b63065b706?w=800&auto=format&fit=crop&q=80',
        bestMonths: 'Year-Round (Best: Apr - Nov)',
        costTier: 'Moderate ($$$)',
        airQuality: 'Pristine (AQI 14)'
    },
    {
        id: 'dest_sandiego',
        name: 'San Diego',
        region: 'Southern California',
        country: 'United States',
        tagline: 'America’s Finest Climate & Coastal Oasis',
        tempAvg: 22.4,
        tempMax: 25.0,
        tempMin: 16.5,
        humidityAvg: 58,
        windSpeedAvg: 3.5,
        windDirection: 'WNW (290°) ➔ ESE',
        windDescription: 'Pacific Marine Coastal Inversion',
        sunshineHoursYear: 3050,
        elevationMeters: 20,
        comfortDaysPerYear: 310,
        monthlyTemps: [19.0, 19.2, 20.0, 21.1, 22.0, 23.5, 25.0, 25.8, 25.2, 23.8, 21.4, 19.2],
        comfortIndex: 96,
        climateType: 'BSh / Csa - Semi-Arid Mediterranean Marine',
        zoneId: 'temperate',
        lat: 32.7157,
        lng: -117.1611,
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=32.7157,-117.1611',
        analytics: {
            thermalStability: 92,
            humidityBalance: 96,
            windComfort: 91,
            airPurity: 90,
            sunshineVitality: 98,
            biophilicSolace: 92,
            lifeEnjoymentScore: 95
        },
        idealFor: ['🏖️ Coastal Paradise & Swimming', '☕ Cultural City & Cafés', '🏄‍♂️ Surfing & Water Sports'],
        weatherStatement: 'Mild Pacific Ocean thermoregulation delivers over 300 sunny days annually with low humidity and zero humid heat spikes.',
        photoUrl: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&auto=format&fit=crop&q=80',
        bestMonths: 'Year-Round (Best: May - Oct)',
        costTier: 'Premium ($$$$)',
        airQuality: 'Good (AQI 28)'
    },
    {
        id: 'dest_tenerife',
        name: 'Santa Cruz / Tenerife',
        region: 'Canary Islands',
        country: 'Spain',
        tagline: 'Island of Eternal Sunshine & Trade Winds',
        tempAvg: 24.1,
        tempMax: 27.0,
        tempMin: 19.5,
        humidityAvg: 56,
        windSpeedAvg: 3.8,
        windDirection: 'NE (40°) ➔ SW',
        windDescription: 'North-East Trade Wind Flow (Alisios)',
        sunshineHoursYear: 2900,
        elevationMeters: 35,
        comfortDaysPerYear: 325,
        monthlyTemps: [21.0, 21.2, 22.0, 22.8, 24.0, 25.5, 27.2, 27.8, 27.0, 25.5, 23.5, 21.8],
        comfortIndex: 95,
        climateType: 'BSh/Csb - Island of Eternal Summer',
        zoneId: 'temperate',
        lat: 28.4636,
        lng: -16.2518,
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=28.4636,-16.2518',
        analytics: {
            thermalStability: 95,
            humidityBalance: 94,
            windComfort: 90,
            airPurity: 96,
            sunshineVitality: 97,
            biophilicSolace: 94,
            lifeEnjoymentScore: 95
        },
        idealFor: ['🏖️ Coastal Paradise & Swimming', '⛵ Sailing & Ocean Life', '🌸 Eternal Spring & Wellness'],
        weatherStatement: 'Atlantic Alisios trade winds deliver constant natural cooling, creating a world-renowned health retreat and microclimate sanctuary.',
        photoUrl: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=800&auto=format&fit=crop&q=80',
        bestMonths: 'Year-Round (Best: May - Nov)',
        costTier: 'Moderate ($$$)',
        airQuality: 'Pristine (AQI 18)'
    },
    {
        id: 'dest_kunming',
        name: 'Kunming',
        region: 'Yunnan Highland Plateau',
        country: 'China',
        tagline: 'Spring City of the Orient (春城)',
        tempAvg: 21.6,
        tempMax: 24.8,
        tempMin: 13.5,
        humidityAvg: 55,
        windSpeedAvg: 2.8,
        windDirection: 'SSE (160°) ➔ NNW',
        windDescription: 'Highland Plateau Draft',
        sunshineHoursYear: 2400,
        elevationMeters: 1890,
        comfortDaysPerYear: 300,
        monthlyTemps: [16.0, 18.2, 21.0, 23.5, 24.6, 24.8, 24.5, 24.2, 23.0, 20.5, 18.0, 16.2],
        comfortIndex: 94,
        climateType: 'Cwb - Subtropical Highland Monsoonal',
        zoneId: 'temperate',
        lat: 25.0406,
        lng: 102.7129,
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=25.0406,102.7129',
        analytics: {
            thermalStability: 93,
            humidityBalance: 91,
            windComfort: 92,
            airPurity: 86,
            sunshineVitality: 92,
            biophilicSolace: 95,
            lifeEnjoymentScore: 93
        },
        idealFor: ['🌸 Eternal Spring & Wellness', '🏔️ Mountain Retreat & Hiking', '🌿 Botanical Gardens & Parks'],
        weatherStatement: 'Subtropical highland elevation (1,890m) protects the city from tropical heat, providing crisp spring air and continuous floral blooms.',
        photoUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80',
        bestMonths: 'Mar - May, Oct - Dec',
        costTier: 'Affordable ($$)',
        airQuality: 'Good (AQI 26)'
    },
    {
        id: 'dest_ooty',
        name: 'Ooty / Nilgiris',
        region: 'Tamil Nadu / Nilgiri Blue Mountains',
        country: 'India',
        tagline: 'Queen of Hill Stations & Botanical Solace',
        tempAvg: 19.8,
        tempMax: 22.5,
        tempMin: 12.0,
        humidityAvg: 58,
        windSpeedAvg: 2.6,
        windDirection: 'W (260°) ➔ E',
        windDescription: 'Eucalyptus Mountain Scented Breeze',
        sunshineHoursYear: 2250,
        elevationMeters: 2240,
        comfortDaysPerYear: 290,
        monthlyTemps: [18.0, 19.5, 21.0, 22.4, 22.0, 19.5, 18.8, 19.0, 19.4, 19.6, 18.5, 17.8],
        comfortIndex: 93,
        climateType: 'Cfb - High Mountain Temperate',
        zoneId: 'temperate',
        lat: 11.4102,
        lng: 76.6950,
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=11.4102,76.6950',
        analytics: {
            thermalStability: 91,
            humidityBalance: 90,
            windComfort: 94,
            airPurity: 96,
            sunshineVitality: 88,
            biophilicSolace: 98,
            lifeEnjoymentScore: 93
        },
        idealFor: ['🌿 Botanical Gardens & Parks', '🏔️ Mountain Retreat & Hiking', '☕ Cultural City & Cafés'],
        weatherStatement: 'Crisp eucalyptus mountain air and endless rolling green tea estates situated at 2,240m elevation. Thermal refuge from tropical heat.',
        photoUrl: 'https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?w=800&auto=format&fit=crop&q=80',
        bestMonths: 'Sep - May',
        costTier: 'Affordable ($$)',
        airQuality: 'Pristine (AQI 12)'
    },
    {
        id: 'dest_saputara',
        name: 'Saputara / Dang Hill Station',
        region: 'Dang District / Sahyadri Mountains',
        country: 'Gujarat, India',
        tagline: 'Abode of Serpents & Sahyadri Cloud Sanctuary',
        tempAvg: 23.8,
        tempMax: 27.5,
        tempMin: 16.2,
        humidityAvg: 64,
        windSpeedAvg: 3.2,
        windDirection: 'S (180°) ➔ N',
        windDescription: 'Sahyadri Forest Pine Breeze',
        sunshineHoursYear: 2400,
        elevationMeters: 875,
        comfortDaysPerYear: 310,
        monthlyTemps: [20.2, 22.5, 25.8, 27.5, 27.0, 24.5, 22.8, 22.5, 23.2, 24.6, 22.4, 20.8],
        comfortIndex: 96,
        climateType: 'Cfb - Mountain Cloud Forest Spring',
        zoneId: 'gj_dang',
        lat: 20.7580,
        lng: 73.7470,
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=20.7580,73.7470',
        analytics: {
            thermalStability: 94,
            humidityBalance: 92,
            windComfort: 96,
            airPurity: 98,
            sunshineVitality: 90,
            biophilicSolace: 99,
            lifeEnjoymentScore: 96
        },
        idealFor: ['🌸 Eternal Spring & Wellness', '🏔️ Mountain Retreat & Hiking', '🌿 Botanical Gardens & Parks'],
        weatherStatement: 'Gujarat\'s highest mountain sanctuary nestled in dense teak and bamboo forests. Enjoy 310 days of natural comfort with crisp mountain air and sunset lake views.',
        photoUrl: 'https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?w=800&auto=format&fit=crop&q=80',
        bestMonths: 'Year-Round (Best: Oct - Apr, Jul - Sep Monsoon)',
        costTier: 'Affordable ($$)',
        airQuality: 'Pristine (AQI 15)'
    },
    {
        id: 'dest_gir_forest',
        name: 'Sasan Gir / Gir Sanctuary',
        region: 'Junagadh & Gir Somnath',
        country: 'Gujarat, India',
        tagline: 'Last Haven of the Asiatic Lion & Teak Wilderness',
        tempAvg: 25.2,
        tempMax: 29.5,
        tempMin: 18.5,
        humidityAvg: 58,
        windSpeedAvg: 3.0,
        windDirection: 'SW (225°) ➔ NE',
        windDescription: 'Deciduous Canopy Fresh Breeze',
        sunshineHoursYear: 2750,
        elevationMeters: 160,
        comfortDaysPerYear: 285,
        monthlyTemps: [21.5, 23.8, 27.2, 29.5, 29.8, 27.5, 26.0, 25.8, 26.2, 26.8, 24.5, 22.0],
        comfortIndex: 92,
        climateType: 'BSh - Dry Deciduous Forest Oasis',
        zoneId: 'gj_junagadh',
        lat: 21.1333,
        lng: 70.6000,
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=21.1333,70.6000',
        analytics: {
            thermalStability: 90,
            humidityBalance: 90,
            windComfort: 92,
            airPurity: 96,
            sunshineVitality: 94,
            biophilicSolace: 98,
            lifeEnjoymentScore: 92
        },
        idealFor: ['🌿 Botanical Gardens & Parks', '☕ Cultural City & Cafés', '🌸 Eternal Spring & Wellness'],
        weatherStatement: 'Dense canopy of over 500,000 teak and banyan trees filters ambient heat, creating an enchanting ecological oasis for humans and lions alike.',
        photoUrl: 'https://images.unsplash.com/photo-1584905066893-7d5c142ba4e1?w=800&auto=format&fit=crop&q=80',
        bestMonths: 'Nov - Apr',
        costTier: 'Moderate ($$$)',
        airQuality: 'Pristine (AQI 18)'
    },
    {
        id: 'dest_navsari',
        name: 'Navsari (Dandi Shore & Parsi Orchards)',
        region: 'Navsari District / Arabian Coast',
        country: 'Gujarat, India',
        tagline: 'Twin City of Diamonds, Parsi Heritage & Dandi Salt March',
        tempAvg: 26.5,
        tempMax: 30.5,
        tempMin: 21.0,
        humidityAvg: 68,
        windSpeedAvg: 3.8,
        windDirection: 'SW (225°) ➔ NE',
        windDescription: 'Arabian Sea Marine Breeze',
        sunshineHoursYear: 2800,
        elevationMeters: 12,
        comfortDaysPerYear: 295,
        monthlyTemps: [22.0, 24.5, 27.8, 30.2, 30.5, 28.5, 27.0, 26.8, 27.2, 27.8, 25.4, 22.8],
        comfortIndex: 94,
        climateType: 'Aw - Tropical Maritime Orchard Eden 🌴',
        zoneId: 'gj_navsari',
        lat: 20.9500,
        lng: 72.9333,
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=20.9500,72.9333',
        analytics: {
            thermalStability: 92,
            humidityBalance: 91,
            windComfort: 95,
            airPurity: 96,
            sunshineVitality: 95,
            biophilicSolace: 97,
            lifeEnjoymentScore: 94
        },
        idealFor: ['🏖️ Coastal Paradise & Swimming', '🌸 Eternal Spring & Wellness', '🌿 Botanical Gardens & Parks'],
        weatherStatement: 'Gentle oceanic breezes from the Dandi Arabian shoreline temper summer warmth across expansive mango, sapota (chikoo), and floriculture belts.',
        photoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
        bestMonths: 'Oct - Apr',
        costTier: 'Affordable ($$)',
        airQuality: 'Pristine (AQI 19)'
    },
    {
        id: 'dest_como',
        name: 'Lake Como / Bellagio',
        region: 'Lombardy / Italian Lakes',
        country: 'Italy',
        tagline: 'Alpine Solace & Mediterranean Microclimate',
        tempAvg: 23.0,
        tempMax: 26.5,
        tempMin: 16.0,
        humidityAvg: 56,
        windSpeedAvg: 2.7,
        windDirection: 'N (10°) ➔ S',
        windDescription: 'Diurnal Alpine Lake Breeze (Breva & Tivano)',
        sunshineHoursYear: 2350,
        elevationMeters: 200,
        comfortDaysPerYear: 270,
        monthlyTemps: [14.0, 16.0, 19.5, 22.0, 24.5, 26.8, 27.5, 26.5, 23.5, 19.8, 16.0, 13.8],
        comfortIndex: 93,
        climateType: 'Cfa - Subalpine Lake Oasis',
        zoneId: 'temperate',
        lat: 45.9867,
        lng: 9.2562,
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=45.9867,9.2562',
        analytics: {
            thermalStability: 89,
            humidityBalance: 93,
            windComfort: 92,
            airPurity: 94,
            sunshineVitality: 91,
            biophilicSolace: 99,
            lifeEnjoymentScore: 94
        },
        idealFor: ['⛵ Sailing & Ocean Life', '☕ Cultural City & Cafés', '🏔️ Mountain Retreat & Hiking'],
        weatherStatement: 'Sub-Alpine lake microclimate shielded from northern polar winds, creating mild summers with refreshing daily lake breezes.',
        photoUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&auto=format&fit=crop&q=80',
        bestMonths: 'Apr - Oct',
        costTier: 'Luxury ($$$$$)',
        airQuality: 'Pristine (AQI 16)'
    },
    {
        id: 'dest_maui',
        name: 'Maui / Wailea Coastal',
        region: 'Hawaii',
        country: 'United States',
        tagline: 'Tropical Pacific Eden & Trade Wind Sanctuary',
        tempAvg: 25.5,
        tempMax: 28.2,
        tempMin: 21.0,
        humidityAvg: 64,
        windSpeedAvg: 4.2,
        windDirection: 'ENE (70°) ➔ WSW',
        windDescription: 'Gentle Pacific Ocean Trade Winds',
        sunshineHoursYear: 2850,
        elevationMeters: 15,
        comfortDaysPerYear: 320,
        monthlyTemps: [25.0, 25.1, 25.4, 26.0, 26.8, 27.5, 28.2, 28.5, 28.2, 27.4, 26.5, 25.4],
        comfortIndex: 92,
        climateType: 'Af / As - Tropical Marine Trade Wind',
        zoneId: 'warm_humid',
        lat: 20.6900,
        lng: -156.4420,
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=20.6900,-156.4420',
        analytics: {
            thermalStability: 97,
            humidityBalance: 88,
            windComfort: 94,
            airPurity: 99,
            sunshineVitality: 96,
            biophilicSolace: 97,
            lifeEnjoymentScore: 95
        },
        idealFor: ['🏖️ Coastal Paradise & Swimming', '🏄‍♂️ Surfing & Water Sports', '🌴 Tropical Wellness'],
        weatherStatement: 'Constant 15 km/h trade winds naturally ventilate the islands, maintaining soothing operative comfort without sticky humidity.',
        photoUrl: 'https://images.unsplash.com/photo-1542259009477-d625272157b7?w=800&auto=format&fit=crop&q=80',
        bestMonths: 'Year-Round (Best: Apr - Nov)',
        costTier: 'Premium ($$$$)',
        airQuality: 'Pristine (AQI 10)'
    }
];

/**
 * Performs multi-criteria bioclimatic data analysis matching user preferences against global comfort havens.
 * @param {Object} preferences - { targetTemp: 23, targetHumidity: 55, lifestyle: 'all', maxWind: 5.0 }
 * @returns {Array} Ranked list of matched destinations with comfort percentage and analytics metrics.
 */
export function analyzeAndRankComfortPlaces(preferences = {}) {
    const targetTemp = Number(preferences.targetTemp || 23.0);
    const targetHumidity = Number(preferences.targetHumidity || 55);
    const selectedLifestyle = preferences.lifestyle || 'all';
    const maxWind = Number(preferences.maxWind || 6.0);

    const scoredDestinations = PARADISE_DESTINATIONS.map(dest => {
        // 1. Temperature Proximity Score (Max 35 pts)
        const tempDiff = Math.abs(dest.tempAvg - targetTemp);
        const tempScore = Math.max(0, 35 - tempDiff * 6.0);

        // 2. Humidity Enthalpy Proximity Score (Max 25 pts)
        const humDiff = Math.abs(dest.humidityAvg - targetHumidity);
        const humScore = Math.max(0, 25 - humDiff * 0.65);

        // 3. Aerodynamic Wind Score (Max 15 pts)
        const windScore = dest.windSpeedAvg <= maxWind ? 15 : Math.max(0, 15 - (dest.windSpeedAvg - maxWind) * 4.5);

        // 4. Thermal Stability Index (TSI) & Sunshine Days (Max 15 pts)
        const stabilityScore = Math.round((dest.analytics.thermalStability / 100) * 15);

        // 5. Lifestyle & Activity Alignment Bonus (Max 10 pts)
        let lifestyleScore = 8;
        if (selectedLifestyle !== 'all') {
            const matches = dest.idealFor.some(tag => tag.toLowerCase().includes(selectedLifestyle.toLowerCase()));
            lifestyleScore = matches ? 10 : 4;
        }

        // Total Bioclimatic Match Score (0 - 100%)
        const totalScore = Math.min(100, Math.round(tempScore + humScore + windScore + stabilityScore + lifestyleScore));

        // Bioclimatic PMV Estimate (Predicted Mean Vote) & PPD %
        const pmvEstimate = (dest.tempAvg - targetTemp) / 3.5;
        const ppdEstimate = Math.round(Math.max(5, (100 - totalScore) * 0.85));

        return {
            ...dest,
            matchScore: totalScore,
            pmvEstimate: Math.round(pmvEstimate * 10) / 10,
            ppdEstimate: ppdEstimate,
            deltaTFromTarget: Math.round((dest.tempAvg - targetTemp) * 10) / 10,
            thermalFeeling: getThermalFeelingLabel(dest.tempAvg),
            bioclimaticEnthalpyKJ: Math.round(1.006 * dest.tempAvg + (0.622 * (dest.humidityAvg / 100) * 2.501 * Math.exp(17.27 * dest.tempAvg / (dest.tempAvg + 237.3))))
        };
    });

    // Sort descending by highest match score
    return scoredDestinations.sort((a, b) => b.matchScore - a.matchScore);
}

function getThermalFeelingLabel(temp) {
    if (temp >= 26.5) return 'Warm & Tropical 🌴';
    if (temp >= 23.0) return 'Perpetual Spring Comfort 🌸';
    if (temp >= 20.0) return 'Mild & Balmy 🍃';
    if (temp >= 16.0) return 'Crisp & Refreshing 🌲';
    return 'Cool Mountain Air 🏔️';
}
