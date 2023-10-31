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
      return res.status(404).json({ error: "User Not Found" });
    }

    const passwordMatch = await bcrypt.compare(logPassword, user.password);

    if (passwordMatch) {
      return res.status(200).json({ Logged: "In successfully" });
    } else {
      return res.status(401).json({ error: "User Not Authorized" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { addUser, loginUser };
