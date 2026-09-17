function StatusBadge({ status }) {
  const configs = {
    recovered: {
      label: "Recovered",
      styles: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:border-emerald-400/30",
      dot: "bg-emerald-500 dark:bg-emerald-300",
    },
    captured: {
      label: "Recovered",
      styles: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:border-emerald-400/30",
      dot: "bg-emerald-500 dark:bg-emerald-300",
    },
    retrying: {
      label: "Retrying",
      styles: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-200 dark:border-amber-300/30",
      dot: "bg-amber-500 animate-pulse dark:bg-amber-300",
    },
    action_needed: {
      label: "Action Needed",
      styles: "bg-purple-600 text-white border-purple-800 dark:bg-purple-500/15 dark:text-purple-200 dark:border-purple-300/40",
      dot: "bg-purple-600 dark:bg-purple-300",
    },
    failed: {
      label: "Failed",
      styles: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-200 dark:border-rose-300/30",
      dot: "bg-rose-500 dark:bg-rose-300",
    },
    abandoned: {
      label: "Abandoned",
      styles: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-200 dark:border-slate-300/30",
      dot: "bg-slate-400 dark:bg-slate-300",
    },
  };

  const key = status?.toLowerCase() || "failed";
  const config = configs[key] || {
    label: status || "Failed",
    styles: "bg-rose-50 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-semibold capitalize ${config.styles}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

export default StatusBadge;