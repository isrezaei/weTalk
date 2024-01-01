const express = require("express");
const { db } = require("../db");
const router = express.Router();
const _ = require("lodash");

//? این تابع تمام room های مربوط به بوزر فعلی رو دریافت میکنه receiver یوزر فعلی و  sender یوزر فعلی
//? کلید های خارجی که شامل اطلاعات همه یوزر های منطبق با یوزر فعلی میشود، دریافت میشه! این داده ها شامل اطلاعات خارجی یوزر فعلی هم میشه که باید فیلتر شه!
const findRoomQuery = (userId) => ({
  text: "SELECT rooms.* , jsonb_build_object( 'userId',users.id , 'username',users.username, 'email',users.email, 'avatar',users.avatar) AS users FROM rooms JOIN users on sender_id = users.id OR receiver_id =users.id  WHERE receiver_id = $1 OR sender_id =$1",
  values: [userId],
});

//? In this code, the recipient of the message is the main user
router.get("/chat/find/rooms/:userId", async (req, res) => {
  try {
    if (!db)
      return res
        .status(500)
        .json({
          data: null,
          message: "FATAL connection to database is fail !",
        });

    const { userId } = req.params;

    if (!userId)
      return res.status(500).json({
        data: null,
        message: "something is wrong in params of room id!",
        status: 500,
      });

    const result = await db.query(findRoomQuery(userId));

    if (!result)
      return res.status(404).json({
        data: null,
        message: `user : ${userId} have not found !`,
        status: 404,
      });

    //> دیتاهای مربوط به کلید خارجی که برابر با id یوزر فعلی رو فیلتر میکنه!
    const roomsInfo = _.filter(
      result.rows,
      (room) => room?.users?.userId !== userId,
    );

    return res.status(200).json({
      data: roomsInfo,
      message: `result of rooms chats for user : ${userId}`,
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
