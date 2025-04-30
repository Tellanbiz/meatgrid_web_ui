export interface StorageType {
  id: string;
  name: string;
  description: string;
  duration_type: "short" | "long";
  expected_duration: number;
  min_temp: number;
  max_temp: number;
  created_at: string;
}
