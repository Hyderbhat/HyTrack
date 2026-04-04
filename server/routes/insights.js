const express = require('express');
const router  = express.Router();
const { getInsights } = require('../controllers/insightsController');

// GET /api/insights?user_id=
router.get('/', getInsights);

module.exports = router;
