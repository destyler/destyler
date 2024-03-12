import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  'packages/components/*',
  {
    extends: './vitest.config.ts',
  },
  'packages/*',
  {
    extends: './vitest.config.ts',
  },
])
