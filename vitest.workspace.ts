import path from 'node:path'
import { defineWorkspace } from 'vitest/config'

const __dirname = path.resolve()

export default defineWorkspace([
  'packages/components/*',
  {
    extends: path.resolve(__dirname, './vitest.basic.ts'),
    test: {
      exclude: ['**/node_modules/**'],
      include: ['./__test__/*.test.[ts,js]'],
    },
  },
  'packages/*',
  {
    extends: './vitest.basic.ts',
    test: {
      setupFiles: path.resolve(__dirname, './vitest.setup.ts'),
      exclude: ['**/node_modules/**'],
      include: ['./__test__/*.test.[ts,js]'],
    },
  },
])
