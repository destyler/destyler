import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['packages/frameworks/lit/test/diagnostics/*.repro.ts'],
  },
})
