import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuth = useAuthStore((s) => s.isAuthenticated)();
  if (!isAuth) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
