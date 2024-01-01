const express = require("express");
const { db } = require("../db");
const _ = require("lodash");
const router = express.Router();

const postMessagesQuery = (reqBody) => ({
  text: "INSERT INTO messages(id, context, created_at, user_id, room_id , files_url ) VALUES($1, $2, $3, $4 ,$5 , $6) RETURNING *",
  values: [...Object.values(reqBody)],
});

router.post("/chat/post/messages", async (req, res) => {
  console.log(req.body);

  try {
    if (!_.every(req.body, (value) => !_.isNull(value)))
      return res.status(500).json({
        data: null,
        message: "something is wrong in body request of new message info sent!",
        status: 402,
      });

    const result = await db.query(postMessagesQuery(req.body));

    if (!result)
      return res.status(404).json({
        data: null,
        message: "something went wrong in post new message to database !",
        status: 402,
      });

    return res.status(200).json({
      data: result.rows[0],
      message: `create new message successfully`,
      status: 200,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      data: null,
      message: e + "something went wrong! (Reference ==> postMessage.js)",
      status: 500,
    });
  }
});

module.exports = router;
