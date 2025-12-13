import eslintPluginAstro from 'eslint-plugin-astro';
import eslint from '@eslint/js';

export default [
  {
    ignores: ['eslint.config.js', '.astro/**', 'node_modules/**', 'src/generated/**'],
  },
  eslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
];
