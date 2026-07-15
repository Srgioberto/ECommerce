import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, removeItem } from '../../Redux/Cart/CartSlice';
import { getProductImageUrl } from '../../utils/productImage';

const CartItemCard = ({ cartItem, reportOutOfStock }) => {
  let [name, setName] = useState(null);
  let [price, setPrice] = useState(0);
  let [stock, setStock] = useState(null);
  let [image, setImage] = useState(null);
  const { products } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    let result = products.find((p) => p.id === parseInt(cartItem.ProductId));
    setName(result.name);
    setPrice(result.price);
    setImage(result.image);
    // If this line item has a size, cap quantity to that size's own stock
    // rather than the product's overall total.
    const sizeEntry =
      cartItem.size && Array.isArray(result.sizes) ? result.sizes.find((s) => s.size === cartItem.size) : null;
    const availableStock = sizeEntry ? sizeEntry.stock : result.stock;
    setStock(availableStock);
    reportOutOfStock(availableStock === 0);
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
        <img src={getProductImageUrl(image)} alt={name} />
        <div>
          <h3>{name}</h3>
          {cartItem.size && <span className="sku d-block mb-1">Size {cartItem.size}</span>}
          <span className={`tag-badge ${stock < 1 ? "tag-badge--stamp" : "tag-badge--court"}`}>
            {stock < 1 ? "Out of stock" : user?.admin ? `${stock} in stock` : "In stock"}
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
