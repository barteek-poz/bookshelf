import { JSX } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import Loader from "../Loader/Loader";

const ProtectedRoute = ({children}:{children: JSX.Element}) => {
  const auth = useAuth()
  if(!auth) { //if no context 
    return <Navigate to="/login" />
  }
  const { isAuthenticated, loading } = auth;
  if (loading) return <Loader/>;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export default ProtectedRoute;
