export interface UpdateScheduleRequest {
  id: string;
  time: string;
  max: number;
  active: boolean;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}
