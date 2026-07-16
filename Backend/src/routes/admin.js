const { Router } = require('express');
const { isAdmin } = require('../middlewares/is-admin');
const { upload } = require('../middlewares/upload');
const {
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/products');
const { getOrders } = require('../controllers/orders');
const { listUsers, setUserAdmin } = require('../controllers/users');

const router = Router();

router.use('/admin', isAdmin);

router.post('/admin/products', upload.array('images', 6), createProduct);
router.put('/admin/products/:id', upload.array('images', 6), updateProduct);
router.delete('/admin/products/:id', deleteProduct);

router.get('/admin/orders', getOrders);

router.get('/admin/users', listUsers);
router.patch('/admin/users/:id/admin', setUserAdmin);

module.exports = { adminRouter: router };
