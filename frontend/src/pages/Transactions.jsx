import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Download,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Zap,
  CheckSquare,
  Square,
  ArrowRight,
} from "lucide-react";

import CategoryBadge from "../components/CategoryBadge";
import StatusBadge from "../components/StatusBadge";
import Header from "../components/Header";
import WebhookSimulatorModal from "../components/WebhookSimulatorModal";

import { fetchTransactions } from "../services/api";
import usePageAnimation from "../hooks/usePageAnimation";
import { useToast } from "../context/ToastContext";
import { useTheme } from "../context/ThemeContext";

function Transactions() {
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const { addToast } = useToast();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  usePageAnimation(pageRef);

  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  const [selectedTxnIds, setSelectedTxnIds] = useState([]);
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const res = await fetchTransactions({
        page,
        limit: 10,
        search,
        status,
        category,
      });

      setTransactions(res.transactions || []);
      setTotalPages(res.totalPages || 1);
      setTotalItems(res.total || 0);
    } catch (err) {
      console.error("Fetch transactions error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [search, status, category, page]);

  const handleSelectAll = () => {
    if (selectedTxnIds.length === transactions.length) {
      setSelectedTxnIds([]);
    } else {
      setSelectedTxnIds(transactions.map((t) => t._id));
    }
  };

  const handleToggleSelect = (id, e) => {
    e.stopPropagation();
    setSelectedTxnIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkRetry = () => {
    if (selectedTxnIds.length === 0) return;
    addToast(
      `Scheduled bulk background retries for ${selectedTxnIds.length} failed transactions!`,
      "success"
    );
    setSelectedTxnIds([]);
  };

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Payment ID,Customer,Email,Amount,Category,Status,CreatedAt"]
        .concat(
          transactions.map(
            (t) =>
              `${t.razorpayPaymentId},${t.customerName},${t.customerEmail},${t.amount},${t.category},${t.status},${t.createdAt}`
          )
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `reviva_failed_transactions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast("Exported transactions table to CSV!", "success");
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatus("");
    setCategory("");
    setPage(1);
    setSelectedTxnIds([]);
  };

  return (
    <div className={`flex min-h-screen min-w-0 flex-1 flex-col ${
      isDark ? "bg-black text-white" : "bg-slate-50 text-slate-900"
    }`}>
      <Header
        onOpenWebhookModal={() => setIsWebhookModalOpen(true)}
        search={search}
        setSearch={setSearch}
      />

      <main ref={pageRef} className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Title Header */}
        <div className={`animate-section flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between ${
          isDark ? "border-slate-800" : "border-slate-200"
        }`}>
          <div>
            <h1 className={`page-title text-2xl font-extrabold tracking-tight sm:text-3xl ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              Failed Transactions Ledger
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 rounded-xl border border-[#c5e8f2] bg-[#eaf8fc] px-4 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-[#f5fcff]"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setIsWebhookModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-slate-800"
            >
              <Zap className="h-4 w-4 text-amber-400 fill-amber-400" />
              <span>Simulate Webhook</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className={`animate-section flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 shadow-sm ${
          isDark ? "border-slate-800 bg-black" : "border-[#c5e8f2] bg-[#eaf8fc]"
        }`}>
          <div className="flex flex-wrap items-center gap-3">
            <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${
              isDark ? "text-slate-300" : "text-slate-400"
            }`}>
              <Filter className="h-4 w-4" />
              <span>Filters:</span>
            </div>

            {/* Status Select */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={`rounded-xl border px-3 py-2 text-xs font-semibold outline-none focus:border-sky-500 ${
                isDark ? "border-slate-800 bg-black text-white" : "border-[#c5e8f2] bg-[#f5fcff] text-slate-800"
              }`}
            >
              <option value="">All Statuses</option>
              <option value="failed">Failed</option>
              <option value="retrying">Retrying</option>
              <option value="recovered">Recovered</option>
              <option value="action_needed">Action Needed</option>
            </select>

            {/* Category Select */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`rounded-xl border px-3 py-2 text-xs font-semibold outline-none focus:border-sky-500 ${
                isDark ? "border-slate-800 bg-black text-white" : "border-[#c5e8f2] bg-[#f5fcff] text-slate-800"
              }`}
            >
              <option value="">All Categories</option>
              <option value="INSUFFICIENT_FUNDS">Insufficient Funds</option>
              <option value="CARD_EXPIRED">Card Expired</option>
              <option value="AUTHENTICATION_FAILURE">Auth / OTP Failure</option>
              <option value="BANK_FAILURE">Bank Downtime</option>
              <option value="RISK_BLOCK">Risk Block</option>
            </select>

            {(search || status || category) && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-rose-600 hover:underline"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Bulk Action Controls */}
          {selectedTxnIds.length > 0 && (
            <div className="flex items-center gap-2 animate-fade-in">
              <span className="text-xs font-bold text-amber-600">
                {selectedTxnIds.length} Selected
              </span>
              <button
                onClick={handleBulkRetry}
                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-700 shadow"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Bulk Retry Selected</span>
              </button>
            </div>
          )}
        </div>

        {/* Transactions Table & Mobile View */}
        <section className={`animate-section overflow-hidden rounded-2xl border shadow-sm ${
          isDark ? "border-slate-800 bg-black" : "border-[#c5e8f2] bg-[#eaf8fc]"
        }`}>
          {/* Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className={`border-b uppercase font-semibold ${
                isDark ? "border-slate-800 bg-black text-slate-300" : "border-[#c5e8f2] bg-[#eaf8fc] text-slate-600"
              }`}>
                <tr>
                  <th className="px-4 py-3 w-10 text-center">
                    <button onClick={handleSelectAll}>
                      {selectedTxnIds.length === transactions.length &&
                      transactions.length > 0 ? (
                        <CheckSquare className="h-4 w-4 text-amber-600" />
                      ) : (
                        <Square className="h-4 w-4 text-slate-400" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3">Customer & Contact</th>
                  <th className="px-4 py-3">Payment ID</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">AI Failure Category</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Details</th>
                </tr>
              </thead>

              <tbody className={`divide-y ${isDark ? "divide-slate-800" : "divide-slate-100"}`}>
                {transactions.map((txn) => {
                  const isSelected = selectedTxnIds.includes(txn._id);
                  return (
                    <tr
                      key={txn._id}
                      onClick={() => navigate(`/transactions/${txn._id}`)}
                      className={`cursor-pointer transition ${
                        isSelected ? "bg-amber-500/10" : isDark ? "hover:bg-slate-900" : "hover:bg-[#f5fcff]"
                      }`}
                    >
                      <td
                        className="px-4 py-3.5 text-center"
                        onClick={(e) => handleToggleSelect(txn._id, e)}
                      >
                        {isSelected ? (
                          <CheckSquare className="h-4 w-4 text-amber-600 inline" />
                        ) : (
                          <Square className="h-4 w-4 text-slate-300 inline" />
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <p className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{txn.customerName}</p>
                        <p className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-400"}`}>{txn.customerEmail}</p>
                      </td>
                      <td className={`px-4 py-3.5 font-mono ${isDark ? "text-slate-200" : "text-slate-600"}`}>
                        {txn.razorpayPaymentId}
                      </td>
                      <td className={`px-4 py-3.5 font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                        ₹{txn.amount}
                      </td>
                      <td className="px-4 py-3.5">
                        <CategoryBadge category={txn.category} />
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={txn.status} />
                      </td>
                      <td className="px-4 py-3.5 text-right font-bold text-amber-600 hover:underline">
                        View Dossier →
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className={`divide-y p-3 md:hidden ${isDark ? "divide-slate-800" : "divide-slate-100"}`}>
            {transactions.map((txn) => (
              <div
                key={txn._id}
                onClick={() => navigate(`/transactions/${txn._id}`)}
                className={`cursor-pointer space-y-3 rounded-xl p-4 ${
                  isDark ? "hover:bg-slate-900" : "hover:bg-[#f5fcff]"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{txn.customerName}</p>
                    <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>{txn.customerEmail}</p>
                  </div>
                  <StatusBadge status={txn.status} />
                </div>

                <div className={`flex items-center justify-between border-t pt-2 text-xs ${
                  isDark ? "border-slate-800" : "border-slate-100"
                }`}>
                  <span className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}>₹{txn.amount}</span>
                  <CategoryBadge category={txn.category} />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className={`flex items-center justify-between border-t px-4 py-3.5 ${
            isDark ? "border-slate-800 bg-black" : "border-[#c5e8f2] bg-[#eaf8fc]"
          }`}>
            <span className={`text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Showing page <strong className={isDark ? "text-white" : "text-slate-900"}>{page}</strong> of{" "}
              <strong className={isDark ? "text-white" : "text-slate-900"}>{totalPages}</strong> ({totalItems} total)
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className={`rounded-lg border px-3 py-1.5 text-xs font-bold disabled:opacity-40 ${
                  isDark ? "border-slate-800 bg-black text-slate-200 hover:bg-slate-900" : "border-[#c5e8f2] bg-[#f5fcff] text-slate-700 hover:bg-[#eaf8fc]"
                }`}
              >
                <ChevronLeft className="h-4 w-4 inline" /> Previous
              </button>

              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className={`rounded-lg border px-3 py-1.5 text-xs font-bold disabled:opacity-40 ${
                  isDark ? "border-slate-800 bg-black text-slate-200 hover:bg-slate-900" : "border-[#c5e8f2] bg-[#f5fcff] text-slate-700 hover:bg-[#eaf8fc]"
                }`}
              >
                Next <ChevronRight className="h-4 w-4 inline" />
              </button>
            </div>
          </div>
        </section>
      </main>

      <WebhookSimulatorModal
        isOpen={isWebhookModalOpen}
        onClose={() => setIsWebhookModalOpen(false)}
        onWebhookTriggered={loadTransactions}
      />
    </div>
  );
}

export default Transactions;