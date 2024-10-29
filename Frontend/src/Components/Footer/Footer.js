import React, { Fragment } from "react";

const Footer = () => {
  return (
    <Fragment>
      <div className="text-center bg-dark text-white py-2 fixed-bottom">
        <span><p>Challenge Final. &copy; {new Date().getFullYear()} SOCIUS Bootcamp. All Rights Reserved.</p></span>
      </div>
    </Fragment>
  );
};

export default Footer;
