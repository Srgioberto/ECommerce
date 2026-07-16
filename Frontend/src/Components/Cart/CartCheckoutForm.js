import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../../Redux/Order/OrderSlice";
import { useNavigate, Link } from "react-router-dom";
import { clearCart } from "../../Redux/Cart/CartSlice";
import { addressesFetch, createAddress } from "../../Redux/Address/AddressSlice";
import { paymentMethodsFetch } from "../../Redux/PaymentMethod/PaymentMethodSlice";

const emptyAddressForm = {
  address1: "",
  address2: "",
  city: "",
  province: "",
  country: "",
};

const CartCheckoutForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { addresses } = useSelector((state) => state.addresses);
  const { paymentMethods } = useSelector((state) => state.paymentMethods);

  const [selectedAddressId, setSelectedAddressId] = useState("new");
  const [addressInitialized, setAddressInitialized] = useState(false);
  const [saveNewAddress, setSaveNewAddress] = useState(false);
  const [formData, setFormData] = useState(emptyAddressForm);
  const [selectedPaymentId, setSelectedPaymentId] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    dispatch(addressesFetch());
    dispatch(paymentMethodsFetch());
  }, [dispatch]);

  // Default to the buyer's saved default address/card the first time each
  // list loads, without overriding a choice they've already made.
  useEffect(() => {
    if (addressInitialized || addresses.length === 0) return;
    const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];
    setSelectedAddressId(defaultAddress.id);
    setAddressInitialized(true);
  }, [addresses, addressInitialized]);

  useEffect(() => {
    if (selectedPaymentId || paymentMethods.length === 0) return;
    const defaultPayment = paymentMethods.find((p) => p.isDefault) || paymentMethods[0];
    setSelectedPaymentId(defaultPayment.id);
  }, [paymentMethods, selectedPaymentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    if (selectedAddressId !== "new") return true;
    const newErrors = {};
    if (!formData.address1.trim()) newErrors.address1 = "The street name is mandatory";
    if (!formData.city) newErrors.city = "The City is mandatory";
    if (!formData.country) newErrors.country = "The country is mandatory";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const addressFields =
      selectedAddressId === "new"
        ? formData
        : (() => {
            const saved = addresses.find((a) => a.id === selectedAddressId);
            return {
              address1: saved.address1,
              address2: saved.address2,
              city: saved.city,
              province: saved.province,
              country: saved.country,
            };
          })();

    setSubmitting(true);
    setSubmitError("");

    if (selectedAddressId === "new" && saveNewAddress) {
      dispatch(createAddress({ label: "Address", fullName: `${user.firstName} ${user.lastName}`, ...formData }));
    }

    dispatch(createOrder({ ...addressFields, PaymentMethodId: selectedPaymentId }))
      .unwrap()
      .then(() => {
        dispatch(clearCart());
        setFormData(emptyAddressForm);
        setSubmitting(false);
        navigate("/Profile");
      })
      .catch((error) => {
        setSubmitting(false);
        setSubmitError(typeof error === "string" ? error : "Could not place your order.");
      });
  };

  return (
    <form onSubmit={handleSubmit} data-bs-theme="light">
      {user && (
        <div>
          <div className="my-2">
            <label style={{ textTransform: "capitalize" }}>To: {user.firstName + " " + user.lastName}</label>
          </div>
          <div className="my-2">
            <label>Email: {user.email}</label>
          </div>
          <div className="my-2">
            <label>Phone: {user.phone}</label>
          </div>
        </div>
      )}
      <hr />

      <div className="my-2">
        <span className="form-label d-block mb-2">Shipping address</span>
        {addresses.map((address) => (
          <label key={address.id} className="d-flex align-items-start gap-2 mb-2" style={{ cursor: "pointer" }}>
            <input
              type="radio"
              name="addressChoice"
              checked={selectedAddressId === address.id}
              onChange={() => setSelectedAddressId(address.id)}
            />
            <span className="sku">
              <strong>{address.label}</strong> — {address.fullName} · {address.address1}
              {address.address2 ? `, ${address.address2}` : ""}, {address.city}, {address.country}
            </span>
          </label>
        ))}
        <label className="d-flex align-items-center gap-2 mb-2" style={{ cursor: "pointer" }}>
          <input
            type="radio"
            name="addressChoice"
            checked={selectedAddressId === "new"}
            onChange={() => setSelectedAddressId("new")}
          />
          <span className="sku">Enter a new address</span>
        </label>
      </div>

      {selectedAddressId === "new" && (
        <div className="ps-1 border-start ms-1">
          <div className="my-2">
            <label className="form-label" htmlFor="address1">
              Street Name
            </label>
            <input
              type="text"
              id="address1"
              name="address1"
              value={formData.address1}
              onChange={handleChange}
              className="form-control"
              placeholder="Street name of the shipping address"
            />
            {errors.address1 && <small className="text-danger">{errors.address1}</small>}
          </div>

          <div className="my-2">
            <label className="form-label" htmlFor="address2">
              House/Appartment Number or Letter
            </label>
            <input
              type="text"
              id="address2"
              name="address2"
              value={formData.address2}
              onChange={handleChange}
              className="form-control"
              placeholder="Number or Letter"
            />
          </div>

          <div className="mt-2">
            <label className="form-label" htmlFor="province">
              Province
            </label>
            <input
              type="text"
              id="province"
              name="province"
              value={formData.province}
              onChange={handleChange}
              className="form-control"
              placeholder="Province (Not mandatory)"
            />
          </div>

          <div className="mt-2">
            <label className="form-label" htmlFor="city">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="form-control"
              placeholder="City"
            />
            {errors.city && <small className="text-danger">{errors.city}</small>}
          </div>

          <div className="mt-2">
            <label className="form-label" htmlFor="country">
              Country
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="form-control"
              placeholder="Country"
            />
            {errors.country && <small className="text-danger">{errors.country}</small>}
          </div>

          <div className="form-check mt-2">
            <input
              type="checkbox"
              className="form-check-input"
              id="saveNewAddress"
              checked={saveNewAddress}
              onChange={(e) => setSaveNewAddress(e.target.checked)}
            />
            <label className="form-check-label sku" htmlFor="saveNewAddress">
              Save this address to my profile
            </label>
          </div>
        </div>
      )}

      <hr />

      <div className="my-2">
        <span className="form-label d-block mb-2">Payment method</span>
        {paymentMethods.length > 0 ? (
          <select
            className="form-select"
            value={selectedPaymentId}
            onChange={(e) => setSelectedPaymentId(parseInt(e.target.value, 10))}
          >
            {paymentMethods.map((method) => (
              <option key={method.id} value={method.id}>
                {method.brand} •••• {method.last4} ({method.label || "Card"})
              </option>
            ))}
          </select>
        ) : (
          <p className="sku mb-0">
            No saved payment method yet — you can{" "}
            <Link to="/Profile">add one to your profile</Link>, or continue without one for now.
          </p>
        )}
      </div>

      {submitError && <div className="text-danger mt-2">{submitError}</div>}

      <div className="mt-3 text-end">
        <button type="submit" className="btn-stamp" disabled={submitting}>
          {submitting ? "Placing order..." : "Place order"}
        </button>
      </div>
    </form>
  );
};

export default CartCheckoutForm;
