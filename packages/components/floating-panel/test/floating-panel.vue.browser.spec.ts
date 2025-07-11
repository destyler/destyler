import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import * as Tests from './floating-panel.spec'
import FloatingPanel from './fixtures/FloatingPanel.vue'

describe('floating-panel vue browser tests', () => {
  it('renders correctly', async () => {
    render(FloatingPanel)
    await Tests.RendersCorrectly()
  })
})