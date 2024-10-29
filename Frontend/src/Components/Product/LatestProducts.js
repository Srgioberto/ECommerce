import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import ProductCard from "./Card/ProductCard";
import { useSelector } from "react-redux";

const LatestProducts = () => {
  const { products } = useSelector((state) => state.products);
  return (
    <Container style={{ marginBottom: "3rem" }}>
      <h3 className="text-center mb-4">Latest Products</h3>
      <Row>
        {products &&
          products.slice(-6).map((product) => {
            return (
              <Col xs={12} sm={6} md={4} lg={3} className="mb-4" key={product.id}>
                <ProductCard product={product} />
              </Col>
            );
          })}
      </Row>
    </Container>
  );
};

export default LatestProducts;
