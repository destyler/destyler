import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Tabs from '~/svelte/tabs.svelte'
import { TabsTestSuite } from './spec'

let Tests: TabsTestSuite

describe('tabs svelte browser tests', () => {
  beforeEach(async () => {
    render(Tabs)
    Tests = new TabsTestSuite()
  })

  it('should switch tabs when clicked', async () => {
    await Tests.ShouldSwitchTabsWhenClicked()
  })

  it('should navigate tabs with arrow keys', async () => {
    await Tests.ShouldNavigateTabsWithArrowKeys()
  })

  it('should navigate tabs with home and end', async () => {
    await Tests.ShouldNavigateTabsWithHomeAndEnd()
  })

  it('should be focusable with tab', async () => {
    await Tests.ShouldBeFocusableWithTab()
  })

  it('should skip disabled tabs', async () => {
    await Tests.ShouldSkipDisabledTabs()
  })

  it('should activate tab with space key', async () => {
    await Tests.ShouldActivateTabWithSpaceKey()
  })

  it('should activate tab with enter key', async () => {
    await Tests.ShouldActivateTabWithEnterKey()
  })

  it('should maintain tab panel association', async () => {
    await Tests.ShouldMaintainTabPanelAssociation()
  })
})
