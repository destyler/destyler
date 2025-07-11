import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import Collapse from '~/vue/collapse.vue'
import * as Tests from './collapse.spec'

describe('collapse vue browser tests - single / keyboard', () => {
  it('arrow down, focus next trigger', async () => {
    render(Collapse)
    await Tests.arrowDownFocusNextTrigger()
  })

  it('arrow up, focus previous trigger', async () => {
    render(Collapse)
    await Tests.arrowUpFocusPreviousTrigger()
  })

  it('home key, focus first trigger', async () => {
    render(Collapse)
    await Tests.homeKeyFocusFirstTrigger()
  })

  it('end key, focus last trigger', async () => {
    render(Collapse)
    await Tests.endKeyFocusLastTrigger()
  })
})

describe('collapse vue browser tests - single / pointer', () => {
  it('should show content', async () => {
    render(Collapse)
    await Tests.endKeyFocusLastTrigger()
  })

  it('then clicking the same trigger again: should not close the content', async () => {
    render(Collapse)
    await Tests.ShouldNotCloseTheContent()
  })

  it('then clicking another trigger: should close the previous content', async () => {
    render(Collapse)
    await Tests.ShouldCloseThePreviousContent()
  })
})

describe('collapse vue browser tests - multiple / keyboard', () => {

  it("[multiple=true] on arrow down, focus next trigger", async () => {
    render(Collapse)
    await Tests.OnArrowDownFocusNextTrigger()
  })

  it("clicking another trigger, should close the previous content", async () => {
    render(Collapse)
    await Tests.clickingAnotherTriggerShouldCloseThePreviousContent()
  })

})
