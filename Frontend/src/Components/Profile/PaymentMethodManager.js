import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  paymentMethodsFetch,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} from "../../Redux/PaymentMethod/PaymentMethodSlice";
import "./Profile.css";

const BRANDS = ["Visa", "Mastercard", "Amex", "Discover", "Other"];
const emptyForm = {
  label: "",
  cardholderName: "",
  brand: "Visa",
  last4: "",
  expMonth: "",
  expYear: "",
  isDefault: false,
};

const PaymentMethodManager = () => {
  const dispatch = useDispatch();
  const { paymentMethods } = useSelector((state) => state.paymentMethods);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    dispatch(paymentMethodsFetch());
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

  const openEditForm = (method) => {
    setEditingId(method.id);
    setFormData({
      label: method.label || "",
      cardholderName: method.cardholderName || "",
      brand: method.brand || "Visa",
      last4: method.last4 || "",
      expMonth: String(method.expMonth || ""),
      expYear: String(method.expYear || ""),
      isDefault: !!method.isDefault,
    });
    setErrors({});
    setFormError("");
    setShowForm(true);
  };

  const closeForm = () => setShowForm(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.cardholderName.trim()) newErrors.cardholderName = "Cardholder name is required";
    if (!/^\d{4}$/.test(formData.last4)) newErrors.last4 = "Enter exactly the last 4 digits";
    const month = parseInt(formData.expMonth, 10);
    if (!month || month < 1 || month > 12) newErrors.expMonth = "1-12";
    const year = parseInt(formData.expYear, 10);
    if (!year || year < new Date().getFullYear()) newErrors.expYear = "Invalid year";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setFormError("");
    const action = editingId
      ? updatePaymentMethod({ id: editingId, ...formData })
      : createPaymentMethod(formData);
    dispatch(action)
      .unwrap()
      .then(() => {
        setSubmitting(false);
        setShowForm(false);
      })
      .catch((error) => {
        setSubmitting(false);
        setFormError(typeof error === "string" ? error : "Could not save this payment method.");
      });
  };

  const handleDelete = (id) => {
    dispatch(deletePaymentMethod(id));
  };

  const handleMakeDefault = (method) => {
    dispatch(updatePaymentMethod({ id: method.id, isDefault: true }));
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <span className="eyebrow">Payment</span>
        {!showForm && (
          <button type="button" className="btn-stamp btn-sm" onClick={openNewForm}>
            Add payment method
          </button>
        )}
      </div>

      <p className="sku mb-3">
        We only keep the last 4 digits, brand and expiry — never your full card number. This is a
        placeholder for checkout until a real payment gateway is connected.
      </p>

      {paymentMethods.length === 0 && !showForm && (
        <p className="sku mb-0">No saved payment methods yet.</p>
      )}

      <div className="d-flex flex-column gap-2 mb-3">
        {paymentMethods.map((method) => (
          <div key={method.id} className="profile-entry">
            <div className="profile-entry-body">
              <div className="d-flex align-items-center gap-2 mb-1">
                <strong>{method.label || method.brand}</strong>
                {method.isDefault && <span className="tag-badge tag-badge--court">Default</span>}
              </div>
              <p className="sku mb-0">
                {method.brand} •••• {method.last4} · Exp {String(method.expMonth).padStart(2, "0")}/
                {method.expYear} · {method.cardholderName}
              </p>
            </div>
            <div className="profile-entry-actions">
              {!method.isDefault && (
                <button type="button" className="btn-outline btn-sm" onClick={() => handleMakeDefault(method)}>
                  Make default
                </button>
              )}
              <button type="button" className="btn-outline btn-sm" onClick={() => openEditForm(method)}>
                Edit
              </button>
              <button type="button" className="btn-stamp btn-sm" onClick={() => handleDelete(method.id)}>
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
                placeholder="Personal, Business..."
              />
            </div>
            <div className="col-sm-6">
              <label className="form-label">Cardholder name</label>
              <input
                className="form-control"
                name="cardholderName"
                value={formData.cardholderName}
                onChange={handleChange}
              />
              {errors.cardholderName && <small className="text-danger">{errors.cardholderName}</small>}
            </div>
          </div>
          <div className="row g-2 mt-1">
            <div className="col-sm-4">
              <label className="form-label">Brand</label>
              <select className="form-select" name="brand" value={formData.brand} onChange={handleChange}>
                {BRANDS.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-sm-4">
              <label className="form-label">Last 4 digits</label>
              <input
                className="form-control"
                name="last4"
                value={formData.last4}
                onChange={handleChange}
                maxLength={4}
                inputMode="numeric"
                placeholder="4242"
              />
              {errors.last4 && <small className="text-danger">{errors.last4}</small>}
            </div>
            <div className="col-sm-4">
              <label className="form-label">Expiry (MM/YYYY)</label>
              <div className="d-flex gap-2">
                <input
                  className="form-control"
                  name="expMonth"
                  value={formData.expMonth}
                  onChange={handleChange}
                  placeholder="MM"
                  inputMode="numeric"
                  maxLength={2}
                />
                <input
                  className="form-control"
                  name="expYear"
                  value={formData.expYear}
                  onChange={handleChange}
                  placeholder="YYYY"
                  inputMode="numeric"
                  maxLength={4}
                />
              </div>
              {(errors.expMonth || errors.expYear) && (
                <small className="text-danger d-block">{errors.expMonth || errors.expYear}</small>
              )}
            </div>
          </div>
          <div className="form-check mt-3">
            <input
              type="checkbox"
              className="form-check-input"
              id="paymentIsDefault"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
            />
            <label className="form-check-label sku" htmlFor="paymentIsDefault">
              Use as default payment method
            </label>
          </div>
          {formError && <div className="text-danger mt-2">{formError}</div>}
          <div className="mt-3 d-flex gap-2">
            <button type="submit" className="btn-stamp btn-sm" disabled={submitting}>
              {submitting ? "Saving..." : editingId ? "Save changes" : "Save card"}
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

export default PaymentMethodManager;
