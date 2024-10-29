import React from "react";
import CategoryCard from "./CategoryCard";
import { Container, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";

const AllCategories = () => {
  const { categories } = useSelector((state) => state.categories);
  return (
    <Container className="my-3 py-3">
      <h3 className="text-center mb-4">Browse Categories</h3>
      <Row>
        {categories &&
          categories.map((c, index) => {
            return (
              <Col xs={12} sm={6} md={4} lg={4} className="mb-2 p-2" key={index}>
                <CategoryCard category={c.name} />
              </Col>
            );
          })}
      </Row>
    </Container>
  );
};

export default AllCategories;
