// api/index.js — Vercel Serverless Function
// Handles all /api/* routes. Static files are served natively by Vercel CDN.
const handler = require('../server.js');
module.exports = handler;
