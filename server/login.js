const { v4: uuidv4 } = require("uuid");
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const { db } = require("./db");
const jwt = require("jsonwebtoken");

router.post("/authentication/login", async (req, res) => {
  const { username, password } = req.body;

  if (![username, password].every(Boolean)) {
    return res.status(400).json({ message: "Frontend value not valid !" });
  }

  try {
    //?Find user in database
    const query = {
      text: "SELECT * FROM users WHERE username = $1",
      values: [username],
      rowMode: "object",
    };
    const result = await db.query(query);
    const existedUser = result.rows[0];

    //?Check existed user in database
    if (!existedUser)
      return res
        .status(400)
        .json({ message: "username or password went wrong" });

    //?Check correct or wrong password
    const verifyPass = await bcrypt.compare(password, existedUser?.password);
    if (!verifyPass)
      return res
        .status(400)
        .json({ message: "username or password went wrong" });

    //?If every thing be ok, we made a new token for current user
    const token = jwt.sign(
      {
        email: existedUser?.email,
        username: existedUser?.username,
        id: existedUser?.id,
        confirmed: existedUser?.confirmed,
      },
      "1234",
      { expiresIn: "12h" },
    );
    await res.cookie("appToken", token, { maxAge: 43000000, httpOnly: true });

    //?Send response for going home
    res.status(200).json("login successful, welcome :)");
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Something wrong with login process!" });
  }
});

module.exports = router;
