const nodemailer = require("nodemailer");
require("dotenv").config();
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const SignUp = require("../models/newUser");
const ForgotPasswordTable = require("../models/forgotPassReq");

const forgotPass = async (req, res) => {
  const { name, number } = req.body;
  try {
    const { email } = req.body;
    console.log("email=>,", email);
    const user = await SignUp.findOne({ where: { email } });
    const id = uuid.v4();
    if (user) {
      ForgotPasswordTable.create({ id: id, isActive: true }).catch((err) => {
        throw new Error(err);
      });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587, // Elastic Email SMTP port
      secure: false, // Set to true if using SSL
      auth: {
        user: process.env.user,
        pass: process.env.smtp_password,
      },
    });
    const link = `http://localhost:5000/resetPassword/${id}`;
    console.log("Generated Reset Password Link:", link);

    const mailOptions = {
      from: process.env.user,
      to: email,
      subject: "Urgent Action Required",
      html: `<a href="http://localhost:5000/password/resetPassword/${id}">Reset password</a>`,
      text: `Your new password is below .
        Your entered nama ${name} and email is ${email} ,mobile number is ${number}.`,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent: ", info.messageId);
    res.json({ info: "email sent successfully" });
  } catch (error) {
    console.error("Error sending email: ", error.message);
    res.status(500).send("Error sending email");
  }
};

const resetpassword = (req, res) => {
  console.log("inside reset password function");
  const id = req.params.id;
  console.log("this is id=>", id);
  ForgotPasswordTable.findOne({ where: { id } }).then(
    (forgotpasswordrequest) => {
      if (forgotpasswordrequest) {
        forgotpasswordrequest.update({ active: false });
        res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>Reset password</button>
                                    </form>
                                </html>`);
        res.end();
      }
    }
  );
};

const updatepassword = (req, res) => {
  try {
    const { newpassword } = req.query;
    const { resetpasswordid } = req.params;

    console.log(
      "new Password=>",
      newpassword,
      "reset password Id=>",
      resetpasswordid
    );

    ForgotPasswordTable.findOne({ where: { id: resetpasswordid } }).then(
      (resetpasswordrequest) => {
        SignUp.findOne({ where: { id: resetpasswordrequest.email } }).then(
          (user) => {
            // console.log('userDetails', user)
            if (user) {
              //encrypt the password

              const saltRounds = 10;
              bcrypt.genSalt(saltRounds, function (err, salt) {
                if (err) {
                  console.log(err);
                  throw new Error(err);
                }
                bcrypt.hash(newpassword, salt, function (err, hash) {
                  // Store hash in your password DB.
                  if (err) {
                    console.log(err);
                    throw new Error(err);
                  }
                  user.update({ password: hash }).then(() => {
                    res
                      .status(201)
                      .json({ message: "Successfuly update the new password" });
                  });
                });
              });
            } else {
              return res
                .status(404)
                .json({ error: "No user Exists", success: false });
            }
          }
        );
      }
    );
  } catch (error) {
    return res.status(403).json({ error, success: false });
  }
};

module.exports = { forgotPass, resetpassword, updatepassword };
