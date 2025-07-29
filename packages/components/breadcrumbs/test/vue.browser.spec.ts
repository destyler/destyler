import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import Breadcrumbs from '~/vue/breadcrumbs.vue'
import { BreadcrumbsTestSuite } from './spec'

let Tests: BreadcrumbsTestSuite

describe('breadcrumbs vue browser tests', () => {
  beforeEach(() => {
    render(Breadcrumbs)

    Tests = new BreadcrumbsTestSuite()
  })

  it('renders correctly', async () => {
    await Tests.RendersCorrectly()
  })
})
