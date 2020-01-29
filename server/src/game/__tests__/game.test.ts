import Game from "../index";

describe("Game Tests", () => {
  const PLAYER_ONE = "PlayerOne";
  const PLAYER_TWO = "PlayerTwo";
  const ROOM_ID = "RoomID";
  it("Should create a new game", () => {
    const game: Game = new Game(ROOM_ID);
    game.start([PLAYER_ONE, PLAYER_TWO]);
    const { playerOne, playerTwo, turn }: Game = game;
    const isTurnAPlayer: boolean = [playerOne, playerTwo].includes(turn);
    expect(isTurnAPlayer).toBe(true);
    expect(Game.getGame("RoomID")).not.toBeNull();
  });

  describe("Game Logic Tests", () => {
    it("should place the move on the board", () => {
      const game: Game = new Game(ROOM_ID);
      game.start([PLAYER_ONE, PLAYER_TWO]);
      const { turn }: { turn: string } = game;
      const symbol: string = game.turn === game.playerOne ? "X" : "O";
      const newBoard: string[][] = [
        [symbol, "", ""],
        ["", "", ""],
        ["", "", ""],
      ];
      game.move({ x: 0, y: 0 }, turn);
      expect(game.board).toEqual(newBoard);
    });

    it("should switch turns after valid move", () => {
      const game: Game = new Game(ROOM_ID);
      game.start([PLAYER_ONE, PLAYER_TWO]);
      const { turn }: { turn: string } = game;
      game.move({ x: 7, y: 0 }, turn);
      expect(game.turn).toEqual(turn);
      game.move({ x: 0, y: 0 }, turn);
      expect(game.turn).toEqual(
        [PLAYER_ONE, PLAYER_TWO].find((player: string) => player !== turn),
      );
    });

    it("should validate board position", () => {
      const game: Game = new Game(ROOM_ID);
      game.start([PLAYER_ONE, PLAYER_TWO]);
      const {
        board,
        moveCount,
        turn,
      }: { board: string[][]; moveCount: number; turn: string } = game;
      game.move({ x: 7, y: 0 }, turn);
      expect(game.board).toEqual(board);
      expect(game.moveCount).toEqual(moveCount);
      expect(game.turn).toEqual(turn);
      game.move({ x: -1, y: 0 }, turn);
      expect(game.board).toEqual(board);
      expect(game.moveCount).toEqual(moveCount);
      expect(game.turn).toEqual(turn);
    });

    it("should increment move count on valid turn", () => {
      const game: Game = new Game(ROOM_ID);
      game.start([PLAYER_ONE, PLAYER_TWO]);
      const { moveCount, turn }: { moveCount: number; turn: string } = game;
      game.move({ x: 7, y: 0 }, turn);
      expect(game.moveCount).toEqual(moveCount);
      game.move({ x: 0, y: 0 }, turn);
      expect(game.moveCount).toEqual(moveCount + 1);
    });

    it("should do nothing after the game ends", () => {
      const game: Game = new Game(ROOM_ID);
      game.start([PLAYER_ONE, PLAYER_TWO]);
      let turn: string = game.turn;
      for (let i = 0; i < 3; i++) {
        game.move({ x: 0, y: i }, turn);
        if (i < 3) {
          turn = game.turn;
          game.move({ x: 1, y: i }, turn);
          turn = game.turn;
        }
      }
      expect(game.isGameOver).toBe(true);
      expect(game.winner).toBe(turn);
      const {
        board,
        moveCount,
        turn: finalTurn,
      }: { board: string[][]; moveCount: number; turn: string } = game;
      game.move({ x: 0, y: 0 }, PLAYER_ONE);
      expect(game.board).toEqual(board);
      expect(game.moveCount).toEqual(moveCount);
      expect(game.turn).toEqual(finalTurn);
      game.move({ x: 0, y: 0 }, PLAYER_TWO);
      expect(game.board).toEqual(board);
      expect(game.moveCount).toEqual(moveCount);
      expect(game.turn).toEqual(finalTurn);
    });

    it("should not let wrong player make a move", () => {
      const game: Game = new Game(ROOM_ID);
      game.start([PLAYER_ONE, PLAYER_TWO]);
      const {
        board,
        moveCount,
        turn,
      }: { board: string[][]; moveCount: number; turn: string } = game;
      const wrongPlayer: string =
        [PLAYER_ONE, PLAYER_TWO].find((player: string) => turn !== player) ??
        "";
      game.move({ x: 0, y: 0 }, wrongPlayer);
      expect(game.board).toEqual(board);
      expect(game.moveCount).toEqual(moveCount);
      expect(game.turn).toEqual(turn);
      const symbol: string = game.turn === game.playerOne ? "X" : "O";
      game.move({ x: 0, y: 0 }, turn);
      const newBoard: string[][] = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
      ];
      newBoard[0][0] = symbol;
      expect(game.board).toEqual(newBoard);
      expect(game.moveCount).toEqual(moveCount + 1);
      expect(game.turn).toEqual(wrongPlayer);
    });

    it("should check columns for winner", () => {
      const game1: Game = new Game(ROOM_ID);
      game1.start([PLAYER_ONE, PLAYER_TWO]);
      const game2: Game = new Game(ROOM_ID);
      game2.start([PLAYER_ONE, PLAYER_TWO]);
      const game3: Game = new Game(ROOM_ID);
      game3.start([PLAYER_ONE, PLAYER_TWO]);
      let turn1: string = game1.turn;
      let turn2: string = game2.turn;
      let turn3: string = game3.turn;
      for (let i = 0; i < 3; i++) {
        game1.move({ x: 0, y: i }, turn1);
        game2.move({ x: 1, y: i }, turn2);
        game3.move({ x: 2, y: i }, turn3);
        if (i < 3) {
          turn1 = game1.turn;
          turn2 = game2.turn;
          turn3 = game3.turn;
          game1.move({ x: 1, y: i }, turn1);
          turn1 = game1.turn;
          game2.move({ x: 2, y: i }, turn2);
          turn2 = game2.turn;
          game3.move({ x: 0, y: i }, turn3);
          turn3 = game3.turn;
        }
      }
      expect(game1.isGameOver).toBe(true);
      expect(game1.winner).toBe(turn1);
      expect(game2.isGameOver).toBe(true);
      expect(game2.winner).toBe(turn2);
      expect(game3.isGameOver).toBe(true);
      expect(game3.winner).toBe(turn3);
    });

    it("should check rows for winner", () => {
      const game1: Game = new Game(ROOM_ID);
      game1.start([PLAYER_ONE, PLAYER_TWO]);
      const game2: Game = new Game(ROOM_ID);
      game2.start([PLAYER_ONE, PLAYER_TWO]);
      const game3: Game = new Game(ROOM_ID);
      game3.start([PLAYER_ONE, PLAYER_TWO]);
      let turn1: string = game1.turn;
      let turn2: string = game2.turn;
      let turn3: string = game3.turn;
      for (let i = 0; i < 3; i++) {
        game1.move({ x: i, y: 0 }, turn1);
        game2.move({ x: i, y: 1 }, turn2);
        game3.move({ x: i, y: 2 }, turn3);
        if (i < 3) {
          turn1 = game1.turn;
          turn2 = game2.turn;
          turn3 = game3.turn;
          game1.move({ x: i, y: 1 }, turn1);
          turn1 = game1.turn;
          game2.move({ x: i, y: 2 }, turn2);
          turn2 = game2.turn;
          game3.move({ x: i, y: 0 }, turn3);
          turn3 = game3.turn;
        }
      }
      expect(game1.isGameOver).toBe(true);
      expect(game1.winner).toBe(turn1);
      expect(game2.isGameOver).toBe(true);
      expect(game2.winner).toBe(turn2);
      expect(game3.isGameOver).toBe(true);
      expect(game3.winner).toBe(turn3);
    });

    it("should check diagonal for winner", () => {
      const game: Game = new Game(ROOM_ID);
      game.start([PLAYER_ONE, PLAYER_TWO]);
      let turn: string = game.turn;
      for (let i = 0; i < 3; i++) {
        game.move({ x: i, y: i }, turn);
        if (i < 3) {
          turn = game.turn;
          game.move({ x: i + 1, y: 0 }, turn);
          turn = game.turn;
        }
      }
      expect(game.isGameOver).toBe(true);
      expect(game.winner).toBe(turn);
    });

    it("should check reverse diagonal for winner", () => {
      const game: Game = new Game(ROOM_ID);
      game.start([PLAYER_ONE, PLAYER_TWO]);
      let turn: string = game.turn;
      for (let i = 0, j = 2; i < 3 && j >= 0; i++, j--) {
        game.move({ x: i, y: j }, turn);
        if (i < 3) {
          turn = game.turn;
          game.move({ x: 2, y: i + 1 }, turn);
          turn = game.turn;
        }
      }
      expect(game.isGameOver).toBe(true);
      expect(game.winner).toBe(turn);
    });

    it("should check for a draw", () => {
      const game: Game = new Game(ROOM_ID);
      game.start([PLAYER_ONE, PLAYER_TWO]);
      let turn: string = game.turn;
      game.move({ x: 0, y: 0 }, turn);
      turn = game.turn;
      game.move({ x: 1, y: 0 }, turn);
      turn = game.turn;
      game.move({ x: 2, y: 0 }, turn);
      turn = game.turn;
      game.move({ x: 0, y: 1 }, turn);
      turn = game.turn;
      game.move({ x: 0, y: 2 }, turn);
      turn = game.turn;
      game.move({ x: 1, y: 1 }, turn);
      turn = game.turn;
      game.move({ x: 1, y: 2 }, turn);
      turn = game.turn;
      game.move({ x: 2, y: 2 }, turn);
      turn = game.turn;
      game.move({ x: 1, y: 2 }, turn);
      turn = game.turn;
      game.move({ x: 2, y: 1 }, turn);
      game.board.flat().forEach((cell: string) => {
        expect(cell).not.toBe("");
      });
      expect(game.isGameOver).toBe(true);
      expect(game.winner).toBe("");
      expect(game.isTie).toBe(true);
    });

    it("should reset game", () => {
      const game: Game = new Game(ROOM_ID);
      game.start([PLAYER_ONE, PLAYER_TWO]);
      const { playerOne, playerTwo }: Game = game;
      let turn: string = game.turn;
      let isTurnAPlayer: boolean = [playerOne, playerTwo].includes(turn);
      expect(isTurnAPlayer).toBe(true);
      expect(Game.getGame("RoomID")).not.toBeNull();
      for (let i = 0, j = 2; i < 3 && j >= 0; i++, j--) {
        game.move({ x: i, y: j }, turn);
        if (i < 3) {
          turn = game.turn;
          game.move({ x: 2, y: i + 1 }, turn);
          turn = game.turn;
        }
      }
      expect(game.isGameOver).toBe(true);
      expect(game.winner).toBe(turn);
      game.reset();
      expect(game.board).toEqual([
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
      ]);
      expect(game.isGameOver).toBe(false);
      expect(game.isTie).toBe(false);
      expect(game.moveCount).toBe(0);
      expect(game.playerOne).toBe("");
      expect(game.playerTwo).toBe("");
      expect(game.turn).toBe("");
      expect(game.winner).toBe("");
      expect(game.started).toBe(false);

      game.start([PLAYER_ONE, PLAYER_TWO]);
      turn = game.turn;
      isTurnAPlayer = [playerOne, playerTwo].includes(turn);
      expect(isTurnAPlayer).toBe(true);
      expect(Game.getGame("RoomID")).not.toBeNull();
    });
  });
});
