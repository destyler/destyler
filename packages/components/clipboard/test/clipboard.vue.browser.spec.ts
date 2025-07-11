import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import * as Tests from './clipboard.spec'
import Clipboard from './fixtures/Clipboard.vue'

describe('clipboard vue browser tests', () => {
  it('renders correctly', async () => {
    render(Clipboard)
    await Tests.RendersCorrectly()
  })
})