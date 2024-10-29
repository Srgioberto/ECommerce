const cartService = require('../services/cart');

const showCart = async (req, res) => {
  try {
    const cart = await cartService.findCartbyUserId(req?.currentUser?.id);
    res.status(200).send(cart);
  } catch (err) {
    res.status(500).send({ error: 'Something went wrong: ' + err.message });
  }
};

const addProductToCart = async (req, res) => {
  try {
    const { id: cartId } = await cartService.findCartbyUserId(
      req.currentUser.id
    );
    console.log('cartId', cartId);

    const updatedCart = await cartService.addProductToCart({
      ...req.body,
      CartId: cartId,
    });
    res.status(200).send(updatedCart);
  } catch (err) {
    res.status(500).send({ error: 'Something went wrong: ' + err.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const { id: cartId } = await cartService.findCartbyUserId(req.currentUser.id);

    const cart = await cartService.emptyCart(cartId);
    res.status(200).send(cart);
  } catch (err) {
    res.status(500).send({ error: 'Something went wrong: ' + err.message });
  }
};

const removeProduct = async (req, res) => {
  try {
    const { id: cartId } = await cartService.findCartbyUserId(
      req.currentUser.id
    );

    const updatedCart = await cartService.removeProductFromCart({
      ...req.body,
      CartId: cartId,
      userId: req.currentUser.id, //Not needed, delete if confirmed
    });
    res.status(200).send(updatedCart);
  } catch (err) {
    res.status(500).send({ error: 'Something went wrong: ' + err.message });
  }
};

module.exports = { showCart, addProductToCart, clearCart, removeProduct };
