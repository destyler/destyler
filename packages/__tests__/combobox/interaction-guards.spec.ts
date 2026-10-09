import { afterAll, beforeAll } from 'vitest'
import { commands } from 'vitest/browser'
import './interaction-guards.cases'

// Temporary observer only: keep every original case and assertion unchanged.
beforeAll(async () => {
  await commands.core238ProtocolStart()
})

// Diagnostic scheduling intervention only; remove before a clean repair candidate.
afterAll(async () => {
  await commands.core238ProtocolWaitForDuplicate()
})
