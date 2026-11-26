
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Send, ArrowLeft } from "lucide-react";

function FeedbackForm() {
  const navigate = useNavigate();

  const [faculty, setFaculty] = useState("");
  const [ratings, setRatings] = useState({
    teaching: 0,
    communication: 0,
    punctuality: 0,
    knowledge: 0,
    interaction: 0
  });
  const [comments, setComments] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [success, setSuccess] = useState(false);

  const questions = [
    { key: "teaching", label: "How well does the faculty explain concepts?" },
    { key: "communication", label: "How effective is the faculty's communication?" },
    { key: "punctuality", label: "How punctual is the faculty?" },
    { key: "knowledge", label: "How strong is the faculty's subject knowledge?" },
    { key: "interaction", label: "How well does the faculty interact with students?" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (Object.values(ratings).some(value => value === 0)) {
      alert("Please rate all questions.");
      return;
    }

    const feedback = {
      id: Date.now(),
      faculty,
      ratings,
      comments,
      anonymous,
      date: new Date().toLocaleDateString()
    };

    const existing = JSON.parse(localStorage.getItem("feedbacks") || "[]");
    localStorage.setItem("feedbacks", JSON.stringify([...existing, feedback]));

    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 p-5">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-5xl text-green-600 mb-4">✓</div>
          <h2 className="text-2xl font-bold dark:text-white">Feedback Submitted!</h2>
          <p className="text-slate-500 mt-3">Thank you for sharing your feedback.</p>
          <button
            onClick={() => navigate("/student")}
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 p-5 md:p-10">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate("/student")} className="flex gap-2 items-center text-blue-600 mb-6">
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 md:p-8">
          <h1 className="text-3xl font-bold dark:text-white">Faculty Feedback Form</h1>
          <p className="text-slate-500 mt-2 mb-8">Please provide honest feedback about your faculty.</p>

          <form onSubmit={handleSubmit} className="space-y-7">
            <div>
              <label className="block font-semibold dark:text-white mb-2">Select Faculty</label>
              <select
                required
                value={faculty}
                onChange={e => setFaculty(e.target.value)}
                className="w-full border rounded-lg p-3 dark:bg-slate-800 dark:text-white dark:border-slate-700"
              >
                <option value="">Choose Faculty</option>
                <option>Dr. Amit Sharma</option>
                <option>Prof. Neha Singh</option>
                <option>Dr. Rahul Verma</option>
              </select>
            </div>

            {questions.map(question => (
              <div key={question.key}>
                <p className="font-semibold dark:text-white mb-3">{question.label}</p>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(value => (
                    <button
                      type="button"
                      key={value}
                      onClick={() => setRatings(prev => ({ ...prev, [question.key]: value }))}
                      aria-label={`Rate ${value} out of 5`}
                      className={value <= ratings[question.key] ? "text-yellow-500" : "text-slate-300"}
                    >
                      <Star size={30} fill={value <= ratings[question.key] ? "currentColor" : "none"} />
                    </button>
                  ))}
                  <span className="text-sm text-slate-500 ml-2">
                    {ratings[question.key]}/5
                  </span>
                </div>
              </div>
            ))}

            <div>
              <label className="block font-semibold dark:text-white mb-2">Comments and Suggestions</label>
              <textarea
                value={comments}
                onChange={e => setComments(e.target.value)}
                rows="4"
                placeholder="Write your suggestions here..."
                className="w-full border rounded-lg p-3 dark:bg-slate-800 dark:text-white dark:border-slate-700"
              />
            </div>

            <label className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={e => setAnonymous(e.target.checked)}
              />
              Submit feedback anonymously
            </label>

            <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
              <Send size={18} /> Submit Feedback
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FeedbackForm;
