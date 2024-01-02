const Sequelize = require("sequelize");

const sequelize = require("./db");

const ForgotPassReq = sequelize.define("forgotPassReq", {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false,
  },
  userId: {
    type: Sequelize.STRING,
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = ForgotPassReq;
