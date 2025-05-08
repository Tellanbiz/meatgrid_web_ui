import { UserRole } from "../accountTypes";

export interface UpdateUserRoleRequest {
  id: string;
  role: UserRole;
}