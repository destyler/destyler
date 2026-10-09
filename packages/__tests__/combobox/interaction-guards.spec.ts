import { beforeAll } from 'vitest'
import { commands } from 'vitest/browser'
import './interaction-guards.cases'

// Temporary observer only: keep every original case and assertion unchanged.
beforeAll(async () => {
  await commands.core238ProtocolStart()
})
