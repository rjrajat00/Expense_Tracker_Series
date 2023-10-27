const express = require("express");

const path = require("path");

const cors = require("cors");

const bodyParser = require("body-parser");
const newUserRouter = require("./server/routes/routes");
const sequelize = require("./server/models/db");

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true })); // // // // //    //

app.use(express.json());

app.use(express.static("client"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

app.use("/api/newUser", newUserRouter);

const port = process.env.PORT || 5000;

sequelize
  .authenticate()
  .then(() => {
    app.listen(port, () => {
      console.log(`server is running on port ${port}`);
      console.log("Connected To Database Successfully");
    });

    sequelize.sync(() => {
      console.log("Synced To Database Successfully");
    });
  })
  .catch((error) => {
    console.log(error);
  });
