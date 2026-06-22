import { Brain, ArrowLeft, AlertTriangle, UserCheck } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { getUserByEmail, updateUserProfile, type UserProfile } from "../../../utils/userDataService";
import UserInfoCard from "../components/UserInfoCard";
import SuspensionForm from "../components/SuspensionForm";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function AdminSuspendUser() {
  const { email } = useParams<{ email: string }>();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [suspensionDuration, setSuspensionDuration] = useState("7");
  const [reason, setReason] = useState("");
  const [notifyUser, setNotifyUser] = useState(true);

  useEffect(() => {
    if (email) {
      const user = getUserByEmail(email);
      setUserData(user);
    }
  }, [email]);

  const handleUnsuspend = () => {
    if (!userData || !email) return;

    if (userData.suspensionDuration === "permanent") {
      const confirmed1 = window.confirm("WARNING: This user is permanently suspended. Are you sure you want to unsuspend them?");
      if (!confirmed1) return;
      const confirmed2 = window.confirm("This action will restore access to a permanently suspended account. Please confirm once more.");
      if (!confirmed2) return;
    } else {
      const confirmed = window.confirm(`Are you sure you want to unsuspend ${userData.fullName}?`);
      if (!confirmed) return;
    }

    updateUserProfile(email, { status: "Active", suspensionDuration: undefined, suspensionReason: undefined });
    alert(`User ${userData.fullName} has been unsuspended.`);
    navigate("/admin/panel");
  };

  const handleSuspend = () => {
    if (!userData || !email) return;

    updateUserProfile(email, {
      status: "Suspended",
      suspensionDuration,
      suspensionReason: reason
    });

    alert(`Account for ${userData.fullName} has been suspended.`);
    navigate("/admin/panel");
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

  const isSuspended = userData.status === "Suspended";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/admin/panel")}>
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

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Warning Header */}
        <Card className={isSuspended ? "p-6 mb-6 border-green-200 bg-green-50 shadow-sm" : "p-6 mb-6 border-red-200 bg-red-50 shadow-sm"}>
          <div className="flex items-start gap-3">
            {isSuspended ? (
              <UserCheck className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <h2 className="text-xl font-bold mb-1" style={{ color: isSuspended ? '#16A34A' : '#DC2626' }}>
                {isSuspended ? "Unsuspend User Account" : "Suspend User Account"}
              </h2>
              <p className="text-gray-700 font-medium">
                {isSuspended 
                  ? "This action will lift the suspension and restore access to the platform for this user."
                  : "This action will temporarily suspend the user's account and restrict their access to the platform."}
              </p>
            </div>
          </div>
        </Card>

        {/* User Info */}
        <Card className="p-6 mb-6 bg-white border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold mb-4" style={{ color: '#1E3A8A' }}>User Information</h3>
          <UserInfoCard userData={userData} />
        </Card>

        {/* Suspension Details / Form */}
        {isSuspended ? (
          <Card className="p-6 mb-6 border-yellow-200 bg-yellow-50 shadow-sm">
            <h3 className="text-lg font-bold mb-4 text-yellow-900">Current Suspension Status</h3>
            <div className="space-y-2 text-sm text-yellow-850 font-medium">
              <div>
                <strong>Duration:</strong> {userData.suspensionDuration === "permanent" ? "Permanent" : `${userData.suspensionDuration} days`}
              </div>
              <div>
                <strong>Reason:</strong> {userData.suspensionReason || "No reason specified"}
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-6 mb-6 bg-white border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold mb-6" style={{ color: '#1E3A8A' }}>Suspension Details</h3>
            <SuspensionForm
              suspensionDuration={suspensionDuration}
              setSuspensionDuration={setSuspensionDuration}
              reason={reason}
              setReason={setReason}
              notifyUser={notifyUser}
              setNotifyUser={setNotifyUser}
            />
          </Card>
        )}

        {/* Impact Warning */}
        <Card className={isSuspended ? "p-6 mb-6 border-blue-200 bg-blue-50 shadow-sm" : "p-6 mb-6 border-yellow-200 bg-yellow-50 shadow-sm"}>
          <h4 className={isSuspended ? "font-bold mb-2 text-blue-900" : "font-bold mb-2 text-yellow-900"}>
            {isSuspended ? "Effects of Unsuspension" : "Effects of Suspension"}
          </h4>
          <ul className={isSuspended ? "space-y-2 text-sm text-blue-800 font-medium" : "space-y-2 text-sm text-yellow-800 font-medium"}>
            {isSuspended ? (
              <>
                <li>• User will be able to log in normally using their credentials</li>
                <li>• Restrictions on using platform features will be lifted</li>
                <li>• Profile will be visible again in search results</li>
                <li>• User will be able to book and schedule new sessions</li>
              </>
            ) : (
              <>
                <li>• User will be immediately logged out from all devices</li>
                <li>• Access to platform will be restricted</li>
                <li>• All scheduled sessions will be cancelled</li>
                <li>• User will receive a suspension notification email</li>
                <li>• Profile will be hidden from public search</li>
              </>
            )}
          </ul>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/panel")}
            className="flex-1 hover:bg-gray-50 border-gray-300 font-semibold"
          >
            Cancel
          </Button>
          {isSuspended ? (
            <Button
              onClick={handleUnsuspend}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold"
            >
              Unsuspend User
            </Button>
          ) : (
            <Button
              onClick={handleSuspend}
              disabled={!reason.trim()}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Confirm Suspension
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
