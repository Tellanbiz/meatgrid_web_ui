export interface UserAccount {
  id: string;
  full_name: string;
  phone_number: string;
  email: string | null;
  role:
    | "indivual"
    | "staff"
    | "organization"
    | "adminstrator"
    | "super-adminstrator";
  verified_org: boolean;
  status: "normal" | "suspended" | "ban";
  created_at: string;
}
