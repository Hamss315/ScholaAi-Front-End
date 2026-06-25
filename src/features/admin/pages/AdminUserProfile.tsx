import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Card } from "../../../components/ui/card";
import { ShieldCheck, AlertTriangle, Edit, CreditCard, LogOut, Loader2, AlertCircle, UserX, UserCheck, ArrowLeft } from "lucide-react";
import { getUser, verifyTeacher, unverifyTeacher } from "../../../services/api/admin";
import { cn } from "../../../utils/utils";
import AdminHeader from "../components/AdminHeader";

export default function AdminUserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const data = await getUser(userId);
        setUser(data);
      } catch {
        setError("Failed to fetch user details.");
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const handleVerify = async () => {
    if (!userId) return;
    setActionLoading(true);
    try {
      await verifyTeacher(userId);
      setUser((prev: any) => ({ ...prev, role: "Teacher", isVerified: true }));
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnverify = async () => {
    if (!userId) return;
    setActionLoading(true);
    try {
      await unverifyTeacher(userId);
      setUser((prev: any) => ({ ...prev, isVerified: false }));
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin mr-2" />
          Loading user profile…
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

  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/panel")}
          className="mb-4 text-gray-600 hover:text-gray-900 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        <Card className="p-6 bg-white border border-gray-200 shadow-sm">
          <div className="flex items-start gap-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-purple-600 text-white text-2xl font-bold">
                {initials || user.userName?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-800 mb-1">{user.firstName} {user.lastName}</h2>
              <p className="text-gray-600 text-sm mb-3">@{user.userName}</p>
              <div className="flex gap-3 flex-wrap">
                <Badge className={cn("font-medium", user.role === "Teacher" ? "bg-purple-100 text-purple-800" : user.role === "Student" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800")}> {user.role} </Badge>
                {user.isSuspended && <Badge className="bg-red-100 text-red-800 font-medium">Suspended</Badge>}
                {user.isVerified && <Badge className="bg-green-100 text-green-800 font-medium"><ShieldCheck className="inline w-3 h-3 mr-1" />Verified</Badge>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Personal Info */}
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-700">Personal Information</h3>
              <dl className="grid grid-cols-2 gap-2">
                <dt className="font-medium text-gray-600">Email</dt>
                <dd>{user.email}</dd>
                <dt className="font-medium text-gray-600">Phone</dt>
                <dd>{user.phoneNumber ?? "-"}</dd>
                <dt className="font-medium text-gray-600">Gender</dt>
                <dd>{user.gender}</dd>
                {user.role === "Student" && (
                  <>
                    <dt className="font-medium text-gray-600">Grade</dt>
                    <dd>{user.grade ?? "-"}</dd>
                  </>
                )}
                {user.role === "Teacher" && (
                  <>
                    <dt className="font-medium text-gray-600">College</dt>
                    <dd>{user.college ?? "-"}</dd>
                    <dt className="font-medium text-gray-600">Certificate</dt>
                    <dd>{user.certificate ?? "-"}
                    </dd>
                    <dt className="font-medium text-gray-600">Teaching Exp.</dt>
                    <dd>{user.teachingExperience ?? "-"}</dd>
                    <dt className="font-medium text-gray-600">Subject</dt>
                    <dd>{user.subject ?? "-"}</dd>
                  </>
                )}
              </dl>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Button variant="outline" onClick={() => navigate(`/admin/users/${user.id}/payments`)} className="w-full justify-start">
                <CreditCard className="w-4 h-4 mr-2" />
                View Payments
              </Button>
              <Button variant="outline" onClick={() => navigate(`/admin/users/${user.id}/edit`)} className="w-full justify-start">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(`/admin/users/${user.id}/suspend`)}
                className={cn(
                  "w-full justify-start",
                  user.isSuspended ? "text-green-600 border-green-200 hover:bg-green-50" : "text-orange-600 border-orange-200 hover:bg-orange-50"
                )}
              >
                {user.isSuspended ? (
                  <>
                    <UserCheck className="w-4 h-4 mr-2" />
                    Unsuspend User
                  </>
                ) : (
                  <>
                    <UserX className="w-4 h-4 mr-2" />
                    Suspend User
                  </>
                )}
              </Button>
              {user.role === "Teacher" && (
                user.isVerified ? (
                  <Button variant="outline" onClick={handleUnverify} className="w-full justify-start" disabled={actionLoading}>
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Unverify Teacher
                  </Button>
                ) : (
                  <Button variant="outline" onClick={handleVerify} className="w-full justify-start" disabled={actionLoading}>
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    Verify Teacher
                  </Button>
                )
              )}
              <Button variant="destructive" onClick={() => navigate(`/admin/users/${user.id}/delete`)} className="w-full justify-start">
                <LogOut className="w-4 h-4 mr-2" />
                Delete User
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
