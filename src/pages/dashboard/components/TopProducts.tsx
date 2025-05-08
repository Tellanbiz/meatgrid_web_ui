"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  selectIsFetchingProductReports,
  selectProductsReport,
} from "../../../store/features/reports/reportSelectors";
import { fetchProductsReport } from "../../../store/features/reports/reportThunks";
import { ProductReport } from "../../../store/features/reports/reportTypes";
import LoadingPage from "../../../components/LoadingPage";

const TopProducts = () => {
  const dispatch = useAppDispatch();
  const productsReport = useAppSelector(selectProductsReport);
  const isLoadingProductsReport = useAppSelector(
    selectIsFetchingProductReports
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  React.useEffect(() => {
    dispatch(
      fetchProductsReport({ start_date: "2024-01-01", end_date: "2025-12-31" })
    );
  }, [dispatch]);

  const columns: ColumnDef<ProductReport>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center">
          <img
            src={row.original.images}
            alt={row.original.name}
            className="w-10 h-10 rounded-full mr-3"
          />
          <span>{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "order_count",
      header: "Order Count",
      cell: ({ row }) => <span>{row.original.order_count}</span>,
    },
    {
      accessorKey: "total_revenue",
      header: "Total Revenue",
      cell: ({ row }) => (
        <span>Ksh {row.original.total_revenue.toFixed(2)}</span>
      ),
    },
  ];

  const table = useReactTable({
    data: productsReport,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="card w-full h-80 flex flex-col">
      <h3 className="text-base font-medium sticky top-0 bg-white z-10 p-2">
        Top Products
      </h3>

      <div className="mt-2 flex-1 overflow-y-auto">
        {isLoadingProductsReport && <LoadingPage />}

        {!isLoadingProductsReport && (
          <>
            <div className="flex items-center py-4">
              <Input
                placeholder="Filter products..."
                value={globalFilter}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TopProducts;
