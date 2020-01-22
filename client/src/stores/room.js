import { writable } from "svelte/store";
import { getSocket } from "../api/socket.js";

export const rooms = writable([]);
export const room = writable({});

export const joinRoom = async roomId => {
  const socket = await getSocket();
  socket.emit("room:join", { roomId });
};

export const leaveRoom = async () => {
  const socket = await getSocket();
  socket.emit("room:leave");
};

getSocket().then(socket => {
  socket.on("room:get", ({ data }) => {
    rooms.set(data);
  });

  socket.on("room:joined", ({ data }) => {
    room.set(data);
  });

  socket.on("room:destroy", ({ data }) => {
    room.set({ destroyed: true, message: data });
  });
});
