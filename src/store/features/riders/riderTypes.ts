export interface RiderProfile {
  picture: string;
  full_name: string;
}

export interface Rider {
  id: string;
  profile: RiderProfile;
  verified: boolean;
  verified_on: string;
}
