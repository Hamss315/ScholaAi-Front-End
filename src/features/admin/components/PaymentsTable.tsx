import { useState, useEffect, useCallback } from "react";
import { Search, Download, ChevronLeft, ChevronRight, Loader2, AlertCircle, CreditCard, User, Calendar, Tag, ShieldCheck } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../../components/ui/dialog";
import { getPayments, getPayment, exportPayments, type AdminPayment } from "../../../services/api/admin";

const PAGE_SIZE = 10;

export default function PaymentsTable() {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  // Search filter
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Detailed Modal State
  const [selectedTxId, setSelectedTxId] = useState<number | null>(null);
  const [details, setDetails] = useState<AdminPayment | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Reset page when search term changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const loadPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPayments({
        search: debouncedSearch || undefined,
        page,
        pageSize: PAGE_SIZE,
      });
      setPayments(res.data);
      setTotalCount(res.totalCount);
      setTotalPages(res.totalPages);
    } catch {
      setError("Failed to load payments history.");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  // Fetch individual payment details for modal
  useEffect(() => {
    if (selectedTxId === null) {
      setDetails(null);
      return;
    }

    (async () => {
      setDetailsLoading(true);
      setDetailsError(null);
      try {
        const data = await getPayment(selectedTxId);
        setDetails(data);
      } catch {
        setDetailsError("Failed to fetch transaction details.");
      } finally {
        setDetailsLoading(false);
      }
    })();
  }, [selectedTxId]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await exportPayments();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payments_report_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert("Failed to export payments. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <Card className="p-6 bg-white border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: "#1E3A8A" }}>
              Payment Management
            </h2>
            {!loading && (
              <p className="text-sm text-gray-500 mt-0.5">
                {totalCount} transaction{totalCount !== 1 && "s"} recorded
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-full sm:w-64 bg-white border border-gray-300 rounded-md"
              />
            </div>
            
            {/* Export CSV button */}
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center justify-center font-medium border-gray-300 hover:bg-gray-50"
            >
              {exporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Exporting…
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </>
              )}
            </Button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 py-8 justify-center">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin mr-2" />
            Loading payments…
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">Tx ID</TableHead>
                  <TableHead className="font-bold">From (Student)</TableHead>
                  <TableHead className="font-bold">To (Teacher)</TableHead>
                  <TableHead className="font-bold">Gross Amount</TableHead>
                  <TableHead className="font-bold">Platform Fee</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold">Date</TableHead>
                  <TableHead className="font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-gray-400 py-8">
                      No payments found.
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((payment) => (
                    <TableRow key={payment.transactionId} className="hover:bg-gray-50/80">
                      <TableCell className="font-mono text-xs text-gray-400">
                        #{payment.transactionId}
                      </TableCell>
                      <TableCell className="font-semibold text-gray-800">
                        {payment.fromUserName}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {payment.toUserName}
                      </TableCell>
                      <TableCell className="font-bold text-green-600">
                        ${payment.amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-gray-500">
                        ${payment.platformFee.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge className="border-none px-2.5 py-0.5 bg-green-100 text-green-700 hover:bg-green-100 font-semibold text-xs rounded-full">
                          Completed
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-500 text-sm">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedTxId(payment.transactionId)}
                          className="hover:bg-blue-50 font-medium"
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <span className="text-sm text-gray-500 font-medium">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Payment Details Dialog */}
      <Dialog open={selectedTxId !== null} onOpenChange={(open) => !open && setSelectedTxId(null)}>
        <DialogContent className="max-w-md bg-white rounded-xl shadow-lg border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2" style={{ color: "#1E3A8A" }}>
              <CreditCard className="w-6 h-6 text-green-600" />
              Transaction Receipt
            </DialogTitle>
            <DialogDescription>
              Details for Transaction ID #{selectedTxId}
            </DialogDescription>
          </DialogHeader>

          {detailsLoading && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span>Fetching transaction receipt…</span>
            </div>
          )}

          {detailsError && (
            <div className="flex items-center gap-2 text-red-600 py-8 justify-center font-medium">
              <AlertCircle className="w-5 h-5" />
              {detailsError}
            </div>
          )}

          {!detailsLoading && details && (
            <div className="space-y-5 mt-4">
              {/* Transaction Status badge */}
              <div className="flex items-center justify-between p-3 bg-green-50/50 rounded-xl border border-green-100">
                <span className="text-sm font-semibold text-green-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  Status
                </span>
                <Badge className="bg-green-600 text-white font-bold px-3 py-1 hover:bg-green-600 border-none rounded-full">
                  SUCCEEDED
                </Badge>
              </div>

              {/* Sender & Recipient */}
              <div className="space-y-3 p-4 bg-gray-50 rounded-xl border">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-gray-500 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-gray-400" /> Student (Sender)
                  </span>
                  <span className="font-bold text-gray-800">
                    {details.fromUserName}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm pt-2.5 border-t border-gray-200/60">
                  <span className="font-semibold text-gray-500 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-gray-400" /> Teacher (Recipient)
                  </span>
                  <span className="font-bold text-gray-800">
                    {details.toUserName}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm pt-2.5 border-t border-gray-200/60">
                  <span className="font-semibold text-gray-500 flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-gray-400" /> Connected Session
                  </span>
                  <span className="font-mono font-bold text-blue-600">
                    #{details.sessionId}
                  </span>
                </div>
              </div>

              {/* Breakdown */}
              <div className="space-y-3.5 bg-gray-50/50 p-4 rounded-xl border">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Payment Breakdown
                </h4>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 font-medium">Gross Amount</span>
                  <span className="font-semibold text-gray-900">${details.amount.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-red-600">
                  <span>ScholaAi Platform Fee</span>
                  <span>-${details.platformFee.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between text-base font-extrabold text-gray-800 pt-3 border-t border-dashed border-gray-300">
                  <span>Net Teacher Payout</span>
                  <span className="text-green-600">${(details.amount - details.platformFee).toFixed(2)}</span>
                </div>
              </div>

              {/* Timestamp */}
              <div className="flex items-center justify-between text-xs text-gray-400 font-semibold px-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Date & Time
                </span>
                <span>{new Date(details.createdAt).toLocaleString()}</span>
              </div>

              {/* Close Action */}
              <div className="pt-2">
                <Button className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-semibold" onClick={() => setSelectedTxId(null)}>
                  Close Receipt
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
