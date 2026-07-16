const productService = require('../services/product');
const orderService = require('../services/order');
const cartService = require('../services/cart');
const { saveProductImage, deleteProductImage } = require('../utils/saveProductImage');

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

// Shared between create/update: parses the multipart body (sizes and
// existingImages arrive as JSON strings since FormData can't nest objects).
// When sizes are given, derives the total `stock` from them so the rest of
// the app's stock checks (which only know about the flat total) keep
// working unchanged. The photo gallery is existingImages (kept from before,
// edit only) plus any newly uploaded files, in that order - images[0] is
// always the cover shown on cards/lists.
const buildProductData = async (body, files) => {
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

  let existingImages = [];
  if (body.existingImages) {
    try {
      existingImages = JSON.parse(body.existingImages);
    } catch (err) {
      existingImages = [];
    }
  }

  let newImages = [];
  if (files && files.length > 0) {
    newImages = await Promise.all(
      files.map((file) => saveProductImage(file.buffer, file.originalname))
    );
  }

  const allImages = [...existingImages, ...newImages];
  if (allImages.length > 0) {
    data.images = allImages;
    data.image = allImages[0];
  }

  return data;
};

const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const previous = await productService.findById(id);
    const previousImages = Array.isArray(previous.images) ? previous.images : [];
    const data = await buildProductData(req.body, req.files);
    const product = await productService.update(id, data);

    // Photos that were replaced or removed in this edit are no longer
    // referenced by anything - clean them up instead of leaving them on disk.
    if (data.images) {
      previousImages.filter((img) => !data.images.includes(img)).forEach(deleteProductImage);
    }

    return res.status(200).send(product);
  } catch (err) {
    res.status(500).send({ error: 'Something went wrong:\n' + err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const data = await buildProductData(req.body, req.files);
    if (!data.image) {
      data.image = 'default.png';
      data.images = [];
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
      const images = Array.isArray(product.images) ? product.images : [];
      images.forEach(deleteProductImage);
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
