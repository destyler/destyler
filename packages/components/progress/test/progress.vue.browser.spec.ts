import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import * as Tests from './progress.spec'
import Progress from './fixtures/Progress.vue'

describe('progress vue browser tests', () => {
  it('renders correctly', async () => {
    render(Progress)
    await Tests.RendersCorrectly()
  })
})