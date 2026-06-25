import { Navigate, Outlet } from "react-router-dom";
import { isAdminAuthenticated } from "../../../services/api/admin";

/**
 * Wraps all protected admin routes.
 * If no adminToken is found in localStorage, redirects to /admin/login.
 */
export default function AdminRoute() {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }
  return <Outlet />;
}
