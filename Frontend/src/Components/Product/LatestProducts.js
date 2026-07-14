import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import ProductCard from "./Card/ProductCard";
import { useSelector } from "react-redux";

const LatestProducts = () => {
  const { products } = useSelector((state) => state.products);
  return (
    <Container className="my-5 py-3">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Fresh on the bench</span>
          <h2>Latest drops</h2>
        </div>
      </div>
      <Row className="g-3">
        {products &&
          products.slice(-6).map((product) => {
            return (
              <Col xs={6} sm={6} md={4} lg={3} key={product.id}>
                <ProductCard product={product} />
              </Col>
            );
          })}
      </Row>
    </Container>
  );
};

export default LatestProducts;
