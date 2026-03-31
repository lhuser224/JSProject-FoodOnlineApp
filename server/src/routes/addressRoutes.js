const express = require('express');
const userAddressController = require('../controllers/UserAddressController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(authMiddleware.verifyToken);

router.get('/', userAddressController.getAll);
router.post('/', userAddressController.create);
router.patch('/:id/default', userAddressController.setDefault);
router.patch('/:id', userAddressController.update);
router.delete('/:id', userAddressController.delete);

module.exports = router;