const pool = require('../db/pool');

const DEFAULT_LIMIT = 100;

function normalizeTransaction(row) {
  const amount = Number(row.amount);
  return {
    ...row,
    amount: Number.isFinite(amount) ? amount : 0,
  };
}

const Transaction = {
  /**
   * Find all transactions for a user with optional filters.
   * @param {string} userId
   * @param {{ type?: string, category?: string, limit?: number }} filters
   */
  async findAll(userId, filters = {}) {
    const { type, category } = filters;
    const limit = Number(filters.limit) > 0 ? Number(filters.limit) : DEFAULT_LIMIT;

    let query = 'SELECT * FROM transactions WHERE user_id = $1';
    const params = [userId];
    let idx = 2;

    if (type && type !== 'all') {
      query += ` AND type = $${idx++}`;
      params.push(type);
    }

    if (category) {
      query += ` AND category = $${idx++}`;
      params.push(category);
    }

    query += ` ORDER BY date DESC, created_at DESC LIMIT $${idx}`;
    params.push(limit);

    const { rows } = await pool.query(query, params);
    return rows.map(normalizeTransaction);
  },

  /**
   * Create a new transaction.
   * @param {{ user_id: string, type: string, amount: number, category: string, note?: string, date?: string }} data
   */
  async create(data) {
    const { rows } = await pool.query(
      `INSERT INTO transactions (user_id, type, amount, category, note, date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        data.user_id,
        data.type,
        Number(data.amount),
        data.category,
        data.note || '',
        data.date || new Date().toISOString().split('T')[0],
      ]
    );

    return normalizeTransaction(rows[0]);
  },

  /**
   * Summarize expenses by category for a user.
   * @param {string} userId
   */
  async summarizeByCategory(userId) {
    const { rows } = await pool.query(
      `SELECT category, SUM(amount)::float AS total
       FROM transactions
       WHERE user_id = $1 AND type = 'expense'
       GROUP BY category
       ORDER BY total DESC`,
      [userId]
    );

    return rows;
  },
};

module.exports = Transaction;
