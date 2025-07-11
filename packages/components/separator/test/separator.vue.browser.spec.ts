import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import * as Tests from './separator.spec'
import Separator from './fixtures/Separator.vue'

describe('separator vue browser tests', () => {
  it('renders correctly', async () => {
    render(Separator)
    await Tests.RendersCorrectly()
  })
})