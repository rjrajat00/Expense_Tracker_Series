const nodemailer = require("nodemailer");
require("dotenv").config();

/*  


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

*/

const forgotPass = async (req, res) => {
  const { name, email, number } = req.body;
  console.log("name,email, number=>", name, email, number);
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587, // Elastic Email SMTP port
      secure: false, // Set to true if using SSL
      auth: {
        user: process.env.user,
        pass: process.env.smtp_password,
      },
    });

    const mailOptions = {
      from: process.env.user,
      to: email,
      subject: "Urgent Action Required",
      text: `Your new password is below .
      Your entered nama ${name} and email is ${email} ,mobile number is ${number}`,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent: ", info.messageId);
    res.json({ info: "email sent successfully" });
  } catch (error) {
    console.error("Error sending email: ", error.message);
    res.status(500).send("Error sending email");
  }
};

module.exports = { forgotPass };
