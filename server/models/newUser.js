const Sequelize = require("sequelize");

const sequelize = require("./db");

const SignUp = sequelize.define("sign_up", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },

  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = SignUp;
