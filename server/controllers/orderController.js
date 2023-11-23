// Import necessary modules
const Razorpay = require("razorpay");
const Order = require("../models/order");
const SignUp = require("../models/newUser");

let rzp = new Razorpay({
  key_id: "rzp_test_FsjhNXyL5SpugN",
  key_secret: "7XGLMB9LfRVaARluv1AJx2XS",
});

const buyPremium = async (req, res) => {
  try {
    const amount = req.body.amount;
    const signUpId = req.decoded.id;

    const options = {
      amount: amount,
      currency: "INR",
      receipt: "order_rcptid_" + Date.now(),
    };

    rzp.orders.create(options, async (err, order) => {
      if (err) {
        console.error("Error creating Razorpay order:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      await Order.create({
        orderId: order.id,
        signUpId: signUpId,
        status: "pending",
      });

      res.json({ orderId: order.id, amount: order.amount });
    });
  } catch (error) {
    console.error("Error in creating Razorpay order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateTxnStatus = async (req, res) => {
  try {
    const { paymentId, order_id } = req.body;

    console.log(
      "Server Side <><>< payment_Id=>",
      paymentId,
      "order_id=>",
      order_id
    );

    console.log("User data from middleware:", req.SignUp);

    if (!req.SignUp) {
      throw new Error("User data is null or undefined in the middleware");
    }

    const order = await Order.findOne({ where: { orderId: order_id } });

    if (!order) {
      throw new Error("Order not found");
    }

    let promise1;

    if (paymentId) {
      promise1 = order.update({
        paymentId: paymentId,
        status: "Successful",
      });
    } else {
      promise1 = order.update({
        paymentId: paymentId,
        status: "Failure",
      });
    }

    const promise2 = req.SignUp.update({ is__Premium: true });

    await Promise.all([promise1, promise2]);

    res.status(202).json({
      success: true,
      message:
        "Transaction status and user premium status updated successfully",
    });
  } catch (error) {
    console.error(
      "Error updating transaction status and user premium status:",
      error
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const checkPremiumStatus = async (req, res) => {
  try {
    const user = await SignUp.findOne({ where: { id: req.decoded.id } });

    console.log("user.is__Premium =>", user.is__Premium);

    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json({ isPremium: user.is__Premium });
  } catch (error) {
    console.error("Error checking premium status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { buyPremium, updateTxnStatus, checkPremiumStatus };
