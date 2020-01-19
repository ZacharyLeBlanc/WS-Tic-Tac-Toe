import Game from "../Game";
export { default as RoomManager } from "./Manager";

export enum RoomStatus {
  EMPTY,
  WAITING,
  FULL,
}

export class Room {
  numberOfPlayers = 0;
  status: RoomStatus = RoomStatus.EMPTY;
  players: [string, string] = ["", ""];
  id: string = null;
  game: Game;

  constructor(id: string) {
    this.id = id;
  }

  join = (socket: SocketIO.Socket): Promise<Room> => {
    return new Promise((resolve, reject) => {
      if (this.status === RoomStatus.FULL) {
        reject("Room is full");
        return;
      }
      if (this.players.includes(socket.id)) {
        reject("You are already in this room");
        return;
      }
      this.players[this.numberOfPlayers] = socket.id;
      this.numberOfPlayers++;
      this.status = this.getStatus();
      socket.join(this.id, () => {
        if (this.getStatus() === RoomStatus.FULL) {
          this.game = new Game(this.players, this.id);
        }
        resolve(this);
      });
    });
  };

  getStatus = (): RoomStatus => {
    const numberOfMembers: number = this.numberOfPlayers;
    switch (numberOfMembers) {
      case 1:
        return RoomStatus.WAITING;
      case 2:
        return RoomStatus.FULL;
      case 0:
      default:
        return RoomStatus.EMPTY;
    }
  };

  reset = (): void => {
    this.numberOfPlayers = 0;
    this.status = RoomStatus.EMPTY;
    this.players;
    this.players = ["", ""];
    this.game = null;
  };
}
