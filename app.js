const express = require("express");

const path = require("path");

const cors = require("cors");

const colors = require("colors");

const bodyParser = require("body-parser");
const newUserRouter = require("./server/routes/routes");
const sequelize = require("./server/models/db");

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

const port = process.env.PORT || 5000;

sequelize
  .authenticate()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`.red);
      console.log("Connected To Database Successfully".underline.blue);
    });

    sequelize.sync(() => {
      console.log("Synced To Database Successfully");
    });
  })
  .catch((error) => {
    console.log(error);
  });
