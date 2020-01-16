import socketIo from "socket.io";
import http from "http";
import { RoomManager, Room } from "../room";

const handleJoinRoom = (
  io: socketIo.Server,
  socket: socketIo.Socket,
  roomId: string,
): void => {
  socket.emit("room:status", "Joining...");
  RoomManager.joinRoom(roomId, socket)
    .then((room: Room) => {
      io.emit("room:get", { data: RoomManager.getRooms() });
      socket.emit("room:status", "Joined room");
      io.to(room.id).emit("room:joined", { data: room });
      if (room.game) {
        io.to(room.id).emit("game", room.game);
      }
    })
    .catch((error: string) => {
      socket.emit("room:status", error);
    });
};

const handleLeaveRoom = (
  io: socketIo.Server,
  socket: socketIo.Socket,
): void => {
  const room: Room = RoomManager.getRoomByPlayer(socket.id);
  room?.players.forEach((playerId: string) => {
    if (playerId !== socket.id) {
      io.sockets.connected[playerId].emit("room:destroy", {
        data: "Other Player disconnected",
      });
    } else {
      io.sockets.connected[playerId].emit("room:destroy", {
        data: "You disconnected",
      });
    }
    io.sockets.connected[playerId]?.leave(room.id);
  });
  room?.reset();
  io.emit("room:get", { data: RoomManager.getRooms() });
};

const handleConnection = (
  io: socketIo.Server,
  socket: socketIo.Socket,
): void => {
  socket.emit("room:get", { data: RoomManager.getRooms() });

  socket.on("room:join", (data: { roomId: string }) =>
    handleJoinRoom(io, socket, data.roomId),
  );

  socket.on("room:leave", () => {
    handleLeaveRoom(io, socket);
  });

  socket.on("game:move", (data: { x: number; y: number }) => {
    const room: Room = RoomManager.getRoomByPlayer(socket.id);
    io.to(room.id).emit("game", room.game.move(data, socket.id));
    if (room.game.isGameOver) {
      room.players.forEach((playerId: string) => {
        io.sockets.connected[playerId].emit("room:destroy", {
          data: "Room timed out",
        });
        setTimeout(() => {
          io.sockets.connected[playerId]?.leave(room.id);
        }, 60000);
      });
      room.reset();
      io.emit("room:get", { data: RoomManager.getRooms() });
    }
  });

  socket.on("disconnecting", (reason: string) => {
    handleLeaveRoom(io, socket);
  });
};

export const initialize = (server: http.Server): socketIo.Server => {
  const io: socketIo.Server = socketIo(server, {
    path: "/api",
  });

  RoomManager.initialize();

  io.on("connection", (socket: socketIo.Socket) =>
    handleConnection(io, socket),
  );

  return io;
};
