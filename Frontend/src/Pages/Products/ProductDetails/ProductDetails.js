import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import TopNavbar from "../../../Components/Header/TopNavbar";
import { Col, Container, Row } from "react-bootstrap";
import Footer from "../../../Components/Footer/Footer";
import "./ProductDetails.css";
import { addItem } from "../../../Redux/Cart/CartSlice";
import { useCartDrawer } from "../../../Components/CartDrawer/CartDrawerContext";
import { getProductGallery, getProductSizes } from "../../../utils/productImage";
import { productsFetch } from "../../../Redux/Product/ProductSlice";

const ProductDetails = () => {
  const { categories } = useSelector((state) => state.categories);
  const { user } = useSelector((state) => state.user);
  let { id } = useParams();
  let [product, setProduct] = useState(null);
  let [quantity, setQuantity] = useState(1);
  let [category, setCategory] = useState(null);
  let [selectedSize, setSelectedSize] = useState(null);
  let [sizeError, setSizeError] = useState("");
  let [activeImageIndex, setActiveImageIndex] = useState(0);
  let [zoomStyle, setZoomStyle] = useState({});
  const { products } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const cartDrawer = useCartDrawer();
  const sizes = getProductSizes(product);
  const gallery = getProductGallery(product);

  const handleZoomMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({ transformOrigin: `${x}% ${y}%`, transform: "scale(1.9)" });
  };

  const handleZoomLeave = () => setZoomStyle({});

  // Stock can change between visits (someone else buying the last pair),
  // so always pull a fresh copy instead of trusting whatever was cached
  // in the store from login/last navigation.
  useEffect(() => {
    dispatch(productsFetch());
  }, [dispatch]);

  // Quantity is capped by the stock of the chosen size, not the product's
  // total stock across all sizes - otherwise you could add more of a size
  // than actually exists as long as some other size still had stock left.
  const availableStock =
    sizes.length > 0 ? sizes.find((s) => s.size === selectedSize)?.stock ?? 0 : product?.stock ?? 0;

  // A previous quantity may no longer fit once the size changes, so reset it.
  useEffect(() => {
    setQuantity(1);
  }, [selectedSize]);

  // Increase item quantity, but not above the available stock value
  const increaseQty = (e) => {
    e.preventDefault();
    if (quantity < availableStock) {
      setQuantity(quantity + 1); // Incrementar la cantidad correctamente
    }
  };

  // Decrease item quantity, but not less than 1
  const decreaseQty = (e) => {
    e.preventDefault();
    if (quantity > 1) {
      setQuantity(quantity - 1); // Decrementar la cantidad correctamente
    }
  };

  // useEffect function to find the product from all products and get the category name
  useEffect(() => {
    let result = products.find((p) => p.id === parseInt(id));
    if (result) {
      setProduct(result);
      let category = categories.find((element) => element.id === result.CategoryId).name;
      setCategory(category);
      setSelectedSize(null);
      setSizeError("");
      setActiveImageIndex(0);
    }
  }, [id, products, categories]);

  // Create the item object to just save the necessary data
  const handleAddToCart = (e) => {
    e.preventDefault();
    if (sizes.length > 0 && !selectedSize) {
      setSizeError("Select a size before adding to your bag.");
      return;
    }
    let cartItem = {
      ProductId: parseInt(product.id),
      price: product.price,
      qty: quantity,
      size: selectedSize,
    };
    let data = {
      cartItem,
      mode: "normal",
    };
    dispatch(addItem(data)).finally(() => cartDrawer?.openDrawer());
  };

  const inStock = product && product.stock > 0;
  const lowStock = inStock && product.stock <= 5;

  return (
    <div className="page-shell">
      <TopNavbar />
      <main className="page-main">
        <Container className="pb-5">
          {product ? (
            <Row className="my-4 g-4 align-items-start">
              <Col md={6} sm={12}>
                <div
                  className="pd-img-container"
                  onMouseMove={handleZoomMove}
                  onMouseLeave={handleZoomLeave}
                >
                  <img
                    className="pd-single-img"
                    src={gallery[activeImageIndex] || gallery[0]}
                    alt={product.name}
                    style={zoomStyle}
                  />
                </div>
                {gallery.length > 1 && (
                  <div className="pd-thumbs">
                    {gallery.map((src, index) => (
                      <button
                        key={src}
                        type="button"
                        className={`pd-thumb ${index === activeImageIndex ? "is-active" : ""}`}
                        onClick={() => setActiveImageIndex(index)}
                        aria-label={`View photo ${index + 1}`}
                      >
                        <img src={src} alt={`${product.name} view ${index + 1}`} />
                      </button>
                    ))}
                  </div>
                )}
              </Col>
              <Col md={6} sm={12}>
                <div className="pd-info">
                  {category && (
                    <Link to={`/Category/${category}`} className="eyebrow text-capitalize text-decoration-none">
                      {category}
                    </Link>
                  )}
                  <h1 className="pd-title">{product.name}</h1>
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <span className="sku">SKU-{String(product.id).padStart(4, "0")}</span>
                    {product.stock < 1 ? (
                      <span className="tag-badge tag-badge--stamp">Sold out</span>
                    ) : user.admin ? (
                      <span className={`tag-badge ${lowStock ? "tag-badge--stamp" : "tag-badge--court"}`}>
                        {lowStock ? `Only ${product.stock} left` : `${product.stock} in stock`}
                      </span>
                    ) : (
                      <span className="tag-badge tag-badge--court">In stock</span>
                    )}
                  </div>
                  <p className="pd-price">${product.price}</p>

                  <div className="perforation my-4" />

                  {product.stock < 1 ? (
                    <p className="pd-outofstock">This style is currently out of stock.</p>
                  ) : (
                    <>
                      {!user.admin ? (
                        <>
                          {sizes.length > 0 && (
                            <div className="mb-4">
                              <span className="form-label d-block mb-2">Size</span>
                              <div className="pd-size-grid">
                                {sizes.map((s) => {
                                  const available = s.stock > 0;
                                  return (
                                    <button
                                      key={s.size}
                                      type="button"
                                      className={`pd-size-chip ${selectedSize === s.size ? "is-selected" : ""} ${
                                        !available ? "is-unavailable" : ""
                                      }`}
                                      onClick={() => {
                                        if (!available) return;
                                        setSelectedSize(s.size);
                                        setSizeError("");
                                      }}
                                      disabled={!available}
                                    >
                                      {s.size}
                                    </button>
                                  );
                                })}
                              </div>
                              {sizeError && <small className="text-danger d-block mt-2">{sizeError}</small>}
                            </div>
                          )}
                          <span className="form-label d-block mb-2">Quantity</span>
                          <div className="pd-qty mb-4">
                            <button type="button" onClick={decreaseQty} aria-label="Decrease quantity">
                              &minus;
                            </button>
                            <input
                              type="number"
                              value={quantity}
                              readOnly={true}
                              required={true}
                              aria-label="Quantity"
                            />
                            <button type="button" onClick={increaseQty} aria-label="Increase quantity">
                              +
                            </button>
                          </div>
                          <button className="btn-stamp" onClick={handleAddToCart}>
                            Add to cart
                          </button>
                        </>
                      ) : (
                        <Link to="/shoes" className="btn-ink">
                          Go to manage products
                        </Link>
                      )}
                    </>
                  )}
                </div>
              </Col>
            </Row>
          ) : (
            <div className="m-auto w-100 text-center my-5">
              <span className="eyebrow">404</span>
              <h1 className="mt-2">Product not found</h1>
              <Link to="/Home" className="btn-ink d-inline-flex mt-3">
                Return to home
              </Link>
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetails;
