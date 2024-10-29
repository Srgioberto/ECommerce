import React, { Fragment, useEffect, useState } from "react";
import TopNavbar from "../../Components/Header/TopNavbar";
import Footer from "../../Components/Footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import CartItemCard from "../../Components/Cart/CartItemCard";           /* Cart */
import { cartFetch, emptyCart } from "../../Redux/Cart/CartSlice";
import store from "../../Redux/Store";
import { productsFetch } from "../../Redux/Product/ProductSlice";

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
    <Fragment>
      <TopNavbar />
      <Container style={{ marginBottom: "4rem" }}> {/* Aquí se agrega el margin-bottom */}
        <Row>
          {!cart.CartItems.length && (
            <div className="m-auto w-100 text-center my-5">
              <h1 className="text-danger">(0o0) Nothing on the cart yet!</h1>
              <Link to="/" className="text-dark text-decoration-none fs-5">
                Return to Buy!
              </Link>
            </div>
          )}
          {cart.CartItems.length > 0 && (
            <div className="cart-container">
              <h2>Shopping Cart</h2>
              <div className="titles">
                <h3 className="product-title">Product</h3>
                <h3 className="price">Price</h3>
                <h3 className="quantity">Quantity</h3>
                <h3 className="total">Total</h3>
              </div>
              
              <div className="cart-items">
                {cart.CartItems.map((cartItem) => {
                  return (
                    <div key={cartItem.ProductId}>
                      <CartItemCard cartItem={cartItem} reportOutOfStock={handleOutOfStock} />
                    </div>
                  );
                })}
              </div>
              <div className="cart-summary">
                <button className="clear-btn" onClick={handleClear}>
                  Clear Cart
                </button>
                <div className="cart-checkout">
                  <div className="total">
                    <span>Total</span>
                    <span className="amount">${cart.total}</span>
                  </div>
                  <hr />
                  {outOfStock ? (
                    <>
                      <button disabled style={{ backgroundColor: "gray" }}>
                        Checkout
                      </button>
                      <p>Item(s) in your cart have 0 stock to sell, please remove them and refresh</p>
                    </>
                  ) : (
                    <button onClick={handleBuy} style={{ backgroundColor: "#a21cff", color: "#fff" }}>
                      Checkout
                    </button>
                  )}
                  <div className="continue-shopping">
                    <Link to="/home">
                      <span> Continue Shopping</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Row>
      </Container>
      <Footer />
    </Fragment>
  );
};

export default Cart;
