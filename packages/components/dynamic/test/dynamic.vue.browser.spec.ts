import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import * as Tests from './dynamic.spec'
import Dynamic from './fixtures/Dynamic.vue'

describe('dynamic vue browser tests', () => {
  it('renders correctly', async () => {
    render(Dynamic)
    await Tests.RendersCorrectly()
  })
})