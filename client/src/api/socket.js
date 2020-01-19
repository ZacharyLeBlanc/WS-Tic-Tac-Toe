import io from "socket.io-client";

const socket = io("__API__", {
  path: "/api",
});

const connectedSocket = new Promise(resolve => {
  socket.on("connect", () => {
    console.log("connected");
    resolve(socket);
  });
});

socket.on("disconnect", reason => {
  if (reason === "io server disconnect") {
    // the disconnection was initiated by the server, you need to reconnect manually
    socket.connect();
  }
  // else the socket will automatically try to reconnect
});

export const getSocket = () => {
  return connectedSocket;
};
