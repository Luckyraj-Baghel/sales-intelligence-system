const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Clean direct routes: /api/auth/register and /api/auth/login
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;