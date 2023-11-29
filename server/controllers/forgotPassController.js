const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "isadore.aufderhar30@ethereal.email",
    pass: "nH9AnEWcah59wSG6WP",
  },
});

const forgotPass = async (req, res) => {
  const { name, email, number } = req.body;

  try {
    const info = await transporter.sendMail({
      from: '"Rajat Singh 👻" <Letsdoit00@#>', // sender address
      to: "pythonc9090@gmail.com,rajat1003@gmail.com", // list of receivers
      subject: "Urgent Action Required", // Subject line
      text: "Arey Nhi Bhai?", // plain text body
      html: "<b>Hello world?</b>", // html body
      name: name,
      email: email,
      number: number,
    });

    console.log("Message sent: %s", info.messageId);

    res.status(200).json({ info });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { forgotPass };
