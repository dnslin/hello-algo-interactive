import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: [
      'packages/**/*.{test,spec}.{ts,tsx}',
      'apps/**/*.{test,spec}.{ts,tsx}',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
  resolve: {
    alias: {
      '@hello-algo/algorithm-engine': resolve(__dirname, 'packages/algorithm-engine/src'),
      '@hello-algo/renderers-sequence': resolve(__dirname, 'packages/renderers-sequence/src'),
      '@hello-algo/renderers-graph-tree': resolve(__dirname, 'packages/renderers-graph-tree/src'),
      '@hello-algo/renderers-grid-board': resolve(__dirname, 'packages/renderers-grid-board/src'),
      '@hello-algo/renderers-linked': resolve(__dirname, 'packages/renderers-linked/src'),
      '@hello-algo/ui': resolve(__dirname, 'packages/ui/src'),
      '@hello-algo/content-adapter': resolve(__dirname, 'packages/content-adapter/src'),
    },
  },
});
