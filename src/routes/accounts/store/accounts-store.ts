import { create } from "zustand";
import { UserAccount, AdminAccount, StaffAccount, RiderAccount, Organization } from "../domain/models";

interface AccountsState {
    // Data
    accounts: UserAccount[];
    adminAccounts: AdminAccount[];
    staffAccounts: StaffAccount[];
    riderAccounts: RiderAccount[];
    organizations: Organization[];

    // Loading states
    loading: {
        accounts: boolean;
        adminAccounts: boolean;
        staffAccounts: boolean;
        riderAccounts: boolean;
        organizations: boolean;
    };

    // Error states
    errors: {
        accounts: string | null;
        adminAccounts: string | null;
        staffAccounts: string | null;
        riderAccounts: string | null;
        organizations: string | null;
    };

    // Success messages
    successMessages: {
        updateRole: string | null;
        updatePermissions: string | null;
    };

    // Actions
    setAccounts: (accounts: UserAccount[]) => void;
    setAdminAccounts: (adminAccounts: AdminAccount[]) => void;
    setStaffAccounts: (staffAccounts: StaffAccount[]) => void;
    setRiderAccounts: (riderAccounts: RiderAccount[]) => void;
    setOrganizations: (organizations: Organization[]) => void;

    setLoading: (key: keyof AccountsState['loading'], loading: boolean) => void;
    setError: (key: keyof AccountsState['errors'], error: string | null) => void;
    setSuccessMessage: (key: keyof AccountsState['successMessages'], message: string | null) => void;

    resetState: () => void;
    clearMessages: () => void;
}

const initialState = {
    accounts: [],
    adminAccounts: [],
    staffAccounts: [],
    riderAccounts: [],
    organizations: [],
    loading: {
        accounts: false,
        adminAccounts: false,
        staffAccounts: false,
        riderAccounts: false,
        organizations: false,
    },
    errors: {
        accounts: null,
        adminAccounts: null,
        staffAccounts: null,
        riderAccounts: null,
        organizations: null,
    },
    successMessages: {
        updateRole: null,
        updatePermissions: null,
    },
};

export const useAccountsStore = create<AccountsState>((set) => ({
    ...initialState,

    setAccounts: (accounts) => set({ accounts }),
    setAdminAccounts: (adminAccounts) => set({ adminAccounts }),
    setStaffAccounts: (staffAccounts) => set({ staffAccounts }),
    setRiderAccounts: (riderAccounts) => set({ riderAccounts }),
    setOrganizations: (organizations) => set({ organizations }),

    setLoading: (key, loading) =>
        set((state) => ({
            loading: { ...state.loading, [key]: loading }
        })),

    setError: (key, error) =>
        set((state) => ({
            errors: { ...state.errors, [key]: error }
        })),

    setSuccessMessage: (key, message) =>
        set((state) => ({
            successMessages: { ...state.successMessages, [key]: message }
        })),

    resetState: () => set(initialState),

    clearMessages: () => set({
        errors: {
            accounts: null,
            adminAccounts: null,
            staffAccounts: null,
            riderAccounts: null,
            organizations: null,
        },
        successMessages: {
            updateRole: null,
            updatePermissions: null,
        },
    }),
})); 