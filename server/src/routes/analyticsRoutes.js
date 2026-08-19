const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// Modular Analytics Endpoints
router.get('/dashboard', analyticsController.getDashboardSummary);
router.get('/products', analyticsController.getProductDeepDive);
router.get('/customers', analyticsController.getCustomerDeepDive);
router.get('/sales-team', analyticsController.getSalesTeamDeepDive);

module.exports = router;