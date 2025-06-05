import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AdminContext } from "../App.js"; // or wherever you defined AdminContext

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { isUserLoggedIn, userRole } = useContext(AdminContext);

  if (!isUserLoggedIn) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(userRole))
    return <Navigate to="/unauthorised" replace />;

  return children;
};

export default RoleProtectedRoute;
