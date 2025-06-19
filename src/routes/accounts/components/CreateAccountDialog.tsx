import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AccountCreateParams } from "../domain/models";
import { createAccount } from "../domain/accounts-post";
import { toast } from "sonner";

interface CreateAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function CreateAccountDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateAccountDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AccountCreateParams>({
    full_name: "",
    role: "indivual",
    email: "",
    phone_number: "",
    address: {
      label: "",
      address: "",
      building_name: "",
      points: [0, 0],
    },
  });

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith("address.")) {
      const addressField = field.split(".")[1];
      if (addressField === "points") {
        // Handle points array [latitude, longitude]
        const [lat, lng] = value
          .split(",")
          .map((coord) => parseFloat(coord.trim()) || 0);
        setFormData((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            points: [lat, lng],
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            [addressField]: value,
          },
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleLatitudeChange = (value: string) => {
    const lat = parseFloat(value) || 0;
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        points: [lat, prev.address.points[1]],
      },
    }));
  };

  const handleLongitudeChange = (value: string) => {
    const lng = parseFloat(value) || 0;
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        points: [prev.address.points[0], lng],
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.full_name.trim()) {
      toast.error("Full name is required");
      return;
    }
    if (!formData.phone_number.trim()) {
      toast.error("Phone number is required");
      return;
    }
    if (!formData.address.label.trim()) {
      toast.error("Address label is required");
      return;
    }
    if (!formData.address.address.trim()) {
      toast.error("Address is required");
      return;
    }
    if (!formData.address.building_name.trim()) {
      toast.error("Building name is required");
      return;
    }

    setLoading(true);
    try {
      const error = await createAccount(formData);
      if (error) {
        toast.error(error);
      } else {
        toast.success("Account created successfully");
        onSuccess();
        onOpenChange(false);
        // Reset form
        setFormData({
          full_name: "",
          role: "indivual",
          email: "",
          phone_number: "",
          address: {
            label: "",
            address: "",
            building_name: "",
            points: [0, 0],
          },
        });
      }
    } catch {
      toast.error("Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Account</DialogTitle>
          <DialogDescription>
            Fill in all the required fields to create a new account.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange("full_name", e.target.value)}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value: "indivual" | "organization") =>
                  handleInputChange("role", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="indivual">Individual</SelectItem>
                  <SelectItem value="organization">Organization</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter email address (optional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number *</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2 text-gray-500">
                  <span className="text-lg">🇰🇪</span>
                  <span className="text-sm font-medium">254 </span>
                </div>
                <Input
                  id="phone_number"
                  value={formData.phone_number.replace(/^254/, "")}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
                    const phoneWithCode = value ? `254${value}` : "";
                    handleInputChange("phone_number", phoneWithCode);
                  }}
                  placeholder="712345678"
                  className="pl-20"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Enter phone number without country code (e.g., 712345678)
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Address Information</h3>

            <div className="space-y-2">
              <Label htmlFor="address_label">Address Label *</Label>
              <Input
                id="address_label"
                value={formData.address.label}
                onChange={(e) =>
                  handleInputChange("address.label", e.target.value)
                }
                placeholder="e.g., Home, Office, Warehouse"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address.address}
                onChange={(e) =>
                  handleInputChange("address.address", e.target.value)
                }
                placeholder="Enter full address"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="building_name">Building Name *</Label>
              <Input
                id="building_name"
                value={formData.address.building_name}
                onChange={(e) =>
                  handleInputChange("address.building_name", e.target.value)
                }
                placeholder="Enter building name"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.address.points[0] || ""}
                  onChange={(e) => handleLatitudeChange(e.target.value)}
                  placeholder="Enter latitude (e.g., 40.7128)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.address.points[1] || ""}
                  onChange={(e) => handleLongitudeChange(e.target.value)}
                  placeholder="Enter longitude (e.g., -74.0060)"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
