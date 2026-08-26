require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const Transaction = require("./models/Transaction");
const app = express();
const port = 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log("MongoDB connection failed:", error.message);
  });

app.get("/", (req, res) => {
  res.send("Reviva API is working");
});

app.post("/test-transaction",async(req,res)=>{
  try{
    const transaction= await Transaction.create({
      razorpayPaymentId: "pay_test_001",
      customerName: "Rahul",
      customerEmail: "rahul@example.com",
      amount: 999,
      status: "failed",
      failureReason: "insufficient_funds"
    });
      res.status(201).json(transaction);
  }
  catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
app.listen(port, () => {
  console.log(`Server is live at http://localhost:${port}`);
});