const express = require('express');
const router = express.Router({ mergeParams: true });
const { verifyToken } = require('../middleware/auth');
const addressController = require('../controllers/addressController');

/**
 * GET /FoodO/addresses/:userId
 * Get all addresses for user
 */
router.get('/:userId', verifyToken, addressController.getUserAddresses);

/**
 * POST /FoodO/addresses/:userId
 * Create new address
 */
router.post('/:userId', verifyToken, addressController.createAddress);

/**
 * PATCH /FoodO/addresses/:addressId
 * Update address
 */
router.patch('/:addressId', verifyToken, addressController.updateAddress);

/**
 * PATCH /FoodO/addresses/:addressId/default
 * Set address as default
 */
router.patch('/:addressId/default', verifyToken, addressController.setDefaultAddress);

/**
 * DELETE /FoodO/addresses/:addressId
 * Delete address
 */
router.delete('/:addressId', verifyToken, addressController.deleteAddress);

module.exports = router;
