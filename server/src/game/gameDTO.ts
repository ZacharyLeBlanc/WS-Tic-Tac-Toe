import Game from ".";

export default class GameDTO {
  public board: string[][];
  public isGameOver: boolean;
  public isTie: boolean;
  public moveCount: number;
  public playerOne: string;
  public playerTwo: string;
  public turn: string;
  public winner: string;
  public started: boolean;

  public constructor(game: Game) {
    this.board = game.board;
    this.isGameOver = game.isGameOver;
    this.isTie = game.isTie;
    this.moveCount = game.moveCount;
    this.playerOne = game.playerOne;
    this.playerTwo = game.playerTwo;
    this.turn = game.turn;
    this.winner = game.winner;
    this.started = game.started;
  }
}
