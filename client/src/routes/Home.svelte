<script>
  import { link } from "svelte-routing";
</script>

<style>
  .container {
    display: flex;
    align-items: center;
    flex-flow: column;
    text-align: center;
  }

  .container > * {
    margin: 3rem 0;
  }
</style>

<div class="container">
  <h1>Welcome!</h1>
  <h2>To begin playing join a room.</h2>
  <a href="/rooms/" class="mdc-button mdc-button--raised" use:link>
    List of Rooms
  </a>
</div>
