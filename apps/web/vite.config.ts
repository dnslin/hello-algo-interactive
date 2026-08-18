import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@hello-algo/algorithm-engine': resolve(__dirname, '../../packages/algorithm-engine/src'),
      '@hello-algo/renderers-sequence': resolve(__dirname, '../../packages/renderers-sequence/src'),
      '@hello-algo/renderers-graph-tree': resolve(__dirname, '../../packages/renderers-graph-tree/src'),
      '@hello-algo/renderers-grid-board': resolve(__dirname, '../../packages/renderers-grid-board/src'),
      '@hello-algo/renderers-linked': resolve(__dirname, '../../packages/renderers-linked/src'),
      '@hello-algo/ui': resolve(__dirname, '../../packages/ui/src'),
      '@hello-algo/content-adapter': resolve(__dirname, '../../packages/content-adapter/src'),
    },
  },
  server: {
    port: 3000,
  },
});
