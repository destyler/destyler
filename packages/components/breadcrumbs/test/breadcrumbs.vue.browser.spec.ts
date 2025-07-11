import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import Breadcrumbs from '~/vue/breadcrumbs.vue'
import * as Tests from './breadcrumbs.spec'

describe('breadcrumbs vue browser tests', () => {
  it('renders correctly', async () => {
    render(Breadcrumbs)
    await Tests.RendersCorrectly()
  })
})
