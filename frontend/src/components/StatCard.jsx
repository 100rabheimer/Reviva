import { TrendingUp, ArrowUpRight } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function StatCard({ label, value, trend = "+12.4%", subtitle = "vs previous 30 days", icon: Icon, color = "amber", className = "" }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`${className} group relative overflow-hidden rounded-2xl border p-5 shadow-sm transition-all ${
      isDark
        ? "border-slate-800 bg-black hover:border-slate-700 hover:bg-slate-950"
        : "border-sky-100 bg-white hover:border-sky-200 hover:shadow-md"
    }`}>
      <div className="flex items-center justify-between">
        <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-300" : "text-slate-500"}`}>
          {label}
        </p>

        {Icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-700 transition group-hover:bg-sky-200 group-hover:text-sky-800">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <h3 className={`text-2xl font-bold tracking-tight sm:text-3xl ${isDark ? "text-white" : "text-slate-900"}`}>
          {value}
        </h3>

        {trend && (
          <span className="inline-flex items-center gap-0.5 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
            <TrendingUp className="h-3 w-3 text-emerald-600" />
            {trend}
          </span>
        )}
      </div>

      <p className={`mt-2 text-[11px] font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
        {subtitle}
      </p>
    </div>
  );
}

export default StatCard;