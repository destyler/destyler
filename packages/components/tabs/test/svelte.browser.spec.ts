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

  it('on home key, select first tab', async () => {
    await Tests.onHomeKeySelectsFirstTab()
  })

  it('on end key, select last tab', async () => {
    await Tests.onEndKeySelectsLastTab()
  })

  it('click tab, select tab', async () => {
    await Tests.ClickTabSelectsTab()
  })

  it('should deselect', async () => {
    await Tests.ShouldDeselect()
  })

  it('automatic: should select the correct tab on click', async () => {
    await Tests.AutomaticShouldSelectTheCorrectTabOnClick()
  })

  it('automatic: on arrow right, select + focus next tab', async () => {
    await Tests.AutomaticOnArrowRightSelectPlusFocusNextTab()
  })

  it('automatic: on arrow right, loop focus + selection', async () => {
    await Tests.AutomaticOnArrowRightLoopFocusPlusSelection()
  })

  it('automatic: on arrow left, select + focus the previous tab', async () => {
    await Tests.AutomaticOnArrowLeftSelectPlusFocusThePreviousTab()
  })

  it('manual: on arrow right, focus but not select tab', async () => {
    await Tests.ManualOnArrowRightFocusButNotSelectTab()
  })

  it('manual: on home key, focus but not select tab', async () => {
    await Tests.ManualOnHomeKeyFocusButNotSelectTab()
  })

  it('manual: on navigate, select on enter', async () => {
    await Tests.ManualOnNavigateSelectOnEnter()
  })

  it('loopFocus=false', async () => {
    await Tests.LoopFocusFalse()
  })
})
