const e = require('esbuild');
const s = require('esbuild-svelte');

e.context({
  bundle: true,
  entryPoints: ['src/index.ts'],
  plugins: [s()],
  outdir: 'dist',
  platform: 'browser',
  format: 'esm',
}).then(p => p.watch());
