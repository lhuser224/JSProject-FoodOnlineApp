const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const foodOptionController = require('../controllers/foodOptionController');

/**
 * GET /FoodO/food-options/food/:foodId
 * Get option groups for a food
 */
router.get('/food/:foodId', foodOptionController.getFoodOptionGroups);

/**
 * POST /FoodO/food-options
 * Assign option group to food
 */
router.post('/', verifyToken, foodOptionController.assignOptionToFood);

/**
 * DELETE /FoodO/food-options/:foodId/:groupId
 * Remove option group from food
 */
router.delete('/:foodId/:groupId', verifyToken, foodOptionController.removeOptionFromFood);

module.exports = router;
