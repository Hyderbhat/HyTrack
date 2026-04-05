const pool = require('../db/pool');

const PUBLIC_USER_COLUMNS = `
  id,
  name,
  email,
  budget,
  currency,
  avatar_url,
  created_at
`;

function toPublicUser(user) {
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    budget: Number(user.budget) || 0,
    currency: user.currency || 'INR',
    avatar_url: user.avatar_url || '',
    created_at: user.created_at,
  };
}

const User = {
  async findById(id) {
    const { rows } = await pool.query(`SELECT ${PUBLIC_USER_COLUMNS} FROM users WHERE id = $1`, [id]);
    return rows[0] || null;
  },

  async findByEmail(email) {
    const { rows } = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    return rows[0] || null;
  },

  async findByResetTokenHash(tokenHash) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE reset_token_hash = $1 AND reset_token_expires_at > NOW() LIMIT 1',
      [tokenHash]
    );
    return rows[0] || null;
  },

  async create({ name, email, passwordHash, budget = 50000, currency = 'INR', avatarUrl = '' }) {
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password_hash, budget, currency, avatar_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, email.toLowerCase(), passwordHash, Number(budget), currency, avatarUrl]
    );

    return rows[0];
  },

  async updateProfile(id, { name, budget, currency = 'INR', avatarUrl }) {
    const { rows } = await pool.query(
      `UPDATE users
       SET name = $2,
           budget = $3,
           currency = $4,
           avatar_url = $5
       WHERE id = $1
       RETURNING ${PUBLIC_USER_COLUMNS}`,
      [id, name.trim(), Number(budget), currency, avatarUrl || '']
    );

    return rows[0] || null;
  },

  async updatePassword(id, passwordHash) {
    const { rows } = await pool.query(
      `UPDATE users
       SET password_hash = $2,
           reset_token_hash = NULL,
           reset_token_expires_at = NULL
       WHERE id = $1
       RETURNING ${PUBLIC_USER_COLUMNS}`,
      [id, passwordHash]
    );

    return rows[0] || null;
  },

  async saveResetToken(id, tokenHash, expiresAt) {
    await pool.query(
      `UPDATE users
       SET reset_token_hash = $2,
           reset_token_expires_at = $3
       WHERE id = $1`,
      [id, tokenHash, expiresAt]
    );
  },

  async clearResetToken(id) {
    await pool.query(
      `UPDATE users
       SET reset_token_hash = NULL,
           reset_token_expires_at = NULL
       WHERE id = $1`,
      [id]
    );
  },

  async deleteByEmail(email) {
    await pool.query('DELETE FROM users WHERE LOWER(email) = LOWER($1)', [email]);
  },
};

module.exports = User;
module.exports.toPublicUser = toPublicUser;
