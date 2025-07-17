import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import Collapsible from '~/react/collapsible'
import * as Tests from './spec'

describe('collapsible react browser tests', () => {
  it('should be open when clicked', async () => {
    render(<Collapsible />)
    await Tests.ShouldBeOpenWhenClicked()
  })

  it('content should not be reachable via tab key', async () => {
    render(<Collapsible />)
    await Tests.ContentShouldNotBeReachableViaTabKey()
  })
})
