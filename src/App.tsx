import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";

import ResetPasswordRequestPage from "./features/auth/pages/ResetPasswordRequestPage";
import ResetPasswordEmailSentPage from "./features/auth/pages/ResetPasswordEmailSentPage";
import ResetPasswordNewPage from "./features/auth/pages/ResetPasswordNewPage";
import ResetPasswordSuccessPage from "./features/auth/pages/ResetPasswordSuccessPage";
import StudentProfilePage from "./features/student/pages/StudentProfilePage";

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

        <Route path="/student/profile" element={<StudentProfilePage />} />

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
