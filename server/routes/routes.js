const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/", userController.addUser);
router.post("/login", userController.loginUser);

console.log("this is router file");

module.exports = router;
