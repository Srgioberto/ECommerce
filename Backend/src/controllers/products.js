const productService = require('../services/product');
const orderService = require('../services/order');
const cartService = require('../services/cart');

const showProducts = async (req, res) => {
  try {
    const product = await productService.find();
    res.status(200).send(product);
  } catch (err) {
    res.status(500).send({ error: 'Something went wrong:\n' + err.message });
  }
};

const showCategories = async (req, res) => {
  try {
    const categories = await productService.findCategories();
    res.status(200).send(categories);
  } catch (err) {
    res.status(500).send({ error: 'Something went wrong:\n' + err.message });
  }
};

const showProductById = async (req, res) => {
  try {
    const product = await productService.findById(req.params.id);
    res.status(200).send(product);
  } catch (err) {
    res.status(500).send({ error: 'Something went wrong:\n' + err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await productService.update(id, req.body);
    return res.status(200).send(product);
  } catch (err) {
    res.status(500).send({ error: 'Something went wrong:\n' + err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await productService.create(req.body);

    res.status(201).send(product);
  } catch (err) {
    res.status(500).send({ error: 'Something went wrong:\n' + err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    cartService.removeItemfromAllCarts(req.params.id);
    let deleted = true;
    let product;
    const inOrders = await orderService.getAllOrdersWithProduct(req.params.id);
    if (inOrders.length > 0) {
      deleted = false;
      product = await productService.update(req.params.id, { stock: 0 });
    } else {
      product = await productService.delete(req.params.id);
    }
    res.status(200).send({ product, deleted });
  } catch (err) {
    res.status(500).send({ error: 'Something went wrong:\n' + err.message });
  }
};

module.exports = {
  showProducts,
  showCategories,
  showProductById,
  updateProduct,
  createProduct,
  deleteProduct,
};
