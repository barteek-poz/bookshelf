import { JSX } from "react";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router";
const AdminRoute = ({children}:{children: JSX.Element}) => {
    const {user} = useAuth()
    if(!user) {
        return <Navigate to="/login" />
    }
    return user.is_admin ? <>{children}</> : <Navigate to="/" />;
}

export default AdminRoute