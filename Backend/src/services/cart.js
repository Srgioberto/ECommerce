const { Cart, CartItem, Product } = require('../config');

class CartService {
  async createCart(userId) {
    //Create the cart adding the User id as FK
    const cart = Cart.build({
      total: 0,
      date: new Date(),
      UserId: userId,
    });
    await cart.save();
    return cart;
  }

  async updateItemPrices(cart){
    //Use the CartItems to get the values
    const Items = cart.CartItems;
    let total=0;
    Items.forEach(async (Item) => {
      //get the product for the value
      const product = Product.findByPk(Item.ProductId);
      //update the CartItem
      Item.update({price: product.price});
      total +=(Item.price*Item.qty);
    });
    cart.update({total: total});
  }

  async findCartbyId(id) {
    //find the Cart by his own Id
    const cart = await Cart.findByPk(id, { include: [CartItem] });
    if (cart === null) {
      throw new Error('Cart not found');
    } else {
      //we update the values of the cart in case there has been changes in the products price
      await this.updateItemPrices(cart);
      return cart;
    }
  }

  async findCartbyUserId(userId) {
    //Find the Cart by the User Id that owns the cart.
    const cart = await Cart.findOne({
      where: { UserId: userId },
      include: [CartItem],
    });
    if (cart === null) {
      throw new Error('User cart not found');
    } else {
      //we update the values of the cart in case there has been changes in the products price
      await this.updateItemPrices(cart);
      return cart;
    }
  }

  async updateCart(data) {
    //update the Cart Data based on the values given
    await Cart.update(
      {
        total: data.total,
        date: new Date(),
      },
      {
        where: { id: data.id },
      }
    );
    const cart = await Cart.findAll({ where: { id: data.id } });
    if (cart === null) {
      throw new Error('Cart not found');
    } else {
      return cart;
    }
  }

  async addProductToCart(data) {
    // Verify if the item already exists in the Cart
    const exists = await CartItem.findOne({
      where: {
        CartId: data.CartId,
        ProductId: data.ProductId,
      },
    });
    // Get the product price
    const { price: productPrice } = await Product.findByPk(data.ProductId);
    if (!exists) {
      //item doesn't exists in the cart -> building item and saving it on DB, update to Cart total
      const item = await CartItem.build({
        qty: data.qty,
        price: productPrice,
        CartId: data.CartId,
        ProductId: data.ProductId,
      });
      await item.save();
    } else {
      //item already exists in the Cart -> update the CartItem quantity info about the item
      const difference = data.qty - exists.qty;
      await CartItem.increment(
        { qty: +difference },
        { where: { id: exists.id } }
      );
    }
    //update the date of modification on the cart
    await Cart.update({ date: new Date() }, { where: { id: data.CartId } });
    //Use the function to get the cart, update his total value and return it
    return await this.findCartbyId(data.CartId);
  }

  async removeProductFromCart(data) {
    //Find the item in the cart
    const item = await CartItem.findOne({
      where: {
        CartId: data.CartId,
        ProductId: data.ProductId,
      },
    });
    if (!item) {
      //if its not in the cart
      throw new Error('Product already not in the cart');
    } else {
      //delete the item from the cart
      await item.destroy();
    }
    //update the date of change in the cart
    await Cart.update({ date: new Date() }, { where: { id: data.CartId } });
    //Use the function to get the cart and also update the total
    return await this.findCartbyId(data.CartId);
  }

  async emptyCart(cartId) {
    //Destroy all CartItems that has the Cart to clear the cart.
    await CartItem.destroy({
      where: { CartId: cartId },
    });
    //Restore the Cart values to  default.
    await Cart.update(
      {
        total: 0,
        date: new Date(),
      },
      { where: { id: cartId } }
    );
    //Use the function to get the cart and return it
    return await this.findCartbyId(cartId);
  }

  async removeItemfromAllCarts(id) {
    //Destroy all CartItems that has the item in cart.
    await CartItem.destroy({ where: { ProductId: id },
    });
  }
}

module.exports = new CartService();
