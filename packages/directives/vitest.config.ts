import { defineProject, mergeConfig } from 'vitest/config'
import basicConfig from '../../vitest.basic'

export default mergeConfig(
  basicConfig,
  defineProject({
    test: {
      setupFiles: '../../vitest.setup.ts',
    },
  }),
)
