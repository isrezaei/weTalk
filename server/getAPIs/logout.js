const express = require("express");
const router = express.Router();
const { db } = require("../db");
const jwt = require("jsonwebtoken");

router.get("/authentication/logout", async (req, res, next) => {
  if (!db)
    return res.status(500).json({ message: "connection to database failed!" });

  try {
    res.clearCookie("appToken", { maxAge: 0, httpOnly: true });
    return await res
      .status(200)
      .json({ message: "login successful!", status: 200 });
  } catch (e) {
    await res.status(500).json({
      message: "something went wrong in logout process!",
      status: 500,
    });
  }
});

module.exports = router;
