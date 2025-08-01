import { Loader2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export interface PaymentMethodFormData {
  name: string;
  tag: string;
  active: boolean;
  disable_total: boolean;
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
    disable_total: false,
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
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Payment Status</Label>
          <p className="text-sm text-gray-500">
            Enable or disable this payment method
          </p>
        </div>
        <Switch
          checked={form.active}
          onCheckedChange={(checked) => handleChange("active", checked)}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Disable Total</Label>
          <p className="text-sm text-gray-500">
            Enable or disable total calculation for this payment method
          </p>
        </div>
        <Switch
          name="disable_total"
          checked={form.disable_total}
          onCheckedChange={(checked) => handleChange("disable_total", checked)}
        />
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
