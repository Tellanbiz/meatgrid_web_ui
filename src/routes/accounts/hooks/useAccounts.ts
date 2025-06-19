import { useCallback } from "react";
import { toast } from "sonner";
import { useAccountsStore } from "../store/accounts-store";
import {
    fetchAccounts,
    fetchAdminAccounts,
    fetchStaff,
    fetchRiders,
    fetchOrganizations,
    updateUserRole,
    updateAdministratorPermissions,
} from "../domain/accounts-api";
import type {
    FetchAccountsRequest,
    UpdateUserRoleRequest,
    UpdateAdministratorPermissionsRequest,
    FetchStaffRequest,
    FetchRidersRequest,
    FetchOrganizationsRequest,
} from "../domain/models";

export function useAccounts() {
    const {
        accounts,
        adminAccounts,
        staffAccounts,
        riderAccounts,
        organizations,
        loading,
        errors,
        successMessages,
        setAccounts,
        setAdminAccounts,
        setStaffAccounts,
        setRiderAccounts,
        setOrganizations,
        setLoading,
        setError,
        setSuccessMessage,
        clearMessages,
    } = useAccountsStore();

    // Fetch accounts
    const fetchAccountsData = useCallback(async (params?: FetchAccountsRequest) => {
        try {
            setLoading("accounts", true);
            setError("accounts", null);
            const data = await fetchAccounts(params);
            setAccounts(data);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to fetch accounts";
            setError("accounts", errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading("accounts", false);
        }
    }, [setLoading, setError, setAccounts]);

    // Fetch admin accounts
    const fetchAdminAccountsData = useCallback(async () => {
        try {
            setLoading("adminAccounts", true);
            setError("adminAccounts", null);
            const data = await fetchAdminAccounts();
            setAdminAccounts(data);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to fetch admin accounts";
            setError("adminAccounts", errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading("adminAccounts", false);
        }
    }, [setLoading, setError, setAdminAccounts]);

    // Fetch staff
    const fetchStaffData = useCallback(async (params?: FetchStaffRequest) => {
        try {
            setLoading("staffAccounts", true);
            setError("staffAccounts", null);
            const data = await fetchStaff(params);
            setStaffAccounts(data);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to fetch staff";
            setError("staffAccounts", errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading("staffAccounts", false);
        }
    }, [setLoading, setError, setStaffAccounts]);

    // Fetch riders
    const fetchRidersData = useCallback(async (params?: FetchRidersRequest) => {
        try {
            setLoading("riderAccounts", true);
            setError("riderAccounts", null);
            const data = await fetchRiders(params);
            setRiderAccounts(data);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to fetch riders";
            setError("riderAccounts", errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading("riderAccounts", false);
        }
    }, [setLoading, setError, setRiderAccounts]);

    // Fetch organizations
    const fetchOrganizationsData = useCallback(async (params?: FetchOrganizationsRequest) => {
        try {
            setLoading("organizations", true);
            setError("organizations", null);
            const data = await fetchOrganizations(params);
            setOrganizations(data);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to fetch organizations";
            setError("organizations", errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading("organizations", false);
        }
    }, [setLoading, setError, setOrganizations]);

    // Update user role
    const updateUserRoleData = useCallback(async (params: UpdateUserRoleRequest) => {
        try {
            setError("accounts", null);
            setSuccessMessage("updateRole", null);
            const message = await updateUserRole(params);
            setSuccessMessage("updateRole", message);
            toast.success(message);
            // Refresh accounts after role update
            await fetchAccountsData();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to update user role";
            setError("accounts", errorMessage);
            toast.error(errorMessage);
        }
    }, [setError, setSuccessMessage, fetchAccountsData]);

    // Update administrator permissions
    const updateAdministratorPermissionsData = useCallback(async (params: UpdateAdministratorPermissionsRequest) => {
        try {
            setError("adminAccounts", null);
            setSuccessMessage("updatePermissions", null);
            const message = await updateAdministratorPermissions(params);
            setSuccessMessage("updatePermissions", message);
            toast.success(message);
            // Refresh admin accounts after permissions update
            await fetchAdminAccountsData();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to update administrator permissions";
            setError("adminAccounts", errorMessage);
            toast.error(errorMessage);
        }
    }, [setError, setSuccessMessage, fetchAdminAccountsData]);

    return {
        // Data
        accounts,
        adminAccounts,
        staffAccounts,
        riderAccounts,
        organizations,

        // Loading states
        loading,

        // Error states
        errors,

        // Success messages
        successMessages,

        // Actions
        fetchAccounts: fetchAccountsData,
        fetchAdminAccounts: fetchAdminAccountsData,
        fetchStaff: fetchStaffData,
        fetchRiders: fetchRidersData,
        fetchOrganizations: fetchOrganizationsData,
        updateUserRole: updateUserRoleData,
        updateAdministratorPermissions: updateAdministratorPermissionsData,
        clearMessages,
    };
} 