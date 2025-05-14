import { AdminPermissions } from "../accountTypes";

export interface UpdateAdministratorPermissionsRequest extends AdminPermissions {
    user_id: string;
}
