import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryBadge from "../components/CategoryBadge";
import StatusBadge from "../components/StatusBadge";

function Transactions() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
const [category, setCategory] = useState("");
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  useEffect(() => {
  fetch(
  `http://localhost:3000/api/transactions??page=${page}&limit=10&search=${debouncedSearch}&status=${status}&category=${category}`
)
      .then((response) => response.json())
      .then((data) => {
       console.log("Transactions page data:", data);

  setTransactions(data.transactions);
  setTotalPages(data.totalPages);

      })
      .catch((error) => {
        console.log("Failed to fetch transactions:", error);
      });
}, [debouncedSearch, status, category, page]);
useEffect(() => {
  setPage(1);
}, [debouncedSearch, status, category]);
  return (
    <main className="flex-1 p-8">
      <p className="text-sm text-zinc-500">
        PAYMENT ACTIVITY
      </p>

      <h1 className="mt-2 text-3xl font-semibold text-[#1F1F1C]">
        Transactions
      </h1>

      <p className="mt-2 text-zinc-600">
        View and manage payment failures.
      </p>

      <div className="mt-6">
        <input
          type="text"
          placeholder="Search customer, email or payment ID..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full rounded-lg border border-[#DDD8CF] bg-white px-4 py-3 text-sm outline-none"
        />
      </div>
      <div className="mt-4 flex gap-4">
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
    <option value="INSUFFICIENT_FUNDS">Insufficient Funds</option>
    <option value="CARD_EXPIRED">Card Expired</option>
    <option value="AUTHENTICATION_FAILURE">
      Authentication Failure
    </option>
    <option value="BANK_FAILURE">Bank Failure</option>
    <option value="RISK_BLOCK">Risk Block</option>
    <option value="UNCLASSIFIED">Unclassified</option>
  </select>
</div>

      <div className="mt-6 overflow-hidden rounded-xl border border-[#DDD8CF] bg-white">
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

        {transactions.map((transaction) => (
       <div
  key={transaction._id}
  onClick={() => navigate(`/transactions/${transaction._id}`)}
  className="grid cursor-pointer grid-cols-5 items-center gap-4 border-b border-[#EEEAE3] px-5 py-4 transition-colors hover:bg-[#FAF9F6] last:border-b-0"
>
            <div>
              <p className="text-sm font-medium text-[#1F1F1C]">
                {transaction.customerName}
              </p>

              <p className="text-xs text-zinc-500">
                {transaction.customerEmail}
              </p>
            </div>

            <p className="truncate text-sm text-zinc-600">
              {transaction.razorpayPaymentId}
            </p>

            <p className="text-sm font-medium text-[#1F1F1C]">
              ₹{transaction.amount}
            </p>

            <CategoryBadge category={transaction.category} />

            <StatusBadge status={transaction.status} />
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between">
  <button
    onClick={() => setPage(page - 1)}
    disabled={page === 1}
    className="rounded-lg border border-[#DDD8CF] bg-white px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
  >
    Previous
  </button>

  <p className="text-sm text-zinc-600">
    Page {page} of {totalPages}
  </p>

  <button
    onClick={() => setPage(page + 1)}
    disabled={page === totalPages}
    className="rounded-lg border border-[#DDD8CF] bg-white px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
  >
    Next
  </button>
</div>
    </main>
  );
}

export default Transactions;
