const express = require("express");
const router = express.Router();
const { db } = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const selectQuery = (userId) => ({
  text: "SELECT * FROM verification WHERE user_id = $1",
  values: [userId],
  rowMode: "object",
});
const deleteQuery = (userId) => ({
  text: "DELETE FROM verification WHERE user_id = $1",
  values: [userId],
  rowMode: "object",
});

const updateQuery = (userId) => ({
  text: "UPDATE users SET confirmed = $1 WHERE id = $2 RETURNING *",
  values: [true, userId],
  rowMode: "object",
});

router.post("/otp/verification", async (req, res) => {
  const { userId, otpCode, currentDate } = req.body;

  if (![userId, otpCode, currentDate].every(Boolean))
    return res
      .status(400)
      .json({ message: "verification information not valid" });

  try {
    const result = await db.query(selectQuery(userId));
    const otpInfo = result.rows[0];

    // console.log(otpInfo);

    if (!otpInfo)
      return res
        .status(401)
        .json({ message: "current user doesn't have any otp request!" });

    console.log(otpInfo?.expiration_time);
    console.log(new Date());

    if (otpInfo?.expiration_time < new Date()) {
      await db.query(deleteQuery(userId));
      return res
        .status(401)
        .json({ message: "Validation timed out, try again" });
    }

    console.log(otpCode);

    const verifyOTP = await bcrypt.compare(otpCode, otpInfo?.otp_code);

    if (!verifyOTP)
      return res.status(401).json({ message: "OTP code not valid! try again" });

    const existedUser = await db.query(updateQuery(userId));

    console.log("user confirmed !");

    if (!existedUser) {
      await db.query(deleteQuery(userId));
      return res.status(400).json({ message: "verification of user failed" });
    }

    console.log(existedUser.rows[0]);

    const token = req.cookies.appToken;
    const decodedToken = jwt.verify(token, "1234");
    decodedToken.confirmed = true;

    const updatedToken = jwt.sign(decodedToken, "1234");
    res.cookie("appToken", updatedToken, { maxAge: 3600000, httpOnly: true });
    await db.query(deleteQuery(userId));
    return res.status(200).json({ message: "User confirmed! nice :)" });
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ message: "Something went wrong in verify OTP process! " });
  }
});

module.exports = router;
