import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../../Components/Footer/Footer";
import Reveal from "../../Components/Reveal/Reveal";
import { productsFetch } from "../../Redux/Product/ProductSlice";
import { categoriesFetch } from "../../Redux/Category/CategorySlice";
import { getProductImageUrl } from "../../utils/productImage";
import "./Landing.css";

const FALLBACK_TICKER = ["RUNNING", "BASKETBALL", "TRAINING", "STREET", "TRACK"];

const clamp01 = (n) => Math.min(1, Math.max(0, n));
// Maps progress from one [start, end] window onto a fresh 0-1 range, so
// different pieces of the "inside the box" content can settle at their own
// point during the lid's slide instead of all moving in lockstep.
const remap = (value, start, end) => clamp01((value - start) / (end - start));

// Tracks how far the user has scrolled through a tall wrapper while its
// child is pinned with position: sticky, as a 0 (lid closed) to 1 (lid
// fully off) progress value - the standard scrollytelling measurement.
const useLidProgress = () => {
  const wrapRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      // CSS collapses the hero to a single static section in this case (see
      // Landing.css) - progress stays at its neutral default and is unused.
      return;
    }
    const wrap = wrapRef.current;
    if (!wrap) return;
    let ticking = false;

    const measure = () => {
      ticking = false;
      const rect = wrap.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      setProgress(scrollable <= 0 ? 1 : clamp01(-rect.top / scrollable));
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return [wrapRef, progress];
};

const Landing = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { products } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  const [heroWrapRef, progress] = useLidProgress();

  useEffect(() => {
    dispatch(productsFetch());
    dispatch(categoriesFetch());
  }, [dispatch]);

  if (user) return <Navigate to="/home" />;

  const inStock = products.filter((p) => p.stock > 0);
  const shelf = inStock.slice(0, 6);
  const peek = inStock.slice(0, 3);
  const tickerWords = categories.length > 0 ? categories.map((c) => c.name.toUpperCase()) : FALLBACK_TICKER;
  // Repeated well past double so short category lists still fill the strip
  // edge-to-edge - two copies alone can leave a visible gap once the loop
  // point (-50%) is reached before the second copy has scrolled into view.
  const tickerLoop = Array(6)
    .fill(tickerWords)
    .flat()
    .map((word, i) => ({ word, i }));

  const insideReveal = remap(progress, 0.12, 0.75);

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

      <section className="land-hero-wrap" ref={heroWrapRef}>
        <div className="land-hero-pin">
          <div className="land-hero-inside">
            <span className="sku land-hero-inside-label">Inside the box</span>
            {peek.length > 0 && (
              <div className="land-hero-inside-photos">
                {peek.map((product, i) => {
                  const itemReveal = remap(progress, 0.15 + i * 0.06, 0.6 + i * 0.06);
                  return (
                    <div
                      key={product.id}
                      className="land-hero-inside-photo"
                      style={{
                        opacity: itemReveal,
                        transform: `translateY(${(1 - itemReveal) * 36}px) rotate(${(i - 1) * 4}deg)`,
                      }}
                    >
                      <img src={getProductImageUrl(product.image)} alt={product.name} />
                    </div>
                  );
                })}
              </div>
            )}
            {inStock.length > 0 && (
              <p
                className="land-hero-stat font-mono"
                style={{ opacity: insideReveal, transform: `translateY(${(1 - insideReveal) * 20}px)` }}
              >
                {inStock.length} pairs in stock right now · {categories.length || FALLBACK_TICKER.length} categories · sizes 4–13
              </p>
            )}
          </div>

          <div
            className="land-hero-lid"
            style={{ transform: `translateY(${progress * -100}%) rotate(${progress * -3}deg)` }}
          >
            <div className="land-hero-lid-inner">
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
              <span className="land-hero-scroll-cue" aria-hidden="true">
                Lift the lid ↓
              </span>
            </div>
            <div className="perforation land-hero-tear" />
          </div>
        </div>
      </section>

      <div className="land-ticker" aria-hidden="true">
        <div className="land-ticker-track">
          {tickerLoop.map(({ word, i }) => (
            <span key={i}>{word}</span>
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
