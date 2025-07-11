import { describe, it } from 'vitest'
// Vanilla JS - no render import needed
import * as Tests from './signature.spec'
import { Signature } from './fixtures/Signature.ts'

describe('signature vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Signature({ root: document.body })
    await Tests.RendersCorrectly()
  })
})