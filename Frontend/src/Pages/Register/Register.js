import React, { Fragment, useState } from "react";
import { Button, Card, Col, Container, Form, Image, Modal, Navbar, Row, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import "./Register.css";
import Footer from "../../Components/Footer/Footer";
import { registerUser } from "../../Redux/User/UserSlice";
import { Link, useNavigate } from "react-router-dom";
import store from "../../Redux/Store";
import { cartFetch } from "../../Redux/Cart/CartSlice";
import { userOrdersFetch } from "../../Redux/Order/OrderSlice";
import { productsFetch } from "../../Redux/Product/ProductSlice";
import { categoriesFetch } from "../../Redux/Category/CategorySlice";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    password2: "",
  });
  //error array para almacenar los errores de cada input si es que hay
  const [errors, setErrors] = useState({});

  //Validacion de los valores en form
  const validateForm = () => {
    const newErrors = {};

    // Validación nombre
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required!!";
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters!!";
    }

    // Validación apellido
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required!!";
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters!!";
    }

    // Validación teléfono
    const phoneRegex = /^\+?[0-9]+$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required!!";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Phone number must only contain digits and/or a plus at the start!!";
    } else if (formData.phone.length < 10) {
      newErrors.phone = "Phone number must be at least 10 digits!!";
    }

    // Validación email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required!!!";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format!!";
    }

    // Validación password
    if (!formData.password) {
      newErrors.password = "Password is required!!";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters!!";
    }

    // Validación para confirmar contraseña
    if (!formData.password2) {
      newErrors.password2 = "Please confirm your password!!";
    } else if (formData.password !== formData.password2) {
      newErrors.password2 = "Both Passwords do not match!!";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const validateErrors = validateForm();
    if (Object.keys(validateErrors).length === 0) {
      dispatch(registerUser(formData))
        .unwrap()
        .then(() => {
          setFormData({ firstName: "", lastName: "", phone: "", email: "", password: "", password2: "" });
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
              setSuccess(true);
              handleShow();
              setIsLoading(false);
            })
            .catch((error) => {
              console.log("Error en alguna de las peticiones, " + error.message);
            });
        })
        .catch(() => {
          setSuccess(false);
          handleShow();
          setIsLoading(false);
        });
    } else {
      setErrors(validateErrors);
      setIsLoading(false);
    }
  };

  //Modal
  const [success, setSuccess] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    if (success) {
      navigate("/home");
    }
  };
  const handleShow = () => setShow(true);

  return (
    <Fragment>
      <Navbar bg="dark" expand="lg" variant="dark">
        <Container>
          <Link to="/" className="navbar-brand">
            <Image
              src="../img/Nike.png"
              alt="Logo"
              style={{ height: "30px" }} // Ajusta la altura del logo según lo necesites
            />
          </Link>
        </Container>
      </Navbar>
      <Container fluid className="register-container">
        <Row className="justify-content-md-center">
          <Col xs={12} md={6}>
            <Card className="bg-dark text-white">
              <Card.Body>
                <h2 className="mb-4">Register</h2>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col xs={12} md={6}>
                      <Form.Group className="mb-3" id="formFirstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="Enter your first name"
                          required
                        />
                      </Form.Group>
                      {errors.firstName && <div className="text-danger">{errors.firstName}</div>}
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group className="mb-3" id="formLastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Enter your last name"
                          required
                        />
                      </Form.Group>
                      {errors.lastName && <div className="text-danger">{errors.lastName}</div>}
                    </Col>
                  </Row>

                  <Form.Group className="mb-3" id="formPhone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      required
                    />
                    {errors.phone && <div className="text-danger">{errors.phone}</div>}
                  </Form.Group>

                  <Form.Group className="mb-3" id="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                    {errors.email && <div className="text-danger">{errors.email}</div>}
                  </Form.Group>
                  <Row>
                    <Col xs={12} md={6}>
                      <Form.Group className="mb-3" id="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Enter password"
                          required
                        />
                        {errors.password && <div className="text-danger">{errors.password}</div>}
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group className="mb-3" id="formPassword2">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="password2"
                          value={formData.password2}
                          onChange={handleChange}
                          placeholder="Confirm password"
                          required
                        />
                        {errors.password2 && <div className="text-danger">{errors.password2}</div>}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button
                    variant="primary"
                    type="submit"
                    className="mt-3"
                    disabled={isLoading}
                    style={{ backgroundColor: "#a21cff", border: "none" }}
                  >
                    {isLoading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                        Registering...
                      </>
                    ) : (
                      "Register"
                    )}
                  </Button>
                </Form>
                <br />
                <Link to="/login" style={{ textDecoration: "none" }}>
                  Already have an account? Go Log in!
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        {success ? (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Register success</Modal.Title>
            </Modal.Header>
            <Modal.Body>Succesfully created your new account</Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleClose}>
                Understood
              </Button>
            </Modal.Footer>
          </>
        ) : (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Register Error</Modal.Title>
            </Modal.Header>
            <Modal.Body>Account with that email already exists</Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleClose}>
                Understood
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
      <Footer />
    </Fragment>
  );
};

export default Register;
