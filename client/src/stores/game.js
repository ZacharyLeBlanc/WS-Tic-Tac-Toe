import { writable } from "svelte/store";
import { getSocket } from "../api/socket.js";

export const game = writable({ board: [] });

getSocket().then(socket => {
  socket.on("game", gameState => {
    console.log(gameState);
    game.set(gameState);
  });

  socket.on("room:destroy", () => {
    game.set({ board: [] });
  });
});
