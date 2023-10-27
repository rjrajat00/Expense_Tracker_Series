const SignUp = require("../models/newUser");
const bcrypt = require("bcrypt");

const addUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log(name, email, password);

    const hashedPassword = await bcrypt.hash(password, 10);

    await SignUp.create({ name: name, email: email, password: hashedPassword });

    res.status(201).send("New User Created");
  } catch (error) {
    res.status(500).send("Failed to create new user");
  }
};

module.exports = { addUser };
