import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import TopNavbar from "../Components/Header/TopNavbar";
import Footer from "../Components/Footer/Footer";
import HeaderSlider from "../Slider/HeaderSlider";
import AllCategories from "../Components/Categories/AllCategories";
import LatestProducts from "../Components/Product/LatestProducts";
import { productsFetch } from "../Redux/Product/ProductSlice";

const Home = () => {
  const dispatch = useDispatch();

  // Refresh stock levels every time the home page is viewed, rather than
  // trusting whatever was cached from login/last navigation.
  useEffect(() => {
    dispatch(productsFetch());
  }, [dispatch]);

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
