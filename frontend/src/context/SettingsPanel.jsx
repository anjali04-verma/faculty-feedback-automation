import { useEffect, useState } from "react";
import {
  Sun, Moon, Monitor, Bell, ShieldCheck,
  User, Globe, Info
} from "lucide-react";

export default function SettingsPanel({ theme, setTheme, user, role }) {
  const storageKey = `settings_${role || "user"}`;

  const [preferences, setPreferences] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || {
        emailNotifications: true,
        feedbackReminders: true,
        anonymousFeedback: false,
        language: "English"
      };
    } catch {
      return {
        emailNotifications: true,
        feedbackReminders: true,
        anonymousFeedback: false,
        language: "English"
      };
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(preferences));
  }, [preferences, storageKey]);

  const updatePreference = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const Section = ({ icon: Icon, title, children }) => (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow p-6 mb-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/40">
          <Icon className="text-blue-600" size={22} />
        </div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );

  const Toggle = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="font-medium text-slate-800 dark:text-white">
          {label}
        </p>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="w-5 h-5 accent-blue-600 cursor-pointer"
      />
    </div>
  );

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
        Settings
      </h1>
      <p className="text-slate-500 mb-8">
        Manage your account preferences and dashboard settings.
      </p>

      {/* Account Information */}
      <Section icon={User} title="Account Information">
        <div className="space-y-3">
          <p className="text-slate-600 dark:text-slate-300">
            <strong>Name:</strong> {user?.name || "Not available"}
          </p>
          <p className="text-slate-600 dark:text-slate-300">
            <strong>Email:</strong> {user?.email || "Not available"}
          </p>
          <p className="text-slate-600 dark:text-slate-300">
            <strong>Role:</strong> {role || user?.role || "User"}
          </p>
        </div>
      </Section>

      {/* Appearance */}
      <Section icon={Sun} title="Appearance">
        <p className="text-sm text-slate-500 mb-4">
          Choose your preferred dashboard theme.
        </p>

        <div className="grid sm:grid-cols-3 gap-3">
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
                className={`border rounded-xl p-4 flex flex-col items-center gap-2
                  dark:text-white ${
                    theme === item.value
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30"
                      : "border-slate-200 dark:border-slate-700"
                  }`}
              >
                <Icon size={25} className="text-blue-600" />
                <span>{item.label}</span>
                {theme === item.value && (
                  <span className="text-xs text-blue-600">Selected</span>
                )}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Notifications */}
      <Section icon={Bell} title="Notification Preferences">
        <Toggle
          label="Email Notifications"
          description="Preference for receiving email updates."
          checked={preferences.emailNotifications}
          onChange={value =>
            updatePreference("emailNotifications", value)
          }
        />

        <Toggle
          label="Feedback Reminders"
          description="Preference for feedback reminder notifications."
          checked={preferences.feedbackReminders}
          onChange={value =>
            updatePreference("feedbackReminders", value)
          }
        />
      </Section>

      {/* Privacy */}
      <Section icon={ShieldCheck} title="Privacy Settings">
        <Toggle
          label="Anonymous Feedback by Default"
          description="Save anonymity as your preferred feedback option."
          checked={preferences.anonymousFeedback}
          onChange={value =>
            updatePreference("anonymousFeedback", value)
          }
        />
        <p className="text-xs text-slate-500 mt-2">
          This saves your preference. It must also be connected to the
          feedback submission form to change submitted feedback behavior.
        </p>
      </Section>

      {/* Language */}
      <Section icon={Globe} title="Language Settings">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Select Language
        </label>

        <select
          value={preferences.language}
          onChange={e => updatePreference("language", e.target.value)}
          className="w-full border border-slate-300 dark:border-slate-700 rounded-lg p-3 bg-white dark:bg-slate-800 dark:text-white"
        >
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
        </select>

        <p className="text-xs text-slate-500 mt-2">
          Language preference is saved. Full dashboard translation
          requires connecting this setting to the app's text labels.
        </p>
      </Section>

      {/* About */}
      <Section icon={Info} title="About Application">
        <p className="font-semibold text-slate-800 dark:text-white">
          Faculty Feedback Automation System
        </p>
        <p className="text-sm text-slate-500 mt-2">
          Version 1.0.0
        </p>
        <p className="text-sm text-slate-500">
          ABES Engineering College
        </p>
      </Section>
    </div>
  );
}