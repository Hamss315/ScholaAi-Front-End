import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { getCurrentUserProfile, type TeacherProfile } from "../../../utils/userDataService";

import DashboardHeader from "../components/DashboardHeader";
import DashboardStats from "../components/DashboardStats";
import ActiveSessions from "../components/ActiveSessions";
import UpcomingClasses from "../components/UpcomingClasses";
import PerformanceAnalytics from "../components/PerformanceAnalytics";
import CalendarCard from "../components/CalendarCard";
import EarningsCard from "../components/EarningsCard";
import TodayOverview from "../components/TodayOverview";

export default function TeacherDashboardPage() {
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null);

  useEffect(() => {
    const profile = getCurrentUserProfile();
    if (profile && profile.role === "teacher") {
      setTeacherProfile(profile as TeacherProfile);
    }
  }, []);

  // Get available days based on teacher's availability
  const getAvailableDays = () => {
    if (!teacherProfile?.availability) return [];
    
    const dayMap: Record<string, number> = {
      "Mon": 1,
      "Tue": 2,
      "Wed": 3,
      "Thu": 4,
      "Fri": 5,
      "Sat": 6,
      "Sun": 0
    };

    const availableDayNumbers: number[] = [];
    Object.entries(teacherProfile.availability).forEach(([day, slots]) => {
      if (slots && slots.length > 0) {
        availableDayNumbers.push(dayMap[day]);
      }
    });

    return availableDayNumbers;
  };

  const availableDays = getAvailableDays();

  const activeSessions = [
    { id: 1, student: "Emily Parker", subject: "Mathematics", startTime: "1:30 PM", focusScore: 85, status: "warning", isCurrent: true },
    { id: 2, student: "James Wilson", subject: "Physics", startTime: "3:00 PM", focusScore: 95, status: "good", isCurrent: false },
  ];

  const upcomingClasses = [
    { id: 1, student: "Sarah Martinez", subject: "Chemistry", time: "4:00 PM", duration: "1 hour" },
    { id: 2, student: "David Lee", subject: "Mathematics", time: "Tomorrow, 10:00 AM", duration: "1.5 hours" },
    { id: 3, student: "Lisa Anderson", subject: "Biology", time: "Tomorrow, 2:00 PM", duration: "1 hour" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl mb-2" style={{ color: '#1E3A8A' }}>Welcome, Dr. Roberts!</h1>
          <p className="text-gray-600">Your teaching dashboard for today</p>
        </div>

        <DashboardStats />

        {/* Engagement Alerts */}
        {activeSessions.some(s => s.status === "warning") && (
          <Alert className="mb-6 border-yellow-200 bg-yellow-50">
            <AlertCircle className="h-4 w-4" style={{ color: '#FACC15' }} />
            <AlertDescription>
              <span style={{ color: '#1E3A8A' }}>Student engagement alert:</span> Emily Parker's focus has dropped to 85%. Consider interactive activities.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {activeSessions.length > 0 && (
              <ActiveSessions sessions={activeSessions} />
            )}

            <UpcomingClasses upcoming={upcomingClasses} />

            <PerformanceAnalytics />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <CalendarCard availableDays={availableDays} />
            <EarningsCard />
            <TodayOverview />
          </div>
        </div>
      </div>
    </div>
  );
}