const express = require("express");

const path = require("path");

const cors = require("cors");

const jwt = require("jsonwebtoken");

const colors = require("colors");

const bodyParser = require("body-parser");
const newUserRouter = require("./server/routes/routes");
const buyPremiumRoutes = require("./server/routes/razorpay");
const sequelize = require("./server/models/db");
const User = require("./server/models/newUser");
const Expense = require("./server/models/expense");
const Order = require("./server/models/order");
const ForgotPassReq = require("./server/models/forgotPassReq");

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true })); // // // // //    //

app.use(express.json());

app.use(express.static("client"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "user.html"));
});

app.use("/api/newUser", newUserRouter);
app.use("/api/user", newUserRouter);
app.use("/api", newUserRouter);
app.use("/buy", buyPremiumRoutes);
app.use("/check", buyPremiumRoutes);
app.use("/premium", buyPremiumRoutes);

// Fogotten Password recovery route
app.use("/password", buyPremiumRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

Order.belongsTo(User);
User.hasMany(Order);

User.hasMany(ForgotPassReq);
ForgotPassReq.belongsTo(User);

const port = process.env.PORT || 5000;

sequelize
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`.green);
      console.log("Connected To Database Successfully".underline.yellow);
    });

    sequelize.sync(() => {
      console.log("Synced To Database Successfully");
    });
  })
  .catch((error) => {
    console.log(error);
  });
