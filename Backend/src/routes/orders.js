const { Router } = require('express');
const {
  registerOrder,
  getUserOrders,
  updateOrder,
} = require('../controllers/orders');

const router = Router();

router.post('/orders', registerOrder);

router.get('/orders', getUserOrders);

router.put('/orders', updateOrder);

module.exports = { orderRouter: router };
