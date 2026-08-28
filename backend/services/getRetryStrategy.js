function getRetryStrategy(category) {
  if (category === "INSUFFICIENT_FUNDS") {
    return {
      shouldRetry: true,
      delayMinutes: 2
    };
  }

  if (category === "BANK_FAILURE") {
    return {
      shouldRetry: true,
      delayMinutes: 1
    };
  }

  if (category === "AUTHENTICATION_FAILURE") {
    return {
      shouldRetry: true,
      delayMinutes: 3
    };
  }

  if (category === "CARD_EXPIRED") {
    return {
      shouldRetry: false,
      delayMinutes: null
    };
  }

  if (category === "RISK_BLOCK") {
    return {
      shouldRetry: false,
      delayMinutes: null
    };
  }

  return {
    shouldRetry: true,
    delayMinutes: 5
  };
}

module.exports = getRetryStrategy;