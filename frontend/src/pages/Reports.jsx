
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ClipboardList, Star, Users, MessageSquare } from "lucide-react";

function Reports() {
  const feedbacks = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("feedbacks") || "[]");
    } catch {
      return [];
    }
  }, []);

  const total = feedbacks.length;

  const allRatings = feedbacks.flatMap(item =>
    Object.values(item.ratings || {}).map(Number)
  );

  const average = allRatings.length
    ? (allRatings.reduce((sum, value) => sum + value, 0) / allRatings.length).toFixed(2)
    : "0.00";

  const questionLabels = {
    teaching: "Teaching",
    communication: "Communication",
    punctuality: "Punctuality",
    knowledge: "Subject Knowledge",
    interaction: "Interaction"
  };

  const chartData = Object.keys(questionLabels).map(key => {
    const values = feedbacks
      .map(item => Number(item.ratings?.[key]))
      .filter(value => value > 0);

    const avg = values.length
      ? values.reduce((sum, value) => sum + value, 0) / values.length
      : 0;

    return {
      question: questionLabels[key],
      rating: Number(avg.toFixed(2))
    };
  });

  const facultySummary = Object.values(
    feedbacks.reduce((acc, item) => {
      if (!acc[item.faculty]) {
        acc[item.faculty] = { faculty: item.faculty, count: 0, total: 0 };
      }

      const ratings = Object.values(item.ratings || {}).map(Number);
      const itemAverage = ratings.length
        ? ratings.reduce((sum, value) => sum + value, 0) / ratings.length
        : 0;

      acc[item.faculty].count++;
      acc[item.faculty].total += itemAverage;

      return acc;
    }, {})
  ).map(item => ({
    ...item,
    average: (item.total / item.count).toFixed(2)
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          Reports & Analytics
        </h1>
        <p className="text-slate-500 mt-2">
          Analyze student feedback and faculty ratings.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard icon={ClipboardList} value={total} label="Total Submissions" />
        <StatCard icon={Star} value={`${average}/5`} label="Average Rating" />
        <StatCard icon={Users} value={facultySummary.length} label="Faculty Reviewed" />
        <StatCard icon={MessageSquare} value={feedbacks.filter(item => item.comments?.trim()).length} label="Written Comments" />
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow">
        <h2 className="text-xl font-bold dark:text-white mb-6">
          Average Rating by Category
        </h2>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="question" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Bar dataKey="rating" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow">
        <h2 className="text-xl font-bold dark:text-white mb-5">
          Faculty-wise Performance
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b dark:border-slate-700 text-slate-500">
                <th className="p-3">Faculty Name</th>
                <th className="p-3">Submissions</th>
                <th className="p-3">Average Rating</th>
              </tr>
            </thead>
            <tbody>
              {facultySummary.map(item => (
                <tr key={item.faculty} className="border-b dark:border-slate-700 dark:text-white">
                  <td className="p-3 font-medium">{item.faculty}</td>
                  <td className="p-3">{item.count}</td>
                  <td className="p-3 text-yellow-500">★ {item.average}/5</td>
                </tr>
              ))}

              {facultySummary.length === 0 && (
                <tr>
                  <td colSpan="3" className="p-5 text-center text-slate-500">
                    No feedback data available yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow">
      <Icon className="text-blue-600 mb-4" size={30} />
      <h2 className="text-3xl font-bold dark:text-white">{value}</h2>
      <p className="text-slate-500 mt-1">{label}</p>
    </div>
  );
}

export default Reports;
