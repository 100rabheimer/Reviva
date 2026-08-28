function classifyFailure(payment) {
  const reason = payment.error_reason || "";

  if (reason === "insufficient_funds") {
    return "INSUFFICIENT_FUNDS";
  }

  if (reason === "expired_card") {
    return "CARD_EXPIRED";
  }

  if (
    reason === "authentication_failed" ||
    reason === "otp_attempts_exceeded"
  ) {
    return "AUTHENTICATION_FAILURE";
  }

  if (
    reason === "bank_declined" ||
    reason === "bank_not_available" ||
    reason === "payment_failed"
  ) {
    return "BANK_FAILURE";
  }

  if (
    reason === "risk_check_failed" ||
    reason === "fraudulent"
  ) {
    return "RISK_BLOCK";
  }

  return "UNCLASSIFIED";
}

module.exports = classifyFailure;