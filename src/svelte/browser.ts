import { render } from 'react-nil';
import React from 'react';
import { getEvents } from '../common';
import { writable, get, readable, readonly } from 'svelte/store';

export function removeEvents(props) {
  return Object.fromEntries(
    Object.entries(props ?? {}).filter(([prop]) => !/^on[A-Z]/.test(prop))
  );
}

export function ev(fn) {
  if (!fn) return fn;

  return e => {
    e.nativeEvent = e;
    return fn(e);
  };
}

export function setupEvents(node, obj) {
  const events = getEvents(obj);

  for (const [name, handler] of events) {
    node.addEventListener(name, handler);
  }

  return {
    destroy() {
      for (const [name, handler] of events) {
        node.removeEventListener(name, handler);
      }
    },
  };
}

function createReactApp(hook, args, store) {
  return function ReactApp() {
    const _state = hook(...(get(args) as any));

    console.log('doing');
    React.useEffect(() => {
      store.set(_state);
    }, [_state]);

    store.set(_state);
  };
}

export function use(hook, args = [], ctxs = []) {
  let store = writable(null);
  let ReactApp = createReactApp(
    hook,
    (args as any).subscribe ? args : readable(args),
    store
  );

  render(
    (ctxs as any).reduceRight((acc, [Comp, props = {}]) => {
      return React.createElement(Comp, props, acc);
    }, React.createElement(ReactApp as any))
  );

  return readonly(store);
}
