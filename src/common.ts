export function getEvents(props: any): [string, any][] {
  const events = Object.entries(props)
    .filter(([prop]) => /^on[A-Z]/.test(prop))
    .map(([event, handler]) => [event.slice(2).toLowerCase(), handler]);

  return events as any;
}
