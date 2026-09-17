import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-sky-100 bg-white/95 p-3 text-xs text-slate-700 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-black dark:text-slate-200">
        <p className="mb-2 border-b border-sky-100 pb-1 font-bold text-slate-700 dark:border-slate-800 dark:text-white">{label}</p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4 py-0.5">
            <span style={{ color: entry.color }} className="font-medium">
              {entry.name}:
            </span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              ₹{entry.value?.toLocaleString("en-IN")}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

function RecoveryTrendChart({ data }) {
  const chartData = data && data.length > 0 ? data : [
    { date: "Sep 01", recoveredAmount: 4200, failedAmount: 8500 },
    { date: "Sep 03", recoveredAmount: 6800, failedAmount: 9200 },
    { date: "Sep 05", recoveredAmount: 9500, failedAmount: 4300 },
    { date: "Sep 07", recoveredAmount: 11200, failedAmount: 6100 },
    { date: "Sep 09", recoveredAmount: 8400, failedAmount: 7800 },
    { date: "Sep 11", recoveredAmount: 14600, failedAmount: 3200 },
    { date: "Sep 13", recoveredAmount: 12900, failedAmount: 5100 },
    { date: "Sep 15", recoveredAmount: 16800, failedAmount: 2900 },
  ];

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="recoveredGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="failedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis dataKey="date" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fill: "#64748B", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${v / 1000}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />

          <Area
            type="monotone"
            dataKey="recoveredAmount"
            name="Recovered Revenue"
            stroke="#10B981"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#recoveredGrad)"
          />
          <Area
            type="monotone"
            dataKey="failedAmount"
            name="Failed Amount"
            stroke="#F43F5E"
            strokeWidth={2}
            strokeDasharray="4 4"
            fillOpacity={1}
            fill="url(#failedGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RecoveryTrendChart;