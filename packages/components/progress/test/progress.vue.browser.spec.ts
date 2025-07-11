import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import Progress from '~/vue/progress.vue'
import * as Tests from './progress.spec'

describe('progress vue browser tests', () => {
  it('renders correctly', async () => {
    render(Progress)
    await Tests.RendersCorrectly()
  })
})
