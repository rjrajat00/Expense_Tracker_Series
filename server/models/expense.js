const Sequelize = require("sequelize");

const sequelize = require("./db");
const User = require("./newUser");

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

User.hasMany(Expense);
Expense.belongsTo(User);

module.exports = Expense;
