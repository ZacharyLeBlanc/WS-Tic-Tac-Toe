import { writable } from "svelte/store";
import { getSocket } from "../api/socket.js";
import GameMapper from "../mappers/GameMapper";

export const game = writable({ board: [] });
export const timer = writable(60);

getSocket().then(socket => {
  socket.on("game", gameState => {
    game.set(new GameMapper(gameState));
  });

  socket.on("room:destroy", () => {
    game.set({ board: [] });
  });

  socket.on("game:timer", seconds => {
    timer.set(seconds);
  });
});
