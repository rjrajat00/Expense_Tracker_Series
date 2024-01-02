const express = require("express");
const orderController = require("../controllers/orderController");
const verifyToken = require("../../middleware/auth");
const { leaderBoard } = require("../controllers/premiumFeatures");
const forgotPassDetails = require("../controllers/forgotPassController");

const router = express.Router();

// Handling Premium memberhship  from Razorpay

router.post("/premium", verifyToken, orderController.buyPremium);

router.post("/update/status", verifyToken, orderController.updateTxnStatus);

router.get("/premium/status", verifyToken, orderController.checkPremiumStatus);

router.get("/features", verifyToken, leaderBoard);

// Handling Forgotten password recorvery details
router.post("/forgotPassword", forgotPassDetails.forgotPass);

router.get("/resetPassword/:id", forgotPassDetails.resetpassword);

router.get(
  "/updatepassword/:resetpasswordid",
  forgotPassDetails.updatepassword
);

module.exports = router;
