import React from "react";
import { NavLink } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="stride-footer">
      <div className="stride-footer-inner">
        <div className="stride-footer-brand">
          <span className="stride-brand-mark" aria-hidden="true" />
          <div>
            <p className="stride-footer-word">STRIDE</p>
            <p className="stride-footer-tagline">Footwear for every court, track and street.</p>
          </div>
        </div>

        <nav className="stride-footer-links" aria-label="Footer">
          <NavLink to="/home">Home</NavLink>
          <NavLink to="/Products">Shop</NavLink>
          <NavLink to="/Cart">Cart</NavLink>
          <NavLink to="/Profile">Account</NavLink>
        </nav>
      </div>

      <div className="perforation stride-footer-rule" />

      <div className="stride-footer-meta">
        <span>Copyright &copy; {new Date().getFullYear()} Srgioberto. All rights reserved.</span>
        <span className="sku">STRIDE / ECOMM-01</span>
      </div>
    </footer>
  );
};

export default Footer;
