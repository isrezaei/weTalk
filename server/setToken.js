const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const router = express.Router();

router.use(cookieParser());
router.post("/authentication/setToken", (req, res) => {
  try {
    const token = jwt.sign({ email: "1.com", username: "2" }, "1234", {
      expiresIn: "1h",
    });
    // const tokenCookie = cookie.serialize("userToken", "", {
    //   maxAge: 0,
    //   httpOnly: true,
    // });
    // res.set("Set-Cookie", tokenCookie);

    res.cookie("miToken", token, { maxAge: 350000, httpOnly: true });

    // res.clearCookie("userToken", { maxAge: 0 });

    res.status(200).json("token set successfully");
  } catch (e) {
    res.status(400).json("token set is failed ");
  }
});

module.exports = router;
