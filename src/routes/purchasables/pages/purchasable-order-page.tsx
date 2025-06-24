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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
} from "lucide-react";
import { usePurchasables } from "../hooks/usePurchasables";
import { createPurchaseOrder } from "../domain/purchasable-post";
import type { CreateOrderPurchaseParams, Purchasable } from "../domain/models";
import type { Supplier } from "@/store/features/suppliers/supplierTypes";
import { useSelector, useDispatch } from "react-redux";
import { selectSuppliers } from "@/store/features/suppliers/supplierSelectors";
import { fetchSuppliers } from "@/store/features/suppliers/supplierThunks";
import type { AppDispatch } from "@/store/store";
import { TabNavigation } from "@/components/ui/tab-navigation";

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
    fetchPurchasableOrders,
    fetchPurchasables,
  } = usePurchasables();
  const suppliers = useSelector(selectSuppliers);
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState(activeTab);

  // Form states for create order
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );
  const [orderItems, setOrderItems] = useState<
    {
      product_id: number;
      unit_of_issue: number;
      unit_cost: number;
      product_name?: string;
    }[]
  >([]);
  const [supplierSearch, setSupplierSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");

  // Dialog states
  const [supplierDialogOpen, setSupplierDialogOpen] = useState(false);
  const [productDialogOpen, setProductDialogOpen] = useState<{
    [key: number]: boolean;
  }>({});

  // Order list states
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchPurchasableOrders();
    fetchPurchasables();
    dispatch(fetchSuppliers());

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
        setOrderItems([]);
        setSupplierSearch("");
        setProductSearch("");
        // Refresh orders list
        fetchPurchasableOrders();
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
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
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Supplier *
              </Label>
              <Dialog
                open={supplierDialogOpen}
                onOpenChange={setSupplierDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between h-12"
                  >
                    {selectedSupplier
                      ? selectedSupplier.full_name
                      : "Select supplier..."}
                    <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Select Supplier</DialogTitle>
                    <DialogDescription>
                      Choose a supplier for this order
                    </DialogDescription>
                  </DialogHeader>
                  <Command className="bg-gray-50 rounded-lg">
                    <div className="flex items-center border-b px-3">
                      <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                      <CommandInput
                        placeholder="Search suppliers..."
                        value={supplierSearch}
                        onValueChange={setSupplierSearch}
                      />
                    </div>
                    <CommandList className="max-h-80 overflow-y-auto">
                      <CommandEmpty>No supplier found.</CommandEmpty>
                      <CommandGroup>
                        {suppliers
                          .filter((s) =>
                            s.full_name
                              .toLowerCase()
                              .includes(supplierSearch.toLowerCase())
                          )
                          .map((supplier) => (
                            <CommandItem
                              key={supplier.id}
                              value={supplier.id}
                              onSelect={() => {
                                setSelectedSupplier(supplier);
                                setSupplierDialogOpen(false);
                              }}
                            >
                              <div className="flex justify-between w-full">
                                <span>{supplier.full_name}</span>
                                <span className="text-gray-500 text-sm">
                                  {supplier.email}
                                </span>
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
                                className="w-full justify-between h-10"
                              >
                                {item.product_name ||
                                  getProductName(item.product_id) ||
                                  "Select product..."}
                                <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg">
                              <DialogHeader>
                                <DialogTitle>Select Product</DialogTitle>
                                <DialogDescription>
                                  Choose a product for this order item
                                </DialogDescription>
                              </DialogHeader>
                              <Command className="bg-gray-50 rounded-lg">
                                <div className="flex items-center border-b px-3">
                                  <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                  <CommandInput
                                    placeholder="Search products..."
                                    value={productSearch}
                                    onValueChange={setProductSearch}
                                  />
                                </div>
                                <CommandList className="max-h-80 overflow-y-auto">
                                  <CommandEmpty>No product found.</CommandEmpty>
                                  <CommandGroup>
                                    {purchasables
                                      .filter((p) =>
                                        p.name
                                          .toLowerCase()
                                          .includes(productSearch.toLowerCase())
                                      )
                                      .map((product) => (
                                        <CommandItem
                                          key={product.id}
                                          value={product.id.toString()}
                                          onSelect={() =>
                                            selectProduct(index, product)
                                          }
                                        >
                                          <div className="flex justify-between w-full">
                                            <span>{product.name}</span>
                                            <span className="text-gray-500 text-sm">
                                              {product.unit_type}
                                            </span>
                                          </div>
                                        </CommandItem>
                                      ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </DialogContent>
                          </Dialog>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">
                            Quantity *
                          </Label>
                          <Input
                            type="number"
                            placeholder="Enter quantity"
                            value={item.unit_of_issue}
                            onChange={(e) =>
                              updateOrderItem(
                                index,
                                "unit_of_issue",
                                parseInt(e.target.value) || 0
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
    </div>
  );
};

export default PurchasableOrderPage;
