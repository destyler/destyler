import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import * as Tests from './timer.spec'
import Timer from './fixtures/Timer.vue'

describe('timer vue browser tests', () => {
  it('renders correctly', async () => {
    render(Timer)
    await Tests.RendersCorrectly()
  })
})