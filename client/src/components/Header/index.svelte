<script>
  import { onMount } from "svelte";
  import { link } from "svelte-routing";
  import { MDCTopAppBar } from "@material/top-app-bar";
  import { MDCDrawer } from "@material/drawer";
  onMount(async () => {
    const drawer = MDCDrawer.attachTo(document.querySelector(".mdc-drawer"));
    const topAppBar = MDCTopAppBar.attachTo(document.getElementById("app-bar"));
    topAppBar.setScrollTarget(document.getElementById("main-content"));
    topAppBar.listen("MDCTopAppBar:nav", () => {
      drawer.open = !drawer.open;
    });
    const listEl = document.querySelector(".mdc-drawer .mdc-list");
    const mainContentEl = document.querySelector(".main-content");

    listEl.addEventListener("click", () => {
      drawer.open = false;
    });

    document.body.addEventListener("MDCDrawer:closed", () => {
      mainContentEl.focus();
    });
  });
  export let title;
</script>

<style>

</style>

<header class="mdc-top-app-bar app-bar" id="app-bar">
  <div class="mdc-top-app-bar__row">
    <section
      class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
      <button
        class="material-icons mdc-top-app-bar__navigation-icon mdc-icon-button">
        menu
      </button>
      <span class="mdc-top-app-bar__title">{title}</span>
    </section>
  </div>
</header>

<aside class="mdc-drawer mdc-drawer--modal">
  <div class="mdc-drawer__content">
    <nav class="mdc-list">
      <a
        class="mdc-list-item mdc-list-item--activated"
        href="/"
        aria-current="page"
        use:link>
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">
          home
        </i>
        <span class="mdc-list-item__text">Home</span>
      </a>
      <a class="mdc-list-item" href="/rooms/" use:link>
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">
          meeting_room
        </i>
        <span class="mdc-list-item__text">Rooms</span>
      </a>
    </nav>
  </div>
</aside>

<div class="mdc-drawer-scrim" />
