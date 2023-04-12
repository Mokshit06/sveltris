import path from 'path';
import { createUnplugin } from 'unplugin';
import { outdent } from 'outdent';

export const sveltrisSvelteInReact = createUnplugin((options: {}) => {
  return {
    name: 'sveltris-svelte-in-react',
    transformInclude(id) {
      return id.endsWith('?in-react');
    },
    transform(_code, id) {
      const { name } = path.parse(id);

      return outdent`
        import SvelteComponent$${name} from ${JSON.stringify(
        id.replace(/\?in-react$/, '')
      )};
        import {createReactComponent} from 'sveltris/react'

        const ReactComponent$${name} = createReactComponent(
          \`ReactComponent$${name}\`,
          SvelteComponent$${name}
        );

        export default ReactComponent$${name}
      `;
    },
  };
});
