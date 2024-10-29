import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, removeItem } from '../../Redux/Cart/CartSlice';

const CartItemCard = ({ cartItem, reportOutOfStock }) => {
  let [name, setName] = useState(null);
  let [price, setPrice] = useState(0);
  let [stock, setStock] = useState(null);
  let [image, setImage] = useState(null);
  const { products } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  useEffect(() => {
    let result = products.find((p) => p.id === parseInt(cartItem.ProductId));
    setName(result.name);
    setPrice(result.price);
    setImage(result.image);
    setStock(result.stock);
    reportOutOfStock(result.stock === 0);
  }, [cartItem, products, reportOutOfStock]);

  const handleRemove = (e) => {
    e.preventDefault();
    dispatch(removeItem(cartItem));
  };

  const handleAddQty = (e) => {
    e.preventDefault();
    if (cartItem.qty < stock) {
      let data = {
        cartItem,
        mode: 'plus'
      };
      dispatch(addItem(data));
    }
  };

  const handleMinusQty = (e) => {
    e.preventDefault();
    if (cartItem.qty > 1) {
      let data = {
        cartItem,
        mode: 'minus'
      };
      dispatch(addItem(data));
    }
  };

  return (
    <div className="cart-item">
      <div className="cart-product">
        <img src={`../img/products/${image}`} alt={name} />
        <div>
          <h3>{name}</h3>
          {stock < 1 ? (
            <p style={{ backgroundColor: 'red', borderRadius: '30px', textAlign: 'center' }}>
              Stock available: {stock}
            </p>
          ) : (
            <p>Stock available: {stock}</p>
          )}
          <button onClick={handleRemove}>Remove</button>
        </div>
      </div>
      <div className="cart-product-price">${price}</div>
      <div className="cart-product-quantity">
        <button onClick={handleMinusQty}>-</button>
        <div className="count">{cartItem.qty}</div>
        <button onClick={handleAddQty}>+</button>
      </div>
      <div className="cart-product-total-price">${cartItem.price * cartItem.qty}</div>
    </div>
  );
};

export default CartItemCard;
