import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronDownIcon,
  SearchIcon,
  XIcon,
  PlusIcon,
  Calendar,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { usePurchasables } from "../hooks/usePurchasables";
import {
  createPurchaseOrder,
  deletePurchaseOrder,
} from "../domain/purchasable-post";
import type {
  CreateOrderPurchaseParams,
  Purchasable,
  PurchasableOrder,
} from "../domain/models";
import type { Supplier } from "@/store/features/suppliers/supplierTypes";
import type { Store } from "@/store/features/stores/storeTypes";
import type { StorageType } from "@/store/features/storages/storageTypes";
import { useSelector, useDispatch } from "react-redux";
import { selectSuppliers } from "@/store/features/suppliers/supplierSelectors";
import { selectStores } from "@/store/features/stores/storeSelectors";
import { selectStorageTypes } from "@/store/features/storages/storageSelectors";
import { fetchSuppliers } from "@/store/features/suppliers/supplierThunks";
import { fetchStores } from "@/store/features/stores/storeThunks";
import { fetchStorageTypes } from "@/store/features/storages/storageThunks";
import type { AppDispatch } from "@/store/store";
import { TabNavigation } from "@/components/ui/tab-navigation";
import DeleteDialog from "@/components/dialogs/DeleteDialog";
import ExportButton from "@/components/buttons/ExportButton";
import ExportService from "@/service/ExportService";

interface PurchasableOrderPageProps {
  activeTab?: string;
}

const PurchasableOrderPage: React.FC<PurchasableOrderPageProps> = ({
  activeTab = "orders",
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    purchasableOrders,
    purchasables,
    ordersLoading,
    fetchPurchasableOrders,
    fetchPurchasables,
    refreshOrders,
  } = usePurchasables();
  const suppliers = useSelector(selectSuppliers);
  const stores = useSelector(selectStores);
  const storageTypes = useSelector(selectStorageTypes);
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState(activeTab);

  // Form states for create order
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedStorageType, setSelectedStorageType] = useState<StorageType | null>(null);
  const [orderItems, setOrderItems] = useState<
    {
      product_id: number;
      unit_of_issue: number;
      unit_cost: number;
      product_name?: string;
    }[]
  >([]);
  const [supplierSearch, setSupplierSearch] = useState("");
  const [storeSearch, setStoreSearch] = useState("");
  const [storageTypeSearch, setStorageTypeSearch] = useState("");
  const [productSearch, setProductSearch] = useState<{
    [key: number]: string;
  }>({});

  // Dialog states
  const [supplierDialogOpen, setSupplierDialogOpen] = useState(false);
  const [storeDialogOpen, setStoreDialogOpen] = useState(false);
  const [storageTypeDialogOpen, setStorageTypeDialogOpen] = useState(false);
  const [productDialogOpen, setProductDialogOpen] = useState<{
    [key: number]: boolean;
  }>({});

  // Order list states
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Delete states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<PurchasableOrder | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchPurchasableOrders();
    fetchPurchasables();
    dispatch(fetchSuppliers());
    dispatch(fetchStores());
    dispatch(fetchStorageTypes());

    // Set default dates (30 days ago to today)
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    setEndDate(today.toISOString().split("T")[0]);
    setStartDate(thirtyDaysAgo.toISOString().split("T")[0]);
  }, [fetchPurchasableOrders, fetchPurchasables, dispatch]);

  const handleCreateOrder = async () => {
    if (!selectedSupplier) {
      toast.error("Please select a supplier");
      return;
    }

    if (!selectedStore) {
      toast.error("Please select a store");
      return;
    }

    if (!selectedStorageType) {
      toast.error("Please select a storage type");
      return;
    }

    if (orderItems.length === 0) {
      toast.error("Please add at least one item");
      return;
    }

    // Validate all items have required fields
    const invalidItems = orderItems.filter(
      (item) =>
        item.product_id === 0 ||
        item.unit_of_issue === 0 ||
        item.unit_cost === 0
    );

    if (invalidItems.length > 0) {
      toast.error("Please fill in all fields for all items");
      return;
    }

    setLoading(true);
    try {
      const orderData: CreateOrderPurchaseParams = {
        supplier_id: selectedSupplier.id,
        storage_type_id: selectedStorageType.id,
        store_id: selectedStore.id,
        items: orderItems.map((item) => ({
          product_id: item.product_id,
          unit_of_issue: item.unit_of_issue,
          unit_cost: item.unit_cost,
        })),
      };

      const error = await createPurchaseOrder(orderData);
      if (error) {
        toast.error(error);
      } else {
        toast.success("Order created successfully");
        // Reset form
        setSelectedSupplier(null);
        setSelectedStore(null);
        setSelectedStorageType(null);
        setOrderItems([]);
        setSupplierSearch("");
        setStoreSearch("");
        setStorageTypeSearch("");
        setProductSearch({});
        // Refresh orders list
        refreshOrders();
        // Switch to orders tab
        setCurrentTab("orders");
      }
    } catch {
      toast.error("Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  const addOrderItem = () => {
    setOrderItems([
      ...orderItems,
      { product_id: 0, unit_of_issue: 0, unit_cost: 0 },
    ]);
  };

  const removeOrderItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const updateOrderItem = (
    index: number,
    field: keyof (typeof orderItems)[0],
    value: number | string
  ) => {
    const newItems = [...orderItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setOrderItems(newItems);
  };

  const selectProduct = (index: number, product: Purchasable) => {
    const newItems = [...orderItems];
    newItems[index] = {
      ...newItems[index],
      product_id: product.id,
      product_name: product.name,
    };
    setOrderItems(newItems);
    // Close the dialog for this specific item
    setProductDialogOpen((prev) => ({ ...prev, [index]: false }));
    // Clear the search for this specific item
    setProductSearch((prev) => ({ ...prev, [index]: "" }));
  };

  const getProductName = (productId: number) => {
    const product = purchasables.find((p) => p.id === productId);
    return product ? product.name : "Unknown Product";
  };

  const handleRefreshOrders = () => {
    if (startDate && endDate) {
      const formatDateForAPI = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      };
      fetchPurchasableOrders(
        formatDateForAPI(startDate),
        formatDateForAPI(endDate)
      );
    } else {
      refreshOrders();
    }
  };

  const handleExportExcel = () => {
    const exportConfig = {
      fileName: "purchasable-orders",
      columns: [
        {
          field: "id",
          header: "Order ID",
          format: (value: unknown) => `#${value}`,
        },
        {
          field: "created_at",
          header: "Created Date",
          format: (value: unknown) =>
            new Date(value as string).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }),
        },
        {
          field: "user",
          header: "Created By",
          format: (value: unknown) =>
            (value as { full_name: string }).full_name,
        },
        {
          field: "supplier",
          header: "Supplier",
          format: (value: unknown) =>
            (value as { full_name: string }).full_name,
        },
        {
          field: "supplier",
          header: "Supplier Email",
          format: (value: unknown) => (value as { email: string }).email,
        },
        {
          field: "items",
          header: "Items Count",
          format: (value: unknown) =>
            (value as PurchasableOrder["items"]).length.toString(),
        },
        {
          field: "items",
          header: "Items Details",
          format: (value: unknown) =>
            (value as PurchasableOrder["items"])
              .map(
                (item) =>
                  `${item.product.name} - ${item.unit_of_issue} ${item.product.unit_type}`
              )
              .join("; "),
        },
        {
          field: "items",
          header: "Total Cost (KES)",
          format: (value: unknown) => {
            const items = value as PurchasableOrder["items"];
            const total = items.reduce((sum, item) => sum + item.unit_cost, 0);
            return total.toFixed(2);
          },
        },
      ],
    };

    ExportService.exportToExcel(filteredOrders, exportConfig);
    toast.success("Excel file exported successfully");
  };

  const handleExportPDF = async () => {
    const exportConfig = {
      fileName: "purchasable-orders",
      columns: [
        {
          field: "id",
          header: "Order ID",
          format: (value: unknown) => `#${value}`,
        },
        {
          field: "created_at",
          header: "Created Date",
          format: (value: unknown) =>
            new Date(value as string).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }),
        },
        {
          field: "user",
          header: "Created By",
          format: (value: unknown) =>
            (value as { full_name: string }).full_name,
        },
        {
          field: "supplier",
          header: "Supplier",
          format: (value: unknown) =>
            (value as { full_name: string }).full_name,
        },
        {
          field: "items",
          header: "Items",
          format: (value: unknown) =>
            (value as PurchasableOrder["items"]).length.toString(),
        },
        {
          field: "items",
          header: "Total Cost (KES)",
          format: (value: unknown) => {
            const items = value as PurchasableOrder["items"];
            const total = items.reduce((sum, item) => sum + item.unit_cost, 0);
            return total.toFixed(2);
          },
        },
      ],
    };

    try {
      await ExportService.exportToPDF(filteredOrders, exportConfig);
      toast.success("PDF file exported successfully");
    } catch {
      toast.error("Failed to export PDF");
    }
  };

  const handleDeleteOrder = (order: PurchasableOrder) => {
    setOrderToDelete(order);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteOrder = async () => {
    if (!orderToDelete) return;

    setIsDeleting(true);
    try {
      const error = await deletePurchaseOrder(orderToDelete.id.toString());
      if (error) {
        toast.error(error);
      } else {
        toast.success("Order deleted successfully");
        refreshOrders();
      }
    } catch {
      toast.error("Failed to delete order");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setOrderToDelete(null);
    }
  };

  // Filter orders based on search
  const filteredOrders = purchasableOrders.filter(
    (order) =>
      order.supplier.full_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      order.user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toString().includes(searchQuery)
  );

  // Helper function to normalize search terms
  const normalizeSearchTerm = (term: string): string => {
    return term.toLowerCase().trim().replace(/\s+/g, ' ');
  };

  // Helper function to check if text matches search term
  const matchesSearch = (text: string, searchTerm: string): boolean => {
    if (!searchTerm.trim()) return true;
    const normalizedText = normalizeSearchTerm(text);
    const normalizedSearch = normalizeSearchTerm(searchTerm);
    return normalizedText.startsWith(normalizedSearch);
  };

  const tabs = [
    { id: "orders", label: "Purchasable Orders" },
    { id: "create", label: "New Purchasable Order" },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Tabs */}
      <TabNavigation
        tabs={tabs}
        currentTab={currentTab}
        onTabChange={setCurrentTab}
      />

      {/* Tab Content */}
      {currentTab === "orders" && (
        <div className="space-y-6  px-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search orders, suppliers, users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-40"
              />
              <span className="text-gray-400">to</span>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-40"
              />
              <Button
                size="sm"
                onClick={handleRefreshOrders}
                disabled={!startDate || !endDate}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <ExportButton
                onExportExcel={handleExportExcel}
                onExportPDF={handleExportPDF}
              />
            </div>
          </div>

          {/* Orders Table */}
          <div className="border border-gray-200 rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total Cost</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordersLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex items-center justify-center space-x-2">
                        <RefreshCw className="h-4 w-4 animate-spin text-gray-400" />
                        <p className="text-gray-500">Loading orders...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <p className="text-gray-500">
                        {searchQuery
                          ? "No orders found matching your search."
                          : "No orders found for the selected date range."}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => {
                    const totalCost = order.items.reduce(
                      (sum, item) => sum + item.unit_cost,
                      0
                    );
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          #{order.id}
                        </TableCell>
                        <TableCell>
                          {new Date(order.created_at).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </TableCell>
                        <TableCell>{order.user.full_name}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {order.supplier.full_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.supplier.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {order.items.map((item, index) => (
                              <div key={index} className="text-sm">
                                {item.product.name} - {item.unit_of_issue}{" "}
                                {item.product.unit_type}
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          KES {totalCost.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteOrder(order)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {currentTab === "create" && (
        <div className="bg-white rounded-lg shadow m-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Create New Order
            </h2>
          </div>
          <div className="p-6 space-y-8">
            {/* Supplier Selection */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <Label className="text-base font-semibold text-gray-900">
                    Supplier Selection
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Choose the supplier for this purchase order
                  </p>
                </div>
              </div>

              <Dialog
                open={supplierDialogOpen}
                onOpenChange={setSupplierDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between h-14 text-left bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-red-300 transition-colors duration-200"
                  >
                    <div className="flex items-center">
                      {selectedSupplier ? (
                        <>
                          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-red-600 font-semibold text-sm">
                              {selectedSupplier.full_name
                                .charAt(0)
                                .toUpperCase()}
                            </span>
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-gray-900">
                              {selectedSupplier.full_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {selectedSupplier.email}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                            <svg
                              className="w-5 h-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-gray-500">
                              Select supplier...
                            </div>
                            <div className="text-sm text-gray-400">
                              Choose a supplier for this order
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <ChevronDownIcon className="ml-2 h-5 w-5 shrink-0 text-gray-400" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-900">
                      Select Supplier
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Choose a supplier for this order from the list below
                    </DialogDescription>
                  </DialogHeader>
                  <div className="bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center border-b border-gray-200 px-4 py-3">
                      <SearchIcon className="mr-3 h-5 w-5 shrink-0 text-gray-400" />
                      <Input
                        placeholder="Search suppliers by name or email..."
                        value={supplierSearch}
                        onChange={(e) => setSupplierSearch(e.target.value)}
                        className="border-0 focus:ring-0 text-base shadow-none"
                      />
                    </div>
<<<<<<< HEAD
                    <CommandList className="max-h-80 overflow-y-auto">
                      <CommandEmpty className="py-8 text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <svg
                            className="w-6 h-6 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        </div>
                        <p className="text-gray-500 font-medium">
                          No supplier found
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          Try adjusting your search terms
                        </p>
                      </CommandEmpty>
                      <CommandGroup>
                        {suppliers
                          .filter((s) =>
                            matchesSearch(s.full_name, supplierSearch) ||
                            matchesSearch(s.email || '', supplierSearch) ||
                            matchesSearch(s.phone_number || '', supplierSearch) ||
                            matchesSearch(s.address || '', supplierSearch)
                          )
                          .map((supplier) => (
                            <CommandItem
                              key={supplier.id}
                              value={supplier.id}
                              onSelect={() => {
                                setSelectedSupplier(supplier);
                                setSupplierDialogOpen(false);
                              }}
                              className="px-4 py-3 hover:bg-red-50 cursor-pointer"
                            >
                              <div className="flex items-center w-full">
                                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-red-600 font-semibold text-sm">
                                    {supplier.full_name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">
                                    {supplier.full_name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {supplier.email}
                                  </div>
                                </div>
                                <div className="w-2 h-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
=======
                    <div className="max-h-80 overflow-y-auto">
                      {(() => {
                        const filteredSuppliers = suppliers.filter((s) => {
                          const searchTerm = supplierSearch.toLowerCase();
                          return (
                            s.full_name.toLowerCase().includes(searchTerm) ||
                            s.email.toLowerCase().includes(searchTerm) ||
                            s.phone_number.toLowerCase().includes(searchTerm) ||
                            s.address.toLowerCase().includes(searchTerm)
                          );
                        });

                        if (filteredSuppliers.length === 0) {
                          return (
                            <div className="py-8 text-center">
                              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg
                                  className="w-6 h-6 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                  />
                                </svg>
>>>>>>> a8f5b90817b725b3ff3c80977f8598bff94c2ac1
                              </div>
                              <p className="text-gray-500 font-medium">
                                No supplier found
                              </p>
                              <p className="text-sm text-gray-400 mt-1">
                                Try adjusting your search terms
                              </p>
                            </div>
                          );
                        }

                        return filteredSuppliers.map((supplier) => (
                          <div
                            key={supplier.id}
                            onClick={() => {
                              setSelectedSupplier(supplier);
                              setSupplierDialogOpen(false);
                              setSupplierSearch("");
                            }}
                            className="px-4 py-3 hover:bg-red-50 cursor-pointer"
                          >
                            <div className="flex items-center w-full">
                              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-red-600 font-semibold text-sm">
                                  {supplier.full_name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">
                                  {supplier.full_name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {supplier.email}
                                </div>
                              </div>
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Store Selection */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div>
                  <Label className="text-base font-semibold text-gray-900">
                    Store Selection
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Choose the store for this purchase order
                  </p>
                </div>
              </div>

              <Dialog
                open={storeDialogOpen}
                onOpenChange={setStoreDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between h-14 text-left bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300 transition-colors duration-200"
                  >
                    <div className="flex items-center">
                      {selectedStore ? (
                        <>
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-semibold text-sm">
                              {selectedStore.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-gray-900">
                              {selectedStore.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {selectedStore.address}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                            <svg
                              className="w-5 h-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-gray-500">
                              Select store...
                            </div>
                            <div className="text-sm text-gray-400">
                              Choose a store for this order
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <ChevronDownIcon className="ml-2 h-5 w-5 shrink-0 text-gray-400" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-900">
                      Select Store
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Choose a store for this order from the list below
                    </DialogDescription>
                  </DialogHeader>
                  <Command className="bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center border-b border-gray-200 px-4 py-3">
                      <SearchIcon className="mr-3 h-5 w-5 shrink-0 text-gray-400" />
                      <CommandInput
                        placeholder="Search stores by name or address..."
                        value={storeSearch}
                        onValueChange={setStoreSearch}
                        className="border-0 focus:ring-0 text-base"
                      />
                    </div>
                    <CommandList className="max-h-80 overflow-y-auto">
                      <CommandEmpty className="py-8 text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <svg
                            className="w-6 h-6 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        </div>
                        <p className="text-gray-500 font-medium">
                          No store found
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          Try adjusting your search terms
                        </p>
                      </CommandEmpty>
                      <CommandGroup>
                        {stores
                          .filter((s) =>
                            matchesSearch(s.name, storeSearch) ||
                            matchesSearch(s.address || '', storeSearch) ||
                            matchesSearch(s.description || '', storeSearch)
                          )
                          .map((store) => (
                            <CommandItem
                              key={store.id}
                              value={store.id}
                              onSelect={() => {
                                setSelectedStore(store);
                                setStoreDialogOpen(false);
                                setStoreSearch("");
                              }}
                              className="px-4 py-3 hover:bg-blue-50 cursor-pointer"
                            >
                              <div className="flex items-center w-full">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-blue-600 font-semibold text-sm">
                                    {store.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">
                                    {store.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {store.address}
                                  </div>
                                </div>
                                <div className="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                              </div>
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </DialogContent>
              </Dialog>
            </div>

            {/* Storage Type Selection */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <div>
                  <Label className="text-base font-semibold text-gray-900">
                    Storage Type Selection
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Choose the storage type for this purchase order
                  </p>
                </div>
              </div>

              <Dialog
                open={storageTypeDialogOpen}
                onOpenChange={setStorageTypeDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between h-14 text-left bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-green-300 transition-colors duration-200"
                  >
                    <div className="flex items-center">
                      {selectedStorageType ? (
                        <>
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-green-600 font-semibold text-sm">
                              {selectedStorageType.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-gray-900">
                              {selectedStorageType.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {selectedStorageType.description}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                            <svg
                              className="w-5 h-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-gray-500">
                              Select storage type...
                            </div>
                            <div className="text-sm text-gray-400">
                              Choose a storage type for this order
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <ChevronDownIcon className="ml-2 h-5 w-5 shrink-0 text-gray-400" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-900">
                      Select Storage Type
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Choose a storage type for this order from the list below
                    </DialogDescription>
                  </DialogHeader>
                  <Command className="bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center border-b border-gray-200 px-4 py-3">
                      <SearchIcon className="mr-3 h-5 w-5 shrink-0 text-gray-400" />
                      <CommandInput
                        placeholder="Search storage types by name or description..."
                        value={storageTypeSearch}
                        onValueChange={setStorageTypeSearch}
                        className="border-0 focus:ring-0 text-base"
                      />
                    </div>
                    <CommandList className="max-h-80 overflow-y-auto">
                      <CommandEmpty className="py-8 text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <svg
                            className="w-6 h-6 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        </div>
                        <p className="text-gray-500 font-medium">
                          No storage type found
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          Try adjusting your search terms
                        </p>
                      </CommandEmpty>
                      <CommandGroup>
                        {storageTypes
                          .filter((s) =>
                            matchesSearch(s.name, storageTypeSearch) ||
                            matchesSearch(s.description || '', storageTypeSearch)
                          )
                          .map((storageType) => (
                            <CommandItem
                              key={storageType.id}
                              value={storageType.id}
                              onSelect={() => {
                                setSelectedStorageType(storageType);
                                setStorageTypeDialogOpen(false);
                                setStorageTypeSearch("");
                              }}
                              className="px-4 py-3 hover:bg-green-50 cursor-pointer"
                            >
                              <div className="flex items-center w-full">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-green-600 font-semibold text-sm">
                                    {storageType.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">
                                    {storageType.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {storageType.description}
                                  </div>
                                </div>
                                <div className="w-2 h-2 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                              </div>
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </DialogContent>
              </Dialog>
            </div>

            {/* Order Items */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <Label className="text-sm font-medium text-gray-700">
                  Order Items *
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOrderItem}
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              {orderItems.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <PlusIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">
                    No items added yet
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Click "Add Item" to start building your order
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orderItems.map((item, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-6 bg-gray-50"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold text-gray-900">
                          Item {index + 1}
                        </h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeOrderItem(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XIcon className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">
                            Product *
                          </Label>
                          <Dialog
                            open={productDialogOpen[index] || false}
                            onOpenChange={(open) =>
                              setProductDialogOpen((prev) => ({
                                ...prev,
                                [index]: open,
                              }))
                            }
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-between h-12 text-left bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-red-300 transition-colors duration-200"
                              >
                                <div className="flex items-center">
                                  {item.product_name ||
                                  getProductName(item.product_id) ? (
                                    <>
                                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                                        <span className="text-red-600 font-semibold text-xs">
                                          {(
                                            item.product_name ||
                                            getProductName(item.product_id)
                                          )
                                            ?.charAt(0)
                                            .toUpperCase()}
                                        </span>
                                      </div>
                                      <div className="text-left">
                                        <div className="font-medium text-gray-900">
                                          {item.product_name ||
                                            getProductName(item.product_id)}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                          {purchasables.find(
                                            (p) => p.id === item.product_id
                                          )?.unit_type || "Unit type"}
                                        </div>
                                      </div>
                                    </>
                                  ) : (
                                    <div className="flex items-center">
                                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                                        <svg
                                          className="w-4 h-4 text-gray-400"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                          />
                                        </svg>
                                      </div>
                                      <div className="text-left">
                                        <div className="font-medium text-gray-500">
                                          Select product...
                                        </div>
                                        <div className="text-sm text-gray-400">
                                          Choose a product for this item
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 text-gray-400" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg">
                              <DialogHeader>
                                <DialogTitle className="text-xl font-semibold text-gray-900">
                                  Select Product
                                </DialogTitle>
                                <DialogDescription className="text-gray-600">
                                  Choose a product for this order item from the
                                  list below
                                </DialogDescription>
                              </DialogHeader>
                              <div className="bg-white rounded-lg border border-gray-200">
                                <div className="flex items-center border-b border-gray-200 px-4 py-3">
                                  <SearchIcon className="mr-3 h-5 w-5 shrink-0 text-gray-400" />
                                  <Input
                                    placeholder="Search products by name..."
                                    value={productSearch[index] || ""}
                                    onChange={(e) =>
                                      setProductSearch((prev) => ({
                                        ...prev,
                                        [index]: e.target.value,
                                      }))
                                    }
                                    className="border-0 focus:ring-0 text-base shadow-none"
                                  />
                                </div>
<<<<<<< HEAD
                                <CommandList className="max-h-80 overflow-y-auto">
                                  <CommandEmpty className="py-8 text-center">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                      <svg
                                        className="w-6 h-6 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                      </svg>
                                    </div>
                                    <p className="text-gray-500 font-medium">
                                      No product found
                                    </p>
                                    <p className="text-sm text-gray-400 mt-1">
                                      Try adjusting your search terms
                                    </p>
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {purchasables
                                      .filter((p) =>
                                        matchesSearch(p.name, productSearch[index] || "") ||
                                        matchesSearch(p.description || '', productSearch[index] || "") ||
                                        matchesSearch(p.unit_type || '', productSearch[index] || "")
                                      )
                                      .map((product) => (
                                        <CommandItem
                                          key={product.id}
                                          value={product.id.toString()}
                                          onSelect={() =>
                                            selectProduct(index, product)
                                          }
                                          className="px-4 py-3 hover:bg-red-50 cursor-pointer"
                                        >
                                          <div className="flex items-center w-full">
                                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                                              <span className="text-red-600 font-semibold text-sm">
                                                {product.name
                                                  .charAt(0)
                                                  .toUpperCase()}
                                              </span>
                                            </div>
                                            <div className="flex-1">
                                              <div className="font-medium text-gray-900">
                                                {product.name}
                                              </div>
                                              <div className="text-sm text-gray-500">
                                                {product.unit_type}
                                              </div>
                                            </div>
                                            <div className="w-2 h-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
=======
                                <div className="max-h-80 overflow-y-auto">
                                  {(() => {
                                    const filteredProducts =
                                      purchasables.filter((p) => {
                                        const searchTerm = (
                                          productSearch[index] || ""
                                        ).toLowerCase();
                                        return p.name
                                          .toLowerCase()
                                          .includes(searchTerm);
                                      });

                                    if (filteredProducts.length === 0) {
                                      return (
                                        <div className="py-8 text-center">
                                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <svg
                                              className="w-6 h-6 text-gray-400"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                              />
                                            </svg>
>>>>>>> a8f5b90817b725b3ff3c80977f8598bff94c2ac1
                                          </div>
                                          <p className="text-gray-500 font-medium">
                                            No product found
                                          </p>
                                          <p className="text-sm text-gray-400 mt-1">
                                            Try adjusting your search terms
                                          </p>
                                        </div>
                                      );
                                    }

                                    return filteredProducts.map((product) => (
                                      <div
                                        key={product.id}
                                        onClick={() =>
                                          selectProduct(index, product)
                                        }
                                        className="px-4 py-3 hover:bg-red-50 cursor-pointer"
                                      >
                                        <div className="flex items-center w-full">
                                          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                                            <span className="text-red-600 font-semibold text-sm">
                                              {product.name
                                                .charAt(0)
                                                .toUpperCase()}
                                            </span>
                                          </div>
                                          <div className="flex-1">
                                            <div className="font-medium text-gray-900">
                                              {product.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                              {product.unit_type}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ));
                                  })()}
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">
                            Quantity *
                          </Label>
                          <Input
                            type="number"
                            step="any"
                            placeholder="Enter quantity"
                            value={item.unit_of_issue}
                            onChange={(e) =>
                              updateOrderItem(
                                index,
                                "unit_of_issue",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            min="0"
                            className="h-10"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">
                            Unit Cost (KES) *
                          </Label>
                          <Input
                            type="number"
                            placeholder="Enter cost"
                            value={item.unit_cost}
                            onChange={(e) =>
                              updateOrderItem(
                                index,
                                "unit_cost",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            min="0"
                            step="0.01"
                            className="h-10"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <Button
                onClick={handleCreateOrder}
                disabled={
                  loading || !selectedSupplier || orderItems.length === 0
                }
                size="lg"
                className="px-8"
              >
                {loading ? "Creating..." : "Create Order"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Order"
        description={
          <div>
            <p>Are you sure you want to delete this order?</p>
            {orderToDelete && (
              <div className="mt-2 p-3 bg-gray-50 rounded-md">
                <p className="font-medium text-gray-900">
                  Order #{orderToDelete.id}
                </p>
                <p className="text-sm text-gray-600">
                  Supplier: {orderToDelete.supplier.full_name}
                </p>
                <p className="text-sm text-gray-600">
                  Created:{" "}
                  {new Date(orderToDelete.created_at).toLocaleDateString()}
                </p>
              </div>
            )}
            <p className="text-sm text-red-600 mt-2">
              This action cannot be undone.
            </p>
          </div>
        }
        onConfirm={confirmDeleteOrder}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default PurchasableOrderPage;
