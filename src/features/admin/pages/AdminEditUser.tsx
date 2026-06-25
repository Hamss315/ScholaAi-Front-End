import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Loader2, AlertCircle } from "lucide-react";
import { getUser, editUser } from "../../../services/api/admin";
import AdminHeader from "../components/AdminHeader";

export default function AdminEditUser() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const data = await getUser(userId);
        setForm({
          firstName: data.firstName ?? "",
          lastName: data.lastName ?? "",
          userName: data.userName ?? "",
          phoneNumber: data.phoneNumber ?? "",
          description: data.description ?? "",
          // teacher specific fields can be edited here if needed
        });
      } catch {
        setError("Failed to load user.");
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const set = (key: string, value: string) =>
    setForm((prev: any) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      await editUser(userId, {
        firstName: form.firstName,
        lastName: form.lastName,
        userName: form.userName,
        phoneNumber: form.phoneNumber,
        description: form.description,
      });
      navigate(`/admin/users/${userId}`);
    } catch {
      setError("Failed to save user.");
    } finally {
      setSaving(false);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6 bg-white border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold mb-4" style={{ color: "#1E3A8A" }}>
            Edit User
          </h2>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <Input value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <Input value={form.lastName} onChange={(e) => set("lastName", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <Input value={form.userName} onChange={(e) => set("userName", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <Input value={form.phoneNumber} onChange={(e) => set("phoneNumber", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} />
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={saving} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-medium">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Saving…</> : "Save Changes"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/admin/panel")} disabled={saving}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
