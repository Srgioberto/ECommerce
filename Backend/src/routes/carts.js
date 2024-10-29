const { Router } = require('express');
const { showCart, addProductToCart, clearCart, removeProduct } = require('../controllers/carts');

const router = Router();

router.get('/cart', showCart);

router.post('/cart', addProductToCart);

router.put('/cart/clear', clearCart);

router.delete('/cart', removeProduct);

module.exports = { cartRouter: router };