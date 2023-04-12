<p align="center">
  <!-- <img src="https://raw.githubusercontent.com/mokshit06/sveltris/main/.github/sveltris-logo.png" width="150px" /> -->
  <img src="https://res.cloudinary.com/dzqjbkm5q/image/upload/v1681314312/Sveltris_1_elwdwj.png" width="200px" />
  <h2 align="center">Sveltris</h2>
  <p align="center">
  Piece together <strong>any</strong> framework with Svelte <em>like Tetris</em>
  </p>
</p>

---

## Introduction

Svelte has amazing DX but smaller ecosystem, so there are often certain libraries that are only available in React. It could also be that you want to use a Svelte library in React.

You _could_ rewrite your entire app in the other framework or **_just use_ Sveltris**

With sveltris, you can intermix UI primitives like components, and state primitives like hooks between frameworks, _without_ even noticing.

## Features

Currently Sveltris only supports React, but might support others soon.

**Hooks inside svelte** - You can use logic hooks from React inside svelte by just wrapping them in `use`. This returns a svelte store that is reactive to the changes to hook state.

```html
<script>
  import { useCounter } from 'some-lib';
  import { use } from 'sveltris';

  const counter = use(useCounter());
</script>

{#if $counter} {@const { count, increment } = $counter}
<button on:click="{increment}">{count}</button>
{/if}
```

**React components inside svelte** - Import react components inside Svelte files with `?in-svelte` query. You can pass props, events etc. to it as if it was a svelte component

```html
<script>
  import Counter from './Counter.jsx?in-svelte';
</script>

<Counter />
```

**Svelte components inside React** - Import svelte components inside React with `?in-react` query. You can pass props, children, events etc. to it as if it was a React component.

```jsx
import Counter from './Counter.svelte?in-react';

function App() {
  return <Counter />;
}
```
