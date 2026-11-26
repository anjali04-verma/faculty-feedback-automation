
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    const result = register(name, email, password, role);

    if (!result.success) {
      setError(result.message);
      return;
    }

    alert("Registration Successful! Please Login.");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 p-4">

      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-8 shadow-xl">

        <h1 className="text-2xl font-bold text-center text-blue-700">
          Create Account
        </h1>

        <p className="text-center text-sm text-slate-500 mt-2">
          Join the Faculty Feedback Portal
        </p>

        <form onSubmit={handleRegister} className="mt-6 space-y-4">

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg border p-3 dark:bg-slate-800 dark:text-white"
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border p-3 dark:bg-slate-800 dark:text-white"
          />

          <input
            type="password"
            placeholder="Password (minimum 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
            className="w-full rounded-lg border p-3 dark:bg-slate-800 dark:text-white"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="w-full rounded-lg border p-3 dark:bg-slate-800 dark:text-white"
          >
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
          </select>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700"
          >
            Sign Up
          </button>

        </form>

        <p className="mt-5 text-center text-sm dark:text-white">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-blue-600">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;
