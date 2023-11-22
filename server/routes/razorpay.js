const express = require("express");
const orderController = require("../controllers/orderController");
const verifyToken = require("../../middleware/auth");

const router = express.Router();

// Handling Premium memberhship  from Razorpay

router.post("/premium", verifyToken, orderController.buyPremium);

router.post("/update/status", verifyToken, orderController.updateTxnStatus);

module.exports = router;
