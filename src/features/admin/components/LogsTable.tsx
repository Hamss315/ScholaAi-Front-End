import { Shield, Loader2, AlertCircle } from "lucide-react";
import { Card } from "../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { useState, useEffect } from "react";
import { getAdminLogs, type AdminLog } from "../../../services/api/admin";

export default function LogsTable() {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getAdminLogs();
        setLogs(res.data);
      } catch {
        setError("Failed to load admin logs.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Card className="p-6 bg-white border border-gray-200 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-gray-400" />
        <h2 className="text-2xl font-bold" style={{ color: "#1E3A8A" }}>
          Admin Activity Logs
        </h2>
        {!loading && (
          <span className="ml-auto text-sm text-gray-500 font-medium">
            {logs.length} entries
          </span>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          Loading logs…
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-600 py-8 justify-center">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">#</TableHead>
                <TableHead className="font-bold">Admin</TableHead>
                <TableHead className="font-bold">Target User</TableHead>
                <TableHead className="font-bold">Action</TableHead>
                <TableHead className="font-bold">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-400 py-8">
                    No admin logs found.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.logId} className="hover:bg-gray-50/80">
                    <TableCell className="text-gray-400 text-xs font-mono">{log.logId}</TableCell>
                    <TableCell>
                      <span className="font-semibold text-gray-800">{log.adminName}</span>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {log.targetUserName ?? <span className="text-gray-300 italic">—</span>}
                    </TableCell>
                    <TableCell className="text-gray-700 font-medium">{log.details}</TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {new Date(log.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
}
