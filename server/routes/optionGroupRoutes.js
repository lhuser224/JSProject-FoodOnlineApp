const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const optionGroupController = require('../controllers/optionGroupController');

/**
 * GET /FoodO/option-groups/shop/:shopId
 * Get all option groups for a shop
 */
router.get('/shop/:shopId', optionGroupController.getShopOptionGroups);

/**
 * POST /FoodO/option-groups
 * Create option group
 */
router.post('/', verifyToken, optionGroupController.createOptionGroup);

/**
 * PATCH /FoodO/option-groups/:groupId
 * Update option group
 */
router.patch('/:groupId', verifyToken, optionGroupController.updateOptionGroup);

/**
 * DELETE /FoodO/option-groups/:groupId
 * Delete option group
 */
router.delete('/:groupId', verifyToken, optionGroupController.deleteOptionGroup);

module.exports = router;
