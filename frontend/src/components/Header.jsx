import { useState } from "react";
import {
  Bell,
  Search,
  Zap,
  LogOut,
  ShieldCheck,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useTheme } from "../context/ThemeContext";

function Header({ onOpenWebhookModal, search, setSearch }) {
  const { user, logout, toggleRazorpayOAuth } = useAuth();
  const { addToast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      title: "Payment Recovered",
      desc: "₹14,600 recovered via auto-retry for HDFC bank timeout.",
      time: "10 mins ago",
    },
    {
      id: 2,
      title: "LLM Classification Complete",
      desc: "Tagged 4 payment failures with 96% AI confidence.",
      time: "1 hour ago",
    },
    {
      id: 3,
      title: "Razorpay Webhook Fired",
      desc: "Captured payment.failed payload (pay_N1x89a).",
      time: "2 hours ago",
    },
  ];

  return (
    <header className={`sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b px-4 sm:px-6 lg:px-8 backdrop-blur-md transition-colors duration-200 ${
      isDark ? "border-[#12395b] bg-[#06233d]" : "border-sky-100 bg-white/90"
    }`}>
      {/* Search Input */}
      <div className="flex flex-1 items-center max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-700" />
          <input
            type="text"
            placeholder="Search payment ID, customer name, email..."
            value={search || ""}
            onChange={(e) => setSearch && setSearch(e.target.value)}
            className={`w-full rounded-xl border py-2 pl-9 pr-4 text-xs sm:text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200 ${
              isDark
                ? "border-[#17476e] bg-[#041a2e] text-white placeholder:text-slate-400 focus:bg-[#041a2e]"
                : "border-sky-200 bg-[#f4fbff] text-sky-950 focus:bg-white"
            }`}
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Webhook Simulator Button */}
        <button
          onClick={onOpenWebhookModal}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-3 py-2 text-xs font-semibold text-white shadow-md transition hover:from-amber-600 hover:to-orange-700 active:scale-95 sm:px-4"
        >
          <Zap className="h-4 w-4 fill-white animate-pulse" />
          <span className="hidden sm:inline">Webhook Simulator</span>
        </button>

        {/* Razorpay Status Indicator */}
        <div
          onClick={() => {
            toggleRazorpayOAuth();
            addToast(
              user?.razorpayConnected
                ? "Razorpay Live Webhook Paused"
                : "Razorpay OAuth Live Webhook Connected!",
              user?.razorpayConnected ? "info" : "success"
            );
          }}
          title="Click to toggle Razorpay connection state"
          className={`hidden md:flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-medium transition ${
            user?.razorpayConnected
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-100"
              : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/60 dark:text-amber-300 hover:bg-amber-100"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              user?.razorpayConnected ? "bg-emerald-500 animate-ping" : "bg-amber-500"
            }`}
          />
          <span>{user?.razorpayConnected ? "Razorpay Connected" : "Connect Razorpay"}</span>
        </div>

        {/* TOP RIGHT MODE SWITCHING BUTTON (Day / Dark Mode) */}
        <button
          onClick={() => {
            toggleTheme();
            addToast(
              theme === "dark" ? "Switched to Day Mode ☀️" : "Switched to Dark Mode 🌙",
              "info"
            );
          }}
          className={`flex h-9 w-9 items-center justify-center rounded-xl border transition active:scale-95 ${
            isDark
              ? "border-[#17476e] bg-[#06233d] text-slate-200 hover:bg-[#0b3152]"
              : "border-sky-200 bg-[#edfaff] text-sky-700 hover:bg-sky-100"
          }`}
          title={theme === "dark" ? "Switch to Day Mode" : "Switch to Dark Mode"}
          aria-label="Toggle Mode"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-sky-700" />
          )}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className={`relative rounded-xl border p-2 transition ${
              isDark
                ? "border-[#17476e] text-slate-200 hover:bg-[#0b3152]"
                : "border-sky-100 text-slate-600 hover:bg-sky-50"
            }`}
          >
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-950" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-2xl z-50">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Recovery Alerts
                </h3>
                <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                  Live
                </span>
              </div>
              <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.map((n) => (
                  <div key={n.id} className="py-2.5 text-xs">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{n.title}</p>
                    <p className="mt-0.5 text-slate-500 dark:text-slate-400">{n.desc}</p>
                    <span className="mt-1 block text-[10px] text-slate-400 dark:text-slate-500">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className={`flex items-center gap-2 rounded-xl border p-1.5 transition ${
              isDark ? "border-[#17476e] hover:bg-[#0b3152]" : "border-sky-100 hover:bg-sky-50"
            }`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-600 text-xs font-bold text-white">
              {user?.name?.[0] || "M"}
            </div>
          </button>

          {/* Profile Menu Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-2xl z-50">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">{user?.name || "Merchant"}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:text-slate-300">
                  <ShieldCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  {user?.company || "Reviva SaaS"}
                </span>
              </div>

              <div className="mt-3 space-y-1 text-xs">
                <button
                  onClick={() => {
                    toggleRazorpayOAuth();
                    setShowProfileMenu(false);
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <span>Razorpay Integration</span>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    {user?.razorpayConnected ? "Active" : "Disabled"}
                  </span>
                </button>

                <button
                  onClick={logout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
