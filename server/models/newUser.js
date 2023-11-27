const Sequelize = require("sequelize");

const sequelize = require("./db");

const SignUp = sequelize.define("sign_up", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,

    allowNull: false,
  },

  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  is__Premium: {
    type: Sequelize.BOOLEAN,
  },
  totalExpenses: {
    type: Sequelize.INTEGER,
  },
});

module.exports = SignUp;
