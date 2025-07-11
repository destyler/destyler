import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import Separator from '~/vue/divider.vue'
import * as Tests from './separator.spec'

describe('separator vue browser tests', () => {
  it('renders correctly', async () => {
    render(Separator)
    await Tests.RendersCorrectly()
  })
})
