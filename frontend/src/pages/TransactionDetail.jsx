import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import CategoryBadge from "../components/CategoryBadge";
import StatusBadge from "../components/StatusBadge";

function TransactionDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/transactions/${id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Transaction detail:", data);
        setTransaction(data);
      })
      .catch((error) => {
        console.log("Failed to fetch transaction:", error);
      });
  }, [id]);

  if (!transaction) {
    return (
      <main className="flex-1 p-8">
        <p className="text-zinc-500">
          Loading transaction...
        </p>
      </main>
    );
  }

  return (
    <main className="flex-1 p-8">
      {/* Back Button */}
      <button
        onClick={() => navigate("/transactions")}
        className="mb-6 text-sm font-medium text-[#C66A2B] hover:underline"
      >
        ← Back to Transactions
      </button>

      {/* Page Heading */}
      <p className="text-sm text-zinc-500">
        TRANSACTION DETAIL
      </p>

      <h1 className="mt-2 text-3xl font-semibold text-[#1F1F1C]">
        Payment Recovery
      </h1>

      <p className="mt-2 text-sm text-zinc-500">
        {transaction.razorpayPaymentId}
      </p>

      {/* Transaction Information */}
      <section className="mt-8 rounded-xl border border-[#DDD8CF] bg-white p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Customer */}
          <div>
            <p className="text-xs uppercase text-zinc-500">
              Customer
            </p>

            <p className="mt-1 font-medium text-[#1F1F1C]">
              {transaction.customerName}
            </p>

            <p className="text-sm text-zinc-500">
              {transaction.customerEmail}
            </p>
          </div>

          {/* Amount */}
          <div>
            <p className="text-xs uppercase text-zinc-500">
              Amount
            </p>

            <p className="mt-1 text-xl font-semibold text-[#1F1F1C]">
              ₹{transaction.amount}
            </p>
          </div>

          {/* Category */}
          <div>
            <p className="mb-2 text-xs uppercase text-zinc-500">
              Category
            </p>

            <CategoryBadge category={transaction.category} />
          </div>

          {/* Status */}
          <div>
            <p className="mb-2 text-xs uppercase text-zinc-500">
              Status
            </p>

            <StatusBadge status={transaction.status} />
          </div>

          {/* Retry Count */}
          <div>
            <p className="text-xs uppercase text-zinc-500">
              Retry Count
            </p>

            <p className="mt-1 font-medium text-[#1F1F1C]">
              {transaction.retryCount}
            </p>
          </div>

          {/* Next Retry */}
          <div>
            <p className="text-xs uppercase text-zinc-500">
              Next Retry
            </p>

            <p className="mt-1 text-sm text-[#1F1F1C]">
              {transaction.nextRetryAt
                ? new Date(transaction.nextRetryAt).toLocaleString()
                : "No retry scheduled"}
            </p>
          </div>
        </div>

        {/* Failure Reason */}
        <div className="mt-6 border-t border-[#EEEAE3] pt-6">
          <p className="text-xs uppercase text-zinc-500">
            Failure Reason
          </p>

          <p className="mt-2 text-sm text-zinc-700">
            {transaction.failureReason ||
              "No failure reason available"}
          </p>
        </div>
      </section>

      {/* Recovery Message */}
      <section className="mt-6 rounded-xl border border-[#DDD8CF] bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-medium text-[#1F1F1C]">
              Recovery Message
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Generate a customer-friendly message for this failed payment.
            </p>
          </div>

          <button
            className="rounded-lg bg-[#1F1F1C] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Generate Message
          </button>
        </div>

        {/* Message Area */}
        <div className="mt-5 rounded-lg border border-dashed border-[#DDD8CF] bg-[#FAF9F6] p-5">
          {transaction.aiMessage ? (
            <p className="text-sm leading-6 text-zinc-700">
              {transaction.aiMessage}
            </p>
          ) : (
            <p className="text-sm text-zinc-500">
              No recovery message generated yet.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

export default TransactionDetail;