import { Brain, LogOut, User, Settings, ShieldCheck, Loader2, KeyRound } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../components/ui/tabs";
import {
  clearAdminToken,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  type AdminProfile
} from "../../../services/api/admin";

export default function AdminHeader() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Settings Modal State
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Edit Profile Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);

  // Change Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passLoading, setPassLoading] = useState(false);
  const [passError, setPassError] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);

  // Fetch admin profile
  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      const data = await getAdminProfile();
      setProfile(data);
      setFirstName(data.firstName || "");
      setLastName(data.lastName || "");
      setPhoneNumber(""); // default to empty if not present, updateProfile requires a string
    } catch {
      // Non-fatal
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = () => {
    clearAdminToken();
    navigate("/admin/login", { replace: true });
  };

  const handleSaveProfile = async () => {
    setEditError(null);
    setEditSuccess(null);
    if (!firstName.trim() || !lastName.trim()) {
      setEditError("First name and last name are required.");
      return;
    }

    setEditLoading(true);
    try {
      await updateAdminProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: phoneNumber.trim(),
      });
      setEditSuccess("Profile updated successfully!");
      await fetchProfile();
    } catch (err: any) {
      setEditError("Failed to update profile info.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleChangePass = async () => {
    setPassError(null);
    setPassSuccess(null);
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPassError("All fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError("New passwords do not match.");
      return;
    }

    setPassLoading(true);
    try {
      await changeAdminPassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      setPassSuccess("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to change password.";
      setPassError(msg);
    } finally {
      setPassLoading(false);
    }
  };

  const getInitials = () => {
    if (!profile) return "AD";
    return `${profile.firstName?.[0] ?? ""}${profile.lastName?.[0] ?? ""}`.toUpperCase() || "AD";
  };

  return (
    <>
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/admin/panel")}>
              <Brain className="w-8 h-8 text-purple-600" />
              <span className="text-2xl font-bold" style={{ color: '#1E3A8A' }}>ScholaAi</span>
              <Badge className="ml-2 bg-red-100 text-red-700 hover:bg-red-100 border-none font-semibold">Admin</Badge>
            </div>
            
            <div className="flex items-center gap-4">
              {profileLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              ) : (
                <div 
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1.5 rounded-lg transition-colors border border-transparent hover:border-gray-200"
                  onClick={() => {
                    setIsOpen(true);
                    setEditError(null);
                    setEditSuccess(null);
                    setPassError(null);
                    setPassSuccess(null);
                  }}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-red-500 text-white font-bold text-sm">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-semibold text-gray-700 hidden sm:inline-block">
                    {profile ? `${profile.firstName} ${profile.lastName}` : "Administrator"}
                  </span>
                </div>
              )}

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout}
                className="hover:bg-red-50 rounded-lg text-gray-600 hover:text-red-600 transition-colors"
                title="Admin Logout"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Settings Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md bg-white rounded-xl shadow-lg border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2" style={{ color: "#1E3A8A" }}>
              <Settings className="w-6 h-6 text-gray-600" />
              Admin Profile Settings
            </DialogTitle>
            <DialogDescription>
              Manage your personal info and security settings.
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid grid-cols-2 bg-gray-100 p-1 rounded-lg border">
              <TabsTrigger value="profile" className="flex items-center gap-1.5 font-semibold text-xs">
                <User className="w-3.5 h-3.5" />
                Edit Profile
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-1.5 font-semibold text-xs">
                <KeyRound className="w-3.5 h-3.5" />
                Security
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-4 mt-4">
              {editError && (
                <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg p-2.5 flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-red-500 rotate-180" />
                  {editError}
                </div>
              )}
              {editSuccess && (
                <div className="text-xs text-green-700 bg-green-50 border border-green-100 rounded-lg p-2.5 flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  {editSuccess}
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                <Input value={profile?.email || ""} disabled className="mt-1 bg-gray-50 text-gray-500" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">First Name</label>
                  <Input 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)} 
                    placeholder="First Name" 
                    className="mt-1" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Last Name</label>
                  <Input 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)} 
                    placeholder="Last Name" 
                    className="mt-1" 
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number (Optional)</label>
                <Input 
                  value={phoneNumber} 
                  onChange={(e) => setPhoneNumber(e.target.value)} 
                  placeholder="e.g. +1234567890" 
                  className="mt-1" 
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveProfile} 
                  disabled={editLoading}
                  className="flex-1 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-semibold"
                >
                  {editLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                </Button>
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-4 mt-4">
              {passError && (
                <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg p-2.5 flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-red-500 rotate-180" />
                  {passError}
                </div>
              )}
              {passSuccess && (
                <div className="text-xs text-green-700 bg-green-50 border border-green-100 rounded-lg p-2.5 flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  {passSuccess}
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Current Password</label>
                <Input 
                  type="password" 
                  value={currentPassword} 
                  onChange={(e) => setCurrentPassword(e.target.value)} 
                  placeholder="Enter current password" 
                  className="mt-1" 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">New Password</label>
                <Input 
                  type="password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  placeholder="Enter new password" 
                  className="mt-1" 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Confirm New Password</label>
                <Input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  placeholder="Confirm new password" 
                  className="mt-1" 
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleChangePass} 
                  disabled={passLoading}
                  className="flex-1 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-semibold"
                >
                  {passLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Change Password"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
