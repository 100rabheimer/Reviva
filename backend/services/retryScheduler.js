const cron = require("node-cron");
const Transaction = require("../models/Transaction");
const RetryLog = require("../models/RetryLog");

function startRetryScheduler() {
  cron.schedule("* * * * *", async () => {
    try {
      console.log("Checking for due retries...");

      const now = new Date();

      const dueTransactions = await Transaction.find({
        status: "failed",
        nextRetryAt: { $lte: now },
        retryCount: { $lt: 3 }
      });

      console.log("Due retries found:", dueTransactions.length);

      for (const transaction of dueTransactions) {
        await RetryLog.create({
          transactionId: transaction._id,
          attemptNumber: transaction.retryCount + 1,
          scheduledAt: transaction.nextRetryAt,
          attemptedAt: new Date(),
          status: "failed",
          message: `Retry attempt simulated for ${transaction.razorpayPaymentId}`
        });

       transaction.retryCount += 1;

if (transaction.retryCount < 3) {
  transaction.nextRetryAt = new Date(
    Date.now() + 2 * 60 * 1000
  );
} else {
  transaction.nextRetryAt = null;
}

await transaction.save();

        console.log(
          "Retry processed:",
          transaction.razorpayPaymentId
        );
      }
    } catch (error) {
      console.log("Retry scheduler error:", error.message);
    }
  });
}

module.exports = startRetryScheduler;