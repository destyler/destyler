import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import * as Tests from './breadcrumbs.spec'
import Breadcrumbs from './fixtures/Breadcrumbs.vue'

describe('breadcrumbs vue browser tests', () => {
  it('renders correctly', async () => {
    render(Breadcrumbs)
    await Tests.RendersCorrectly()
  })
})