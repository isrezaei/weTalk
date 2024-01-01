const express = require("express");
const router = express.Router();
const { db } = require("./db");

const findQuery = (username) => ({
  text: "SELECT json_agg(json_build_object('username', username, 'id', id)) as data FROM users WHERE username ILIKE $1",
  values: [`%${username}%`],
});

router.post("/search/find/user", async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Frontend value not valid !" });
  }

  try {
    const result = await db.query(findQuery(username));

    const userFound = result.rows[0]?.data;

    if (!userFound) {
      console.log("user not found!");
      return await res
        .status(404)
        .json({ message: "user not found!", status: 404, data: null });
    }

    return await res.status(200).json({
      message: "List of users found :)",
      data: userFound,
      status: 200,
    });
  } catch (error) {
    await res.status(500).json({
      message: "something went wrong!",
      status: 500,
    });
  }
});

module.exports = router;
