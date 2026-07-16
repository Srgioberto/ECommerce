import React, { useState } from "react";

import { Table, Button, Modal, Form, InputGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import Pagination from "../Pagination/Pagination";
import { getProductImageUrl } from "../../utils/productImage";

const ShoeList = ({ shoes, onEdit, onDelete }) => {
  const { categories } = useSelector((state) => state.categories);
  const [shoe, setShoe] = useState();
  const [search, setSearch] = useState("");

  //Modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = (shoe) => {
    setShoe(shoe);
    setShow(true);
  };
  const handleConfirm = (e) => {
    e.preventDefault();
    onDelete(shoe.id);
    handleClose();
  };

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const lastItemIndex = currentPage * perPage;
  const firstItemIndex = lastItemIndex - perPage;

  return (
    <>
      <Form>
        <InputGroup className="my-3">
          <Form.Control onChange={(e) => setSearch(e.target.value)} placeholder="Search by product name" />
        </InputGroup>
      </Form>
      <div className="mt-3">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Photo</th>
              <th>Model</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Sizes</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {shoes.length > 0 ? (
              shoes
                .filter(Boolean)
                .filter((item) => {
                  return search.toLocaleLowerCase() === "" ? item : item.name.toLocaleLowerCase().includes(search);
                })
                .slice(firstItemIndex, lastItemIndex)
                .map((shoe) => (
                  <tr key={shoe.id}>
                    <td>
                      <img
                        src={getProductImageUrl(shoe.image)}
                        alt={shoe.name}
                        style={{ width: "44px", height: "44px", objectFit: "contain", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-sm)" }}
                      />
                    </td>
                    <td>{shoe.name}</td>
                    <td>{shoe.price}</td>
                    <td>{shoe.stock}</td>
                    <td>
                      {Array.isArray(shoe.sizes) && shoe.sizes.length > 0
                        ? shoe.sizes.map((s) => s.size).join(", ")
                        : "—"}
                    </td>
                    <td>{categories.find((c) => c.id === shoe.CategoryId).name}</td>
                    <td className="text-center">
                      <button className="btn-outline btn-sm" onClick={() => onEdit(shoe)}>
                        Edit
                      </button>
                      <button className="btn-stamp btn-sm ms-2" onClick={() => handleShow(shoe)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No existing shoes
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      <Pagination
        totalItems={
          shoes
            .filter(Boolean)
            .filter((item) => {
              return search.toLocaleLowerCase() === "" ? item : item.name.toLocaleLowerCase().includes(search);
            }).length
        }
        perPage={perPage}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm DELETE</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <b>Are you sure about making this changes?</b>
          <br />
          *If the item is already on a confirmed Order instead of deleting the item, the stock will be set to 0.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Yes, I understand
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ShoeList;
