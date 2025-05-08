export type UserRole =
  | "indivual"
  | "staff"
  | "organization"
  | "adminstrator"
  | "super-adminstrator";

export interface UserAccount {
  id: string;
  full_name: string;
  phone_number: string;
  email: string | null;
  role: UserRole;
  verified_org: boolean;
  status: "normal" | "suspended" | "ban";
  created_at: string;
}