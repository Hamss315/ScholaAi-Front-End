import { BrowserRouter, Routes, Route, Navigate, useParams, useLocation, useNavigate } from "react-router-dom";

/* Landing */
import LandingPage from "./features/landing/pages/LandingPage";

/* Auth */
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";

/* Reset Password */
import ResetPasswordRequestPage from "./features/auth/pages/ResetPasswordRequestPage";
import ResetPasswordEmailSentPage from "./features/auth/pages/ResetPasswordEmailSentPage";
import ResetPasswordNewPage from "./features/auth/pages/ResetPasswordNewPage";
import ResetPasswordSuccessPage from "./features/auth/pages/ResetPasswordSuccessPage";

/* Profiles */
import StudentProfilePage from "./features/student/pages/StudentProfilePage";
import TeacherProfilePage from "./features/teacher/pages/TeacherProfilePage";

/* Onboarding */
import StudentOnboardingPage from "./features/onboarding/pages/StudentOnboardingPage";
import TeacherOnboardingPage from "./features/onboarding/pages/TeacherOnboardingPage";

/* Sessions */
import RequestSessionPage from "./features/sessions/pages/RequestSessionPage";
import TeacherSessionRequestsPage from "./features/sessions/pages/TeacherSessionRequestsPage";

/* Calendar */
import StudentCalendarPage from "./features/calendar/pages/StudentCalendarPage";
import TeacherCalendarPage from "./features/calendar/pages/TeacherCalendarPage";

/* Payment */
import PaymentPage from "./features/payment/pages/PaymentPage";

/* Chat */
import ChatsListPage from "./features/chat/pages/ChatsListPage";
import ChatPage from "./features/chat/pages/ChatPage";
import { useAuth } from "./context/auth-context";
import type { ChatConversation } from "./features/chat/types/chat";

/* Search */
import SearchTeachersPage from "./features/search-teacher/pages/SearchTeachersPage";

/* My Students */
import MyStudentsPage from "./features/my-students/pages/MyStudentsPage";

/* Schedule */
import TeacherSchedulePage from "./features/teacher-schedule/pages/TeacherSchedulePage";

/* Teacher Extras */
import TeacherPayoutPage from "./features/payment/pages/TeacherPayoutPage";
import LiveSessionPage from "./features/sessions/pages/LiveSessionPage";
import SessionAnalysisPage from "./features/sessions/pages/SessionAnalysisPage";

/* Student Dashboard */
import StudentDashboardPage from "./features/student-dashboard/pages/StudentDashboardPage";
import TeacherDashboardPage from "./features/teacher-dashboard/pages/TeacherDashboardPage";

/* Session */ 
import SessionStreamPage from "./features/sessions/pages/StreamPage";
import SessionRecordPage from "./features/sessions/pages/SessionRecordPage";
import SessionNotesPage from "./features/sessions/pages/SessionNotesPage";
import AllSessionsPage from "./features/sessions/pages/AllSessionsPage";
import SessionRatingPage from "./features/sessions/pages/SessionRatingPage";

/* Performance */
import PerformanceReportPage from "./features/performance/pages/PerformanceReportPage";

/* Admin */
import AdminLoginPage from "./features/admin/pages/AdminLoginPage";
import AdminPanel from "./features/admin/pages/AdminPanel";
import AdminUserProfile from "./features/admin/pages/AdminUserProfile";
import AdminSuspendUser from "./features/admin/pages/AdminSuspendUser";
import AdminDeleteUser from "./features/admin/pages/AdminDeleteUser";
import AdminUserPayments from "./features/admin/pages/AdminUserPayments";
import AdminEditUser from "./features/admin/pages/AdminEditUser";
import AdminRoute from "./features/admin/components/AdminRoute";

function ChatPageWrapper() {
  const { otherUserId } = useParams<{ otherUserId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const stateChat = location.state?.chat as ChatConversation | undefined;

  const selectedChat: ChatConversation = stateChat || {
    id: otherUserId || "",
    otherUserId: otherUserId || "",
    otherUserName: "Chat",
    otherUserRole: "student",
    unreadCount: 0,
    online: false,
  };

  return (
    <ChatPage
      onNavigate={(page) => {
        if (page === "chats-list") {
          navigate("/chats");
        } else {
          navigate("/");
        }
      }}
      userRole={user?.role || "student"}
      selectedChat={selectedChat}
      currentUserId={user?.userId || ""}
      currentUserName={user?.userName || ""}
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LANDING */}
        <Route path="/" element={<LandingPage />} />

        {/* AUTH */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* RESET PASSWORD */}
        <Route path="/reset-password/request" element={<ResetPasswordRequestPage />} />
        <Route path="/reset-password/email-sent" element={<ResetPasswordEmailSentPage />} />
        <Route path="/reset-password/new" element={<ResetPasswordNewPage />} />
        <Route path="/reset-password/success" element={<ResetPasswordSuccessPage />} />

        {/* ONBOARDING */}
        <Route path="/onboarding/student" element={<StudentOnboardingPage />} />
        <Route path="/onboarding/teacher" element={<TeacherOnboardingPage />} />

        {/* PROFILES */}
        <Route path="/student/profile" element={<StudentProfilePage />} />
        <Route path="/teacher/profile" element={<TeacherProfilePage />} />

        {/* DASHBOARD */}
        <Route path="/student/dashboard" element={<StudentDashboardPage />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboardPage />} />

        {/* PERFORMANCE */}
        <Route path="/student/performance" element={<PerformanceReportPage />} />

        {/* SCHEDULE */}
        <Route path="/teacher/schedule" element={<TeacherSchedulePage />} />

        {/* Student Views */}
        <Route path="/student/calendar" element={<StudentCalendarPage />} />
        <Route path="/student/sessions" element={<AllSessionsPage />} />

        {/* CALENDAR */}
        <Route path="/teacher/calendar" element={<TeacherCalendarPage />} />
        <Route path="/teacher/payout" element={<TeacherPayoutPage />} />

        {/* LIVE SESSIONS */}
        <Route path="/live-session" element={<LiveSessionPage />} />
        <Route path="/session-analysis" element={<SessionAnalysisPage />} />

        {/* PAYMENT */}
        <Route path="/payment" element={<PaymentPage />} />

        {/* CHAT */}
        <Route path="/chats" element={<ChatsListPage userRole="student" />} />
        <Route path="/chat/:otherUserId" element={<ChatPageWrapper />} />

        {/* SEARCH */}
        <Route path="/search-teachers" element={<SearchTeachersPage />} />

        {/* MY STUDENTS */}
        <Route path="/my-students" element={<MyStudentsPage />} />

        {/* REQUEST SESSIONS */}
        <Route path="/request-session" element={<RequestSessionPage />} />
        <Route path="/student/request-session" element={<RequestSessionPage />} />
        <Route path="/teacher/session-requests" element={<TeacherSessionRequestsPage />} />

        {/* SESSION STREAM */}
        <Route path="/session/:sessionId/stream" element={<SessionStreamPage />} />
        <Route path="/session/:sessionId/record" element={<SessionRecordPage />} />
        <Route path="/session/:sessionId/notes" element={<SessionNotesPage />} />
        <Route path="/session/:sessionId/rating" element={<SessionRatingPage />} />

        {/* ADMIN - public login */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* ADMIN - protected routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/panel" element={<AdminPanel />} />
          <Route path="/admin/users/:userId" element={<AdminUserProfile />} />
          <Route path="/admin/users/:userId/suspend" element={<AdminSuspendUser />} />
          <Route path="/admin/users/:userId/delete" element={<AdminDeleteUser />} />
          <Route path="/admin/users/:userId/payments" element={<AdminUserPayments />} />
          <Route path="/admin/users/:userId/edit" element={<AdminEditUser />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}