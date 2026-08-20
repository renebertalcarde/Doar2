import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../auth/authService";

const AuthGuard = () => {
    if (!isAuthenticated()) {
        return <Navigate to="/signin" replace />;
    }

    return <Outlet />;
};

export default AuthGuard;
