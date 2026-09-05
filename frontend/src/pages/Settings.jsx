import { useRef, useState } from "react";
import {
  Bell,
  Check,
  ChevronDown,
  CreditCard,
  Mail,
  RotateCcw,
  Save,
  Settings as SettingsIcon,
  ShieldCheck,
  User,
} from "lucide-react";

import usePageAnimation from "../hooks/usePageAnimation";

function Settings() {
  const pageRef = useRef(null);

  usePageAnimation(pageRef);

  const [companyName, setCompanyName] = useState("Reviva");
  const [email, setEmail] = useState("admin@reviva.com");

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [recoveryNotifications, setRecoveryNotifications] = useState(true);
  const [failedPaymentNotifications, setFailedPaymentNotifications] =
    useState(false);

  const [maxRetries, setMaxRetries] = useState("3");
  const [retryInterval, setRetryInterval] = useState("24");

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const handleReset = () => {
    setCompanyName("Reviva");
    setEmail("admin@reviva.com");

    setEmailNotifications(true);
    setRecoveryNotifications(true);
    setFailedPaymentNotifications(false);

    setMaxRetries("3");
    setRetryInterval("24");
  };

  return (
    <main
      ref={pageRef}
      className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8"
    >
      <div className="mx-auto max-w-5xl">
        {/* Page Heading */}

        <div className="animate-section">
          <p className="text-xs font-medium tracking-wide text-zinc-500 sm:text-sm">
            APPLICATION
          </p>

          <h1 className="page-title mt-2 flex items-center gap-3 text-2xl font-semibold text-[#1F1F1C] sm:text-3xl">
            <SettingsIcon
              size={28}
              className="hidden sm:block"
            />

            Settings
          </h1>

          <p className="page-subtitle mt-2 text-sm text-zinc-600">
            Manage your recovery preferences and application settings.
          </p>
        </div>

        {/* Success Message */}

        {saved && (
          <div className="animate-card mt-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100">
              <Check size={17} />
            </div>

            <div>
              <p className="font-medium">
                Settings saved successfully
              </p>

              <p className="mt-0.5 text-xs text-green-600">
                Your preferences have been updated.
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 space-y-6">
          {/* Account Settings */}

          <section className="animate-section rounded-xl border border-[#DDD8CF] bg-white p-4 sm:p-6">
            <div className="flex items-start gap-3 border-b border-[#EEEAE3] pb-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F3F0E9] text-[#1F1F1C]">
                <User size={20} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-[#1F1F1C]">
                  Account Settings
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Manage your basic account information.
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="animate-card">
                <label className="text-sm font-medium text-[#1F1F1C]">
                  Company Name
                </label>

                <input
                  type="text"
                  value={companyName}
                  onChange={(e) =>
                    setCompanyName(e.target.value)
                  }
                  className="mt-2 w-full rounded-lg border border-[#DDD8CF] bg-white px-3 py-2.5 text-sm text-[#1F1F1C] outline-none transition focus:border-[#C66A2B] focus:ring-2 focus:ring-[#C66A2B]/10"
                />
              </div>

              <div className="animate-card">
                <label className="text-sm font-medium text-[#1F1F1C]">
                  Recovery Email
                </label>

                <div className="relative mt-2">
                  <Mail
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    className="w-full rounded-lg border border-[#DDD8CF] bg-white py-2.5 pl-10 pr-3 text-sm text-[#1F1F1C] outline-none transition focus:border-[#C66A2B] focus:ring-2 focus:ring-[#C66A2B]/10"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Recovery Settings */}

          <section className="animate-section rounded-xl border border-[#DDD8CF] bg-white p-4 sm:p-6">
            <div className="flex items-start gap-3 border-b border-[#EEEAE3] pb-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F3F0E9] text-[#1F1F1C]">
                <CreditCard size={20} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-[#1F1F1C]">
                  Recovery Settings
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Configure how failed payments should be retried.
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Max Retries */}

              <div className="animate-card">
                <label className="text-sm font-medium text-[#1F1F1C]">
                  Maximum Retry Attempts
                </label>

                <div className="relative mt-2">
                  <select
                    value={maxRetries}
                    onChange={(e) =>
                      setMaxRetries(e.target.value)
                    }
                    className="w-full appearance-none rounded-lg border border-[#DDD8CF] bg-white px-3 py-2.5 pr-10 text-sm text-[#1F1F1C] outline-none transition focus:border-[#C66A2B] focus:ring-2 focus:ring-[#C66A2B]/10"
                  >
                    <option value="1">1 attempt</option>
                    <option value="2">2 attempts</option>
                    <option value="3">3 attempts</option>
                    <option value="4">4 attempts</option>
                    <option value="5">5 attempts</option>
                  </select>

                  <ChevronDown
                    size={17}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
                  />
                </div>

                <p className="mt-2 text-xs text-zinc-500">
                  Maximum number of times a failed payment can be retried.
                </p>
              </div>

              {/* Retry Interval */}

              <div className="animate-card">
                <label className="text-sm font-medium text-[#1F1F1C]">
                  Retry Interval
                </label>

                <div className="relative mt-2">
                  <select
                    value={retryInterval}
                    onChange={(e) =>
                      setRetryInterval(e.target.value)
                    }
                    className="w-full appearance-none rounded-lg border border-[#DDD8CF] bg-white px-3 py-2.5 pr-10 text-sm text-[#1F1F1C] outline-none transition focus:border-[#C66A2B] focus:ring-2 focus:ring-[#C66A2B]/10"
                  >
                    <option value="1">1 hour</option>
                    <option value="6">6 hours</option>
                    <option value="12">12 hours</option>
                    <option value="24">24 hours</option>
                    <option value="48">48 hours</option>
                  </select>

                  <ChevronDown
                    size={17}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
                  />
                </div>

                <p className="mt-2 text-xs text-zinc-500">
                  Time to wait before scheduling the next retry.
                </p>
              </div>
            </div>
          </section>

          {/* Notifications */}

          <section className="animate-section rounded-xl border border-[#DDD8CF] bg-white p-4 sm:p-6">
            <div className="flex items-start gap-3 border-b border-[#EEEAE3] pb-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F3F0E9] text-[#1F1F1C]">
                <Bell size={20} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-[#1F1F1C]">
                  Notifications
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Choose which recovery updates you want to receive.
                </p>
              </div>
            </div>

            <div className="mt-2 divide-y divide-[#EEEAE3]">
              {/* Email Notifications */}

              <div className="animate-card flex items-center justify-between gap-4 py-5">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#1F1F1C]">
                    Email Notifications
                  </p>

                  <p className="mt-1 text-xs leading-5 text-zinc-500 sm:text-sm">
                    Receive important payment recovery updates by email.
                  </p>
                </div>

                <Toggle
                  enabled={emailNotifications}
                  setEnabled={setEmailNotifications}
                />
              </div>

              {/* Recovery Notifications */}

              <div className="animate-card flex items-center justify-between gap-4 py-5">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#1F1F1C]">
                    Successful Recovery Alerts
                  </p>

                  <p className="mt-1 text-xs leading-5 text-zinc-500 sm:text-sm">
                    Get notified when a previously failed payment is recovered.
                  </p>
                </div>

                <Toggle
                  enabled={recoveryNotifications}
                  setEnabled={setRecoveryNotifications}
                />
              </div>

              {/* Failed Payment Notifications */}

              <div className="animate-card flex items-center justify-between gap-4 py-5">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#1F1F1C]">
                    Failed Payment Alerts
                  </p>

                  <p className="mt-1 text-xs leading-5 text-zinc-500 sm:text-sm">
                    Receive an alert whenever a new payment failure occurs.
                  </p>
                </div>

                <Toggle
                  enabled={failedPaymentNotifications}
                  setEnabled={setFailedPaymentNotifications}
                />
              </div>
            </div>
          </section>

          {/* Security Info */}

          <section className="animate-section rounded-xl border border-[#DDD8CF] bg-[#FAF9F6] p-4 sm:p-6">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#1F1F1C]">
                <ShieldCheck size={20} />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-[#1F1F1C]">
                  Your data is protected
                </h2>

                <p className="mt-1 text-sm leading-6 text-zinc-600">
                  Payment recovery preferences are currently stored locally
                  for the frontend MVP. Backend persistence can be connected
                  in the next phase.
                </p>
              </div>
            </div>
          </section>

          {/* Action Buttons */}

          <div className="animate-section flex flex-col-reverse gap-3 border-t border-[#DDD8CF] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#DDD8CF] bg-white px-4 py-2.5 text-sm font-medium text-[#1F1F1C] transition hover:bg-[#FAF9F6]"
            >
              <RotateCcw size={16} />

              Reset Changes
            </button>

            <button
              onClick={handleSave}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1F1F1C] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            >
              <Save size={16} />

              Save Settings
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ---------------- TOGGLE COMPONENT ---------------- */

function Toggle({ enabled, setEnabled }) {
  return (
    <button
      type="button"
      onClick={() => setEnabled(!enabled)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition ${
        enabled
          ? "bg-[#1F1F1C]"
          : "bg-zinc-300"
      }`}
      aria-label="Toggle setting"
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
          enabled
            ? "translate-x-6"
            : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default Settings;