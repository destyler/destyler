import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import Collapsible from '~/vue/collapsible.vue'
import * as Tests from './collapsible.spec'

describe('collapsible vue browser tests', () => {
  it('should be open when clicked', async () => {
    render(Collapsible)
    await Tests.ShouldBeOpenWhenClicked()
  })

  it('content should not be reachable via tab key', async () => {
    render(Collapsible)
    await Tests.ContentShouldNotBeReachableViaTabKey()
  })
})
