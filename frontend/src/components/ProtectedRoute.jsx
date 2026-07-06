/**
 * components/ProtectedRoute.jsx
 * Redirects unauthenticated users to /login.
 * If a role is specified, also redirects users with the wrong role.
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "./Spinner";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  // Show spinner while checking session
  if (loading) return <Spinner fullPage />;

  // Not logged in → redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // Wrong role → redirect to home
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
