import React from "react";
import { useParams } from "react-router-dom";
import { Table } from "react-bootstrap";
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
    return <div>Order not found</div>;
  }

  return (
    <div className="page-container">
      <TopNavbar />
      <div className="container mt-4" style={{ marginTop: "6rem", marginBottom: "6rem" }}>
        {/* Header with the order number */}
        <h1 className="text-center">Order N°{order.id} Details</h1>
        <br/>
        {/* Order information */}
        <div className={`card p-3 mb-4 ${styles.orderInfoCard}`}>
          <h3 className="text-center">Order Information</h3>
          <hr />
          <div className="row">
            <div className="col-md-6">
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Date:</strong> {order.date.slice(0, 16).replace("T", " ")}</p>
              <p><strong>Street:</strong> {order.address1}</p>
              <p><strong>Number/Letter:</strong> {order.address2}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Province:</strong> {order.province}</p>
              <p><strong>City:</strong> {order.city}</p>
              <p><strong>Country:</strong> {order.country}</p>
            </div>
          </div>
        </div>

        {/* Product table */}
        <div className={`card p-3 ${styles.tableContainer}`}>
          <h4>Order Items</h4>
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
          <div className="d-flex justify-content-end mt-4">
            <h5>Order Total: ${order.total}</h5>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderDetail;
