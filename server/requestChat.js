const express = require("express");
const router = express.Router();
const { db } = require("./db");
const { v4: uuidv4 } = require("uuid");

const chatRequestQuery = ({
  id,
  request_sender_id,
  request_receiver_id,
  created_at,
}) => ({
  text: "INSERT INTO requests (id, request_sender_id, request_receiver_id , created_at) VALUES($1, $2, $3 , $4) RETURNING *",
  values: [id, request_sender_id, request_receiver_id, created_at],
});

const deleteRequest = ({ request_sender_id, request_receiver_id }) => ({
  text: "DELETE FROM requests WHERE request_sender_id = $1 AND request_receiver_id = $2",
  values: [request_sender_id, request_receiver_id],
});
router.post("/request/:rolls/chat", async (req, res) => {
  const { rolls } = req.params;

  console.log(rolls);

  if (!req.body.request_sender_id) {
    return res.status(401).json({
      data: "not data exist",
      message: "Frontend value not valid!",
      status: 401,
    });
  }

  try {
    if (rolls === "add") {
      await db.query(chatRequestQuery(req.body));
      return await res.status(200).json({
        data: null,
        message: "Request sent successfully :)",
        status: 200,
      });
    }

    if (rolls === "delete") {
      await db.query(deleteRequest(req.body));
      return await res.status(200).json({
        data: null,
        message: "Request delete successfully :)",
        status: 200,
      });
    }
  } catch (error) {
    console.log(error);
    await res.status(500).json({
      message: "something went wrong! (Reference ==> requestChat.js)",
      status: 500,
    });
  }
});

module.exports = router;
