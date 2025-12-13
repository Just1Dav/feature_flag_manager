import eslintPluginAstro from 'eslint-plugin-astro';
import eslint from '@eslint/js';

export default [
  {
    ignores: [
      'eslint.config.js',
      'dist/**',
      '.astro/**',
      'node_modules/**',
      'src/generated/**',
      'src/components/ui/**',
    ],
  },
  eslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {},
];
