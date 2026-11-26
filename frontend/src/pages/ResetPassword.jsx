
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LockKeyhole, Eye, EyeOff, CheckCircle } from "lucide-react";

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    // Demo only: actual password changes require backend verification.
    setMessage("Password validation successful. Backend reset is not connected yet.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 p-5">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl">

        <div className="flex justify-center mb-5">
          <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900/40">
            <LockKeyhole size={32} className="text-blue-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center dark:text-white">
          Reset Password
        </h1>
        <p className="text-center text-slate-500 mt-3 mb-7">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-semibold dark:text-white mb-2">
              New Password
            </label>
            <div className="flex items-center border rounded-lg px-3 dark:border-slate-700">
              <input
                required
                minLength={8}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full p-3 outline-none bg-transparent dark:text-white"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold dark:text-white mb-2">
              Confirm Password
            </label>
            <input
              required
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full border rounded-lg p-3 dark:bg-slate-800 dark:text-white dark:border-slate-700"
            />
          </div>

          {message && (
            <p className="text-sm text-blue-600">{message}</p>
          )}

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold">
            Reset Password
          </button>
        </form>

        <div className="text-center mt-6">
          <Link to="/login" className="text-blue-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
