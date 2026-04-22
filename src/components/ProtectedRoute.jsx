import { Navigate } from "react-router-dom";

import { useAuth } from "../state/AuthContext";

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) {
    return <div className="panel page hero">Loading your session...</div>;
  }

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}
