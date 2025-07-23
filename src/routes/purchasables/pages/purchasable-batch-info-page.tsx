import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Package,
  Hash,
  Calendar,
  Factory,
  Store,
  Box,
  QrCode,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import { getProductionBatchInfo } from "../domain/purchasable-get";
import type { ProductionBatchInfo } from "../domain/production-models";
import { toast } from "sonner";

const PurchasableBatchInfoPage = () => {
  const navigate = useNavigate();
  const { batchId } = useParams<{ batchId: string }>();
  const [batchInfo, setBatchInfo] = useState<ProductionBatchInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (batchId) {
      fetchBatchInfo();
    }
  }, [batchId]);

  const fetchBatchInfo = async () => {
    if (!batchId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await getProductionBatchInfo(batchId);
      setBatchInfo(data);
    } catch {
      setError("Failed to fetch batch information");
      toast.error("Failed to fetch batch information");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchBatchInfo();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      instock: "bg-green-100 text-green-800",
      sold: "bg-blue-100 text-blue-800",
      migrated: "bg-yellow-100 text-yellow-800",
      processed: "bg-purple-100 text-purple-800",
      damaged: "bg-red-100 text-red-800",
    };

    return (
      <Badge
        variant="secondary"
        className={
          statusColors[status as keyof typeof statusColors] ||
          "bg-gray-100 text-gray-800"
        }
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Removed unused getMovementTypeBadge function

  const formatQuantity = (quantity: number, unitType: string) => {
    // Convert grams to kilograms if quantity is >= 1000 and unit type is kilograms
    if (
      (unitType === "kilograms" || unitType === "kilogram") &&
      quantity >= 1000
    ) {
      const kgQuantity = quantity / 1000;
      return `${kgQuantity.toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })} kg`;
    }
    return `${quantity.toLocaleString()} ${unitType}`;
  };

  if (loading) {
    return (
      <div className="p-8 font-lato bg-white min-h-screen">
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-400">Loading batch information...</p>
        </div>
      </div>
    );
  }

  if (error || !batchInfo) {
    return (
      <div className="p-8 font-lato bg-white min-h-screen">
        <div className="flex items-center justify-center py-8">
          <p className="text-red-500">{error || "Batch not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 font-lato bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/purchasable-production-batches")}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Batches</span>
          </Button>
          <div className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-blue-600" />
            <h1 className="text-2xl font-semibold text-gray-900">
              Batch Information
            </h1>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Batch Header Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Batch {batchInfo.batch_number}
          </CardTitle>
          <CardDescription>
            Production ID: {batchInfo.production_id}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Created</p>
                <p className="text-sm text-gray-900">
                  {formatDateTime(batchInfo.created_at)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Factory className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Manufactured
                </p>
                <p className="text-sm text-gray-900">
                  {formatDateTime(batchInfo.manufactured_at)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Box className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Products
                </p>
                <p className="text-sm text-gray-900">
                  {batchInfo.output_summary?.total_products || 0}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* QR Code and Barcode */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {batchInfo.qr_code_url && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <img
                src={batchInfo.qr_code_url}
                alt="QR Code"
                className="w-48 h-48 object-contain"
              />
            </CardContent>
          </Card>
        )}
        {batchInfo.bar_code_url && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Barcode
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <img
                src={batchInfo.bar_code_url}
                alt="Barcode"
                className="w-64 h-24 object-contain"
              />
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Materials */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-orange-600" />
              Input Materials
            </CardTitle>
            <CardDescription>
              Materials used in this production batch
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!batchInfo.input_materials ||
            batchInfo.input_materials.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No input materials recorded
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Store</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {batchInfo.input_materials?.map((material, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {material.product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {material.product.id}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          {formatQuantity(
                            material.quantity,
                            material.product.unit_type
                          )}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(material.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Store className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{material.store.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{formatDate(material.created_at)}</div>
                          <div className="text-gray-500">
                            {formatDateTime(material.created_at).split(",")[1]}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Output Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-green-600" />
              Output Products
            </CardTitle>
            <CardDescription>
              Products created from this production batch
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!batchInfo.output_products ||
            batchInfo.output_products.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No output products recorded
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Store</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {batchInfo.output_products?.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {product.product.image && (
                            <img
                              src={product.product.image}
                              alt={product.product.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <div className="font-medium">
                              {product.product.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {product.product.id}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          {formatQuantity(
                            product.quantity,
                            product.product.unit_type
                          )}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(product.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Store className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{product.store.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{formatDate(product.created_at)}</div>
                          <div className="text-gray-500">
                            {formatDateTime(product.created_at).split(",")[1]}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Output Summary */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Output Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {batchInfo.output_summary?.total_products || 0}
              </div>
              <div className="text-sm text-gray-600">Total Products</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {(
                  batchInfo.output_summary?.total_quantity || 0
                ).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Quantity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {batchInfo.output_summary?.products_list?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Unique Products</div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Products List:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {batchInfo.output_summary?.products_list?.map(
                (product, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 border rounded-lg"
                  >
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <div className="font-medium text-sm">{product.name}</div>
                      <div className="text-xs text-gray-500">
                        {product.unit_type}
                      </div>
                    </div>
                  </div>
                )
              ) || (
                <p className="text-gray-500 col-span-full text-center py-4">
                  No products list available
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchasableBatchInfoPage;
