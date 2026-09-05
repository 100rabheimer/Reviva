import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
} from "lucide-react";

import CategoryBadge from "../components/CategoryBadge";
import StatusBadge from "../components/StatusBadge";
import usePageAnimation from "../hooks/usePageAnimation";

function TransactionDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const pageRef = useRef(null);

  usePageAnimation(pageRef);

  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [generatedMessage, setGeneratedMessage] = useState("");
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchTransaction = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:3000/api/transactions/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch transaction");
        }

        const data = await response.json();

        if (isMounted) {
          console.log("Transaction detail:", data);

          setTransaction(data);

          if (data.aiMessage) {
            setGeneratedMessage(data.aiMessage);
          }
        }
      } catch (error) {
        console.error("Failed to fetch transaction:", error);

        if (isMounted) {
          setError("Failed to load transaction details.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTransaction();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const generateMessage = () => {
    if (!transaction) return;

    setGenerating(true);

    setTimeout(() => {
      const customerName =
        transaction.customerName || "there";

      const amount =
        transaction.amount || "your payment";

      const reason =
        transaction.failureReason ||
        "a payment issue";

      const message = `Hi ${customerName}, we noticed that your payment of ₹${amount} could not be completed due to ${reason.toLowerCase()}. No worries — you can try again whenever you're ready. If the issue continues, please check your payment details or try a different payment method.`;

      setGeneratedMessage(message);

      setGenerating(false);
    }, 700);
  };

  const copyMessage = async () => {
    if (!generatedMessage) return;

    try {
      await navigator.clipboard.writeText(
        generatedMessage
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy message:", error);
    }
  };

  const handleRetry = () => {
    alert("Retry action will be connected to the backend.");
  };

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl">
          {/* Back button skeleton */}
          <div className="h-4 w-40 animate-pulse rounded bg-zinc-200" />

          {/* Heading skeleton */}
          <div className="mt-8">
            <div className="h-4 w-32 animate-pulse rounded bg-zinc-200" />

            <div className="mt-3 h-10 w-64 max-w-full animate-pulse rounded bg-zinc-200" />

            <div className="mt-3 h-4 w-52 max-w-full animate-pulse rounded bg-zinc-100" />
          </div>

          {/* Transaction info skeleton */}
          <section className="mt-8 rounded-xl border border-[#DDD8CF] bg-white p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="animate-pulse">
                  <div className="h-3 w-24 rounded bg-zinc-200" />

                  <div className="mt-3 h-5 w-40 max-w-full rounded bg-zinc-200" />

                  <div className="mt-2 h-4 w-52 max-w-full rounded bg-zinc-100" />
                </div>
              ))}
            </div>

            <div className="mt-8 animate-pulse border-t border-[#EEEAE3] pt-6">
              <div className="h-3 w-28 rounded bg-zinc-200" />

              <div className="mt-3 h-4 w-full rounded bg-zinc-100" />
            </div>
          </section>

          {/* Recovery message skeleton */}
          <section className="mt-6 rounded-xl border border-[#DDD8CF] bg-white p-4 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="animate-pulse">
                <div className="h-5 w-40 rounded bg-zinc-200" />

                <div className="mt-3 h-4 w-64 max-w-full rounded bg-zinc-100" />
              </div>

              <div className="h-10 w-full animate-pulse rounded-lg bg-zinc-200 sm:w-36" />
            </div>

            <div className="mt-6 h-28 animate-pulse rounded-lg bg-zinc-100" />
          </section>
        </div>
      </main>
    );
  }

  /* ---------------- ERROR ---------------- */

  if (error) {
    return (
      <main className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md rounded-xl border border-red-200 bg-red-50 p-5 text-center sm:p-6">
          <h2 className="text-lg font-semibold text-red-700">
            Something went wrong
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => navigate("/transactions")}
              className="rounded-lg border border-[#DDD8CF] bg-white px-4 py-2 text-sm font-medium text-[#1F1F1C] transition hover:bg-zinc-50"
            >
              Go Back
            </button>

            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-[#1F1F1C] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  /* ---------------- PAGE ---------------- */

  return (
    <main
      ref={pageRef}
      className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8"
    >
      <div className="max-w-7xl">
        {/* Back Button */}

        <button
          onClick={() => navigate("/transactions")}
          className="page-back mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#C66A2B] transition hover:opacity-75"
        >
          <ArrowLeft size={17} />

          <span>Back to Transactions</span>
        </button>

        {/* Heading */}

        <div className="animate-section">
          <p className="text-xs font-medium tracking-wide text-zinc-500 sm:text-sm">
            TRANSACTION DETAIL
          </p>

          <h1 className="page-title mt-2 text-2xl font-semibold text-[#1F1F1C] sm:text-3xl">
            Payment Recovery
          </h1>

          <p className="page-subtitle mt-2 break-all text-xs text-zinc-500 sm:text-sm">
            {transaction?.razorpayPaymentId ||
              "Payment ID unavailable"}
          </p>
        </div>

        {/* Transaction Information */}

        <section className="animate-section mt-6 rounded-xl border border-[#DDD8CF] bg-white p-4 sm:mt-8 sm:p-6">
          <div className="flex flex-col gap-1 border-b border-[#EEEAE3] pb-5">
            <h2 className="text-base font-semibold text-[#1F1F1C]">
              Transaction Information
            </h2>

            <p className="text-sm text-zinc-500">
              Payment and customer details.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Customer */}

            <div className="animate-card min-w-0">
              <p className="text-xs uppercase tracking-wide text-zinc-500">
                Customer
              </p>

              <p className="mt-1 truncate font-medium text-[#1F1F1C]">
                {transaction?.customerName || "Unknown"}
              </p>

              <p className="mt-1 break-all text-sm text-zinc-500">
                {transaction?.customerEmail || "No email available"}
              </p>
            </div>

            {/* Amount */}

            <div className="animate-card">
              <p className="text-xs uppercase tracking-wide text-zinc-500">
                Amount
              </p>

              <p className="mt-1 text-xl font-semibold text-[#1F1F1C]">
                ₹{transaction?.amount ?? 0}
              </p>
            </div>

            {/* Category */}

            <div className="animate-card">
              <p className="mb-2 text-xs uppercase tracking-wide text-zinc-500">
                Category
              </p>

              <CategoryBadge
                category={transaction?.category}
              />
            </div>

            {/* Status */}

            <div className="animate-card">
              <p className="mb-2 text-xs uppercase tracking-wide text-zinc-500">
                Status
              </p>

              <StatusBadge
                status={transaction?.status}
              />
            </div>

            {/* Retry Count */}

            <div className="animate-card">
              <p className="text-xs uppercase tracking-wide text-zinc-500">
                Retry Count
              </p>

              <p className="mt-1 text-lg font-semibold text-[#1F1F1C]">
                {transaction?.retryCount ?? 0}
              </p>
            </div>

            {/* Next Retry */}

            <div className="animate-card min-w-0">
              <p className="text-xs uppercase tracking-wide text-zinc-500">
                Next Retry
              </p>

              <p className="mt-1 break-words text-sm text-[#1F1F1C]">
                {transaction?.nextRetryAt
                  ? new Date(
                      transaction.nextRetryAt
                    ).toLocaleString()
                  : "No retry scheduled"}
              </p>
            </div>
          </div>

          {/* Failure Reason */}

          <div className="animate-card mt-6 border-t border-[#EEEAE3] pt-6">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Failure Reason
            </p>

            <p className="mt-2 break-words text-sm leading-6 text-zinc-700">
              {transaction?.failureReason ||
                "No failure reason available"}
            </p>
          </div>
        </section>

        {/* Recovery Actions */}

        <section className="animate-section mt-6 rounded-xl border border-[#DDD8CF] bg-white p-4 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-base font-semibold text-[#1F1F1C]">
                Recovery Message
              </p>

              <p className="mt-1 text-sm leading-6 text-zinc-500">
                Generate a customer-friendly message for this failed payment.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <button
                onClick={handleRetry}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#DDD8CF] px-4 py-2.5 text-sm font-medium text-[#1F1F1C] transition hover:bg-[#FAF9F6]"
              >
                <RefreshCw size={16} />

                Retry Payment
              </button>

              <button
                onClick={generateMessage}
                disabled={generating}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1F1F1C] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Sparkles size={16} />

                {generating
                  ? "Generating..."
                  : "Generate Message"}
              </button>
            </div>
          </div>

          {/* Message Area */}

          <div className="animate-card mt-6 rounded-lg border border-dashed border-[#DDD8CF] bg-[#FAF9F6] p-4 sm:p-5">
            {generatedMessage ? (
              <div>
                <p className="whitespace-pre-wrap break-words text-sm leading-7 text-zinc-700">
                  {generatedMessage}
                </p>

                <div className="mt-5 border-t border-[#E7E2D9] pt-4">
                  <button
                    onClick={copyMessage}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#DDD8CF] bg-white px-3 py-2 text-sm font-medium text-[#1F1F1C] transition hover:bg-zinc-50"
                  >
                    {copied ? (
                      <>
                        <Check size={16} />

                        Copied
                      </>
                    ) : (
                      <>
                        <Copy size={16} />

                        Copy Message
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex min-h-28 items-center justify-center text-center">
                <p className="text-sm text-zinc-500">
                  No recovery message generated yet.
                  <br />
                  Click{" "}
                  <span className="font-medium text-[#1F1F1C]">
                    Generate Message
                  </span>{" "}
                  to create one.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default TransactionDetail;