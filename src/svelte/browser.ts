import { render } from 'react-nil';
import React from 'react';
import { getEvents } from '../common';
import { writable, get, readable, readonly } from 'svelte/store';

export function removeEvents(props: any) {
  return Object.fromEntries(
    Object.entries(props ?? {}).filter(([prop]) => !/^on[A-Z]/.test(prop))
  );
}

export function ev(fn: (...args: any[]) => any) {
  if (!fn) return fn;

  return (e: any) => {
    e.nativeEvent = e;
    return fn(e);
  };
}

export function setupEvents(node: HTMLElement, obj: any) {
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

function createReactApp(hook: any, args: any, store: any) {
  return function ReactApp() {
    const _state = hook(...(get(args) as any));

    React.useEffect(() => {
      store.set(_state);
    }, [_state]);

    store.set(_state);
  };
}

export function use(hook: any, args = [], ctxs = []) {
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
