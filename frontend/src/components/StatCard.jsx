import { TrendingUp, ArrowUpRight } from "lucide-react";

function StatCard({ label, value, trend = "+12.4%", subtitle = "vs previous 30 days", icon: Icon, color = "amber" }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-sky-100 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-sky-200">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </p>

        {Icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-700 transition group-hover:bg-sky-200 group-hover:text-sky-800">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <h3 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {value}
        </h3>

        {trend && (
          <span className="inline-flex items-center gap-0.5 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
            <TrendingUp className="h-3 w-3 text-emerald-600" />
            {trend}
          </span>
        )}
      </div>

      <p className="mt-2 text-[11px] font-medium text-slate-500">
        {subtitle}
      </p>
    </div>
  );
}

export default StatCard;