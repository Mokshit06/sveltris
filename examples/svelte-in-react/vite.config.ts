import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { svelteInReactVitePlugin } from 'svelact/react/plugin';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svelteInReactVitePlugin(),
    svelte({ compilerOptions: { hydratable: true } }),
  ],
});
