import { describe, it } from 'vitest'
import { Toast } from './fixtures/Toast.ts'
// Vanilla JS - no render import needed
import * as Tests from './toast.spec'

describe('toast vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Toast({ root: document.body })
    await Tests.RendersCorrectly()
  })
})
