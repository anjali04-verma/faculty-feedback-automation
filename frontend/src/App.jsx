
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";

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

        <Route path="/admin" element={<Dashboard role="Admin" />} />
        <Route path="/student" element={<Dashboard role="Student" />} />
        <Route path="/faculty" element={<Dashboard role="Faculty" />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
