import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import Timer from '~/vue/timer.vue'
import * as Tests from './timer.spec'

describe('timer vue browser tests', () => {
  it('renders correctly', async () => {
    render(Timer)
    await Tests.RendersCorrectly()
  })
})
