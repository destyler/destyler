import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import * as Tests from './floating-panel.spec'
import FloatingPanel from './fixtures/FloatingPanel.svelte'

describe('floating-panel svelte browser tests', () => {
  it('renders correctly', async () => {
    render(FloatingPanel)
    await Tests.RendersCorrectly()
  })
})