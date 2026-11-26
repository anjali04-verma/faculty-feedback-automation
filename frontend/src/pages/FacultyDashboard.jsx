import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, MessageSquare, BarChart3, User,
  Settings, LogOut, Star, Moon, Sun, Monitor
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

function FacultyDashboard() {
  const [activePage, setActivePage] = useState("Dashboard");
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const [feedbacks, setFeedbacks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("feedbacks") || "[]");
    } catch {
      return [];
    }
  });

  const myFeedbacks = feedbacks.filter(
    item =>
      item.faculty?.trim().toLowerCase() ===
      user?.name?.trim().toLowerCase()
  );

  const averageRating = myFeedbacks.length
    ? (
        myFeedbacks.reduce(
          (total, item) =>
            total + Number(item.ratings?.teaching || 0),
          0
        ) / myFeedbacks.length
      ).toFixed(1)
    : "0.0";

  const refreshFeedbacks = () => {
    try {
      setFeedbacks(JSON.parse(localStorage.getItem("feedbacks") || "[]"));
    } catch {
      setFeedbacks([]);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "My Feedback", icon: MessageSquare },
    { name: "Feedback Analytics", icon: BarChart3 },
    { name: "My Profile", icon: User },
    { name: "Settings", icon: Settings }
  ];

  const renderFeedbackList = () => (
    <div className="mt-8 bg-white dark:bg-slate-900 rounded-xl p-6">
      <div className="flex flex-wrap justify-between gap-3 mb-5">
        <div>
          <h2 className="text-xl font-bold dark:text-white">
            Feedback Received
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Feedback submitted by students about your teaching.
          </p>
        </div>
        <button
          onClick={refreshFeedbacks}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Refresh
        </button>
      </div>

      {myFeedbacks.length === 0 ? (
        <p className="text-slate-500">No feedback received yet.</p>
      ) : (
        <div className="space-y-5">
          {myFeedbacks.map(item => (
            <div
              key={item.id}
              className="border-b border-slate-200 dark:border-slate-700 pb-5"
            >
              <div className="flex justify-between flex-wrap gap-2">
                <p className="font-semibold dark:text-white">
                  {item.anonymous ? "Anonymous Student" : item.studentName || "Student"}
                </p>
                <p className="text-sm text-slate-500">{item.date}</p>
              </div>

              <p className="text-yellow-500 mt-2">
                {"★".repeat(Number(item.ratings?.teaching || 0))}
                {"☆".repeat(5 - Number(item.ratings?.teaching || 0))}
                <span className="text-slate-500 ml-2">
                  {item.ratings?.teaching || 0}/5
                </span>
              </p>

              <p className="text-slate-600 dark:text-slate-300 mt-3">
                {item.comments || "No comments"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-slate-950">
      <aside className="w-64 shrink-0 bg-slate-900 text-white p-5 flex flex-col">
        <h1 className="text-xl font-bold mb-8">Faculty Portal</h1>

        <nav className="space-y-2">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => {
                  setActivePage(item.name);
                  if (item.name === "My Feedback") refreshFeedbacks();
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg ${
                  activePage === item.name
                    ? "bg-blue-600"
                    : "hover:bg-slate-800"
                }`}
              >
                <Icon size={20} />
                {item.name}
              </button>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-600 mt-auto"
        >
          <LogOut size={20} /> Logout
        </button>
      </aside>

      <main className="flex-1 min-w-0 p-6 md:p-10">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          {activePage}
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Welcome, {user?.name || "Faculty"}!
        </p>

        {activePage === "Dashboard" && (
          <>
            <div className="grid md:grid-cols-3 gap-5 mt-8">
              <StatCard
                icon={MessageSquare}
                label="Total Feedback"
                value={myFeedbacks.length}
              />
              <StatCard
                icon={Star}
                label="Average Rating"
                value={`${averageRating}/5`}
              />
              <StatCard
                icon={BarChart3}
                label="Feedback Received"
                value={myFeedbacks.length}
              />
            </div>
            {renderFeedbackList()}
          </>
        )}

        {activePage === "My Feedback" && renderFeedbackList()}

        {activePage === "Feedback Analytics" && (
          <div className="mt-8 grid md:grid-cols-2 gap-5">
            <StatCard
              icon={Star}
              label="Average Teaching Rating"
              value={`${averageRating}/5`}
            />
            <StatCard
              icon={MessageSquare}
              label="Total Responses"
              value={myFeedbacks.length}
            />
            <div className="md:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl">
              <h2 className="text-xl font-bold dark:text-white mb-4">
                Rating Summary
              </h2>
              {[1, 2, 3, 4, 5].map(score => {
                const count = myFeedbacks.filter(
                  item => Number(item.ratings?.teaching) === score
                ).length;
                return (
                  <div key={score} className="mb-4">
                    <div className="flex justify-between dark:text-white mb-1">
                      <span>{score} Star</span>
                      <span>{count} responses</span>
                    </div>
                    <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600"
                        style={{
                          width: `${myFeedbacks.length ? count / myFeedbacks.length * 100 : 0}%`
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activePage === "My Profile" && (
          <div className="mt-8 bg-white dark:bg-slate-900 p-6 rounded-xl">
            <ProfileField label="Name" value={user?.name} />
            <ProfileField label="Email" value={user?.email} />
            <ProfileField label="Role" value={user?.role} />
          </div>
        )}

        {activePage === "Settings" && (
          <div className="mt-8 bg-white dark:bg-slate-900 p-6 rounded-xl">
            <h2 className="font-bold text-xl dark:text-white mb-5">
              Appearance Settings
            </h2>
            <div className="flex flex-wrap gap-3">
              {[
                { value: "light", label: "Light Mode", icon: Sun },
                { value: "dark", label: "Dark Mode", icon: Moon },
                { value: "system", label: "System Default", icon: Monitor }
              ].map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.value}
                    onClick={() => setTheme(item.value)}
                    className={`border rounded-lg p-4 flex items-center gap-2 dark:text-white ${
                      theme === item.value ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30" : "border-slate-300 dark:border-slate-700"
                    }`}
                  >
                    <Icon size={20} /> {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow">
      <Icon className="text-blue-600 mb-3" size={28} />
      <p className="text-slate-500">{label}</p>
      <h2 className="text-3xl font-bold dark:text-white mt-2">{value}</h2>
    </div>
  );
}

function ProfileField({ label, value }) {
  return (
    <div className="border-b dark:border-slate-700 py-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="font-semibold dark:text-white">{value || "Not available"}</p>
    </div>
  );
}

export default FacultyDashboard;