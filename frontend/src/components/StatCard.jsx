function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-[#DDD8CF] bg-white p-5">
      <p className="text-sm text-zinc-500">
        {label}
      </p>

      <h3 className="mt-2 text-3xl font-semibold text-[#1F1F1C]">
        {value}
      </h3>
    </div>
  );
}

export default StatCard;