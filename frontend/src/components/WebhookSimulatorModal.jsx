import { useState } from "react";
import { X, Zap, Code, Send, Check, Play } from "lucide-react";
import { simulateWebhookEvent } from "../services/api";
import { useToast } from "../context/ToastContext";

const PRESET_SCENARIOS = [
  {
    id: "bank_timeout",
    label: "Bank Timeout (HDFC)",
    category: "BANK_FAILURE",
    payload: {
      event: "payment.failed",
      payload: {
        payment: {
          entity: {
            id: "pay_HDFC" + Math.floor(100000 + Math.random() * 900000),
            amount: 249900,
            currency: "INR",
            status: "failed",
            order_id: "order_HD" + Math.floor(1000 + Math.random() * 9000),
            method: "netbanking",
            bank: "HDFC",
            email: "rahul.test@gmail.com",
            contact: "+919876543210",
            error_code: "BAD_REQUEST_PAYMENT_TIMED_OUT",
            error_description: "HDFC gateway timed out during OTP verification",
            notes: { customer_name: "Rahul Test" },
          },
        },
      },
    },
  },
  {
    id: "insufficient_funds",
    label: "Insufficient Balance",
    category: "INSUFFICIENT_FUNDS",
    payload: {
      event: "payment.failed",
      payload: {
        payment: {
          entity: {
            id: "pay_INS" + Math.floor(100000 + Math.random() * 900000),
            amount: 499900,
            currency: "INR",
            status: "failed",
            order_id: "order_IN" + Math.floor(1000 + Math.random() * 9000),
            method: "card",
            email: "priya.test@corp.com",
            contact: "+919812345678",
            error_code: "PAYMENT_INSUFFICIENT_FUNDS",
            error_description: "Account balance is lower than transaction amount",
            notes: { customer_name: "Priya Corporate" },
          },
        },
      },
    },
  },
  {
    id: "card_expired",
    label: "Card Expired",
    category: "CARD_EXPIRED",
    payload: {
      event: "payment.failed",
      payload: {
        payment: {
          entity: {
            id: "pay_EXP" + Math.floor(100000 + Math.random() * 900000),
            amount: 149900,
            currency: "INR",
            status: "failed",
            order_id: "order_EX" + Math.floor(1000 + Math.random() * 9000),
            method: "card",
            email: "amit.expired@gmail.com",
            contact: "+919988776655",
            error_code: "CARD_EXPIRED",
            error_description: "Card validity period expired 04/25",
            notes: { customer_name: "Amit Expired" },
          },
        },
      },
    },
  },
  {
    id: "payment_captured",
    label: "Payment Recovered (Captured)",
    category: "RECOVERED",
    payload: {
      event: "payment.captured",
      payload: {
        payment: {
          entity: {
            id: "pay_CAP" + Math.floor(100000 + Math.random() * 900000),
            amount: 399900,
            currency: "INR",
            status: "captured",
            order_id: "order_CP" + Math.floor(1000 + Math.random() * 9000),
            method: "upi",
            email: "recovered.user@tech.com",
            contact: "+919111122233",
            error_code: null,
            error_description: null,
            notes: { customer_name: "Recovered User" },
          },
        },
      },
    },
  },
];

function WebhookSimulatorModal({ isOpen, onClose, onWebhookTriggered }) {
  const { addToast } = useToast();
  const [selectedScenario, setSelectedScenario] = useState(PRESET_SCENARIOS[0]);
  const [jsonText, setJsonText] = useState(
    JSON.stringify(PRESET_SCENARIOS[0].payload, null, 2)
  );
  const [sending, setSending] = useState(false);

  if (!isOpen) return null;

  const handleSelectScenario = (sc) => {
    setSelectedScenario(sc);
    setJsonText(JSON.stringify(sc.payload, null, 2));
  };

  const handleFireWebhook = async () => {
    try {
      setSending(true);
      const parsed = JSON.parse(jsonText);
      await simulateWebhookEvent(parsed);
      addToast(
        `Webhook ${parsed.event} event fired successfully!`,
        "success"
      );
      if (onWebhookTriggered) onWebhookTriggered();
      onClose();
    } catch (err) {
      addToast("Invalid JSON payload format", "error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl transition-all">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
              <Zap className="h-5 w-5 fill-amber-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Razorpay Webhook Simulator
              </h2>
              <p className="text-xs text-slate-500">
                Simulate real payment events to trigger Reviva AI classification & retry scheduling
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scenarios Preset Picker */}
        <div className="mt-4">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Quick Failure Scenarios:
          </label>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {PRESET_SCENARIOS.map((sc) => {
              const active = selectedScenario.id === sc.id;
              return (
                <button
                  key={sc.id}
                  onClick={() => handleSelectScenario(sc)}
                  className={`flex flex-col items-start justify-between rounded-xl border p-3 text-left transition ${
                    active
                      ? "border-amber-500 bg-amber-500/10 text-amber-900"
                      : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  <span className="text-xs font-bold">{sc.label}</span>
                  <span className="mt-1 text-[10px] text-slate-500">{sc.category}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* JSON Editor */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <Code className="h-4 w-4 text-slate-500" />
              Webhook Payload (JSON)
            </span>
            <span className="text-[10px] text-slate-400">Endpoint: POST /api/webhook</span>
          </div>
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            rows={10}
            className="w-full rounded-xl border border-slate-200 bg-slate-900 p-3 font-mono text-xs text-emerald-400 outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            onClick={handleFireWebhook}
            disabled={sending}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-amber-700 disabled:opacity-50"
          >
            <Play className="h-4 w-4 fill-white" />
            {sending ? "Triggering..." : "Fire Webhook Event"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default WebhookSimulatorModal;
