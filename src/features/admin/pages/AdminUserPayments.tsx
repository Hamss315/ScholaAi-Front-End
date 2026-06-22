import { Brain, ArrowLeft, DollarSign, CreditCard, Download, TrendingUp, CheckCircle, Clock, XCircle } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { cn } from "../../../utils/utils";
import { getUserByEmail } from "../../../utils/userDataService";
import type { UserProfile } from "../../../utils/userDataService";

export default function AdminUserPayments() {
  const { email } = useParams<{ email: string }>();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (email) {
      const user = getUserByEmail(email);
      setUserData(user);
    }
  }, [email]);

  const isStudent = userData?.role === "student";

  // Mock payment data
  const payments = [
    { id: 1, description: "5 Hour Package", amount: 100, status: "Completed", date: "Nov 20, 2025", method: "Credit Card (****1234)", invoice: "INV-2025-001" },
    { id: 2, description: "10 Hour Package", amount: 180, status: "Completed", date: "Nov 10, 2025", method: "PayPal", invoice: "INV-2025-002" },
    { id: 3, description: "Session Payment", amount: 25, status: "Pending", date: "Nov 25, 2025", method: "Credit Card (****1234)", invoice: "INV-2025-003" },
    { id: 4, description: "3 Hour Package", amount: 60, status: "Refunded", date: "Nov 5, 2025", method: "Credit Card (****1234)", invoice: "INV-2025-004" },
  ];

  // Mock earnings for teachers
  const earnings = [
    { id: 1, student: "John Smith", subject: "Mathematics", amount: 50, status: "Paid", date: "Nov 20, 2025", sessionDate: "Nov 18, 2025" },
    { id: 2, student: "Emily Parker", subject: "Physics", amount: 75, status: "Paid", date: "Nov 15, 2025", sessionDate: "Nov 13, 2025" },
    { id: 3, student: "David Lee", subject: "Chemistry", amount: 50, status: "Pending", date: "—", sessionDate: "Nov 25, 2025" },
    { id: 4, student: "Sarah Wilson", subject: "Mathematics", amount: 100, status: "Paid", date: "Nov 10, 2025", sessionDate: "Nov 8, 2025" },
  ];

  const stats = {
    total: isStudent ? 365 : 1240,
    thisMonth: isStudent ? 100 : 275,
    pending: isStudent ? 25 : 50,
    avgTransaction: isStudent ? 73 : 62,
    transactionCount: isStudent ? 5 : 20
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#1E3A8A' }}>User not found</h2>
          <Button onClick={() => navigate("/admin/panel")} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-semibold">
            Back to Admin Panel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/users/${email}`)}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Brain className="w-8 h-8" style={{ color: '#8B5CF6' }} />
                <span className="text-2xl font-bold" style={{ color: '#1E3A8A' }}>ScholaAi</span>
                <Badge className="ml-2 bg-red-100 text-red-700 hover:bg-red-100 border-none font-semibold">Admin</Badge>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* User Header */}
        <div className="mb-6 flex items-center gap-4">
          <Avatar className="w-16 h-16 shadow-sm border">
            <AvatarFallback className="bg-[#3B82F6] text-white text-lg font-semibold">
              {userData.fullName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#1E3A8A' }}>
              {userData.fullName}'s {isStudent ? "Payments" : "Earnings"}
            </h1>
            <p className="text-gray-600 font-medium">{userData.email}</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 font-medium font-medium">
                {isStudent ? "Total Spent" : "Total Earned"}
              </span>
              <DollarSign className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold mb-1 text-green-600">${stats.total}</div>
            <div className="text-xs text-gray-500 font-medium">All time</div>
          </Card>

          <Card className="p-4 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 font-medium">This Month</span>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold mb-1" style={{ color: '#3B82F6' }}>${stats.thisMonth}</div>
            <div className="text-xs text-gray-500 font-medium">November 2025</div>
          </Card>

          <Card className="p-4 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 font-medium">Pending</span>
              <Clock className="w-4 h-4 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold mb-1 text-yellow-600">${stats.pending}</div>
            <div className="text-xs text-gray-500 font-medium">Processing</div>
          </Card>

          <Card className="p-4 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 font-medium">Avg Transaction</span>
              <CreditCard className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-bold mb-1 text-purple-600">${stats.avgTransaction}</div>
            <div className="text-xs text-gray-500 font-medium">{stats.transactionCount} transactions</div>
          </Card>
        </div>

        {/* Payments/Earnings Table */}
        <Card className="p-6 bg-white border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{ color: '#1E3A8A' }}>
              {isStudent ? "Payment History" : "Earnings History"}
            </h2>
            <Button variant="outline" className="border-gray-300 font-semibold hover:bg-gray-50">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="overflow-x-auto">
            {isStudent ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold">Description</TableHead>
                    <TableHead className="font-bold">Amount</TableHead>
                    <TableHead className="font-bold">Payment Method</TableHead>
                    <TableHead className="font-bold">Date</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="font-bold">Invoice</TableHead>
                    <TableHead className="font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id} className="hover:bg-gray-50/50">
                      <TableCell className="font-medium">{payment.description}</TableCell>
                      <TableCell>
                        <span className="text-green-600 font-semibold">${payment.amount}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium">{payment.method}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-500 font-medium">{payment.date}</TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "border-none font-semibold text-xs py-0.5 px-2.5 rounded-full inline-flex items-center gap-1",
                          payment.status === "Completed" ? "bg-green-100 text-green-700 hover:bg-green-100" :
                          payment.status === "Pending" ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" :
                          "bg-red-100 text-red-700 hover:bg-red-100"
                        )}>
                          {payment.status === "Completed" && <CheckCircle className="w-3 h-3" />}
                          {payment.status === "Pending" && <Clock className="w-3 h-3" />}
                          {payment.status === "Refunded" && <XCircle className="w-3 h-3" />}
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-500 font-medium">{payment.invoice}</span>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="hover:bg-blue-50 text-xs font-semibold">
                          <Download className="w-3 h-3 mr-1" />
                          Receipt
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold">Student</TableHead>
                    <TableHead className="font-bold">Subject</TableHead>
                    <TableHead className="font-bold">Session Date</TableHead>
                    <TableHead className="font-bold">Amount</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="font-bold">Payment Date</TableHead>
                    <TableHead className="font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {earnings.map((earning) => (
                    <TableRow key={earning.id} className="hover:bg-gray-50/50">
                      <TableCell>
                        <div className="flex items-center gap-2 font-medium">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-[#3B82F6] text-white text-xs font-semibold">
                              {earning.student.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          {earning.student}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{earning.subject}</TableCell>
                      <TableCell className="text-gray-500 font-medium">{earning.sessionDate}</TableCell>
                      <TableCell>
                        <span className="text-green-600 font-semibold">${earning.amount}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "border-none font-semibold text-xs py-0.5 px-2.5 rounded-full inline-flex items-center gap-1",
                          earning.status === "Paid" ? "bg-green-100 text-green-700 hover:bg-green-100" :
                          "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                        )}>
                          {earning.status === "Paid" && <CheckCircle className="w-3 h-3" />}
                          {earning.status === "Pending" && <Clock className="w-3 h-3" />}
                          {earning.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-500 font-medium">{earning.date}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="hover:bg-blue-50 text-xs font-semibold">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </Card>

        {/* Payment Method (for students) */}
        {isStudent && (
          <Card className="p-6 mt-6 bg-white border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold mb-4" style={{ color: '#1E3A8A' }}>Saved Payment Methods</h3>
            <div className="space-y-3 font-medium">
              <div className="flex items-center justify-between p-4 border rounded-lg hover:border-blue-300 transition-colors">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-semibold text-gray-900">Visa ending in 1234</p>
                    <p className="text-sm text-gray-500">Expires 12/2026</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none font-semibold text-xs rounded-full">Primary</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg hover:border-blue-300 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center text-white text-[10px] font-bold">
                    P
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">PayPal</p>
                    <p className="text-sm text-gray-500">john@example.com</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
