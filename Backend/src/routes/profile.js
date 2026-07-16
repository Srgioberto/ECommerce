const { Router } = require('express');
const { requireAuth } = require('../middlewares/require-auth');
const {
  listAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} = require('../controllers/addresses');
const {
  listPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} = require('../controllers/paymentMethods');

const router = Router();

router.use('/profile', requireAuth);

router.get('/profile/addresses', listAddresses);
router.post('/profile/addresses', createAddress);
router.put('/profile/addresses/:id', updateAddress);
router.delete('/profile/addresses/:id', deleteAddress);

router.get('/profile/payment-methods', listPaymentMethods);
router.post('/profile/payment-methods', createPaymentMethod);
router.put('/profile/payment-methods/:id', updatePaymentMethod);
router.delete('/profile/payment-methods/:id', deletePaymentMethod);

module.exports = { profileRouter: router };
