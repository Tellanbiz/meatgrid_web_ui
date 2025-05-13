import { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { usePermissions } from "../hooks/usePermissions";
import { AdminPermissions } from "../store/features/auth/authTypes";

interface PrivateRouteProps {
  children: JSX.Element;
  requiredPermissions?: (keyof AdminPermissions)[];
  requireAll?: boolean;
}

const PrivateRoute = ({ 
  children, 
  requiredPermissions = [], 
  requireAll = true 
}: PrivateRouteProps) => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const { hasAllPermissions, hasAnyPermission } = usePermissions();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const hasAccess = requiredPermissions.length === 0 || 
    (requireAll ? hasAllPermissions(requiredPermissions) : hasAnyPermission(requiredPermissions));

  if (!hasAccess) {
    return <Navigate to="/404" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
