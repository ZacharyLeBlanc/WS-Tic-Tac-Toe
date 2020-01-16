import { writable } from "svelte/store";

export const VIEWS = {
  LIST: 0,
  ROOM: 1,
};

export const view = writable(VIEWS.LIST);
