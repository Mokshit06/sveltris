import React from 'react';
import {
  attr,
  children,
  claim_component,
  claim_element,
  create_component,
  destroy_component,
  detach,
  element,
  init,
  insert_hydration,
  mount_component,
  noop,
  safe_not_equal,
  set_style,
  SvelteComponent,
  transition_in,
  transition_out,
} from 'svelte/internal';
import { getEvents } from '../common';
import ReactDOM from 'react-dom';

function create_fragment(ctx) {
  let div;

  return {
    c() {
      div = element('div');
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, 'DIV', { id: true, style: true });
      var div_nodes = children(div);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div, 'id', /*id*/ ctx[0]);
      // @ts-expect-error
      set_style(div, 'display', 'contents');
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
    },
    p(ctx, [dirty]) {
      if (dirty & /*id*/ 1) {
        attr(div, 'id', /*id*/ ctx[0]);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) detach(div);
    },
  };
}

function instance($$self, $$props, $$invalidate) {
  let { id } = $$props;

  $$self.$$set = $$props => {
    if ('id' in $$props) $$invalidate(0, (id = $$props.id));
  };

  return [id];
}

class ReactWrapper extends SvelteComponent {
  constructor(options) {
    super();
    // @ts-expect-error
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
        $$scope: { ctx },
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
        // @ts-expect-error
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
      },
    };
  };
}

export function createReactBrowserComponent(
  name: string,
  SvelteComponent$$: any
) {
  let ReactComponent$$ = function ReactComponent(props) {
    const rootRef = React.useRef<HTMLDivElement>(null);
    const svelteComponentRef = React.useRef<any>();
    const [mounted, setMounted] = React.useState(false);
    const id = React.useId();
    const events = getEvents(props);
    const { children, ...svelteProps } = props;

    React.useEffect(() => {
      const defaultSlot = createSlot(id);
      let component = new SvelteComponent$$({
        target: rootRef.current,
        props: {
          ...svelteProps,
          $$slots: {
            default: [defaultSlot],
          },
          $$scope: {},
        },
        hydrate: true,
      });
      setMounted(true);
      svelteComponentRef.current = component;

      for (const [event, handler] of events) {
        component.$on(event, handler);
      }

      return () => {
        component.$destroy();
      };
    }, []);

    React.useEffect(() => {
      React.startTransition(() => {
        svelteComponentRef.current!.$set(props);
      });
    }, [props]);

    return (
      <>
        <div
          ref={rootRef}
          style={{ display: 'contents' }}
          dangerouslySetInnerHTML={{ __html: '' }}
        />
        {mounted &&
          ReactDOM.createPortal(children, document.getElementById(id))}
      </>
    );
  };

  Object.defineProperty(ReactComponent$$, 'name', { value: name });
  (ReactComponent$$ as any).displayName = name;

  return React.memo(ReactComponent$$);
}
