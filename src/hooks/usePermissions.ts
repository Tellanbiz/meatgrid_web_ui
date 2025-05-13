import { useSelector } from "react-redux";
import { selectAuthUser } from "../store/features/auth/authSelectors";
import { AdminPermissions } from "../store/features/auth/authTypes";

export const usePermissions = () => {
  const user = useSelector(selectAuthUser);
  
  const hasPermission = (permission: keyof AdminPermissions): boolean => {
    if (!user || !user.permissions) return false;
    return user.permissions[permission] || false;
  };

  const hasAnyPermission = (permissions: (keyof AdminPermissions)[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissions: (keyof AdminPermissions)[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  return { hasPermission, hasAnyPermission, hasAllPermissions };
};
