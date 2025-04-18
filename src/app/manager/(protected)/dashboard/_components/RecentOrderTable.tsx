import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "../_lib/format-currency";
import { getStatusColor } from "../_lib/get-status-color";

interface RecentOrdersTableProps {
  orders: any[];
}

const tableHeaders = [
  { title: "Order ID" },
  { title: "Room" },
  { title: "Items" },
  { title: "Total" },
  { title: "Status" },
  { title: "Time" },
];

export default function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-800">Recent Orders</h2>
      <div className="overflow-x-auto">
        <Table className="min-w-full border-collapse border border-gray-200">
          <TableHeader>
            <TableRow className="bg-gray-50">
              {tableHeaders.map((header, index) => (
                <TableHead
                  key={index}
                  className="px-4 py-2 border text-xs font-medium text-gray-500"
                >
                  {header.title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="border hover:bg-gray-100">
                <TableCell className="px-4 py-2 text-sm font-medium">
                  #{order.id}
                </TableCell>
                <TableCell className="px-4 py-2 text-sm">
                  {order.room}
                </TableCell>
                <TableCell className="px-4 py-2 text-sm">
                  {order.items}
                </TableCell>
                <TableCell className="px-4 py-2 text-sm font-medium">
                  {formatCurrency(order.total)}
                </TableCell>
                <TableCell className="px-4 py-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-2 text-xs text-gray-500">
                  {order.time}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
