const { Router } = require('express');
const {
  registerOrder,
  getUserOrders,
  updateOrder,
} = require('../controllers/orders');
const { requireAuth } = require('../middlewares/require-auth');

const router = Router();

router.post('/orders', requireAuth, registerOrder);

router.get('/orders', requireAuth, getUserOrders);

router.put('/orders', requireAuth, updateOrder);

module.exports = { orderRouter: router };
