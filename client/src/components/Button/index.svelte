<script>
  export let onClick;
</script>

<button on:click={onClick} class="mdc-button mdc-button--raised">
  <span class="mdc-button__ripple" />
  <slot>Button</slot>
</button>
