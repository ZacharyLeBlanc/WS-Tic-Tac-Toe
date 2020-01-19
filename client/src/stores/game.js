import { writable } from "svelte/store";
import { getSocket } from "../api/socket.js";
import GameMapper from "../mappers/GameMapper";

export const game = writable({ board: [] });

getSocket().then(socket => {
  socket.on("game", gameState => {
    console.log(gameState);
    game.set(new GameMapper(gameState));
  });

  socket.on("room:destroy", () => {
    game.set({ board: [] });
  });
});
