import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import Dynamic from '~/vue/dynamic.vue'
import * as Tests from './dynamic.spec'

describe('dynamic vue browser tests', () => {
  it('renders correctly', async () => {
    render(Dynamic)
    await Tests.RendersCorrectly()
  })
})
