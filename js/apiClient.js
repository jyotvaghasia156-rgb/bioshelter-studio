/**
 * BioShelter Studio - Backend REST API Client
 * Connects frontend views, authentication flows, community registry,
 * hazard reports, and SOS dispatchers to the Python / Node.js backend.
 */

export class BioShelterAPIClient {
    constructor(baseUrl = '') {
        this.baseUrl = baseUrl;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        };

        try {
            const res = await fetch(url, {
                ...options,
                headers
            });
            if (!res.ok) {
                const errorJson = await res.json().catch(() => ({ message: res.statusText }));
                return { success: false, error: errorJson.message || `HTTP ${res.status}` };
            }
            return await res.json();
        } catch (err) {
            // Graceful offline fallback
            console.warn(`[BioShelter API] Network request to ${endpoint} failed, utilizing local state:`, err);
            return { success: false, offline: true, error: err.message };
        }
    }

    /* --- 1. Authentication & Phone OTP --- */
    async sendPhoneOtp(phone, countryCode = '+91') {
        return await this.request('/api/auth/otp/send', {
            method: 'POST',
            body: JSON.stringify({ phone, countryCode })
        });
    }

    async verifyPhoneOtp(code, name, phone) {
        return await this.request('/api/auth/otp/verify', {
            method: 'POST',
            body: JSON.stringify({ code, name, phone })
        });
    }

    async loginGoogle(profileData = {}) {
        return await this.request('/api/auth/sso/google', {
            method: 'POST',
            body: JSON.stringify(profileData)
        });
    }

    async loginMicrosoft(profileData = {}) {
        return await this.request('/api/auth/sso/microsoft', {
            method: 'POST',
            body: JSON.stringify(profileData)
        });
    }

    /* --- 2. Community Shelters --- */
    async getShelters(query = '', zone = '') {
        const params = new URLSearchParams();
        if (query) params.append('q', query);
        if (zone) params.append('zone', zone);
        return await this.request(`/api/shelters?${params.toString()}`);
    }

    async createShelter(shelterData) {
        return await this.request('/api/shelters', {
            method: 'POST',
            body: JSON.stringify(shelterData)
        });
    }

    async upvoteShelter(shelterId) {
        return await this.request(`/api/shelters/${encodeURIComponent(shelterId)}/upvote`, {
            method: 'POST'
        });
    }

    /* --- 3. Citizen Hazards --- */
    async getHazards() {
        return await this.request('/api/hazards');
    }

    async reportHazard(hazardData) {
        return await this.request('/api/hazards', {
            method: 'POST',
            body: JSON.stringify(hazardData)
        });
    }

    /* --- 4. Disaster SOS Broadcast Net --- */
    async triggerDisasterAlert(scenarioKey, title, epicenter) {
        return await this.request('/api/sos/trigger', {
            method: 'POST',
            body: JSON.stringify({ scenario: scenarioKey, title, epicenter })
        });
    }

    async getBroadcastLogs() {
        return await this.request('/api/sos/broadcasts');
    }

    /* --- 5. Custom Material Lab --- */
    async saveCustomMaterial(matData) {
        return await this.request('/api/materials', {
            method: 'POST',
            body: JSON.stringify(matData)
        });
    }

    /* --- 6. Backend Physics Simulation --- */
    async runServerSimulation(zoneId, config) {
        return await this.request('/api/simulate', {
            method: 'POST',
            body: JSON.stringify({ zoneId, config })
        });
    }
}

export const apiClient = new BioShelterAPIClient();
