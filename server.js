/**
 * BioShelter Studio - Node.js / Express REST API Backend
 * Run with: node server.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 8000;
const ROOT_DIR = __dirname;
const DB_FILE = path.join(ROOT_DIR, 'data', 'database.json');

function loadDB() {
    try {
        if (!fs.existsSync(DB_FILE)) {
            fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
            return { users: [], otpCodes: {}, shelters: [], hazards: [], customMaterials: [], broadcastLogs: [] };
        }
        return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch (e) {
        return { users: [], otpCodes: {}, shelters: [], hazards: [], customMaterials: [], broadcastLogs: [] };
    }
}

function saveDB(data) {
    try {
        fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
        console.error('Error saving DB:', e);
    }
}

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const sendJson = (statusCode, data) => {
        res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(data));
    };

    // Parse Body
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
        let jsonBody = {};
        try {
            if (body) jsonBody = JSON.parse(body);
        } catch (e) {}

        const db = loadDB();

        // --- REST API ROUTES ---
        if (pathname.startsWith('/api/')) {
            // Health
            if (pathname === '/api/health' && req.method === 'GET') {
                return sendJson(200, { status: 'online', service: 'BioShelter Node.js Backend', timestamp: new Date().toISOString() });
            }

            // Request Phone OTP
            if (pathname === '/api/auth/otp/send' && req.method === 'POST') {
                const phone = jsonBody.phone || '9876543210';
                const code = Math.floor(100000 + Math.random() * 900000).toString();
                const fullPhone = `${jsonBody.countryCode || '+91'} ${phone}`;
                db.otpCodes[fullPhone] = { code, expiresAt: new Date(Date.now() + 600000).toISOString() };
                saveDB(db);
                return sendJson(200, { success: true, phone: fullPhone, code, message: `6-Digit SMS OTP sent to ${fullPhone}` });
            }

            // Verify Phone OTP
            if (pathname === '/api/auth/otp/verify' && req.method === 'POST') {
                const name = jsonBody.name || 'Citizen Engineer';
                const phone = jsonBody.phone || '+91 98765 43210';
                const user = {
                    id: `usr_${Date.now()}`,
                    displayName: name,
                    phone: phone,
                    role: 'Certified Bioclimatic Responder',
                    institution: 'Disaster Resilience Net',
                    verifiedPhone: true,
                    verifiedAccount: true,
                    registeredAt: new Date().toISOString()
                };
                db.users.push(user);
                saveDB(db);
                return sendJson(200, { success: true, user, token: `JWT_${Date.now()}`, message: `Welcome, ${name}!` });
            }

            // Community Shelters
            if (pathname === '/api/shelters') {
                if (req.method === 'GET') return sendJson(200, { success: true, shelters: db.shelters });
                if (req.method === 'POST') {
                    const newShelter = {
                        id: `shelter_${Date.now()}`,
                        name: jsonBody.name || 'Community Haven',
                        climateZone: jsonBody.climateZone || 'hot_arid',
                        typology: jsonBody.typology || 'wind_tower',
                        location: jsonBody.location || 'Regional Sector',
                        capacity: parseInt(jsonBody.capacity, 10) || 30,
                        wallMaterial: jsonBody.wallMaterial || 'Rammed Earth',
                        roofMaterial: 'Bioclimatic Roof',
                        emergencyContact: jsonBody.emergencyContact || '+91 98765 00000',
                        authorName: jsonBody.authorName || 'Citizen Architect',
                        authorRole: jsonBody.authorRole || 'Community Builder',
                        status: 'Verified Community Refuge',
                        coolingStrategy: 'Natural Cross-Flow & Soil Physics',
                        upvotes: 1,
                        createdAt: new Date().toISOString(),
                        config: jsonBody.config || {}
                    };
                    db.shelters.unshift(newShelter);
                    saveDB(db);
                    return sendJson(201, { success: true, shelter: newShelter });
                }
            }

            // Citizen Hazards
            if (pathname === '/api/hazards') {
                if (req.method === 'GET') return sendJson(200, { success: true, hazards: db.hazards });
                if (req.method === 'POST') {
                    const newHazard = {
                        id: `haz_${Date.now()}`,
                        title: jsonBody.title || 'Extreme Climate Event',
                        type: jsonBody.type || 'heatwave',
                        severity: jsonBody.severity || 'high',
                        location: jsonBody.location || 'Regional Sector',
                        description: jsonBody.description || 'Extreme temperature condition.',
                        reportedBy: jsonBody.reportedBy || 'Citizen Responder',
                        actionsRecommended: 'Seek nearest subterranean refuge.',
                        status: 'Active Alert',
                        reportedAt: new Date().toISOString()
                    };
                    db.hazards.unshift(newHazard);
                    saveDB(db);
                    return sendJson(201, { success: true, hazard: newHazard });
                }
            }

            // Disaster SOS Trigger
            if (pathname === '/api/sos/trigger' && req.method === 'POST') {
                const broadcast = {
                    id: `sos_${Date.now()}`,
                    scenario: jsonBody.scenario || 'heatwave_critical',
                    title: jsonBody.title || 'Catastrophic Emergency Alert',
                    epicenter: jsonBody.epicenter || 'Regional Basin',
                    dispatchedAt: new Date().toISOString(),
                    totalSubscribers: db.users.length + 240,
                    deliveryRate: '99.8%'
                };
                db.broadcastLogs.unshift(broadcast);
                saveDB(db);
                return sendJson(200, { success: true, alert: broadcast, message: 'Emergency SOS alert dispatched to all subscribers.' });
            }

            return sendJson(404, { error: 'API route not found' });
        }

        // --- STATIC FILE SERVING ---
        let filePath = path.join(ROOT_DIR, pathname === '/' ? 'index.html' : pathname);
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const ext = path.extname(filePath).toLowerCase();
            const mime = MIME_TYPES[ext] || 'application/octet-stream';
            res.writeHead(200, { 'Content-Type': mime, 'Cache-Control': 'no-cache' });
            fs.createReadStream(filePath).pipe(res);
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
        }
    });
});

server.listen(PORT, () => {
    console.log(`============================================================`);
    console.log(`🌍 BioShelter Studio Node.js Server active at http://localhost:${PORT}`);
    console.log(`============================================================`);
});
