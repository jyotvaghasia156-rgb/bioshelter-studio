/**
 * BioShelter Studio - Emergency Bunkers & Reinforced Refuge Facilities Database
 * Catalogs subterranean earth-covered safe havens, blast refuges, and geothermal life-support properties.
 */

export const EMERGENCY_BUNKERS = [
    {
        id: 'bunker_thar_01',
        name: 'Thar Subterranean Geothermal Blast & Heatwave Refuge (BH-01)',
        zoneId: 'hot_arid',
        region: 'Thar Desert / Jodhpur Outskirts',
        coordinates: '26.2980° N, 73.0180° E',
        distanceKm: 4.8,
        typology: 'Subterranean Reinforced Earth-Covered Vault',
        soilOverburdenMeters: 3.8,
        overpressureRatingPsi: 45, // ~3.1 bar blast resistance
        capacityOccupants: 160,
        thermalComfortModel: {
            subterraneanSteadyTemp: 23.5, // °C without AC (natural geothermal balance)
            thermalLagDays: 140,          // Complete decoupling from surface summer extremes
            naturalCoolingStrategy: 'Sub-soil labyrinth earth-tube air pre-cooling (ΔT = -14°C)'
        },
        lifeSupport: {
            airFiltration: 'NBC / CBRN Positive Pressure HEPA + Activated Carbon',
            waterSupply: '60,000 L Subsurface Geothermal Cistern',
            powerAutonomy: 'Deep-buried Vanadium Redox Battery + 25kW Solar Armor Plinth',
            maxAutonomousDurationDays: 45
        },
        amenities: ['Triage Medical Bay', 'Emergency Radio Repeater', 'Thermal Decoupling Airlocks', 'Airtight Blast Blast Doors'],
        contactEmergency: 'Frequency: 144.850 MHz (HAM) / Satellite VHF Code: THAR-REFUGE-01'
    },
    {
        id: 'bunker_coastal_02',
        name: 'Monsoon Coastal Cyclone & Flood Superadobe Haven (CS-04)',
        zoneId: 'warm_humid',
        region: 'Coastal Plain / High ground elevation +14m MSL',
        coordinates: '9.9816° N, 76.2999° E',
        distanceKm: 2.3,
        typology: 'Aerodynamic Earthbag Dome with Reinforced Concrete Plinth',
        soilOverburdenMeters: 1.8,
        overpressureRatingPsi: 25,
        capacityOccupants: 220,
        thermalComfortModel: {
            subterraneanSteadyTemp: 25.8,
            thermalLagDays: 45,
            naturalCoolingStrategy: 'Passive Wind-Turbine Venturi Ridge Extractors'
        },
        lifeSupport: {
            airFiltration: 'Dehumidification Desiccant Wheel + Multi-stage particulate filtration',
            waterSupply: 'High-volume Rainwater Bio-Sand Filtration Bank',
            powerAutonomy: 'Elevated Marine-Grade Solar Microgrid',
            maxAutonomousDurationDays: 30
        },
        amenities: ['Child & Infant Safe Ward', 'Satellite Uplink', 'Food Reserves Storage', 'Raised Stilt Plinth Anti-Flood Level'],
        contactEmergency: 'Coastal Emergency Line: +91 (0484) 288-SAFE / VHF Ch 16'
    },
    {
        id: 'bunker_composite_03',
        name: 'Central Plain Dual-Season Subsurface Bunker (CP-09)',
        zoneId: 'composite',
        region: 'NCR / Semi-Arid Ridge Perimeter',
        coordinates: '28.6139° N, 77.2090° E',
        distanceKm: 6.1,
        typology: 'Heavy Monolithic Earth-Bermed Concrete Bunker',
        soilOverburdenMeters: 4.2,
        overpressureRatingPsi: 60,
        capacityOccupants: 300,
        thermalComfortModel: {
            subterraneanSteadyTemp: 22.0,
            thermalLagDays: 160,
            naturalCoolingStrategy: 'Subsurface Closed-Loop Water Well Heat Sinks'
        },
        lifeSupport: {
            airFiltration: 'Military Grade CBRN Overpressure System',
            waterSupply: 'Deep Aquifer Artesian Well (120m depth)',
            powerAutonomy: 'Underground Dual-Fuel Biodiesel Generator + Battery Bank',
            maxAutonomousDurationDays: 60
        },
        amenities: ['Emergency Surgical Suite', 'Decontamination Airlock Showers', 'Cryogenic Ration Depot', 'Command Operations Center'],
        contactEmergency: 'Civil Defense Network Node: DEL-SHELTER-09'
    },
    {
        id: 'bunker_alpine_04',
        name: 'Ladakh High-Altitude Mountain Permafrost Vault (AL-02)',
        zoneId: 'cold_mountainous',
        region: 'Leh Valley / Granite Rock Cavern',
        coordinates: '34.1526° N, 77.5771° E',
        distanceKm: 8.4,
        typology: 'Excavated Granite Rock Cavern + Trombe Solar Heat Trap',
        soilOverburdenMeters: 6.5,
        overpressureRatingPsi: 80,
        capacityOccupants: 90,
        thermalComfortModel: {
            subterraneanSteadyTemp: 14.5, // Stabilized significantly above sub-zero exterior (-25°C)
            thermalLagDays: 210,
            naturalCoolingStrategy: 'South-facing Glazed Trombe Solar Hot-Air Preheater & Radiant Stone Core'
        },
        lifeSupport: {
            airFiltration: 'Preheated Air Intake + Snow-Melt Thermal Heat Exchanger',
            waterSupply: 'Sub-glacial Meltwater Cistern with UV Purification',
            powerAutonomy: 'Micro-Hydro Turbine + High-Density Lithium Iron Phosphate Storage',
            maxAutonomousDurationDays: 90
        },
        amenities: ['High-Altitude Oxygen Concentrator Ward', 'Insulated Thermal Sleeping Pods', 'Snowpack Avalanche Shield'],
        contactEmergency: 'Mountain Rescue Radio: 156.800 MHz / Distress Channel'
    },
    {
        id: 'bunker_temperate_05',
        name: 'Highland Transitional Community Earth Refuge (TM-03)',
        zoneId: 'temperate',
        region: 'Plateau Botanical & Forest Reserve',
        coordinates: '12.9716° N, 77.5946° E',
        distanceKm: 3.5,
        typology: 'Earth-Bermed Permaculture Shelter & Bioclimatic Sanctuary',
        soilOverburdenMeters: 2.2,
        overpressureRatingPsi: 20,
        capacityOccupants: 140,
        thermalComfortModel: {
            subterraneanSteadyTemp: 21.0,
            thermalLagDays: 60,
            naturalCoolingStrategy: 'Courtyard Vegetation Evapotranspiration + Stack Chimney'
        },
        lifeSupport: {
            airFiltration: 'Botanical Bio-Wall Living Filter + HEPA',
            waterSupply: 'Permaculture Swale Aquifer Recharge Pond',
            powerAutonomy: 'Biomass Stirling Engine + Solar Panels',
            maxAutonomousDurationDays: 30
        },
        amenities: ['Community Kitchen', 'Seed Vault & Hydroponic Greenhouse', 'Solar Charging Stations'],
        contactEmergency: 'Highland Community Net: GREEN-REFUGE-03'
    }
];

export function getBunkersForZone(zoneId) {
    const matched = EMERGENCY_BUNKERS.filter(b => b.zoneId === zoneId);
    return matched.length > 0 ? matched : EMERGENCY_BUNKERS;
}
