import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['packages/store/test/diagnostics/*.repro.ts'],
  },
})
