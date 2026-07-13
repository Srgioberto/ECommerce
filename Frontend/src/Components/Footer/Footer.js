import React, { Fragment } from "react";

const Footer = () => {
  return (
    <Fragment>
      <div className="text-center bg-dark text-white py-2 fixed-bottom">
        <span><p>Copyright &copy; {new Date().getFullYear()} Srgioberto. All Rights Reserved.</p></span>
      </div>
    </Fragment>
  );
};

export default Footer;
