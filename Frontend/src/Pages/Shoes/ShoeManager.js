import React, { useEffect, useState } from "react";
import TopNavbar from "../../Components/Header/TopNavbar";
import Footer from "../../Components/Footer/Footer";
import ShoeList from "../../Components/Shoe/ShoeList";
import ShoeForm from "../../Components/Shoe/ShoeForm";
import { Card, Button } from "react-bootstrap";
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
    <div className="container-fluid p-0" style={{ marginBottom: "6rem" }}>
      <TopNavbar />
      <h1 className="text-center" style={{ marginTop: "6rem" }}>Products Management</h1>
      <div className="row mx-5">
        <div className="col-12 col-lg-6 mt-5 order-lg-0 order-1">
          <Card>
            <Card.Body>
              <div className="row">
                <Card.Title className="col-sm">Shoe List</Card.Title>
                <div className="col-sm text-end">
                  <Button 
                    variant="outline-success" 
                    onClick={newShoe} 
                    style={{ marginLeft: "10px" }} // Space between buttons
                  >
                    Create New
                  </Button>
                </div>
              </div>
              <div className="table-responsive">
                <ShoeList shoes={shoes} onEdit={editShoe} onDelete={deleteShoe} />
              </div>
              <div style={{ marginTop: "20px" }}> {/* Space between rows of buttons */}
              </div>
            </Card.Body>
          </Card>
        </div>
        <div id="form" className="col-12 col-lg-6 mt-5 order-lg-1 order-0">
          <Card>
            <Card.Body>
              <Card.Title className="text-center">Shoe Form</Card.Title>
              <ShoeForm onSubmit={currentShoe ? updateShoe : addShoe} initialData={currentShoe} />
            </Card.Body>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShoeManager;
