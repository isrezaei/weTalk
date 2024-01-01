const express = require("express");
const { db } = require("../db");
const router = express.Router();

const findRoomQuery = (roomId) => ({
  text: "SELECT * FROM messages WHERE room_id = $1",
  values: [roomId],
});
router.get("/chat/find/messages/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;

    if (!roomId)
      return res.status(500).json({
        data: null,
        message: "something is wrong in params of room id!",
        status: 500,
      });

    const result = await db.query(findRoomQuery(roomId));

    if (!result)
      return res.status(404).json({
        data: null,
        message: "room this chat not found !",
        status: 404,
      });

    return res.status(200).json({
      data: result.rows,
      message: `Result of room id ${roomId}`,
      status: 200,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      data: null,
      message: e + "something went wrong! (Reference ==> getRooms.js)",
      status: 404,
    });
  }
});

module.exports = router;
