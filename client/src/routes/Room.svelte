<script>
  import { game, timer } from "../stores/game.js";
  import { room, leaveRoom, joinRoom, playAgain } from "../stores/room.js";
  import { getSocket } from "../api/socket.js";
  import { navigate } from "svelte-routing";
  import Button from "../components/Button/index.svelte";

  export let id;

  joinRoom("room:" + id);
  getSocket().then(socket => {
    socketId = socket.id;
  });

  let socketId;

  room.subscribe(newValue => {
    if (newValue.destroyed) {
      room.set({ ...newValue, destroyed: false });
      navigate("/rooms/");
    }
  });

  $: winnerText = $game.isTie
    ? "Tie Game!"
    : socketId === $game.winner
    ? "You won!"
    : "You lost!";
  $: turnText =
    socketId === $game.turn ? "It is your turn." : "It is not your turn.";

  const handleClick = async (i, j) => {
    if (!$game.isGameOver) {
      const socket = await getSocket();
      if ($game.turn === socket.id) {
        socket.emit("game:move", { x: i, y: j });
      } else {
        // Not your turn
      }
    }
  };

  const handleLeaveRoom = () => {
    leaveRoom();
  };

  const handlePlayAgain = () => {
    playAgain();
  };
</script>

<style>
  section {
    text-align: center;
  }

  section > * {
    margin: 1.5rem;
  }

  .board-container {
    display: flex;
    justify-content: center;
  }

  .cell {
    font-size: 4rem;
    padding: 1rem;
    height: 4rem;
    width: 4rem;
    border: 1px solid black;
  }
</style>

<div class="container">
  <section>
    <header>
      <h2>You have joined a room.</h2>
      {#if $room.status === 1}
        <h3>Waiting for another player to connect</h3>
      {:else if $game.isGameOver}
        Game Over: {winnerText} Room will timeout in {$timer} seconds
      {:else}{turnText}{/if}
    </header>
    <div class="board-container">
      {#each $game.board as col, i}
        <div class="column">
          {#each col as cell, j}
            <div class="cell" on:click={handleClick.bind(null, i, j)}>
              {cell}
            </div>
          {/each}
        </div>
      {:else}
        <!-- else content here -->
      {/each}
    </div>
    {#if $game.isGameOver}
      <Button onClick={handlePlayAgain}>Play Again</Button>
    {/if}
    <Button onClick={handleLeaveRoom}>Leave Room</Button>
  </section>
</div>
