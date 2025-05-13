import { AdminPermissions } from "../store/features/auth/authTypes";

export interface NavigationPermissions {
  requiredPermissions?: (keyof AdminPermissions)[];
  requireAll?: boolean;
}

export interface NavigationItem extends NavigationPermissions {
  title: string;
  url: string;
  icon?: string;
  isActive?: boolean;
  items?: NavigationSubItem[];
}

export interface NavigationSubItem extends NavigationPermissions {
  title: string;
  url: string;
  icon?: string;
}

export const filterNavigationByPermissions = (
  items: NavigationItem[],
  hasPermission: (permission: keyof AdminPermissions) => boolean
): NavigationItem[] => {
  return items.filter(item => {
    // Check main item permissions
    if (item.requiredPermissions?.length) {
      const hasAccess = item.requireAll
        ? item.requiredPermissions.every(p => hasPermission(p))
        : item.requiredPermissions.some(p => hasPermission(p));
      
      if (!hasAccess) return false;
    }

    // Filter sub-items if they exist
    if (item.items?.length) {
      item.items = item.items.filter(subItem => {
        if (!subItem.requiredPermissions?.length) return true;
        
        return subItem.requireAll
          ? subItem.requiredPermissions.every(p => hasPermission(p))
          : subItem.requiredPermissions.some(p => hasPermission(p));
      });
    }

    return true;
  }).filter(item => !item.items?.length || item.items.length > 0);
};
