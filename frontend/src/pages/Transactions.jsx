import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import CategoryBadge from "../components/CategoryBadge";
import StatusBadge from "../components/StatusBadge";

import usePageAnimation from "../hooks/usePageAnimation";

function Transactions() {
  const navigate = useNavigate();

  const pageRef = useRef(null);

  usePageAnimation(pageRef);

  const [transactions, setTransactions] = useState([]);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, category]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatus("");
    setCategory("");
    setPage(1);
  };

  // Fetch transactions
  useEffect(() => {
    setLoading(true);
    setError("");

    fetch(
      `http://localhost:3000/api/transactions?page=${page}&limit=10&search=${debouncedSearch}&status=${status}&category=${category}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        return response.json();
      })
      .then((data) => {
        console.log("Transactions page data:", data);

        setTransactions(data.transactions || []);
        setTotalPages(data.totalPages || 1);
      })
      .catch((error) => {
        console.log("Failed to fetch transactions:", error);

        setError("Failed to load transactions.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [debouncedSearch, status, category, page]);

  return (
    <main ref={pageRef} className="flex-1 p-4 sm:p-6 lg:p-8">
      {/* Heading */}
      <p className="text-sm text-zinc-500">
        PAYMENT ACTIVITY
      </p>

      <h1 className="page-title mt-2 text-3xl font-semibold text-[#1F1F1C]">
        Transactions
      </h1>

      <p className="page-subtitle mt-2 text-zinc-600">
        View and manage payment failures.
      </p>

      {/* Search */}
      <div className="animate-section mt-6">
        <input
          type="text"
          placeholder="Search customer, email or payment ID..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full rounded-lg border border-[#DDD8CF] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1F1F1C]"
        />
      </div>

      {/* Filters */}
      <div className="animate-section mt-4 flex flex-wrap items-center gap-3">
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-lg border border-[#DDD8CF] bg-white px-4 py-2 text-sm outline-none"
        >
          <option value="">All Status</option>
          <option value="failed">Failed</option>
          <option value="captured">Captured</option>
        </select>

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="rounded-lg border border-[#DDD8CF] bg-white px-4 py-2 text-sm outline-none"
        >
          <option value="">All Categories</option>

          <option value="INSUFFICIENT_FUNDS">
            Insufficient Funds
          </option>

          <option value="CARD_EXPIRED">
            Card Expired
          </option>

          <option value="AUTHENTICATION_FAILURE">
            Authentication Failure
          </option>

          <option value="BANK_FAILURE">
            Bank Failure
          </option>

          <option value="RISK_BLOCK">
            Risk Block
          </option>

          <option value="UNCLASSIFIED">
            Unclassified
          </option>
        </select>

        {(search || status || category) && (
          <button
            onClick={handleResetFilters}
            className="rounded-lg border border-[#DDD8CF] bg-white px-4 py-2 text-sm font-medium text-[#1F1F1C] transition hover:bg-[#FAF9F6]"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="animate-section mt-6 rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="font-medium text-red-700">
            Something went wrong
          </p>

          <p className="mt-1 text-sm text-red-600">
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-[#1F1F1C] px-4 py-2 text-sm text-white"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <>
          {/* Desktop Skeleton */}
          <div className="animate-section mt-6 hidden overflow-hidden rounded-xl border border-[#DDD8CF] bg-white md:block">
            <div className="grid grid-cols-5 gap-4 border-b border-[#DDD8CF] bg-[#FAF9F6] px-5 py-3">
              {[
                "Customer",
                "Payment ID",
                "Amount",
                "Category",
                "Status",
              ].map((item) => (
                <p
                  key={item}
                  className="text-xs font-medium uppercase text-zinc-500"
                >
                  {item}
                </p>
              ))}
            </div>

            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="grid animate-pulse grid-cols-5 gap-4 border-b border-[#EEEAE3] px-5 py-4"
              >
                <div>
                  <div className="h-4 w-24 rounded bg-zinc-200" />
                  <div className="mt-2 h-3 w-32 rounded bg-zinc-100" />
                </div>

                <div className="h-4 w-28 rounded bg-zinc-200" />

                <div className="h-4 w-16 rounded bg-zinc-200" />

                <div className="h-6 w-24 rounded bg-zinc-200" />

                <div className="h-6 w-20 rounded bg-zinc-200" />
              </div>
            ))}
          </div>

          {/* Mobile Skeleton */}
          <div className="mt-6 space-y-4 md:hidden">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-xl border border-[#DDD8CF] bg-white p-4"
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <div className="h-4 w-28 rounded bg-zinc-200" />
                    <div className="mt-2 h-3 w-40 rounded bg-zinc-100" />
                  </div>

                  <div className="h-6 w-20 rounded bg-zinc-200" />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4 border-t border-[#EEEAE3] pt-4">
                  <div className="h-10 rounded bg-zinc-100" />
                  <div className="h-10 rounded bg-zinc-100" />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Empty State */}
      {!loading && !error && transactions.length === 0 && (
        <div className="animate-section mt-6 rounded-xl border border-[#DDD8CF] bg-white px-6 py-20 text-center">
          <h2 className="text-lg font-semibold text-[#1F1F1C]">
            No transactions found
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Try changing your search or filters.
          </p>

          {(search || status || category) && (
            <button
              onClick={handleResetFilters}
              className="mt-5 rounded-lg bg-[#1F1F1C] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {!loading && !error && transactions.length > 0 && (
        <>
          {/* Desktop Table */}
          <div className="animate-section mt-6 hidden overflow-hidden rounded-xl border border-[#DDD8CF] bg-white md:block">
            {/* Table Header */}
            <div className="grid grid-cols-5 gap-4 border-b border-[#DDD8CF] bg-[#FAF9F6] px-5 py-3">
              <p className="text-xs font-medium uppercase text-zinc-500">
                Customer
              </p>

              <p className="text-xs font-medium uppercase text-zinc-500">
                Payment ID
              </p>

              <p className="text-xs font-medium uppercase text-zinc-500">
                Amount
              </p>

              <p className="text-xs font-medium uppercase text-zinc-500">
                Category
              </p>

              <p className="text-xs font-medium uppercase text-zinc-500">
                Status
              </p>
            </div>

            {/* Transaction Rows */}
            {transactions.map((transaction) => (
              <div
                key={transaction._id}
                onClick={() =>
                  navigate(`/transactions/${transaction._id}`)
                }
                className="animate-card grid cursor-pointer grid-cols-5 items-center gap-4 border-b border-[#EEEAE3] px-5 py-4 transition-colors hover:bg-[#FAF9F6] last:border-b-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[#1F1F1C]">
                    {transaction.customerName}
                  </p>

                  <p className="truncate text-xs text-zinc-500">
                    {transaction.customerEmail}
                  </p>
                </div>

                <p className="truncate text-sm text-zinc-600">
                  {transaction.razorpayPaymentId}
                </p>

                <p className="text-sm font-medium text-[#1F1F1C]">
                  ₹{transaction.amount}
                </p>

                <CategoryBadge
                  category={transaction.category}
                />

                <StatusBadge
                  status={transaction.status}
                />
              </div>
            ))}
          </div>

          {/* Mobile Transaction Cards */}
          <div className="mt-6 space-y-4 md:hidden">
            {transactions.map((transaction) => (
              <div
                key={transaction._id}
                onClick={() =>
                  navigate(`/transactions/${transaction._id}`)
                }
                className="animate-card cursor-pointer rounded-xl border border-[#DDD8CF] bg-white p-4 transition active:scale-[0.99]"
              >
                {/* Customer + Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-[#1F1F1C]">
                      {transaction.customerName}
                    </p>

                    <p className="mt-1 truncate text-sm text-zinc-500">
                      {transaction.customerEmail}
                    </p>
                  </div>

                  <div className="shrink-0">
                    <StatusBadge
                      status={transaction.status}
                    />
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="mt-4 grid grid-cols-2 gap-4 border-t border-[#EEEAE3] pt-4">
                  <div>
                    <p className="text-xs text-zinc-500">
                      Amount
                    </p>

                    <p className="mt-1 font-semibold text-[#1F1F1C]">
                      ₹{transaction.amount}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500">
                      Category
                    </p>

                    <div className="mt-1">
                      <CategoryBadge
                        category={transaction.category}
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <p className="text-xs text-zinc-500">
                      Payment ID
                    </p>

                    <p className="mt-1 truncate font-mono text-xs text-zinc-600">
                      {transaction.razorpayPaymentId}
                    </p>
                  </div>
                </div>

                <div className="mt-4 border-t border-[#EEEAE3] pt-3 text-right text-sm font-medium text-[#C66A2B]">
                  View Details →
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="animate-section mt-4 flex items-center justify-between gap-3">
            <button
              onClick={() =>
                setPage((currentPage) =>
                  Math.max(currentPage - 1, 1)
                )
              }
              disabled={page === 1}
              className="rounded-lg border border-[#DDD8CF] bg-white px-3 py-2 text-sm transition hover:bg-[#FAF9F6] disabled:cursor-not-allowed disabled:opacity-40 sm:px-4"
            >
              Previous
            </button>

            <p className="text-center text-sm text-zinc-600">
              Page {page} of {totalPages}
            </p>

            <button
              onClick={() =>
                setPage((currentPage) =>
                  Math.min(currentPage + 1, totalPages)
                )
              }
              disabled={page === totalPages}
              className="rounded-lg border border-[#DDD8CF] bg-white px-3 py-2 text-sm transition hover:bg-[#FAF9F6] disabled:cursor-not-allowed disabled:opacity-40 sm:px-4"
            >
              Next
            </button>
          </div>
        </>
      )}
    </main>
  );
}

export default Transactions;