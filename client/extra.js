const Expense = require("../models/expense");
const User = require("../models/user"); // Import the User model

const addExpense = async (req, res) => {
  try {
    const { amount, description, category, userId } = req.body; // Include userId

    // First, find the user by userId
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Create the expense and associate it with the user
    const expense = await Expense.create({ amount, description, category });
    await user.addExpense(expense);

    return res.status(201).send("New Expense Added");
  } catch (error) {
    return res.status(500).send("Failed to add expense");
  }
};
