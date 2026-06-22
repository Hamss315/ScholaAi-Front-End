import { Brain, AlertTriangle, ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserByEmail, deleteUserByEmail } from "../../../utils/userDataService";
import type { UserProfile } from "../../../utils/userDataService";
import { cn } from "../../../utils/utils";

export default function AdminDeleteUser() {
  const { email } = useParams<{ email: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [confirmText, setConfirmText] = useState("");

  useEffect(() => {
    if (email) {
      const userData = getUserByEmail(email);
      setUser(userData);
    }
  }, [email]);

  const handleDelete = () => {
    if (confirmText === "DELETE" && email) {
      deleteUserByEmail(email);
      alert(`User ${user?.fullName} has been permanently deleted.`);
      navigate("/admin/panel");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600 font-semibold">Loading user data...</p>
      </div>
    );
  }

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

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Warning Card */}
        <Card className="p-8 border-red-200 bg-red-50 mb-6 shadow-sm">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-12 h-12 text-red-600 flex-shrink-0" />
            <div>
              <h1 className="text-3xl font-bold mb-2 text-red-900">Delete User Account</h1>
              <p className="text-red-800">
                This action is permanent and cannot be undone. All user data, sessions, and history will be permanently deleted.
              </p>
            </div>
          </div>
        </Card>

        {/* User Information */}
        <Card className="p-6 mb-6 bg-white border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#1E3A8A' }}>User to be deleted:</h2>
          
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-[#3B82F6] text-white text-lg font-semibold">
                {user.fullName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-xl font-bold mb-1" style={{ color: '#1E3A8A' }}>{user.fullName}</div>
              <div className="text-gray-600">{user.email}</div>
              <Badge className={cn(
                "border-none mt-2 font-semibold text-xs py-0.5 px-2.5 rounded-full",
                user.role === "teacher" ? "bg-purple-100 text-purple-700 hover:bg-purple-100" : "bg-blue-100 text-blue-700 hover:bg-blue-100"
              )}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-2 border border-gray-100 font-medium">
            <div className="flex justify-between">
              <span className="text-gray-600">Joined:</span>
              <span className="text-gray-900">{user.joinedDate || "N/A"}</span>
            </div>
            {user.role === "student" && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sessions Completed:</span>
                  <span className="text-gray-900">{user.sessionsCompleted || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Wallet Balance:</span>
                  <span className="text-gray-900">${user.walletBalance || 0}</span>
                </div>
              </>
            )}
            {user.role === "teacher" && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sessions Taught:</span>
                  <span className="text-gray-900">{user.sessionsTaught || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Rating:</span>
                  <span className="text-gray-900">⭐ {user.rating || "N/A"}</span>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Confirmation Card */}
        <Card className="p-6 bg-white border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#1E3A8A' }}>Confirm Deletion</h2>
          
          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              To confirm deletion, please type <strong className="text-red-600 font-bold">DELETE</strong> in the field below:
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 font-semibold"
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 shadow-sm">
            <h3 className="font-semibold text-yellow-900 mb-2">What will be deleted:</h3>
            <ul className="list-disc list-inside text-yellow-800 space-y-1 font-medium">
              <li>User profile and personal information</li>
              <li>All session history and analytics</li>
              <li>Messages and communications</li>
              <li>Payment history and wallet balance</li>
              <li>Reviews and ratings</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 hover:bg-gray-50 border-gray-300 font-semibold"
              onClick={() => navigate("/admin/panel")}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold"
              onClick={handleDelete}
              disabled={confirmText !== "DELETE"}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete User Permanently
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
