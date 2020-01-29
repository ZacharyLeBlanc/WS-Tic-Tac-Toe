import { derived } from "svelte/store";
import { room } from "./room.js";

export const game = derived(
  room,
  $room =>
    $room.game || {
      board: [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
      ],
    },
);
