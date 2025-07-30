import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import DeleteDialog from "@/components/dialogs/DeleteDialog";
import {
  ArrowLeft,
  Save,
  RefreshCw,
  Upload,
  Eye,
  Trash2,
  Calendar,
  User,
  Building2,
  Package,
  Receipt,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import {
  updatePurchasableOrder,
  deletePurchaseOrder,
} from "../domain/purchasable-post";
import { getPurchasableOrderInfo } from "../domain/purchasable-get";
import type { PurchasableOrder, UpdatePurchaseParams } from "../domain/models";
import { uploadImages } from "@/store/features/uploads/uploadThunks";
import { useAppDispatch } from "@/store/hooks";

// Currency formatter for KES
const formatCurrency = (value: number): string => {
  return value.toLocaleString("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Status configuration
const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    bgColor: "bg-yellow-50",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle,
    color: "bg-green-100 text-green-800 border-green-200",
    bgColor: "bg-green-50",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "bg-red-100 text-red-800 border-red-200",
    bgColor: "bg-red-50",
  },
};

export default function PurchasableOrderDetailPage() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const dispatch = useAppDispatch();

  // State for order data
  const [order, setOrder] = useState<PurchasableOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [status, setStatus] = useState<"pending" | "completed" | "cancelled">(
    "pending"
  );
  const [notes, setNotes] = useState("");
  const [receiptImage, setReceiptImage] = useState<File | null>(null);
  const [receiptImageUrl, setReceiptImageUrl] = useState<string>("");
  const [previewReceiptImage, setPreviewReceiptImage] = useState<string>("");

  // Dialog states
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedImageTitle, setSelectedImageTitle] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!orderId) return;

      try {
        setLoading(true);
        setError(null);

        const orderData: PurchasableOrder = await getPurchasableOrderInfo(
          parseInt(orderId)
        );

        // Convert PurchasableOrderInfo to PurchasableOrder format
        const order: PurchasableOrder = {
          id: orderData.id,
          created_at: orderData.created_at,
          status: orderData.status,
          notes: orderData.notes,
          receipt_image_url: orderData.receipt_image_url,
          supplier: orderData.supplier,
          user: orderData.user,
          items: orderData.items,
        };

        setOrder(order);
        setStatus(orderData.status as "pending" | "completed" | "cancelled");
        setNotes(orderData.notes || "");
        setReceiptImageUrl(orderData.receipt_image_url || "");
        setPreviewReceiptImage(orderData.receipt_image_url || "");
      } catch (err) {
        console.error("Error fetching order data:", err);
        setError("Failed to load order details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId]);

  const handleReceiptImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const selectedFile = files[0];

    // Validate file type
    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (5MB limit)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setReceiptImage(selectedFile);
    setPreviewReceiptImage(URL.createObjectURL(selectedFile));
  };

  const handleRemoveReceiptImage = () => {
    setReceiptImage(null);
    setReceiptImageUrl("");
    setPreviewReceiptImage("");
  };

  const handleSave = async () => {
    if (!order) return;

    setSaving(true);
    setError(null);

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
          setError("Failed to upload receipt image");
          setSaving(false);
          return;
        }
      }

      const updateData: UpdatePurchaseParams = {
        id: order.id,
        status,
        notes: notes || undefined,
        receipt_image_url: uploadedReceiptUrl || undefined,
      };

      const error = await updatePurchasableOrder(updateData);
      if (error) {
        setError(error);
      } else {
        toast.success("Order updated successfully!");
        // Update local state
        setOrder((prev) =>
          prev
            ? {
                ...prev,
                status,
                notes,
                receipt_image_url: uploadedReceiptUrl || "",
              }
            : null
        );
        setReceiptImageUrl(uploadedReceiptUrl || "");
      }
    } catch (err) {
      console.error("Error updating order:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate("/purchasables/orders");
  };

  const handleDeleteOrder = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDeleteOrder = async () => {
    if (!order) return;

    setIsDeleting(true);
    try {
      const error = await deletePurchaseOrder(order.id.toString());
      if (error) {
        toast.error(error);
      } else {
        toast.success("Order deleted successfully");
        navigate("/purchasables/orders");
      }
    } catch {
      toast.error("Failed to delete order");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin text-[#F10027]" />
          <p className="text-gray-600 font-medium">Loading order details...</p>
          <p className="text-sm text-gray-500">
            Please wait while we fetch the information
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Order Not Found
          </h3>
          <p className="text-gray-500 mb-6">
            The order you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={handleBack} variant="outline" className="w-full">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Purchasable Orders
          </Button>
        </div>
      </div>
    );
  }

  const totalCost = order.items.reduce((sum, item) => sum + item.unit_cost, 0);

  const currentStatus = statusConfig[status];
  const StatusIcon = currentStatus.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F10027] rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Order #{order.id}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={currentStatus.color}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {currentStatus.label}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      •{" "}
                      {new Date(order.created_at).toLocaleDateString("en-KE", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleDeleteOrder}
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Order
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="px-6 bg-[#F10027] hover:bg-[#F10027]/90 text-white font-medium"
              >
                {saving ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {error && (
          <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Eye className="h-4 w-4 text-blue-600" />
                  </div>
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Created Date
                        </p>
                        <p className="text-gray-900 font-medium">
                          {new Date(order.created_at).toLocaleDateString(
                            "en-KE",
                            {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <User className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Created By
                        </p>
                        <p className="text-gray-900 font-medium">
                          {order.user.full_name}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Supplier
                        </p>
                        <p className="text-gray-900 font-medium">
                          {order.supplier.full_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.supplier.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Receipt className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Total Cost
                        </p>
                        <p className="text-xl font-bold text-[#F10027]">
                          {formatCurrency(totalCost)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Package className="h-4 w-4 text-green-600" />
                  </div>
                  Order Items ({order.items.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {item.product.name}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Unit: {item.product.unit_type}</span>
                            <span>
                              Quantity: {item.unit_of_issue.toLocaleString()}
                            </span>
                            <span>
                              Unit Cost: {formatCurrency(item.unit_cost)}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-[#F10027]">
                            {formatCurrency(item.unit_cost)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.unit_of_issue} {item.product.unit_type}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Separator className="my-4" />

                  <div className="flex justify-between items-center py-2">
                    <span className="text-lg font-semibold text-gray-900">
                      Total Cost
                    </span>
                    <span className="text-2xl font-bold text-[#F10027]">
                      {formatCurrency(totalCost)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Edit Form */}
          <div className="space-y-6">
            {/* Status */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Order Status</CardTitle>
                <CardDescription>Update the order status</CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={status}
                  onValueChange={(
                    value: "pending" | "completed" | "cancelled"
                  ) => setStatus(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        Pending
                      </div>
                    </SelectItem>
                    <SelectItem value="completed">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Completed
                      </div>
                    </SelectItem>
                    <SelectItem value="cancelled">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        Cancelled
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Order Notes</CardTitle>
                <CardDescription>Add or update order notes</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter order notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full resize-none"
                />
              </CardContent>
            </Card>

            {/* Receipt Image */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Receipt Image</CardTitle>
                <CardDescription>
                  Upload or update receipt image
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {previewReceiptImage ? (
                    <div className="space-y-3">
                      <div className="relative">
                        <img
                          src={previewReceiptImage}
                          alt="Receipt"
                          className="w-full h-40 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => {
                            setSelectedImage(previewReceiptImage);
                            setSelectedImageTitle(
                              `Receipt for Order #${order.id}`
                            );
                            setImageDialogOpen(true);
                          }}
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveReceiptImage}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove Receipt
                      </Button>
                    </div>
                  ) : (
                    <label className="w-full h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200 group">
                      <div className="flex flex-col items-center justify-center text-gray-500 group-hover:text-gray-700">
                        <Upload className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium mb-1">
                          Upload Receipt
                        </span>
                        <span className="text-xs text-center">
                          Click to upload or drag and drop
                          <br />
                          <span className="text-gray-400">
                            Max 5MB • JPG, PNG, GIF
                          </span>
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

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

      {/* Delete Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Order"
        description={
          <div>
            <p>Are you sure you want to delete this order?</p>
            {order && (
              <div className="mt-2 p-3 bg-gray-50 rounded-md">
                <p className="font-medium text-gray-900">Order #{order.id}</p>
                <p className="text-sm text-gray-600">
                  Supplier: {order.supplier.full_name}
                </p>
                <p className="text-sm text-gray-600">
                  Created: {new Date(order.created_at).toLocaleDateString()}
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
}
