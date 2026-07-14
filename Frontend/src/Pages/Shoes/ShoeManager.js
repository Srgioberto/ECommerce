import React, { useEffect, useState } from "react";
import TopNavbar from "../../Components/Header/TopNavbar";
import Footer from "../../Components/Footer/Footer";
import ShoeList from "../../Components/Shoe/ShoeList";
import ShoeForm from "../../Components/Shoe/ShoeForm";
import { Card, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createProduct, deleteProduct, productsFetch, updateProduct } from "../../Redux/Product/ProductSlice";
import store from "../../Redux/Store";

const ShoeManager = () => {
  const shoes = useSelector((state) => state.products).products;
  const dispatch = useDispatch();
  const [currentShoe, setCurrentShoe] = useState(null);

  useEffect(() => {
    store.dispatch(productsFetch()).catch((error) => {
      console.log("No connection to cart on DB, " + error.message);
    });
  }, [dispatch]);

  const addShoe = (shoe) => {
    dispatch(createProduct(shoe));
  };

  const updateShoe = (updatedShoe) => {
    dispatch(updateProduct(updatedShoe));
    setCurrentShoe(null);
  };

  const deleteShoe = (id) => {
    dispatch(deleteProduct(id));
  };

  const editShoe = (shoe) => {
    setCurrentShoe(shoe);
    var element = document.getElementById("form");
    element.scrollIntoView({ behavior: "smooth" });
  };

  const newShoe = () => {
    setCurrentShoe(null);
  };

  return (
    <div className="page-shell">
      <TopNavbar />
      <main className="page-main">
        <Container fluid className="pb-5">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Admin</span>
              <h2>Manage products</h2>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-lg-6 order-lg-0 order-1">
              <Card>
                <Card.Body>
                  <div className="row align-items-center">
                    <div className="col-sm">
                      <span className="eyebrow">Catalog</span>
                    </div>
                    <div className="col-sm text-end">
                      <button className="btn-stamp btn-sm" onClick={newShoe}>
                        Create new
                      </button>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <ShoeList shoes={shoes} onEdit={editShoe} onDelete={deleteShoe} />
                  </div>
                </Card.Body>
              </Card>
            </div>
            <div id="form" className="col-12 col-lg-6 order-lg-1 order-0 mt-4 mt-lg-0">
              <Card>
                <Card.Body>
                  <span className="eyebrow">{currentShoe ? "Editing" : "New listing"}</span>
                  <p className="font-display mb-3" style={{ textTransform: "none", fontSize: "1.35rem" }}>Shoe details</p>
                  <ShoeForm onSubmit={currentShoe ? updateShoe : addShoe} initialData={currentShoe} />
                </Card.Body>
              </Card>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default ShoeManager;
