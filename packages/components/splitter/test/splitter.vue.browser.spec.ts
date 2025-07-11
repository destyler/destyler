import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import * as Tests from './splitter.spec'
import Splitter from './fixtures/Splitter.vue'

describe('splitter vue browser tests', () => {
  it('renders correctly', async () => {
    render(Splitter)
    await Tests.RendersCorrectly()
  })
})