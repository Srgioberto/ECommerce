import React, { useEffect, useState } from "react";
import TopNavbar from "../../Components/Header/TopNavbar";
import Footer from "../../Components/Footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import CartItemCard from "../../Components/Cart/CartItemCard";
import { cartFetch, emptyCart } from "../../Redux/Cart/CartSlice";
import store from "../../Redux/Store";
import { productsFetch } from "../../Redux/Product/ProductSlice";
import "./Cart.css";

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [outOfStock, setOutOfStock] = useState(false);

  // Function that will receive the status of the children about whether a product is out of stock
  const handleOutOfStock = (isOutOfStock) => {
    if (isOutOfStock) {
      setOutOfStock(true); // Will disable the button if any item is out of stock
    }
  };

  // Calling the store to get the cart and products in case they undergo changes
  useEffect(() => {
    store.dispatch(productsFetch()).catch((error) => {
      console.log("No connection to cart on DB, " + error.message);
    });
    store.dispatch(cartFetch()).catch((error) => {
      console.log("No connection to cart on DB, " + error.message);
    });
  }, [dispatch]);

  const handleClear = (e) => {
    e.preventDefault();
    dispatch(emptyCart());
  };

  const handleBuy = (e) => {
    e.preventDefault();
    navigate("/CartCheckout");
  };

  return (
    <div className="page-shell">
      <TopNavbar />
      <main className="page-main">
        <Container className="pb-5">
          {!cart.CartItems.length && (
            <div className="m-auto w-100 text-center my-5">
              <span className="eyebrow d-block mb-2 justify-content-center">Empty bag</span>
              <h1>Nothing in your cart yet</h1>
              <Link to="/home" className="btn-stamp d-inline-flex mt-3">
                Start shopping
              </Link>
            </div>
          )}
          {cart.CartItems.length > 0 && (
            <>
              <div className="section-heading">
                <div>
                  <span className="eyebrow">{cart.CartItems.length} item(s)</span>
                  <h2>Shopping bag</h2>
                </div>
              </div>
              <Row className="g-4">
                <Col lg={8}>
                  <div className="cart-list">
                    <div className="cart-list-head">
                      <span>Product</span>
                      <span>Price</span>
                      <span>Quantity</span>
                      <span className="text-end">Total</span>
                    </div>
                    <div className="perforation" />
                    {cart.CartItems.map((cartItem) => (
                      <CartItemCard key={cartItem.ProductId} cartItem={cartItem} reportOutOfStock={handleOutOfStock} />
                    ))}
                  </div>
                </Col>
                <Col lg={4}>
                  <div className="cart-summary receipt-edge">
                    <span className="eyebrow">Order summary</span>
                    <div className="cart-summary-total">
                      <span>Total</span>
                      <span className="font-display">${cart.total}</span>
                    </div>
                    <p className="cart-summary-note">Shipping and taxes calculated at checkout.</p>

                    {outOfStock ? (
                      <>
                        <button className="btn-stamp w-100" disabled>
                          Checkout
                        </button>
                        <p className="cart-summary-warning">
                          Item(s) in your bag have 0 stock to sell — please remove them and refresh.
                        </p>
                      </>
                    ) : (
                      <button className="btn-stamp w-100" onClick={handleBuy}>
                        Checkout
                      </button>
                    )}
                    <button className="btn-outline w-100 mt-2" onClick={handleClear}>
                      Clear bag
                    </button>
                    <Link to="/home" className="cart-continue">
                      &larr; Continue shopping
                    </Link>
                  </div>
                </Col>
              </Row>
            </>
          )}
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
