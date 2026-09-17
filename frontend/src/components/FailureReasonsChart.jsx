import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#EF4444", "#F59E0B", "#3B82F6", "#8B5CF6", "#EC4899"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-sky-100 bg-white/95 p-3 shadow-xl backdrop-blur-md text-xs text-slate-700">
        <p className="font-bold text-slate-700 mb-1">{data.label || data.category}</p>
        <p className="text-slate-500">
          Count: <span className="font-bold text-slate-900">{data.count}</span> ({data.percentage || 20}%)
        </p>
      </div>
    );
  }
  return null;
};

function FailureReasonsChart({ data }) {
  const chartData =
    data && data.length > 0
      ? data
      : [
          { label: "Insufficient Funds", count: 42, percentage: 38 },
          { label: "Bank Server Timeout", count: 29, percentage: 26 },
          { label: "Card Expired", count: 18, percentage: 16 },
          { label: "OTP / 3DS Failure", count: 14, percentage: 13 },
          { label: "Fraud & Risk Block", count: 8, percentage: 7 },
        ];

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={4}
            dataKey="count"
            nameKey="label"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="transparent"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default FailureReasonsChart;