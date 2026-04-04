const crypto = require('crypto');

const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30;

function generateSessionToken() {
  return crypto.randomBytes(32).toString('base64url');
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function buildSessionExpiry() {
  return new Date(Date.now() + SESSION_DURATION_MS);
}

module.exports = { generateSessionToken, hashToken, buildSessionExpiry };
