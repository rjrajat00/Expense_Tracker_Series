const SignUp = require("../models/newUser");
const bcrypt = require("bcrypt");

const addUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log(`register User==>`, name, email, password);

    const existingUser = await SignUp.findOne({ where: { email } });

    if (existingUser) {
      res.status(409).send("User with this email already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await SignUp.create({ name: name, email: email, password: hashedPassword });

    res.status(201).send("New User Created");
  } catch (error) {
    res.status(500).send("Failed to create new user");
  }
};

const loginUser = async (req, res) => {
  const { email, logPassword } = req.body;

  console.log(`Login Details, username=>${email} and password=>${logPassword}`);

  try {
    const user = await SignUp.findOne({ where: { email } });

    if (!user) {
      res.status(403).json({ error: "Invalid User" });
    }

    const passwordMatch = await bcrypt.compare(logPassword, user.password);

    if (passwordMatch) {
      res.status(200).json({ Logged: "In successfully" });
    } else {
      res.status(401).json({ error: "User Not Authorized" });
    }
  } catch (error) {
    res.status(500).send("Internal Server Error, " + error);
  }
};

module.exports = { addUser, loginUser };
