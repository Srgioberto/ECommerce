import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Card } from "react-bootstrap";
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
    <div className="container-fluid p-0" style={{ marginBottom: "6rem" }}>
      <TopNavbar />
      <h1 className="text-center" style={{ marginTop: "5rem" }}>Orders Management</h1>
      <br/>
      <Card className="m-2">
        <Card.Body>
          {/* Aplica la clase tableContainer al contenedor de la tabla */}
          <div className={styles.tableContainer}>
            {/* Aplica la clase responsiveTable a la tabla */}
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
                      <td>{order.status}</td>
                      <td>${order.total}</td>
                      <td>{order.date.slice(0, 16).replace("T", " ")}</td>
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
                        <Button variant="outline-warning m-1" onClick={() => handleShow(order)}>
                          Update state
                        </Button>
                        <Button variant="outline-info m-1" onClick={() => handleShowDetail(order)}>
                          Details
                        </Button>
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
              <Button variant="outline-secondary" type="submit">
                Update State
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      <Footer />
    </div>
  );
};

export default OrderList;
