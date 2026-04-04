const FinanceAnalyzer = require('../services/FinanceAnalyzer');
const Transaction = require('../models/Transaction');

/**
 * GET /api/insights
 */
const getInsights = async (req, res) => {
  try {
    const transactions = await Transaction.findAll(req.user.id, { limit: 1000 });
    const insights = FinanceAnalyzer.generateInsights(transactions);
    res.json({ data: insights });
  } catch (err) {
    console.error('getInsights error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getInsights };
