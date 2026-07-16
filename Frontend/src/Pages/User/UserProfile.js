import React, { useEffect, useState } from "react";
import Footer from "../../Components/Footer/Footer";
import TopNavbar from "../../Components/Header/TopNavbar";
import { Card, Col, Container, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import store from "../../Redux/Store";
import { userOrdersFetch } from "../../Redux/Order/OrderSlice";
import Pagination from "../../Components/Pagination/Pagination";
import AddressManager from "../../Components/Profile/AddressManager";
import PaymentMethodManager from "../../Components/Profile/PaymentMethodManager";

const UserProfile = () => {
  const orders = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Calling the store to get the orders again, in case they have changed
  useEffect(() => {
    store.dispatch(userOrdersFetch()).catch((error) => {
      console.log("No connection to cart on DB, " + error.message);
    });
  }, [dispatch]);

  const handleShowDetail = (id) => {
    navigate(`/order/${id}`);
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  const lastItemIndex = currentPage * perPage;
  const firstItemIndex = lastItemIndex - perPage;

  return (
    <div className="page-shell">
      <TopNavbar />
      <main className="page-main">
        <Container className="pb-5">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Account</span>
              <h2>My profile</h2>
            </div>
          </div>
          <Row className="g-3">
            <Col lg={4}>
              {user ? (
                <Card>
                  <Card.Body>
                    <span className="eyebrow">Details</span>
                    <p className="mt-2 mb-1"><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                    <p className="mb-1"><strong>Email:</strong> {user.email}</p>
                    <p className="mb-0"><strong>Phone:</strong> {user.phone}</p>
                  </Card.Body>
                </Card>
              ) : (
                <div className="alert alert-warning">User not found</div>
              )}
            </Col>

            <Col lg={8}>
              <Card>
                <Card.Body>
                  <span className="eyebrow">History</span>
                  <p className="mt-2 mb-3 fw-bold" style={{ fontFamily: "var(--font-display)", textTransform: "none" }}>My orders</p>
                  <div style={{ overflowX: "auto" }}>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Order</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders &&
                          orders.Orders.slice(firstItemIndex, lastItemIndex).map((item) => (
                            <tr key={item.id}>
                              <td>
                                <button className="btn-outline" onClick={() => handleShowDetail(item.id)}>
                                  #{item.id}
                                </button>
                              </td>
                              <td className="font-mono">{item.date.slice(0, 16).replace("T", " ")}</td>
                              <td className="text-capitalize">{item.status}</td>
                              <td>${item.total}</td>
                            </tr>
                          ))}
                      </tbody>
                    </Table>
                  </div>
                  <Pagination
                    totalItems={orders.Orders.length}
                    perPage={perPage}
                    setCurrentPage={setCurrentPage}
                    currentPage={currentPage}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="g-3 mt-1">
            <Col lg={6}>
              <Card>
                <Card.Body>
                  <AddressManager />
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6}>
              <Card>
                <Card.Body>
                  <PaymentMethodManager />
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

export default UserProfile;
