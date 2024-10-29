const { Router } = require('express');
const { showProducts, showProductById,showCategories } = require('../controllers/products');

const router = Router();

router.get('/products/:id', showProductById);

router.get('/products', showProducts);

router.get('/categories', showCategories);

module.exports = { productRouter: router };
