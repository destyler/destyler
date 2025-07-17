import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Collapsible from '~/svelte/collapsible.svelte'
import * as Tests from './spec'

describe('collapsible svelte browser tests', () => {
  it('should be open when clicked', async () => {
    render(Collapsible)
    await Tests.ShouldBeOpenWhenClicked()
  })

  it('content should not be reachable via tab key', async () => {
    render(Collapsible)
    await Tests.ContentShouldNotBeReachableViaTabKey()
  })
})
