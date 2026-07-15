import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addItem, removeItem } from "../../Redux/Cart/CartSlice";
import { useCartDrawer } from "./CartDrawerContext";
import { getProductImageUrl } from "../../utils/productImage";
import "./CartDrawer.css";

const CartDrawer = () => {
  const { isOpen, closeDrawer } = useCartDrawer();
  const cart = useSelector((state) => state.cart);
  const { products } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  const getProduct = (id) => products.find((p) => p.id === parseInt(id));

  const getAvailableStock = (product, size) => {
    const sizeEntry = size && Array.isArray(product.sizes) ? product.sizes.find((s) => s.size === size) : null;
    return sizeEntry ? sizeEntry.stock : product.stock;
  };

  return (
    <>
      <div
        className={`cart-drawer-backdrop ${isOpen ? "is-open" : ""}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />
      <aside className={`cart-drawer ${isOpen ? "is-open" : ""}`} aria-hidden={!isOpen} aria-label="Shopping bag">
        <div className="cart-drawer-head">
          <span className="eyebrow">Your bag &middot; {cart.CartItems.length} item(s)</span>
          <button type="button" className="cart-drawer-close" onClick={closeDrawer} aria-label="Close cart">
            &times;
          </button>
        </div>

        {cart.CartItems.length === 0 ? (
          <div className="cart-drawer-empty">
            <p>Your bag is empty.</p>
            <Link to="/home" className="btn-stamp" onClick={closeDrawer}>
              Start shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-drawer-items">
              {cart.CartItems.map((item, index) => {
                const product = getProduct(item.ProductId);
                if (!product) return null;
                const availableStock = getAvailableStock(product, item.size);
                return (
                  <div className="cart-drawer-row" style={{ "--i": index }} key={`${item.ProductId}-${item.size ?? ""}`}>
                    <img src={getProductImageUrl(product.image)} alt={product.name} />
                    <div className="cart-drawer-row-info">
                      <p className="cart-drawer-row-name">{product.name}</p>
                      <span className="sku">
                        {item.size && `Size ${item.size} · `}${item.price} &times; {item.qty}
                      </span>
                      <div className="cart-drawer-qty">
                        <button
                          type="button"
                          onClick={() => item.qty > 1 && dispatch(addItem({ cartItem: item, mode: "minus" }))}
                          aria-label="Decrease quantity"
                        >
                          &minus;
                        </button>
                        <span>{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => item.qty < availableStock && dispatch(addItem({ cartItem: item, mode: "plus" }))}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="cart-drawer-remove"
                      onClick={() => dispatch(removeItem(item))}
                      aria-label={`Remove ${product.name}`}
                    >
                      &times;
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="cart-drawer-foot">
              <div className="cart-drawer-total">
                <span>Total</span>
                <span className="font-display">${cart.total}</span>
              </div>
              <Link to="/CartCheckout" className="btn-stamp w-100" onClick={closeDrawer}>
                Checkout
              </Link>
              <Link to="/Cart" className="btn-outline w-100 mt-2" onClick={closeDrawer}>
                View full bag
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;
