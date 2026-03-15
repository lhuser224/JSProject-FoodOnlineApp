const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const optionItemController = require('../controllers/optionItemController');

/**
 * GET /FoodO/option-items/group/:groupId
 * Get all option items for a group
 */
router.get('/group/:groupId', optionItemController.getGroupOptionItems);

/**
 * POST /FoodO/option-items
 * Create option item
 */
router.post('/', verifyToken, optionItemController.createOptionItem);

/**
 * PATCH /FoodO/option-items/:itemId
 * Update option item
 */
router.patch('/:itemId', verifyToken, optionItemController.updateOptionItem);

/**
 * DELETE /FoodO/option-items/:itemId
 * Delete option item
 */
router.delete('/:itemId', verifyToken, optionItemController.deleteOptionItem);

module.exports = router;
