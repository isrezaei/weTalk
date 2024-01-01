const express = require("express");
const multer = require("multer");
const router = express.Router();
const { db } = require("../db");

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(process.env.DB_URL, process.env.DB_KEY);

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/"); // مسیر دیسک برای ذخیره فایل‌ها
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname); // نام فایل ذخیره شده در دیسک
//   },
// });

const upload = multer({ storage: multer.memoryStorage() });

let status;
router.post("/upload", upload.single("file"), async (req, res) => {
  console.log(req.file);

  try {
    status = "loading...";
    console.log(status);

    const { data, error } = await supabase.storage
      .from("we-talk")
      .upload(`/chat-images/${Date.now()}`, req.file, {
        contentType: "image/jpeg",
      });

    console.log(data);

    if (error) {
      console.error(error);
      status = "End request !";
      return res.status(500).json("Error uploading file to Supabase Storage");
    }

    status = "End request !";
    console.log(status);

    // console.log(originalname);
    // console.log(buffer);

    return res.status(200).json("upload api !");
  } catch (e) {
    console.error(e);
    return res.status(500).json("Internal Server Error");
  }
});

module.exports = router;
