import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import Collapsible from '~/react/collapsible'
import { CollapseTestSuite } from './spec'

let Tests: CollapseTestSuite

describe('collapsible react browser tests', () => {
  beforeEach(async () => {
    render(<Collapsible />)
    Tests = new CollapseTestSuite()
  })

  it('should be open when clicked', async () => {
    await Tests.ShouldBeOpenWhenClicked()
  })

  it('content should not be reachable via tab key', async () => {
    await Tests.ContentShouldNotBeReachableViaTabKey()
  })
})
