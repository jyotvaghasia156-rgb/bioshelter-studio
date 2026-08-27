/**
 * BioShelter Studio - User Data & Community Store
 * Reactive localStorage persistence layer for user-submitted shelters,
 * citizen disaster hazard reports, custom thermal materials, and user blueprints.
 */

const STORAGE_KEYS = {
    COMMUNITY_SHELTERS: 'bioshelter_community_shelters_v2',
    HAZARD_REPORTS: 'bioshelter_hazard_reports_v2',
    CUSTOM_MATERIALS: 'bioshelter_custom_materials_v2',
    SOS_SUBSCRIBERS: 'bioshelter_sos_subscribers_v2'
};

// Initial Seed Data for Community Shelters
const DEFAULT_COMMUNITY_SHELTERS = [
    {
        id: 'shelter_seed_1',
        name: 'Oasis Earthbag Subterranean Refuge',
        climateZone: 'hot_arid',
        location: 'Negev Desert Sector 4, Israel',
        coordinates: '30.8500° N, 34.7833° E',
        typology: 'wind_tower',
        wallMaterial: 'Rammed Earth + Superadobe Earthbags (400mm)',
        roofMaterial: 'Vaulted Nubian Earth Brick with Lime Slurry',
        capacity: 45,
        autonomousDays: 30,
        thermalComfortTemp: '24.2°C',
        coolingStrategy: 'Natural Wind Scoop + Night Soil Geothermal Purge',
        status: 'Verified Community Safe-Haven',
        authorName: 'Dr. Tariq Al-Mansoor',
        authorRole: 'Bioclimatic Architect',
        upvotes: 84,
        createdAt: '2026-07-14T09:30:00.000Z',
        emergencyContact: '+972 50-847-2910',
        config: {
            typology: 'wind_tower',
            length: 8.0,
            width: 5.5,
            height: 3.2,
            roofPitch: 15,
            wwr: 10,
            overhangDepth: 0.8,
            occupants: 8,
            ventMode: 'night_purge',
            foundationType: 'slab'
        }
    },
    {
        id: 'shelter_seed_2',
        name: 'Monsoon Stilt Community Refuge Hub',
        climateZone: 'warm_humid',
        location: 'Sundarbans Delta Zone B, India / Bangladesh',
        coordinates: '21.9497° N, 89.1833° E',
        typology: 'stilt_vernacular',
        wallMaterial: 'Treated Bamboo Lattice + Lime-Pozzolana Render',
        roofMaterial: 'Steep Thatched Straw + Vented Ridge Cavity',
        capacity: 60,
        autonomousDays: 21,
        thermalComfortTemp: '26.8°C',
        coolingStrategy: 'High-Elevation Wind Induced Cross-Ventilation',
        status: 'Verified Flood / Cyclone Shelter',
        authorName: 'Priya Mukherjee, PE',
        authorRole: 'Disaster Relief Engineer',
        upvotes: 112,
        createdAt: '2026-08-02T14:15:00.000Z',
        emergencyContact: '+91 98301-44782',
        config: {
            typology: 'stilt_vernacular',
            length: 9.0,
            width: 6.0,
            height: 3.5,
            roofPitch: 35,
            wwr: 30,
            overhangDepth: 1.2,
            occupants: 12,
            ventMode: 'continuous_cross',
            foundationType: 'stilt_elevated'
        }
    },
    {
        id: 'shelter_seed_3',
        name: 'Alpine Trombe-Wall Highland Refuge',
        climateZone: 'cold_mountainous',
        location: 'Ladakh High-Altitude Pass (3,800m), India',
        coordinates: '34.1526° N, 77.5771° E',
        typology: 'solar_trombe_wall',
        wallMaterial: 'Heavy Basalt Stone (400mm) + Glazed Trombe Wall + Straw Insulation',
        roofMaterial: 'Heavily Insulated Compact Flat Roof (R-30)',
        capacity: 25,
        autonomousDays: 45,
        thermalComfortTemp: '21.5°C',
        coolingStrategy: 'Passive Solar Heat Gain & Thermal Mass Storage',
        status: 'Active High-Altitude Haven',
        authorName: 'Tenzin Norbu',
        authorRole: 'Passive Solar Specialist',
        upvotes: 67,
        createdAt: '2026-08-10T11:00:00.000Z',
        emergencyContact: '+91 94191-23849',
        config: {
            typology: 'solar_trombe_wall',
            length: 7.0,
            width: 4.5,
            height: 2.8,
            roofPitch: 0,
            wwr: 25,
            overhangDepth: 0.4,
            occupants: 5,
            ventMode: 'minimum_airtight',
            foundationType: 'slab'
        }
    }
];

// Initial Seed Data for Hazard Incident Reports
const DEFAULT_HAZARD_REPORTS = [
    {
        id: 'hazard_seed_1',
        type: 'extreme_heatwave',
        title: 'Severe Wet-Bulb Heatwave (>49°C Recorded)',
        severity: 'critical', // 'critical' | 'high' | 'moderate' | 'resolved'
        location: 'North Thar Arid Zone, Rajasthan Sector 7',
        coordinates: '26.9157° N, 70.9083° E',
        affectedPopulation: '~12,000 residents',
        description: 'Ambient temperatures sustained at 49.2°C for 6 consecutive hours. Extreme solar irradiance. Grid transformer failure reported in sub-district 4. All citizens advised to enter subterranean earthen refuges or passive cool centers immediately.',
        reportedBy: 'Field Sensor Telemetry & Vikram Joshi (First Responder)',
        reportedAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
        status: 'Active Emergency',
        actionsRecommended: 'Deploy night-purge ventilation, hydrate with electrolytes, evacuate vulnerable elders to earth-sheltered bunkers.'
    },
    {
        id: 'hazard_seed_2',
        type: 'flash_flood',
        title: 'Tidal Plinth Inundation & Cyclone Surge',
        severity: 'high',
        location: 'Coastal Lowland Corridor Sector C',
        coordinates: '22.1400° N, 88.3500° E',
        affectedPopulation: '~4,500 residents',
        description: 'Water levels rising past 0.8m grade. Ground-slab structures vulnerable to moisture infiltration. Ventilated stilt refuges operational with emergency solar microgrids active.',
        reportedBy: 'Ananya Roy (Civil Protection Volunteer)',
        reportedAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
        status: 'In Progress',
        actionsRecommended: 'Move all food reserves and medical stock to elevated stilt platforms (+1.5m minimum).'
    },
    {
        id: 'hazard_seed_3',
        type: 'sandstorm',
        title: 'High-Velocity Haboob Dust & PM10 Spike',
        severity: 'moderate',
        location: 'Central Desert Basin Expressway',
        coordinates: '24.7136° N, 46.6753° E',
        affectedPopulation: '~25,000 in transit',
        description: 'Visibility below 50m. Wind gusts reaching 28 m/s. High particulate infiltration risk. Wind-tower louvers must be switched to reverse extraction mode or sealed with sand-baffle filters.',
        reportedBy: 'Regional Microclimate Station 03',
        reportedAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
        status: 'Advisory Active',
        actionsRecommended: 'Engage airtight window seals, seal sandbag perimeter, activate subterranean air intake filters.'
    }
];

export class UserDataStore {
    constructor() {
        this.listeners = [];
        this.initStore();
    }

    initStore() {
        if (!localStorage.getItem(STORAGE_KEYS.COMMUNITY_SHELTERS)) {
            localStorage.setItem(STORAGE_KEYS.COMMUNITY_SHELTERS, JSON.stringify(DEFAULT_COMMUNITY_SHELTERS));
        }
        if (!localStorage.getItem(STORAGE_KEYS.HAZARD_REPORTS)) {
            localStorage.setItem(STORAGE_KEYS.HAZARD_REPORTS, JSON.stringify(DEFAULT_HAZARD_REPORTS));
        }
        if (!localStorage.getItem(STORAGE_KEYS.CUSTOM_MATERIALS)) {
            localStorage.setItem(STORAGE_KEYS.CUSTOM_MATERIALS, JSON.stringify([]));
        }
        if (!localStorage.getItem(STORAGE_KEYS.SOS_SUBSCRIBERS)) {
            localStorage.setItem(STORAGE_KEYS.SOS_SUBSCRIBERS, JSON.stringify([
                { name: 'Dr. Sarah Lin', phone: '+1 415-555-0192', role: 'Thermal Modeling Physicist', verified: true },
                { name: 'James R. Sterling', phone: '+1 206-555-0144', role: 'Senior Structural Lead', verified: true },
                { name: 'Community Emergency Net', phone: '+91 98200-11223', role: 'Regional First Responder', verified: true }
            ]));
        }
    }

    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    notify(eventType, data) {
        this.listeners.forEach(cb => cb({ eventType, data }));
    }

    // --- Community Shelters ---
    getCommunityShelters() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMUNITY_SHELTERS)) || [];
        } catch {
            return DEFAULT_COMMUNITY_SHELTERS;
        }
    }

    addCommunityShelter(shelter) {
        const shelters = this.getCommunityShelters();
        const newShelter = {
            id: 'shelter_' + Date.now(),
            upvotes: 1,
            createdAt: new Date().toISOString(),
            ...shelter
        };
        shelters.unshift(newShelter);
        localStorage.setItem(STORAGE_KEYS.COMMUNITY_SHELTERS, JSON.stringify(shelters));
        this.notify('shelters_updated', shelters);
        return newShelter;
    }

    upvoteShelter(shelterId) {
        const shelters = this.getCommunityShelters();
        const item = shelters.find(s => s.id === shelterId);
        if (item) {
            item.upvotes = (item.upvotes || 0) + 1;
            localStorage.setItem(STORAGE_KEYS.COMMUNITY_SHELTERS, JSON.stringify(shelters));
            this.notify('shelters_updated', shelters);
        }
    }

    deleteShelter(shelterId) {
        let shelters = this.getCommunityShelters();
        shelters = shelters.filter(s => s.id !== shelterId);
        localStorage.setItem(STORAGE_KEYS.COMMUNITY_SHELTERS, JSON.stringify(shelters));
        this.notify('shelters_updated', shelters);
    }

    // --- Citizen Hazard Reports ---
    getHazardReports() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.HAZARD_REPORTS)) || [];
        } catch {
            return DEFAULT_HAZARD_REPORTS;
        }
    }

    addHazardReport(report) {
        const reports = this.getHazardReports();
        const newReport = {
            id: 'hazard_' + Date.now(),
            reportedAt: new Date().toISOString(),
            status: 'Active Emergency',
            ...report
        };
        reports.unshift(newReport);
        localStorage.setItem(STORAGE_KEYS.HAZARD_REPORTS, JSON.stringify(reports));
        this.notify('hazards_updated', reports);
        return newReport;
    }

    updateHazardStatus(hazardId, status) {
        const reports = this.getHazardReports();
        const item = reports.find(h => h.id === hazardId);
        if (item) {
            item.status = status;
            localStorage.setItem(STORAGE_KEYS.HAZARD_REPORTS, JSON.stringify(reports));
            this.notify('hazards_updated', reports);
        }
    }

    // --- Custom Materials ---
    getCustomMaterials() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_MATERIALS)) || [];
        } catch {
            return [];
        }
    }

    addCustomMaterial(material) {
        const materials = this.getCustomMaterials();
        const id = 'custom_' + material.name.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now();
        const newMaterial = {
            id,
            category: 'custom',
            embodiedCarbon: material.embodiedCarbon || 45,
            ...material
        };
        materials.push(newMaterial);
        localStorage.setItem(STORAGE_KEYS.CUSTOM_MATERIALS, JSON.stringify(materials));
        this.notify('materials_updated', materials);
        return newMaterial;
    }

    // --- SOS Subscribers Directory ---
    getSosSubscribers() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.SOS_SUBSCRIBERS)) || [];
        } catch {
            return [];
        }
    }

    addSosSubscriber(subscriber) {
        const subs = this.getSosSubscribers();
        const existingIdx = subs.findIndex(s => s.phone === subscriber.phone);
        if (existingIdx >= 0) {
            subs[existingIdx] = { ...subs[existingIdx], ...subscriber };
        } else {
            subs.push({
                verified: true,
                registeredAt: new Date().toISOString(),
                ...subscriber
            });
        }
        localStorage.setItem(STORAGE_KEYS.SOS_SUBSCRIBERS, JSON.stringify(subs));
        this.notify('subscribers_updated', subs);
    }
}

export const userDataStore = new UserDataStore();
