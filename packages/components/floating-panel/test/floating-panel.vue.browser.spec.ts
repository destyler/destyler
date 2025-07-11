import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import FloatingPanel from '~/vue/floating-panel.vue'
import * as Tests from './floating-panel.spec'

describe('floating-panel vue browser tests', () => {
  it('renders correctly', async () => {
    render(FloatingPanel)
    await Tests.RendersCorrectly()
  })
})
