const Session = require('../models/Session');
const { hashToken } = require('../utils/tokens');
const { toPublicUser } = require('../models/User');

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const session = await Session.findActiveByTokenHash(hashToken(token));
    if (!session) {
      return res.status(401).json({ error: 'Session expired or invalid' });
    }

    req.user = toPublicUser(session);
    req.session = {
      id: session.session_id,
      tokenHash: hashToken(token),
      expiresAt: session.session_expires_at,
    };

    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = { requireAuth };
