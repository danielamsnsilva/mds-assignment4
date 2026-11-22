import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const root = fileURLToPath(new URL('.', import.meta.url));

/**
 * Every JavaScript chunk that only contains FLOW/LAB code is written to this
 * folder. The Netlify edge function protects it together with
 * KanbanFlowLab.html, so the course content cannot be downloaded without
 * signing in. Shared code (React, the design system) stays in `assets/`
 * because the public login page needs it too.
 */
const PROTECTED_DIR = 'kanban-assets';

const toPosix = (id) => id.replaceAll('\\', '/');
const isKanbanModule = (id) => toPosix(id).includes('/src/kanban/');

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        login: `${root}index.html`,
        kanban: `${root}KanbanFlowLab.html`,
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor';
          return undefined;
        },
        entryFileNames: (chunk) =>
          chunk.name === 'kanban'
            ? `${PROTECTED_DIR}/[name]-[hash].js`
            : 'assets/[name]-[hash].js',
        chunkFileNames: (chunk) =>
          chunk.moduleIds.length > 0 && chunk.moduleIds.every(isKanbanModule)
            ? `${PROTECTED_DIR}/[name]-[hash].js`
            : 'assets/[name]-[hash].js',
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.js'],
  },
});
