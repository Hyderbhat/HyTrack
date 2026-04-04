const express = require('express');
const router = express.Router();
const { getAlerts, markAlertRead, markAllAlertsRead } = require('../controllers/alertsController');

router.get('/', getAlerts);
router.patch('/read-all', markAllAlertsRead);
router.patch('/:id/read', markAlertRead);

module.exports = router;
