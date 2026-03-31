const express = require('express');
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// GET /api/categories?is_active=1
router.get('/', categoryController.getAll);

router.post('/', authMiddleware.verifyToken, authMiddleware.isAdmin, categoryController.create);
router.patch('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, categoryController.update);
router.patch('/:id/toggle', authMiddleware.verifyToken, authMiddleware.isAdmin, categoryController.toggleStatus);
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, categoryController.delete);

module.exports = router;