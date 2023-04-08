<script>
  import { onMount, createEventDispatcher, onDestroy } from 'svelte';
  import { Button as B } from './Button';
  import React from 'react';
  import ReactDOM from 'react-dom/client';

  const dispatch = createEventDispatcher();

  let ref;
  let root;

  onMount(() => {
    console.log(props);
    const { $$slots, $$scope, ...p } = props;
    const props = new Proxy(p, {
      get(target, prop) {
        if (!(prop in target) && /^on[A-Z]/.test(prop)) {
          return e => {
            dispatch(prop.slice(2).toLowerCase(), e);
          };
        }
      },
    });
    root = ReactDOM.createRoot(ref).render(React.createElement(B, props));
  });

  onDestroy(() => {
    root?.unmount();
  });
</script>

<div style="display: contents" bind:this={ref} />
