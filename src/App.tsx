import { BrowserRouter, Routes, Route} from "react-router-dom";

import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";

import ResetPasswordRequestPage from "./features/auth/pages/ResetPasswordRequestPage";
import ResetPasswordEmailSentPage from "./features/auth/pages/ResetPasswordEmailSentPage";
import ResetPasswordNewPage from "./features/auth/pages/ResetPasswordNewPage";
import ResetPasswordSuccessPage from "./features/auth/pages/ResetPasswordSuccessPage";

import StudentProfilePage from "./features/student/pages/StudentProfilePage";
import TeacherProfilePage from "./features/teacher/pages/TeacherProfilePage";

import StudentOnboardingPage from "./features/onboarding/pages/StudentOnboardingPage";
import TeacherOnboardingPage from "./features/onboarding/pages/TeacherOnboardingPage";

import RequestSessionPage from "./features/sessions/pages/RequestSessionPage";
import TeacherSessionRequestsPage from "./features/sessions/pages/TeacherSessionRequestsPage";

import ChatPage from "./features/messages/pages/ChatPage";
import ChatsListPage from "./features/messages/pages/ChatsListPage"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Reset Password Flow */}
        <Route path="/reset-password/request" element={<ResetPasswordRequestPage />} />
        <Route path="/reset-password/email-sent" element={<ResetPasswordEmailSentPage />} />
        <Route path="/reset-password/new" element={<ResetPasswordNewPage />} />
        <Route path="/reset-password/success" element={<ResetPasswordSuccessPage />} />

        {/* Profiles */}
        <Route path="/student/profile" element={<StudentProfilePage />} />
        <Route path="/teacher/profile" element={<TeacherProfilePage />} />

        {/* Onboarding */}
        <Route path="/onboarding/student" element={<StudentOnboardingPage />} />
        <Route path="/onboarding/teacher" element={<TeacherOnboardingPage />} />

        {/* Request Sessions */}
        <Route path="/student/request-session" element={<RequestSessionPage />} />
        <Route path="/teacher/session-requests" element={<TeacherSessionRequestsPage />} />

        {/* Chats */}
        <Route
          path="/messages"
          element={<ChatsListPage userRole="student" />}
        />

        {/* <Route
          path="/chat/:chatId"
          element={<ChatPage userRole="student" />}
        /> */}

        {/* example for teacher */}
        <Route
          path="/teacher/messages"
          element={<ChatsListPage userRole="teacher" />}
        />
        {/* Dashboards (later) */}
        {/*
        <Route path="/student/dashboard" element={<div>Student</div>} />
        <Route path="/teacher/dashboard" element={<div>Teacher</div>} />
        <Route path="/admin/panel" element={<div>Admin</div>} />
        */}
      </Routes>
    </BrowserRouter>
  );
}
