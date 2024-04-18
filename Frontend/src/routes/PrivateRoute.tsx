import { useState } from "react";
import { Navigate } from "react-router-dom";

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
const PrivateRoute = ({ component: Component, authenticated, ...rest }: any) => {
  const isLogin = localStorage.getItem("token");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isAuthenticated] = useState(isLogin ? true : false);
  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" replace={true} />;
};

export default PrivateRoute;
