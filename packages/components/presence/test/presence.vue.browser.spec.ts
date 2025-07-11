import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import Presence from '~/vue/presence.vue'
import * as Tests from './presence.spec'

describe('presence vue browser tests', () => {
  it('renders correctly', async () => {
    render(Presence)
    await Tests.RendersCorrectly()
  })
})
