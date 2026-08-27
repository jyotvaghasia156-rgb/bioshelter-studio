/**
 * BioShelter Studio - User Data & Community Store
 * Reactive persistence layer connected directly to backend REST API endpoints,
 * with localStorage fallback for user-submitted shelters, citizen disaster hazard reports,
 * custom thermal materials, and cloud saved projects.
 */

import { apiClient } from './apiClient.js';

const STORAGE_KEYS = {
    COMMUNITY_SHELTERS: 'bioshelter_community_shelters_v2',
    HAZARD_REPORTS: 'bioshelter_hazard_reports_v2',
    CUSTOM_MATERIALS: 'bioshelter_custom_materials_v2',
    SOS_SUBSCRIBERS: 'bioshelter_sos_subscribers_v2',
    PROJECTS: 'bioshelter_saved_projects_v2'
};

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
            roofPitch: 30,
            wwr: 25,
            overhangDepth: 1.2,
            occupants: 12,
            ventMode: 'continuous_cross',
            foundationType: 'stilt_elevated'
        }
    }
];

const DEFAULT_HAZARD_REPORTS = [
    {
        id: 'hazard_seed_1',
        title: 'Extreme Heatwave Threshold Breach (49.8°C)',
        type: 'extreme_heatwave',
        severity: 'critical',
        location: 'Sector 3 Arid Agricultural Corridor',
        coordinates: '26.8500° N, 71.1200° E',
        description: 'Wet-bulb limit reached 33.2°C. Ground temperature exceeding 60°C. Immediate risk of hyperthermia.',
        reportedBy: 'Civil Defense Weather Station #04',
        actionsRecommended: 'Seek nearest verified subterranean shelter immediately. Hydration stations active.',
        reportedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        status: 'Active Alert'
    }
];

class UserDataStore {
    constructor() {
        this.listeners = [];
        this.initDefaults();
        this.syncFromBackend();
    }

    initDefaults() {
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
                { name: 'Dr. Sarah Lin', phone: '+1 (415) 555-0192', role: 'Thermal Physicist', verified: true },
                { name: 'Alex Henderson', phone: '+1 (206) 555-0144', role: 'Structural Engineer', verified: true },
                { name: 'Community Emergency Net', phone: '+91 98200-11223', role: 'Regional First Responder', verified: true }
            ]));
        }
    }

    async syncFromBackend() {
        try {
            const shelterRes = await apiClient.getShelters();
            if (shelterRes && shelterRes.success && shelterRes.shelters && shelterRes.shelters.length > 0) {
                const local = this.getCommunityShelters();
                const merged = [...shelterRes.shelters];
                local.forEach(l => { if (!merged.some(m => m.id === l.id)) merged.push(l); });
                localStorage.setItem(STORAGE_KEYS.COMMUNITY_SHELTERS, JSON.stringify(merged));
                this.notify('shelters_updated', merged);
            }

            const hazardRes = await apiClient.getHazards();
            if (hazardRes && hazardRes.success && hazardRes.hazards && hazardRes.hazards.length > 0) {
                const local = this.getHazardReports();
                const merged = [...hazardRes.hazards];
                local.forEach(l => { if (!merged.some(m => m.id === l.id)) merged.push(l); });
                localStorage.setItem(STORAGE_KEYS.HAZARD_REPORTS, JSON.stringify(merged));
                this.notify('hazards_updated', merged);
            }
        } catch (e) {
            console.log('Backend sync offline fallback active.');
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
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMUNITY_SHELTERS)) || DEFAULT_COMMUNITY_SHELTERS;
        } catch {
            return DEFAULT_COMMUNITY_SHELTERS;
        }
    }

    async addCommunityShelter(shelter) {
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

        // Sync with backend API
        try {
            await apiClient.createShelter(newShelter);
        } catch (e) {
            console.warn('Shelter saved locally (backend sync pending).');
        }

        return newShelter;
    }

    async upvoteShelter(shelterId) {
        const shelters = this.getCommunityShelters();
        const item = shelters.find(s => s.id === shelterId);
        if (item) {
            item.upvotes = (item.upvotes || 0) + 1;
            localStorage.setItem(STORAGE_KEYS.COMMUNITY_SHELTERS, JSON.stringify(shelters));
            this.notify('shelters_updated', shelters);
            try {
                await apiClient.upvoteShelter(shelterId);
            } catch (e) {}
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
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.HAZARD_REPORTS)) || DEFAULT_HAZARD_REPORTS;
        } catch {
            return DEFAULT_HAZARD_REPORTS;
        }
    }

    async addHazardReport(report) {
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

        // Sync with backend API
        try {
            await apiClient.reportHazard(newReport);
        } catch (e) {
            console.warn('Hazard reported locally (backend sync pending).');
        }

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

    async addCustomMaterial(material) {
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

        // Sync with backend API
        try {
            await apiClient.saveCustomMaterial(newMaterial);
        } catch (e) {}

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

    // --- Cloud Saved Shelter Projects ---
    async saveShelterProject(project) {
        try {
            const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS)) || [];
            const item = { id: 'proj_' + Date.now(), savedAt: new Date().toISOString(), ...project };
            list.unshift(item);
            localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(list));
            await apiClient.saveProject(item);
            return item;
        } catch (e) {
            return project;
        }
    }
}

export const userDataStore = new UserDataStore();
