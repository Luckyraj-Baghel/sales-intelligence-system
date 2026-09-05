const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middleware/authMiddleware');

// All analytics endpoints require a valid JWT token (Bug #1 fix)
router.get('/dashboard', auth, analyticsController.getDashboardSummary);
router.get('/products', auth, analyticsController.getProductDeepDive);
router.get('/customers', auth, analyticsController.getCustomerDeepDive);
router.get('/sales-team', auth, analyticsController.getSalesTeamDeepDive);

module.exports = router;