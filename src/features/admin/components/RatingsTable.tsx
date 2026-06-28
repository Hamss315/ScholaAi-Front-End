import { Star, Loader2, AlertCircle } from "lucide-react";
import { Card } from "../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { useState, useEffect } from "react";
import { getRatings, type AdminRating } from "../../../services/api/admin";

export default function RatingsTable() {
  const [ratings, setRatings] = useState<AdminRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getRatings();
        setRatings(res.data);
      } catch {
        setError("Failed to load ratings.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const renderStars = (value: number) =>
    Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < value ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
      />
    ));

  return (
    <Card className="p-6 bg-white border border-gray-200 shadow-sm">
      <h2 className="text-2xl font-bold mb-6" style={{ color: "#1E3A8A" }}>
        Ratings & Reviews
      </h2>

      {loading && (
        <div className="flex items-center justify-center py-12 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          Loading ratings…
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
                <TableHead className="font-bold">Teacher</TableHead>
                <TableHead className="font-bold">Student</TableHead>
                <TableHead className="font-bold">Rating</TableHead>
                <TableHead className="font-bold">Comment</TableHead>
                <TableHead className="font-bold">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ratings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-400 py-8">
                    No ratings found.
                  </TableCell>
                </TableRow>
              ) : (
                ratings.map((r) => (
                  <TableRow key={r.ratingId} className="hover:bg-gray-50/80">
                    <TableCell className="font-semibold text-gray-800">{r.teacherName}</TableCell>
                    <TableCell className="text-gray-600">{r.studentName ?? "—"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {renderStars(r.ratingValue)}
                        <span className="ml-1 text-sm font-semibold text-gray-700">
                          {r.ratingValue}/5
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 max-w-xs truncate">
                      {r.comment ?? <span className="text-gray-300 italic">No comment</span>}
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {new Date(r.createdAt).toLocaleString()}
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
