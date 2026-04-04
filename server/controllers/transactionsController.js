const Transaction = require('../models/Transaction');

/**
 * GET /api/transactions
 * Query params: type, category, limit
 */
const getTransactions = async (req, res) => {
  try {
    const { type, category, limit = 100 } = req.query;
    const rows = await Transaction.findAll(req.user.id, { type, category, limit });
    res.json({ data: rows, total: rows.length });
  } catch (err) {
    console.error('getTransactions error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

/**
 * POST /api/transactions
 * Body: { type, amount, category, note, date }
 */
const createTransaction = async (req, res) => {
  try {
    const { type, amount, category, note, date } = req.body;

    if (!type || !amount || !category) {
      return res.status(400).json({ error: 'type, amount and category are required' });
    }
    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ error: 'type must be income or expense' });
    }
    if (Number(amount) <= 0) {
      return res.status(400).json({ error: 'amount must be positive' });
    }

    const transaction = await Transaction.create({
      user_id: req.user.id,
      type,
      amount,
      category,
      note,
      date,
    });

    res.status(201).json({ data: transaction });
  } catch (err) {
    console.error('createTransaction error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getTransactions, createTransaction };
