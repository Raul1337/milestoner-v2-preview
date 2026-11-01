import { defineConfig } from 'vite';

export default defineConfig({
  base: '/milestoner-v2-preview/',
  define: {'import.meta.env.VITE_CURRENT_HOME': JSON.stringify('true'), 'import.meta.env.VITE_PROJECT_CARD_LAB': JSON.stringify('false')},
});
