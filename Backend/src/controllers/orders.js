const orderService = require('../services/order');

const registerOrder = async (req, res) => {
  try {
    const order = await orderService.createOrder({
      ...req.body,
      UserId: req.currentUser.id,
    });
    res.status(200).send(order);
  } catch (err) {
    res.status(500).send({ error: 'Something went wrong: ' + err.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await orderService.getUserOrders(req.currentUser.id);
    res.status(200).send(orders);
  } catch (err) {
    res.status(500).send({ error: 'Something went wrong: ' + err.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const order = await orderService.getAllOrders();
    res.status(200).send(order);
  } catch (err) {
    res.status(500).send({ error: 'Something went wrong: ' + err.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const order = await orderService.updateOrder(req.body);
    res.status(200).send(order);
  } catch (err) {
    res.status(500).send({ error: 'Something went wrong: ' + err.message });
  }
};

module.exports = { registerOrder, getUserOrders, getOrders, updateOrder };
