import React, { useState } from "react";
import TopNavbar from "../../Components/Header/TopNavbar";
import Footer from "../../Components/Footer/Footer";
import { useSelector } from "react-redux";
import { Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import ProductCard from "../../Components/Product/Card/ProductCard";
import Pagination from "../../Components/Pagination/Pagination";

const Products = () => {
  const [search, setSearch] = useState("");
  const { products } = useSelector((state) => state.products);

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 12;

  const lastItemIndex = currentPage * perPage;
  const firstItemIndex = lastItemIndex - perPage;

  const filtered = products.filter((item) =>
    search.toLocaleLowerCase() === ""
      ? item
      : item.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
  );

  return (
    <div className="page-shell">
      <TopNavbar />
      <main className="page-main">
        <Container className="my-4 pb-5">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Full catalog</span>
              <h2>All shoes</h2>
            </div>
          </div>
          <Form>
            <InputGroup className="mb-4">
              <Form.Control
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by product name"
              />
            </InputGroup>
          </Form>
          <Row className="g-3">
            {filtered.slice(firstItemIndex, lastItemIndex).map((p) => (
              <Col xs={6} sm={6} md={4} lg={3} key={p.id}>
                <ProductCard product={p} />
              </Col>
            ))}
          </Row>
          <Pagination
            totalItems={filtered.length}
            perPage={perPage}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
