const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const expenseController = require("../controllers/expenseControllers");

router.post("/", userController.addUser);
router.post("/login", userController.loginUser);

router.post("/expense", expenseController.addExpense);
router.get("/get/expense", expenseController.getExpense);
router.delete("/delete/:id", expenseController.deleteExpenses);
router.put("/edit/:id", expenseController.editExpenses);

console.log("this is router file");

module.exports = router;
