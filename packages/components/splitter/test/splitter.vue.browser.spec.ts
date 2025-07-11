import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import Splitter from '~/vue/splitter.vue'
import * as Tests from './splitter.spec'

describe('splitter vue browser tests', () => {
  it('renders correctly', async () => {
    render(Splitter)
    await Tests.RendersCorrectly()
  })
})
