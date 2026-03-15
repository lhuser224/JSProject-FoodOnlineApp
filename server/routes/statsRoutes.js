const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const statsController = require('../controllers/statsController');

/**
 * GET /FoodO/stats
 * Get general dashboard statistics (admin only)
 */
router.get('/', verifyToken, statsController.getStats);

/**
 * GET /FoodO/stats/shop/:shopId
 * Get shop statistics
 */
router.get('/shop/:shopId', verifyToken, statsController.getShopStats);

/**
 * GET /FoodO/stats/user/:userId
 * Get user statistics
 */
router.get('/user/:userId', verifyToken, statsController.getUserStats);

module.exports = router;
