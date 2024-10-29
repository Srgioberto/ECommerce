const { Router } = require('express');
const { isAdmin } = require('../middlewares/is-admin');
const {
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/products');
const { getOrders } = require('../controllers/orders');

const router = Router();

router.use('/admin', isAdmin);

router.post('/admin/products', createProduct);
router.put('/admin/products/:id', updateProduct);
router.delete('/admin/products/:id', deleteProduct);

router.get('/admin/orders', getOrders);

module.exports = { adminRouter: router };
