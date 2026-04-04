const express = require('express');
const {
  login,
  logout,
  me,
  signup,
  updateMe,
  changePassword,
} = require('../controllers/authController');
const { requireAuth } = require('../middleware/requireAuth');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', requireAuth, me);
router.patch('/me', requireAuth, updateMe);
router.post('/change-password', requireAuth, changePassword);
router.post('/logout', requireAuth, logout);

module.exports = router;
