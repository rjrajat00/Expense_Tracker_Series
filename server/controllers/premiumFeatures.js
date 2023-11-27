const Expense = require("../models/expense");
const SignUp = require("../models/newUser");
const sequelize = require("sequelize");

/*const leaderBoard = async (req, res) => {
  try {
    const leaderboardData = await SignUp.findAll({
      attributes: ["id", "name"],
      include: [
        {
          model: Expense,
          attributes: [
            [sequelize.fn("SUM", sequelize.col("amount")), "totalExpenses"],
          ],
        },
      ],
      group: ["SignUpId"],
      order: [[sequelize.fn("SUM", sequelize.col("expenses.amount")), "DESC"]],
      raw: true,
    });

    // Extract only relevant information and send as an array
    const simplifiedData = leaderboardData.map((item) => ({
      id: item.id,
      name: item.name,
      totalExpenses: item["expenses.totalExpenses"] || 0,
    }));

    res.status(200).json(simplifiedData);
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

*/

/*const leaderBoard = async (req, res) => {
  try {
    const leaderboardData = await SignUp.findAll({
      attributes: [
        "id",
        "name",
        [
          sequelize.fn("SUM", sequelize.col("expenses.amount")),
          "totalExpenses",
        ],
      ],
      include: [
        {
          model: Expense,
          attributes: [],
        },
      ],
      group: ["expenses.signUpId"],
      order: [["totalExpenses", "DESC"]],
    });

    // Extract only relevant information and send as an array

    res.status(200).json(leaderboardData);
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

*/
const leaderBoard = async (req, res) => {
  try {
    const leaderboardData = await SignUp.findAll({
      order: [["totalExpenses", "DESC"]],
    });

    // Extract only relevant information and send as an array

    res.status(200).json(leaderboardData);
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { leaderBoard };
