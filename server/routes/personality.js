const express = require('express');
const router  = express.Router();
const { getPersonality } = require('../controllers/personalityController');

// GET /api/personality?user_id=
router.get('/', getPersonality);

module.exports = router;
