import React from "react";
import { useSelector } from "react-redux";
import { Card, Col, Container, Row } from "react-bootstrap";
import TopNavbar from "../../Components/Header/TopNavbar";
import Footer from "../../Components/Footer/Footer";
import CartCheckoutForm from "../../Components/Cart/CartCheckoutForm";
import CartItemCheck from "../../Components/Cart/CartItemCheck";
import styles from "./cartCheckout.module.css";

const CartCheckout = () => {
  const cart = useSelector((state) => state.cart);
  return (
    <div className="page-shell">
      <TopNavbar />
      <main className="page-main">
        <Container className="pb-5">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Step 2 of 2</span>
              <h2>Checkout</h2>
            </div>
          </div>
          <Row className="g-4">
            <Col xs={12} lg={6}>
              <Card>
                <Card.Body>
                  <span className="eyebrow d-block mb-3">Order summary</span>
                  <div className={styles.cartContainer} style={{ padding: 0 }}>
                    <div className={styles.titles}>
                      <span>Product</span>
                      <span>Price</span>
                      <span>Qty</span>
                      <span>Total</span>
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
                      <span>Total price of the order</span>
                      <span className="font-display">${cart.total}</span>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} lg={6}>
              <Card>
                <Card.Body>
                  <span className="eyebrow d-block mb-3">Shipping details</span>
                  <CartCheckoutForm />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default CartCheckout;
