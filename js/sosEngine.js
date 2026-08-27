/**
 * BioShelter Studio - Emergency Disaster SOS Broadcast Engine
 * Synthesizes Web Audio API emergency alert siren, dispatches simulated SMS/Push alerts
 * to all registered users during disasters, and manages community crisis broadcasts.
 */

import { userDataStore } from './userDataStore.js';

export const DISASTER_SCENARIOS = {
    heatwave_critical: {
        id: 'heatwave_critical',
        type: 'extreme_heatwave',
        title: 'CATASTROPHIC HEATWAVE DISASTER ALERT (50°C+)',
        severity: 'critical',
        epicenter: 'Sector 4 Arid Basin & Urban Core',
        coordinates: '26.9124° N, 70.9022° E',
        instructions: 'Ambient temp exceeds human survival threshold (Wet-Bulb > 32°C). Proceed immediately to nearest subterranean earth-sheltered bunker or designated passive cooling sanctuary. Do NOT operate un-insulated roofs. Keep hydration stations staffed.',
        recommendedShelter: 'Al-Dahna Subterranean Geothermal Citadel (2.4 km East)',
        evacuationVector: 'Heading 085° E via Lowland Sub-Pass'
    },
    cyclone_surge: {
        id: 'cyclone_surge',
        type: 'cyclone_flood',
        title: 'CATEGORY 5 CYCLONE & PLINTH FLOOD EMERGENCY',
        severity: 'critical',
        epicenter: 'Coastal Delta Zone 3',
        coordinates: '21.9500° N, 89.1800° E',
        instructions: 'Storm surge height 3.2m expected in 45 minutes. Ground-level dwellings must be abandoned. Evacuate to elevated vernacular stilt community refuges (Level +3.0m) or structural concrete core shelters.',
        recommendedShelter: 'Sundarbans Stilt Vernacular Fortress #04',
        evacuationVector: 'Heading 340° NNW to Highland Ridge'
    },
    wildfire_incursion: {
        id: 'wildfire_incursion',
        type: 'wildfire',
        title: 'EXTREME WILDFIRE & TOXIC ASH INVASION ALERT',
        severity: 'critical',
        epicenter: 'Western Forest Perimeter Sector 9',
        coordinates: '34.2000° N, 118.5000° W',
        instructions: 'Wildfire front moving at 18 km/h. High carbon monoxide and PM2.5 levels. Seal all window-to-wall ratios (WWR) with fire-rated earthbag barriers and deploy thermal mass radiant barriers.',
        recommendedShelter: 'Mojave Deep Bedrock Bunker 02',
        evacuationVector: 'Heading 180° S towards Rock Escarpment'
    },
    sandstorm_haboob: {
        id: 'sandstorm_haboob',
        type: 'sandstorm',
        title: 'SEVERE HABOOB SANDSTORM & INFRASTRUCTURE OUTAGE',
        severity: 'high',
        epicenter: 'Central Highland Arid Corridor',
        coordinates: '24.7136° N, 46.6753° E',
        instructions: 'Zero visibility. Wind velocity exceeding 100 km/h. Seal wind-towers immediately. Ground all solar tracking systems and switch to geothermal life-support power.',
        recommendedShelter: 'Highland Vault Earthen Safe-Haven',
        evacuationVector: 'Shelter in place inside monolithic masonry'
    },
    earthquake_collapse: {
        id: 'earthquake_collapse',
        type: 'earthquake',
        title: 'MAGNITUDE 7.2 SEISMIC DISASTER & COLLAPSE HAZARD',
        severity: 'critical',
        epicenter: 'Alpine Mountain Fault Line',
        coordinates: '34.1500° N, 77.5700° E',
        instructions: 'Severe structural integrity danger to rigid unreinforced masonry. Move immediately to flexible bamboo stilt structures or designated open geotechnical clear zones.',
        recommendedShelter: 'Ladakh Lightweight Timber-Bamboo Refuge',
        evacuationVector: 'Open Alluvial Field Zone 1'
    }
};

class SOSEngine {
    constructor() {
        this.audioContext = null;
        this.sirenOscillator1 = null;
        this.sirenOscillator2 = null;
        this.sirenGain = null;
        this.sirenTimer = null;
        this.isSirenPlaying = false;
        this.isMuted = false;

        this.activeDisaster = null;
        this.broadcastHistory = this.loadBroadcastHistory();
        this.listeners = [];
    }

    loadBroadcastHistory() {
        try {
            const data = localStorage.getItem('bioshelter_sos_history_v2');
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    saveBroadcastHistory() {
        localStorage.setItem('bioshelter_sos_history_v2', JSON.stringify(this.broadcastHistory.slice(0, 30)));
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

    /**
     * Web Audio API Emergency Siren Synthesizer
     * Produces a real emergency alternating alert tone without external audio files.
     */
    initAudio() {
        if (!this.audioContext) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.audioContext = new AudioContext();
            }
        }
    }

    startSiren() {
        if (this.isMuted) return;
        this.initAudio();
        if (!this.audioContext) return;

        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        if (this.isSirenPlaying) return;

        try {
            const ctx = this.audioContext;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sawtooth';
            gain.gain.setValueAtTime(0.08, ctx.currentTime);

            // Dual tone modulation (Emergency European/US Warbler Tone)
            let high = false;
            const now = ctx.currentTime;
            osc.frequency.setValueAtTime(660, now);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();

            this.sirenOscillator1 = osc;
            this.sirenGain = gain;
            this.isSirenPlaying = true;

            this.sirenTimer = setInterval(() => {
                if (!this.sirenOscillator1 || !this.audioContext) return;
                const t = this.audioContext.currentTime;
                high = !high;
                this.sirenOscillator1.frequency.linearRampToValueAtTime(high ? 920 : 620, t + 0.25);
            }, 300);
        } catch (e) {
            console.warn('Audio Siren playback not allowed or supported yet:', e);
        }
    }

    stopSiren() {
        if (this.sirenTimer) {
            clearInterval(this.sirenTimer);
            this.sirenTimer = null;
        }
        if (this.sirenOscillator1) {
            try {
                this.sirenOscillator1.stop();
                this.sirenOscillator1.disconnect();
            } catch {}
            this.sirenOscillator1 = null;
        }
        this.isSirenPlaying = false;
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted && this.isSirenPlaying) {
            this.stopSiren();
        }
        this.notify('mute_changed', this.isMuted);
        return this.isMuted;
    }

    /**
     * Trigger a Disaster SOS Emergency Broadcast
     */
    triggerDisaster(scenarioKeyOrCustom) {
        let disaster;
        if (typeof scenarioKeyOrCustom === 'string' && DISASTER_SCENARIOS[scenarioKeyOrCustom]) {
            disaster = { ...DISASTER_SCENARIOS[scenarioKeyOrCustom] };
        } else if (typeof scenarioKeyOrCustom === 'object') {
            disaster = {
                id: 'custom_' + Date.now(),
                severity: 'critical',
                ...scenarioKeyOrCustom
            };
        } else {
            disaster = { ...DISASTER_SCENARIOS.heatwave_critical };
        }

        disaster.broadcastedAt = new Date().toISOString();
        this.activeDisaster = disaster;

        // Dispatches simulated SMS / Push Broadcast to all registered users
        const subscribers = userDataStore.getSosSubscribers();
        const dispatchRecord = {
            id: 'dispatch_' + Date.now(),
            disasterTitle: disaster.title,
            severity: disaster.severity,
            epicenter: disaster.epicenter,
            coordinates: disaster.coordinates,
            timestamp: disaster.broadcastedAt,
            recipientsCount: subscribers.length,
            recipientDetails: subscribers.map(s => ({
                name: s.name,
                phone: s.phone,
                status: 'DELIVERED (SMS Gateway ID #' + Math.floor(100000 + Math.random() * 900000) + ')'
            })),
            smsContent: `[SOS DISASTER ALERT 🚨] ${disaster.title}. Location: ${disaster.epicenter} (${disaster.coordinates}). ${disaster.instructions} Designated Safe Refuge: ${disaster.recommendedShelter}. Route: ${disaster.evacuationVector}.`
        };

        this.broadcastHistory.unshift(dispatchRecord);
        this.saveBroadcastHistory();

        // Start siren
        this.startSiren();

        // Broadcast to listeners (app, banner, modals)
        this.notify('disaster_triggered', {
            disaster: this.activeDisaster,
            dispatch: dispatchRecord
        });

        return dispatchRecord;
    }

    /**
     * User Panic SOS Button (Instant one-click user emergency dispatch)
     */
    triggerUserPanicSOS(user, customLocation = null) {
        const userName = user ? user.displayName : 'Citizen User';
        const userPhone = (user && user.phone) ? user.phone : '+1 (555) 911-SOS';
        const coords = customLocation || '28.6139° N, 77.2090° E (Live GPS)';

        const panicDisaster = {
            id: 'panic_' + Date.now(),
            type: 'user_panic_distress',
            title: `URGENT SOS DISTRESS SIGNAL FROM ${userName.toUpperCase()}`,
            severity: 'critical',
            epicenter: `User GPS Location: ${coords}`,
            coordinates: coords,
            instructions: `Immediate medical/evacuation assistance requested by ${userName} (${userPhone}). All nearby bioclimatic shelters and first responders alerted.`,
            recommendedShelter: 'Nearest Verified Earthbag / Geothermal Refuge',
            evacuationVector: 'First Responder Dispatch En Route',
            initiatedBy: userName
        };

        return this.triggerDisaster(panicDisaster);
    }

    dismissDisaster() {
        this.activeDisaster = null;
        this.stopSiren();
        this.notify('disaster_dismissed', null);
    }

    getActiveDisaster() {
        return this.activeDisaster;
    }

    getBroadcastHistory() {
        return this.broadcastHistory;
    }
}

export const sosEngine = new SOSEngine();
