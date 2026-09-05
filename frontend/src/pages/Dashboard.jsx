import { useEffect, useState, useRef } from "react";
import StatCard from "../components/StatCard";
import RecoveryTrendChart from "../components/RecoveryTrendChart";
import FailureReasonsChart from "../components/FailureReasonsChart";
import usePageAnimation from "../hooks/usePageAnimation";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recoveryTrendData, setRecoveryTrendData] = useState([]);
  const [failureReasonsData, setFailureReasonsData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const pageRef = useRef(null);

  usePageAnimation(pageRef);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [statsResponse, trendResponse, reasonsResponse] =
          await Promise.all([
            fetch("http://localhost:3000/api/dashboard/stats"),
            fetch("http://localhost:3000/api/dashboard/recovery-trend"),
            fetch("http://localhost:3000/api/dashboard/failure-reasons"),
          ]);

        if (
          !statsResponse.ok ||
          !trendResponse.ok ||
          !reasonsResponse.ok
        ) {
          throw new Error("Failed to load dashboard");
        }

        const statsData = await statsResponse.json();
        const trendData = await trendResponse.json();
        const reasonsData = await reasonsResponse.json();

        console.log("Dashboard stats:", statsData);
        console.log("Recovery trend:", trendData);
        console.log("Failure reasons:", reasonsData);

        setStats(statsData);
        setRecoveryTrendData(trendData);
        setFailureReasonsData(reasonsData);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
        setError("Failed to load dashboard data.");
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };

    loadDashboard();
  }, []);

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <p className="text-sm text-zinc-500">
          PAYMENT RECOVERY
        </p>

        <div className="mt-2 h-9 w-48 animate-pulse rounded bg-zinc-200" />

        <div className="mt-3 h-5 w-72 animate-pulse rounded bg-zinc-100" />

        {/* Skeleton Stat Cards */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-xl border border-[#DDD8CF] bg-white p-5"
            >
              <div className="h-4 w-24 rounded bg-zinc-200" />

              <div className="mt-4 h-8 w-16 rounded bg-zinc-200" />
            </div>
          ))}
        </div>

        {/* Skeleton Charts */}
        <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
          {[1, 2].map((item) => (
            <section
              key={item}
              className="h-[420px] animate-pulse rounded-xl border border-[#DDD8CF] bg-white p-4 sm:p-6"
            >
              <div className="h-6 w-40 rounded bg-zinc-200" />

              <div className="mt-3 h-4 w-64 max-w-full rounded bg-zinc-100" />

              <div className="mt-8 h-[280px] rounded-lg bg-zinc-100" />
            </section>
          ))}
        </div>
      </main>
    );
  }

  /* ---------------- ERROR ---------------- */

  if (error) {
    return (
      <main className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="text-lg font-semibold text-red-700">
            Something went wrong
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-[#1F1F1C] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  /* ---------------- DASHBOARD ---------------- */

  return (
    <main
      ref={pageRef}
      className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8"
    >
      {/* Heading */}

      <div className="animate-section">
        <p className="text-xs sm:text-sm text-zinc-500">
          PAYMENT RECOVERY
        </p>

        <h1 className="page-title mt-2 text-2xl font-semibold text-[#1F1F1C] sm:text-3xl">
          Dashboard
        </h1>

        <p className="page-subtitle mt-2 text-sm sm:text-base text-zinc-600">
          Monitor failed payments and recovery performance.
        </p>
      </div>

      {/* Stats Cards */}

      <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="animate-card">
          <StatCard
            label="Total Transactions"
            value={stats?.totalTransactions ?? 0}
          />
        </div>

        <div className="animate-card">
          <StatCard
            label="Failed Payments"
            value={stats?.failedTransactions ?? 0}
          />
        </div>

        <div className="animate-card">
          <StatCard
            label="Recovered"
            value={stats?.recoveredTransactions ?? 0}
          />
        </div>

        <div className="animate-card">
          <StatCard
            label="Failed Amount"
            value={`₹${stats?.totalFailedAmount ?? 0}`}
          />
        </div>

        <div className="animate-card">
          <StatCard
            label="Retry Attempts"
            value={stats?.totalRetryAttempts ?? 0}
          />
        </div>
      </div>

      {/* Charts */}

      <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Recovery Trend */}

        <section className="animate-section min-w-0 rounded-xl border border-[#DDD8CF] bg-white p-4 sm:p-6">
          <h2 className="text-base font-semibold text-[#1F1F1C] sm:text-lg">
            Recovery Trend
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Recovered payments over time.
          </p>

          <div className="mt-6 w-full overflow-x-auto">
            {recoveryTrendData.length > 0 ? (
              <RecoveryTrendChart data={recoveryTrendData} />
            ) : (
              <div className="flex h-[300px] items-center justify-center text-center text-sm text-zinc-500">
                No recovered payments yet.
              </div>
            )}
          </div>
        </section>

        {/* Failure Reasons */}

        <section className="animate-section min-w-0 rounded-xl border border-[#DDD8CF] bg-white p-4 sm:p-6">
          <h2 className="text-base font-semibold text-[#1F1F1C] sm:text-lg">
            Failure Reasons
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Most common payment failure categories.
          </p>

          <div className="mt-6 w-full overflow-x-auto">
            {failureReasonsData.length > 0 ? (
              <FailureReasonsChart data={failureReasonsData} />
            ) : (
              <div className="flex h-[300px] items-center justify-center text-center text-sm text-zinc-500">
                No failure data available.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default Dashboard;