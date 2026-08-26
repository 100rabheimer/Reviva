const mongoose = require("mongoose");

const retryLogSchema = new mongoose.Schema(
  {
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      required: true
    },

    attemptNumber: {
      type: Number,
      required: true
    },

    scheduledAt: {
      type: Date,
      required: true
    },

    attemptedAt: {
      type: Date,
      default: null
    },

    status: {
      type: String,
      enum: ["scheduled", "success", "failed"],
      default: "scheduled"
    },

    message: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("RetryLog", retryLogSchema);