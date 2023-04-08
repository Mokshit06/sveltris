import React from 'react';
import ReactDOMServer from 'react-dom/server';

export function createReactNodeComponent(name: string, SvelteComponent$$: any) {
  const ReactComponent$$ = props => {
    const { children, ...svelteProps } = props;
    const id = React.useId();
    const res = ReactDOMServer.renderToString(children);
    const result = SvelteComponent$$.render(svelteProps, {
      $$slots: {
        default: () => `<div style="display:contents" id="${id}">${res}</div>`,
      },
    });

    return (
      <div
        style={{ display: 'contents' }}
        dangerouslySetInnerHTML={{ __html: result.html }}
      />
    );
  };

  Object.defineProperty(ReactComponent$$, 'name', { value: name });
  (ReactComponent$$ as any).displayName = name;

  return ReactComponent$$;
}
