import {
  User,
  Mail,
  Phone,
  BookOpen,
  Clock,
  Banknote,
  GraduationCap,
  Edit,
  Save,
  X,
  Star,
} from "lucide-react";

import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { getInitials } from "../../../utils/utils";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
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

  passwordData: { currentPassword: string; newPassword: string; confirmPassword: string };
  setPasswordData: React.Dispatch<React.SetStateAction<{ currentPassword: string; newPassword: string; confirmPassword: string }>>;
  passwordError: string;
  passwordSuccess: string;

  profileError: string;
  profileSuccess: string;

  onSaveProfile: () => void;
  onSaveProfessional: () => void;
  onChangePassword: () => void;
};

export default function TeacherProfileTabs({
  profileData,
  setProfileData,
  professionalData,
  setProfessionalData,
  certifications: _certifications,
  workSummary,
  recentReviews,
  isEditingProfile,
  setIsEditingProfile,
  isEditingProfessional,
  setIsEditingProfessional,
  profileError,
  profileSuccess,
  onSaveProfile,
  onSaveProfessional,
}: Props) {
  const totalReviewsCount = recentReviews.length;
  const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  recentReviews.forEach((r) => {
    const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 5 | 4 | 3 | 2 | 1;
    starCounts[star]++;
  });

  const getPercent = (stars: 5 | 4 | 3 | 2 | 1) => {
    if (totalReviewsCount === 0) return 0;
    return Math.round((starCounts[stars] / totalReviewsCount) * 100);
  };

  return (
    <div className="md:col-span-2 font-sans">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="professional">Professional</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
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
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <div className="flex items-center gap-2 mt-1">
                  <User className="w-4 h-4 text-gray-400 shrink-0" />
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    disabled={!isEditingProfile}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <div className="flex items-center gap-2 mt-1">
                  <User className="w-4 h-4 text-gray-400 shrink-0" />
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
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
                  <Label htmlFor="hourlyRate">Hourly Rate (EGP)</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Banknote className="w-4 h-4 text-gray-400 shrink-0" />
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
                    <Progress value={getPercent(5)} className="flex-1" />
                    <span className="w-12 text-sm text-gray-600">{getPercent(5)}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-12 text-sm">4 stars</span>
                    <Progress value={getPercent(4)} className="flex-1" />
                    <span className="w-12 text-sm text-gray-600">{getPercent(4)}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-12 text-sm">3 stars</span>
                    <Progress value={getPercent(3)} className="flex-1" />
                    <span className="w-12 text-sm text-gray-600">{getPercent(3)}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-12 text-sm">2 stars</span>
                    <Progress value={getPercent(2)} className="flex-1" />
                    <span className="w-12 text-sm text-gray-600">{getPercent(2)}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-12 text-sm">1 star</span>
                    <Progress value={getPercent(1)} className="flex-1" />
                    <span className="w-12 text-sm text-gray-600">{getPercent(1)}%</span>
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
                          {getInitials(review.student) || "ST"}
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

                  {review.comment && <p className="text-gray-700 mt-2">{review.comment}</p>}
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
