const { v4: uuidv4 } = require("uuid");
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const { db } = require("./db");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cookie = require("cookie");

router.use(express.json());

router.use(cookieParser());

router.post("/authentication/signup", async (req, res) => {
  const { firstName, lastName, username, age, number, email, password } =
    req.body;

  console.log(req.body);

  if (
    ![firstName, lastName, username, age, number, email, password].every(
      Boolean,
    )
  ) {
    return res.status(400).json({ message: "Frontend value not valid !" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await db.query(
      "INSERT INTO users(id , username , email , created_at , password , avatar , firstname , lastname , age , number ) VALUES($1 , $2 , $3 ,$4 , $5 , $6 , $7 , $8 , $9 , $10) RETURNING *",
      [
        uuidv4(),
        username,
        email,
        new Date(),
        hashedPassword,
        "null avatar",
        firstName,
        lastName,
        age,
        number,
      ],
    );

    const newUser = result.rows[0];
    const token = jwt.sign(
      {
        email: newUser?.email,
        username: newUser?.username,
        id: newUser?.id,
        confirmed: existedUser?.confirmed,
      },
      "1234",
      { expiresIn: "1h" },
    );
    await res.cookie("appToken", token, { maxAge: 3600000, httpOnly: true });
    res.status(200).json("created user successful");
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

module.exports = router;
