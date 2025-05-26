import { useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
  DataTableStyle,
  TableHeaderStyle,
} from "../../../shared/constants/TableStyles";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { fetchBatches } from "../../../store/features/batches/batchThunks";
import { ProgressBar } from "primereact/progressbar";
import { toast } from "sonner";
import { format } from "date-fns";
import { QrCode, Barcode } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Batch } from "../../../store/features/batches/batchTypes";
import { selectBatches } from "../../../store/features/batches/batchSelectors";
import { AvatarStack } from "@/components/common/avatar-stack";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CodeImageDialog from "./CodeImageDialog";

interface BatchesTableProps {
  searchString: string;
}

const BatchesTable: React.FC<BatchesTableProps> = ({ searchString }) => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.batches);
  const batches = useAppSelector(selectBatches);
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
    batchNumber: string;
  } | null>(null);

  useEffect(() => {
    dispatch(fetchBatches());
  }, [dispatch]);

  useEffect(() => {
    if (status === "failed" && error) {
      toast.error(error);
    }
  }, [status, error]);

  const batchNumberTemplate = (batch: Batch) => {
    return (
      <div className="flex flex-col items-center gap-2 py-2">
        <div
          className="rounded-lg overflow-hidden w-32 h-16 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() =>
            setSelectedImage({
              url: batch.bar_code_url,
              title: "Barcode",
              batchNumber: batch.batch_number,
            })
          }
        >
          <img
            src={batch.bar_code_url}
            alt={`Barcode for ${batch.batch_number}`}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="font-semibold text-sm">{batch.batch_number}</div>
      </div>
    );
  };

  const productTemplate = (batch: Batch) => {
    return <div className="text-medium font-bold">{batch.product}</div>;
  };

  const storageTypeTemplate = (batch: Batch) => {
    return <div className="text-sm">{batch.storage_type}</div>;
  };

  const storeTemplate = (batch: Batch) => {
    return <div className="text-sm">{batch.store}</div>;
  };

  const expiryDateTemplate = (batch: Batch) => {
    return (
      <div className="text-sm">
        {format(new Date(batch.expiry_at), "MMM d, yyyy")}
      </div>
    );
  };

  const suppliersTemplate = (batch: Batch) => {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center cursor-help">
              <AvatarStack items={batch.suppliers} limit={3} />
              <span className="ml-3 text-sm text-muted-foreground">
                {batch.suppliers.length} supplier
                {batch.suppliers.length !== 1 ? "s" : ""}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-[300px]">
            <div className="space-y-1">
              <p className="font-semibold text-sm">Suppliers</p>
              <ul className="text-sm list-disc pl-4">
                {batch.suppliers.map((supplier, index) => (
                  <li key={index}>{supplier}</li>
                ))}
              </ul>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const actionsTemplate = (batch: Batch) => {
    return (
      <div className="flex justify-center gap-2">
        <Button
          variant="ghost"
          size="default"
          className="h-10 w-10"
          onClick={() =>
            setSelectedImage({
              url: batch.qr_code_url,
              title: "QR Code",
              batchNumber: batch.batch_number,
            })
          }
        >
          <QrCode className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="default"
          className="h-10 w-10"
          onClick={() =>
            setSelectedImage({
              url: batch.bar_code_url,
              title: "Barcode",
              batchNumber: batch.batch_number,
            })
          }
        >
          <Barcode className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  const rowClassName = () => {
    return "hover:bg-gray-50";
  };

  return (
    <div className="h-full">
      {status === "loading" && (
        <ProgressBar
          mode="indeterminate"
          style={{ height: "4px" }}
          className="mb-2"
        ></ProgressBar>
      )}

      <DataTable
        value={batches}
        dataKey="id"
        style={DataTableStyle}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} batches"
        scrollable
        scrollHeight="flex"
        size="normal"
        globalFilter={searchString}
        emptyMessage="No batches found"
        rowHover
        className="p-datatable-sm"
        rowClassName={rowClassName}
      >
        <Column
          field="batch_number"
          header="Batch Number"
          body={batchNumberTemplate}
          headerStyle={{ ...TableHeaderStyle }}
        />
        <Column
          field="product"
          header="Product"
          body={productTemplate}
          headerStyle={{ ...TableHeaderStyle }}
        />
        <Column
          field="storage_type"
          header="Storage Type"
          body={storageTypeTemplate}
          headerStyle={{ ...TableHeaderStyle }}
        />
        <Column
          field="store"
          header="Store"
          body={storeTemplate}
          headerStyle={{ ...TableHeaderStyle }}
        />
        <Column
          field="expiry_at"
          header="Expiry Date"
          body={expiryDateTemplate}
          headerStyle={{ ...TableHeaderStyle }}
        />
        <Column
          field="suppliers"
          header="Suppliers"
          body={suppliersTemplate}
          headerStyle={{ ...TableHeaderStyle }}
        />
        <Column
          header="QR | Barcode"
          body={actionsTemplate}
          headerStyle={{ ...TableHeaderStyle }}
          align="center"
        />
      </DataTable>

      {selectedImage && (
        <CodeImageDialog
          isOpen={true}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage.url}
          title={selectedImage.title}
          batchNumber={selectedImage.batchNumber}
        />
      )}
    </div>
  );
};

export default React.memo(BatchesTable);
