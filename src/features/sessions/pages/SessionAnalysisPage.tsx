import { useNavigate } from "react-router-dom";
import { Brain, ArrowLeft, TrendingUp, Download, LogOut } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { useAuth } from "../../../context/auth-context";
import { getInitials } from "../../../utils/utils";

import SessionInfoCard from "../components/SessionInfoCard";
import SessionStats from "../components/SessionStats";
import EmotionAnalysis from "../components/EmotionAnalysis";
import TalkingTimeDistribution from "../components/TalkingTimeDistribution";
import SessionSummary from "../components/SessionSummary";
import NextSessionSchedule from "../components/NextSessionSchedule";

export default function SessionAnalysisPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const initials = getInitials(user?.userName, user?.firstName, user?.lastName) || "SJ";


  // Mock session data
  const sessionData = {
    lessonTitle: "Quadratic Equations and Problem Solving",
    lessonDescription:
      "In this session, we covered the fundamentals of quadratic equations, including factoring, completing the square, and using the quadratic formula. We also worked through several real-world application problems.",
    studentLevel: "Intermediate",
    subject: "Mathematics",
    studentName: "John Smith",
    teacherName: "Dr. Sarah Johnson",
    sessionDate: "Nov 5, 2025",
    sessionDuration: "1 hour 30 minutes",
    nextSessionDate: "Nov 12, 2025 at 2:00 PM",

    // Statistics
    stats: {
      explainedTopics: 5,
    },

    // Expressions percentages
    expressions: {
      positive: 65,
      neutral: 28,
      negative: 7,
    },

    // Talking time percentages
    talkingTime: {
      student: 35,
      teacher: 65,
    },

    // AI-generated summary
    summary:
      "This was a highly productive session with strong student engagement. John demonstrated excellent understanding of basic quadratic concepts and successfully solved 4 out of 5 practice problems independently. His focus score remained above 85% throughout the session. Areas for improvement include working on word problems and translating real-world scenarios into mathematical equations. Overall performance: Excellent. Recommended next steps: Practice more application problems and begin exploring systems of quadratic equations.",

    // Focus score
    focusScore: 88,
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleViewCalendar = () => {
    navigate("/teacher/calendar");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Brain className="w-8 h-8" style={{ color: "#8B5CF6" }} />
                <span className="text-2xl font-bold" style={{ color: "#1E3A8A" }}>
                  ScholaAi
                </span>
              </div>
              <Button variant="ghost" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />Back</Button>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
              <Avatar>
                <AvatarFallback className="bg-[#8B5CF6] text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold" style={{ color: "#1E3A8A" }}>
              Session Analysis
            </h1>
          </div>
          <p className="text-gray-600">
            AI-powered insights and performance metrics from your session
          </p>
        </div>

        {/* Session Info */}
        <SessionInfoCard sessionData={sessionData} />

        {/* Statistics Grid */}
        <SessionStats stats={sessionData.stats} />

        {/* Analysis Charts Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <EmotionAnalysis expressions={sessionData.expressions} />
          <TalkingTimeDistribution
            talkingTime={sessionData.talkingTime}
            focusScore={sessionData.focusScore}
          />
        </div>

        {/* AI Summary */}
        <SessionSummary summary={sessionData.summary} />

        {/* Next Scheduled Session banner */}
        <NextSessionSchedule
          nextSessionDate={sessionData.nextSessionDate}
          onViewCalendar={handleViewCalendar}
        />
      </div>
    </div>
  );
}
