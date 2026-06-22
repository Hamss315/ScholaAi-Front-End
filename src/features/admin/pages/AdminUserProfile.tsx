import { Brain, ArrowLeft, Mail, MapPin, Calendar, BookOpen, Clock, Globe, Star, FileCheck, DollarSign, AlertTriangle, Trash2, UserCheck } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { cn } from "../../../utils/utils";
import { getUserByEmail } from "../../../utils/userDataService";
import type { UserProfile } from "../../../utils/userDataService";

export default function AdminUserProfile() {
  const { email } = useParams<{ email: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (email) {
      const userData = getUserByEmail(email);
      setUser(userData);
    }
  }, [email]);

  if (!user) {
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

  const isStudent = user.role === "student";
  const isTeacher = user.role === "teacher";
  const isAdmin = user.role === "admin";

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
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/admin/users/${user.email}/edit`)}
                className="border-gray-300 font-semibold"
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Profile Card Header */}
        <Card className="p-6 mb-6 bg-white border border-gray-200 shadow-sm">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
              <Avatar className="w-20 h-20 shadow-md border-2 border-primary/10">
                <AvatarFallback className="bg-[#3B82F6] text-white text-2xl font-bold">
                  {user.fullName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h1 className="text-3xl font-bold" style={{ color: '#1E3A8A' }}>{user.fullName}</h1>
                <p className="text-gray-500 font-medium">{user.email}</p>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-1">
                  <Badge className={cn(
                    "border-none px-2.5 py-0.5 font-semibold text-xs rounded-full",
                    isTeacher ? "bg-purple-100 text-purple-700 hover:bg-purple-100" :
                      isStudent ? "bg-blue-100 text-blue-700 hover:bg-blue-100" :
                        "bg-gray-100 text-gray-700 hover:bg-gray-100"
                  )}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                  <Badge className={cn(
                    "border-none px-2.5 py-0.5 font-semibold text-xs rounded-full",
                    user.status === "Suspended" ? "bg-red-100 text-red-700 hover:bg-red-100" : "bg-green-100 text-green-700 hover:bg-green-100"
                  )}>
                    {user.status || "Active"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Quick Status Bar */}
            <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
              <Button
                onClick={() => navigate(`/admin/users/${user.email}/payments`)}
                className="flex-1 md:w-48 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-semibold"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                {isStudent ? "View Payments" : isTeacher ? "View Earnings" : "Financials"}
              </Button>
              {user.status === "Suspended" ? (
                <Button
                  variant="outline"
                  onClick={() => navigate(`/admin/users/${user.email}/suspend`)}
                  className="flex-1 md:w-48 text-green-600 border-green-200 hover:bg-green-50 font-semibold"
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Unsuspend Account
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => navigate(`/admin/users/${user.email}/suspend`)}
                  className="flex-1 md:w-48 text-orange-600 border-orange-200 hover:bg-orange-50 font-semibold"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Suspend Account
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => navigate(`/admin/users/${user.email}/delete`)}
                className="flex-1 md:w-48 text-red-600 border-red-200 hover:bg-red-50 font-semibold"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>
        </Card>

        {user.status === "Suspended" && (
          <Card className="p-4 mb-6 border-red-200 bg-red-50 shadow-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 mt-0.5 text-red-600 flex-shrink-0" />
            <div>
              <div className="font-bold text-red-900">Account Suspended</div>
              <p className="text-sm text-red-800 mt-1 font-medium">
                <strong>Duration:</strong> {user.suspensionDuration === "permanent" ? "Permanent" : `${user.suspensionDuration} Days`} <br />
                <strong>Reason:</strong> {user.suspensionReason || "No reason provided"}
              </p>
            </div>
          </Card>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Info Column */}
          <div className="md:col-span-2 space-y-6">
            {/* Bio Card */}
            <Card className="p-6 bg-white border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#1E3A8A' }}>
                <FileCheck className="w-5 h-5 text-gray-500" />
                Biography / Description
              </h2>
              <p className="text-gray-700 leading-relaxed font-medium">
                {user.bio || "No biography provided."}
              </p>
            </Card>

            {/* Platform metrics */}
            {!isAdmin && (
              <Card className="p-6 bg-white border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#1E3A8A' }}>
                  <Clock className="w-5 h-5 text-gray-500" />
                  Activity Statistics
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {isStudent && (
                    <>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <div className="text-sm text-gray-500 font-medium">Sessions Completed</div>
                        <div className="text-2xl font-bold text-gray-900 mt-1">{user.sessionsCompleted || 0}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <div className="text-sm text-gray-500 font-medium">Wallet Balance</div>
                        <div className="text-2xl font-bold text-green-600 mt-1">${user.walletBalance || 0}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <div className="text-sm text-gray-500 font-medium">Focus Score</div>
                        <div className="text-2xl font-bold text-blue-600 mt-1">92%</div>
                      </div>
                    </>
                  )}
                  {isTeacher && (
                    <>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <div className="text-sm text-gray-500 font-medium">Sessions Taught</div>
                        <div className="text-2xl font-bold text-gray-900 mt-1">{user.sessionsTaught || 0}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <div className="text-sm text-gray-500 font-medium">Average Rating</div>
                        <div className="text-2xl font-bold text-yellow-600 mt-1 flex items-center gap-1">
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          {user.rating || "N/A"}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <div className="text-sm text-gray-500 font-medium">Hourly Rate</div>
                        <div className="text-2xl font-bold text-purple-600 mt-1">$45/hr</div>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar Info Column */}
          <div className="space-y-6">
            <Card className="p-6 bg-white border border-gray-200 shadow-sm font-medium">
              <h2 className="text-xl font-bold mb-4" style={{ color: '#1E3A8A' }}>User Details</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Email</div>
                    <div className="text-sm text-gray-800 break-all">{user.email}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Location</div>
                    <div className="text-sm text-gray-800">{user.location || "N/A"}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Joined Date</div>
                    <div className="text-sm text-gray-800">{user.joinedDate || "N/A"}</div>
                  </div>
                </div>

                {user.phone && (
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Phone</div>
                      <div className="text-sm text-gray-800">{user.phone}</div>
                    </div>
                  </div>
                )}

                {user.subjects && user.subjects.length > 0 && (
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Subjects</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {user.subjects.map((sub) => (
                          <Badge key={sub} className="bg-gray-100 hover:bg-gray-100 text-gray-700 font-semibold border-none text-[10px] px-2 py-0.5">
                            {sub}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
