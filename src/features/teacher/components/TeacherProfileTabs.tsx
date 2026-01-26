import { useMemo } from "react";
import {
  User,
  Mail,
  Phone,
  BookOpen,
  Clock,
  DollarSign,
  GraduationCap,
  Edit,
  Lock,
  Save,
  X,
  Upload,
  FileText,
  Globe,
  Bell,
  Inbox,
  CalendarIcon,
  Star,
  Award,
} from "lucide-react";

import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Switch } from "../../../components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Separator } from "../../../components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Textarea } from "../../../components/ui/textarea";
import { Progress } from "../../../components/ui/progress";

import type {
  TeacherProfileData,
  TeacherProfessionalData,
  TeacherCertification,
  TeacherNotifications,
  TeacherWorkSummary,
  TeacherReview,
} from "../types/profile";

type Props = {
  profileData: TeacherProfileData;
  setProfileData: React.Dispatch<React.SetStateAction<TeacherProfileData>>;

  professionalData: TeacherProfessionalData;
  setProfessionalData: React.Dispatch<React.SetStateAction<TeacherProfessionalData>>;

  certifications: TeacherCertification[];
  workSummary: TeacherWorkSummary;
  recentReviews: TeacherReview[];

  notifications: TeacherNotifications;
  setNotifications: React.Dispatch<React.SetStateAction<TeacherNotifications>>;

  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;

  isEditingProfile: boolean;
  setIsEditingProfile: React.Dispatch<React.SetStateAction<boolean>>;

  isEditingProfessional: boolean;
  setIsEditingProfessional: React.Dispatch<React.SetStateAction<boolean>>;

  isChangingPassword: boolean;
  setIsChangingPassword: React.Dispatch<React.SetStateAction<boolean>>;

  onSaveProfile: () => void;
  onSaveProfessional: () => void;
  onChangePassword: () => void;
};

export default function TeacherProfileTabs({
  profileData,
  setProfileData,
  professionalData,
  setProfessionalData,
  certifications,
  workSummary,
  recentReviews,
  notifications,
  setNotifications,
  language,
  setLanguage,
  isEditingProfile,
  setIsEditingProfile,
  isEditingProfessional,
  setIsEditingProfessional,
  isChangingPassword,
  setIsChangingPassword,
  onSaveProfile,
  onSaveProfessional,
  onChangePassword,
}: Props) {
  const initials = useMemo(() => {
    const parts = (profileData.name || "SR").trim().split(" ");
    return parts.slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "SR";
  }, [profileData.name]);

  return (
    <div className="md:col-span-2">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="professional">Professional</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl" style={{ color: "#1E3A8A" }}>
                Personal Information
              </h3>

              {!isEditingProfile ? (
                <Button onClick={() => setIsEditingProfile(true)} style={{ backgroundColor: "#3B82F6" }}>
                  <Edit className="w-4 h-4 mr-2 shrink-0" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={onSaveProfile} style={{ backgroundColor: "#22C55E" }}>
                    <Save className="w-4 h-4 mr-2 shrink-0" />
                    Save
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                    <X className="w-4 h-4 mr-2 shrink-0" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <div className="flex items-center gap-2 mt-1">
                  <User className="w-4 h-4 text-gray-400 shrink-0" />
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    disabled={!isEditingProfile}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    disabled={!isEditingProfile}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    disabled={!isEditingProfile}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  disabled={!isEditingProfile}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  disabled={!isEditingProfile}
                  className="mt-1 min-h-[100px]"
                />
                <p className="text-sm text-gray-600 mt-1">This will be visible to students viewing your profile</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Professional Tab */}
        <TabsContent value="professional">
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl" style={{ color: "#1E3A8A" }}>
                  Professional Information
                </h3>

                {!isEditingProfessional ? (
                  <Button onClick={() => setIsEditingProfessional(true)} style={{ backgroundColor: "#3B82F6" }}>
                    <Edit className="w-4 h-4 mr-2 shrink-0" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={onSaveProfessional} style={{ backgroundColor: "#22C55E" }}>
                      <Save className="w-4 h-4 mr-2 shrink-0" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditingProfessional(false)}>
                      <X className="w-4 h-4 mr-2 shrink-0" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="subjects">Teaching Subjects (comma-separated)</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <BookOpen className="w-4 h-4 text-gray-400 shrink-0" />
                    <Input
                      id="subjects"
                      value={professionalData.subjects.join(", ")}
                      onChange={(e) =>
                        setProfessionalData({
                          ...professionalData,
                          subjects: e.target.value.split(",").map((s) => s.trim()),
                        })
                      }
                      disabled={!isEditingProfessional}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="experience">Years of Experience</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                    <Input
                      id="experience"
                      value={professionalData.experience}
                      onChange={(e) => setProfessionalData({ ...professionalData, experience: e.target.value })}
                      disabled={!isEditingProfessional}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="hourlyRate">Hourly Rate</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <DollarSign className="w-4 h-4 text-gray-400 shrink-0" />
                    <Input
                      id="hourlyRate"
                      value={professionalData.hourlyRate}
                      onChange={(e) => setProfessionalData({ ...professionalData, hourlyRate: e.target.value })}
                      disabled={!isEditingProfessional}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="education">Education</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <GraduationCap className="w-4 h-4 text-gray-400 shrink-0" />
                    <Input
                      id="education"
                      value={professionalData.education}
                      onChange={(e) => setProfessionalData({ ...professionalData, education: e.target.value })}
                      disabled={!isEditingProfessional}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="specializations">Specializations</Label>
                  <Input
                    id="specializations"
                    value={professionalData.specializations}
                    onChange={(e) => setProfessionalData({ ...professionalData, specializations: e.target.value })}
                    disabled={!isEditingProfessional}
                    className="mt-1"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl" style={{ color: "#1E3A8A" }}>
                    Certifications & Qualifications
                  </h3>
                  <p className="text-sm text-gray-600">Showcase your credentials to students</p>
                </div>

                <Button style={{ backgroundColor: "#8B5CF6" }}>
                  <Upload className="w-4 h-4 mr-2 shrink-0" />
                  Add Certificate
                </Button>
              </div>

              <div className="space-y-3">
                {certifications.map((cert) => (
                  <div key={cert.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <Award className="w-5 h-5 mt-1 shrink-0" style={{ color: "#8B5CF6" }} />
                        <div>
                          <p className="font-semibold" style={{ color: "#1E3A8A" }}>
                            {cert.name}
                          </p>
                          <p className="text-sm text-gray-600">{cert.issuer}</p>
                          <p className="text-sm text-gray-500">Issued: {cert.year}</p>
                        </div>
                      </div>

                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Verified</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews">
          <Card className="p-6">
            <h3 className="text-2xl mb-6" style={{ color: "#1E3A8A" }}>
              Student Reviews
            </h3>

            <div className="p-6 bg-gray-50 rounded-lg mb-6">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-5xl mb-2" style={{ color: "#1E3A8A" }}>
                    {workSummary.averageRating}
                  </div>

                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-5 h-5 fill-yellow-400 text-yellow-400 shrink-0" />
                    ))}
                  </div>

                  <p className="text-gray-600">{workSummary.totalReviews} reviews</p>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="w-12 text-sm">5 stars</span>
                    <Progress value={85} className="flex-1" />
                    <span className="w-12 text-sm text-gray-600">85%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-12 text-sm">4 stars</span>
                    <Progress value={12} className="flex-1" />
                    <span className="w-12 text-sm text-gray-600">12%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-12 text-sm">3 stars</span>
                    <Progress value={2} className="flex-1" />
                    <span className="w-12 text-sm text-gray-600">2%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-12 text-sm">2 stars</span>
                    <Progress value={1} className="flex-1" />
                    <span className="w-12 text-sm text-gray-600">1%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-12 text-sm">1 star</span>
                    <Progress value={0} className="flex-1" />
                    <span className="w-12 text-sm text-gray-600">0%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xl" style={{ color: "#1E3A8A" }}>
                Recent Reviews
              </h4>

              {recentReviews.map((review) => (
                <div key={review.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-[#3B82F6] text-white text-sm">
                          {review.student
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <p className="font-semibold">{review.student}</p>
                        <p className="text-sm text-gray-600">{review.date}</p>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400 shrink-0" />
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>

            <Button className="w-full mt-6" variant="outline">
              View All Reviews
            </Button>
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
                  <p className="text-sm text-gray-600">Manage your password and security settings</p>
                </div>

                {!isChangingPassword && (
                  <Button onClick={() => setIsChangingPassword(true)} style={{ backgroundColor: "#3B82F6" }}>
                    <Lock className="w-4 h-4 mr-2 shrink-0" />
                    Change Password
                  </Button>
                )}
              </div>

              {isChangingPassword && (
                <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" className="mt-1" />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={onChangePassword} style={{ backgroundColor: "#22C55E" }}>
                      Update Password
                    </Button>
                    <Button variant="outline" onClick={() => setIsChangingPassword(false)}>
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
                <p className="text-sm text-gray-600">Choose what updates you'd like to receive</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-gray-400 shrink-0" />
                    <div>
                      <p>Email Notifications</p>
                      <p className="text-sm text-gray-600">Receive email updates about your account</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="w-5 h-5 text-gray-400 shrink-0" />
                    <div>
                      <p>Session Reminders</p>
                      <p className="text-sm text-gray-600">Get reminded before your sessions start</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.sessionReminders}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, sessionReminders: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Inbox className="w-5 h-5 text-gray-400 shrink-0" />
                    <div>
                      <p>Student Requests</p>
                      <p className="text-sm text-gray-600">Get notified of new session requests</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.studentRequests}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, studentRequests: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400 shrink-0" />
                    <div>
                      <p>Weekly Reports</p>
                      <p className="text-sm text-gray-600">Get weekly teaching performance reports</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.weeklyReports}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReports: checked })}
                  />
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
