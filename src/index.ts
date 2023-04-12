import { sveltrisReactInSvelte } from './svelte/plugin';
import { sveltrisSvelteInReact } from './react/plugin';

export const sveltrisEsbuildPlugins = () => [
  sveltrisReactInSvelte.esbuild(),
  sveltrisSvelteInReact.esbuild(),
];

export const sveltrisWebpackPlugins = () => [
  sveltrisReactInSvelte.webpack(),
  sveltrisSvelteInReact.webpack(),
];

export const sveltrisVitePlugins = () => [
  sveltrisReactInSvelte.vite(),
  sveltrisSvelteInReact.vite(),
];

export const sveltrisRollupPlugins = () => [
  sveltrisReactInSvelte.rollup(),
  sveltrisSvelteInReact.rollup(),
];
