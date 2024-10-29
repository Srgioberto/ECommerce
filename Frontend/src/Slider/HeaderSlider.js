import React, { Fragment } from "react"; 
import { Carousel } from "react-bootstrap";

const HeaderSlider = () => {
  return (
    <Fragment>
      <Carousel data-bs-theme="dark" style={{ marginTop: "0px" }}> 
        <Carousel.Item>
          <img
            className="d-block w-100"
            style={{ height: "100vh", objectFit: "cover" }} 
            src="../img/slider/NIKEVIDEOFRAME.gif"
            alt="Nike Gif"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            style={{ height: "100vh", objectFit: "cover" }} 
            src="../img/slider/Flyknit.jpg"
            alt="Nike Flyknit"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            style={{ height: "100vh", objectFit: "cover" }} 
            src="../img/slider/AirMax.jpg"
            alt="Nike AirMax"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            style={{ height: "100vh", objectFit: "cover" }} 
            src="../img/slider/Vapormax.jpg"
            alt="Nike Vapormax"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            style={{ height: "100vh", objectFit: "cover" }} 
            src="../img/slider/Pegasus.jpg"
            alt="Nike Pegasus"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            style={{ height: "100vh", objectFit: "cover" }} 
            src="../img/slider/AirZoom.jpg"
            alt="Nike AirZoom"
          />
        </Carousel.Item>
      </Carousel>
    </Fragment>
  );
};

export default HeaderSlider;
