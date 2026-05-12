import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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

/* Search */
import SearchTeachersPage from "./features/search-teacher/pages/SearchTeachersPage";

/* My Students */
import MyStudentsPage from "./features/my-students/pages/MyStudentsPage";

/* Schedule */
import TeacherSchedulePage from "./features/teacher-schedule/pages/TeacherSchedulePage";

/* Teacher Extras */
import TeacherPayoutPage from "./features/teacher/pages/TeacherPayoutPage";
import LiveSessionPage from "./features/sessions/pages/LiveSessionPage";
import SessionAnalysisPage from "./features/sessions/pages/SessionAnalysisPage";

/* Student Dashboard */
import StudentDashboardPage from "./features/student-dashboard/pages/StudentDashboardPage";
import TeacherDashboardPage from "./features/teacher-dashboard/pages/TeacherDashboardPage";

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

        {/* SESSIONS */}
        <Route path="/request-session" element={<RequestSessionPage />} />
        <Route path="/teacher/session-requests" element={<TeacherSessionRequestsPage />} />

        {/* SCHEDULE */}
        <Route path="/teacher/schedule" element={<TeacherSchedulePage />} />

        {/* CALENDAR */}
        <Route path="/student/calendar" element={<StudentCalendarPage />} />
        <Route path="/teacher/calendar" element={<TeacherCalendarPage />} />
        <Route path="/teacher/payout" element={<TeacherPayoutPage />} />

        {/* LIVE SESSIONS */}
        <Route path="/teacher/live-session" element={<LiveSessionPage />} />
        <Route path="/teacher/session-analysis" element={<SessionAnalysisPage />} />

        {/* PAYMENT */}
        <Route path="/payment" element={<PaymentPage />} />

        {/* CHAT */}
        <Route path="/chats" element={<ChatsListPage userRole="student" />} />

        {/* SEARCH */}
        <Route path="/search-teachers" element={<SearchTeachersPage />} />

        {/* My Students */}
        <Route path="/my-students" element={<MyStudentsPage />} />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}