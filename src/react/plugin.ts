import path from 'path';
import { createUnplugin } from 'unplugin';
import { outdent } from 'outdent';

const svelteInReact = createUnplugin((options: {}) => {
  return {
    name: 'svelte-in-react',
    transformInclude(id) {
      return id.endsWith('?in-react');
    },
    transform(_code, id) {
      const { name } = path.parse(id);

      return outdent`
        import SvelteComponent$${name} from ${JSON.stringify(
        id.replace(/\?in-react$/, '')
      )};
        import {createReactComponent} from 'svelact/react'

        const ReactComponent$${name} = createReactComponent(
          \`ReactComponent$${name}\`,
          SvelteComponent$${name}
        );

        export default ReactComponent$${name}
      `;
    },
  };
});

export const {
  esbuild: svelteInReactEsbuildPlugin,
  vite: svelteInReactVitePlugin,
  webpack: svelteInReactWebpackPlugin,
} = svelteInReact;
