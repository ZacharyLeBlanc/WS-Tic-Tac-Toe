export default class {
  constructor(
    gameState = {
      _board: [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
      ],
    },
  ) {
    const {
      _board,
      _isGameOver,
      _isTie,
      _moveCount,
      _playerOne,
      _playerTwo,
      _turn,
      _winner,
    } = gameState;
    this.board = _board;
    this.isGameOver = _isGameOver;
    this.isTie = _isTie;
    this.moveCount = _moveCount;
    this.playerOne = _playerOne;
    this.playerTwo = _playerTwo;
    this.turn = _turn;
    this.winner = _winner;
  }
}
