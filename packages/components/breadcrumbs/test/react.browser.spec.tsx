import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import Breadcrumbs from '~/react/breadcrumbs'
import { BreadcrumbsTestSuite } from './spec'

let Tests: BreadcrumbsTestSuite

describe('breadcrumbs react browser tests', () => {
  beforeEach(() => {
    render(<Breadcrumbs />)
    Tests = new BreadcrumbsTestSuite()
  })

  it('renders correctly', async () => {
    await Tests.RendersCorrectly()
  })
})
