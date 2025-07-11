import { describe, it } from 'vitest'
import { Signature } from './fixtures/Signature.ts'
// Vanilla JS - no render import needed
import * as Tests from './signature.spec'

describe('signature vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Signature({ root: document.body })
    await Tests.RendersCorrectly()
  })
})
