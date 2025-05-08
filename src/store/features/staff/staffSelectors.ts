import { RootState } from "../../store";
import { Staff } from "./staffTypes";

export const selectStaffs = (state: RootState): Staff[] => state.staff.staffs;

export const selectCurrentStaff = (state: RootState) =>
  state.staff.currentStaff;

export const selectStaffById = (
  state: RootState,
  staffId: string
): Staff | undefined =>
  state.staff.staffs.find((staff) => staff.id === staffId);

export const selectStaffsByStoreId = (
  state: RootState,
  storeId: string
): Staff[] => state.staff.staffs.filter((staff) => staff.store.id === storeId);

export const selectIsFetchingStaffs = (state: RootState): boolean =>
  state.staff.status === "loading" && state.staff.currentOperation === "fetch";

export const selectIsFetchingStaffInfo = (state: RootState): boolean =>
  state.staff.status === "loading" &&
  state.staff.currentOperation === "staffInfo";

export const selectIsUpdatingStaffPermissions = (state: RootState): boolean =>
  state.staff.status === "loading" &&
  state.staff.currentOperation === "updatePermissions";

export const selectStaffError = (state: RootState): string | null =>
  state.staff.error;

export const selectStaffSuccessMessage = (state: RootState): string | null =>
  state.staff.successMessage;

export const selectStaffStatus = (state: RootState): string =>
  state.staff.status;
