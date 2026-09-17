import { useState, useRef } from "react";
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  DollarSign,
  Download,
  Filter,
  Layers,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts";

import Header from "../components/Header";
import WebhookSimulatorModal from "../components/WebhookSimulatorModal";
import StatCard from "../components/StatCard";
import usePageAnimation from "../hooks/usePageAnimation";
import { useToast } from "../context/ToastContext";
import { useTheme } from "../context/ThemeContext";

const CHANNEL_PERFORMANCE_DATA = [
  { channel: "Email", sent: 142, opened: 118, clicked: 89, recovered: 72, rate: "80.8%" },
  { channel: "SMS", sent: 98, opened: 94, clicked: 76, recovered: 61, rate: "80.0%" },
  { channel: "WhatsApp", sent: 65, opened: 64, clicked: 58, recovered: 51, rate: "87.9%" },
];

const AI_ACCURACY_DATA = [
  { range: "90-100% Conf.", count: 184 },
  { range: "80-89% Conf.", count: 42 },
  { range: "70-79% Conf.", count: 12 },
  { range: "<70% Conf.", count: 4 },
];

const MONTHLY_REVENUE_COMPARE = [
  { month: "May", recovered: 18400, lost: 12200 },
  { month: "Jun", recovered: 24500, lost: 11000 },
  { month: "Jul", recovered: 32100, lost: 9800 },
  { month: "Aug", recovered: 41200, lost: 7400 },
  { month: "Sep", recovered: 48200, lost: 5100 },
];

function Analytics() {
  const pageRef = useRef(null);
  const { addToast } = useToast();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  usePageAnimation(pageRef);

  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);
  const [timeRange, setTimeRange] = useState("30d");

  const handleExportReport = () => {
    addToast("Exported Reviva Phase 2 Analytics PDF Report!", "success");
  };

  return (
    <div className={`flex min-h-screen min-w-0 flex-1 flex-col ${
      isDark ? "bg-black text-white" : "bg-slate-50 text-slate-900"
    }`}>
      <Header onOpenWebhookModal={() => setIsWebhookModalOpen(true)} />

      <main ref={pageRef} className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Title Header */}
        <div className="animate-section flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
          <div>
            <h1 className={`page-title text-2xl font-extrabold tracking-tight sm:text-3xl ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              Full Analytics & Revenue Intelligence
            </h1>
            <p className={`page-subtitle mt-1 text-xs sm:text-sm ${
              isDark ? "text-slate-300" : "text-slate-500"
            }`}>
              Comprehensive breakdown of recovered revenue, channel efficiency, and LLM classification performance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportReport}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-slate-800"
            >
              <Download className="h-4 w-4" />
              <span>Export PDF Report</span>
            </button>
          </div>
        </div>

        {/* Top Analytics Metric Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Recovered (YTD)"
            value="₹1,64,400"
            trend="+32.1%"
            subtitle="Cumulative saved revenue"
            icon={DollarSign}
            className={isDark ? "" : "!border-[#a8dceb] !bg-[#d9f3fb]"}
          />
          <StatCard
            label="Churn Prevention Rate"
            value="89.4%"
            trend="+5.2%"
            subtitle="Subscribers retained after failure"
            icon={TrendingUp}
            className={isDark ? "" : "!border-[#a8dceb] !bg-[#d9f3fb]"}
          />
          <StatCard
            label="Avg. Recovery Time"
            value="3.2 Hours"
            trend="-45 mins"
            subtitle="Time to payment capture"
            icon={Layers}
            className={isDark ? "" : "!border-[#a8dceb] !bg-[#d9f3fb]"}
          />
          <StatCard
            label="AI Classification Precision"
            value="96.2%"
            trend="+2.1%"
            subtitle="LLM rule mapping accuracy"
            icon={Sparkles}
            className={isDark ? "" : "!border-[#a8dceb] !bg-[#d9f3fb]"}
          />
        </div>

        {/* Chart Row 1: Recovered vs Lost Monthly Stacked Bar & Channel Performance */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className={`animate-section lg:col-span-2 space-y-4 rounded-2xl border p-5 shadow-sm ${
            isDark ? "border-slate-800 bg-black" : "border-[#a8dceb] bg-[#d9f3fb]"
          }`}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Revenue Recovered vs Lost (Monthly Comparison)
                </h2>
                <p className="text-xs text-slate-500">
                  Demonstrating growth in automatic recovery vs silent churn loss
                </p>
              </div>
              <span className="rounded-xl bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                80.4% Net Recovered
              </span>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MONTHLY_REVENUE_COMPARE}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#64748B", fontSize: 11 }} tickFormatter={(v) => `₹${v/1000}k`} />
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                  <Bar dataKey="recovered" name="Recovered Revenue (₹)" fill="#10B981" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="lost" name="Unrecoverable Lost (₹)" fill="#F43F5E" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* AI Confidence Distribution */}
          <section className={`animate-section space-y-4 rounded-2xl border p-5 shadow-sm ${
            isDark ? "border-slate-800 bg-black" : "border-[#a8dceb] bg-[#d9f3fb]"
          }`}>
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                LLM Confidence Score Distribution
              </h2>
              <p className="text-xs text-slate-500">
                Distribution of GenAI classification confidence ratings
              </p>
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={AI_ACCURACY_DATA} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                  <XAxis type="number" tick={{ fill: "#64748B", fontSize: 11 }} />
                  <YAxis dataKey="range" type="category" tick={{ fill: "#64748B", fontSize: 11 }} width={90} />
                  <Tooltip />
                  <Bar dataKey="count" name="Transactions" fill="#6366F1" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        {/* Channel Performance Matrix Table */}
        <section className={`animate-section space-y-4 rounded-2xl border p-5 shadow-sm ${
          isDark ? "border-slate-800 bg-black" : "border-[#a8dceb] bg-[#d9f3fb]"
        }`}>
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900">
              Outreach Channel Conversion Matrix (Email vs SMS vs WhatsApp)
            </h2>
            <p className="text-xs text-slate-500">
              Measuring open rates, click rates, and recovered revenue by outreach channel
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className={`border-b uppercase font-semibold ${
                isDark ? "border-slate-800 bg-black text-slate-300" : "border-[#a8dceb] bg-[#d9f3fb] text-slate-600"
              }`}>
                <tr>
                  <th className="px-4 py-3">Channel</th>
                  <th className="px-4 py-3">Outreach Messages Sent</th>
                  <th className="px-4 py-3">Opened</th>
                  <th className="px-4 py-3">Clicked Payment Link</th>
                  <th className="px-4 py-3">Payments Recovered</th>
                  <th className="px-4 py-3 text-right">Conversion Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {CHANNEL_PERFORMANCE_DATA.map((row) => (
                  <tr key={row.channel} className={isDark ? "hover:bg-slate-900" : "hover:bg-[#eefaff]"}>
                    <td className={`px-4 py-3.5 font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{row.channel}</td>
                    <td className="px-4 py-3.5">{row.sent}</td>
                    <td className="px-4 py-3.5">{row.opened}</td>
                    <td className="px-4 py-3.5">{row.clicked}</td>
                    <td className="px-4 py-3.5 font-bold text-emerald-600">{row.recovered}</td>
                    <td className="px-4 py-3.5 text-right font-bold text-indigo-600">{row.rate}</td>
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
      />
    </div>
  );
}

export default Analytics;
