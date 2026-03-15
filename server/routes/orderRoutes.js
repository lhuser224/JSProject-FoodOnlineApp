const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const orderController = require('../controllers/orderController');

/**
 * POST /FoodO/orders
 * Create new order
 */
router.post('/', verifyToken, orderController.createOrder);

/**
 * GET /FoodO/orders/history/:userId
 * Get order history for user
 */
router.get('/history/:userId', verifyToken, orderController.getOrderHistory);

/**
 * GET /FoodO/orders/:orderId
 * Get order details with items
 */
router.get('/:orderId', verifyToken, orderController.getOrderById);

/**
 * PATCH /FoodO/orders/:orderId
 * Update order status
 */
router.patch('/:orderId', verifyToken, orderController.updateOrder);

/**
 * PATCH /FoodO/orders/:orderId/cancel
 * Cancel order
 */
router.patch('/:orderId/cancel', verifyToken, orderController.cancelOrder);

module.exports = router;
