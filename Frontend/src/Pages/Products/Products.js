import React, { Fragment, useState } from "react";
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

  return (
    <Fragment>
      <TopNavbar />
      <Container style={{ marginBottom: "5rem" }}>
        <br/>
        <div className="my-4">
          <h4 className="mb-4">Showing All Shoes</h4>
        </div>
        <Form>
          <InputGroup className="my-3">
            <Form.Control
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product name"
            />
          </InputGroup>
        </Form>
        <Row>
          {products &&
            products
              .filter((item) => {
                return search.toLocaleLowerCase() === ""
                  ? item
                  : item.name.toLocaleLowerCase().includes(search.toLocaleLowerCase());
              })
              .slice(firstItemIndex, lastItemIndex)
              .map((p) => {
                return (
                  <Col xs={12} sm={6} md={4} lg={3} className="mb-4" key={p.id}>
                    <ProductCard product={p} />
                  </Col>
                );
              })}
        </Row>
        <Pagination
          totalItems={products
            .filter((item) => {
              return search.toLocaleLowerCase() === ""
                ? item
                : item.name.toLocaleLowerCase().includes(search.toLocaleLowerCase());
            }).length}
          perPage={perPage}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      </Container>
      <Footer />
    </Fragment>
  );
};

export default Products;
