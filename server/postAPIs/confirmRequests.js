const express = require("express");
const { db } = require("../db");

const router = express.Router();
const _ = require("lodash");

const confirmRequestQuery = (request_sender_id, request_receiver_id) => ({
  text: "UPDATE requests SET confirmed = $1 WHERE request_receiver_id = $2 AND request_sender_id = $3",
  values: [true, request_receiver_id, request_sender_id],
});

const createRoomQuery = (reqBody) => ({
  text: "INSERT INTO rooms(id, sender_id, receiver_id ,created_at) VALUES($1, $2, $3, $4) RETURNING *",
  values: [...Object.values(reqBody)],
});

router.post("/request/chat/confirm", async (req, res) => {
  if (!_.every(req.body, (value) => !_.isNull(value)))
    return res.status(401).json({
      data: null,
      message: "The information submitted is not valid !",
      status: 401,
    });

  try {
    //> Confirm chats requests!
    await db.query(
      confirmRequestQuery(
        req.body?.request_sender_id,
        req.body?.request_receiver_id,
      ),
    );

    //? Create chats room after confirm requests

    const chatRoomsResult = await db.query(createRoomQuery(req.body));

    if (!chatRoomsResult)
      return res.status(400).json({
        data: null,
        message: "We can't create room and start chat, an error occurred :(",
      });

    return res.status(200).json({
      message: "Create room successful",
      data: chatRoomsResult.rows[0],
      status: 200,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      data: null,
      message: "something went wrong! (Reference ==> confirmRequests.js)",
      status: 400,
    });
  }
});

module.exports = router;
