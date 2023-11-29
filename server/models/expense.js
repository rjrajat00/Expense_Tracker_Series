const Sequelize = require("sequelize");

const sequelize = require("./db");

const Expense = sequelize.define("expenses", {
  amount: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,

    allowNull: false,
  },

  category: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Expense;
