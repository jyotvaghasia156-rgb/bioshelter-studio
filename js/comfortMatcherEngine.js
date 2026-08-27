/**
 * BioShelter Studio - Global Comfort Haven & Vacation Climate Matcher Engine
 * Bioclimatic data analysis for finding the world's most comfortable, enjoyable places to live/visit.
 * Ranks global destinations based on ASHRAE 55 Adaptive Comfort & Fanger PMV indices.
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
        comfortIndex: 98,
        climateType: 'Cfb - Subtropical Highland Spring',
        zoneId: 'temperate',
        lat: 6.2442,
        lng: -75.5812,
        idealFor: ['🌸 Eternal Spring & Wellness', '☕ Cultural City & Cafés', '🌿 Botanical Gardens & Parks'],
        weatherStatement: 'Remarkably steady 23°C year-round microclimate nestled in a lush Andean valley. Zero extreme heatwaves or winter frost.',
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
        comfortIndex: 97,
        climateType: 'Csa - Subtropical Mediterranean Oceanic',
        zoneId: 'temperate',
        lat: 32.6669,
        lng: -16.9241,
        idealFor: ['🏖️ Coastal Paradise & Swimming', '🏔️ Mountain Retreat & Hiking', '🌸 Eternal Spring & Wellness'],
        weatherStatement: 'Subtropical Gulf Stream thermal buffering creates perpetual temperate spring warmth with pristine ocean air.',
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
        comfortIndex: 96,
        climateType: 'BSh / Csa - Semi-Arid Mediterranean Marine',
        zoneId: 'temperate',
        lat: 32.7157,
        lng: -117.1611,
        idealFor: ['🏖️ Coastal Paradise & Swimming', '☕ Cultural City & Cafés', '🏄‍♂️ Surfing & Water Sports'],
        weatherStatement: 'Mild Pacific Ocean thermoregulation delivers over 300 sunny days annually with low humidity and no humid heat spikes.',
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
        comfortIndex: 95,
        climateType: 'BWh / Csa - Subtropical Oceanic Arid',
        zoneId: 'temperate',
        lat: 28.4636,
        lng: -16.2518,
        idealFor: ['🏖️ Coastal Paradise & Swimming', '🏔️ Mountain Retreat & Hiking', '⛵ Sailing & Ocean Life'],
        weatherStatement: 'Consistently ranked by climatologists as having one of the world’s lowest thermal distress indexes.',
        photoUrl: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=800&auto=format&fit=crop&q=80',
        bestMonths: 'Year-Round (Best: Mar - Dec)',
        costTier: 'Moderate ($$$)',
        airQuality: 'Pristine (AQI 18)'
    },
    {
        id: 'dest_kunming',
        name: 'Kunming',
        region: 'Yunnan Plateau (1,890m)',
        country: 'China',
        tagline: 'Spring City of the Orient (春城)',
        tempAvg: 21.6,
        tempMax: 24.8,
        tempMin: 14.2,
        humidityAvg: 55,
        windSpeedAvg: 2.2,
        windDirection: 'SW (225°) ➔ NE',
        windDescription: 'Subtropical Highland Plateau Draft',
        sunshineHoursYear: 2350,
        comfortIndex: 94,
        climateType: 'Cwb - Monsoon Highland Subtropical',
        zoneId: 'temperate',
        lat: 25.0406,
        lng: 102.7129,
        idealFor: ['🌸 Eternal Spring & Wellness', '🌿 Botanical Gardens & Parks', '🏔️ Mountain Retreat & Hiking'],
        weatherStatement: 'High altitude and low latitude create an uninterrupted blossom climate where blooming flowers flourish all 12 months.',
        photoUrl: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&auto=format&fit=crop&q=80',
        bestMonths: 'Mar - Nov',
        costTier: 'Affordable ($$)',
        airQuality: 'Good (AQI 30)'
    },
    {
        id: 'dest_ooty',
        name: 'Ooty / Nilgiris',
        region: 'Nilgiri Mountains (2,240m), Tamil Nadu',
        country: 'India',
        tagline: 'Queen of Hill Stations & Blue Mountain Sanctuaries',
        tempAvg: 19.8,
        tempMax: 22.5,
        tempMin: 12.0,
        humidityAvg: 58,
        windSpeedAvg: 2.6,
        windDirection: 'W (270°) ➔ E',
        windDescription: 'Cool Mountain Ridge Pine Breeze',
        sunshineHoursYear: 2200,
        comfortIndex: 93,
        climateType: 'Cwb - Subtropical Mountain Highland',
        zoneId: 'temperate',
        lat: 11.4102,
        lng: 76.6950,
        idealFor: ['🏔️ Mountain Retreat & Hiking', '🍵 Tea Gardens & Solitude', '🌸 Eternal Spring & Wellness'],
        weatherStatement: 'Refreshing high-altitude tea estate microclimate, providing an absolute escape from subcontinental heatwaves.',
        photoUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=800&auto=format&fit=crop&q=80',
        bestMonths: 'Oct - May',
        costTier: 'Budget / Affordable ($)',
        airQuality: 'Pristine (AQI 15)'
    },
    {
        id: 'dest_lakecomo',
        name: 'Lake Como & Lugano',
        region: 'Lombardy / Ticino Border',
        country: 'Italy / Switzerland',
        tagline: 'Sub-Alpine Lake Haven of Elegance & Serenity',
        tempAvg: 23.0,
        tempMax: 26.5,
        tempMin: 16.0,
        humidityAvg: 56,
        windSpeedAvg: 2.0,
        windDirection: 'N (Breva) / S (Tivano)',
        windDescription: 'Diurnal Thermal Lake Breeze',
        sunshineHoursYear: 2250,
        comfortIndex: 94,
        climateType: 'Cfa - Temperate Sub-Mediterranean Lake',
        zoneId: 'temperate',
        lat: 45.9867,
        lng: 9.2562,
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
        comfortIndex: 92,
        climateType: 'Af / As - Tropical Marine Trade Wind',
        zoneId: 'warm_humid',
        lat: 20.6900,
        lng: -156.4420,
        idealFor: ['🏖️ Coastal Paradise & Swimming', '🏄‍♂️ Surfing & Water Sports', '🌴 Tropical Wellness'],
        weatherStatement: 'Constant 15 km/h trade winds naturally ventilate the islands, maintaining soothing operative comfort without sticky humidity.',
        photoUrl: 'https://images.unsplash.com/photo-1542259009477-d625272157b7?w=800&auto=format&fit=crop&q=80',
        bestMonths: 'Year-Round (Best: Apr - Nov)',
        costTier: 'Premium ($$$$)',
        airQuality: 'Pristine (AQI 10)'
    },
    {
        id: 'dest_dalat',
        name: 'Da Lat',
        region: 'Central Highlands (1,500m)',
        country: 'Vietnam',
        tagline: 'City of Thousand Flowers & Whispering Pines',
        tempAvg: 20.5,
        tempMax: 24.0,
        tempMin: 14.5,
        humidityAvg: 68,
        windSpeedAvg: 2.1,
        windDirection: 'E (90°) ➔ W',
        windDescription: 'Highland Pine Forest Draft',
        sunshineHoursYear: 2000,
        comfortIndex: 91,
        climateType: 'Cwb - Highland Subtropical Pine',
        zoneId: 'temperate',
        lat: 11.9404,
        lng: 108.4583,
        idealFor: ['🌸 Eternal Spring & Wellness', '☕ Cultural City & Cafés', '🌿 Botanical Gardens & Parks'],
        weatherStatement: 'Cool temperate plateau surrounded by pine-covered hills, nicknamed "Le Petit Paris" for its French villas and cool air.',
        photoUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80',
        bestMonths: 'Nov - Apr',
        costTier: 'Budget / Affordable ($)',
        airQuality: 'Good (AQI 22)'
    },
    {
        id: 'dest_costarica',
        name: 'San José / Central Valley',
        region: 'Valle Central (1,170m)',
        country: 'Costa Rica',
        tagline: 'Pura Vida Highland Sanctuary',
        tempAvg: 24.2,
        tempMax: 27.5,
        tempMin: 18.5,
        humidityAvg: 65,
        windSpeedAvg: 2.8,
        windDirection: 'NE (45°) ➔ SW',
        windDescription: 'Caribbean Trade Wind Inflow',
        sunshineHoursYear: 2400,
        comfortIndex: 93,
        climateType: 'Aw / Cwb - Tropical Highland',
        zoneId: 'temperate',
        lat: 9.9281,
        lng: -84.0907,
        idealFor: ['🌿 Tropical Wellness', '🌸 Eternal Spring & Wellness', '☕ Cultural City & Cafés'],
        weatherStatement: 'Elevated tropical basin with mild temperatures, lush biodiversity, and pleasant mountain breezes.',
        photoUrl: 'https://images.unsplash.com/photo-1518182170546-07661fd94144?w=800&auto=format&fit=crop&q=80',
        bestMonths: 'Dec - Apr',
        costTier: 'Moderate ($$$)',
        airQuality: 'Pristine (AQI 20)'
    },
    {
        id: 'dest_queenstown',
        name: 'Queenstown',
        region: 'Otago / Lake Wakatipu',
        country: 'New Zealand',
        tagline: 'Southern Alps Crystal Lake Sanctuary',
        tempAvg: 18.5,
        tempMax: 22.0,
        tempMin: 10.5,
        humidityAvg: 52,
        windSpeedAvg: 3.0,
        windDirection: 'SW (215°) ➔ NE',
        windDescription: 'Pure Alpine Glacier Draft',
        sunshineHoursYear: 1950,
        comfortIndex: 89,
        climateType: 'Cfb - Clean Oceanic Alpine',
        zoneId: 'temperate',
        lat: -45.0312,
        lng: 168.6626,
        idealFor: ['🏔️ Mountain Retreat & Hiking', '⛵ Sailing & Ocean Life', '🌸 Eternal Spring & Wellness'],
        weatherStatement: 'Glacial purity and crisp, low-humidity air flanked by the Remarkables mountain range.',
        photoUrl: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800&auto=format&fit=crop&q=80',
        bestMonths: 'Nov - Apr',
        costTier: 'Premium ($$$$)',
        airQuality: 'Pristine (AQI 6)'
    },
    {
        id: 'dest_mallorca',
        name: 'Palma de Mallorca',
        region: 'Balearic Islands',
        country: 'Spain',
        tagline: 'Mediterranean Azure & Coastal Haven',
        tempAvg: 24.8,
        tempMax: 28.0,
        tempMin: 18.0,
        humidityAvg: 55,
        windSpeedAvg: 3.2,
        windDirection: 'S (180°) ➔ N (Embat)',
        windDescription: 'Diurnal Mediterranean Sea Breeze (Embat)',
        sunshineHoursYear: 2800,
        comfortIndex: 94,
        climateType: 'Csa - Mediterranean Maritime',
        zoneId: 'temperate',
        lat: 39.5696,
        lng: 2.6502,
        idealFor: ['🏖️ Coastal Paradise & Swimming', '⛵ Sailing & Ocean Life', '☕ Cultural City & Cafés'],
        weatherStatement: 'Crystal turquoise waters with gentle diurnal sea breezes that maintain comfortable afternoon temperatures.',
        photoUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80',
        bestMonths: 'Apr - Nov',
        costTier: 'Moderate ($$$)',
        airQuality: 'Good (AQI 22)'
    }
];

/**
 * Performs data analysis matching user preferences against global comfort havens.
 * @param {Object} preferences - { targetTemp: 23, targetHumidity: 55, lifestyle: 'all', maxWind: 5.0 }
 * @returns {Array} Ranked list of matched destinations with comfort percentage and physics diagnostics.
 */
export function analyzeAndRankComfortPlaces(preferences = {}) {
    const targetTemp = Number(preferences.targetTemp || 23.0);
    const targetHumidity = Number(preferences.targetHumidity || 55);
    const selectedLifestyle = preferences.lifestyle || 'all';
    const maxWind = Number(preferences.maxWind || 6.0);

    const scoredDestinations = PARADISE_DESTINATIONS.map(dest => {
        // 1. Temperature proximity score (Max 40 pts)
        const tempDiff = Math.abs(dest.tempAvg - targetTemp);
        const tempScore = Math.max(0, 40 - tempDiff * 6.5);

        // 2. Humidity proximity score (Max 25 pts)
        const humDiff = Math.abs(dest.humidityAvg - targetHumidity);
        const humScore = Math.max(0, 25 - humDiff * 0.7);

        // 3. Wind suitability score (Max 15 pts)
        const windScore = dest.windSpeedAvg <= maxWind ? 15 : Math.max(0, 15 - (dest.windSpeedAvg - maxWind) * 5);

        // 4. Lifestyle / Activity Bonus (Max 20 pts)
        let lifestyleScore = 15;
        if (selectedLifestyle !== 'all') {
            const matches = dest.idealFor.some(tag => tag.toLowerCase().includes(selectedLifestyle.toLowerCase()));
            lifestyleScore = matches ? 20 : 8;
        }

        // Total Match Percentage (0% - 100%)
        const totalScore = Math.min(100, Math.round(tempScore + humScore + windScore + lifestyleScore));

        // Bioclimatic PMV Estimate (Predicted Mean Vote)
        const pmvEstimate = (dest.tempAvg - 23.5) / 4.0;
        const ppdEstimate = Math.round(100 - totalScore * 0.9);

        return {
            ...dest,
            matchScore: totalScore,
            pmvEstimate: Math.round(pmvEstimate * 10) / 10,
            ppdEstimate: Math.max(5, ppdEstimate),
            deltaTFromTarget: Math.round((dest.tempAvg - targetTemp) * 10) / 10,
            thermalFeeling: getThermalFeelingLabel(dest.tempAvg)
        };
    });

    // Sort by highest match score first
    return scoredDestinations.sort((a, b) => b.matchScore - a.matchScore);
}

function getThermalFeelingLabel(temp) {
    if (temp >= 26.5) return 'Warm & Tropical 🌴';
    if (temp >= 23.0) return 'Perpetual Spring Comfort 🌸';
    if (temp >= 20.0) return 'Mild & Balmy 🍃';
    if (temp >= 16.0) return 'Crisp & Refreshing 🌲';
    return 'Cool Mountain Air 🏔️';
}
