const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const RetryLog = require("../models/RetryLog");

router.get("/stats", async (req, res) => {
  try {
    const totalTransactions = await Transaction.countDocuments();

    const failedTransactions = await Transaction.countDocuments({
      status: "failed"
    });

    const recoveredTransactions = await Transaction.countDocuments({
      status: "captured"
    });

    const failedAmountResult = await Transaction.aggregate([
      {
        $match: {
          status: "failed"
        }
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount"
          }
        }
      }
    ]);

    const totalFailedAmount =
      failedAmountResult.length > 0
        ? failedAmountResult[0].total
        : 0;

    const totalRetryAttempts = await RetryLog.countDocuments();

    res.status(200).json({
      totalTransactions,
      failedTransactions,
      recoveredTransactions,
      totalFailedAmount,
      totalRetryAttempts
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;