const FinanceAnalyzer = require('../services/FinanceAnalyzer');
const Transaction = require('../models/Transaction');

/**
 * GET /api/personality
 */
const getPersonality = async (req, res) => {
  try {
    const transactions = await Transaction.findAll(req.user.id, { limit: 1000 });
    const result = FinanceAnalyzer.calculatePersonality(transactions);
    res.json({ data: { ...result, user: req.user } });
  } catch (err) {
    console.error('getPersonality error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getPersonality };
