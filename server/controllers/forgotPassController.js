const nodemailer = require("nodemailer");
require("dotenv").config();
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const SignUp = require("../models/newUser");
const ForgotPasswordTable = require("../models/forgotPassReq");

const forgotPass = async (req, res) => {
  try {
    const { name, number } = req.body;
    const { email } = req.body;

    console.log("email=>,", email);

    const user = await SignUp.findOne({ where: { email } });

    try {
      if (user) {
        const id = uuid.v4();

        // Create a record in ForgotPasswordTable
        await ForgotPasswordTable.create({
          id: id,
          isActive: true,
          userId: user.id,
        });

        const transporter = nodemailer.createTransport({
          host: "smtp-relay.brevo.com",
          port: 587,
          secure: false,
          auth: {
            user: process.env.user,
            pass: process.env.smtp_password,
          },
        });

        const link = `http://localhost:5000/password/resetPassword/${id}`;
        console.log("Generated Reset Password Link:", link);

        const mailOptions = {
          from: process.env.user,
          to: email,
          subject: "Urgent Action Required",
          html: `<a href="${link}">Reset password</a>`,
          text: `Your new password is below. Your entered name is ${name}, email is ${email}, and mobile number is ${number}.`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: ", info.messageId);

        res.json({ info: "email sent successfully" });
      } else {
        throw new Error("User doesn't exist");
      }
    } catch (err) {
      console.error("Error creating ForgotPasswordTable record: ", err.message);
      res.status(500).send("Error creating record");
    }
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

const updatepassword = async (req, res) => {
  try {
    const { newpassword } = req.query;
    const { resetpasswordid } = req.params;

    console.log(
      "new Password=>",
      newpassword,
      "reset password Id=>",
      resetpasswordid
    );

    // Find the record in ForgotPasswordTable
    const resetpasswordrequest = await ForgotPasswordTable.findOne({
      where: { id: resetpasswordid },
    });

    if (resetpasswordrequest) {
      // Fetch the userId from resetpasswordrequest
      const userId = resetpasswordrequest.userId;

      if (!userId) {
        return res
          .status(404)
          .json({
            error: "UserId not found in reset password request",
            success: false,
          });
      }

      // Find the user in SignUp table using the userId from ForgotPasswordTable
      const user = await SignUp.findOne({
        where: { id: userId },
      });

      if (user) {
        // Encrypt the new password
        const saltRounds = 10;
        bcrypt.genSalt(saltRounds, function (err, salt) {
          if (err) {
            console.log(err);
            throw new Error(err);
          }
          bcrypt.hash(newpassword, salt, function (err, hash) {
            if (err) {
              console.log(err);
              throw new Error(err);
            }
            // Update the user's password
            user.update({ password: hash }).then(() => {
              res.status(201).json({
                message: "Successfully updated the new password",
              });
            });
          });
        });
      } else {
        return res
          .status(404)
          .json({ error: "No user exists", success: false });
      }
    } else {
      return res
        .status(404)
        .json({ error: "Reset password request not found", success: false });
    }
  } catch (error) {
    console.error("Error updating password: ", error.message);
    return res.status(500).json({ error, success: false });
  }
};

module.exports = { forgotPass, resetpassword, updatepassword };
