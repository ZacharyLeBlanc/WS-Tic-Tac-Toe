import socketIo from "socket.io";
import http from "http";
import { RoomManager } from "../room";

const handleConnection = (
  socket: socketIo.Socket,
  roomManager: RoomManager,
): void => {
  socket.emit("room:get", { data: roomManager.getRooms() });

  socket.on("room:join", (data: { roomId: string }) =>
    roomManager.joinRoom(data.roomId, socket),
  );

  socket.on("room:leave", () => roomManager.leaveRoom(socket));

  socket.on("game:move", (data: { x: number; y: number }) =>
    roomManager.move(data, socket),
  );

  socket.on("game:rejoin", () => roomManager.rejoin(socket));

  socket.on("disconnecting", () => roomManager.leaveRoom(socket));
};

export const initialize = (server: http.Server): socketIo.Server => {
  const io: socketIo.Server = socketIo(server, {
    path: "/api",
  });

  const roomManager = new RoomManager(io);

  io.on("connection", (socket: socketIo.Socket) =>
    handleConnection(socket, roomManager),
  );

  return io;
};
