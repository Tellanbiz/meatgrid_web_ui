import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
  TableHeaderStyle,
  DataTableStyle,
} from "../../../constants/TableStyles";

const ScheduledDeliveriesList = () => {
  const [deliveries] = useState([]);

  return (
    <div>
      <DataTable
        value={deliveries}
        paginator
        rows={10}
        dataKey="id"
        emptyMessage="No scheduled deliveries found"
        style={DataTableStyle}
        tableStyle={DataTableStyle}
      >
        <Column
          field="orderId"
          header="Order ID"
          sortable
          headerStyle={TableHeaderStyle}
        />
        <Column
          field="customerName"
          header="Customer"
          sortable
          headerStyle={TableHeaderStyle}
        />
        <Column
          field="deliveryDate"
          header="Delivery Date"
          sortable
          headerStyle={TableHeaderStyle}
        />
        <Column
          field="timeSlot"
          header="Time Slot"
          sortable
          headerStyle={TableHeaderStyle}
        />
        <Column
          field="status"
          header="Status"
          sortable
          headerStyle={TableHeaderStyle}
        />
      </DataTable>
    </div>
  );
};

export default ScheduledDeliveriesList;
