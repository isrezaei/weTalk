import { socket } from "./(INIT)socket";

export default function socketOn(event) {
  const socketResult = (result) => {
    return {
      result,
    };
  };

  socket.on(event, (args) => socketResult(args));
}
