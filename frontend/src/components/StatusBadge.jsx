function StatusBadge({ status }) {
  const isFailed = status === "failed";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        isFailed
          ? "bg-red-50 text-red-700"
          : "bg-green-50 text-green-700"
      }`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;