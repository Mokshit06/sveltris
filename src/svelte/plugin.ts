import path from 'path';
import { createUnplugin } from 'unplugin';
import { outdent } from 'outdent';

export const sveltrisReactInSvelte = createUnplugin(() => {
  return {
    name: 'sveltris-react-in-svelte',
    resolveId(id) {
      if (/^sveltris-react-in-svelte.svelte/.test(id)) {
        return { id: id };
      }
    },
    loadInclude(id) {
      return /^sveltris-react-in-svelte.svelte/.test(id);
    },
    load(id) {
      if (/^sveltris-react-in-svelte.svelte\?path=/.test(id)) {
        console.log({ fullId: id, id: id.slice(28) });
        return outdent`
        <script>
          import { onMount, createEventDispatcher, onDestroy, afterUpdate } from 'svelte';
          import Component from ${JSON.stringify(id.slice(37))};
          import React from 'react';
          import ReactDOM from 'react-dom/client';

          const dispatch = createEventDispatcher();

          let ref;
          let root;

          onMount(() => {
            root = ReactDOM.createRoot(ref)
          });

          afterUpdate(() => {
            const { $$slots, $$scope, ...p } = $$props;
            const props = new Proxy(p, {
              get(target, prop) {
                if (!(prop in target) && /^on[A-Z]/.test(prop)) {
                  return e => {
                    dispatch(prop.slice(2).toLowerCase(), e);
                  };
                }

                return Reflect.get(...arguments)
              },
            });

            root.render(React.createElement(Component, props));
          })
        
          onDestroy(() => {
            root?.unmount();
          });
        </script>

        <div style="display: contents" bind:this={ref} />
        `;
      }
    },
    transformInclude(id) {
      return id.endsWith('?in-svelte');
    },
    transform(_code, id) {
      const { name } = path.parse(id);

      return outdent`
      import Comp$${name} from "sveltris-react-in-svelte.svelte?path=${id.replace(
        '?in-svelte',
        ''
      )}"

      export default Comp$${name}
      `;
    },
  };
});
