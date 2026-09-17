function CategoryBadge({ category }) {
  const configs = {
    INSUFFICIENT_FUNDS: {
      label: "Insufficient Funds",
      styles: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-200 dark:border-rose-300/30",
    },
    CARD_EXPIRED: {
      label: "Card Expired",
      styles: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-200 dark:border-sky-300/30",
    },
    AUTHENTICATION_FAILURE: {
      label: "OTP / Auth Failed",
      styles: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-violet-500/10 dark:text-violet-200 dark:border-violet-300/30",
    },
    BANK_FAILURE: {
      label: "Bank Downtime",
      styles: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-200 dark:border-amber-300/30",
    },
    RISK_BLOCK: {
      label: "Risk Block",
      styles: "bg-red-50 text-red-800 border-red-300 font-bold dark:bg-red-500/10 dark:text-red-200 dark:border-red-300/30",
    },
    UNCLASSIFIED: {
      label: "Unclassified",
      styles: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-200 dark:border-slate-300/30",
    },
  };

  const config = configs[category] || {
    label: category || "Unclassified",
    styles: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-0.5 text-xs font-semibold ${config.styles}`}
    >
      {config.label}
    </span>
  );
}

export default CategoryBadge;