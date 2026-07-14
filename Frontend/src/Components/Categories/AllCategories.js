import React from "react";
import CategoryCard from "./CategoryCard";
import { Container, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";

const AllCategories = () => {
  const { categories } = useSelector((state) => state.categories);
  return (
    <Container id="categories" className="my-5 py-3" style={{ scrollMarginTop: "80px" }}>
      <div className="section-heading">
        <div>
          <span className="eyebrow">Shop by discipline</span>
          <h2>Categories</h2>
        </div>
      </div>
      <Row className="g-3">
        {categories &&
          categories.map((c, index) => {
            return (
              <Col xs={6} sm={6} md={4} lg={4} key={index}>
                <CategoryCard category={c.name} />
              </Col>
            );
          })}
      </Row>
    </Container>
  );
};

export default AllCategories;
