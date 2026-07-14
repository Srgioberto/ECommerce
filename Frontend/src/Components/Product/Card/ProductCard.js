import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./ProductCard.module.css";

const ProductCard = ({ product }) => {
  const { categories } = useSelector((state) => state.categories);
  const category = categories.find((element) => element.id === product.CategoryId);
  const inStock = product.stock > 0;
  const lowStock = inStock && product.stock <= 5;

  return (
    <Fragment>
      <Link to={`/Product/${product.id}`} className={styles.card}>
        <div className={styles.tagHole} aria-hidden="true" />
        <div className={styles.media}>
          <img src={`../img/products/${product.image}`} alt={product.name} />
        </div>
        <div className={styles.perforation} />
        <div className={styles.body}>
          {category && <span className="eyebrow text-capitalize">{category.name}</span>}
          <h3 className={styles.title}>{product.name}</h3>
          <div className={styles.metaRow}>
            <span className="sku">SKU-{String(product.id).padStart(4, "0")}</span>
            <span className={`tag-badge ${lowStock ? "tag-badge--stamp" : "tag-badge--court"}`}>
              {inStock ? (lowStock ? `${product.stock} left` : "In stock") : "Sold out"}
            </span>
          </div>
          <p className={styles.price}>${product.price}</p>
        </div>
      </Link>
    </Fragment>
  );
};

export default ProductCard;
