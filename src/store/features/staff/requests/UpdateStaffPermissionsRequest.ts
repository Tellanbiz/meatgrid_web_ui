export interface UpdateStaffPermissionsRequest {
  can_claim: boolean;
  can_dispatch: boolean;
  user_id: string;
  store_id: string;
}
