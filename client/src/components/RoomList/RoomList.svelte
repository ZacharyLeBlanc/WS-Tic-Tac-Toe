<script>
  import { rooms, joinRoom } from "../../stores/room.js";
  import { view, VIEWS } from "../../stores/view.js";

  const status = {
    0: "Empty",
    1: "Waiting",
    2: "Full",
  };
  const handleClick = roomId => {
    joinRoom(roomId);
    view.set(VIEWS.ROOM);
  };
</script>

<style>
  .container {
    height: 100%;
    overflow: auto;
  }

  header {
    display: flex;
    justify-content: space-evenly;
    background-color: #21d4fd;
    background-image: linear-gradient(19deg, #21d4fd 0%, #b721ff 100%);
  }

  header > h2 {
    width: 33%;
    text-align: center;
  }

  .row {
    display: flex;
    justify-content: space-evenly;
    padding: 1rem 0;
  }

  .cell {
    width: 33%;
    text-align: center;
  }
</style>

<div class="container">
  <section>
    <header>
      <h2>Room Id:</h2>
      <h2>Number of Players:</h2>
      <h2>Status:</h2>
    </header>
    {#each $rooms as room}
      <div
        class="row"
        on:click={e => {
          e.preventDefault();
          handleClick(room.id);
        }}>
        <div class="cell">{room.id}</div>
        <div class="cell">{room.numberOfPlayers}</div>
        <div class="cell">{status[room.status]}</div>
      </div>
    {/each}

  </section>
</div>
