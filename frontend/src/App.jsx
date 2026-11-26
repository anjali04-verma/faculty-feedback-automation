
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import FeedbackForm from "./pages/FeedbackForm";
import ResetPassword from "./pages/ResetPassword";
import Reports from "./pages/Reports";
import FacultyDashboard from "./pages/FacultyDashboard";
function Dashboard({ role }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950">
      <h1 className="text-3xl font-bold text-blue-600 dark:text-white">
        Welcome to {role} Dashboard
      </h1>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/faculty" element={<FacultyDashboard  />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
         <Route path="/feedback" element={<FeedbackForm />} />
<Route path="/reset-password" element={<ResetPassword />} />
<Route path="/reports" element={<Reports />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
