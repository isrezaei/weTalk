export default function socketEmit(socket, event, args) {
  socket.timeout(5000).emit(event, args, (err) => {
    if (err) {
      console.log(err);
      socketEmit(socket, event, args);
    }
  });
}
