import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  DollarSign,
  RotateCcw,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Filter,
  Activity,
  AlertCircle,
} from "lucide-react";

import StatCard from "../components/StatCard";
import RecoveryTrendChart from "../components/RecoveryTrendChart";
import FailureReasonsChart from "../components/FailureReasonsChart";
import StatusBadge from "../components/StatusBadge";
import CategoryBadge from "../components/CategoryBadge";
import Header from "../components/Header";
import WebhookSimulatorModal from "../components/WebhookSimulatorModal";

import {
  fetchDashboardStats,
  fetchRecoveryTrend,
  fetchFailureReasons,
  fetchTransactions,
} from "../services/api";
import usePageAnimation from "../hooks/usePageAnimation";
import { useToast } from "../context/ToastContext";
import { useTheme } from "../context/ThemeContext";

function Dashboard() {
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const { addToast } = useToast();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  usePageAnimation(pageRef);

  const [timeRange, setTimeRange] = useState("30d");
  const [stats, setStats] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [reasonsData, setReasonsData] = useState([]);
  const [recentTxns, setRecentTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, trendRes, reasonsRes, txnsRes] = await Promise.all([
        fetchDashboardStats(timeRange),
        fetchRecoveryTrend(timeRange),
        fetchFailureReasons(),
        fetchTransactions({ page: 1, limit: 5 }),
      ]);

      setStats(statsRes);
      setTrendData(trendRes);
      setReasonsData(reasonsRes);
      setRecentTxns(txnsRes?.transactions || []);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [timeRange]);

  return (
    <div
      className={`flex min-h-screen min-w-0 flex-1 flex-col transition-colors duration-200 ${
        isDark ? "bg-black text-white" : "bg-[#edf8ff] text-slate-900"
      }`}
    >
      <Header onOpenWebhookModal={() => setIsWebhookModalOpen(true)} search={search} setSearch={setSearch} />

      <main ref={pageRef} className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Top Header Banner */}
        <div className={`animate-section flex flex-col gap-4 rounded-2xl border p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between ${
          isDark ? "border-slate-800 bg-black" : "border-sky-100 bg-white/90"
        }`}>
          <div>
            <h1 className={`page-title mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              Payment Recovery Dashboard
            </h1>
            <p className={`page-subtitle mt-1 text-xs sm:text-sm ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}>
              Real-time monitoring of failed Razorpay charges, LLM classification & automated retry engine.
            </p>
          </div>

          {/* Time Filter Pills */}
          <div className={`flex items-center gap-1.5 rounded-xl border p-1 shadow-sm ${
            isDark ? "border-slate-800 bg-black" : "border-sky-200 bg-white"
          }`}>
            {["7d", "30d", "90d", "1y"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  timeRange === range
                    ? "bg-sky-600 text-white shadow"
                    : isDark
                    ? "text-slate-300 hover:bg-slate-800"
                    : "text-slate-600 hover:bg-sky-50"
                }`}
              >
                {range === "7d"
                  ? "Last 7 Days"
                  : range === "30d"
                  ? "Last 30 Days"
                  : range === "90d"
                  ? "Last 90 Days"
                  : "Year to Date"}
              </button>
            ))}
          </div>
        </div>

        {/* 6 Metric Stat Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <StatCard
            label="Recovery Rate"
            value={`${stats?.recoveryRate ?? 64}%`}
            trend="+14.2%"
            subtitle="Automated conversion"
            icon={TrendingUp}
          />
          <StatCard
            label="Revenue Recovered"
            value={`₹${((stats?.totalRecoveredAmount ?? 48200) / 1000).toFixed(1)}k`}
            trend="+18.5%"
            subtitle="Saved from churn"
            icon={DollarSign}
          />
          <StatCard
            label="Active Retries"
            value={stats?.retryingTransactions ?? 12}
            trend="In queue"
            subtitle="Node-cron / BullMQ"
            icon={RotateCcw}
          />
          <StatCard
            label="Churn Saved"
            value={stats?.churnSavedCount ?? 28}
            trend="+8 users"
            subtitle="Subscribers retained"
            icon={ShieldCheck}
          />
          <StatCard
            label="Total Failed"
            value={`₹${((stats?.totalFailedAmount ?? 24500) / 1000).toFixed(1)}k`}
            trend="Monitored"
            subtitle="Failed payment pool"
            icon={AlertCircle}
          />
          <StatCard
            label="Retry Attempts"
            value={stats?.totalRetryAttempts ?? 45}
            trend="Automated"
            subtitle="System retries executed"
            icon={Activity}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recovery Trend (2 Cols) */}
          <section className={`animate-section lg:col-span-2 rounded-2xl border p-5 shadow-sm ${
            isDark ? "border-slate-800 bg-black" : "border-sky-100 bg-white"
          }`}>
            <div className={`flex items-center justify-between border-b pb-4 ${
              isDark ? "border-slate-800" : "border-sky-100"
            }`}>
              <div>
                <h2 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                  Revenue Recovery Trend
                </h2>
                <p className={`text-xs ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                  Recovered Revenue vs Unrecovered Failed Amounts over time
                </p>
              </div>
              <span className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                +24% vs Last Month
              </span>
            </div>

            <div className="mt-4">
              <RecoveryTrendChart data={trendData} />
            </div>
          </section>

          {/* Failure Reasons Breakdown (1 Col) */}
          <section className={`animate-section rounded-2xl border p-5 shadow-sm ${
            isDark ? "border-slate-800 bg-black" : "border-sky-100 bg-white"
          }`}>
            <div className={`border-b pb-4 ${isDark ? "border-slate-800" : "border-sky-100"}`}>
              <h2 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                Failure Reason Categories
              </h2>
              <p className={`text-xs ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                LLM Rule-based & Fallback failure classification
              </p>
            </div>

            <div className="mt-4">
              <FailureReasonsChart data={reasonsData} />
            </div>
          </section>
        </div>

        {/* Live Recovery Activity Stream Table */}
        <section className={`animate-section rounded-2xl border p-5 shadow-sm space-y-4 ${
          isDark ? "border-slate-800 bg-black" : "border-sky-100 bg-white"
        }`}>
          <div className={`flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b pb-4 ${
            isDark ? "border-slate-800" : "border-sky-100"
          }`}>
            <div>
              <h2 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                Recent Payment Recovery Activity
              </h2>
              <p className={`text-xs ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                Latest payment failure events captured by Razorpay webhook listener
              </p>
            </div>

            <button
              onClick={() => navigate("/transactions")}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 transition"
            >
              <span>View All Transactions</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className={`border-b uppercase font-semibold ${
                isDark
                  ? "border-slate-800 bg-black text-slate-200"
                  : "border-sky-100 bg-[#f4fbff] text-slate-700"
              }`}>
                <tr>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Payment ID</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">AI Category</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? "divide-slate-800" : "divide-sky-100"}`}>
                {recentTxns
                  .filter((txn) => {
                    if (!search.trim()) return true;
                    const q = search.toLowerCase();
                    return (
                      (txn.customerName || "").toLowerCase().includes(q) ||
                      (txn.customerEmail || "").toLowerCase().includes(q) ||
                      (txn.razorpayPaymentId || "").toLowerCase().includes(q)
                    );
                  })
                  .map((txn) => (
                  <tr
                    key={txn._id}
                    onClick={() => navigate(`/transactions/${txn._id}`)}
                    className={`cursor-pointer transition ${
                      isDark ? "hover:bg-slate-900" : "hover:bg-sky-50"
                    }`}
                  >
                    <td className="px-4 py-3.5">
                      <p className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{txn.customerName}</p>
                      <p className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>{txn.customerEmail}</p>
                    </td>
                    <td className={`px-4 py-3.5 font-mono ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                      {txn.razorpayPaymentId}
                    </td>
                    <td className={`px-4 py-3.5 font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                      ₹{txn.amount}
                    </td>
                    <td className="px-4 py-3.5">
                      <CategoryBadge category={txn.category} />
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={txn.status} />
                    </td>
                    <td className="px-4 py-3.5 text-right font-bold text-amber-600 hover:underline">
                      Inspect →
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <WebhookSimulatorModal
        isOpen={isWebhookModalOpen}
        onClose={() => setIsWebhookModalOpen(false)}
        onWebhookTriggered={loadData}
      />
    </div>
  );
}

export default Dashboard;