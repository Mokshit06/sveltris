<script>
  export let count;
</script>

<slot />
<button on:click>
  Svelte: {count}
</button>

<style>
</style>
