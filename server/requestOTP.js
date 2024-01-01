const express = require("express");
const router = express.Router();
const { db } = require("./db");
const { v4: uuidv4 } = require("uuid");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rezaeiism@gmail.com", // Your Gmail email address
    pass: "ueyo jkbp sbbm ljoy", // Your Gmail password or an app-specific password
  },
});

router.post("/otp/request", async (req, res) => {
  const { userId, email } = req.body;

  //?Check information form frontend
  if (!userId && !email) {
    return res.status(401).json({ message: "OTP information not enough" });
  }

  try {
    const uuId = uuidv4();
    //?OTP code generator
    const otpCode = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    console.log(otpCode);

    // const info = await transporter.sendMail({
    //   from: "weTalk <rezaeiism@gmail.com>", // Sender's email address
    //   to: email, // Recipient's email address
    //   subject: `Index code`,
    //   text: `Your code is ${otpCode}`,
    // });
    //
    // console.log("Email sent:", info.messageId);

    //?Hash OTP
    const hashedOTP = await bcrypt.hash(otpCode, 10);
    //?Send OTP request to data base
    const query = {
      text: "INSERT INTO verification(id, user_id, otp_code) VALUES($1, $2, $3) ON CONFLICT (user_id) DO UPDATE SET id = $1, otp_code = $3 RETURNING *",
      values: [uuId, userId, hashedOTP],
    };

    const result = await db.query(query);
    console.log(result.rows[0]);

    return res
      .status(200)
      .json({ message: "verification code sent to your number" });
  } catch (e) {
    console.log(e);
    return res
      .status(200)
      .json({ message: "something went wrong verification" });
  }
});

module.exports = router;
