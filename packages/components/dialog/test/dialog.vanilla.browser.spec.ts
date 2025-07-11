import { describe, it } from 'vitest'
// Vanilla JS - no render import needed
import * as Tests from './dialog.spec'
import { Dialog } from './fixtures/Dialog.ts'

describe('dialog vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Dialog({ root: document.body })
    await Tests.RendersCorrectly()
  })
})