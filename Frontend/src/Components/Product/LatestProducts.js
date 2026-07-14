import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import ProductCard from "./Card/ProductCard";
import { useSelector } from "react-redux";
import Reveal from "../Reveal/Reveal";

const LatestProducts = () => {
  const { products } = useSelector((state) => state.products);
  return (
    <Container className="my-5 py-3">
      <Reveal className="section-heading">
        <div>
          <span className="eyebrow">Fresh on the bench</span>
          <h2>Latest drops</h2>
        </div>
      </Reveal>
      <Row className="g-3">
        {products &&
          products.slice(-6).map((product, index) => {
            return (
              <Col xs={6} sm={6} md={4} lg={3} key={product.id}>
                <Reveal delay={index * 60} style={{ height: "100%" }}>
                  <ProductCard product={product} />
                </Reveal>
              </Col>
            );
          })}
      </Row>
    </Container>
  );
};

export default LatestProducts;
