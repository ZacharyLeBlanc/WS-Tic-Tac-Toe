import GameDTO from "../game/gameDTO";
import RoomStatus from "./status";
import Room from "./room";

export default class RoomDTO {
  public numberOfPlayers: number;
  public status: RoomStatus;
  public players: [string, string];
  public id: string;
  public game: GameDTO;
  public endGameTimer: number;
  public rejoinedPlayers: [string, string];

  public constructor(room: Room) {
    this.numberOfPlayers = room.numberOfPlayers;
    this.status = room.status;
    this.players = room.players;
    this.id = room.id;
    this.game = room.game.toDTO();
    this.endGameTimer = room.endGameTimer;
    this.rejoinedPlayers = room.rejoinedPlayers;
  }
}
