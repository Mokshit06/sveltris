const e = require('esbuild');
const svelte = require('svelte/compiler');
const fs = require('fs');
const path = require('path');

// const createSuspender = () => {
//   let fulfilled = false;
//   let resolve;
//   let promise = new Promise(r => resolve = r).then(() => fulfilled = true);

//   return {
//     fulfill() {
//       resolve();
//       fulfilled = true;
//     },
//     read() {
//       if (fulfilled) {
//         return null
//       }

//       throw promise;
//     }
//   }
// }

// const Suspend = (props) => {
//   props.suspender.read()

//   return null;
// }

/** @type {e.Plugin[]} */
const plugins = [
  {
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
            import React from 'react';
            import SvelteComponent$${name} from ${JSON.stringify(args.path)};

            const ReactComponent$${name} = ((props) => {
              return  (
                <div
                  style={{display:'contents'}}
                  dangerouslySetInnerHTML={{__html: SvelteComponent$${name}.render(props).html}}
                />
              )
            })

            export default ReactComponent$${name}
            `;

            return {
              contents: serverCode,
              loader: 'tsx',
              resolveDir: dir,
            };
          }

          const clientCode = `
            import React from 'react';
            import SvelteComponent$${name} from ${JSON.stringify(args.path)};

            function getEvents(props) {
              const events = Object.entries(props)
                .filter(([prop]) => /^on[A-Z]/.test(prop))
                .map(([event, handler]) => [
                  event.slice(2).toLowerCase(),
                  handler,
                ]);

              return events;
            }

            const ReactComponent$${name} = React.memo(function ReactComponent$${name}(props) {
              const rootRef = React.useRef();
              const svelteComponentRef = React.useRef();
              const events = getEvents(props);

              React.useEffect(() => {
                let component = new SvelteComponent$${name}({
                  target: rootRef.current,
                  props: props,
                  hydrate: true
                })
                svelteComponentRef.current = component

                for (const [event, handler] of events) {
                  component.$on(event, handler)
                }

                return () => {
                  component.$destroy()
                }
              }, [])

              React.useEffect(() => {
                React.startTransition(() => {
                  svelteComponentRef.current.$set(props)
                })
              }, [props])
              
              return  (
                <div
                  ref={rootRef}
                  style={{display:'contents'}}
                  dangerouslySetInnerHTML={{__html: ""}}
                />
              )
            })

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
  },
  {
    name: 'svelte-plugin',
    setup(build) {
      build.onLoad({ filter: /\.svelte$/ }, args => {
        const content = fs.readFileSync(args.path, 'utf8');
        const res = svelte.compile(content, {
          generate: build.initialOptions.platform === 'node' ? 'ssr' : 'dom',
          hydratable: true,
        });

        return {
          contents: res.js.code,
          loader: 'js',
        };
      });
    },
  },
];

e.context({
  entryPoints: ['frameworks/react/server.ts'],
  outdir: 'frameworks/react',
  bundle: true,
  platform: 'node',
  external: ['react', 'svelte', 'react-dom', 'express'],
  format: 'cjs',
  plugins,
}).then(p => p.watch());

e.context({
  entryPoints: ['frameworks/react/src/index.ts'],
  outdir: 'frameworks/react/dist',
  bundle: true,
  platform: 'browser',
  format: 'esm',
  plugins: plugins,
}).then(p => {
  p.watch();
});
