import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import FloatingPanel from './fixtures/FloatingPanel.svelte'
import * as Tests from './floating-panel.spec'

describe('floating-panel svelte browser tests', () => {
  it('renders correctly', async () => {
    render(FloatingPanel)
    await Tests.RendersCorrectly()
  })
})
