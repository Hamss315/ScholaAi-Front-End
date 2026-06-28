import type { Dispatch, SetStateAction } from "react";

import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";

import {
  Edit,
  Save,
  X,
  Mail,
  Calendar,
  Settings,
  Clock,
  Phone,
  User,
} from "lucide-react";

import type {
  ProfileData,
  PaymentItem,
  SessionStats,
} from "../types/profile";

import StudentRequestsList from "./StudentRequestsList";

// parses ASP.NET ModelState errors: {"errors":{"phone":["msg"]}}
function getFieldError(errorJson: string, field: string): string {
  try {
    const parsed = JSON.parse(errorJson);
    const errors = parsed?.errors ?? parsed;
    // ASP.NET field names are camelCase, try both cases
    return errors?.[field]?.[0] ?? errors?.[field.toLowerCase()]?.[0] ?? "";
  } catch {
    return "";
  }
}

function FieldError({ error }: { error: string }) {
  if (!error) return null;
  return <p className="text-xs text-red-500 mt-1 ml-6">{error}</p>;
}

interface StudentProfileTabsProps {
  profileData: ProfileData;
  setProfileData: Dispatch<SetStateAction<ProfileData>>;

  isEditingProfile: boolean;
  setIsEditingProfile: Dispatch<SetStateAction<boolean>>;

  isChangingPassword: boolean;
  setIsChangingPassword: Dispatch<SetStateAction<boolean>>;

  paymentHistory: PaymentItem[];
  sessionStats: SessionStats;

  passwordData: { currentPassword: string; newPassword: string; confirmPassword: string };
  setPasswordData: Dispatch<SetStateAction<{ currentPassword: string; newPassword: string; confirmPassword: string }>>;
  passwordError: string;
  passwordSuccess: string;

  profileError: string;
  profileSuccess: string;

  onSaveProfile: () => void;
  onChangePassword: () => void;
}

export default function StudentProfileTabs({
  profileData,
  setProfileData,
  isEditingProfile,
  setIsEditingProfile,
  isChangingPassword,
  setIsChangingPassword,
  paymentHistory,
  sessionStats,
  onSaveProfile,
  onChangePassword,
  passwordData,
  setPasswordData,
  passwordError,
  passwordSuccess,
  profileError,
  profileSuccess,
}: StudentProfileTabsProps) {
  return (
    <div className="md:col-span-2">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl" style={{ color: "#1E3A8A" }}>
                Profile Information
              </h3>
              {!isEditingProfile ? (
                <Button onClick={() => setIsEditingProfile(true)} style={{ backgroundColor: "#3B82F6" }}>
                  <Edit className="w-4 h-4 mr-2" /> Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={onSaveProfile} style={{ backgroundColor: "#22C55E" }}>
                    <Save className="w-4 h-4 mr-2" /> Save
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                    <X className="w-4 h-4 mr-2" /> Cancel
                  </Button>
                </div>
              )}
            </div>

            {/* ✅ top-level success/error banners */}
            {profileSuccess && (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-4">
                <span>✓</span> {profileSuccess}
              </div>
            )}
            {profileError && !profileError.startsWith("{") && (
              <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
                <span>✕</span> {profileError}
              </div>
            )}

            <div className="space-y-4">
              {/* First Name */}
              <div>
                <Label htmlFor="firstname">First Name</Label>
                <div className="flex items-center gap-2 mt-1">
                  <User className="w-4 h-4 text-gray-400" />
                  <Input
                    id="firstname"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData((p) => ({ ...p, firstName: e.target.value }))}
                    disabled={!isEditingProfile}
                    className={getFieldError(profileError, "firstName") ? "border-red-400" : ""}
                  />
                </div>
                <FieldError error={getFieldError(profileError, "firstName")} />
              </div>

              {/* Last Name */}
              <div>
                <Label htmlFor="lastname">Last Name</Label>
                <div className="flex items-center gap-2 mt-1">
                  <User className="w-4 h-4 text-gray-400" />
                  <Input
                    id="lastname"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData((p) => ({ ...p, lastName: e.target.value }))}
                    disabled={!isEditingProfile}
                    className={getFieldError(profileError, "lastName") ? "border-red-400" : ""}
                  />
                </div>
                <FieldError error={getFieldError(profileError, "lastName")} />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData((p) => ({ ...p, email: e.target.value }))}
                    disabled={!isEditingProfile}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData((p) => ({ ...p, phone: e.target.value }))}
                    disabled={!isEditingProfile}
                    className={getFieldError(profileError, "phone") ? "border-red-400" : ""}
                  />
                </div>
                <FieldError error={getFieldError(profileError, "phone")} />
              </div>

              {/* Grade */}
              <div>
                <Label htmlFor="grade">Grade Level</Label>
                <Input
                  id="grade"
                  value={profileData.grade}
                  onChange={(e) => setProfileData((p) => ({ ...p, grade: e.target.value }))}
                  disabled={!isEditingProfile}
                  className={`mt-1 ${getFieldError(profileError, "grade") ? "border-red-400" : ""}`}
                />
                <FieldError error={getFieldError(profileError, "grade")} />
              </div>

              {/* Bio */}
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData((p) => ({ ...p, bio: e.target.value }))}
                  disabled={!isEditingProfile}
                  className="mt-1"
                />
              </div>

              {/* Password Section */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h4 className="text-lg font-medium mb-4" style={{ color: "#1E3A8A" }}>
                  Security & Password
                </h4>

                {passwordSuccess && (
                  <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-4">
                    <span>✓</span> {passwordSuccess}
                  </div>
                )}
                {passwordError && (
                  <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
                    <span>✕</span> {passwordError}
                  </div>
                )}

                {!isChangingPassword ? (
                  <Button
                    variant="outline"
                    onClick={() => setIsChangingPassword(true)}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    Change Password
                  </Button>
                ) : (
                  <div className="space-y-4 max-w-md">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData((p) => ({ ...p, currentPassword: e.target.value }))
                        }
                        className="mt-1"
                        placeholder="Enter current password"
                      />
                    </div>

                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData((p) => ({ ...p, newPassword: e.target.value }))
                        }
                        className="mt-1"
                        placeholder="Enter new password"
                      />
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData((p) => ({ ...p, confirmPassword: e.target.value }))
                        }
                        className="mt-1"
                        placeholder="Confirm new password"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button onClick={onChangePassword} style={{ backgroundColor: "#3B82F6" }}>
                        Update Password
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsChangingPassword(false);
                          setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions">
          <Card className="p-6">
            <h3 className="text-2xl mb-6" style={{ color: "#1E3A8A" }}>
              Session Statistics
            </h3>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">Total Sessions</span>
                </div>
                <p className="text-3xl" style={{ color: "#1E3A8A" }}>
                  {sessionStats.totalSessions}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">Total Hours</span>
                </div>
                <p className="text-3xl" style={{ color: "#8B5CF6" }}>
                  {sessionStats.totalHours}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">Average Focus Score</span>
                </div>
                <p className="text-3xl" style={{ color: "#22C55E" }}>
                  {sessionStats.averageFocus}%
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">This Month</span>
                </div>
                <p className="text-3xl" style={{ color: "#3B82F6" }}>
                  {sessionStats.completedThisMonth}
                </p>
              </div>
            </div>

            <Button className="w-full" style={{ backgroundColor: "#8B5CF6" }}>
              View All Sessions
            </Button>

            <StudentRequestsList />
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing">
          <Card className="p-6">
            <h3 className="text-2xl mb-6" style={{ color: "#1E3A8A" }}>
              Payment History
            </h3>

            <div className="space-y-3">
              {paymentHistory.map((payment) => (
                <div
                  key={payment.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold" style={{ color: "#1E3A8A" }}>
                        {payment.plan}
                      </p>
                      <p className="text-sm text-gray-600">{payment.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg" style={{ color: "#22C55E" }}>
                        {payment.amount}
                      </p>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
