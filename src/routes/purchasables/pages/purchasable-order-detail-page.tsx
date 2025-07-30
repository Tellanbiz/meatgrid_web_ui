import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { ArrowLeft, Save, RefreshCw, Upload, Eye, Trash2 } from "lucide-react";
import { updatePurchasableOrder } from "../domain/purchasable-post";
import { getPurchasableOrderInfo } from "../domain/purchasable-get";
import type {
  PurchasableOrder,
  UpdatePurchaseParams,
  PurchasableOrderInfo,
} from "../domain/models";
import { uploadImages } from "@/store/features/uploads/uploadThunks";
import { useAppDispatch } from "@/store/hooks";

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

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!orderId) return;

      try {
        setLoading(true);
        setError(null);

        const orderData: PurchasableOrderInfo = await getPurchasableOrderInfo(
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
    navigate("/purchasable-orders");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
          <p className="text-gray-500">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Order not found</p>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  const totalCost = order.items.reduce(
    (sum, item) => sum + item.unit_cost * item.unit_of_issue,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
              </Button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Order #{order.id}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Manage order details and status
                </p>
              </div>
            </div>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="px-6 bg-[#F10027] hover:bg-[#F10027]/90 text-white"
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {error && (
          <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Eye className="h-4 w-4 text-blue-600" />
                  </div>
                  Order Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Order ID
                    </Label>
                    <p className="text-lg font-semibold text-gray-900">
                      #{order.id}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Created Date
                    </Label>
                    <p className="text-gray-900">
                      {new Date(order.created_at).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Created By
                    </Label>
                    <p className="text-gray-900">{order.user.full_name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Supplier
                    </Label>
                    <p className="text-gray-900">{order.supplier.full_name}</p>
                    <p className="text-sm text-gray-500">
                      {order.supplier.email}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="h-4 w-4 text-green-600"
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
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {item.product.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Unit: {item.product.unit_type}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {item.unit_of_issue} x ${item.unit_cost}
                          </p>
                          <p className="text-sm text-gray-500">
                            Total: $
                            {(item.unit_of_issue * item.unit_cost).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">
                        Total Cost
                      </span>
                      <span className="text-lg font-semibold text-[#F10027]">
                        ${totalCost.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Edit Form */}
          <div className="space-y-6">
            {/* Status */}
            <Card>
              <CardHeader>
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Notes</CardTitle>
                <CardDescription>Add or update order notes</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter order notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full"
                />
              </CardContent>
            </Card>

            {/* Receipt Image */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Receipt Image</CardTitle>
                <CardDescription>
                  Upload or update receipt image
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {previewReceiptImage ? (
                    <div className="space-y-2">
                      <img
                        src={previewReceiptImage}
                        alt="Receipt"
                        className="w-full h-32 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => {
                          setSelectedImage(previewReceiptImage);
                          setSelectedImageTitle(
                            `Receipt for Order #${order.id}`
                          );
                          setImageDialogOpen(true);
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveReceiptImage}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove Receipt
                      </Button>
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
    </div>
  );
}
