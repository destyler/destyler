import { describe, it } from 'vitest'
// Vanilla JS - no render import needed
import * as Tests from './toast.spec'
import { Toast } from './fixtures/Toast.ts'

describe('toast vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Toast({ root: document.body })
    await Tests.RendersCorrectly()
  })
})