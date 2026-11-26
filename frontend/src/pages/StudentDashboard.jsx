import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, ClipboardList, History, User, Settings,
  LogOut, Bell, BookOpen, CheckCircle, Clock, Star,
  Send, Moon, Sun, Monitor, X
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

function StudentDashboard() {
  useEffect(() => {
  const updateFacultyList = () => {
    try {
      const savedFaculty = JSON.parse(
        localStorage.getItem("adminFaculty") || "[]"
      );

      setFacultyList(savedFaculty.map(item => item.name));
    } catch {
      setFacultyList([]);
    }
  };

  window.addEventListener("storage", updateFacultyList);

  return () => {
    window.removeEventListener("storage", updateFacultyList);
  };
}, []);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const [activePage, setActivePage] = useState("Dashboard");
  const [showNotifications, setShowNotifications] = useState(false);
  const [faculty, setFaculty] = useState("");
  const [ratings, setRatings] = useState({
  teaching: 0,
  communication: 0,
  punctuality: 0,
  knowledge: 0,
  interaction: 0
});

  const [comment, setComment] = useState("");

  const [feedbackList, setFeedbackList] = useState(() => {
    try {
      const all = JSON.parse(localStorage.getItem("feedbacks") || "[]");
      return all.filter(item => item.studentEmail === user?.email);
    } catch {
      return [];
    }
  });

 const [facultyList, setFacultyList] = useState(() => {
  try {
    const savedFaculty = JSON.parse(
      localStorage.getItem("adminFaculty") || "[]"
    );

    return savedFaculty.map(item => item.name);
  } catch {
    return [];
  }
});

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Give Feedback", icon: ClipboardList },
    { name: "Feedback History", icon: History },
    { name: "My Profile", icon: User },
    { name: "Settings", icon: Settings }
  ];

  const submittedFaculty = feedbackList.map(item => item.faculty);
  const pendingFaculty = facultyList.filter(
    name => !submittedFaculty.includes(name)
  );

  const submitted = feedbackList.length;
  const pending = pendingFaculty.length;

const submitFeedback = (e) => {
  e.preventDefault();

  if (!faculty || Object.values(ratings).some(value => value === 0)) {
    alert("Please select faculty and give all five ratings");
    return;
  }

  const averageRating =
    Object.values(ratings).reduce(
      (sum, value) => sum + Number(value), 0
    ) / 5;

  const newFeedback = {
    id: Date.now(),
    faculty,
    ratings,
    averageRating,
    comments: comment.trim(),
    anonymous: false,
    studentName: user?.name || "Student",
    studentEmail: user?.email || "",
    date: new Date().toLocaleString()
  };

  const allFeedbacks = JSON.parse(
    localStorage.getItem("feedbacks") || "[]"
  );

  const updatedFeedbacks = [...allFeedbacks, newFeedback];

  localStorage.setItem("feedbacks", JSON.stringify(updatedFeedbacks));
  setFeedbackList(prev => [...prev, newFeedback]);

  setFaculty("");
  setRatings({
    teaching: 0,
    communication: 0,
    punctuality: 0,
    knowledge: 0,
    interaction: 0
  });
  setComment("");
  setActivePage("Feedback History");

  alert("Feedback submitted successfully!");
};

 

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderContent = () => {
    switch (activePage) {
      case "Dashboard":
        return (
          <>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
              Student Dashboard
            </h1>
            <p className="text-slate-500 mt-2 mb-8">
              Welcome back, {user?.name || "Student"}!
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <StatCard icon={BookOpen} value={facultyList.length} label="Total Faculty" color="text-blue-600" />
              <StatCard icon={CheckCircle} value={submitted} label="Submitted Feedback" color="text-green-600" />
              <StatCard icon={Clock} value={pending} label="Pending Feedback" color="text-orange-500" />
            </div>

            <div className="bg-white dark:bg-slate-900 p-7 rounded-2xl shadow mt-8">
              <h2 className="text-xl font-bold dark:text-white">
                Pending Feedback
              </h2>
              <p className="text-slate-500 mt-3 mb-5">
                You have {pending} faculty feedback forms waiting for your response.
              </p>

              <button
                onClick={() => setActivePage("Give Feedback")}
                disabled={pending === 0}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white px-6 py-3 rounded-lg"
              >
                Give Feedback
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 p-7 rounded-2xl shadow mt-6">
              <h2 className="text-xl font-bold dark:text-white mb-3">
                Recent Activity
              </h2>
              {feedbackList.length === 0 ? (
                <p className="text-slate-500">No feedback submitted yet.</p>
              ) : (
                <p className="text-slate-600 dark:text-slate-300">
                  Your latest feedback was submitted for{" "}
                  {feedbackList[feedbackList.length - 1].faculty}.
                </p>
              )}
            </div>
          </>
        );

      case "Give Feedback":
        return (
          <>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
              Give Faculty Feedback
            </h1>
            <p className="text-slate-500 mb-8">
              Share your honest experience to improve teaching quality.
            </p>

            <form
              onSubmit={submitFeedback}
              className="bg-white dark:bg-slate-900 p-7 rounded-2xl shadow space-y-6"
            >
              <div>
                <label className="block font-semibold mb-2 dark:text-white">
                  Select Faculty
                </label>
                <select
                  value={faculty}
                  onChange={e => setFaculty(e.target.value)}
                  required
                  className="w-full border rounded-lg p-3 bg-white dark:bg-slate-800 dark:text-white"
                >
                  <option value="">Choose Faculty</option>
                  {pendingFaculty.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
                {pending === 0 && (
                  <p className="text-green-600 mt-2">
                    You have submitted feedback for all listed faculty.
                  </p>
                )}
              </div>

              <div className="space-y-5">
  {[
    { key: "teaching", label: "Teaching" },
    { key: "communication", label: "Communication" },
    { key: "punctuality", label: "Punctuality" },
    { key: "knowledge", label: "Knowledge" },
    { key: "interaction", label: "Interaction" }
  ].map(item => (
    <div key={item.key}>
      <label className="block font-semibold mb-2 dark:text-white">
        {item.label}
      </label>

      <div className="flex gap-3 items-center">
        {[1, 2, 3, 4, 5].map(num => (
          <button
            type="button"
            key={num}
            onClick={() =>
              setRatings(prev => ({
                ...prev,
                [item.key]: num
              }))
            }
            className={`p-2 ${
              ratings[item.key] >= num
                ? "text-yellow-500"
                : "text-slate-300"
            }`}
          >
            <Star
              size={25}
              fill={
                ratings[item.key] >= num
                  ? "currentColor"
                  : "none"
              }
            />
          </button>
        ))}

        <span className="text-slate-500">
          {ratings[item.key]}/5
        </span>
      </div>
    </div>
  ))}
</div>

              <div>
                <label className="block font-semibold mb-2 dark:text-white">
                  Your Comments / Suggestions
                </label>
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  rows="5"
                  placeholder="Write your feedback here..."
                  required
                  className="w-full border rounded-lg p-3 bg-white dark:bg-slate-800 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={pending === 0}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white px-6 py-3 rounded-lg"
              >
                <Send size={18} /> Submit Feedback
              </button>
            </form>
          </>
        );

      case "Feedback History":
        return (
          <>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
              Feedback History
            </h1>
            <p className="text-slate-500 mb-8">
              View your previously submitted feedback.
            </p>

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow p-6">
              {feedbackList.length === 0 ? (
                <p className="text-slate-500">
                  No feedback history available yet.
                </p>
              ) : (
                <div className="space-y-5">
                  {feedbackList.map(item => {
                    const score = Number(item.ratings?.teaching || 0);
                    return (
                      <div key={item.id} className="border-b dark:border-slate-700 pb-4">
                        <h3 className="font-bold dark:text-white">
                          {item.faculty}
                        </h3>
                        <p className="text-yellow-500 my-2">
                          {"★".repeat(score)}{"☆".repeat(5 - score)}
                          <span className="text-slate-500 ml-2">{score}/5</span>
                        </p>
                        <p className="text-slate-600 dark:text-slate-300">
                          {item.comments}
                        </p>
                        <p className="text-xs text-slate-400 mt-2">
                          Submitted: {item.date}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        );

      case "My Profile":
        return (
          <>
            <h1 className="text-3xl font-bold dark:text-white mb-8">
              My Profile
            </h1>
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-blue-100 dark:bg-blue-900/40 p-5 rounded-full">
                  <User size={35} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold dark:text-white">
                    {user?.name || "Student"}
                  </h2>
                  <p className="text-slate-500">Student Account</p>
                </div>
              </div>
              <ProfileField label="Name" value={user?.name || "Student"} />
              <ProfileField label="Email" value={user?.email || "Not available"} />
              <ProfileField label="College" value="ABES Engineering College" />
              <ProfileField label="Role" value={user?.role || "Student"} />
            </div>
          </>
        );

      case "Settings":
        return (
          <>
            <h1 className="text-3xl font-bold dark:text-white mb-2">Settings</h1>
            <p className="text-slate-500 mb-8">Customize your dashboard appearance.</p>
            <ThemeSettings theme={theme} setTheme={setTheme} />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex">
      <aside className="w-64 shrink-0 bg-slate-900 text-white p-6 flex flex-col min-h-screen">
        <h2 className="text-xl font-bold mb-10">Faculty Feedback</h2>
        <nav className="space-y-3">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => setActivePage(item.name)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg ${
                  activePage === item.name ? "bg-blue-600" : "hover:bg-slate-800"
                }`}
              >
                <Icon size={20} /> {item.name}
              </button>
            );
          })}
        </nav>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 mt-auto rounded-lg hover:bg-red-600"
        >
          <LogOut size={20} /> Logout
        </button>
      </aside>

      <main className="flex-1 min-w-0 p-6 md:p-9">
        <div className="flex justify-end relative mb-6">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-3 bg-white dark:bg-slate-800 rounded-full shadow"
          >
            <Bell className="text-blue-600" />
          </button>
          {showNotifications && (
            <div className="absolute right-0 top-14 z-10 w-72 bg-white dark:bg-slate-900 shadow-xl rounded-xl p-5">
              <div className="flex justify-between mb-3">
                <h3 className="font-bold dark:text-white">Notifications</h3>
                <button onClick={() => setShowNotifications(false)}><X size={18} /></button>
              </div>
              <p className="text-sm text-slate-500">
                {pending} feedback forms are pending.
              </p>
            </div>
          )}
        </div>
        {renderContent()}
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, value, label, color }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-md">
      <Icon className={`${color} mb-4`} size={32} />
      <h2 className="text-3xl font-bold dark:text-white">{value}</h2>
      <p className="text-slate-500 mt-1">{label}</p>
    </div>
  );
}

function ProfileField({ label, value }) {
  return (
    <div className="border-b dark:border-slate-700 py-4">
      <p className="text-sm text-slate-500 mb-1">{label}</p>
      <p className="font-semibold dark:text-white">{value}</p>
    </div>
  );
}

function ThemeSettings({ theme, setTheme }) {
  const options = [
    { value: "light", label: "Light Mode", icon: Sun },
    { value: "dark", label: "Dark Mode", icon: Moon },
    { value: "system", label: "System Default", icon: Monitor }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow p-7">
      <h2 className="font-bold text-lg dark:text-white mb-5">Appearance</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {options.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.value}
              onClick={() => setTheme(item.value)}
              className={`border rounded-xl p-5 flex flex-col items-center gap-3 dark:text-white ${
                theme === item.value
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            >
              <Icon className="text-blue-600" size={28} />
              {item.label}
              {theme === item.value && <span className="text-xs text-blue-600">Selected</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default StudentDashboard;