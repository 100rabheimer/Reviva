import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import CategoryBadge from "../components/CategoryBadge";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/dashboard/stats")
      .then((response) => response.json())
      .then((data) => {
        setStats(data);
      })
      .catch((error) => {
        console.log("Failed to fetch stats:", error);
      });

    fetch("http://localhost:3000/api/transactions?page=1&limit=5")
      .then((response) => response.json())
      .then((data) => {
        setTransactions(data.transactions);
      })
      .catch((error) => {
        console.log("Failed to fetch transactions:", error);
      });
  }, []);

  return (
    <main className="flex-1 p-8">
      <p className="text-sm text-zinc-500">
        PAYMENT RECOVERY
      </p>

      <h1 className="mt-2 text-3xl font-semibold text-[#1F1F1C]">
        Dashboard
      </h1>

      <p className="mt-2 text-zinc-600">
        Monitor failed payments and recovery performance.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Total Transactions"
          value={stats?.totalTransactions ?? 0}
        />

        <StatCard
          label="Failed Payments"
          value={stats?.failedTransactions ?? 0}
        />

        <StatCard
          label="Recovered"
          value={stats?.recoveredTransactions ?? 0}
        />

        <StatCard
          label="Failed Amount"
          value={`₹${stats?.totalFailedAmount ?? 0}`}
        />

        <StatCard
          label="Retry Attempts"
          value={stats?.totalRetryAttempts ?? 0}
        />
      </div>

      <section className="mt-8">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-[#1F1F1C]">
            Recent Transactions
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Latest payment activity.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-[#DDD8CF] bg-white">
          <div className="grid grid-cols-4 gap-4 border-b border-[#DDD8CF] bg-[#FAF9F6] px-5 py-3">
            <p className="text-xs font-medium uppercase text-zinc-500">
              Customer
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
              className="grid grid-cols-4 items-center gap-4 border-b border-[#EEEAE3] px-5 py-4 last:border-b-0"
            >
              <div>
                <p className="text-sm font-medium text-[#1F1F1C]">
                  {transaction.customerName}
                </p>

                <p className="text-xs text-zinc-500">
                  {transaction.customerEmail}
                </p>
              </div>

              <p className="text-sm text-[#1F1F1C]">
                ₹{transaction.amount}
              </p>

              <CategoryBadge category={transaction.category} />

              <StatusBadge status={transaction.status} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Dashboard;