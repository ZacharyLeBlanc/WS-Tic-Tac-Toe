import { derived } from "svelte/store";
import GameMapper from "../mappers/GameMapper";
import { room } from "./room.js";

export const game = derived(room, $room => new GameMapper($room.game));
