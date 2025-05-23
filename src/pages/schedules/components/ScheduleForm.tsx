import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { convert12to24, convert24to12 } from "../../../utils/dateUtils";

export interface ScheduleFormData {
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

interface ScheduleFormProps {
  data: ScheduleFormData;
  onChange: (data: ScheduleFormData) => void;
  disabled?: boolean;
}

const ScheduleForm = ({
  data,
  onChange,
  disabled = false,
}: ScheduleFormProps) => {
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time24 = e.target.value;
    if (time24) {
      const time12 = convert24to12(time24);
      onChange({ ...data, time: time12 });
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, max: parseInt(e.target.value) || 0 });
  };

  const handleDayToggle = (day: keyof ScheduleFormData) => {
    onChange({ ...data, [day]: !data[day] });
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label>Delivery Time</Label>
        <Input
          type="time"
          value={convert12to24(data.time)}
          onChange={handleTimeChange}
          className="w-fit"
        />
      </div>

      <div className="grid gap-2">
        <Label>Maximum Orders</Label>
        <Input
          type="number"
          value={data.max}
          onChange={handleMaxChange}
          min={1}
          disabled={disabled}
        />
      </div>

      <div className="grid gap-2">
        <Label>Available Days</Label>
        <div className="flex flex-wrap gap-4 mt-1">
          {[
            { key: "monday" as const, label: "Mon" },
            { key: "tuesday" as const, label: "Tue" },
            { key: "wednesday" as const, label: "Wed" },
            { key: "thursday" as const, label: "Thu" },
            { key: "friday" as const, label: "Fri" },
            { key: "saturday" as const, label: "Sat" },
            { key: "sunday" as const, label: "Sun" },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center space-x-2">
              <Switch
                id={`day-${key}`}
                checked={data[key]}
                onCheckedChange={() => handleDayToggle(key)}
                disabled={disabled}
              />
              <Label htmlFor={`day-${key}`}>{label}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2 mt-4">
        <Switch
          id="schedule-active"
          checked={data.active}
          onCheckedChange={(checked) => onChange({ ...data, active: checked })}
          disabled={disabled}
        />
        <Label htmlFor="schedule-active">Active</Label>
      </div>
    </div>
  );
};

export default ScheduleForm;
