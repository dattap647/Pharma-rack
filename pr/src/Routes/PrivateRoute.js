import React from "react";
import { Navigate } from "react-router-dom";
import { getRole, isLoggedIn } from "../auth/index";

const PrivateRoute = () => {
  const role = getRole();
  return isLoggedIn() ? (
    role === 1 ? (
      <Navigate to={"/admin"} replace />
    ) : (
      <Navigate to={"/user"} replace />
    )
  ) : (
    <Navigate to={"/login"} />
  );
};

export default PrivateRoute;
