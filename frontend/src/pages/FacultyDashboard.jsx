import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquare,
  BarChart3,
  User,
  Settings,
  LogOut,
  Star,
} from "lucide-react";

import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import SettingsPanel from "../context/SettingsPanel";

const ratingCriteria = [
  { key: "teaching", label: "Teaching" },
  { key: "communication", label: "Communication" },
  { key: "punctuality", label: "Punctuality" },
  { key: "knowledge", label: "Knowledge" },
  { key: "interaction", label: "Interaction" },
];

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

  // Show only feedback belonging to the logged-in faculty
  const myFeedbacks = feedbacks.filter(
    (item) =>
      item.faculty?.trim().toLowerCase() ===
      user?.name?.trim().toLowerCase()
  );

  // Calculate average using all available rating criteria
  const averageRating = myFeedbacks.length
    ? (
        myFeedbacks.reduce((total, item) => {
          const values = ratingCriteria
            .map((criterion) => item.ratings?.[criterion.key])
            .filter(
              (value) =>
                value !== undefined &&
                value !== null &&
                value !== ""
            )
            .map(Number)
            .filter((value) => Number.isFinite(value));

          const feedbackAverage = values.length
            ? values.reduce((sum, value) => sum + value, 0) /
              values.length
            : 0;

          return total + feedbackAverage;
        }, 0) / myFeedbacks.length
      ).toFixed(1)
    : "0.0";

  // Calculate average for each criterion
  const getCriterionAverage = (key) => {
    const values = myFeedbacks
      .map((item) => item.ratings?.[key])
      .filter(
        (value) =>
          value !== undefined &&
          value !== null &&
          value !== ""
      )
      .map(Number)
      .filter((value) => Number.isFinite(value));

    if (!values.length) return "0.0";

    return (
      values.reduce((sum, value) => sum + value, 0) /
      values.length
    ).toFixed(1);
  };

  const refreshFeedbacks = () => {
    try {
      setFeedbacks(
        JSON.parse(localStorage.getItem("feedbacks") || "[]")
      );
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
    { name: "Settings", icon: Settings },
  ];

  // Feedback list with all five ratings
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
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {myFeedbacks.length === 0 ? (
        <p className="text-slate-500">
          No feedback received yet.
        </p>
      ) : (
        <div className="space-y-5">
          {myFeedbacks.map((item) => (
            <div
              key={item.id}
              className="border-b border-slate-200 dark:border-slate-700 pb-5"
            >
              <div className="flex justify-between flex-wrap gap-2">
                <p className="font-semibold dark:text-white">
                  {item.anonymous
                    ? "Anonymous Student"
                    : item.studentName || "Student"}
                </p>

                <p className="text-sm text-slate-500">
                  {item.date}
                </p>
              </div>

              <div className="mt-4 space-y-3">
                {ratingCriteria.map((criterion) => {
                  const rawValue =
                    item.ratings?.[criterion.key];

                  const hasRating =
                    rawValue !== undefined &&
                    rawValue !== null &&
                    rawValue !== "";

                  const score = hasRating
                    ? Math.max(
                        0,
                        Math.min(5, Number(rawValue) || 0)
                      )
                    : 0;

                  return (
                    <div
                      key={criterion.key}
                      className="flex flex-wrap justify-between gap-2 text-sm"
                    >
                      <span className="text-slate-600 dark:text-slate-300">
                        {criterion.label}
                      </span>

                      <span className="text-yellow-500">
                        {hasRating ? (
                          <>
                            {"★".repeat(score)}
                            {"☆".repeat(5 - score)}
                            <span className="text-slate-500 ml-2">
                              {score}/5
                            </span>
                          </>
                        ) : (
                          <span className="text-slate-400">
                            Not rated
                          </span>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>

              <p className="text-slate-600 dark:text-slate-300 mt-4">
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
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-slate-900 text-white p-5 flex flex-col">
        <h1 className="text-xl font-bold mb-8">
          Faculty Portal
        </h1>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                onClick={() => {
                  setActivePage(item.name);

                  if (
                    item.name === "My Feedback" ||
                    item.name === "Feedback Analytics" ||
                    item.name === "Dashboard"
                  ) {
                    refreshFeedbacks();
                  }
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
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-6 md:p-10">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          {activePage}
        </h1>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Welcome, {user?.name || "Faculty"}!
        </p>

        {/* Dashboard */}
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

        {/* My Feedback */}
        {activePage === "My Feedback" &&
          renderFeedbackList()}

        {/* Feedback Analytics */}
        {activePage === "Feedback Analytics" && (
          <div className="mt-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <StatCard
                icon={Star}
                label="Overall Average Rating"
                value={`${averageRating}/5`}
              />

              <StatCard
                icon={MessageSquare}
                label="Total Responses"
                value={myFeedbacks.length}
              />

              <StatCard
                icon={BarChart3}
                label="Rating Criteria"
                value={ratingCriteria.length}
              />
            </div>

            <div className="mt-8 bg-white dark:bg-slate-900 p-6 rounded-xl">
              <h2 className="text-xl font-bold dark:text-white mb-5">
                Criteria-wise Rating Summary
              </h2>

              <div className="space-y-5">
                {ratingCriteria.map((criterion) => {
                  const average = Number(
                    getCriterionAverage(criterion.key)
                  );

                  return (
                    <div key={criterion.key}>
                      <div className="flex justify-between gap-3 mb-2">
                        <span className="font-medium dark:text-white">
                          {criterion.label}
                        </span>

                        <span className="text-yellow-500 font-semibold">
                          {average.toFixed(1)}/5
                        </span>
                      </div>

                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{
                            width: `${(average / 5) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 bg-white dark:bg-slate-900 p-6 rounded-xl">
              <h2 className="text-xl font-bold dark:text-white mb-5">
                Rating Distribution
              </h2>

              {ratingCriteria.map((criterion) => (
                <div
                  key={criterion.key}
                  className="mb-7"
                >
                  <h3 className="font-semibold dark:text-white mb-3">
                    {criterion.label}
                  </h3>

                  {[1, 2, 3, 4, 5].map((score) => {
                    const count = myFeedbacks.filter(
                      (item) =>
                        Number(item.ratings?.[criterion.key]) ===
                        score
                    ).length;

                    const ratedCount = myFeedbacks.filter(
                      (item) => {
                        const value =
                          item.ratings?.[criterion.key];

                        return (
                          value !== undefined &&
                          value !== null &&
                          value !== ""
                        );
                      }
                    ).length;

                    const percentage = ratedCount
                      ? (count / ratedCount) * 100
                      : 0;

                    return (
                      <div key={score} className="mb-3">
                        <div className="flex justify-between text-sm dark:text-white mb-1">
                          <span>{score} Star</span>
                          <span>{count} responses</span>
                        </div>

                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{
                              width: `${percentage}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Profile */}
        {activePage === "My Profile" && (
          <div className="mt-8 bg-white dark:bg-slate-900 p-6 rounded-xl">
            <ProfileField
              label="Name"
              value={user?.name}
            />

            <ProfileField
              label="Email"
              value={user?.email}
            />

            <ProfileField
              label="Role"
              value={user?.role}
            />
          </div>
        )}

        {/* Settings - Existing SettingsPanel */}
        {activePage === "Settings" && (
          <div className="mt-8">
            <SettingsPanel
              theme={theme}
              setTheme={setTheme}
              user={user}
              role="Faculty"
            />
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

      <h2 className="text-3xl font-bold dark:text-white mt-2">
        {value}
      </h2>
    </div>
  );
}

function ProfileField({ label, value }) {
  return (
    <div className="border-b dark:border-slate-700 py-4">
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="font-semibold dark:text-white">
        {value || "Not available"}
      </p>
    </div>
  );
}

export default FacultyDashboard;