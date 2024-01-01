const { Server } = require("socket.io");

function initSocket(server) {
  const io = new Server(server, {
    connectionStateRecovery: {},
    cors: {
      origin: "http://192.168.1.101:3000",
    },
  });

  io.on("connection", (socket) => {
    socket.on("(JOIN)|(ROOMS)", (roomId) => {
      socket.join(roomId);
    });

    socket.on("(ROOMS)|(SEND)|(MESSAGES)", async (args, callback) => {
      callback({
        status: "ok",
      });
      io.to(args.room_id).emit("(ROOMS)|(GET)|(MESSAGES)", args);
    });

    socket.onAny((eventName, ...args) => {
      console.log(eventName);
      console.log(args);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  return io;
}

module.exports = {
  initSocket,
};
