import React from "react";
import { useParams } from "react-router-dom";
import { Card, Container, Table } from "react-bootstrap";
import TopNavbar from "../../Components/Header/TopNavbar";
import Footer from "../../Components/Footer/Footer";
import { useSelector } from "react-redux";
import styles from './OrderList.module.css';

const OrderDetail = () => {
  const { id } = useParams();
  const orders = useSelector((state) => state.orders);
  const orderId = parseInt(id);
  const { products } = useSelector((state) => state.products);
  const order = orders.Orders.find((order) => order.id === orderId);

  if (!order) {
    return (
      <div className="page-shell">
        <TopNavbar />
        <main className="page-main">
          <Container className="pb-5 text-center">
            <span className="eyebrow">404</span>
            <h1 className="mt-2">Order not found</h1>
          </Container>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-shell">
      <TopNavbar />
      <main className="page-main">
        <Container className="pb-5">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Order</span>
              <h2>#{order.id}</h2>
            </div>
            <span className="tag-badge tag-badge--court text-capitalize">{order.status}</span>
          </div>

          <Card className={`p-3 mb-4 ${styles.orderInfoCard}`}>
            <span className="eyebrow mb-3">Shipping details</span>
            <div className="row mt-2">
              <div className="col-md-6">
                <p><strong>Date:</strong> <span className="font-mono">{order.date.slice(0, 16).replace("T", " ")}</span></p>
                <p><strong>Street:</strong> {order.address1}</p>
                <p><strong>Number/Letter:</strong> {order.address2}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Province:</strong> {order.province}</p>
                <p><strong>City:</strong> {order.city}</p>
                <p><strong>Country:</strong> {order.country}</p>
              </div>
            </div>
          </Card>

          <Card className="p-3">
            <span className="eyebrow mb-3">Items</span>
            <div className={styles.tableContainer}>
              <div className={styles.tableResponsive}>
                <Table striped bordered hover className={styles.responsiveTable}>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Name</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.OrderItems &&
                      order.OrderItems.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <img
                              className={styles.productImage}
                              src={`../img/products/${products.find((p) => p.id === item.ProductId).image}`}
                              alt={item.name}
                            />
                          </td>
                          <td>{products.find((p) => p.id === item.ProductId).name}</td>
                          <td>{item.qty}</td>
                          <td>${item.price}</td>
                          <td>${item.qty * item.price}</td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </div>
            </div>
            <div className="d-flex justify-content-end mt-2">
              <p className="font-display m-0" style={{ fontSize: "1.5rem", textTransform: "none" }}>Total ${order.total}</p>
            </div>
          </Card>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default OrderDetail;
