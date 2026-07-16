import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addressesFetch,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../../Redux/Address/AddressSlice";
import "./Profile.css";

const emptyForm = {
  label: "",
  fullName: "",
  phone: "",
  address1: "",
  address2: "",
  city: "",
  province: "",
  country: "",
  isDefault: false,
};

const AddressManager = () => {
  const dispatch = useDispatch();
  const { addresses } = useSelector((state) => state.addresses);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    dispatch(addressesFetch());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    setErrors({ ...errors, [name]: "" });
  };

  const openNewForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setErrors({});
    setFormError("");
    setShowForm(true);
  };

  const openEditForm = (address) => {
    setEditingId(address.id);
    setFormData({
      label: address.label || "",
      fullName: address.fullName || "",
      phone: address.phone || "",
      address1: address.address1 || "",
      address2: address.address2 || "",
      city: address.city || "",
      province: address.province || "",
      country: address.country || "",
      isDefault: !!address.isDefault,
    });
    setErrors({});
    setFormError("");
    setShowForm(true);
  };

  const closeForm = () => setShowForm(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Recipient name is required";
    if (!formData.address1.trim()) newErrors.address1 = "Street address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setFormError("");
    const action = editingId ? updateAddress({ id: editingId, ...formData }) : createAddress(formData);
    dispatch(action)
      .unwrap()
      .then(() => {
        setSubmitting(false);
        setShowForm(false);
      })
      .catch((error) => {
        setSubmitting(false);
        setFormError(typeof error === "string" ? error : "Could not save this address.");
      });
  };

  const handleDelete = (id) => {
    dispatch(deleteAddress(id));
  };

  const handleMakeDefault = (address) => {
    dispatch(updateAddress({ id: address.id, isDefault: true }));
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <span className="eyebrow">Shipping</span>
        {!showForm && (
          <button type="button" className="btn-stamp btn-sm" onClick={openNewForm}>
            Add address
          </button>
        )}
      </div>

      {addresses.length === 0 && !showForm && (
        <p className="sku mb-0">No saved addresses yet. Add one to speed up checkout.</p>
      )}

      <div className="d-flex flex-column gap-2 mb-3">
        {addresses.map((address) => (
          <div key={address.id} className="profile-entry">
            <div className="profile-entry-body">
              <div className="d-flex align-items-center gap-2 mb-1">
                <strong>{address.label}</strong>
                {address.isDefault && <span className="tag-badge tag-badge--court">Default</span>}
              </div>
              <p className="sku mb-0">
                {address.fullName} · {address.address1}
                {address.address2 ? `, ${address.address2}` : ""}, {address.city}
                {address.province ? `, ${address.province}` : ""}, {address.country}
              </p>
            </div>
            <div className="profile-entry-actions">
              {!address.isDefault && (
                <button type="button" className="btn-outline btn-sm" onClick={() => handleMakeDefault(address)}>
                  Make default
                </button>
              )}
              <button type="button" className="btn-outline btn-sm" onClick={() => openEditForm(address)}>
                Edit
              </button>
              <button type="button" className="btn-stamp btn-sm" onClick={() => handleDelete(address.id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="row g-2">
            <div className="col-sm-6">
              <label className="form-label">Label</label>
              <input
                className="form-control"
                name="label"
                value={formData.label}
                onChange={handleChange}
                placeholder="Home, Work..."
              />
            </div>
            <div className="col-sm-6">
              <label className="form-label">Recipient name</label>
              <input className="form-control" name="fullName" value={formData.fullName} onChange={handleChange} />
              {errors.fullName && <small className="text-danger">{errors.fullName}</small>}
            </div>
          </div>
          <div className="row g-2 mt-1">
            <div className="col-sm-6">
              <label className="form-label">Phone</label>
              <input className="form-control" name="phone" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="col-sm-6">
              <label className="form-label">Street address</label>
              <input className="form-control" name="address1" value={formData.address1} onChange={handleChange} />
              {errors.address1 && <small className="text-danger">{errors.address1}</small>}
            </div>
          </div>
          <div className="row g-2 mt-1">
            <div className="col-sm-6">
              <label className="form-label">Apartment / unit</label>
              <input className="form-control" name="address2" value={formData.address2} onChange={handleChange} />
            </div>
            <div className="col-sm-6">
              <label className="form-label">City</label>
              <input className="form-control" name="city" value={formData.city} onChange={handleChange} />
              {errors.city && <small className="text-danger">{errors.city}</small>}
            </div>
          </div>
          <div className="row g-2 mt-1">
            <div className="col-sm-6">
              <label className="form-label">Province / state</label>
              <input className="form-control" name="province" value={formData.province} onChange={handleChange} />
            </div>
            <div className="col-sm-6">
              <label className="form-label">Country</label>
              <input className="form-control" name="country" value={formData.country} onChange={handleChange} />
              {errors.country && <small className="text-danger">{errors.country}</small>}
            </div>
          </div>
          <div className="form-check mt-3">
            <input
              type="checkbox"
              className="form-check-input"
              id="addressIsDefault"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
            />
            <label className="form-check-label sku" htmlFor="addressIsDefault">
              Use as default shipping address
            </label>
          </div>
          {formError && <div className="text-danger mt-2">{formError}</div>}
          <div className="mt-3 d-flex gap-2">
            <button type="submit" className="btn-stamp btn-sm" disabled={submitting}>
              {submitting ? "Saving..." : editingId ? "Save changes" : "Save address"}
            </button>
            <button type="button" className="btn-outline btn-sm" onClick={closeForm} disabled={submitting}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddressManager;
