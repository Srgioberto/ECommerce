import React, { useState, useEffect } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { getProductImageUrl } from "../../utils/productImage";

const ShoeForm = ({ onSubmit, initialData }) => {
  const { categories } = useSelector((state) => state.categories);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    CategoryId: "",
  });
  const [useSizes, setUseSizes] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [sizeDraft, setSizeDraft] = useState({ size: "", stock: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  // Modal walks through: 'confirm' (edit only) -> submitting -> 'success' | 'error'
  const [modalStep, setModalStep] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        price: initialData.price,
        stock: initialData.stock,
        CategoryId: initialData.CategoryId,
      });
      const initialSizes = Array.isArray(initialData.sizes) ? initialData.sizes : [];
      setSizes(initialSizes);
      setUseSizes(initialSizes.length > 0);
      setImagePreview(getProductImageUrl(initialData.image));
      setImageFile(null);
    } else {
      setFormData({ name: "", price: "", stock: "", CategoryId: "" });
      setSizes([]);
      setUseSizes(false);
      setImagePreview(null);
      setImageFile(null);
    }
    setSizeDraft({ size: "", stock: "" });
  }, [initialData]);

  // Switching mode should never silently mix a leftover value from the
  // other mode into what gets submitted.
  const handleModeChange = (nextUseSizes) => {
    setUseSizes(nextUseSizes);
    if (!nextUseSizes) {
      setSizes([]);
    }
    setErrors({ ...errors, stock: "" });
  };

  const sizesTotal = sizes.reduce((sum, s) => sum + (parseInt(s.stock, 10) || 0), 0);

  const handleSizeDraftKeyDown = (e) => {
    // These inputs live inside the product <form> - Enter would otherwise
    // submit the whole product instead of just adding the size row.
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSize();
    }
  };

  const handleChage = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors({ ...errors, image: "" });
  };

  const handleAddSize = () => {
    const size = sizeDraft.size.trim();
    const stock = parseInt(sizeDraft.stock, 10);
    if (!size || isNaN(stock) || stock < 0) return;
    if (sizes.some((s) => s.size === size)) {
      setSizes(sizes.map((s) => (s.size === size ? { ...s, stock } : s)));
    } else {
      setSizes([...sizes, { size, stock }]);
    }
    setSizeDraft({ size: "", stock: "" });
  };

  const handleRemoveSize = (size) => {
    setSizes(sizes.filter((s) => s.size !== size));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "El nombre del Modelo es Obligatorio.";
    if (!formData.price) newErrors.price = "El Precio es Obligatorio.";
    if (useSizes && sizes.length === 0) newErrors.stock = "Agrega al menos una talla con su stock.";
    if (!useSizes && !formData.stock) newErrors.stock = "La Cantidad en Stock es Obligatoria.";
    if (!formData.CategoryId || formData.CategoryId === "none") newErrors.category = "La Categoría es Obligatoria";
    if (!initialData && !imageFile) newErrors.image = "La Imagen es Obligatoria.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Actually performs the create/update call and waits for the real result
  // before telling the admin it worked - a failed upload used to still show
  // "success" and silently corrupt the product list.
  const submit = (id) => {
    setSubmitting(true);
    setSubmitError("");
    onSubmit({ ...formData, sizes, imageFile, id })
      .unwrap()
      .then(() => {
        setSubmitting(false);
        setModalStep("success");
      })
      .catch((err) => {
        setSubmitting(false);
        setSubmitError(typeof err === "string" ? err : "Something went wrong. Please try again.");
        setModalStep("error");
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (initialData) {
      setModalStep("confirm");
    } else {
      submit(undefined);
    }
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    submit(initialData?.id);
  };

  const handleClose = () => setModalStep(null);

  return (
    <>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {initialData ? <p className="sku mb-3">Editing {initialData.name}</p> : <p className="sku mb-3">Creating new product</p>}
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

        <div className="mt-3">
          <label className="form-label d-block mb-2">Stock</label>
          <div className="d-flex gap-2 mb-3">
            <button
              type="button"
              className={useSizes ? "btn-outline btn-sm" : "btn-ink btn-sm"}
              onClick={() => handleModeChange(false)}
            >
              Single number
            </button>
            <button
              type="button"
              className={useSizes ? "btn-ink btn-sm" : "btn-outline btn-sm"}
              onClick={() => handleModeChange(true)}
            >
              By size
            </button>
          </div>

          {!useSizes ? (
            <div>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChage}
                className="form-control"
                placeholder="Available stock"
              />
              {errors.stock && <small className="text-danger">{errors.stock}</small>}
            </div>
          ) : (
            <div>
              {sizes.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mb-2">
                  {sizes.map((s) => (
                    <span key={s.size} className="tag-badge">
                      {s.size} &middot; {s.stock}
                      <button
                        type="button"
                        onClick={() => handleRemoveSize(s.size)}
                        aria-label={`Remove size ${s.size}`}
                        style={{ border: "none", background: "none", marginLeft: "0.35rem", cursor: "pointer" }}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Size (e.g. 42)"
                  value={sizeDraft.size}
                  onChange={(e) => setSizeDraft({ ...sizeDraft, size: e.target.value })}
                  onKeyDown={handleSizeDraftKeyDown}
                />
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  placeholder="Stock for this size"
                  value={sizeDraft.stock}
                  onChange={(e) => setSizeDraft({ ...sizeDraft, stock: e.target.value })}
                  onKeyDown={handleSizeDraftKeyDown}
                />
                <button type="button" className="btn-outline btn-sm" onClick={handleAddSize} style={{ flexShrink: 0 }}>
                  Add
                </button>
              </div>
              {errors.stock && <small className="text-danger d-block mt-2">{errors.stock}</small>}
              <p className="sku mt-2 mb-0">Total stock: {sizesTotal} (sum of all sizes)</p>
            </div>
          )}
        </div>

        <div className="mt-3">
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

        <div className="mt-3">
          <label className="form-label" htmlFor="image">
            Product Photo
          </label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            className="form-control"
            accept="image/*"
          />
          {errors.image && <small className="text-danger">{errors.image}</small>}
          {imagePreview && (
            <div className="mt-2 p-2" style={{ background: "var(--paper-dim)", borderRadius: "var(--radius-sm)", width: "fit-content" }}>
              <img src={imagePreview} alt="Preview" style={{ height: "100px", width: "100px", objectFit: "contain" }} />
            </div>
          )}
        </div>

        <div className="mt-3 text-end">
          <button type="submit" className="btn-stamp" disabled={submitting}>
            {submitting ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Saving...
              </>
            ) : initialData ? (
              "Update"
            ) : (
              "Create"
            )}
          </button>
        </div>
      </form>
      <Modal show={modalStep !== null} onHide={handleClose} backdrop="static" keyboard={false}>
        {modalStep === "confirm" && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Confirm Update</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure about making this changes?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose} disabled={submitting}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleConfirm} disabled={submitting}>
                {submitting ? "Saving..." : "Yes"}
              </Button>
            </Modal.Footer>
          </>
        )}
        {modalStep === "success" && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{initialData ? "Update success" : "Creation success"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {initialData ? "Product updated successfully." : "Succesfully created product."}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleClose}>
                Understood
              </Button>
            </Modal.Footer>
          </>
        )}
        {modalStep === "error" && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{initialData ? "Update failed" : "Creation failed"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{submitError}</Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleClose}>
                Understood
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </>
  );
};

export default ShoeForm;
