
import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  GraduationCap,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Monitor,
  User,
  Lock,
  Mail,
  MapPin,
  Phone,
  Globe
} from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const result = login(email, password, role);

    if (result) {
      navigate(`/${result}`);
    } else {
      setError("Invalid credentials or selected role");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950
      transition-colors duration-300 p-4 md:p-8">

      {/* Header */}
      <header className="max-w-7xl mx-auto flex justify-between
        items-center mb-8">

        <div className="flex items-center gap-3">
          <GraduationCap className="text-blue-600" size={36}/>
          <div>
            <h1 className="text-xl md:text-2xl font-bold
              text-slate-900 dark:text-white">
              Faculty Feedback
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ABES Engineering College
            </p>
          </div>
        </div>

        {/* Theme Selector */}
        <div className="flex gap-1 bg-white dark:bg-slate-800
          p-1 rounded-xl shadow-sm">

          {[
            { value: "light", icon: Sun },
            { value: "dark", icon: Moon },
            { value: "system", icon: Monitor }
          ].map(({ value, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              title={value}
              className={`p-2 rounded-lg ${
                theme === value
                  ? "bg-blue-600 text-white"
                  : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              <Icon size={18}/>
            </button>
          ))}
        </div>
      </header>

      {/* Main Section */}
      <main className="max-w-7xl mx-auto grid md:grid-cols-2
        min-h-[650px] bg-white dark:bg-slate-900
        rounded-3xl overflow-hidden shadow-xl">

        {/* College Image Section */}
        <section className="relative min-h-[350px] md:min-h-full">

          <img
            src="https://cdn.prod.website-files.com/67d6990100e24ea560d96894/684094804ecf0296519779d1_ABES%20Engineering.jpg"
            alt="ABES Engineering College Campus"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t
            from-slate-950/90 via-slate-900/20 to-transparent"/>

          <div className="absolute bottom-0 left-0 p-8 md:p-10">

            <span className="bg-blue-600 text-white text-xs
              px-3 py-1 rounded-full">
              COLLEGE PORTAL
            </span>

            <h2 className="text-3xl md:text-4xl font-bold
              text-white mt-5">
              Your Feedback.
              <br/>
              Our Improvement.
            </h2>

            <p className="text-slate-200 mt-4 max-w-md">
              Share your valuable feedback and help us
              improve the quality of education.
            </p>

            <p className="text-white/80 text-sm mt-8">
              ABES Engineering College, Ghaziabad
            </p>
          </div>
        </section>

        {/* Login Section */}
        <section className="flex items-center justify-center
          p-6 md:p-10 lg:p-14">

          <div className="w-full max-w-md">

            <div className="mb-8">
              <div className="w-14 h-14 bg-blue-100
                dark:bg-blue-900/40 rounded-2xl
                flex items-center justify-center mb-5">

                <GraduationCap className="text-blue-600"
                  size={32}/>
              </div>

              <h2 className="text-3xl font-bold
                text-slate-900 dark:text-white">
                Welcome Back!
              </h2>

              <p className="text-slate-500 dark:text-slate-400 mt-2">
                Please login to access your account.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">

              {/* Username */}
              <div>
                <label className="block text-sm font-semibold
                  text-slate-700 dark:text-slate-300 mb-2">
                  Username or Email
                </label>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2
                    -translate-y-1/2 text-slate-400" size={19}/>

                  <input
                    type="text"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    placeholder="Enter username or email"
                    required
                    className="w-full pl-12 pr-4 py-3
                      rounded-xl border border-slate-300
                      dark:border-slate-700 bg-slate-50
                      dark:bg-slate-800 dark:text-white
                      outline-none focus:ring-2
                      focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold
                  text-slate-700 dark:text-slate-300 mb-2">
                  Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2
                    -translate-y-1/2 text-slate-400" size={19}/>

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="Enter your password"
                    required
                    className="w-full pl-12 pr-12 py-3
                      rounded-xl border border-slate-300
                      dark:border-slate-700 bg-slate-50
                      dark:bg-slate-800 dark:text-white
                      outline-none focus:ring-2
                      focus:ring-blue-500"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2
                      -translate-y-1/2 text-slate-400"
                  >
                    {showPassword
                      ? <EyeOff size={19}/>
                      : <Eye size={19}/>}
                  </button>
                </div>
              </div>
              <div className="text-right">
  <Link
    to="/forgot-password"
    className="text-sm text-blue-600 hover:underline"
  >
    Forgot Password?
  </Link>
</div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-semibold
                  text-slate-700 dark:text-slate-300 mb-3">
                  Login As
                </label>

                <div className="grid grid-cols-3 gap-2">

                  {[
                    { value: "student", label: "Student", icon: User },
                    { value: "faculty", label: "Faculty", icon: GraduationCap },
                    { value: "admin", label: "Admin", icon: Lock }
                  ].map((item) => {
                    const Icon = item.icon;

                    return (
                      <button
                        type="button"
                        key={item.value}
                        onClick={() => {
                          setRole(item.value);
                          setError("");
                        }}
                        className={`flex flex-col items-center
                          gap-2 p-3 rounded-xl border text-sm
                          font-medium transition ${
                          role === item.value
                            ? "border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-950/50"
                            : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300"
                        }`}
                      >
                        <Icon size={22}/>
                        {item.label}
                      </button>
                    );
                  })}

                </div>
              </div>

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              {/* Login Button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-blue-600
                  hover:bg-blue-700 text-white font-semibold
                  rounded-xl shadow-lg shadow-blue-600/20
                  transition"
              >
                Login to Dashboard
              </button>

            </form>

            <p className="text-center text-xs text-slate-400 mt-8">
              © 2026 ABES Engineering College. All rights reserved.
            </p>
            <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-300">
  Don't have an account?{" "}
  <Link
    to="/register"
    className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
  >
    Sign Up
  </Link>
</p>

          </div>
        </section>
      </main>

{/* Contact Information */}
<section className="w-[98%] max-w-[1600px] mx-auto mt-8 mb-5">

  <h2 className="text-2xl font-bold text-center
    text-slate-900 dark:text-white mb-6">
    Contact Information
  </h2>

  
<div className="grid md:grid-cols-3 gap-6">

  {/* College Address */}
  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-md flex items-center gap-4">
    <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-xl">
      <MapPin className="text-blue-600" size={25} />
    </div>

    <div>
      <h3 className="font-bold text-slate-800 dark:text-white">
        College Address
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        ABES Engineering College, Ghaziabad, UP
      </p>
    </div>
  </div>

  {/* Contact Number */}
  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-md flex items-center gap-4">
    <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-xl">
      <Phone className="text-blue-600" size={25} />
    </div>

    <div>
      <h3 className="font-bold text-slate-800 dark:text-white">
        Contact Number
      </h3>
      <a
        href="tel:01207135112"
        className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600"
      >
        01207135112
      </a>
    </div>
  </div>

  {/* Email Address */}
  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-md flex items-center gap-4">
    <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-xl">
      <Mail className="text-blue-600" size={25} />
    </div>

    <div>
      <h3 className="font-bold text-slate-800 dark:text-white">
        Email Address
      </h3>
      <a
        href="mailto:info@abes.ac.in"
        className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600"
      >
        info@abes.ac.in
      </a>
    </div>
  </div>

</div>


  {/* Footer */}
  <footer className="text-center mt-8 py-5
    border-t border-slate-200 dark:border-slate-800">

    <p className="text-sm text-slate-500 dark:text-slate-400">
      © 2026 ABES Engineering College.
      Faculty Feedback Automation System.
    </p>

    <p className="text-xs text-slate-400 mt-2">
      Designed to improve teaching and learning experiences.
    </p>

    <p  className="text-xs text-slate-400 mt-2">
      Developed & Maintained By: <Team member 1- Anjali Verma ><Team Member 2- Anjali Singh >< CSE and 11 >
    </p>

     <p  className="text-xs text-slate-400 mt-2">
      Full Stack Development Team
    </p>

    <p className="text-xs text-slate-400 mt-2">
     © 2026 ABESEC Ghaziabad. All Rights Reserved
    </p>

  </footer>

 </section>

</div>
  );
}

export default Login;
