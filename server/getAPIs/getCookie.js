const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const router = express.Router();

router.use(cookieParser());
router.get("/authentication/getCookie", (req, res) => {
  const accessToken = req.cookies?.appToken;

  if (!accessToken) {
    return res.status(500).json({ user: "user not found!", status: 401 });
  }
  const verifyToken = jwt.verify(accessToken, "1234");

  if (verifyToken) {
    res.status(200).json({ user: verifyToken, status: 200 });
  } else {
    res.status(400).json({ user: null, status: 400 });
  }
});

module.exports = router;
