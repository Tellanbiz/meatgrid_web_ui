import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAccounts } from "../hooks/useAccounts";
import { AdminAccount, AdminPermissions } from "../domain/models";

interface UpdateAdministratorPermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  admin: AdminAccount | null;
  onSuccess: () => void;
}

export function UpdateAdministratorPermissionsDialog({
  open,
  onOpenChange,
  admin,
  onSuccess,
}: UpdateAdministratorPermissionsDialogProps) {
  const { updateAdministratorPermissions } = useAccounts();
  const [permissions, setPermissions] = useState<AdminPermissions>({
    allow_store_view: false,
    allow_store_submit: false,
    allow_product_view: false,
    allow_product_submit: false,
    allow_category_view: false,
    allow_category_submit: false,
    allow_orders_view: false,
    allow_orders_submit: false,
    allow_payment_method_view: false,
    allow_payment_method_submit: false,
    allow_suppliers_view: false,
    allow_suppliers_submit: false,
    allow_warehouse_view: false,
    allow_warehouse_submit: false,
    allow_storage_type_view: false,
    allow_storage_type_submit: false,
    allow_stock_view: false,
    allow_stock_submit: false,
    allow_accounts_view: false,
    allow_accounts_submit: false,
    allow_staff_view: false,
    allow_staff_submit: false,
    allow_riders_view: false,
    allow_riders_submit: false,
    allow_banners_view: false,
    allow_banners_submit_view: false,
    allow_promotional_tag_view: false,
    allow_promotional_tag_submit: false,
    allow_adminstrators_view: false,
    allow_adminstrators_submit: false,
    allow_configuration_view: false,
    allow_configuration_submit: false,
    receive_stock_alerts: false,
    receice_orders_alerts: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open && admin) {
      // Set current permissions when dialog opens
      setPermissions(admin.permissions);
    }
  }, [open, admin]);

  const handlePermissionChange = (
    key: keyof AdminPermissions,
    value: boolean
  ) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!admin) {
      toast.error("No administrator selected");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateAdministratorPermissions({
        admin_id: admin.id,
        permissions,
      });
      onSuccess();
      onOpenChange(false);
    } catch {
      // Error is handled in the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (!admin) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Administrator Permissions</DialogTitle>
          <DialogDescription>
            Update permissions for {admin.full_name}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Store Management</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allow_store_view"
                      checked={permissions.allow_store_view}
                      onCheckedChange={(checked) =>
                        handlePermissionChange(
                          "allow_store_view",
                          checked as boolean
                        )
                      }
                    />
                    <Label htmlFor="allow_store_view" className="text-sm">
                      View Stores
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allow_store_submit"
                      checked={permissions.allow_store_submit}
                      onCheckedChange={(checked) =>
                        handlePermissionChange(
                          "allow_store_submit",
                          checked as boolean
                        )
                      }
                    />
                    <Label htmlFor="allow_store_submit" className="text-sm">
                      Submit Stores
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Product Management
                </Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allow_product_view"
                      checked={permissions.allow_product_view}
                      onCheckedChange={(checked) =>
                        handlePermissionChange(
                          "allow_product_view",
                          checked as boolean
                        )
                      }
                    />
                    <Label htmlFor="allow_product_view" className="text-sm">
                      View Products
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allow_product_submit"
                      checked={permissions.allow_product_submit}
                      onCheckedChange={(checked) =>
                        handlePermissionChange(
                          "allow_product_submit",
                          checked as boolean
                        )
                      }
                    />
                    <Label htmlFor="allow_product_submit" className="text-sm">
                      Submit Products
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Order Management</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allow_orders_view"
                      checked={permissions.allow_orders_view}
                      onCheckedChange={(checked) =>
                        handlePermissionChange(
                          "allow_orders_view",
                          checked as boolean
                        )
                      }
                    />
                    <Label htmlFor="allow_orders_view" className="text-sm">
                      View Orders
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allow_orders_submit"
                      checked={permissions.allow_orders_submit}
                      onCheckedChange={(checked) =>
                        handlePermissionChange(
                          "allow_orders_submit",
                          checked as boolean
                        )
                      }
                    />
                    <Label htmlFor="allow_orders_submit" className="text-sm">
                      Submit Orders
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Account Management
                </Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allow_accounts_view"
                      checked={permissions.allow_accounts_view}
                      onCheckedChange={(checked) =>
                        handlePermissionChange(
                          "allow_accounts_view",
                          checked as boolean
                        )
                      }
                    />
                    <Label htmlFor="allow_accounts_view" className="text-sm">
                      View Accounts
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allow_accounts_submit"
                      checked={permissions.allow_accounts_submit}
                      onCheckedChange={(checked) =>
                        handlePermissionChange(
                          "allow_accounts_submit",
                          checked as boolean
                        )
                      }
                    />
                    <Label htmlFor="allow_accounts_submit" className="text-sm">
                      Submit Accounts
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Permissions"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
