const express = require('express');
const router  = express.Router();
const { getTransactions, createTransaction } = require('../controllers/transactionsController');

// GET /api/transactions?user_id=&type=&category=&limit=
router.get('/',  getTransactions);
// POST /api/transactions
router.post('/', createTransaction);

module.exports = router;
