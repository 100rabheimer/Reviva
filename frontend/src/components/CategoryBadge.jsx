function CategoryBadge({ category }) {
  const labels = {
    INSUFFICIENT_FUNDS: "Insufficient Funds",
    CARD_EXPIRED: "Card Expired",
    AUTHENTICATION_FAILURE: "Authentication Failed",
    BANK_FAILURE: "Bank Failure",
    RISK_BLOCK: "Risk Block",
    UNCLASSIFIED: "Unclassified"
  };

  const label = labels[category] || category;

  return (
    <span className="inline-flex rounded-md bg-[#F3EFE7] px-2.5 py-1 text-xs font-medium text-[#5C554B]">
      {label}
    </span>
  );
}

export default CategoryBadge;