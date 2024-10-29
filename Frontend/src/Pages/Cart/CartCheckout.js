import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { Card } from "react-bootstrap";
import TopNavbar from "../../Components/Header/TopNavbar";
import Footer from "../../Components/Footer/Footer";
import CartCheckoutForm from "../../Components/Cart/CartCheckoutForm";
import CartItemCheck from "../../Components/Cart/CartItemCheck";
import styles from "./cartCheckout.module.css"

const CartCheckout = () => {
  const cart = useSelector((state) => state.cart);
  return (
    <Fragment>
      <TopNavbar />
      <h1 className="text-center mt-5 ">Cart CheckOut</h1>
      <div className="row mx-1 container-fluid" style={{ marginBottom: "5rem" }}>
        <div className="col-12 col-lg-6 mt-5">
          <Card>
            <Card.Body>
              <div className={styles.cartContainer} style={{ padding: 0 }}>
                <div className={styles.titles}>
                  <h5 className="product-title">Product</h5>
                  <h5 className="price">Price</h5>
                  <h5 className="quantity">Quantity</h5>
                  <h5 className="total">Total</h5>
                </div>
                {cart.CartItems &&
                  cart.CartItems.map((cartItem) => {
                    return (
                      <div key={cartItem.ProductId}>
                        <CartItemCheck cartItem={cartItem} styles={styles} />
                      </div>
                    );
                  })}
              </div>
              <div className={styles.cartCheckout}>
                <div className={styles.cartCheckoutTotal}>
                  <span>Total price of the Order:</span>
                  <span className="amount">${cart.total}</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className="col-12 col-lg-6 mt-5 order-lg-1 order-0" data-bs-theme="dark">
          <Card>
            <Card.Body>
              <Card.Title className="text-center">Order Shipping Data</Card.Title>
              <CartCheckoutForm />
            </Card.Body>
          </Card>
        </div>
      </div>

      <Footer />
    </Fragment>
  );
};

export default CartCheckout;
