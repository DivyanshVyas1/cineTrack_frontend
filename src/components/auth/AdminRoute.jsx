import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
}

export default AdminRoute;
