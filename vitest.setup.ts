import { expect } from 'vitest'
import * as matchers from 'vitest-axe/matchers'
import { configureAxe } from 'vitest-axe'
import 'vitest-canvas-mock'

expect.extend(matchers)

configureAxe({
  globalOptions: {
    rules: [{
      id: 'region',
      enabled: false,
    }],
  },
})
