import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Zap,
  Bot,
  BrainCircuit,
  Clock,
  Send,
  ShieldCheck,
  MessageSquare,
  Mail,
  Smartphone,
  CheckCircle2,
} from "lucide-react";

import CategoryBadge from "../components/CategoryBadge";
import StatusBadge from "../components/StatusBadge";
import ABMessageCard from "../components/ABMessageCard";
import Header from "../components/Header";
import WebhookSimulatorModal from "../components/WebhookSimulatorModal";

import { fetchTransactionById, generateAIMessageVariants } from "../services/api";
import usePageAnimation from "../hooks/usePageAnimation";
import { useToast } from "../context/ToastContext";

function TransactionDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const pageRef = useRef(null);
  const { addToast } = useToast();

  usePageAnimation(pageRef);

  const [txn, setTxn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedTone, setSelectedTone] = useState("Friendly & Empathetic");

  const [variantA, setVariantA] = useState(null);
  const [variantB, setVariantB] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState("A");

  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);

  useEffect(() => {
    const loadTxn = async () => {
      try {
        setLoading(true);
        const data = await fetchTransactionById(id);
        setTxn(data);
        if (data.aiMessageVariantA) setVariantA(data.aiMessageVariantA);
        if (data.aiMessageVariantB) setVariantB(data.aiMessageVariantB);
      } catch (err) {
        console.error("Fetch txn detail error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTxn();
  }, [id]);

  const handleRegenerateMessages = async () => {
    if (!txn) return;
    setGenerating(true);
    try {
      const res = await generateAIMessageVariants(txn, selectedTone);
      setVariantA(res.variantA);
      setVariantB(res.variantB);
      addToast("GenAI generated fresh A/B outreach message variants!", "success");
    } catch (err) {
      addToast("Failed to generate AI messages", "error");
    } finally {
      setGenerating(false);
    }
  };

  const handleSendOutreach = () => {
    const activeVar = selectedVariant === "A" ? variantA : variantB;
    addToast(
      `Outreach message sent to ${txn?.customerEmail} via ${activeVar?.channel || "email"}!`,
      "success"
    );
  };

  const handleManualRetry = () => {
    addToast(
      `Manual retry dispatched to Razorpay API for ${txn?.razorpayPaymentId}!`,
      "success"
    );
  };

  if (loading) {
    return (
      <div className="flex flex-1 flex-col min-w-0 bg-slate-50 min-h-screen">
        <Header onOpenWebhookModal={() => setIsWebhookModalOpen(true)} />
        <main className="flex-1 p-8 text-center text-slate-500">
          Loading payment recovery dossier...
        </main>
      </div>
    );
  }

  const confidencePct = Math.round((txn?.aiCategoryConfidence || 0.94) * 100);

  return (
    <div className="flex flex-1 flex-col min-w-0 bg-slate-50 min-h-screen">
      <Header onOpenWebhookModal={() => setIsWebhookModalOpen(true)} />

      <main ref={pageRef} className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/transactions")}
          className="inline-flex items-center gap-2 text-xs font-bold text-amber-600 hover:text-amber-700 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Transactions Ledger</span>
        </button>

        {/* Dossier Header */}
        <div className="animate-section flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-xs font-mono font-bold text-amber-400">
                {txn?.razorpayPaymentId}
              </span>
              <StatusBadge status={txn?.status} />
            </div>

            <h1 className="page-title mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl tracking-tight">
              Payment Recovery Intelligence
            </h1>
            <p className="page-subtitle mt-1 text-xs sm:text-sm text-slate-500">
              Customer Segment: <strong className="text-slate-900">{txn?.customerSegment}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleManualRetry}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-800 shadow-sm hover:bg-slate-100"
            >
              <RefreshCw className="h-4 w-4 text-amber-600" />
              <span>Retry Payment Now</span>
            </button>

            <button
              onClick={handleSendOutreach}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-amber-700"
            >
              <Send className="h-4 w-4" />
              <span>Send Outreach Message</span>
            </button>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Col: Customer & Transaction Info (1 Col) */}
          <div className="space-y-6">
            {/* Customer Dossier */}
            <section className="animate-section rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Customer & Payment Details
              </h2>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 uppercase tracking-wider font-semibold">
                    Customer Name
                  </span>
                  <p className="text-sm font-bold text-slate-900">{txn?.customerName}</p>
                  <p className="text-slate-500">{txn?.customerEmail}</p>
                  <p className="text-slate-500">{txn?.customerPhone}</p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-400 uppercase tracking-wider font-semibold">
                    Amount & Currency
                  </span>
                  <p className="text-xl font-extrabold text-slate-900">
                    ₹{txn?.amount} <span className="text-xs font-medium text-slate-400">{txn?.currency}</span>
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-400 uppercase tracking-wider font-semibold">
                    Raw Gateway Failure Code
                  </span>
                  <p className="font-mono text-rose-600 font-bold bg-rose-50 p-2 rounded-lg mt-1 border border-rose-100">
                    {txn?.rawErrorCode}
                  </p>
                  <p className="text-slate-500 text-[11px] mt-1">{txn?.rawErrorDescription}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 uppercase tracking-wider font-semibold">
                      Retry Attempts
                    </span>
                    <p className="font-bold text-slate-900">{txn?.retryCount} of {txn?.maxRetries}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 uppercase tracking-wider font-semibold">
                      Next Scheduled Retry
                    </span>
                    <p className="font-bold text-amber-600">
                      {txn?.nextRetryAt ? new Date(txn.nextRetryAt).toLocaleTimeString() : "Manual"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* AI Classification & Confidence */}
            <section className="animate-section rounded-2xl border border-slate-800 bg-slate-950 p-5 shadow-xl text-white space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-amber-400" />
                  <h3 className="font-bold text-sm">LLM Classification</h3>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                  {confidencePct}% Confidence
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase">
                  Classified Category:
                </span>
                <div className="mt-1">
                  <CategoryBadge category={txn?.category} />
                </div>
              </div>

              {/* Progress Confidence Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Classification Precision</span>
                  <span>{confidencePct}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${confidencePct}%` }}
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Right Col: AI Reasoning & GenAI A/B Message Suite (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* LLM Retry Time Reasoning Card (Phase 2 Feature) */}
            <section className="animate-section rounded-2xl border border-indigo-200 bg-indigo-50/50 p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2.5 text-indigo-900 font-bold text-sm border-b border-indigo-100 pb-3">
                <BrainCircuit className="h-5 w-5 text-indigo-600" />
                <h3>LLM Retry Timing Reasoning Engine</h3>
              </div>

              <p className="text-xs leading-relaxed text-indigo-950 font-medium">
                {txn?.llmRetryReasoning ||
                  "Intelligent scheduling rules evaluated gateway response codes against historical bank processing patterns."}
              </p>

              <div className="flex items-center gap-4 text-[11px] font-semibold text-indigo-700 pt-2 border-t border-indigo-100/60">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  Recommended Delay: {txn?.category === "BANK_FAILURE" ? "1 Hour" : "72 Hours"}
                </span>
                <span className="flex items-center gap-1 text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  High Success Probability
                </span>
              </div>
            </section>

            {/* GenAI Outreach Tone Config */}
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <span className="text-xs font-bold text-slate-900">
                  Target Brand Tone:
                </span>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={selectedTone}
                  onChange={(e) => setSelectedTone(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-slate-800"
                >
                  <option value="Friendly & Empathetic">Friendly & Empathetic</option>
                  <option value="Professional & Direct">Professional & Direct</option>
                  <option value="Incentivized">Incentivized (Save 5%)</option>
                  <option value="Urgent">Urgent / Action Needed</option>
                </select>

                <button
                  onClick={handleRegenerateMessages}
                  disabled={generating}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${generating ? "animate-spin" : ""}`} />
                  <span>{generating ? "Generating..." : "Re-Generate A/B"}</span>
                </button>
              </div>
            </div>

            {/* A/B Message Card Component */}
            <ABMessageCard
              variantA={variantA}
              variantB={variantB}
              selectedVariant={selectedVariant}
              onSelectVariant={(v) => setSelectedVariant(v)}
            />
          </div>
        </div>
      </main>

      <WebhookSimulatorModal
        isOpen={isWebhookModalOpen}
        onClose={() => setIsWebhookModalOpen(false)}
      />
    </div>
  );
}

export default TransactionDetail;