import React, { Fragment } from "react";
import { Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./HeaderSlider.css";

const slides = [
  { src: "../img/slider/NIKEVIDEOFRAME.gif", alt: "Athlete lacing up on court" },
  { src: "../img/slider/Flyknit.jpg", alt: "Flyknit upper detail" },
  { src: "../img/slider/AirMax.jpg", alt: "Air Max sole unit" },
  { src: "../img/slider/Vapormax.jpg", alt: "Vapormax silhouette" },
  { src: "../img/slider/Pegasus.jpg", alt: "Pegasus running shoe" },
  { src: "../img/slider/AirZoom.jpg", alt: "Air Zoom trainer" },
];

const HeaderSlider = () => {
  return (
    <Fragment>
      <div className="stride-hero">
        <Carousel data-bs-theme="dark" fade indicators={false} className="stride-hero-carousel">
          {slides.map((slide) => (
            <Carousel.Item key={slide.src}>
              <img className="d-block w-100" src={slide.src} alt={slide.alt} />
            </Carousel.Item>
          ))}
        </Carousel>

        <div className="stride-hero-scrim" aria-hidden="true" />

        <div className="stride-hero-copy">
          <span className="eyebrow">SS26 collection &middot; style code STR-0026</span>
          <h1>Built for the next mile, the next drop, the next block.</h1>
          <p>
            Six categories, one bench: running, basketball, football, skate,
            training and street. Every pair tagged, priced and ready to ship.
          </p>
          <div className="stride-hero-actions">
            <Link to="/Products" className="btn-stamp">Shop the range</Link>
            <a href="#categories" className="btn-outline stride-hero-outline">Browse categories</a>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default HeaderSlider;
