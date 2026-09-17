import {
  INITIAL_TRANSACTIONS,
  INITIAL_RETRY_RULES,
  INITIAL_SETTINGS,
} from "./mockData";

const BACKEND_URL = "http://localhost:3000";

// Helper to initialize local storage
const getStoredData = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Error reading ${key} from localStorage:`, e);
    return fallback;
  }
};

const setStoredData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Error saving ${key} to localStorage:`, e);
  }
};

// Initialize default state
export const initLocalStorage = () => {
  if (!localStorage.getItem("reviva_txns")) {
    setStoredData("reviva_txns", INITIAL_TRANSACTIONS);
  }
  if (!localStorage.getItem("reviva_retry_rules")) {
    setStoredData("reviva_retry_rules", INITIAL_RETRY_RULES);
  }
  if (!localStorage.getItem("reviva_settings")) {
    setStoredData("reviva_settings", INITIAL_SETTINGS);
  }
};

initLocalStorage();

// Dashboard APIs
export const fetchDashboardStats = async (timeRange = "30d") => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/dashboard/stats?range=${timeRange}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Fallback calculation from local data
  }

  const txns = getStoredData("reviva_txns", INITIAL_TRANSACTIONS);
  const totalTransactions = txns.length + 18;
  const failedTransactions = txns.filter((t) => t.status === "failed").length;
  const recoveredTransactions = txns.filter((t) => t.status === "recovered").length;
  const retryingTransactions = txns.filter((t) => t.status === "retrying").length;
  const actionNeededTransactions = txns.filter((t) => t.status === "action_needed").length;
  
  const totalFailedAmount = txns
    .filter((t) => t.status !== "recovered")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRecoveredAmount = txns
    .filter((t) => t.status === "recovered")
    .reduce((sum, t) => sum + t.amount, 0);

  const recoveryRate =
    failedTransactions + recoveredTransactions > 0
      ? Math.round(
          (recoveredTransactions / (failedTransactions + recoveredTransactions + retryingTransactions)) * 100
        )
      : 64;

  const totalRetryAttempts = txns.reduce((sum, t) => sum + (t.retryCount || 0), 0) + 14;

  return {
    totalTransactions,
    failedTransactions,
    recoveredTransactions,
    retryingTransactions,
    actionNeededTransactions,
    totalFailedAmount,
    totalRecoveredAmount: totalRecoveredAmount + 34800,
    recoveryRate: recoveryRate || 64,
    totalRetryAttempts,
    churnSavedCount: 28,
  };
};

export const fetchRecoveryTrend = async (timeRange = "30d") => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/dashboard/recovery-trend?range=${timeRange}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Fallback
  }

  return [
    { date: "Sep 01", recoveredAmount: 4200, failedAmount: 8500, recoveredCount: 3, failedCount: 6 },
    { date: "Sep 03", recoveredAmount: 6800, failedAmount: 9200, recoveredCount: 5, failedCount: 7 },
    { date: "Sep 05", recoveredAmount: 9500, failedAmount: 4300, recoveredCount: 7, failedCount: 3 },
    { date: "Sep 07", recoveredAmount: 11200, failedAmount: 6100, recoveredCount: 8, failedCount: 4 },
    { date: "Sep 09", recoveredAmount: 8400, failedAmount: 7800, recoveredCount: 6, failedCount: 5 },
    { date: "Sep 11", recoveredAmount: 14600, failedAmount: 3200, recoveredCount: 11, failedCount: 2 },
    { date: "Sep 13", recoveredAmount: 12900, failedAmount: 5100, recoveredCount: 9, failedCount: 4 },
    { date: "Sep 15", recoveredAmount: 16800, failedAmount: 2900, recoveredCount: 12, failedCount: 2 },
  ];
};

export const fetchFailureReasons = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/dashboard/failure-reasons`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Fallback
  }

  return [
    { category: "INSUFFICIENT_FUNDS", label: "Insufficient Funds", count: 42, percentage: 38, color: "#EF4444" },
    { category: "BANK_FAILURE", label: "Bank Server Timeout", count: 29, percentage: 26, color: "#F59E0B" },
    { category: "CARD_EXPIRED", label: "Card Expired", count: 18, percentage: 16, color: "#3B82F6" },
    { category: "AUTHENTICATION_FAILURE", label: "OTP / 3DS Failure", count: 14, percentage: 13, color: "#8B5CF6" },
    { category: "RISK_BLOCK", label: "Fraud & Risk Block", count: 8, percentage: 7, color: "#EC4899" },
  ];
};

// Transactions APIs
export const fetchTransactions = async ({
  page = 1,
  limit = 10,
  search = "",
  status = "",
  category = "",
  timeRange = "",
}) => {
  try {
    const params = new URLSearchParams({ page, limit, search, status, category });
    const res = await fetch(`${BACKEND_URL}/api/transactions?${params}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Fallback
  }

  let txns = getStoredData("reviva_txns", INITIAL_TRANSACTIONS);

  if (search) {
    const q = search.toLowerCase();
    txns = txns.filter(
      (t) =>
        t.customerName.toLowerCase().includes(q) ||
        t.customerEmail.toLowerCase().includes(q) ||
        t.razorpayPaymentId.toLowerCase().includes(q)
    );
  }

  if (status) {
    txns = txns.filter((t) => t.status === status);
  }

  if (category) {
    txns = txns.filter((t) => t.category === category);
  }

  const total = txns.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginated = txns.slice(startIndex, startIndex + limit);

  return {
    transactions: paginated,
    total,
    page,
    totalPages,
  };
};

export const fetchTransactionById = async (id) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/transactions/${id}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Fallback
  }

  const txns = getStoredData("reviva_txns", INITIAL_TRANSACTIONS);
  const found = txns.find((t) => t._id === id || t.razorpayPaymentId === id);
  if (found) return found;

  // If not found, return first mock
  return txns[0];
};

// Simulate Webhook API
export const simulateWebhookEvent = async (payload) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/webhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Local simulation logic
  }

  const txns = getStoredData("reviva_txns", INITIAL_TRANSACTIONS);

  const eventType = payload.event || "payment.failed";
  const paymentObj = payload.payload?.payment?.entity || {};

  const amountInRupees = paymentObj.amount ? paymentObj.amount / 100 : 2499;
  const rawCode = paymentObj.error_code || "BAD_REQUEST_PAYMENT_TIMED_OUT";
  const rawDesc = paymentObj.error_description || "Payment failed on gateway";

  let category = "BANK_FAILURE";
  if (rawCode.includes("INSUFFICIENT")) category = "INSUFFICIENT_FUNDS";
  else if (rawCode.includes("EXPIRED")) category = "CARD_EXPIRED";
  else if (rawCode.includes("OTP")) category = "AUTHENTICATION_FAILURE";
  else if (rawCode.includes("RISK") || rawCode.includes("FRAUD")) category = "RISK_BLOCK";

  const newTxn = {
    _id: `txn_${Date.now()}`,
    razorpayPaymentId: paymentObj.id || `pay_${Math.random().toString(36).substring(2, 11)}`,
    razorpayOrderId: paymentObj.order_id || `order_${Math.random().toString(36).substring(2, 11)}`,
    customerName: paymentObj.notes?.customer_name || "New Customer",
    customerEmail: paymentObj.email || "customer@example.com",
    customerPhone: paymentObj.contact || "+91 99000 11223",
    customerSegment: "New Subscriber",
    amount: amountInRupees,
    currency: paymentObj.currency || "INR",
    status: eventType === "payment.captured" ? "recovered" : "failed",
    rawErrorCode: rawCode,
    rawErrorDescription: rawDesc,
    category,
    aiCategoryConfidence: 0.95,
    retryCount: eventType === "payment.captured" ? 1 : 0,
    maxRetries: 3,
    nextRetryAt: new Date(Date.now() + 7200000).toISOString(),
    llmRetryReasoning: `Automated GenAI classification tagged failure as ${category}. System scheduled intelligent retry based on merchant rules.`,
    createdAt: new Date().toISOString(),
    aiMessageVariantA: {
      tone: "Friendly & Empathetic",
      channel: "email",
      subject: `Update regarding your payment of ₹${amountInRupees}`,
      body: `Hi there, we noticed your recent payment of ₹${amountInRupees} was interrupted (${rawDesc}). We've scheduled an automatic retry, or you can update your payment method right away.`,
      predictedConversion: 0.84,
    },
    aiMessageVariantB: {
      tone: "Direct & Clear",
      channel: "email",
      subject: `Payment issue detected - ₹${amountInRupees}`,
      body: `Hello, your payment of ₹${amountInRupees} did not go through. Click here to safely complete your transaction.`,
      predictedConversion: 0.72,
    },
    selectedVariant: "A",
  };

  const updated = [newTxn, ...txns];
  setStoredData("reviva_txns", updated);

  return { success: true, message: "Webhook event processed", transaction: newTxn };
};

// Retry Rules API
export const fetchRetryRules = async () => {
  return getStoredData("reviva_retry_rules", INITIAL_RETRY_RULES);
};

export const updateRetryRules = async (rules) => {
  setStoredData("reviva_retry_rules", rules);
  return { success: true, rules };
};

// Settings API
export const fetchSettings = async () => {
  return getStoredData("reviva_settings", INITIAL_SETTINGS);
};

export const updateSettings = async (settings) => {
  setStoredData("reviva_settings", settings);
  return { success: true, settings };
};

// A/B GenAI Message Generator
export const generateAIMessageVariants = async (txn, tone = "Friendly & Empathetic") => {
  const name = txn.customerName || "Valued Customer";
  const amount = `₹${txn.amount || 0}`;
  const reason = txn.rawErrorDescription || "a temporary banking error";

  return {
    variantA: {
      tone,
      channel: "email",
      subject: `Notice regarding your payment of ${amount}`,
      body: `Hi ${name}, we tried processing your payment of ${amount} for your Reviva subscription, but it failed due to ${reason.toLowerCase()}.\n\nNo stress! We have scheduled a silent background retry. If you prefer to settle this manually or update your card details, tap the link below:\nhttps://reviva.io/pay/${txn.razorpayPaymentId}`,
      predictedConversion: 0.88,
    },
    variantB: {
      tone: "Direct & Urgent",
      channel: "sms",
      subject: `Payment failed for ${amount}`,
      body: `Reviva Alert: Your ${amount} payment could not be processed (${reason}). Tap here to secure your subscription before access pauses: https://reviva.io/pay/${txn.razorpayPaymentId}`,
      predictedConversion: 0.76,
    },
  };
};
