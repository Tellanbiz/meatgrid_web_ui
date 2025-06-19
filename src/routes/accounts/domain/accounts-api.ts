import axios from "@/service/api";
import {
    UserAccount,
    AdminAccount,
    StaffAccount,
    RiderAccount,
    Organization,
    FetchAccountsRequest,
    UpdateUserRoleRequest,
    UpdateAdministratorPermissionsRequest,
    FetchStaffRequest,
    FetchRidersRequest,
    FetchOrganizationsRequest,
} from "./models";

export async function createAccount(params?: FetchAccountsRequest): Promise<UserAccount[]> {
    const response = await axios.get<UserAccount[]>("/accounts", { params });
    return response.data;
}

// Accounts API
export async function fetchAccounts(params?: FetchAccountsRequest): Promise<UserAccount[]> {
    const response = await axios.get<UserAccount[]>("/accounts", { params });
    return response.data;
}

export async function updateUserRole(params: UpdateUserRoleRequest): Promise<string> {
    const response = await axios.post("/admin/roles", params);
    return response.data.message;
}

// Administrators API
export async function fetchAdminAccounts(): Promise<AdminAccount[]> {
    const response = await axios.get<AdminAccount[]>("/admins");
    return response.data;
}

export async function updateAdministratorPermissions(params: UpdateAdministratorPermissionsRequest): Promise<string> {
    const response = await axios.post("/admin/permissions", params);
    return response.data.message;
}

// Staff API
export async function fetchStaff(params?: FetchStaffRequest): Promise<StaffAccount[]> {
    const response = await axios.get<StaffAccount[]>("/staff", { params });
    return response.data;
}

// Riders API
export async function fetchRiders(params?: FetchRidersRequest): Promise<RiderAccount[]> {
    const response = await axios.get<RiderAccount[]>("/riders", { params });
    return response.data;
}

// Organizations API
export async function fetchOrganizations(params?: FetchOrganizationsRequest): Promise<Organization[]> {
    const response = await axios.get<Organization[]>("/organizations", { params });
    return response.data;
} 

