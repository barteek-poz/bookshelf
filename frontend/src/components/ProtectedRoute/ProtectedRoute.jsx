import { useContext } from "react";
import Loader from "../Loader/Loader";
import { Navigate } from "react-router";
import { AuthContext } from "../../context/AuthContext.tsx";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  if (loading) return <Loader />;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
