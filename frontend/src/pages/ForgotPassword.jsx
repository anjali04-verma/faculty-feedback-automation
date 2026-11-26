
import { useState } from "react";
import { Link } from "react-router-dom";
import { LockKeyhole, Mail, ArrowLeft, Send } from "lucide-react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage("Please enter your registered email address.");
      return;
    }

    // Demo only: connect to backend email service later.
    setMessage("Password reset functionality will be available soon.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8">

        <div className="flex justify-center mb-5">
          <div className="bg-blue-100 dark:bg-blue-900/40 p-4 rounded-full">
            <LockKeyhole size={32} className="text-blue-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-slate-800 dark:text-white">
          Forgot Password?
        </h1>

        <p className="text-center text-slate-500 mt-3 mb-7">
          Enter your registered email address. We'll help you reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block font-semibold text-slate-700 dark:text-white mb-2">
              Email Address
            </label>

            <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-lg px-3">
              <Mail size={19} className="text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                className="w-full p-3 outline-none bg-transparent dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold"
          >
            <Send size={18} />
            Send Reset Link
          </button>
        </form>

        {message && (
          <p className="text-center text-sm text-blue-600 mt-5">
            {message}
          </p>
        )}

        <div className="text-center mt-7">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-blue-600 hover:underline font-semibold"
          >
            <ArrowLeft size={17} />
            Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
}

export default ForgotPassword;
