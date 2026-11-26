
import { Link } from "react-router-dom";

function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-center text-blue-700">
          Create Account
        </h1>

        <form className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full rounded-lg border p-3 dark:bg-slate-800 dark:text-white"
          />

          <input
            type="email"
            placeholder="Email Address"
            className="w-full rounded-lg border p-3 dark:bg-slate-800 dark:text-white"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-lg border p-3 dark:bg-slate-800 dark:text-white"
          />

          <select className="w-full rounded-lg border p-3 dark:bg-slate-800 dark:text-white">
            <option value="">Select Role</option>
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
          </select>

          <button
            type="button"
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
