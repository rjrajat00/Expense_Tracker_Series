const Expense = require("../models/expense");

const addExpense = async (req, res) => {
  try {
    const { amount, description, category } = req.body;

    console.log(amount, description, category);

    await Expense.create({ amount, description, category });

    return res.status(201).send("New Expense Added");
  } catch (error) {
    return res.status(500).send("Failed to add expenser");
  }
};
const getExpense = async (req, res) => {
  try {
    const expenses = await Expense.findAll();

    return res.status(200).send(expenses);
  } catch (error) {
    return res.status(500).send("Failed to fetch expenses");
  }
};

const deleteExpenses = async (req, res) => {
  try {
    const { id } = req.params;
    const expenses = await Expense.findByPk(id);

    if (expenses) await expenses.destroy();

    res.status(201).send(expenses);
  } catch (error) {
    res.status(400).send("Unable to find task", error);
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
    res.status(400).send("Unable to find task", error);
  }
};

module.exports = { addExpense, getExpense, deleteExpenses, editExpenses };
