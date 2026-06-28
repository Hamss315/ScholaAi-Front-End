import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Loader2, AlertCircle, Download, ArrowLeft } from "lucide-react";
import { getPayments, exportPayments, getUser, type AdminPayment, type AdminUserDetail } from "../../../services/api/admin";
import AdminHeader from "../components/AdminHeader";

export default function AdminUserPayments() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [user, setUser] = useState<AdminUserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const u = await getUser(userId);
        setUser(u);
        const res = await getPayments({ search: undefined, page: undefined, pageSize: undefined });
        // Filter payments by the user's userName (exact match)
        const filtered = res.data.filter(
          (p) => p.fromUserName === u.userName || p.toUserName === u.userName
        );
        setPayments(filtered);
      } catch {
        setError("Failed to load payments.");
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await exportPayments();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "admin_payments.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Export failed.");
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin mr-2" />
          Loading payments…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <div className="flex items-center justify-center py-20 text-red-600">
          <AlertCircle className="w-6 h-6 mr-2" />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(`/admin/users/${userId}`)}
          className="mb-4 text-gray-600 hover:text-gray-900 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </Button>

        <Card className="p-6 bg-white border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold" style={{ color: "#1E3A8A" }}>
              Payments for {user ? `${user.firstName} ${user.lastName} (@${user.userName})` : "User"}
            </h2>
            <Button onClick={handleExport} disabled={exporting} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-medium">
              {exporting ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Exporting…</> : <><Download className="w-4 h-4 mr-2" />Export CSV</>}
            </Button>
          </div>

          {payments.length === 0 ? (
            <p className="text-gray-600">No payments found for this user.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold">ID</TableHead>
                    <TableHead className="font-bold">From</TableHead>
                    <TableHead className="font-bold">To</TableHead>
                    <TableHead className="font-bold">Amount</TableHead>
                    <TableHead className="font-bold">Fee</TableHead>
                    <TableHead className="font-bold">Date</TableHead>
                    <TableHead className="font-bold">Session</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((p) => (
                    <TableRow key={p.transactionId} className="hover:bg-gray-50/80">
                      <TableCell>{p.transactionId}</TableCell>
                      <TableCell>{p.fromUserName}</TableCell>
                      <TableCell>{p.toUserName}</TableCell>
                      <TableCell>${p.amount.toFixed(2)}</TableCell>
                      <TableCell>${p.platformFee.toFixed(2)}</TableCell>
                      <TableCell>{new Date(p.createdAt).toLocaleString()}</TableCell>
                      <TableCell>{p.sessionId}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
