import type { Dispatch, SetStateAction } from "react";

import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Switch } from "../../../components/ui/switch";
import { Separator } from "../../../components/ui/separator";
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
  Lock,
  Mail,
  Calendar,
  FileText,
  Settings,
  Clock,
  Phone,
  User,
} from "lucide-react";

import type {
  ProfileData,
  NotificationsSettings,
  PaymentItem,
  SessionStats,
} from "../types/profile";

interface StudentProfileTabsProps {
  profileData: ProfileData;
  setProfileData: Dispatch<SetStateAction<ProfileData>>;

  isEditingProfile: boolean;
  setIsEditingProfile: Dispatch<SetStateAction<boolean>>;

  isChangingPassword: boolean;
  setIsChangingPassword: Dispatch<SetStateAction<boolean>>;

  notifications: NotificationsSettings;
  setNotifications: Dispatch<SetStateAction<NotificationsSettings>>;

  language: string;
  setLanguage: Dispatch<SetStateAction<string>>;

  paymentHistory: PaymentItem[];
  sessionStats: SessionStats;

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
  notifications,
  setNotifications,
  paymentHistory,
  sessionStats,
  onSaveProfile,
  onChangePassword,
}: StudentProfileTabsProps) {
  return (
    <div className="md:col-span-2">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
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
                <Button
                  onClick={() => setIsEditingProfile(true)}
                  style={{ backgroundColor: "#3B82F6" }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={onSaveProfile}
                    style={{ backgroundColor: "#22C55E" }}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditingProfile(false)}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {/* First Name */}
              <div>
                <Label htmlFor="firstname">First Name</Label>
                <div className="flex items-center gap-2 mt-1">
                  <User className="w-4 h-4 text-gray-400" />
                  <Input
                    id="firstname"
                    value={profileData.firstName}
                    onChange={(e) =>
                      setProfileData((p) => ({
                        ...p,
                        firstName: e.target.value,
                      }))
                    }
                    disabled={!isEditingProfile}
                  />
                </div>
              </div>

              {/* Last Name */}
              <div>
                <Label htmlFor="lastname">Last Name</Label>
                <div className="flex items-center gap-2 mt-1">
                  <User className="w-4 h-4 text-gray-400" />
                  <Input
                    id="lastname"
                    value={profileData.lastName}
                    onChange={(e) =>
                      setProfileData((p) => ({
                        ...p,
                        lastName: e.target.value,
                      }))
                    }
                    disabled={!isEditingProfile}
                  />
                </div>
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
                    onChange={(e) =>
                      setProfileData((p) => ({ ...p, email: e.target.value }))
                    }
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
                    onChange={(e) =>
                      setProfileData((p) => ({ ...p, phone: e.target.value }))
                    }
                    disabled={!isEditingProfile}
                  />
                </div>
              </div>

              {/* Grade */}
              <div>
                <Label htmlFor="grade">Grade Level</Label>
                <Input
                  id="grade"
                  value={profileData.grade}
                  onChange={(e) =>
                    setProfileData((p) => ({ ...p, grade: e.target.value }))
                  }
                  disabled={!isEditingProfile}
                  className="mt-1"
                />
              </div>

              {/* Bio */}
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) =>
                    setProfileData((p) => ({ ...p, bio: e.target.value }))
                  }
                  disabled={!isEditingProfile}
                  className="mt-1"
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl" style={{ color: "#1E3A8A" }}>
                    Security
                  </h3>
                  <p className="text-sm text-gray-600">
                    Manage your password and security settings
                  </p>
                </div>
                {!isChangingPassword && (
                  <Button
                    onClick={() => setIsChangingPassword(true)}
                    style={{ backgroundColor: "#3B82F6" }}
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                )}
              </div>

              {isChangingPassword && (
                <div className="space-y-4 mb-2 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      className="mt-1"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={onChangePassword}
                      style={{ backgroundColor: "#22C55E" }}
                    >
                      Update Password
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsChangingPassword(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </Card>

            <Card className="p-6">
              <div className="mb-6">
                <h3 className="text-2xl mb-2" style={{ color: "#1E3A8A" }}>
                  Notifications
                </h3>
                <p className="text-sm text-gray-600">
                  Choose what updates you'd like to receive
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p>Email Notifications</p>
                      <p className="text-sm text-gray-600">
                        Receive email updates about your account
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) =>
                      setNotifications((n) => ({
                        ...n,
                        emailNotifications: checked,
                      }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p>Session Reminders</p>
                      <p className="text-sm text-gray-600">
                        Get reminded before your sessions start
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.sessionReminders}
                    onCheckedChange={(checked) =>
                      setNotifications((n) => ({
                        ...n,
                        sessionReminders: checked,
                      }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p>Weekly Reports</p>
                      <p className="text-sm text-gray-600">
                        Get weekly learning progress reports
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.weeklyReports}
                    onCheckedChange={(checked) =>
                      setNotifications((n) => ({
                        ...n,
                        weeklyReports: checked,
                      }))
                    }
                  />
                </div>
              </div>
            </Card>
          </div>
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
