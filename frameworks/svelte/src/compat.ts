import { render } from 'react-nil';
import React from 'react';
import { writable, get, readable, readonly } from 'svelte/store';

export function removeEvents(props) {
  return Object.fromEntries(
    Object.entries(props ?? {}).filter(([prop]) => !/^on[A-Z]/.test(prop))
  );
}

function getEvents(props) {
  const events = Object.entries(props)
    .filter(([prop]) => /^on[A-Z]/.test(prop))
    .map(([event, handler]) => [event.slice(2).toLowerCase(), ev(handler)]);

  return events;
}

function ev(fn) {
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
    // const [statefulArgs, setStatefulArgs] = React.useState(_ => get(args));
    const _state = hook(...(get(args) as any));

    console.log('doing');
    React.useEffect(() => {
      store.set(_state);
    }, [_state]);

    // React.useEffect(() => {
    //   const unsub = args.subscribe(setStatefulArgs);

    //   return () => unsub();
    // }, []);

    store.set(_state);
  };
}

export function useHook(hook, args = [], ctxs = []) {
  let store = writable(null);
  let ReactApp = createReactApp(
    hook,
    (args as any).subscribe ? args : readable(args),
    store
  );

  console.log('starting');
  render(
    (ctxs as any).reduceRight((acc, [Comp, props = {}]) => {
      return React.createElement(Comp, props, acc);
    }, React.createElement(ReactApp as any))
  );
  console.log('end');

  return readonly(store);
}
