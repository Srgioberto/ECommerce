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
    <div className="cart-row">
      <div className="cart-row-product">
        <img src={`../img/products/${image}`} alt={name} />
        <div>
          <h3>{name}</h3>
          <span className={`tag-badge ${stock < 1 ? "tag-badge--stamp" : "tag-badge--court"}`}>
            {stock < 1 ? "Out of stock" : `${stock} in stock`}
          </span>
          <button className="cart-row-remove" onClick={handleRemove}>Remove</button>
        </div>
      </div>
      <div className="cart-row-price">${price}</div>
      <div className="cart-row-qty">
        <button onClick={handleMinusQty} aria-label="Decrease quantity">-</button>
        <span>{cartItem.qty}</span>
        <button onClick={handleAddQty} aria-label="Increase quantity">+</button>
      </div>
      <div className="cart-row-total">${cartItem.price * cartItem.qty}</div>
    </div>
  );
};

export default CartItemCard;
