const pool = require('../db/pool');

const Session = {
  async create({ userId, tokenHash, expiresAt }) {
    const { rows } = await pool.query(
      `INSERT INTO auth_sessions (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, tokenHash, expiresAt]
    );

    return rows[0];
  },

  async findActiveByTokenHash(tokenHash) {
    const { rows } = await pool.query(
      `SELECT
         s.id AS session_id,
         s.expires_at AS session_expires_at,
         u.id,
         u.name,
         u.email,
         u.budget,
         u.avatar_url,
         u.created_at
       FROM auth_sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = $1 AND s.expires_at > NOW()
       LIMIT 1`,
      [tokenHash]
    );

    return rows[0] || null;
  },

  async deleteByTokenHash(tokenHash) {
    await pool.query('DELETE FROM auth_sessions WHERE token_hash = $1', [tokenHash]);
  },

  async deleteExpired() {
    await pool.query('DELETE FROM auth_sessions WHERE expires_at <= NOW()');
  },
};

module.exports = Session;
