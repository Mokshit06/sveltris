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
            import {renderToString} from 'react-dom/server'
            import SvelteComponent$${name} from ${JSON.stringify(args.path)};

            const ReactComponent$${name} = ((props) => {
              const { children, ...svelteProps } = props;
              const id = React.useId();
              const res = renderToString(children);
              const result = SvelteComponent$${name}.render(svelteProps, {
                $$slots: {
                  default: () => \`<div style="display:contents" id="\${id}">\${res}</div>\`
                }
              })
              
              return  (
                <div
                  style={{display:'contents'}}
                  dangerouslySetInnerHTML={{__html: result.html}}
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
            import ReactDOM from 'react-dom';
            import SvelteComponent$${name} from ${JSON.stringify(args.path)};
            import {
              SvelteComponent,
              binding_callbacks,
              claim_component,
              children,
              mount_component,
              claim_element,
              claim_text,
              detach,
              element,
              attr,
              append_hydration,
              init,
              insert_hydration,
              noop,
              safe_not_equal,
              set_style,
              transition_in,
              transition_out,
              destroy_component
            } from "svelte/internal";

            function create_fragment(ctx) {
              let div;

              return {
                c() {
                  div = element("div");
                  this.h();
                },
                l(nodes) {
                  div = claim_element(nodes, "DIV", { id: true, style: true });
                  var div_nodes = children(div);
                  div_nodes.forEach(detach);
                  this.h();
                },
                h() {
                  attr(div, "id", /*id*/ ctx[0]);
                  set_style(div, "display", "contents");
                },
                m(target, anchor) {
                  insert_hydration(target, div, anchor);
                },
                p(ctx, [dirty]) {
                  if (dirty & /*id*/ 1) {
                    attr(div, "id", /*id*/ ctx[0]);
                  }
                },
                i: noop,
                o: noop,
                d(detaching) {
                  if (detaching) detach(div);
                }
              };
            }

            function instance($$self, $$props, $$invalidate) {
              let { id } = $$props;

              $$self.$$set = $$props => {
                if ('id' in $$props) $$invalidate(0, id = $$props.id);
              };

              return [id];
            }


            class ReactWrapper extends SvelteComponent {
              constructor(options) {
                super();
                init(this, options, instance, create_fragment, safe_not_equal, {});
              }
            }

            function createSlot(id) {
              return function create_default_slot(ctx) {
                let wrapper;
                let current;
                wrapper = new ReactWrapper({
                  props: {
                    id,
                    $$scope: { ctx }
                  },
                });

                return {
                  c() {
                    create_component(wrapper.$$.fragment);
                  },
                  l(nodes) {
                    claim_component(wrapper.$$.fragment, nodes);
                  },
                  m(target, anchor) {
                    mount_component(wrapper, target, anchor);
                    current = true;
                  },
                  i(local) {
                    if (current) return;
                    transition_in(wrapper.$$.fragment, local);
                    current = true;
                  },
                  o(local) {
                    transition_out(wrapper.$$.fragment, local);
                    current = false;
                  },
                  d(detaching) {
                    destroy_component(wrapper, detaching);
                  }
                };
              }
            }

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
              const [mounted, setMounted] = React.useState(false)
              const id = React.useId();
              const events = getEvents(props);
              const {children, ...svelteProps} = props;

              React.useEffect(() => {
                const defaultSlot = createSlot(id);
                let component = new SvelteComponent$${name}({
                  target: rootRef.current,
                  props: {
                    ...svelteProps,
                    $$slots: {
                      default: [defaultSlot]
                    },
                    $$scope: {}
                  },
                  hydrate: true,
                })
                setMounted(true)
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
                <>
                  <div
                    ref={rootRef}
                    style={{display:'contents'}}
                    dangerouslySetInnerHTML={{__html: ""}}
                  />
                  {mounted && ReactDOM.createPortal(children, document.getElementById(id))}
                </>
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
  entryPoints: ['./server.ts'],
  outdir: '.',
  bundle: true,
  platform: 'node',
  external: ['react', 'svelte', 'react-dom', 'express'],
  format: 'cjs',
  plugins,
}).then(p => p.watch());

e.context({
  entryPoints: ['./src/index.ts'],
  outdir: './dist',
  bundle: true,
  platform: 'browser',
  format: 'esm',
  plugins: plugins,
}).then(p => {
  p.watch();
});
