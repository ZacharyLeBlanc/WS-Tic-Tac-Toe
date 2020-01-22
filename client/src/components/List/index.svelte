<script>
  export let data = [];
</script>

<ul class="mdc-list mdc-list--two-line">
  {#each data as item}
    <li class="mdc-list-item" tabindex="0" on:click={item.onClick}>
      <span class="mdc-list-item__text">
        <span class="mdc-list-item__primary-text">{item.primary}</span>
        {#if item.secondary}
          <span class="mdc-list-item__secondary-text">{item.secondary}</span>
        {/if}
      </span>
    </li>
  {/each}
</ul>
