const { Router } = require('express');
const { showCart, addProductToCart, clearCart, removeProduct } = require('../controllers/carts');
const { requireAuth } = require('../middlewares/require-auth');

const router = Router();

router.get('/cart', requireAuth, showCart);

router.post('/cart', requireAuth, addProductToCart);

router.put('/cart/clear', requireAuth, clearCart);

router.delete('/cart', requireAuth, removeProduct);

module.exports = { cartRouter: router };