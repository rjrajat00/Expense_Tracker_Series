const sequelize = require("../models/db");
const Expense = require("../models/expense");
const SignUp = require("../models/newUser");

const addExpense = async (req, res) => {
  const txn = await sequelize.transaction();
  try {
    const { amount, description, category } = req.body;

    if (!amount || !description || !category) throw new Error("Missing fields");

    console.log(amount, description, category);

    const signUpId = req.decoded.id;

    console.log(amount, description, category, signUpId);

    const expenses = await Expense.create(
      {
        amount,
        description,
        category,
        signUpId,
      },
      { transaction: txn }
    );

    const user = await SignUp.findByPk(signUpId);
    const totalExpenses = Number(user.totalExpenses) + Number(amount);

    // Update the totalExpenses within the same transaction
    await SignUp.update(
      { totalExpenses: totalExpenses },
      { where: { id: signUpId }, transaction: txn }
    );

    await txn.commit();
    return res.status(201).send(expenses);
  } catch (error) {
    await txn.rollback();
    return res.status(500).send("Failed to add expense"); // Corrected typo here
  }
};

const getExpense = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      where: { signUpId: req.decoded.id },
    });
    console.log("fetched Expenses", expenses);
    return res.status(200).send(expenses);
  } catch (error) {
    console.error("error fetching expenes", error);
    return res.status(500).json({ error: "Failed to fetch expenses" });
  }
};

const deleteExpenses = async (req, res) => {
  const txn = await sequelize.transaction();
  try {
    const { id } = req.params;

    const expense = await Expense.findByPk(id);

    if (expense) {
      const signUpId = expense.signUpId;
      const amount = expense.amount;

      await expense.destroy();

      const user = await SignUp.findByPk(signUpId);
      const totalExpenses = Number(user.totalExpenses) - Number(amount);

      await SignUp.update(
        { totalExpenses: totalExpenses },
        { where: { id: signUpId }, transaction: txn }
      );
      await txn.commit();
      res.status(200).send(expense);
    } else {
      res.status(404).send({ error: "Expense not found" });
      await txn.rollback();
    }
  } catch (error) {
    console.error(error);
    await txn.rollback();
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const editExpenses = async (req, res) => {
  try {
    const expensesId = req.params.id;
    const { amount, description, category } = req.body;

    const updatedExpense = await Expense.update(
      { amount, description, category },
      { where: { id: expensesId } }
    );

    res.status(204).send(updatedExpense);
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = { addExpense, getExpense, deleteExpenses, editExpenses };
