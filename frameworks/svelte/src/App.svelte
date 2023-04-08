<script>
  import { useHook as use } from './compat';
  import { useState } from 'react';
  import Button from './Button.svelte';

  const result = use(() => useState(0));
</script>

<Button on:click={console.log} f="f">Yo does this work</Button>
{#if $result}
  {@const [count, setCount] = $result}
  <button on:click={() => setCount(c => c + 1)}>{count}</button>
{/if}
