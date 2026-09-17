import { useState, useRef } from "react";
import {
  MessageSquareCode,
  Sparkles,
  Zap,
  Send,
  CheckCircle2,
  Copy,
  Sliders,
  Edit3,
  Bot,
  Mail,
  Smartphone,
  MessageSquare,
} from "lucide-react";

import Header from "../components/Header";
import WebhookSimulatorModal from "../components/WebhookSimulatorModal";
import usePageAnimation from "../hooks/usePageAnimation";
import { useToast } from "../context/ToastContext";
import { useTheme } from "../context/ThemeContext";

const SAMPLE_OUTREACH_LOGS = [
  {
    id: "msg_101",
    customer: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    channel: "Email",
    variant: "Variant A (Empathetic)",
    sentAt: "10 mins ago",
    status: "Opened & Clicked",
    converted: true,
  },
  {
    id: "msg_102",
    customer: "Priya Mehta",
    email: "priya.m@techcorp.in",
    channel: "WhatsApp",
    variant: "Variant A (Empathetic)",
    sentAt: "1 hour ago",
    status: "Delivered",
    converted: false,
  },
  {
    id: "msg_103",
    customer: "Amit Kulkarni",
    email: "amit.k@gmail.com",
    channel: "Email",
    variant: "Variant B (Urgent)",
    sentAt: "3 hours ago",
    status: "Clicked Link",
    converted: true,
  },
  {
    id: "msg_104",
    customer: "Sara Joseph",
    email: "sara.j@designco.com",
    channel: "SMS",
    variant: "Variant A (Empathetic)",
    sentAt: "5 hours ago",
    status: "Converted",
    converted: true,
  },
];

function Messages() {
  const pageRef = useRef(null);
  const { addToast } = useToast();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  usePageAnimation(pageRef);

  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState(
    "Act as Reviva, an empathetic AI payment recovery agent for a modern fintech SaaS. Draft polite, clear outreach emails, SMS, and WhatsApp messages when a customer's recurring charge fails. Offer clear 1-click update links and assure them their account status remains safe."
  );

  const handleSavePrompt = () => {
    addToast("GenAI System Prompt Guidelines saved successfully!", "success");
  };

  return (
    <div className={`flex min-h-screen min-w-0 flex-1 flex-col ${
      isDark ? "bg-black text-white" : "bg-slate-50 text-slate-900"
    }`}>
      <Header onOpenWebhookModal={() => setIsWebhookModalOpen(true)} />

      <main ref={pageRef} className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Title Header */}
        <div className={`animate-section flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between ${
          isDark ? "border-slate-800" : "border-slate-200"
        }`}>
          <div>
            <h1 className={`page-title text-2xl font-extrabold tracking-tight sm:text-3xl ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              A/B Messaging & Outreach Hub
            </h1>
            <p className={`page-subtitle mt-1 text-xs sm:text-sm ${
              isDark ? "text-slate-300" : "text-slate-500"
            }`}>
              Manage LLM prompt guidelines, monitor message delivery logs, and evaluate A/B conversion win rates.
            </p>
          </div>
        </div>

        {/* A/B Campaign Summary Banner */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className={`rounded-2xl border p-5 shadow-sm ${
            isDark ? "border-slate-800 bg-black" : "border-amber-200 bg-amber-50/60"
          }`}>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600">
              <Sparkles className="h-4 w-4 text-amber-600" />
              <span>Variant A (Empathetic) Win Rate</span>
            </div>
            <p className={`mt-2 text-3xl font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>74.2%</p>
            <p className={`mt-1 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>Selected in 68% of automated dispatches</p>
          </div>

          <div className={`rounded-2xl border p-5 shadow-sm ${
            isDark ? "border-slate-800 bg-black" : "border-indigo-200 bg-indigo-50/60"
          }`}>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600">
              <Zap className="h-4 w-4 text-indigo-600" />
              <span>Variant B (Urgent/Incentive) Win Rate</span>
            </div>
            <p className={`mt-2 text-3xl font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>62.8%</p>
            <p className={`mt-1 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>Effective for high-value enterprise plans</p>
          </div>

          <div className={`rounded-2xl border p-5 shadow-sm ${
            isDark ? "border-slate-800 bg-black" : "border-emerald-200 bg-emerald-50/60"
          }`}>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Total Outreach Dispatches</span>
            </div>
            <p className={`mt-2 text-3xl font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>305</p>
            <p className={`mt-1 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>Email (46%), SMS (32%), WhatsApp (22%)</p>
          </div>
        </div>

        {/* AI System Prompt Customizer */}
        <section className={`animate-section space-y-4 rounded-2xl border p-6 shadow-xl text-white ${
          isDark ? "border-slate-800 bg-black" : "border-slate-800 bg-slate-950"
        }`}>
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-amber-400" />
              <h2 className="font-bold text-base">
                GenAI Message Generator System Instructions
              </h2>
            </div>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-mono font-bold text-amber-400 border border-slate-700">
              Prompt Rules Active
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Define system guidelines used by Claude / OpenAI when drafting recovery messages for payment failures:
          </p>

          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows={4}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3.5 font-sans text-xs leading-relaxed text-slate-200 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
          />

          <div className="flex justify-end">
            <button
              onClick={handleSavePrompt}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-amber-700"
            >
              <Edit3 className="h-4 w-4" />
              <span>Save Prompt Instructions</span>
            </button>
          </div>
        </section>

        {/* Outreach Message Delivery Logs */}
        <section className={`animate-section space-y-4 rounded-2xl border p-5 shadow-sm ${
          isDark
            ? "border-slate-800 bg-black"
            : "border-[#c5e8f2] bg-gradient-to-br from-[#d9f3fb] via-[#eaf8fc] to-[#f5fcff]"
        }`}>
          <div className={`border-b pb-4 ${isDark ? "border-slate-800" : "border-slate-100"}`}>
            <h2 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              Recent Outreach Message Delivery Logs
            </h2>
            <p className={`text-xs ${isDark ? "text-slate-300" : "text-slate-500"}`}>
              Tracking dispatched email, SMS, and WhatsApp payment recovery messages
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className={`border-b uppercase font-semibold ${
                isDark ? "border-slate-800 bg-black text-slate-300" : "border-slate-200 bg-slate-50 text-slate-500"
              }`}>
                <tr>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Channel</th>
                  <th className="px-4 py-3">A/B Variant</th>
                  <th className="px-4 py-3">Dispatched</th>
                  <th className="px-4 py-3">Delivery Status</th>
                  <th className="px-4 py-3 text-right">Payment Result</th>
                </tr>
              </thead>
              <tbody className={`divide-y font-medium ${isDark ? "divide-slate-800" : "divide-slate-100"}`}>
                {SAMPLE_OUTREACH_LOGS.map((log) => (
                  <tr key={log.id} className={isDark ? "hover:bg-slate-900" : "hover:bg-slate-50"}>
                    <td className="px-4 py-3.5">
                      <p className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{log.customer}</p>
                      <p className="text-[11px] text-slate-400">{log.email}</p>
                    </td>
                    <td className={`px-4 py-3.5 font-bold ${isDark ? "text-slate-200" : "text-slate-700"}`}>{log.channel}</td>
                    <td className="px-4 py-3.5">{log.variant}</td>
                    <td className={`px-4 py-3.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>{log.sentAt}</td>
                    <td className="px-4 py-3.5">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        isDark ? "bg-slate-900 text-slate-200" : "bg-slate-100 text-slate-700"
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-bold">
                      {log.converted ? (
                        <span className="text-emerald-600">✓ Recovered</span>
                      ) : (
                        <span className="text-amber-600">Pending</span>
                      )}
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
      />
    </div>
  );
}

export default Messages;
