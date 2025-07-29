import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  RefreshCw,
  Trash2,
  Upload,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
import StockDateRangePicker from "@/routes/manufacturing/stocks/components/StockDateRangePicker";
import { uploadImages } from "@/store/features/uploads/uploadThunks";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageThumbnail from "@/components/common/ImageThumbnail";

interface PurchasableOrderPageProps {
  activeTab?: string;
}

const PurchasableOrderPage: React.FC<PurchasableOrderPageProps> = ({
  activeTab = "orders",
}) => {
  const navigate = useNavigate();
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
  const [selectedStorageType, setSelectedStorageType] =
    useState<StorageType | null>(null);
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

  // New form states for status, notes, and receipt image
  const [orderStatus, setOrderStatus] = useState<
    "pending" | "completed" | "cancelled"
  >("pending");
  const [orderNotes, setOrderNotes] = useState("");
  const [receiptImage, setReceiptImage] = useState<File | null>(null);
  const [receiptImageUrl, setReceiptImageUrl] = useState<string>("");
  const [previewReceiptImage, setPreviewReceiptImage] = useState<string>("");

  // Dialog states
  const [supplierDialogOpen, setSupplierDialogOpen] = useState(false);
  const [storeDialogOpen, setStoreDialogOpen] = useState(false);
  const [storageTypeDialogOpen, setStorageTypeDialogOpen] = useState(false);
  const [productDialogOpen, setProductDialogOpen] = useState<{
    [key: number]: boolean;
  }>({});

  // Order list states
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedFilterSupplier, setSelectedFilterSupplier] =
    useState<string>("");
  const [selectedFilterProduct, setSelectedFilterProduct] =
    useState<string>("");
  const [selectedFilterStatus, setSelectedFilterStatus] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [productSearchTerm, setProductSearchTerm] = useState("");

  // Delete states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<PurchasableOrder | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // Image dialog states
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedImageTitle, setSelectedImageTitle] = useState<string>("");

  useEffect(() => {
    // Set default dates (30 days ago to today)
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    setEndDate(today);
    setStartDate(thirtyDaysAgo);
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      const formatDateForAPI = (date: Date) => {
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
      };
      fetchPurchasableOrders(
        formatDateForAPI(startDate),
        formatDateForAPI(endDate)
      );
    }
  }, [startDate, endDate, fetchPurchasableOrders]);

  useEffect(() => {
    fetchPurchasables();
    dispatch(fetchSuppliers());
    dispatch(fetchStores());
    dispatch(fetchStorageTypes());
  }, [fetchPurchasables, dispatch]);

  // File upload handlers
  const handleReceiptImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const selectedFile = files[0];
    setReceiptImage(selectedFile);
    setPreviewReceiptImage(URL.createObjectURL(selectedFile));
  };

  const handleRemoveReceiptImage = () => {
    setReceiptImage(null);
    setReceiptImageUrl("");
    setPreviewReceiptImage("");
  };

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
        item.product_id === 0 || item.unit_of_issue === 0 || item.unit_cost < 0
    );

    if (invalidItems.length > 0) {
      toast.error("Please fill in all fields for all items");
      return;
    }

    setLoading(true);
    try {
      // Upload receipt image if provided
      let uploadedReceiptUrl = receiptImageUrl;
      if (receiptImage) {
        try {
          const uploadedUrls = await dispatch(
            uploadImages([receiptImage])
          ).unwrap();
          uploadedReceiptUrl = uploadedUrls[0];
        } catch {
          toast.error("Failed to upload receipt image");
          setLoading(false);
          return;
        }
      }

      const orderData: CreateOrderPurchaseParams = {
        supplier_id: selectedSupplier.id,
        storage_type_id: selectedStorageType.id,
        store_id: selectedStore.id,
        status: orderStatus,
        notes: orderNotes || undefined,
        receipt_image_url: uploadedReceiptUrl || undefined,
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
        setOrderStatus("pending");
        setOrderNotes("");
        setReceiptImage(null);
        setReceiptImageUrl("");
        setPreviewReceiptImage("");
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
      const formatDateForAPI = (date: Date) => {
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
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
        {
          field: "status",
          header: "Status",
          format: (value: unknown) => (value as string) || "N/A",
        },
        {
          field: "notes",
          header: "Notes",
          format: (value: unknown) => (value as string) || "No notes",
        },
        {
          field: "receipt_image_url",
          header: "Receipt URL",
          format: (value: unknown) => (value as string) || "No receipt",
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
        {
          field: "status",
          header: "Status",
          format: (value: unknown) => (value as string) || "N/A",
        },
        {
          field: "notes",
          header: "Notes",
          format: (value: unknown) => (value as string) || "No notes",
        },
        {
          field: "receipt_image_url",
          header: "Receipt URL",
          format: (value: unknown) => (value as string) || "No receipt",
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

  // Filter orders based on search and filters
  const filteredOrders = purchasableOrders.filter((order) => {
    // Basic search filter
    const matchesSearch =
      order.supplier.full_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      order.user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toString().includes(searchQuery) ||
      order.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.notes &&
        order.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    // Supplier filter
    const matchesSupplier =
      !selectedFilterSupplier ||
      order.supplier.id.toString() === selectedFilterSupplier;

    // Product filter
    const matchesProduct =
      !selectedFilterProduct ||
      order.items.some(
        (item) => item.product.id.toString() === selectedFilterProduct
      );

    // Status filter
    const matchesStatus =
      !selectedFilterStatus || order.status === selectedFilterStatus;

    // Date filter (convert UTC to local time)
    const orderDate = new Date(order.created_at);
    // Remove time for date-only comparison in local time
    const orderLocalDate = new Date(
      orderDate.getFullYear(),
      orderDate.getMonth(),
      orderDate.getDate()
    );

    let afterStart = true;
    let beforeEnd = true;

    if (startDate) {
      const startLocal = new Date(startDate);
      const startLocalDate = new Date(
        startLocal.getFullYear(),
        startLocal.getMonth(),
        startLocal.getDate()
      );
      afterStart = orderLocalDate >= startLocalDate;
    }

    if (endDate) {
      const endLocal = new Date(endDate);
      const endLocalDate = new Date(
        endLocal.getFullYear(),
        endLocal.getMonth(),
        endLocal.getDate()
      );
      beforeEnd = orderLocalDate <= endLocalDate;
    }

    const matchesDate = afterStart && beforeEnd;

    return (
      matchesSearch &&
      matchesSupplier &&
      matchesProduct &&
      matchesStatus &&
      matchesDate
    );
  });

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    startDate,
    endDate,
    selectedFilterSupplier,
    selectedFilterProduct,
    selectedFilterStatus,
  ]);

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredOrders.slice(startIndex, endIndex);

  // Helper function to normalize search terms
  const normalizeSearchTerm = (term: string): string => {
    return term.toLowerCase().trim().replace(/\s+/g, " ");
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
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-80">
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

                <StockDateRangePicker
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(start, end) => {
                    setStartDate(start);
                    setEndDate(end);
                  }}
                />

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
                    />
                  </svg>
                  Filters
                </Button>

                <Button
                  size="sm"
                  onClick={handleRefreshOrders}
                  disabled={!startDate || !endDate}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <ExportButton
                  onExportExcel={handleExportExcel}
                  onExportPDF={handleExportPDF}
                />
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Supplier Filter */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Filter by Supplier
                    </Label>
                    <select
                      value={selectedFilterSupplier}
                      onChange={(e) =>
                        setSelectedFilterSupplier(e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">All Suppliers</option>
                      {suppliers.map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.full_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Filter by Status
                    </Label>
                    <select
                      value={selectedFilterStatus}
                      onChange={(e) => setSelectedFilterStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Product Filter with Search */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Filter by Product
                    </Label>
                    <div className="relative">
                      <Input
                        placeholder="Search products..."
                        value={productSearchTerm}
                        onChange={(e) => setProductSearchTerm(e.target.value)}
                        className="mb-2"
                      />
                      <select
                        value={selectedFilterProduct}
                        onChange={(e) =>
                          setSelectedFilterProduct(e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="">All Products</option>
                        {purchasables
                          .filter((product) =>
                            product.name
                              .toLowerCase()
                              .includes(productSearchTerm.toLowerCase())
                          )
                          .map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedFilterSupplier("");
                        setSelectedFilterProduct("");
                        setSelectedFilterStatus("");
                        setProductSearchTerm("");
                        setShowFilters(false);
                      }}
                      className="w-full"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </div>
            )}
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
                  <TableHead>Status</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total Cost</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Receipt</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordersLoading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      <div className="flex items-center justify-center space-x-2">
                        <RefreshCw className="h-4 w-4 animate-spin text-gray-400" />
                        <p className="text-gray-500">Loading orders...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      <p className="text-gray-500">
                        {searchQuery
                          ? "No orders found matching your search."
                          : "No orders found for the selected date range."}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((order) => {
                    const totalCost = order.items.reduce(
                      (sum, item) => sum + item.unit_cost,
                      0
                    );
                    return (
                      <TableRow
                        key={order.id}
                        className="cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                        onClick={() =>
                          navigate(`/purchasable-orders/${order.id}`)
                        }
                      >
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
                          <div className="flex items-center">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                order.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </span>
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
                          <div className="max-w-xs">
                            {order.notes ? (
                              <div
                                className="text-sm text-gray-600 truncate"
                                title={order.notes}
                              >
                                {order.notes.length > 50
                                  ? order.notes.substring(0, 50) + "..."
                                  : order.notes}
                              </div>
                            ) : (
                              <span className="text-sm text-gray-400">
                                No notes
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {order.receipt_image_url ? (
                            <div className="flex items-center">
                              <img
                                src={order.receipt_image_url}
                                alt="Receipt"
                                className="w-8 h-8 rounded object-cover border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => {
                                  setSelectedImage(order.receipt_image_url);
                                  setSelectedImageTitle(
                                    `Receipt for Order #${order.id}`
                                  );
                                  setImageDialogOpen(true);
                                }}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "https://via.placeholder.com/32";
                                }}
                              />
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">
                              No receipt
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div
                            className="flex items-center gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
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

          {/* Pagination Info and Controls */}
          <div className="py-4 border-t mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredOrders.length)} of{" "}
              {filteredOrders.length} orders (Page {currentPage} of {totalPages}
              )
            </div>

            {filteredOrders.length > 0 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {/* Page Numbers */}
                  {totalPages <= 7
                    ? // Show all pages if 7 or fewer
                      Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={page === currentPage}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )
                    : // Show first, last, current, and pages around current
                      Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => {
                          const isFirstPage = page === 1;
                          const isLastPage = page === totalPages;
                          const isCurrentPage = page === currentPage;
                          const isNearCurrentPage =
                            Math.abs(page - currentPage) <= 1;

                          if (
                            isFirstPage ||
                            isLastPage ||
                            isCurrentPage ||
                            isNearCurrentPage
                          ) {
                            return (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  onClick={() => setCurrentPage(page)}
                                  isActive={isCurrentPage}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          } else if (
                            (page === 2 && currentPage > 3) ||
                            (page === totalPages - 1 &&
                              currentPage < totalPages - 2)
                          ) {
                            return (
                              <PaginationItem key={page}>
                                <span className="px-4">...</span>
                              </PaginationItem>
                            );
                          }
                          return null;
                        }
                      )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
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
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center border-b border-gray-200 px-4 py-3 bg-gray-50/50">
                      <SearchIcon className="mr-3 h-5 w-5 shrink-0 text-gray-400" />
                      <Input
                        placeholder="Search suppliers by name, email, or phone..."
                        value={supplierSearch}
                        onChange={(e) => setSupplierSearch(e.target.value)}
                        className="border-0 focus:ring-0 text-base shadow-none bg-transparent"
                      />
                    </div>
                    <div className="max-h-80 overflow-y-auto py-2">
                      {suppliers
                        .filter(
                          (s) =>
                            matchesSearch(s.full_name, supplierSearch) ||
                            matchesSearch(s.email || "", supplierSearch) ||
                            matchesSearch(
                              s.phone_number || "",
                              supplierSearch
                            ) ||
                            matchesSearch(s.address || "", supplierSearch)
                        )
                        .map((supplier) => (
                          <button
                            key={supplier.id}
                            className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-red-50 border-l-4 border-transparent hover:border-red-500 transition-all duration-200 cursor-pointer text-left"
                            onClick={() => {
                              setSelectedSupplier(supplier);
                              setSupplierDialogOpen(false);
                              setSupplierSearch("");
                            }}
                          >
                            <div className="flex items-center w-full">
                              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-red-600 font-semibold text-sm">
                                  {supplier.full_name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-gray-900 text-base">
                                  {supplier.full_name}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {supplier.email}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
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

              <Dialog open={storeDialogOpen} onOpenChange={setStoreDialogOpen}>
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
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center border-b border-gray-200 px-4 py-3 bg-gray-50/50">
                      <SearchIcon className="mr-3 h-5 w-5 shrink-0 text-gray-400" />
                      <Input
                        placeholder="Search stores by name, address, or description..."
                        value={storeSearch}
                        onChange={(e) => setStoreSearch(e.target.value)}
                        className="border-0 focus:ring-0 text-base shadow-none bg-transparent"
                      />
                    </div>
                    <div className="max-h-80 overflow-y-auto py-2">
                      {stores
                        .filter(
                          (s) =>
                            matchesSearch(s.name, storeSearch) ||
                            matchesSearch(s.address || "", storeSearch) ||
                            matchesSearch(s.description || "", storeSearch)
                        )
                        .map((store) => (
                          <button
                            key={store.id}
                            className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-blue-50 border-l-4 border-transparent hover:border-blue-500 transition-all duration-200 cursor-pointer text-left"
                            onClick={() => {
                              setSelectedStore(store);
                              setStoreDialogOpen(false);
                              setStoreSearch("");
                            }}
                          >
                            <div className="flex items-center w-full">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-blue-600 font-semibold text-sm">
                                  {store.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-gray-900 text-base">
                                  {store.name}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {store.address}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                    </div>
                  </div>
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
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center border-b border-gray-200 px-4 py-3 bg-gray-50/50">
                      <SearchIcon className="mr-3 h-5 w-5 shrink-0 text-gray-400" />
                      <Input
                        placeholder="Search storage types by name or description..."
                        value={storageTypeSearch}
                        onChange={(e) => setStorageTypeSearch(e.target.value)}
                        className="border-0 focus:ring-0 text-base shadow-none bg-transparent"
                      />
                    </div>
                    <div className="max-h-80 overflow-y-auto py-2">
                      {storageTypes
                        .filter(
                          (s) =>
                            matchesSearch(s.name, storageTypeSearch) ||
                            matchesSearch(
                              s.description || "",
                              storageTypeSearch
                            )
                        )
                        .map((storageType) => (
                          <button
                            key={storageType.id}
                            className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-green-50 border-l-4 border-transparent hover:border-green-500 transition-all duration-200 cursor-pointer text-left"
                            onClick={() => {
                              setSelectedStorageType(storageType);
                              setStorageTypeDialogOpen(false);
                              setStorageTypeSearch("");
                            }}
                          >
                            <div className="flex items-center w-full">
                              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-green-600 font-semibold text-sm">
                                  {storageType.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-gray-900 text-base">
                                  {storageType.name}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {storageType.description}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                    </div>
                  </div>
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
                              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                                <div className="flex items-center border-b border-gray-200 px-4 py-3 bg-gray-50/50">
                                  <SearchIcon className="mr-3 h-5 w-5 shrink-0 text-gray-400" />
                                  <Input
                                    placeholder="Search products by name or description..."
                                    value={productSearch[index] || ""}
                                    onChange={(e) =>
                                      setProductSearch((prev) => ({
                                        ...prev,
                                        [index]: e.target.value,
                                      }))
                                    }
                                    className="border-0 focus:ring-0 text-base shadow-none bg-transparent"
                                  />
                                </div>
                                <div className="max-h-80 overflow-y-auto py-2">
                                  {purchasables
                                    .filter(
                                      (p) =>
                                        matchesSearch(
                                          p.name,
                                          productSearch[index] || ""
                                        ) ||
                                        matchesSearch(
                                          p.description || "",
                                          productSearch[index] || ""
                                        ) ||
                                        matchesSearch(
                                          p.unit_type || "",
                                          productSearch[index] || ""
                                        )
                                    )
                                    .map((product) => (
                                      <button
                                        key={product.id}
                                        className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-red-50 border-l-4 border-transparent hover:border-red-500 transition-all duration-200 cursor-pointer text-left"
                                        onClick={() =>
                                          selectProduct(index, product)
                                        }
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
                                            <div className="font-semibold text-gray-900 text-base">
                                              {product.name}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                              Unit: {product.unit_type}
                                            </div>
                                          </div>
                                        </div>
                                      </button>
                                    ))}
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

            {/* Order Status */}
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <Label className="text-base font-semibold text-gray-900">
                    Order Status
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Set the status for this purchase order
                  </p>
                </div>
              </div>
              <Select
                value={orderStatus}
                onValueChange={(value: "pending" | "completed" | "cancelled") =>
                  setOrderStatus(value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Order Notes */}
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <div>
                  <Label className="text-base font-semibold text-gray-900">
                    Order Notes
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Add any additional notes for this order
                  </p>
                </div>
              </div>
              <Textarea
                placeholder="Enter any notes or comments about this order..."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                rows={4}
                className="w-full"
              />
            </div>

            {/* Receipt Image Upload */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <Upload className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <Label className="text-base font-semibold text-gray-900">
                    Receipt Image
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Upload a receipt image for this order (optional)
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                {previewReceiptImage ? (
                  <div className="flex items-center space-x-4">
                    <ImageThumbnail
                      src={previewReceiptImage}
                      onRemove={handleRemoveReceiptImage}
                    />
                  </div>
                ) : (
                  <label className="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Upload className="w-8 h-8 mb-2" />
                      <span className="text-sm font-medium">
                        Upload Receipt
                      </span>
                      <span className="text-xs mt-1">
                        Click to upload or drag and drop
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleReceiptImageChange}
                    />
                  </label>
                )}
              </div>
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

      {/* Image Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              {selectedImageTitle}
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-4">
            <img
              src={selectedImage}
              alt="Receipt"
              className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/400x300?text=Image+Not+Found";
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PurchasableOrderPage;
