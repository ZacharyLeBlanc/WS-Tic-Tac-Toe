<script context="module">
  export let snackBar;
</script>

<script>
  import { onMount } from "svelte";
  import { MDCSnackbar } from "@material/snackbar";

  onMount(() => {
    snackBar = new MDCSnackbar(document.querySelector(".mdc-snackbar"));
  });
</script>

<div class="mdc-snackbar">
  <div class="mdc-snackbar__surface">
    <div class="mdc-snackbar__label" role="status" aria-live="polite">
      Can't send photo. Retry in 5 seconds.
    </div>
    <div class="mdc-snackbar__actions">
      <button type="button" class="mdc-button mdc-snackbar__action">
        Retry
      </button>
    </div>
  </div>
</div>
