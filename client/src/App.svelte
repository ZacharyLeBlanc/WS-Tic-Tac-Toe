<script>
  import Header from "./components/Header/index.svelte";
  import SnackBar from "./components/SnackBar/index.svelte";
  import { Router, Route } from "svelte-routing";
  import { Home, Room, Rooms } from "./routes";
</script>

<style>
  main {
    padding-top: 64px;
  }
</style>

<Router>
  <Header title="Tic Tac Toe" />
  <main id="main-content" class="main-content">
    <Route path="rooms/:id" let:params>
      <Room id={params.id} />
    </Route>
    <Route path="rooms" component={Rooms} />
    <Route path="/" component={Home} />
  </main>
  <SnackBar />
</Router>
