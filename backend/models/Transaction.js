const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    razorpayPaymentId: {
      type: String,
      required: true,
      unique: true
    },

    customerName: {
      type: String
    },

    customerEmail: {
      type: String,
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      required: true
    },

    failureReason: {
      type: String,
      required: true
    },

    category: {
      type: String,
      default: "UNCLASSIFIED"
    },

    retryCount: {
      type: Number,
      default: 0
    },

    nextRetryAt: {
      type: Date,
      default: null
    },

    aiMessage: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);