/// <reference types="svelte" />
/// <reference types="vite/client" />

declare module '*?in-svelte' {
  const Component: import('svelte').ComponentType;

  export default Component;
}
