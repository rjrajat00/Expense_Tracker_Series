const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const expenseController = require("../controllers/expenseControllers");
const verifyToken = require("../../middleware/auth");

// user Signup and Login

router.post("/", userController.addUser);
router.post("/login", userController.loginUser);

// Adding, Fetching, Deleting and Updating Expenses,

router.post("/expense", verifyToken, expenseController.addExpense);
router.get("/get/expense", verifyToken, expenseController.getExpense);
router.delete("/delete/:id", expenseController.deleteExpenses);
router.put("/edit/:id", expenseController.editExpenses);

// Handling orders per user (premium membership)

console.log("this is router file");

module.exports = router;
