import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import * as Tests from './presence.spec'
import Presence from './fixtures/Presence.vue'

describe('presence vue browser tests', () => {
  it('renders correctly', async () => {
    render(Presence)
    await Tests.RendersCorrectly()
  })
})