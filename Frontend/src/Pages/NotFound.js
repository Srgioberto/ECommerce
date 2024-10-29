import React, { Fragment } from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import Footer from "../Components/Footer/Footer";
import TopNavbar from "../Components/Header/TopNavbar";

const NotFound = () => {
  return (
    <Fragment>
      <TopNavbar />
      <Container>
        <div className="m-auto w-100 text-center my-5">
          <h1 className="text-danger">(0o0) Page Not Found</h1>
          <Link to="/Home" className="text-dark text-decoration-none fs-5">
            Return to Home Page
          </Link>
        </div>
      </Container>
      <Footer />
    </Fragment>
  );
};

export default NotFound;
