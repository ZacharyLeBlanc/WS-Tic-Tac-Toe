<script>
  import RoomList from "./components/RoomList/RoomList.svelte";
  import Board from "./components/Board.svelte";
  import { view, VIEWS } from "./stores/view.js";
  import { room } from "./stores/room.js";

  room.subscribe(roomValue => {
    if (roomValue.destroyed) {
      view.set(VIEWS.LIST);
    }
  });
</script>

<style>
  main {
    height: 82vh;
    margin: 2rem 2rem;
  }

  header {
    position: sticky;
    top: 0;
    background-color: #21d4fd;
    background-image: linear-gradient(19deg, #21d4fd 0%, #b721ff 100%);
    height: 10vh;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 5px 16px #000;
  }
</style>

<header>
  <h1>Tic Tac Toe</h1>
</header>
<main>
  {#if $view === VIEWS.LIST}
    <RoomList />
  {:else if $view === VIEWS.ROOM}
    <Board />
  {:else}
    <!-- else content here -->
  {/if}
</main>
