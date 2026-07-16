const paymentMethodService = require('../services/paymentMethod');

const listPaymentMethods = async (req, res) => {
  try {
    const paymentMethods = await paymentMethodService.list(req.currentUser.id);
    res.status(200).send(paymentMethods);
  } catch (err) {
    res.status(500).send({ error: 'Something went wrong: ' + err.message });
  }
};

const createPaymentMethod = async (req, res) => {
  try {
    const paymentMethod = await paymentMethodService.create(req.currentUser.id, req.body);
    res.status(201).send(paymentMethod);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

const updatePaymentMethod = async (req, res) => {
  try {
    const paymentMethod = await paymentMethodService.update(req.currentUser.id, req.params.id, req.body);
    res.status(200).send(paymentMethod);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

const deletePaymentMethod = async (req, res) => {
  try {
    await paymentMethodService.remove(req.currentUser.id, req.params.id);
    res.status(200).send({ id: parseInt(req.params.id, 10) });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

module.exports = { listPaymentMethods, createPaymentMethod, updatePaymentMethod, deletePaymentMethod };
