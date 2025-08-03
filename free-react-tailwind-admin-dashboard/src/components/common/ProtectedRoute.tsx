import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: string | string[];
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user } = useContext(AppContext)!;
  if (!user) return <Navigate to="/signin" />;
  if (role) {
    if (Array.isArray(role) && !role.includes(user.role)) return <Navigate to="/not-found" />;
    if (typeof role === "string" && user.role !== role) return <Navigate to="/not-found" />;
  }
  return <>{children}</>;
}