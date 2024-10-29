import React, { Fragment, useState } from "react";
import { Form, Button, Container, Row, Col, Card, Navbar, Image, Spinner, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../Components/Footer/Footer";
import "./Login.css";
import store from "../../Redux/Store";
import { cartFetch } from "../../Redux/Cart/CartSlice";
import { userOrdersFetch } from "../../Redux/Order/OrderSlice";
import { productsFetch } from "../../Redux/Product/ProductSlice";
import { categoriesFetch } from "../../Redux/Category/CategorySlice";
import { logUser } from "../../Redux/User/UserSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Make the login request
    store
      .dispatch(logUser({ email, password }))
      .unwrap()
      .then(() => {
        // Crea un array con todas las promesas de dispatch, para obtener y guardar los datos en el store
        const promises = [
          store.dispatch(cartFetch()),
          store.dispatch(userOrdersFetch()),
          store.dispatch(productsFetch()),
          store.dispatch(categoriesFetch()),
        ];

        // Usa Promise.all para esperar a que todas se resuelvan antes de avanzar
        Promise.all(promises)
          .then(() => {
            setIsLoading(false);
            navigate("/home");
          })
          .catch((error) => {
            console.log("Error en alguna de las peticiones, " + error.message);
          });
      })
      .catch((error) => {
        handleShow();
        setIsLoading(false);
      });
  };

  // Modal
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  return (
    <Fragment>
      <Navbar bg="dark" expand="lg" variant="dark">
        <Container>
          <Link to="/" className="navbar-brand">
            <Image src="../img/Nike.png" alt="Logo" style={{ height: "30px" }} />
          </Link>
        </Container>
      </Navbar>
      <div className="login-container d-flex flex-column min-vh-100"> {/* Agregamos d-flex y min-vh-100 */}
        <Container fluid className="flex-fill"> {/* Flex-fill para que ocupe el espacio disponible */}
          <Row className="w-100">
          <Col xs={10} sm={8} md={6} lg={4} className="left-align"> {/* Elimina mx-auto */}
              <Card className="p-4 shadow-lg login-card">
                <Card.Body>
                  <h3 className="text-center mb-4">Welcome back!</h3>
                  <p className="text-center mb-4">Please sign in with your account.</p>
                  <Form onSubmit={handleLogin}>
                    <Form.Group>
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mt-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Button
                      id="button-login"
                      type="submit"
                      className="w-100 mt-4"
                      style={{ backgroundColor: "#a21cff", border: "none" }}
                    >
                      {isLoading ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                          Loading...
                        </>
                      ) : (
                        "Log in"
                      )}
                    </Button>
                  </Form>
                  <br />
                  <Link to={"/Register"} style={{ textDecoration: "none" }}>
                    New? Sign in right now!
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
          <>
            <Modal.Header closeButton>
              <Modal.Title>Log in Error</Modal.Title>
            </Modal.Header>
            <Modal.Body>Wrong credentials</Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleClose}>Understood</Button>
            </Modal.Footer>
          </>
        </Modal>
        <Footer />
      </div>
    </Fragment>
  );
};

export default Login;
