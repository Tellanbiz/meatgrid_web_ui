import { ReactNode } from "react";
import { AdminPermissions } from "@/store/features/auth/authTypes";
import { usePermissions } from "@/shared/hooks/usePermissions";

interface PermissionGuardProps {
  children: ReactNode;
  requiredPermissions: (keyof AdminPermissions)[];
  requireAll?: boolean;
  fallback?: ReactNode;
}

export const PermissionGuard = ({
  children,
  requiredPermissions,
  requireAll = true,
  fallback = null,
}: PermissionGuardProps) => {
  const { hasAllPermissions, hasAnyPermission } = usePermissions();

  const hasAccess = requireAll
    ? hasAllPermissions(requiredPermissions)
    : hasAnyPermission(requiredPermissions);

  if (!hasAccess) return <>{fallback}</>;

  return <>{children}</>;
};
