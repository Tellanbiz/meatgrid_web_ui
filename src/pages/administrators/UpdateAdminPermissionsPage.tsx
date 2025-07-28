import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AdminPermissions } from "../../store/features/accounts/accountTypes";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  selectAdminAccounts,
  selectIsUpdatingAdministratorPermissions,
  selectAccountError,
  selectAccountSuccessMessage,
} from "../../store/features/accounts/accountSelectors";
import {
  updateAdministratorPermissions,
  fetchAdminAccounts,
} from "../../store/features/accounts/accountThunks";
import { toast } from "sonner";
import { Loader2, Store, Package, Users, Tag, Settings } from "lucide-react";
import BackButton from "@/components/buttons/BackButton";
import { cn } from "../../shared/helpers/utils";
import { clearAccountMessages } from "../../store/features/accounts/accountSlice";
import LoadingPage from "@/components/navigation/LoadingPage";

const PERMISSION_GROUPS = [
  {
    key: "store",
    label: "Store Management",
    icon: Store,
    permissions: [
      { key: "allow_store_view", label: "View Stores" },
      { key: "allow_store_submit", label: "Manage Stores" },
      { key: "allow_product_view", label: "View Products" },
      { key: "allow_product_submit", label: "Manage Products" },
      { key: "allow_category_view", label: "View Categories" },
      { key: "allow_category_submit", label: "Manage Categories" },
    ],
  },
  {
    key: "order",
    label: "Order Management",
    icon: Package,
    permissions: [
      { key: "allow_orders_view", label: "View Orders" },
      { key: "allow_orders_submit", label: "Manage Orders" },
      { key: "receice_orders_alerts", label: "Receive Orders Alerts" },
    ],
  },
  {
    key: "inventory",
    label: "Inventory Management",
    icon: Package,
    permissions: [
      { key: "allow_stock_view", label: "View Stock" },
      { key: "allow_stock_submit", label: "Manage Stock" },
      { key: "allow_warehouse_view", label: "View Warehouses" },
      { key: "allow_warehouse_submit", label: "Manage Warehouses" },
      { key: "allow_storage_type_view", label: "View Storage Types" },
      { key: "allow_storage_type_submit", label: "Manage Storage Types" },
      { key: "allow_suppliers_view", label: "View Suppliers" },
      { key: "allow_suppliers_submit", label: "Manage Suppliers" },
      { key: "receive_stock_alerts", label: "Receive Stock Alerts" },
    ],
  },
  {
    key: "user",
    label: "User Management",
    icon: Users,
    permissions: [
      { key: "allow_accounts_view", label: "View Accounts" },
      { key: "allow_accounts_submit", label: "Manage Accounts" },
      { key: "allow_staff_view", label: "View Staff" },
      { key: "allow_staff_submit", label: "Manage Staff" },
      { key: "allow_riders_view", label: "View Riders" },
      { key: "allow_riders_submit", label: "Manage Riders" },
      { key: "allow_adminstrators_view", label: "View Administrators" },
      { key: "allow_adminstrators_submit", label: "Manage Administrators" },
    ],
  },
  {
    key: "marketing",
    label: "Marketing",
    icon: Tag,
    permissions: [
      { key: "allow_banners_view", label: "View Banners" },
      { key: "allow_banners_submit_view", label: "Manage Banners" },
      { key: "allow_promotional_tag_view", label: "View Promotional Tags" },
      { key: "allow_promotional_tag_submit", label: "Manage Promotional Tags" },
    ],
  },
  {
    key: "system",
    label: "System",
    icon: Settings,
    permissions: [
      { key: "allow_configuration_view", label: "View Configuration" },
      { key: "allow_configuration_submit", label: "Manage Configuration" },
      { key: "allow_payment_method_view", label: "View Payment Methods" },
      { key: "allow_payment_method_submit", label: "Manage Payment Methods" },
    ],
  },
];

export default function UpdateAdminPermissionsPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const adminAccounts = useAppSelector(selectAdminAccounts);
  const isUpdating = useAppSelector(selectIsUpdatingAdministratorPermissions);
  const error = useAppSelector(selectAccountError);
  const successMessage = useAppSelector(selectAccountSuccessMessage);
  const [tab, setTab] = useState("store");
  const [permissions, setPermissions] = useState<AdminPermissions | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Handle store error and success messages
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAccountMessages());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearAccountMessages());
      navigate("/administrators");
    }
  }, [successMessage, dispatch, navigate]);

  // Fetch admin accounts
  useEffect(() => {
    if (userId) {
      setIsLoading(true);
      dispatch(fetchAdminAccounts())
        .unwrap()
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [userId, dispatch]);

  // Set initial permissions when admin account is found
  useEffect(() => {
    if (userId && adminAccounts) {
      const admin = adminAccounts.find((account) => account.id === userId);
      if (admin) {
        setPermissions(admin.permissions);
      } else {
        navigate("/administrators");
      }
    }
  }, [userId, adminAccounts, navigate]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!permissions || !userId) return null;

  const handleCheck = (key: keyof AdminPermissions) => {
    setPermissions((prev) => (prev ? { ...prev, [key]: !prev[key] } : prev));
  };

  const handleSubmit = async () => {
    await dispatch(
      updateAdministratorPermissions({ user_id: userId, ...permissions })
    );
  };

  const adminName =
    adminAccounts.find((a) => a.id === userId)?.full_name || "Administrator";

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <BackButton className="mb-2" />
          <div>
            <h1 className="text-2xl font-semibold">
              Update Administrator Permissions
            </h1>
            <p className="text-muted-foreground">
              Manage permissions for {adminName}
            </p>
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={isUpdating}>
          {isUpdating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            <TabsList className="w-full flex border-b bg-gray-50/50 p-1 rounded-t-lg overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {PERMISSION_GROUPS.map((group) => (
                <TabsTrigger
                  key={group.key}
                  value={group.key}
                  className={cn(
                    "flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-all whitespace-nowrap",
                    "data-[state=active]:bg-white data-[state=active]:shadow-sm",
                    "data-[state=active]:text-primary data-[state=active]:font-medium",
                    "hover:bg-gray-100/50"
                  )}
                >
                  <group.icon className="h-4 w-4 shrink-0" />
                  <span>{group.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          {PERMISSION_GROUPS.map((group) => (
            <TabsContent
              key={group.key}
              value={group.key}
              className="p-6 focus-visible:outline-none focus-visible:ring-0"
            >
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {group.label}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage {group.label.toLowerCase()} permissions and access
                    controls
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {group.permissions.map((perm) => (
                    <label
                      key={perm.key}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border transition-colors",
                        "hover:bg-gray-50/50 cursor-pointer",
                        permissions[perm.key as keyof AdminPermissions]
                          ? "border-primary/20 bg-primary/5"
                          : "border-gray-200"
                      )}
                    >
                      <Checkbox
                        checked={
                          permissions[perm.key as keyof AdminPermissions]
                        }
                        onCheckedChange={() =>
                          handleCheck(perm.key as keyof AdminPermissions)
                        }
                        disabled={isUpdating}
                        className="h-5 w-5"
                      />
                      <span className="font-medium">{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
