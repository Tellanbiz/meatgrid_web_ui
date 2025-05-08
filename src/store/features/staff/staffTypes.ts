export interface StaffProfile {
  picture: string;
  full_name: string;
}

export interface StaffStore {
  id: string;
  name: string;
}

export interface Staff {
  id: string;
  profile: StaffProfile;
  store: StaffStore;
  can_dispatch: boolean;
  can_claim: boolean;
}
