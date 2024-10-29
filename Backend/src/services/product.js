const { Product, Category } = require('../config');

class ProductService {
  async create(productData) {
    const product = Product.build(productData);
    await product.save();
    return product;
  }

  find() {
    return Product.findAll();
  }

  findCategories() {
    return Category.findAll();
  }

  async findById(productId) {
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new Error('product not found');
    }
    return product;
  }

  async update(id, updatedData) {
    await Product.update(updatedData, { where: { id } });
    const productUpdated = await this.findById(id);
    return productUpdated;
  }

  async delete(id) {
    const product = await Product.findByPk(id);
    if (!product) throw new Error('product not found');
    await product.destroy();
    return product;
  }
}

module.exports = new ProductService();
