import { useState } from "react";
import { Sparkles, Copy, Check, Send, Mail, MessageSquare, Smartphone, Zap } from "lucide-react";
import { useToast } from "../context/ToastContext";
import { useTheme } from "../context/ThemeContext";

function ABMessageCard({ variantA, variantB, onSelectVariant, selectedVariant = "A" }) {
  const { addToast } = useToast();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [copiedVariant, setCopiedVariant] = useState(null);

  const handleCopy = (variantLetter, text) => {
    navigator.clipboard.writeText(text);
    setCopiedVariant(variantLetter);
    addToast(`Variant ${variantLetter} message copied to clipboard!`, "success");
    setTimeout(() => setCopiedVariant(null), 2000);
  };

  const getChannelIcon = (channel) => {
    switch (channel?.toLowerCase()) {
      case "whatsapp":
        return <MessageSquare className="h-4 w-4 text-emerald-500" />;
      case "sms":
        return <Smartphone className="h-4 w-4 text-sky-500" />;
      default:
        return <Mail className="h-4 w-4 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className={`flex items-center justify-between border-b pb-3 ${
        isDark ? "border-slate-800" : "border-slate-100"
      }`}>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          <h3 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            GenAI A/B Message Experiments
          </h3>
        </div>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 border border-indigo-100">
          LLM Proposed
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* VARIANT A */}
        <div
          className={`relative rounded-2xl border p-4 transition ${
            selectedVariant === "A"
              ? "border-amber-500 bg-amber-500/5 ring-2 ring-amber-500/20"
              : isDark
              ? "border-slate-800 bg-black hover:border-slate-700"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
                A
              </span>
              <span className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                {variantA?.tone || "Friendly & Empathetic"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              {getChannelIcon(variantA?.channel)}
              <span className="capitalize">{variantA?.channel || "email"}</span>
            </div>
          </div>

          <div className="mt-3 rounded-xl bg-slate-900 p-3 text-xs text-slate-200">
            <p className="font-semibold text-amber-400 border-b border-slate-800 pb-1 mb-2">
              Subject: {variantA?.subject}
            </p>
            <p className="whitespace-pre-wrap leading-relaxed text-slate-300">
              {variantA?.body}
            </p>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-500">Est. Conversion:</span>
              <span className="font-bold text-emerald-600">
                {Math.round((variantA?.predictedConversion || 0.78) * 100)}%
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy("A", `${variantA?.subject}\n\n${variantA?.body}`)}
                className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium ${
                  isDark
                    ? "border-slate-800 text-slate-200 hover:bg-slate-900"
                    : "border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {copiedVariant === "A" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                Copy
              </button>

              <button
                onClick={() => onSelectVariant && onSelectVariant("A")}
                className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                  selectedVariant === "A"
                    ? "bg-amber-600 text-white"
                    : isDark
                    ? "bg-slate-900 text-slate-200 hover:bg-slate-800"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {selectedVariant === "A" ? "Active Variant" : "Select A"}
              </button>
            </div>
          </div>
        </div>

        {/* VARIANT B */}
        <div
          className={`relative rounded-2xl border p-4 transition ${
            selectedVariant === "B"
              ? "border-amber-500 bg-amber-500/5 ring-2 ring-amber-500/20"
              : isDark
              ? "border-slate-800 bg-black hover:border-slate-700"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white">
                B
              </span>
              <span className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                {variantB?.tone || "Direct & Urgent"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              {getChannelIcon(variantB?.channel)}
              <span className="capitalize">{variantB?.channel || "email"}</span>
            </div>
          </div>

          <div className="mt-3 rounded-xl bg-slate-900 p-3 text-xs text-slate-200">
            <p className="font-semibold text-indigo-400 border-b border-slate-800 pb-1 mb-2">
              Subject: {variantB?.subject}
            </p>
            <p className="whitespace-pre-wrap leading-relaxed text-slate-300">
              {variantB?.body}
            </p>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-500">Est. Conversion:</span>
              <span className="font-bold text-emerald-600">
                {Math.round((variantB?.predictedConversion || 0.65) * 100)}%
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy("B", `${variantB?.subject}\n\n${variantB?.body}`)}
                className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium ${
                  isDark
                    ? "border-slate-800 text-slate-200 hover:bg-slate-900"
                    : "border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {copiedVariant === "B" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                Copy
              </button>

              <button
                onClick={() => onSelectVariant && onSelectVariant("B")}
                className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                  selectedVariant === "B"
                    ? "bg-amber-600 text-white"
                    : isDark
                    ? "bg-slate-900 text-slate-200 hover:bg-slate-800"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {selectedVariant === "B" ? "Active Variant" : "Select B"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ABMessageCard;
