import React from "react";
import TopNavbar from "../Components/Header/TopNavbar";
import Footer from "../Components/Footer/Footer";
import HeaderSlider from "../Slider/HeaderSlider";
import AllCategories from "../Components/Categories/AllCategories";
import LatestProducts from "../Components/Product/LatestProducts";

const Home = () => {
  return (
    <div className="page-shell">
      <TopNavbar />
      <main className="page-main" style={{ paddingTop: 0 }}>
        <HeaderSlider />
        <AllCategories />
        <LatestProducts />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
