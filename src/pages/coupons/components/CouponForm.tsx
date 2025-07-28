import { useState, useEffect } from "react";
import TextField from "@/components/common/TextField";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export interface CouponFormData {
  name: string;
  description: string;
  coupon_key: string;
  active: boolean;
  amount: number;
  max_used: number;
  id?: string; // Optional for create mode, required for edit mode
}

interface CouponFormProps {
  initialValues?: CouponFormData;
  onSubmit: (data: CouponFormData) => void;
  onCancel: () => void;
  isLoading: boolean;
  isEditMode?: boolean;
}

const CouponForm = ({
  initialValues,
  onSubmit,
  onCancel,
  isLoading,
  isEditMode = false,
}: CouponFormProps) => {
  const [form, setForm] = useState<CouponFormData>({
    name: "",
    description: "",
    coupon_key: "",
    active: true,
    amount: 0,
    max_used: 0,
  });

  useEffect(() => {
    if (initialValues) {
      setForm(initialValues);
    }
  }, [initialValues]);

  const handleChange = (field: keyof CouponFormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <div className="card rounded-xl w-full mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField
          label="Coupon Name"
          name="name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Enter coupon name (e.g. BAHATI)"
          required
        />

        <TextField
          label="Coupon Key"
          name="coupon_key"
          value={form.coupon_key}
          onChange={(e) => handleChange("coupon_key", e.target.value)}
          placeholder="Enter coupon key (e.g. BAHATI499)"
          required
        />

        <TextField
          label="Amount"
          name="amount"
          type="number"
          step="any"
          value={form.amount === 0 ? "0" : form.amount.toString()}
          onChange={(e) =>
            handleChange(
              "amount",
              e.target.value === "" ? 0 : parseFloat(e.target.value) || 0
            )
          }
          placeholder="e.g. 300"
          required
        />

        <TextField
          label="Maximum Usage Limit"
          name="max_used"
          type="number"
          value={form.max_used === 0 ? "0" : form.max_used.toString()}
          onChange={(e) =>
            handleChange(
              "max_used",
              e.target.value === "" ? 0 : parseInt(e.target.value) || 0
            )
          }
          placeholder="e.g. 1000"
        />
        <div className="col-span-2 flex items-center justify-end space-x-4 pt-6">
          <Switch
            id="active"
            checked={form.active}
            onCheckedChange={(checked) => handleChange("active", checked)}
          />
          <Label htmlFor="active">Active</Label>
        </div>
      </div>

      <TextField
        label="Description"
        name="description"
        value={form.description}
        onChange={(e) => handleChange("description", e.target.value)}
        placeholder="Enter a description (e.g. coupon for the celeb bahati)"
        multiline
        rows={4}
      />

      <div className="flex justify-end space-x-4 mt-6">
        <Button variant="outline" className="px-6" onClick={onCancel}>
          Cancel
        </Button>

        <Button
          variant="default"
          className="px-6"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="size-4 animate-spin mr-2" />}
          {isEditMode ? "Update Coupon" : "Save Coupon"}
        </Button>
      </div>
    </div>
  );
};

export default CouponForm;
