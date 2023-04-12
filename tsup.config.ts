import { defineConfig } from 'tsup';
import { createRequire } from 'module';

export default defineConfig({
  entry: [
    'src/react/browser.tsx',
    'src/react/node.tsx',
    'src/svelte/browser.ts',
    'src/svelte/node.ts',
    'src/index.ts',
    // 'src/svelte/plugin.ts',
    // 'src/react/plugin.ts',
  ],
  splitting: false,
  clean: true,
  platform: 'node',
  external: ['react-nil', 'unplugin', 'react', 'react-dom', 'svelte'],
  format: ['esm', 'cjs'],
  target: 'esnext',
  dts: true,
});
