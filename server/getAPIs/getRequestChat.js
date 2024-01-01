const express = require("express");
const router = express.Router();
const { db } = require("../db");
const findChatRequestsQuery = (sessionId, role) => ({
  text:
    role === "sender"
      ? `SELECT * FROM requests WHERE request_sender_id = $1`
      : "SELECT users.id, users.username, users.email, users.avatar FROM requests JOIN users on request_sender_id = users.id WHERE request_receiver_id = $1",
  values: [sessionId],
  rowMode: "object",
});

router.get("/request/chat/find/:sessionId/:role", async (req, res) => {
  try {
    //?Get params from url
    const { sessionId, role } = req.params;

    //?Check valid params
    if (!sessionId)
      return res
        .status(401)
        .json({ message: "User must be logged in or register!" });

    //?Send query to database
    const result = await db.query(findChatRequestsQuery(sessionId, role));

    //?Get related results
    const chatRequests = result.rows;

    //!Handel if we dont have values
    if (!chatRequests) {
      return res.status(200).json({
        message: "You have no chat requests :(",
        data: null,
        status: 200,
      });
    }
    //>Send results to front-End
    return res.status(200).json({
      message: "List of sent requests to start chat :)",
      data: chatRequests,
      status: 200,
    });
  } catch (error) {
    //!Catch Errors
    console.log(error);
    await res.status(500).json({
      message: "something went wrong! (Reference ==> getRequestChat.js)",
      status: 500,
    });
  }
});

module.exports = router;
