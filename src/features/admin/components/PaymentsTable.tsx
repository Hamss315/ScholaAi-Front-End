import { Search } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { cn } from "../../../utils/utils";

export default function PaymentsTable() {
  const payments = [
    { id: 1, user: "John Smith", amount: "$100", package: "5 hours", status: "Completed", date: "Oct 25, 2025" },
    { id: 2, user: "Emily Parker", amount: "$200", package: "10 hours", status: "Completed", date: "Oct 27, 2025" },
    { id: 3, user: "David Lee", amount: "$150", package: "7 hours", status: "Pending", date: "Oct 28, 2025" },
  ];

  return (
    <Card className="p-6 bg-white border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold" style={{ color: '#1E3A8A' }}>Payment Management</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search payments..." className="pl-9 w-64" />
          </div>
          <Button variant="outline">Export</Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">User</TableHead>
              <TableHead className="font-bold">Amount</TableHead>
              <TableHead className="font-bold">Package</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="font-bold">Date</TableHead>
              <TableHead className="font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.user}</TableCell>
                <TableCell style={{ color: '#22C55E' }} className="font-semibold">{payment.amount}</TableCell>
                <TableCell className="text-gray-600">{payment.package}</TableCell>
                <TableCell>
                  <Badge className={cn(
                    "border-none px-2.5 py-0.5 font-semibold text-xs rounded-full",
                    payment.status === "Completed" ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                  )}>
                    {payment.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-500">{payment.date}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" className="hover:bg-blue-50">View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
