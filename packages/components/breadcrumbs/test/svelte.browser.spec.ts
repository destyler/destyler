import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Breadcrumbs from '~/svelte/breadcrumbs.svelte'
import { BreadcrumbsTestSuite } from './spec'

let Tests: BreadcrumbsTestSuite

describe('breadcrumbs svelte browser tests', () => {
  beforeEach(() => {
    render(Breadcrumbs)

    Tests = new BreadcrumbsTestSuite()
  })

  it('renders correctly', async () => {
    await Tests.RendersCorrectly()
  })
})
