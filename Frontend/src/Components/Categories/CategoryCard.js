import React from "react";
import { Link } from "react-router-dom";
import "./CategoryCard.css";

const categoryImages = {
  Urban: "Urban.jpg",
  Basket: "Basket.jpg",
  Skate: "Skate.jpg",
  Running: "Running.jpg",
  Training: "Training.png",
  Futbol: "Futbol.jpg",
};

const CategoryCard = ({ category }) => {
  const image = categoryImages[category];

  return (
    <Link to={`/Category/${category}`} className="stride-category-card">
      <div className="stride-category-media">
        {image ? (
          <img src={`/img/categories/${image}`} alt={`${category} shoes`} loading="lazy" />
        ) : (
          <div className="stride-category-fallback" aria-hidden="true" />
        )}
      </div>
      <div className="stride-category-label">
        <span className="eyebrow">Shop</span>
        <p className="text-capitalize">
          {category}
          <span className="stride-category-arrow" aria-hidden="true">&rarr;</span>
        </p>
      </div>
    </Link>
  );
};

export default CategoryCard;
