import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { getUser, suspendUser, unsuspendUser } from "../../../services/api/admin";
import AdminHeader from "../components/AdminHeader";

export default function AdminSuspendUser() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(7);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const data = await getUser(userId);
        setUser(data);
      } catch {
        setError("Failed to load user.");
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setSubmitting(true);
    try {
      if (user?.isSuspended) {
        await unsuspendUser(userId);
      } else {
        await suspendUser(userId, Number(duration), reason.trim() || undefined);
      }
      navigate(`/admin/users/${userId}`);
    } catch {
      setError("Failed to update suspension.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin mr-2" />
          Loading user…
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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6 bg-white border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold mb-4" style={{ color: "#1E3A8A" }}>
            {user.isSuspended ? "Unsuspend" : "Suspend"} User
          </h2>
          <p className="text-gray-700 mb-6">
            {user.isSuspended ? "Remove suspension for" : "Suspend"} <strong>{user.firstName} {user.lastName}</strong> (ID: {user.id})
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!user.isSuspended && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
                  <input
                    type="number"
                    min={1}
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full border rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason (optional)</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Violation of community guidelines"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full border rounded-md p-2"
                  />
                </div>
              </>
            )}
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={submitting} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-medium">
                {submitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" />{user.isSuspended ? "Unsuspending…" : "Suspending…"}</>
                ) : (
                  user.isSuspended ? "Unsuspend" : "Suspend"
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={submitting}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
