import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import react from '@vitejs/plugin-react';
import { reactInSvelteVitePlugin } from 'sveltris/svelte/plugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), react(), reactInSvelteVitePlugin()],
});
