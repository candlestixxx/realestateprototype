import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react({ jsxRuntime: 'automatic' })],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './client-next/src/setupTests.ts',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './client-next/src')
    }
  }
});
