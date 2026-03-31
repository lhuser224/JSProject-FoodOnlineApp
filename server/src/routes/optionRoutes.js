const express = require('express');
const router = express.Router();
const optionController = require('../controllers/optionController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/groups', authMiddleware.verifyToken, authMiddleware.isSeller, optionController.createGroup);
router.post('/items', authMiddleware.verifyToken, authMiddleware.isSeller, optionController.addItem);

router.get('/shop/:shopId', optionController.getGroupsByShop);
router.get('/food/:foodId', optionController.getFoodCustomization);

router.post('/assign', authMiddleware.verifyToken, authMiddleware.isSeller, optionController.assignToFood);
router.delete('/assign', authMiddleware.verifyToken, authMiddleware.isSeller, optionController.removeFromFood);

module.exports = router;