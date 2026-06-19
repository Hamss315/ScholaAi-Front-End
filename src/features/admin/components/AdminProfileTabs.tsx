import {
  Settings,
  Save,
  X,
  Bell,
  Shield,
  Users,
  Lock,
  TrendingUp,
} from "lucide-react";

import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Switch } from "../../../components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Separator } from "../../../components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";

import type {
  AdminProfileData,
  AdminNotifications,
  PasswordData,
} from "../types/profile";

type Props = {
  profileData: AdminProfileData;
  setProfileData: React.Dispatch<React.SetStateAction<AdminProfileData>>;
  notifications: AdminNotifications;
  setNotifications: React.Dispatch<React.SetStateAction<AdminNotifications>>;
  isEditingProfile: boolean;
  setIsEditingProfile: React.Dispatch<React.SetStateAction<boolean>>;
  isChangingPassword: boolean;
  setIsChangingPassword: React.Dispatch<React.SetStateAction<boolean>>;
  passwordData: PasswordData;
  setPasswordData: React.Dispatch<React.SetStateAction<PasswordData>>;
  onSaveProfile: () => void;
  onChangePassword: () => void;
};

export default function AdminProfileTabs({
  profileData,
  setProfileData,
  notifications,
  setNotifications,
  isEditingProfile,
  setIsEditingProfile,
  isChangingPassword,
  setIsChangingPassword,
  passwordData,
  setPasswordData,
  onSaveProfile,
  onChangePassword,
}: Props) {
  return (
    <div className="md:col-span-2">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl" style={{ color: "#1E3A8A" }}>
                Personal Information
              </h3>

              {!isEditingProfile ? (
                <Button variant="outline" onClick={() => setIsEditingProfile(true)}>
                  <Settings className="w-4 h-4 mr-2 shrink-0" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsEditingProfile(false)}>
                    <X className="w-4 h-4 mr-1 shrink-0" />
                    Cancel
                  </Button>
                  <Button size="sm" className="bg-[#1E3A8A]" onClick={onSaveProfile}>
                    <Save className="w-4 h-4 mr-1 shrink-0" />
                    Save
                  </Button>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <Input
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  disabled={!isEditingProfile}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  disabled={!isEditingProfile}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Phone</Label>
                <Input
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  disabled={!isEditingProfile}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Gender</Label>
                <Select
                  value={profileData.gender}
                  onValueChange={(value) => setProfileData({ ...profileData, gender: value })}
                  disabled={!isEditingProfile}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                    <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Country</Label>
                <Select
                  value={profileData.country}
                  onValueChange={(value) => setProfileData({ ...profileData, country: value })}
                  disabled={!isEditingProfile}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                    <SelectItem value="France">France</SelectItem>
                    <SelectItem value="Spain">Spain</SelectItem>
                    <SelectItem value="India">India</SelectItem>
                    <SelectItem value="China">China</SelectItem>
                    <SelectItem value="Japan">Japan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>City</Label>
                <Select
                  value={profileData.city}
                  onValueChange={(value) => setProfileData({ ...profileData, city: value })}
                  disabled={!isEditingProfile}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="San Francisco">San Francisco</SelectItem>
                    <SelectItem value="New York">New York</SelectItem>
                    <SelectItem value="Los Angeles">Los Angeles</SelectItem>
                    <SelectItem value="Chicago">Chicago</SelectItem>
                    <SelectItem value="London">London</SelectItem>
                    <SelectItem value="Paris">Paris</SelectItem>
                    <SelectItem value="Berlin">Berlin</SelectItem>
                    <SelectItem value="Tokyo">Tokyo</SelectItem>
                    <SelectItem value="Sydney">Sydney</SelectItem>
                    <SelectItem value="Toronto">Toronto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="p-6">
            <h3 className="text-xl mb-6" style={{ color: "#1E3A8A" }}>
              Notification Preferences
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <Bell className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#3B82F6" }} />
                  <div>
                    <p style={{ color: "#1E3A8A" }}>Email Notifications</p>
                    <p className="text-sm text-gray-600">
                      Receive email updates about platform activity
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, emailNotifications: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#EF4444" }} />
                  <div>
                    <p style={{ color: "#1E3A8A" }}>System Alerts</p>
                    <p className="text-sm text-gray-600">
                      Critical system notifications and alerts
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notifications.systemAlerts}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, systemAlerts: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#8B5CF6" }} />
                  <div>
                    <p style={{ color: "#1E3A8A" }}>User Reports</p>
                    <p className="text-sm text-gray-600">
                      Notifications about user reports and issues
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notifications.userReports}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, userReports: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#FACC15" }} />
                  <div>
                    <p style={{ color: "#1E3A8A" }}>Security Alerts</p>
                    <p className="text-sm text-gray-600">Security-related notifications</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.securityAlerts}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, securityAlerts: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#22C55E" }} />
                  <div>
                    <p style={{ color: "#1E3A8A" }}>Weekly Reports</p>
                    <p className="text-sm text-gray-600">
                      Weekly platform analytics and summaries
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notifications.weeklyReports}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, weeklyReports: checked })
                  }
                />
              </div>
            </div>

          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="p-6">
            <h3 className="text-xl mb-6" style={{ color: "#1E3A8A" }}>
              Security Settings
            </h3>

            {!isChangingPassword ? (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p style={{ color: "#1E3A8A" }}>Password</p>
                      <p className="text-sm text-gray-600">Last changed 45 days ago</p>
                    </div>
                    <Button variant="outline" onClick={() => setIsChangingPassword(true)}>
                      <Lock className="w-4 h-4 mr-2 shrink-0" />
                      Change Password
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p style={{ color: "#1E3A8A" }}>Two-Factor Authentication</p>
                      <p className="text-sm text-gray-600">Add an extra layer of security</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Enabled</Badge>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p style={{ color: "#1E3A8A" }}>Login History</p>
                      <p className="text-sm text-gray-600">View recent login activity</p>
                    </div>
                    <Button variant="outline">View History</Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label>Current Password</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="mt-1"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, currentPassword: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>New Password</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="mt-1"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Confirm New Password</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="mt-1"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                    }
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" onClick={() => setIsChangingPassword(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-[#1E3A8A]" onClick={onChangePassword}>
                    Update Password
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
