import { useEffect, useRef, useState } from "react";
import {
  Settings as SettingsIcon,
  Save,
  RotateCcw,
  Check,
  User,
  CreditCard,
  Bell,
  ShieldCheck,
  Sliders,
  Zap,
  Key,
  Copy,
  CheckCircle2,
} from "lucide-react";

import Header from "../components/Header";
import WebhookSimulatorModal from "../components/WebhookSimulatorModal";
import { fetchSettings, updateSettings, fetchRetryRules, updateRetryRules } from "../services/api";
import usePageAnimation from "../hooks/usePageAnimation";
import { useToast } from "../context/ToastContext";
import { useTheme } from "../context/ThemeContext";

function Settings() {
  const pageRef = useRef(null);
  const { addToast } = useToast();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  usePageAnimation(pageRef);

  const [settings, setSettingsState] = useState({
    companyName: "Acme Fintech Corp",
    recoveryEmail: "billing@acmefintech.com",
    brandTone: "Friendly & Empathetic",
    llmProvider: "Claude 3.5 Sonnet (Recommended)",
    confidenceThreshold: 85,
    channels: { email: true, sms: true, whatsapp: true },
    razorpayWebhookSecret: "whsec_reviva_98123abcdef45678",
    razorpayKeyId: "rzp_live_89123456789abc",
    webhookEndpointUrl: "https://api.reviva.io/v1/webhooks/razorpay",
  });

  const [retryRules, setRetryRulesState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [sRes, rRes] = await Promise.all([fetchSettings(), fetchRetryRules()]);
        if (sRes) setSettingsState(sRes);
        if (rRes) setRetryRulesState(rRes);
      } catch (err) {
        console.error("Settings load error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleToggleRuleAutoRetry = (ruleId) => {
    setRetryRulesState((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, autoRetryEnabled: !r.autoRetryEnabled } : r))
    );
  };

  const handleUpdateRuleDelay = (ruleId, delay) => {
    setRetryRulesState((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, retryDelayHours: Number(delay) } : r))
    );
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      await updateSettings(settings);
      await updateRetryRules(retryRules);
      addToast("Merchant retry rules and settings saved successfully!", "success");
    } catch (err) {
      addToast("Failed to save settings", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCopyWebhookUrl = () => {
    navigator.clipboard.writeText(settings.webhookEndpointUrl);
    setCopiedUrl(true);
    addToast("Webhook Endpoint URL copied!", "success");
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className={`flex min-h-screen min-w-0 flex-1 flex-col ${
      isDark ? "bg-black text-white" : "bg-slate-50 text-slate-900"
    }`}>
      <Header onOpenWebhookModal={() => setIsWebhookModalOpen(true)} />

      <main ref={pageRef} className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className={`animate-section flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between ${
          isDark ? "border-slate-800" : "border-slate-200"
        }`}>
          <div>
            <h1 className={`page-title text-2xl font-extrabold tracking-tight sm:text-3xl ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              Merchant Settings & Retry Rules
            </h1>
            <p className={`page-subtitle mt-1 text-xs sm:text-sm ${
              isDark ? "text-slate-300" : "text-slate-500"
            }`}>
              Configure automated retry delays per failure category, brand outreach tone, and Razorpay API credentials.
            </p>
          </div>

          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-amber-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? "Saving Changes..." : "Save Settings"}</span>
          </button>
        </div>

        {/* SECTION 1: MERCHANT RETRY RULES CONFIGURATION TABLE (Phase 2 Core Requirement) */}
        <section className={`animate-section space-y-4 rounded-2xl border p-5 shadow-sm ${
          isDark ? "border-slate-800 bg-black" : "border-[#a8dceb] bg-[#d9f3fb]"
        }`}>
          <div className={`flex items-center justify-between border-b pb-4 ${
            isDark ? "border-slate-800" : "border-[#a8dceb]"
          }`}>
            <div>
              <h2 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                Category-based Retry Rules Configuration
              </h2>
              <p className={`text-xs ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                Define retry delays, auto-retry toggles, and max retry limits for each failure category
              </p>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
              Rule Engine Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className={`border-b uppercase font-semibold ${
                isDark ? "border-slate-800 bg-black text-slate-300" : "border-[#a8dceb] bg-[#d9f3fb] text-slate-600"
              }`}>
                <tr>
                  <th className="px-4 py-3">Failure Category</th>
                  <th className="px-4 py-3">Auto Retry</th>
                  <th className="px-4 py-3">Retry Delay Window</th>
                  <th className="px-4 py-3">Max Attempts</th>
                  <th className="px-4 py-3">Strategy Description</th>
                </tr>
              </thead>
              <tbody className={`divide-y font-medium ${isDark ? "divide-slate-800" : "divide-[#a8dceb]"}`}>
                {retryRules.map((rule) => (
                  <tr key={rule.id} className={isDark ? "hover:bg-slate-900" : "hover:bg-[#eefaff]"}>
                    <td className={`px-4 py-3.5 font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                      {rule.categoryLabel}
                    </td>

                    {/* Auto Retry Toggle */}
                    <td className="px-4 py-3.5">
                      <button
                        type="button"
                        onClick={() => handleToggleRuleAutoRetry(rule.id)}
                        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                          rule.autoRetryEnabled ? "bg-amber-600" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                            rule.autoRetryEnabled ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </td>

                    {/* Retry Delay Input */}
                    <td className="px-4 py-3.5">
                      <select
                        value={rule.retryDelayHours}
                        disabled={!rule.autoRetryEnabled}
                        onChange={(e) => handleUpdateRuleDelay(rule.id, e.target.value)}
                        className={`rounded-lg border px-2.5 py-1 text-xs font-semibold outline-none focus:border-sky-500 disabled:opacity-40 ${
                          isDark ? "border-slate-800 bg-black text-white" : "border-[#a8dceb] bg-[#eefaff] text-slate-800"
                        }`}
                      >
                        <option value="0">Immediate (0h)</option>
                        <option value="1">1 Hour</option>
                        <option value="6">6 Hours</option>
                        <option value="24">24 Hours (1 Day)</option>
                        <option value="48">48 Hours (2 Days)</option>
                        <option value="72">72 Hours (3 Days)</option>
                      </select>
                    </td>

                    <td className={`px-4 py-3.5 font-bold ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                      {rule.maxAttempts} Attempts
                    </td>

                    <td className={`px-4 py-3.5 text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      {rule.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 2: BRAND TONE & LLM AI CONFIGURATION */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Brand Tone & Channels */}
          <section className={`animate-section space-y-4 rounded-2xl border p-5 shadow-sm ${
            isDark ? "border-slate-800 bg-black" : "border-[#a8dceb] bg-[#d9f3fb]"
          }`}>
            <h2 className={`border-b pb-3 text-base font-bold ${
              isDark ? "border-slate-800 text-white" : "border-[#a8dceb] text-slate-900"
            }`}>
              Brand Tone & Outreach Channels
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className={`mb-1 block font-bold ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                  Default GenAI Brand Outreach Tone
                </label>
                <select
                  value={settings.brandTone}
                  onChange={(e) =>
                    setSettingsState({ ...settings, brandTone: e.target.value })
                  }
                  className={`w-full rounded-xl border px-3 py-2.5 text-xs font-semibold outline-none focus:border-sky-500 ${
                    isDark ? "border-slate-800 bg-black text-white" : "border-[#a8dceb] bg-[#eefaff] text-slate-900"
                  }`}
                >
                  <option value="Friendly & Empathetic">Friendly & Empathetic</option>
                  <option value="Professional & Direct">Professional & Direct</option>
                  <option value="Incentivized">Incentivized (With Promo / Discount)</option>
                  <option value="Urgent">Urgent / Account Pause Warning</option>
                </select>
              </div>

              <div>
                <label className={`mb-2 block font-bold ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                  Active Outreach Channels:
                </label>
                <div className="space-y-2">
                  {["email", "sms", "whatsapp"].map((ch) => (
                    <label key={ch} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.channels?.[ch] ?? true}
                        onChange={(e) =>
                          setSettingsState({
                            ...settings,
                            channels: {
                              ...settings.channels,
                              [ch]: e.target.checked,
                            },
                          })
                        }
                        className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span className={`font-semibold capitalize ${isDark ? "text-slate-200" : "text-slate-800"}`}>{ch} Outreach</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Razorpay Webhook Configuration */}
          <section className={`animate-section space-y-4 rounded-2xl border p-5 shadow-sm ${
            isDark ? "border-slate-800 bg-black" : "border-[#a8dceb] bg-[#d9f3fb]"
          }`}>
            <h2 className={`border-b pb-3 text-base font-bold ${
              isDark ? "border-slate-800 text-white" : "border-[#a8dceb] text-slate-900"
            }`}>
              Razorpay Webhook Integration
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className={`mb-1 block font-bold ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                  Webhook Endpoint URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={settings.webhookEndpointUrl}
                    className={`w-full rounded-xl border px-3 py-2 text-xs font-mono outline-none ${
                      isDark ? "border-slate-800 bg-black text-slate-200" : "border-[#a8dceb] bg-[#eefaff] text-slate-700"
                    }`}
                  />
                  <button
                    onClick={handleCopyWebhookUrl}
                    className={`rounded-xl border px-3 py-2 font-bold ${
                      isDark ? "border-slate-800 bg-black text-slate-200 hover:bg-slate-900" : "border-[#a8dceb] bg-[#eefaff] text-slate-700 hover:bg-[#d9f3fb]"
                    }`}
                  >
                    {copiedUrl ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Razorpay Webhook Secret Key
                </label>
                <input
                  type="password"
                  value={settings.razorpayWebhookSecret}
                  onChange={(e) =>
                    setSettingsState({
                      ...settings,
                      razorpayWebhookSecret: e.target.value,
                    })
                  }
                  className={`w-full rounded-xl border px-3 py-2 text-xs font-mono outline-none focus:border-sky-500 ${
                    isDark ? "border-slate-800 bg-black text-white" : "border-[#a8dceb] bg-[#eefaff] text-slate-900"
                  }`}
                />
              </div>
            </div>
          </section>
        </div>
      </main>

      <WebhookSimulatorModal
        isOpen={isWebhookModalOpen}
        onClose={() => setIsWebhookModalOpen(false)}
      />
    </div>
  );
}

export default Settings;