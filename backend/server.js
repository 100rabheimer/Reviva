require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const crypto = require("crypto");
const Transaction = require("./models/Transaction");

const app = express();
const port = process.env.PORT || 3000;
// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log("MongoDB connection failed:", error.message);
  });

// Razorpay webhook route
// Important: webhook route express.json() se pehle hai
app.post(
  "/webhooks/razorpay",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const signature = req.headers["x-razorpay-signature"];

      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
        .update(req.body)
        .digest("hex");

      if (signature !== expectedSignature) {
        return res.status(400).json({
          message: "Invalid webhook signature"
        });
      }

      const event = JSON.parse(req.body.toString());

      console.log("Verified webhook event:", event.event);

      if (event.event === "payment.failed") {
        const payment = event.payload.payment.entity;
const existingTransaction = await Transaction.findOne({
  razorpayPaymentId: payment.id
});

if (existingTransaction) {
  console.log("Duplicate webhook ignored:", payment.id);

  return res.status(200).json({
    received: true,
    duplicate: true
  });
}
        const transaction = await Transaction.create({
          razorpayPaymentId: payment.id,
          customerName: payment.notes?.customerName || "Unknown",
          customerEmail: payment.email || "unknown@example.com",
          amount: payment.amount / 100,
          status: payment.status,
          failureReason: payment.error_description || "Unknown failure"
        });

        console.log("Transaction saved:", transaction._id);
      }

      return res.status(200).json({
        received: true
      });
    } catch (error) {
      console.log("Webhook processing error:", error.message);

      return res.status(500).json({
        message: "Webhook processing failed"
      });
    }
  }
);

// Normal JSON middleware for baaki routes
app.use(express.json());

// Health route
app.get("/", (req, res) => {
  res.send("Reviva API is working");
});

app.listen(port, () => {
  console.log(`Server is live at http://localhost:${port}`);
});