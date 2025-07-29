/** @jsxImportSource solid-js */
import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-solid'
import Collapse from '~/solid/collapse'
import { CollapseTestSuite } from './spec'

let Tests: CollapseTestSuite

describe('collapse react browser tests - single / keyboard', () => {
  beforeEach(async () => {
    render(() => <Collapse />)
    Tests = new CollapseTestSuite()
  })

  it('arrow down, focus next trigger', async () => {
    await Tests.arrowDownFocusNextTrigger()
  })

  it('arrow up, focus previous trigger', async () => {
    await Tests.arrowUpFocusPreviousTrigger()
  })

  it('home key, focus first trigger', async () => {
    await Tests.homeKeyFocusFirstTrigger()
  })

  it('end key, focus last trigger', async () => {
    await Tests.endKeyFocusLastTrigger()
  })
})

describe('collapse react browser tests - single / pointer', () => {
  beforeEach(async () => {
    render(() => <Collapse />)
    Tests = new CollapseTestSuite()
  })
  it('should show content', async () => {
    await Tests.endKeyFocusLastTrigger()
  })

  it('then clicking the same trigger again: should not close the content', async () => {
    await Tests.ShouldNotCloseTheContent()
  })

  it('then clicking another trigger: should close the previous content', async () => {
    await Tests.ShouldCloseThePreviousContent()
  })
})

describe('collapse react browser tests - multiple / keyboard', () => {
  beforeEach(async () => {
    render(() => <Collapse />)
    Tests = new CollapseTestSuite()
  })
  it('[multiple=true] on arrow down, focus next trigger', async () => {
    await Tests.OnArrowDownFocusNextTrigger()
  })

  it('clicking another trigger, should close the previous content', async () => {
    await Tests.clickingAnotherTriggerShouldCloseThePreviousContent()
  })
})
