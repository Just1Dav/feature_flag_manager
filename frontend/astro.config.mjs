import tailwindcss from '@tailwindcss/vite';

// @ts-check
import react from '@astrojs/react';
import node from '@astrojs/node';
import { defineConfig, envField } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  output: 'server',

  adapter: node({
    mode: 'standalone',
  }),

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react()],

  env: {
    schema: {
      INTERNAL_API_URL: envField.string({
        default: 'http://localhost:3000',
        context: 'server',
        access: 'secret',
      }),
    },
  },
});
