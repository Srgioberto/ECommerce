import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutesUser = (props) => {
  const { user } = useSelector((state) => state.user);

  if (!user) return <Navigate to="/" />;

  if (user) {
    return <Outlet {...props} />;
  }
};

export default ProtectedRoutesUser;
