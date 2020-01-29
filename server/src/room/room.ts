import Game from "../game";
import RoomStatus from "./status";

const STATUS = [RoomStatus.EMPTY, RoomStatus.WAITING, RoomStatus.FULL];

export default class Room {
  public numberOfPlayers = 0;
  public status: RoomStatus = RoomStatus.EMPTY;
  public players: [string, string] = ["", ""];
  public id = "";
  public game: Game;
  public endGameTimer = 60;
  public endGameInterval: NodeJS.Timeout | null = null;
  public rejoinedPlayers: [string, string] = ["", ""];

  public constructor(id: string) {
    this.id = id;
    this.game = new Game(id);
  }

  public join(playerId: string): Promise<Room> {
    return new Promise((resolve, reject) => {
      if (this.status === RoomStatus.FULL) {
        reject(new Error("Room is full"));
        return;
      }
      if (this.players.includes(playerId)) {
        reject(new Error("You are already in this room"));
        return;
      }
      this.players[this.numberOfPlayers] = playerId;
      this.numberOfPlayers++;
      this.status = this.getStatus();
      resolve(this);
    });
  }

  public getStatus(): RoomStatus {
    return STATUS[this.numberOfPlayers];
  }

  public reset(): void {
    this.numberOfPlayers = 0;
    this.status = RoomStatus.EMPTY;
    this.players = ["", ""];
    this.endGameTimer = 60;
    this.game?.reset();
    this.endGameInterval = null;
    this.rejoinedPlayers = ["", ""];
  }

  public endGame(intervalCallback: Function): Promise<[string, string]> {
    return new Promise(resolve => {
      this.endGameInterval = setInterval(() => {
        if (this.endGameTimer > 0) {
          intervalCallback();
          this.endGameTimer--;
        } else {
          const players: [string, string] = this.players;
          this.reset();
          if (this.endGameInterval) {
            clearInterval(this.endGameInterval);
          }
          resolve(players);
        }
      }, 1000);
    });
  }

  public playAgain(playerId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (
        this.players.includes(playerId) &&
        !this.rejoinedPlayers.includes(playerId)
      ) {
        const index: number = this.rejoinedPlayers.indexOf("");
        if (~index) {
          this.rejoinedPlayers[index] = playerId;
        }
        if (!~this.rejoinedPlayers.indexOf("")) {
          this.endGameTimer = 60;
          this.game?.reset();
          this.game?.start(this.rejoinedPlayers);
          this.rejoinedPlayers = ["", ""];
          if (this.endGameInterval) {
            clearInterval(this.endGameInterval);
            this.endGameInterval = null;
          }
        }
        resolve(playerId);
      }
    });
  }

  public startGame(): void {
    if (this.getStatus() === RoomStatus.FULL) {
      this.rejoinedPlayers = ["", ""];
      this.game.start(this.players);
    }
  }
}
