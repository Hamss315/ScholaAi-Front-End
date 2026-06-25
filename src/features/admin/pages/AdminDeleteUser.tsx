import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Loader2, AlertCircle, Trash2 } from "lucide-react";
import { getUser, deleteUser } from "../../../services/api/admin";
import AdminHeader from "../components/AdminHeader";

export default function AdminDeleteUser() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (!userId) return;
    setDeleting(true);
    try {
      await deleteUser(userId);
      navigate("/admin/panel");
    } catch {
      setError("Failed to delete user.");
    } finally {
      setDeleting(false);
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
            Delete User
          </h2>
          <p className="text-gray-700 mb-6">
            Are you sure you want to permanently delete <strong>{user.firstName} {user.lastName}</strong> (ID: {user.id})?
          </p>
          <div className="flex items-center gap-3">
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Deleting…</> : <><Trash2 className="w-4 h-4 mr-2" />Delete</>}
            </Button>
            <Button variant="outline" onClick={() => navigate(-1)} disabled={deleting}>
              Cancel
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
