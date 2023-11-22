const Razorpay = require("razorpay");
const Order = require("../models/order");
const SignUp = require("../models/newUser");

let rzp = new Razorpay({
  key_id: "rzp_test_FsjhNXyL5SpugN",
  key_secret: "7XGLMB9LfRVaARluv1AJx2XS",
});

const buyPremium = async (req, res) => {
  // GET request from cleint side
  try {
    const amount = req.body.amount; // Amount in paise

    const signUpId = req.decoded.id;

    const options = {
      amount: amount,
      currency: "INR",
      receipt: "order_rcptid_" + Date.now(),
    };

    console.log("amount=>", amount);

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
/*const buyPremium = async (req, res) => { // GET request from cleint side
  try {
    const options = {
      amount: 5000, // amount in the smallest currency unit
      currency: "INR",
      receipt: "order_rcptid_11",
    };
    instance.orders.create(options, async (err, order) => {
      if (err) {
        console.error("Error creating Razorpay order:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      const { id: order_id } = order;
      const { paymentId } = req.body;
      const signUpId = req.decoded.id;
      const email = req.decoded.email;

      console.log(
        order_id,
        "req Body=>,",
        req.body,
        "signUpId=>",
        signUpId,
        email,
        "req params=>",
        req.params,
        "status=>",
        status
      );

      await Order.create({
        orderId: order_id,
        signUpId: signUpId,
        paymentId: paymentId,
       
      });

      res.json({ orderId: order.id });
    });
  } catch (error) {
    console.error("Error in creating Razorpay order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
*/

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
    let promise1;

    if (!order) {
      throw new Error("Order not found");
    }
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

    Promise.all([promise1, promise2])
      .then(() => {
        return res
          .status(202)
          .json({ success: true, message: "Something went not right" });
      })
      .catch((err) => {
        throw new Error(err);
      });
  } catch (error) {
    console.error("Error fetching premium user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { buyPremium, updateTxnStatus };
