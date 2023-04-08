import svelte from 'svelte/compiler';
import fs from 'fs';
import path from 'path';
import { Plugin } from 'esbuild';

export const svelteFromReact = (): Plugin => {
  return {
    name: 'svelte-from-react',
    setup(build) {
      build.onResolve({ filter: /\?svelte$/ }, args => {
        return {
          path: path.join(args.resolveDir, args.path.replace(/\?svelte$/, '')),
          namespace: 'svelte-react-plugin',
          pluginData: {
            importer: args.importer,
          },
        };
      });

      build.onLoad({ filter: /.*/, namespace: 'svelte-react-plugin' }, args => {
        const { ext, dir } = path.parse(args.pluginData.importer);
        const { name } = path.parse(args.path);

        if (ext === '.tsx') {
          if (build.initialOptions.platform === 'node') {
            const serverCode = `
            import SvelteComponent$${name} from ${JSON.stringify(args.path)};
            import {createReactNodeComponent} from 'svelte-react/react/node'

            const ReactComponent$${name} = createReactNodeComponent(
              \`ReactComponent$${name}\`,
              SvelteComponent$${name}
            );

            export default ReactComponent$${name}
            `;

            return {
              contents: serverCode,
              loader: 'tsx',
              resolveDir: dir,
            };
          }

          const clientCode = `
            import {createReactBrowserComponent} from 'svelte-react/react/browser'
            import SvelteComponent$${name} from ${JSON.stringify(args.path)};

            const ReactComponent$${name} = createReactBrowserComponent(
              \`ReactComponent$${name}\`,
              SvelteComponent$${name}
            );

            export default ReactComponent$${name}
            `;

          return {
            contents: clientCode,
            loader: 'tsx',
            resolveDir: dir,
          };
        }

        return {
          contents: 'module.exports = {}',
          loader: 'js',
          resolveDir: dir,
        };
      });
    },
  };
};
