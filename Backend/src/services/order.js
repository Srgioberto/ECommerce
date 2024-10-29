const { Order, OrderItem, Product } = require('../config');
const cartService = require('./cart');

class OrderService {
  async createOrder(data) {
    //Get the cart to get the CartItems and total
    const cart = await cartService.findCartbyUserId(data.UserId);

    //We verify that the cart has items on it
    if (cart.total === 0 && cart.CartItems.length === 0) {
      //If not, then we throw the error.
      throw new Error('Cart has no items');
    } else {
      //If it has items, then we create the order adding the User id as FK
      const order = Order.build({
        status: 'confirmed',
        total: cart.total,
        date: new Date(),
        UserId: data.UserId,
        address1: data.address1,
        address2: data.address2,
        province: data.province,
        city: data.city,
        country: data.country,
      });
      await order.save();

      //Use the CartItems to create each OrderItems
      const Items = cart.CartItems;
      await Items.forEach(async (Item) => {
        //get the product for the value and stock
        const product = await Product.findByPk(Item.ProductId);

        //create the OrderItem
        const orderItemData = await OrderItem.build({
          qty: Item.qty,
          price: product.price,
          OrderId: order.id,
          ProductId: Item.ProductId,
        });
        //save the OrderItem
        await orderItemData.save();

        //We decrease the product stock by the quantity sold
        await product.decrement({ stock: Item.qty });
      });

      //Once done with all the OrderItems we empty the cart and return the order
      await cartService.emptyCart(cart.id);

      return order;
    }
  }

  async updateOrder(data) {
    //update the Order Data based on the values given
    console.log(data.OrderId);
    //the update will update only the values given in the data, so if we don't give a country it won't overwrite it with a null
    await Order.update(
      {
        status: data.status,
        address1: data.address1,
        address2: data.address2,
        province: data.province,
        city: data.city,
        country: data.country,
      },
      {
        where: { id: data.OrderId },
      }
    );
    const order = await Order.findByPk(data.OrderId);
    if (order === null) {
      throw new Error('Order not found');
    } else {
      return order;
    }
  }

  async getUserOrders(UserId) {
    //we get all Orders made by the user of the given Id
    const orders = await Order.findAll({
      where: { UserId: UserId },
      include: [OrderItem],
    });
    return orders;
  }

  async getAllOrders() {
    //we get all the existing orders
    const orders = await Order.findAll({ include: [OrderItem] });
    return orders;
  }

  async getAllOrdersWithProduct(id) {
    //we get all the existing orderItem that has the item
    const orders = await OrderItem.findAll({ where: {ProductId: id} });
    return orders;
  }
}

module.exports = new OrderService();
