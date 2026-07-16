import React, { useEffect, useRef, useState } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { logOut } from "../../Redux/User/UserSlice";
import { useCartDrawer } from "../CartDrawer/CartDrawerContext";
import './TopNavbar.css';

const TopNavbar = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);
  const cart = useSelector((state) => state.cart);
  const cartDrawer = useCartDrawer();
  const [scrolled, setScrolled] = useState(false);
  const [bump, setBump] = useState(false);
  const prevCount = useRef(cart.CartItems.length);

  const handleLogout = () => {
    dispatch(logOut());
  };

  // Give the navbar a tighter, elevated look once the page scrolls.
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Bounce the cart badge whenever the item count grows.
  useEffect(() => {
    if (cart.CartItems.length > prevCount.current) {
      setBump(true);
      const timeout = setTimeout(() => setBump(false), 450);
      prevCount.current = cart.CartItems.length;
      return () => clearTimeout(timeout);
    }
    prevCount.current = cart.CartItems.length;
  }, [cart.CartItems.length]);

  return (
    <div className="navbar-wrapper">
      <Navbar expand="lg" className={`stride-navbar ${scrolled ? "is-scrolled" : ""}`} fixed="top">
        <Container>
          <NavLink to="/home" className="stride-brand">
            <span className="stride-brand-mark" aria-hidden="true" />
            STRIDE
          </NavLink>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="ms-auto" />
          {user && (
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto align-items-lg-center">
                <NavLink to="/home" className="nav-link">
                  Home
                </NavLink>
                <NavDropdown title="Categories" id="basic-nav-dropdown">
                  {categories &&
                    categories.map((category, index) => (
                      <Link
                        to={`/Category/${category.name}`}
                        className="text-capitalize dropdown-item"
                        key={index}
                      >
                        {category.name}
                      </Link>
                    ))}
                </NavDropdown>
                <NavLink to="/Products" className="nav-link">
                  Shoes
                </NavLink>
                {user.admin && (
                  <NavDropdown title="Administration" id="basic-nav-dropdown">
                    <Link to="/shoes" className="text-capitalize dropdown-item">
                      Manage Products
                    </Link>
                    <Link to="/orders" className="text-capitalize dropdown-item">
                      Manage Orders
                    </Link>
                    <Link to="/admin/users" className="text-capitalize dropdown-item">
                      Manage Users
                    </Link>
                    <Link to="/" onClick={handleLogout} className="text-capitalize dropdown-item">
                      Log Out
                    </Link>
                  </NavDropdown>
                )}
                {!user.admin && (
                  <>
                    <button
                      type="button"
                      className="nav-link stride-cart-link"
                      onClick={cartDrawer?.openDrawer}
                    >
                      Cart
                      <span className={`stride-cart-count ${bump ? "is-bumping" : ""}`}>
                        {cart.CartItems.length}
                      </span>
                    </button>
                    <NavDropdown title="User" id="basic-nav-dropdown">
                      <Link to="/Profile" className="text-capitalize dropdown-item">
                        Profile
                      </Link>
                      <Link to="/" onClick={handleLogout} className="text-capitalize dropdown-item">
                        Log Out
                      </Link>
                    </NavDropdown>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          )}
        </Container>
      </Navbar>
      {/* Render sliding text only for logged-in, non-admin users */}
      {user && !user.admin && (
        <div className="sliding-text">
          <div className="sliding-text-track">
            <span>Free shipping on all orders over $200</span>
            <span>Free shipping on all orders over $200</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopNavbar;
