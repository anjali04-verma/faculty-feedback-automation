import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, GraduationCap, ClipboardList,
  ChartColumn, Settings, LogOut, UserPlus, Search,
  Trash2, User, X
} from "lucide-react";

import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import SettingsPanel from "../context/SettingsPanel";

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const [activePage, setActivePage] = useState("Dashboard");

  const [students, setStudents] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("adminStudents")) || [
        { id: 1, name: "Rahul Kumar", email: "rahul@gmail.com", branch: "CSE" },
        { id: 2, name: "Priya Sharma", email: "priya@gmail.com", branch: "IT" }
      ];
    } catch {
      return [];
    }
  });

  const [faculty, setFaculty] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("adminFaculty")) || [
        { id: 1, name: "Dr. Amit Sharma", email: "amit@abes.ac.in", department: "CSE" },
        { id: 2, name: "Prof. Neha Singh", email: "neha@abes.ac.in", department: "IT" },
        { id: 3, name: "Dr. Rahul Verma", email: "rahul.verma@abes.ac.in", department: "CSE" }
      ];
    } catch {
      return [];
    }
  });

  const [feedbacks, setFeedbacks] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState("student");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: ""
  });

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Manage Students", icon: Users },
    { name: "Manage Faculty", icon: GraduationCap },
    { name: "Feedback Management", icon: ClipboardList },
    { name: "Reports & Analytics", icon: ChartColumn },
    { name: "My Profile", icon: User },
    { name: "Settings", icon: Settings }
  ];

  useEffect(() => {
    localStorage.setItem("adminStudents", JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem("adminFaculty", JSON.stringify(faculty));
  }, [faculty]);

  const loadFeedbacks = () => {
    try {
      const data = JSON.parse(localStorage.getItem("feedbacks") || "[]");
      setFeedbacks(Array.isArray(data) ? data : []);
    } catch {
      setFeedbacks([]);
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const openAddForm = (type) => {
    setFormType(type);
    setFormData({ name: "", email: "", department: "" });
    setShowForm(true);
  };

  const saveRecord = (e) => {
    e.preventDefault();

    const newRecord = {
      id: Date.now(),
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      ...(formType === "student"
        ? { branch: formData.department }
        : { department: formData.department })
    };

    if (formType === "student") {
      setStudents(prev => [...prev, newRecord]);
    } else {
      setFaculty(prev => [...prev, newRecord]);
    }

    setShowForm(false);
    alert(`${formType === "student" ? "Student" : "Faculty"} added successfully!`);
  };

  const deleteRecord = (id, type) => {
    if (!window.confirm("Are you sure you want to delete this record?")) {
      return;
    }

    if (type === "student") {
      setStudents(prev => prev.filter(item => item.id !== id));
    } else {
      setFaculty(prev => prev.filter(item => item.id !== id));
    }
  };

  const renderDashboard = () => (
    <>
      <h1 className="text-3xl font-bold dark:text-white">
        Admin Dashboard
      </h1>

      <p className="text-slate-500 mt-2 mb-8">
        Welcome back, {user?.name || "Admin"}! Manage your feedback system.
      </p>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard icon={Users} value={students.length} label="Total Students" />
        <StatCard icon={GraduationCap} value={faculty.length} label="Total Faculty" />
        <StatCard icon={ClipboardList} value={feedbacks.length} label="Total Feedback" />
        <StatCard icon={ChartColumn} value={feedbacks.length} label="Received Responses" />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow p-7 mt-8">
        <h2 className="text-xl font-bold dark:text-white mb-3">
          Recent Feedback
        </h2>

        {feedbacks.length === 0 ? (
          <p className="text-slate-500">No feedback submitted yet.</p>
        ) : (
          feedbacks.slice(-5).reverse().map(item => (
            <div key={item.id} className="border-b dark:border-slate-700 py-3">
              <p className="font-semibold dark:text-white">{item.faculty}</p>
              <p className="text-sm text-slate-500">
                {item.anonymous ? "Anonymous" : item.studentName} · {item.date}
              </p>
            </div>
          ))
        )}
      </div>
    </>
  );

  const renderPeople = (type) => {
    const isStudent = type === "student";
    const records = isStudent ? students : faculty;

    const filtered = records.filter(item =>
      `${item.name} ${item.email} ${isStudent ? item.branch : item.department}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    return (
      <>
        <div className="flex flex-wrap justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold dark:text-white">
              {isStudent ? "Manage Students" : "Manage Faculty"}
            </h1>
            <p className="text-slate-500 mt-2">
              Add, search and manage records.
            </p>
          </div>

          <button
            onClick={() => openAddForm(type)}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg"
          >
            <UserPlus size={19} />
            Add {isStudent ? "Student" : "Faculty"}
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow">
          <div className="flex items-center gap-3 border dark:border-slate-700 rounded-lg px-4 mb-5">
            <Search size={19} className="text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email or department..."
              className="w-full p-3 outline-none bg-transparent dark:text-white"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b dark:border-slate-700 text-slate-500">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">
                    {isStudent ? "Branch" : "Department"}
                  </th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map(item => (
                  <tr
                    key={item.id}
                    className="border-b dark:border-slate-700 dark:text-white"
                  >
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">{item.email}</td>
                    <td className="p-3">
                      {isStudent ? item.branch : item.department}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => deleteRecord(item.id, type)}
                        className="text-red-500"
                      >
                        <Trash2 size={19} />
                      </button>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-5 text-center text-slate-500">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  const renderFeedbackManagement = () => (
    <>
      <div className="flex flex-wrap justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">
            Feedback Management
          </h1>
          <p className="text-slate-500 mt-2">
            View all student feedback submissions.
          </p>
        </div>

        <button
          onClick={loadFeedbacks}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          Refresh Feedback
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold dark:text-white mb-5">
          All Submitted Feedback ({feedbacks.length})
        </h2>

        {feedbacks.length === 0 ? (
          <p className="text-slate-500">No feedback submitted yet.</p>
        ) : (
          <div className="space-y-5">
            {[...feedbacks].reverse().map(item => (
              <div key={item.id} className="border-b dark:border-slate-700 pb-5">
                <h3 className="font-bold dark:text-white">
                  Faculty: {item.faculty}
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Student: {item.anonymous ? "Anonymous" : item.studentName || "Student"}
                </p>

                <p className="text-sm text-slate-500">Date: {item.date}</p>

                <div className="mt-3 dark:text-white">
                  {Object.entries(item.ratings || {}).map(([key, value]) => (
                    <p key={key}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}: {value}/5
                    </p>
                  ))}
                </div>

                <p className="mt-3 dark:text-white">
                  Comments: {item.comments || "No comments"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );

  const renderReports = () => {
    const average = feedbacks.length
      ? (
          feedbacks.reduce(
            (total, item) =>
              total + Number(item.ratings?.teaching || 0),
            0
          ) / feedbacks.length
        ).toFixed(1)
      : "0.0";

    const facultySummary = faculty.map(person => {
      const received = feedbacks.filter(
        item =>
          item.faculty?.trim().toLowerCase() ===
          person.name.trim().toLowerCase()
      );

      const avg = received.length
        ? (
            received.reduce(
              (total, item) =>
                total + Number(item.ratings?.teaching || 0),
              0
            ) / received.length
          ).toFixed(1)
        : "0.0";

      return { ...person, count: received.length, average: avg };
    });

    return (
      <>
        <h1 className="text-3xl font-bold dark:text-white mb-6">
          Reports & Analytics
        </h1>

        <div className="grid md:grid-cols-3 gap-5">
          <StatCard icon={ClipboardList} value={feedbacks.length} label="Total Feedback" />
          <StatCard icon={Users} value={students.length} label="Registered Students" />
          <StatCard icon={ChartColumn} value={`${average}/5`} label="Overall Average Rating" />
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow p-6 mt-8">
          <h2 className="text-xl font-bold dark:text-white mb-5">
            Faculty-wise Feedback Summary
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b dark:border-slate-700 text-slate-500">
                  <th className="p-3">Faculty</th>
                  <th className="p-3">Feedback Received</th>
                  <th className="p-3">Average Rating</th>
                </tr>
              </thead>

              <tbody>
                {facultySummary.map(item => (
                  <tr
                    key={item.id}
                    className="border-b dark:border-slate-700 dark:text-white"
                  >
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">{item.count}</td>
                    <td className="p-3">{item.average}/5</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  const renderProfile = () => (
    <>
      <h1 className="text-3xl font-bold dark:text-white mb-6">
        My Profile
      </h1>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow p-8 max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
            <User size={40} className="text-blue-600" />
          </div>

          <div>
            <h2 className="text-2xl font-bold dark:text-white">
              {user?.name || "Admin"}
            </h2>
            <p className="text-blue-600">Administrator</p>
          </div>
        </div>

        <ProfileField label="Full Name" value={user?.name || "Admin"} />
        <ProfileField label="Email Address" value={user?.email || "admin@gmail.com"} />
        <ProfileField label="Account Role" value="Admin" />
      </div>
    </>
  );

  // Updated Settings Panel
  const renderSettings = () => (
    <div className="mt-8">
      <SettingsPanel
        theme={theme}
        setTheme={setTheme}
        user={user}
        role="Admin"
      />
    </div>
  );

  const renderContent = () => {
    switch (activePage) {
      case "Dashboard":
        return renderDashboard();
      case "Manage Students":
        return renderPeople("student");
      case "Manage Faculty":
        return renderPeople("faculty");
      case "Feedback Management":
        return renderFeedbackManagement();
      case "Reports & Analytics":
        return renderReports();
      case "My Profile":
        return renderProfile();
      case "Settings":
        return renderSettings();
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
                onClick={() => {
                  setActivePage(item.name);
                  setSearch("");

                  if (
                    item.name === "Feedback Management" ||
                    item.name === "Reports & Analytics"
                  ) {
                    loadFeedbacks();
                  }
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg ${
                  activePage === item.name
                    ? "bg-blue-600 text-white"
                    : "hover:bg-slate-800 text-slate-200"
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
          className="w-full flex items-center gap-3 p-3 mt-auto rounded-lg hover:bg-red-600 text-slate-200"
        >
          <LogOut size={20} /> Logout
        </button>
      </aside>

      <main className="flex-1 min-w-0 p-6 md:p-9">
        {renderContent()}
      </main>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <form
            onSubmit={saveRecord}
            className="bg-white dark:bg-slate-900 p-7 rounded-2xl shadow-xl w-full max-w-md space-y-4"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold dark:text-white">
                Add {formType === "student" ? "Student" : "Faculty"}
              </h2>

              <button type="button" onClick={() => setShowForm(false)}>
                <X className="dark:text-white" />
              </button>
            </div>

            <input
              required
              placeholder="Full Name"
              value={formData.name}
              onChange={e =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border rounded-lg p-3 dark:bg-slate-800 dark:text-white"
            />

            <input
              required
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={e =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full border rounded-lg p-3 dark:bg-slate-800 dark:text-white"
            />

            <input
              required
              placeholder={
                formType === "student"
                  ? "Branch (e.g. CSE)"
                  : "Department"
              }
              value={formData.department}
              onChange={e =>
                setFormData({ ...formData, department: e.target.value })
              }
              className="w-full border rounded-lg p-3 dark:bg-slate-800 dark:text-white"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg"
            >
              Save Record
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-md">
      <Icon className="text-blue-600 mb-4" size={32} />

      <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
        {value}
      </h2>

      <p className="text-slate-500 mt-1">{label}</p>
    </div>
  );
}

function ProfileField({ label, value }) {
  return (
    <div className="border-b border-slate-200 dark:border-slate-700 py-4">
      <p className="text-sm text-slate-500 mb-1">{label}</p>

      <p className="font-semibold text-slate-800 dark:text-white">
        {value || "Not available"}
      </p>
    </div>
  );
}

export default AdminDashboard;