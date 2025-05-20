import { JSX } from "react";
import { Navigate } from "react-router-dom";
import { usePermissions } from "../hooks/usePermissions";
import { AdminPermissions } from "../store/features/auth/authTypes";
import NotAuthorized from "../components/NotAuthorized";

interface PrivateRouteProps {
  children: JSX.Element;
  requiredPermissions?: (keyof AdminPermissions)[];
  requireAll?: boolean;
}

const PrivateRoute = ({
  children,
  requiredPermissions = [],
  requireAll = true,
}: PrivateRouteProps) => {
  const token = localStorage.getItem("token");
  const { hasAllPermissions, hasAnyPermission } = usePermissions();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const hasAccess =
    requiredPermissions.length === 0 ||
    (requireAll
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions));

  if (!hasAccess) {
    return <NotAuthorized />;
  }

  return children;
};

export default PrivateRoute;
