export default class Game {
  static Games = new Map<string, Game>();

  static getGame = (room: string): Game => Game.Games.get(room);

  board: string[][] = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  isGameOver: boolean = false;
  isTie: boolean = null;
  moveCount: number = 0;
  playerOne: string = null;
  playerTwo: string = null;
  turn: string = null;
  winner: string = null;

  constructor(players: string[], room: string) {
    const randomPlayerIndex: number = Math.floor(Math.random() * 2);
    this.playerOne = players[randomPlayerIndex];
    this.turn = players[randomPlayerIndex];
    this.playerTwo = players[+!randomPlayerIndex];
    Game.Games.set(room, this);
  }

  move = (
    { x, y }: { x: number; y: number },
    playerId: string,
  ): {
    board: string[][];
    playerOne: string;
    playerTwo: string;
    turn: string;
    winner: string;
  } => {
    if (!this.isGameOver) {
      if (this.turn === playerId) {
        const isPlayerOne: boolean = this.playerOne === this.turn;
        const symbol: string = isPlayerOne ? "X" : "O";
        if (!this.board[x][y]) {
          this.board[x][y] = symbol;
          const board: string[][] = this.board;
          const n = 3;
          const s: string = symbol;
          // check col
          for (let i = 0; i < n; i++) {
            if (board[x][i] !== s) {
              break;
            }
            if (i === n - 1) {
              this.winner = this.turn;
              this.isGameOver = true;
            }
          }

          // check row
          for (let i = 0; i < n; i++) {
            if (board[i][y] !== s) {
              break;
            }
            if (i === n - 1) {
              this.winner = this.turn;
              this.isGameOver = true;
            }
          }

          // check diag
          if (x === y) {
            // we're on a diagonal
            for (let i = 0; i < n; i++) {
              if (board[i][i] !== s) {
                break;
              }
              if (i === n - 1) {
                this.winner = this.turn;
                this.isGameOver = true;
              }
            }
          }

          // check anti diag (thanks rampion)
          if (x + y === n - 1) {
            for (let i = 0; i < n; i++) {
              if (board[i][n - 1 - i] !== s) {
                break;
              }
              if (i === n - 1) {
                this.winner = this.turn;
                this.isGameOver = true;
              }
            }
          }

          // check draw
          if (this.moveCount == Math.pow(n, 2) - 1) {
            this.isTie = true;
            this.isGameOver = true;
          }

          if (isPlayerOne) {
            this.turn = this.playerTwo;
          } else {
            this.turn = this.playerOne;
          }
        }
      }
      this.moveCount++;
    }
    return this;
  };

  reset = () => {
    this.board = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
    this.isGameOver = false;
    this.isTie = null;
    this.moveCount = 0;
    this.playerOne = null;
    this.playerTwo = null;
    this.turn = null;
    this.winner = null;
  };
}
