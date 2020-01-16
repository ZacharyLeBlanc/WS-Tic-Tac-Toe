export default class Game {
  private static Games = new Map<string, Game>();
  private static BOARD_SIZE: number = 3;

  public static getGame = (room: string): Game => Game.Games.get(room);

  private _board: string[][] = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  private _isGameOver: boolean = false;
  private _isTie: boolean = null;
  private _moveCount: number = 0;
  private _playerOne: string = null;
  private _playerTwo: string = null;
  private _turn: string = null;
  private _winner: string = null;

  constructor(players: [string, string], room: string) {
    const randomPlayerIndex: number = Math.floor(Math.random() * 2);
    this._playerOne = players[randomPlayerIndex];
    this._turn = players[randomPlayerIndex];
    this._playerTwo = players[+!randomPlayerIndex];
    Game.Games.set(room, this);
  }

  get board(): string[][] {
    return this._board;
  }

  get isGameOver(): boolean {
    return this._isGameOver;
  }

  get isTie(): boolean {
    return this._isTie;
  }

  get moveCount(): number {
    return this._moveCount;
  }

  get playerOne(): string {
    return this._playerOne;
  }

  get playerTwo(): string {
    return this._playerTwo;
  }

  get turn(): string {
    return this._turn;
  }

  get winner(): string {
    return this._winner;
  }

  private handleWinner(playerId: string) {
    this._winner = playerId;
    this._isGameOver = true;
  }

  public move({ x, y }: { x: number; y: number }, playerId: string): Game {
    // Validate that the game is not over and that the currect player is making their turn.
    if (!this.isGameOver && this.turn === playerId) {
      // Validate that this position on the board is valid.
      if (x < 3 && y < 3 && !this.board[x][y]) {
        const isPlayerOne: boolean = this.playerOne === this.turn;
        const symbol: string = isPlayerOne ? "X" : "O";
        const board: string[][] = this.board;
        // Make players turn
        board[x][y] = symbol;
        this._moveCount++;
        // Determine if there is a winner.
        // Columns
        for (let i = 0; i < Game.BOARD_SIZE; i++) {
          if (board[x][i] !== symbol) {
            break;
          }
          if (i === Game.BOARD_SIZE - 1) {
            this.handleWinner(this.turn);
            return this;
          }
        }
        // Rows
        for (let i = 0; i < Game.BOARD_SIZE; i++) {
          if (board[i][y] !== symbol) {
            break;
          }
          if (i === Game.BOARD_SIZE - 1) {
            this.handleWinner(this.turn);
            return this;
          }
        }
        // Diagonal
        if (x === y) {
          for (let i = 0; i < Game.BOARD_SIZE; i++) {
            if (board[i][i] !== symbol) {
              break;
            }
            if (i === Game.BOARD_SIZE - 1) {
              this.handleWinner(this.turn);
              return this;
            }
          }
        }
        // Reverse Diagonal
        if (x + y === Game.BOARD_SIZE - 1) {
          for (let i = 0; i < Game.BOARD_SIZE; i++) {
            if (board[i][Game.BOARD_SIZE - 1 - i] !== symbol) {
              break;
            }
            if (i === Game.BOARD_SIZE - 1) {
              this.handleWinner(this.turn);
              return this;
            }
          }
        }
        // Determine if there is a draw.
        if (this.moveCount === Math.pow(Game.BOARD_SIZE, 2) - 1) {
          this._isTie = true;
          this._isGameOver = true;
          return this;
        }
        // Change turns
        this._turn = isPlayerOne ? this.playerTwo : this.playerOne;
      }
    }
    return this;
  }
}
