import { useState, useEffect, useCallback } from "react";
import { Search, ChevronLeft, ChevronRight, Loader2, AlertCircle, Calendar, User, Clock, DollarSign, BrainCircuit, ExternalLink } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../../components/ui/dialog";
import { Progress } from "../../../components/ui/progress";
import { useNavigate } from "react-router-dom";
import { getSessions, getLiveSessions, getSession, type AdminSession, type AdminSessionDetail } from "../../../services/api/admin";
import { cn } from "../../../utils/utils";

const PAGE_SIZE = 10;

export default function SessionsTable() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<AdminSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination & Search & Filtering
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "live">("all");

  // Detailed Modal State
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [details, setDetails] = useState<AdminSessionDetail | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Load live sessions
  const loadSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (filterMode === "live") {
        const res = await getLiveSessions();
        // Live API doesn't do backend pagination/search currently, so we simulate search client-side
        const filtered = res.data.filter(s =>
          s.teacherName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          s.studentName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          s.subjectName.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
        setSessions(filtered);
        setTotalCount(filtered.length);
        setTotalPages(Math.ceil(filtered.length / PAGE_SIZE));
      } else {
        const res = await getSessions({
          search: debouncedSearch || undefined,
          page,
          pageSize: PAGE_SIZE,
        });
        setSessions(res.data);
        setTotalCount(res.totalCount);
        setTotalPages(res.totalPages);
      }
    } catch {
      setError("Failed to load sessions.");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filterMode, page]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filterMode]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  // Load session details when modal opens
  useEffect(() => {
    if (selectedSessionId === null) {
      setDetails(null);
      return;
    }

    (async () => {
      setDetailsLoading(true);
      setDetailsError(null);
      try {
        const data = await getSession(selectedSessionId);
        setDetails(data);
      } catch {
        setDetailsError("Failed to load session details.");
      } finally {
        setDetailsLoading(false);
      }
    })();
  }, [selectedSessionId]);

  const getSessionStatus = (session: AdminSession) => {
    if (session.isLive) return "Live";
    if (!session.scheduledAt) return "Ended";
    const date = new Date(session.scheduledAt);
    return date > new Date() ? "Scheduled" : "Ended";
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return "0m";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}h ${mins}m`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  return (
    <>
      <Card className="p-6 bg-white border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: "#1E3A8A" }}>
              Session Monitoring
            </h2>
            {!loading && (
              <p className="text-sm text-gray-500 mt-0.5">
                {totalCount} session{totalCount !== 1 && "s"} found
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Filter Toggle */}
            <div className="flex bg-gray-100 p-1 rounded-lg border">
              <button
                onClick={() => setFilterMode("all")}
                className={cn(
                  "px-3 py-1.5 text-xs font-semibold rounded-md transition-all",
                  filterMode === "all"
                    ? "bg-white text-gray-800 shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                )}
              >
                All Sessions
              </button>
              <button
                onClick={() => setFilterMode("live")}
                className={cn(
                  "px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1",
                  filterMode === "live"
                    ? "bg-green-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-green-600"
                )}
              >
                <span className={cn(
                  "w-1.5 h-1.5 rounded-full bg-current",
                  filterMode === "live" && "animate-pulse bg-white"
                )} />
                Live Now
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by names/subjects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-full sm:w-64 bg-white border border-gray-300 rounded-md"
              />
            </div>
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
            Loading sessions…
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">ID</TableHead>
                  <TableHead className="font-bold">Student</TableHead>
                  <TableHead className="font-bold">Teacher</TableHead>
                  <TableHead className="font-bold">Subject</TableHead>
                  <TableHead className="font-bold">Scheduled At</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold">Focus Score</TableHead>
                  <TableHead className="font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-gray-400 py-8">
                      No sessions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  sessions.map((session) => {
                    const status = getSessionStatus(session);
                    return (
                      <TableRow key={session.sessionId} className="hover:bg-gray-50/80">
                        <TableCell className="font-mono text-xs text-gray-400">
                          #{session.sessionId}
                        </TableCell>
                        <TableCell className="font-medium text-gray-800">
                          {session.studentName}
                        </TableCell>
                        <TableCell className="text-gray-700">
                          {session.teacherName}
                        </TableCell>
                        <TableCell className="font-medium text-purple-700">
                          {session.subjectName}
                        </TableCell>
                        <TableCell className="text-gray-500 text-sm">
                          {session.scheduledAt
                            ? new Date(session.scheduledAt).toLocaleString()
                            : "—"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              "border-none px-2.5 py-0.5 font-semibold text-xs rounded-full",
                              status === "Live"
                                ? "bg-green-100 text-green-700 hover:bg-green-100 animate-pulse"
                                : status === "Scheduled"
                                ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                            )}
                          >
                            {status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {session.focusScore !== null ? (
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs" style={{ color: session.focusScore >= 70 ? "#22C55E" : session.focusScore >= 40 ? "#F59E0B" : "#EF4444" }}>
                                {session.focusScore}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-300 italic text-xs">pending</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedSessionId(session.sessionId)}
                              className="hover:bg-blue-50 font-medium h-8"
                            >
                              View Details
                            </Button>
                            {session.isLive && (
                              <Button
                                size="sm"
                                onClick={() => navigate("/live-session")}
                                className="bg-green-600 hover:bg-green-700 text-white font-medium h-8"
                              >
                                Monitor
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && filterMode === "all" && totalPages > 1 && (
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

      {/* Session Details Dialog */}
      <Dialog open={selectedSessionId !== null} onOpenChange={(open) => !open && setSelectedSessionId(null)}>
        <DialogContent className="max-w-md bg-white rounded-xl shadow-lg border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2" style={{ color: "#1E3A8A" }}>
              <BrainCircuit className="w-6 h-6 text-purple-600" />
              Session Details
            </DialogTitle>
            <DialogDescription>
              Technical details and focus metrics for session #{selectedSessionId}
            </DialogDescription>
          </DialogHeader>

          {detailsLoading && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span>Fetching session details…</span>
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
              {/* Info Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    <User className="w-3.5 h-3.5" />
                    Student
                  </div>
                  <button
                    onClick={() => {
                      setSelectedSessionId(null);
                      navigate(`/admin/users/${details.studentId}`);
                    }}
                    className="font-bold text-sm text-gray-800 hover:text-blue-600 hover:underline flex items-center gap-1 text-left"
                  >
                    {details.studentName}
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </button>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    <User className="w-3.5 h-3.5" />
                    Teacher
                  </div>
                  <button
                    onClick={() => {
                      setSelectedSessionId(null);
                      navigate(`/admin/users/${details.teacherId}`);
                    }}
                    className="font-bold text-sm text-gray-800 hover:text-blue-600 hover:underline flex items-center gap-1 text-left"
                  >
                    {details.teacherName}
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </button>
                </div>
              </div>

              {/* Detailed Metrics */}
              <div className="space-y-3.5 bg-gray-50/50 p-4 rounded-xl border">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-gray-500 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-gray-400" /> Date
                  </span>
                  <span className="font-medium text-gray-800">
                    {details.scheduledAt ? new Date(details.scheduledAt).toLocaleDateString() : "—"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-gray-500 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-gray-400" /> Duration
                  </span>
                  <span className="font-medium text-gray-800">
                    {formatDuration(details.recordedSessionSeconds)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-gray-500 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-gray-400" /> Platform Revenue
                  </span>
                  <span className="font-bold text-green-600">
                    {details.transactionAmount !== null ? `$${details.transactionAmount.toFixed(2)}` : "—"}
                  </span>
                </div>

                {/* Focus Score progress meter */}
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      Focus Score
                    </span>
                    <span className={cn(
                      "text-sm font-extrabold",
                      details.focusScore === null ? "text-gray-400" :
                      details.focusScore >= 70 ? "text-green-600" :
                      details.focusScore >= 40 ? "text-amber-500" : "text-red-500"
                    )}>
                      {details.focusScore !== null ? `${details.focusScore}%` : "Pending"}
                    </span>
                  </div>
                  {details.focusScore !== null ? (
                    <div className="relative pt-1">
                      <Progress
                        value={details.focusScore}
                        className="h-2.5 rounded-full"
                        style={{
                          backgroundColor: "#E5E7EB",
                          // Standard progress bar will inherit primary class, we can set custom classes or color indicator
                        }}
                      />
                      <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                        <span>Low Focus</span>
                        <span>Excellent Focus</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400 italic">Focus analyzer hasn't processed this session yet.</div>
                  )}
                </div>
              </div>

              {/* Summary Block */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  AI Session Summary
                </h4>
                <div className="bg-purple-50/50 border border-purple-100 rounded-lg p-3 text-sm text-gray-700 leading-relaxed italic max-h-40 overflow-y-auto">
                  {details.summary || "No AI summary available for this session."}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedSessionId(null)}>
                  Close
                </Button>
                {details.isLive && (
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold"
                    onClick={() => {
                      setSelectedSessionId(null);
                      navigate("/live-session");
                    }}
                  >
                    Monitor Stream
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
