import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const ProtectedRoutesAdmin = (props) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (user && !user.admin) {
      navigate(-1);
    }
  }, [user,navigate]);

  if (!user) return <Navigate to="/" />;

  if (user.admin) {
    return <Outlet {...props} />;
  }
};

export default ProtectedRoutesAdmin;
