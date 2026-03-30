const express = require('express');
const foodController = require('../controllers/foodController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware'); // Middleware bạn đã gửi
const router = express.Router();

// Public routes
router.get('/', foodController.getAll);
router.get('/:id', foodController.getById);
router.get('/shop/:shopId', foodController.getByShop);
router.get('/category/:categoryId', foodController.getByCategory);

router.post('/', 
    authMiddleware.verifyToken, 
    authMiddleware.isSeller, 
    upload.single('image'), 
    foodController.create
);

router.patch('/:id', 
    authMiddleware.verifyToken, 
    authMiddleware.isSeller, 
    upload.single('image'), 
    foodController.update
);

router.patch('/:id/toggle', 
    authMiddleware.verifyToken, 
    authMiddleware.isSeller, 
    foodController.toggleStatus
);

router.delete('/:id', 
    authMiddleware.verifyToken, 
    authMiddleware.isSeller, 
    foodController.delete
);

module.exports = router;