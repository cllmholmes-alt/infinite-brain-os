import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/{unit,plan}/**/*.test.ts'],
    coverage: {
      reporter: ['text', 'json-summary'],
    },
  },
});
