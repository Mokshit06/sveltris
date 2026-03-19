import React from 'react';
import ReactDOMServer from 'react-dom/server';

export function createReactComponent(name: string, SvelteComponent$$: any) {
  const ReactComponent$$ = props => {
    const { children, ...svelteProps } = props;
    const id = React.useId();
    const res = ReactDOMServer.renderToString(children);
    const result = SvelteComponent$$.render(svelteProps, {
      $$slots: {
        default: () => `<div style="display:contents" id="${id}">${res}</div>`,
      },
    });

    // Include Svelte component CSS that would otherwise be silently discarded
    const cssCode = result.css?.code;
    const htmlWithCss = cssCode
      ? `<style>${cssCode}</style>${result.html}`
      : result.html;

    return (
      <div
        style={{ display: 'contents' }}
        dangerouslySetInnerHTML={{ __html: htmlWithCss }}
      />
    );
  };

  Object.defineProperty(ReactComponent$$, 'name', { value: name });
  (ReactComponent$$ as any).displayName = name;

  return ReactComponent$$;
}
