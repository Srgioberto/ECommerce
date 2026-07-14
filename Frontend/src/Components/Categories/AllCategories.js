import React from "react";
import CategoryCard from "./CategoryCard";
import { Container, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import Reveal from "../Reveal/Reveal";

const AllCategories = () => {
  const { categories } = useSelector((state) => state.categories);
  return (
    <Container id="categories" className="my-5 py-3" style={{ scrollMarginTop: "80px" }}>
      <Reveal as="div" className="section-heading">
        <div>
          <span className="eyebrow">Shop by discipline</span>
          <h2>Categories</h2>
        </div>
      </Reveal>
      <Row className="g-3">
        {categories &&
          categories.map((c, index) => {
            return (
              <Col xs={6} sm={6} md={4} lg={4} key={index}>
                <Reveal delay={index * 70} style={{ height: "100%" }}>
                  <CategoryCard category={c.name} />
                </Reveal>
              </Col>
            );
          })}
      </Row>
    </Container>
  );
};

export default AllCategories;
