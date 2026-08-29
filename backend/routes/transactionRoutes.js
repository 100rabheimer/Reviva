const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

// GET all transactions
router.get("/", async (req, res) => {
  try {
    const {
      status,
      category,
      search,
      page = 1,
      limit = 10
    } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        {
          customerName: {
            $regex: search,
            $options: "i"
          }
        },
        {
          customerEmail: {
            $regex: search,
            $options: "i"
          }
        },
        {
          razorpayPaymentId: {
            $regex: search,
            $options: "i"
          }
        }
      ];
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const skip = (pageNumber - 1) * limitNumber;

    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    const total = await Transaction.countDocuments(filter);

    res.status(200).json({
      transactions,
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / limitNumber)
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
//! single transaction detail api---jb koi user kisi transaction pe click krega uska detail chahiye hoga
router.get("/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found"
      });
    }

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;