import React, { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../../Components/Footer/Footer";
import Reveal from "../../Components/Reveal/Reveal";
import { productsFetch } from "../../Redux/Product/ProductSlice";
import { categoriesFetch } from "../../Redux/Category/CategorySlice";
import { getProductImageUrl } from "../../utils/productImage";
import "./Landing.css";

const FALLBACK_TICKER = ["RUNNING", "BASKETBALL", "TRAINING", "STREET", "TRACK"];

const Landing = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { products } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(productsFetch());
    dispatch(categoriesFetch());
  }, [dispatch]);

  if (user) return <Navigate to="/home" />;

  const inStock = products.filter((p) => p.stock > 0);
  const shelf = inStock.slice(0, 6);
  const tickerWords = categories.length > 0 ? categories.map((c) => c.name.toUpperCase()) : FALLBACK_TICKER;
  const tickerLoop = [...tickerWords, ...tickerWords];

  return (
    <div className="land-shell">
      <nav className="land-nav">
        <Link to="/" className="stride-brand">
          <span className="stride-brand-mark" aria-hidden="true" />
          STRIDE
        </Link>
        <div className="land-nav-links">
          <Link to="/login" className="land-nav-link">
            Sign in
          </Link>
          <Link to="/Register" className="btn-stamp btn-sm">
            Create account
          </Link>
        </div>
      </nav>

      <section className="land-hero">
        <div className="land-hero-lid">
          <span className="sku land-hero-eyebrow">SHOEBOX NO. 001</span>
          <h1 className="land-hero-title">
            <span>For every</span>
            <span>court, track</span>
            <span className="land-hero-title-accent">and street.</span>
          </h1>
          <p className="land-hero-copy">
            Real pairs, true sizes, and stock you can actually see — no filler, no guesswork.
            Just what's on the shelf, ready to ship.
          </p>
          <div className="land-hero-cta">
            <Link to="/Register" className="btn-stamp">
              Enter the shop
            </Link>
            <Link to="/login" className="btn-outline land-hero-signin">
              Sign in
            </Link>
          </div>
          {inStock.length > 0 && (
            <p className="land-hero-stat font-mono">
              {inStock.length} pairs in stock right now · {categories.length || FALLBACK_TICKER.length} categories · sizes 4–13
            </p>
          )}
        </div>
        <div className="perforation land-hero-tear" />
      </section>

      <div className="land-ticker" aria-hidden="true">
        <div className="land-ticker-track">
          {tickerLoop.map((word, i) => (
            <span key={`${word}-${i}`}>{word}</span>
          ))}
        </div>
      </div>

      {shelf.length >= 3 && (
        <section className="land-shelf">
          <Reveal>
            <div className="section-heading">
              <div>
                <span className="eyebrow">The shelf</span>
                <h2>What's on the floor today</h2>
              </div>
              <p className="land-shelf-copy">
                A rotating edit of what's in stock right now — sizes and exact counts update live once you're in.
              </p>
            </div>
          </Reveal>
          <div className="land-shelf-grid">
            {shelf.map((product, i) => {
              const category = categories.find((c) => c.id === product.CategoryId);
              return (
                <Reveal as={Link} to="/login" key={product.id} delay={i * 60} className="land-shelf-card">
                  <div className="land-shelf-media">
                    <img src={getProductImageUrl(product.image)} alt={product.name} />
                  </div>
                  <div className="land-shelf-body">
                    {category && <span className="eyebrow text-capitalize">{category.name}</span>}
                    <h3>{product.name}</h3>
                    <p className="land-shelf-price">${product.price}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>
      )}

      <section className="land-spec">
        <Reveal className="land-spec-inner">
          <span className="eyebrow">The fit sheet</span>
          <dl className="land-spec-list">
            <div className="land-spec-row">
              <dt className="font-mono">Sizes</dt>
              <dd>US 4–13, half sizes included</dd>
            </div>
            <div className="perforation" />
            <div className="land-spec-row">
              <dt className="font-mono">On the floor</dt>
              <dd>{inStock.length > 0 ? `${inStock.length} pairs in stock right now` : "New stock landing soon"}</dd>
            </div>
            <div className="perforation" />
            <div className="land-spec-row">
              <dt className="font-mono">Dispatch</dt>
              <dd>Same-day from our floor stock</dd>
            </div>
            <div className="perforation" />
            <div className="land-spec-row">
              <dt className="font-mono">Returns</dt>
              <dd>30 days, unworn, box included</dd>
            </div>
          </dl>
        </Reveal>
      </section>

      <section className="land-final">
        <Reveal className="land-final-inner">
          <h2>Ready to stride?</h2>
          <p>Create an account and see real-time stock, true-to-size charts, and a cart that remembers you.</p>
          <div className="land-final-cta">
            <Link to="/Register" className="btn-stamp">
              Create account
            </Link>
            <Link to="/login" className="btn-outline land-final-signin">
              Sign in
            </Link>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
