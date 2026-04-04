const Alert = require('../models/Alert');
const FinanceAnalyzer = require('../services/FinanceAnalyzer');
const Transaction = require('../models/Transaction');

async function getAlerts(req, res) {
  try {
    const budget = Number(req.query.budget) || Number(req.user.budget) || 50000;
    const transactions = await Transaction.findAll(req.user.id, { limit: 1000 });
    const generatedAlerts = FinanceAnalyzer.generateAlerts(transactions, budget);
    await Alert.syncForUser(req.user.id, generatedAlerts);
    const alerts = await Alert.findAllByUser(req.user.id);
    res.json({ data: alerts });
  } catch (err) {
    console.error('getAlerts error:', err.message);
    res.status(500).json({ error: err.message });
  }
}

async function markAlertRead(req, res) {
  try {
    const alert = await Alert.markAsRead(req.user.id, req.params.id);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    return res.json({ data: alert });
  } catch (err) {
    console.error('markAlertRead error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

async function markAllAlertsRead(req, res) {
  try {
    await Alert.markAllAsRead(req.user.id);
    return res.status(204).send();
  } catch (err) {
    console.error('markAllAlertsRead error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { getAlerts, markAlertRead, markAllAlertsRead };
