import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { getProductImageUrl } from '../../utils/productImage';

const CartItemCheck = ({cartItem, styles}) => {
  let [name, setName] = useState(null);
  let [price, setPrice] = useState(0);
  let [image, setImage] = useState(null);
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    let result = products.find((p) => p.id === parseInt(cartItem.ProductId));
    setName(result.name);
    setPrice(result.price);
    setImage(result.image);
  }, [cartItem, products]);

  return (
    <div className={styles.cartItem}>
      <div className={styles.cartProduct}>
        <img src={getProductImageUrl(image)} alt={name} />
        <div>
          <h5>{name}</h5>
          {cartItem.size && <span className="sku">Size {cartItem.size}</span>}
        </div>
      </div>
      <div className={styles.cartProductPrice}>${price}</div>
      <div className={styles.count}>{cartItem.qty}</div>
      <div className={styles.total}>
        ${cartItem.price * cartItem.qty}
      </div>
    </div>

  )
}

export default CartItemCheck
