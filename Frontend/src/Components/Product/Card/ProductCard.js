import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import styles from "./ProductCard.module.css"; 

const ProductCard = ({ product }) => {
  const { categories } = useSelector((state) => state.categories);

  return (
    <Fragment>
      <Link to={`/Product/${product.id}`} className="text-dark text-decoration-none">
        <Card className={styles.customCard}>
          <Card.Img variant="top" className={`${styles.cardImg} py-3`} src={`../img/products/${product.image}`} />
          <Card.Body className="text-center">
            <Card.Title className={`${styles.cardTitle} fs-6`}>{product.name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">Stock: {product.stock}</Card.Subtitle>
            <Card.Text className="text-capitalize text-decoration-none fs-6">
              {categories.find((element) => element.id === product.CategoryId).name}
            </Card.Text>
            <h5>${product.price}</h5>
          </Card.Body>
        </Card>
      </Link>
    </Fragment>
  );
};

export default ProductCard;
