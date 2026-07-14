import React, { useEffect, useState } from "react";
import { Table, Card, Container, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import TopNavbar from "../../Components/Header/TopNavbar";
import Footer from "../../Components/Footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { ordersFetch, updateOrder } from "../../Redux/Order/OrderSlice";
import Pagination from "../../Components/Pagination/Pagination";
import styles from './OrderList.module.css';

const OrderList = () => {
  const orders = useSelector((state) => state.orders);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(ordersFetch());
  }, [dispatch]);

  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const handleClose = () => setShowModal(false);

  const handleShow = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowModal(true);
  };

  const handleUpdateStatus = (e) => {
    e.preventDefault();
    dispatch(updateOrder({ ...selectedOrder, status: newStatus }));
    handleClose();
  };

  const handleShowDetail = (order) => {
    navigate(`/order/${order.id}`);
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const lastItemIndex = currentPage * perPage;
  const firstItemIndex = lastItemIndex - perPage;

  return (
    <div className="page-shell">
      <TopNavbar />
      <main className="page-main">
        <Container fluid className="pb-5">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Admin</span>
              <h2>Manage orders</h2>
            </div>
          </div>
          <Card>
            <Card.Body>
              <div className={styles.tableContainer}>
                <Table striped bordered hover className={styles.responsiveTable}>
                  <thead>
                    <tr>
                      <th>N° Order</th>
                      <th>State</th>
                      <th>Total</th>
                      <th>Date</th>
                      <th>Address</th>
                      <th className="d-none d-lg-table-cell">Province</th>
                      <th className="d-none d-lg-table-cell">City</th>
                      <th className="d-none d-lg-table-cell">Country</th>
                      <th>User</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders &&
                      orders.Orders.slice(firstItemIndex, lastItemIndex).map((order) => (
                        <tr key={order.id}>
                          <td className="text-center">{order.id}</td>
                          <td className="text-capitalize">{order.status}</td>
                          <td>${order.total}</td>
                          <td className="font-mono">{order.date.slice(0, 16).replace("T", " ")}</td>
                          <td className="d-lg-none">
                            {order.address}, {order.province}, {order.city}, {order.country}
                          </td>
                          <td className="d-none d-lg-table-cell">
                            {order.address1} {order.address2}
                          </td>
                          <td className="d-none d-lg-table-cell">{order.province}</td>
                          <td className="d-none d-lg-table-cell">{order.city}</td>
                          <td className="d-none d-lg-table-cell">{order.country}</td>
                          <td>{order.UserId}</td>
                          <td className="text-center">
                            <div className="d-flex flex-column gap-1">
                              <button className="btn-outline btn-sm" onClick={() => handleShow(order)}>
                                Update state
                              </button>
                              <button className="btn-ink btn-sm" onClick={() => handleShowDetail(order)}>
                                Details
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
          <Pagination
            totalItems={orders.Orders.length}
            perPage={perPage}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
        </Container>
      </main>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update state of order N°: {selectedOrder?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateStatus}>
            <Form.Group controlId="formStatus">
              <Form.Label>Order state</Form.Label>
              <Form.Control
                as="select"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="canceled">Canceled</option>
              </Form.Control>
            </Form.Group>
            <div className="text-end mt-3">
              <button className="btn-stamp" type="submit">
                Update state
              </button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      <Footer />
    </div>
  );
};

export default OrderList;
