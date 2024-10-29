import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";

const ShoeForm = ({ onSubmit, initialData }) => {
  const { categories } = useSelector((state) => state.categories);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    CategoryId: "",
    //image: null,
  });
  const [errors, setErrors] = useState({});
  //const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData /*, image: null*/ });
    } else {
      setFormData({ name: "", price: "", stock: "", CategoryId: "" /*, image: null*/ });
    }
  }, [initialData]);

  const handleChage = (e) => {
    const { name, value /*, files*/ } = e.target;

    if (name === "image") {
      // const file = files[0];
      // setFormData({...formData, [name]: file});
      // // setFormData({...formData, [name]: files[0]});
      // setImagePreview(URL.createObjectURL(file));
      // console.log(imagePreview);
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "El nombre del Modelo es Obligatorio.";
    if (!formData.price) newErrors.price = "El Precio es Obligatorio.";
    if (!formData.stock) newErrors.stock = "La Cantidad en Stock es Obligatoria.";
    if (!formData.CategoryId || formData.CategoryId === "none") newErrors.category = "La Categoría es Obligatoria";
    //if   (!formData.image) newErrors.image = 'La Imagen es Obligatoria.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // const data = new FormData();
    // data.append('name', formData.name);
    // data.append('price', formData.price);
    // data.append('stock', formData.stock);
    // data.append('category', formData.category);
    // if (formData.image){
    //     data.append('image', formData.image);
    // }
    // onSubmit(data);
    if (initialData) {
      setCreation(false);
      handleShow();
    } else {
      setCreation(true);
      onSubmit({ ...formData, image: "default.png" });
      handleShow();
    }
    //setImagePreview(null);
  };

  //Modal
  const [creation, setCreation] = useState(true);
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setFormData({ name: "", price: "", stock: "", category: "" /*, image: null*/ });
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const handleConfirm = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, id: initialData?.id });
    handleClose();
  };

  return (
    <>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {initialData ? <p>Editing {initialData.name}</p> : <p>Creating new Product</p>}
        <div className="my-2">
          <label className="form-label" htmlFor="name">
            Model Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChage}
            className="form-control"
            placeholder="Shoe model name"
          />
          {errors.name && <small className="text-danger">{errors.name}</small>}
        </div>

        <div className="my-2">
          <label className="form-label" htmlFor="price">
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChage}
            className="form-control"
            placeholder="Selling price"
          />
          {errors.price && <small className="text-danger">{errors.price}</small>}
        </div>

        <div className="mt-2">
          <label className="form-label" htmlFor="stock">
            Stock
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChage}
            className="form-control"
            placeholder="Available Stock"
          />
          {errors.stock && <small className="text-danger">{errors.stock}</small>}
        </div>

        <div className="mt-2">
          <label className="form-label" htmlFor="CategoryId">
            Category
          </label>
          <select
            id="CategoryId"
            name="CategoryId"
            value={formData.CategoryId}
            onChange={handleChage}
            className="form-select"
          >
            <option value="none">Select category</option>

            {categories ? (
              categories.map((category) => (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              ))
            ) : (
              <option value="none">No existing categories</option>
            )}
          </select>
          {errors.category && <small className="text-danger">{errors.category}</small>}
        </div>

        {/* <div className='mt-2'>
                <label className='from-label' htmlFor='image'>Imagen de la Zapatilla</label>
                <input type='file' id='image' name='image' onChange={handleChage} className='form-control mt-2' accept='image/*'/>
                {errors.image && <small className="text-danger">{errors.image}</small>}
            </div> */}

        <div className="m-3 text-end">
          <button type="submit" className="btn btn-outline-secondary ">
            {initialData ? "Update" : "Create"}
          </button>
        </div>
      </form>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        {creation ? (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Creation success</Modal.Title>
            </Modal.Header>
            <Modal.Body>Succesfully created product.</Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleClose}>
                Understood
              </Button>
            </Modal.Footer>
          </>
        ) : (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Confirm Update</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure about making this changes?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleConfirm}>
                Yes
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </>
  );
};

export default ShoeForm;
