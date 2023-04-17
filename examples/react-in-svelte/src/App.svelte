<script lang="ts">
  import svelteLogo from './assets/svelte.svg';
  import reactLogo from './assets/react.svg';
  import Button from './button.tsx?in-svelte';

  let count: number = 0;
  const increment = () => {
    count += 1;
  };
</script>

<main>
  <div>
    <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
      <img src={reactLogo} class="logo" alt="Vite Logo" />
    </a>
    <a href="https://svelte.dev" target="_blank" rel="noreferrer">
      <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
    </a>
  </div>
  <h1>React in Svelte</h1>

  <div class="card">
    <button on:click={increment}>
      svelte is {count}
    </button>
    <Button onClick={increment} {count} />
  </div>

  <p>
    Check out <a
      href="https://github.com/mokshit06/sveltris#readme"
      target="_blank"
      rel="noreferrer">Sveltris</a
    >, the library powering this magic.
  </p>
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em rgba(20, 158, 202, 0.667));
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em rgba(255, 62, 0, 0.667));
  }
</style>
