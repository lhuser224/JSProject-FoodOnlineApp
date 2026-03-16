const express = require('express');
const router = express.Router({ mergeParams: true });
const { verifyToken } = require('../middleware/auth');
const addressController = require('../controllers/addressController');


router.get('/:userId', verifyToken, addressController.getUserAddresses);

router.post('/:userId', verifyToken, addressController.createAddress);

router.patch('/:addressId', verifyToken, addressController.updateAddress);

router.patch('/:addressId/default', verifyToken, addressController.setDefaultAddress);

router.delete('/:addressId', verifyToken, addressController.deleteAddress);

module.exports = router;
