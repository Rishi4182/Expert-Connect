import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function PrivateRoute({children}) {
    const {user} = useAuth();

    if (!user) {
        return <Navigate to="/"/>;
    }

    return children;
};

export default PrivateRoute;