import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { getRecentTransactions } from "../service/TransactionService";
import { Transaction } from "../types/Transaction";
import { useEffect, useState } from "react";
import StatusBadge from "./StatusBadge";
import { transactionStatusColors } from "../constants/StatusColors";
import { DataTableStyle, TableHeaderStyle } from "../constants/TableStyles";

const RecentTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[] | undefined>(
    undefined
  );

  useEffect(() => {
    getRecentTransactions().then((data) => setTransactions(data));
  }, []);

  const statusTemplate = (rowData: Transaction) => {
    const status = rowData.status;
    const colorClass =
      transactionStatusColors[status] || "bg-gray-500 text-white";
    return <StatusBadge text={status} className={colorClass} />;
  };

  return (
    <>
      <div className="card h-full w-full">
        <h3 className="text-base font-medium">Recent Transactions</h3>

        <div className="mt-2">
          <DataTable value={transactions} tableStyle={DataTableStyle}>
            <Column field="name" header="Name" headerStyle={TableHeaderStyle} />
            <Column field="date" header="Date" headerStyle={TableHeaderStyle} />
            <Column
              field="amount"
              header="Amount"
              headerStyle={TableHeaderStyle}
            />
            <Column
              field="status"
              header="Status"
              body={statusTemplate}
              headerStyle={TableHeaderStyle}
            />
          </DataTable>
        </div>
      </div>
    </>
  );
};

export default RecentTransactions;
