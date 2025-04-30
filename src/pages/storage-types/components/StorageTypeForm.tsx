import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

export interface StorageTypeFormData {
  name: string;
  description: string;
  duration_type: "short" | "long";
  expected_duration: number;
  min_temp: number;
  max_temp: number;
}

interface StorageTypeFormProps {
  initialValues?: StorageTypeFormData;
  onSubmit: (data: StorageTypeFormData) => void;
  onCancel: () => void;
  isEditMode?: boolean;
  isLoading?: boolean;
}

const StorageTypeForm: React.FC<StorageTypeFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  isEditMode = false,
  isLoading = false,
}) => {
  const [form, setForm] = useState<StorageTypeFormData>({
    name: "",
    description: "",
    duration_type: "short",
    expected_duration: 0,
    min_temp: 0,
    max_temp: 0,
  });

  useEffect(() => {
    if (initialValues) {
      setForm({ ...initialValues });
    }
  }, [initialValues]);

  const handleChange = (field: keyof StorageTypeFormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <div className="card">
      <div className="grid grid-cols-2 gap-x-10">
        <div className="space-y-6">
          <div className="flex flex-col gap-y-2">
            <Label>Name</Label>
            <Input
              placeholder="Storage type name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Description"
              rows={3}
              className="resize-none"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          <div className="flex flex-col"></div>
          <Label className="mb-2">Duration Term</Label>
          <Select
            value={form.duration_type}
            onValueChange={(value) =>
              handleChange("duration_type", value as "short" | "long")
            }
            defaultValue="short"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select duration type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">Short Term</SelectItem>
              <SelectItem value="long">Long Term</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col gap-y-2">
            <Label>Expected Duration (days)</Label>
            <Input
              type="tel"
              placeholder="e.g., 30"
              value={form.expected_duration}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (!isNaN(value)) {
                  handleChange("expected_duration", Number(e.target.value));
                }
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-x-4">
            <div className="flex flex-col gap-y-2">
              <Label>Min Temp (°C)</Label>
              <Input
                type="tel"
                placeholder="e.g., -10"
                value={form.min_temp}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (!isNaN(value)) {
                    handleChange("min_temp", value);
                  }
                }}
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>Max Temp (°C)</Label>
              <Input
                type="tel"
                placeholder="e.g., 10"
                value={form.max_temp}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (!isNaN(value)) {
                    handleChange("max_temp", Number(e.target.value));
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <Button variant="outline" className="mr-2" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin mr-2 size-4" /> : null}
          {isEditMode ? "Update" : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default StorageTypeForm;
