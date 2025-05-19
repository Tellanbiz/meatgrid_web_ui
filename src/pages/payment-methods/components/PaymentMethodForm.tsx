import { Loader2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";

export interface PaymentMethodFormData {
  name: string;
  tag: string;
  active: boolean;
}

interface PaymentMethodFormProps {
  initialValues?: PaymentMethodFormData;
  onSubmit: (data: PaymentMethodFormData) => void;
  onCancel: () => void;
  isEditMode?: boolean;
  isLoading?: boolean;
}
const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  isEditMode = false,
  isLoading = false,
}) => {
  const [form, setForm] = useState<PaymentMethodFormData>({
    name: "",
    tag: "",
    active: false,
  });

  const initialValuesLoaded = useRef(false);

  useEffect(() => {
    if (initialValues && !initialValuesLoaded.current) {
      setForm({
        ...initialValues,
      });
      initialValuesLoaded.current = true;
    }
  }, [initialValues]);

  const handleChange = (field: keyof PaymentMethodFormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="space-y-6">
        <div className="flex flex-col gap-y-2">
          <Label>Name</Label>
          <Input
            placeholder="Payment Method Name"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-y-3">
        <Label>Payment Status</Label>
        <RadioGroup
          value={form.active ? "active" : "inactive"}
          onValueChange={(value) => handleChange("active", value === "active")}
          className="grid grid-cols-2 gap-4"
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

      <div className="flex justify-end mt-4">
        <Button variant="outline" className="mr-2" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading && <Loader2 className="animate-spin mr-2 size-4" />}

          {isEditMode ? "Update" : "Save"}
        </Button>
      </div>
    </div>
  );
};
export default PaymentMethodForm;
