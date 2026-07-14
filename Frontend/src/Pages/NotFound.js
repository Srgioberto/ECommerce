import React from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import Footer from "../Components/Footer/Footer";
import TopNavbar from "../Components/Header/TopNavbar";

const NotFound = () => {
  return (
    <div className="page-shell">
      <TopNavbar />
      <main className="page-main">
        <Container>
          <div className="m-auto w-100 text-center my-5">
            <span className="eyebrow d-block mb-2 justify-content-center">Error 404</span>
            <h1>This pair isn&apos;t in the stockroom</h1>
            <Link to="/home" className="btn-stamp d-inline-flex mt-3">
              Return to home
            </Link>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
