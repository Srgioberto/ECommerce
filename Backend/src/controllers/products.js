const productService = require('../services/product');
const orderService = require('../services/order');
const cartService = require('../services/cart');
const { saveProductImage } = require('../utils/saveProductImage');

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

// Shared between create/update: parses the multipart body (sizes arrives as a
// JSON string since FormData can't nest objects) and, when sizes are given,
// derives the total `stock` from them so the rest of the app's stock checks
// (which only know about the flat total) keep working unchanged.
const buildProductData = async (body, file) => {
  const data = {
    name: body.name,
    price: parseFloat(body.price),
    CategoryId: parseInt(body.CategoryId, 10),
  };

  let sizes = [];
  if (body.sizes) {
    try {
      sizes = JSON.parse(body.sizes);
    } catch (err) {
      sizes = [];
    }
  }

  if (Array.isArray(sizes) && sizes.length > 0) {
    data.sizes = sizes.map((s) => ({ size: String(s.size), stock: parseInt(s.stock, 10) || 0 }));
    data.stock = data.sizes.reduce((sum, s) => sum + s.stock, 0);
  } else {
    data.sizes = [];
    data.stock = parseInt(body.stock, 10) || 0;
  }

  if (file) {
    data.image = await saveProductImage(file.buffer, file.originalname);
  }

  return data;
};

const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await buildProductData(req.body, req.file);
    if (!data.image) {
      delete data.image; // keep the existing image when no new file was uploaded
    }
    const product = await productService.update(id, data);
    return res.status(200).send(product);
  } catch (err) {
    res.status(500).send({ error: 'Something went wrong:\n' + err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const data = await buildProductData(req.body, req.file);
    if (!data.image) {
      data.image = 'default.png';
    }
    const product = await productService.create(data);
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
