const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  "expense_tracker_series",
  "root",
  "Icando00@#",
  {
    dialect: "mysql",
    host: "localhost",
  }
);

module.exports = sequelize;
