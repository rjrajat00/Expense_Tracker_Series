const SignUp = require("../models/newUser");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const sec_key = "weall00@#90";

const addUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log(`register User==>`, name, email, password);

    const existingUser = await SignUp.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).send("User with this email already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await SignUp.create({
      name: name,
      email: email,
      password: hashedPassword,
      is__Premium: false,
    });
    console.log(newUser);

    const userId = newUser.id;
    const token = jwt.sign({ email: email, name: name, id: userId }, sec_key, {
      expiresIn: "4h",
    });

    console.log("SignUp Token=>", token);

    return res.status(201).json({ message: "New User Created", token: token });
  } catch (error) {
    return res.status(500).send("Failed to create new user");
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
      // Send a success status (e.g., 200) and a message
      const token = jwt.sign(
        {
          id: user.id,
          email: email,
          name: user.name,
          is__Premium: user.is__Premium,
        },
        sec_key,
        {
          expiresIn: "4h",
        }
      );
      console.log("Login token=>", token);
      return res.status(200).json({
        message: "Login successful",
        token: token,
        signUpId: user.id,
        name: user.name,
      });
    } else {
      return res.status(401).json({ error: "User Not Authorized" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { addUser, loginUser };
