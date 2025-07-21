import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

export interface WarehouseFormData {
  id?: string;
  name: string;
  description?: string;
  address: string;
  building?: string;
  latitude?: string;
  longitude?: string;
  isWarehouse: boolean;
  isStore: boolean;
  status: "active" | "inactive";
}

interface WarehouseFormProps {
  initialValues?: WarehouseFormData;
  onSubmit: (data: WarehouseFormData) => void;
  onCancel: () => void;
  isEditMode?: boolean;
  isLoading?: boolean;
}

const WarehouseForm: React.FC<WarehouseFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  isEditMode = false,
  isLoading = false,
}) => {
  const [form, setForm] = useState<WarehouseFormData>({
    id: "",
    name: "",
    description: "",
    address: "",
    building: "",
    latitude: "",
    longitude: "",
    isWarehouse: false,
    isStore: false,
    status: "active",
  });

  useEffect(() => {
    if (initialValues) {
      setForm({
        ...initialValues,
      });
    }
  }, [initialValues]);

  const handleChange = (field: keyof WarehouseFormData, value: unknown) => {
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
            <Label>Store Name</Label>
            <Input
              placeholder="Name of the store"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <Label>
              Description{" "}
              <span className="text-xs font-light text-gray-400 leading-none -ml-1">
                Optional
              </span>
            </Label>
            <Textarea
              placeholder="Description"
              rows={3}
              className="resize-none"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <Label>Address</Label>
            <Input
              placeholder="Address of the store"
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <Label>Building Name</Label>
            <Input
              placeholder="Building"
              value={form.building}
              onChange={(e) => handleChange("building", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 space-x-2">
            <div className="flex flex-col space-y-2">
              <Label>
                Latitude
                <span className="text-xs text-gray-400 font-light -ml-1">
                  Optional
                </span>
              </Label>
              <Input
                type="number"
                step="any"
                placeholder="-2.98759"
                value={form.latitude}
                onChange={(e) => handleChange("latitude", e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label>
                Longitude
                <span className="text-xs text-gray-400 font-light -ml-1">
                  Optional
                </span>
              </Label>
              <Input
                type="number"
                step="any"
                placeholder="31.2568"
                value={form.longitude}
                onChange={(e) => handleChange("longitude", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col gap-y-3">
            <Label>Store Type</Label>
            <div className="flex gap-y-2 space-x-3 items-center">
              <Checkbox
                id="is_warehouse"
                checked={form.isWarehouse}
                onCheckedChange={(val) =>
                  handleChange("isWarehouse", Boolean(val))
                }
              />
              <Label htmlFor="is_warehouse" className="text-gray-500 w-full">
                Is WareHouse
              </Label>
            </div>

            <div className="flex gap-y-2 space-x-3 items-center">
              <Checkbox
                id="is_store"
                checked={form.isStore}
                onCheckedChange={(val) => handleChange("isStore", Boolean(val))}
              />
              <Label htmlFor="is_store" className="text-gray-500 w-full">
                Is Store
              </Label>
            </div>
          </div>

          <div className="flex flex-col gap-y-3">
            <Label>Store Status</Label>
            <RadioGroup
              value={form.status}
              onValueChange={(value) =>
                handleChange("status", value as "active" | "inactive")
              }
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="active" id="active" />
                <Label htmlFor="active" className="text-gray-500 w-full">
                  Active
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="inactive" id="inactive" />
                <Label htmlFor="inactive" className="text-gray-500 w-full">
                  Inactive
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <Button variant="outline" className="mr-2" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          {isLoading ? <Loader2 className="animate-spin mr-2 size-4" /> : null}

          {isLoading ? "Processing..." : isEditMode ? "Update" : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default WarehouseForm;
