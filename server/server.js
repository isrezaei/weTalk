const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");
const { initSocket } = require("./socket/socket");

const app = express();
const server = createServer(app);
const io = initSocket(server);

const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

dotenv.config();
const port = 3000;
//?GET Routers
const cookieRouter = require("./getAPIs/getCookie");
const getRequestChat = require("./getAPIs/getRequestChat");
const logoutRouter = require("./getAPIs/logout");
const getRoomsRouter = require("./getAPIs/getRooms");
const getMessageRouter = require("./getAPIs/getMessage");

//?POST Routers
const signupRouter = require("./signup");
const loginRouter = require("./login");
const setToken = require("./setToken");
const requestOtpRouter = require("./requestOTP");
const requestChatRouter = require("./requestChat");
const verifyOtpRouter = require("./verifyOTP");
const foundUserRouter = require("./findUser");
const confirmRequestRouter = require("./postAPIs/confirmRequests");
const sendNewMessages = require("./postAPIs/postMessages");
const uploadFile = require("./postAPIs/UploadFile");
// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routers
app.use(cookieRouter);
app.use(signupRouter);
app.use(loginRouter);
app.use(logoutRouter);
app.use(setToken);
app.use(requestOtpRouter);
app.use(requestChatRouter);
app.use(verifyOtpRouter);
app.use(foundUserRouter);
app.use(getRequestChat);
app.use(confirmRequestRouter);
app.use(getRoomsRouter);
app.use(getMessageRouter);
app.use(sendNewMessages);
app.use(uploadFile);

// Server start
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
