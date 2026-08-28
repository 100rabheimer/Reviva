require("dotenv").config();
const crypto = require("crypto");

const payload = JSON.stringify({
  event: "payment.failed",
  payload: {
    payment: {
      entity: {
id: "pay_day4_test_002",
        amount: 129900,
        status: "failed",
        email: "rahul@example.com",
        error_reason: "insufficient_funds",
        error_description: "Insufficient funds",
        notes: {
          customerName: "Rahul"
        }
      }
    }
  }
});

const signature = crypto
  .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
  .update(payload)
  .digest("hex");

console.log("Payload:");
console.log(payload);

console.log("\nSignature:");
console.log(signature);