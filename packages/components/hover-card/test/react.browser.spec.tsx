import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import HoverCard from '~/react/hover-card'
import { HoverCardTestSuite } from './spec'

let Tests: HoverCardTestSuite

describe('svelte browser tests', () => {
  beforeEach(() => {
    render(<HoverCard />)
    Tests = new HoverCardTestSuite()
  })

  it('content should be hidden by default', async () => {
    await Tests.ContentShouldBeHiddenByDefault()
  })

  it('should be opened after hovering trigger', async () => {
    await Tests.ShouldBeOpenedAfterHoveringTrigger()
  })

  it('should be opened after focusing trigger', async () => {
    await Tests.ShouldBeOpenedAfterFocusingTrigger()
  })

  it('should be closed after blurring trigger', async () => {
    await Tests.ShouldBeClosedAfterBlurringTrigger()
  })

  it("should be closed after blurring trigger with keyboard", async () => {
    await Tests.ShouldBeClosedAfterBlurringTriggerWithKeyboard()
  })

  it('should remain open after blurring trigger if pointer opens card', async ()=>{
    await Tests.ShouldRemainOPenAfterBlurringTriggerIfPointerOpensCard()
  })

  it('should remain open after moving from trigger to content', async () => {
    await Tests.ShouldRemainOpenAfterMovingFromTriggerToContent()
  })

  it('should remain open after moving from content back to trigger', async () => {
    await Tests.ShouldRemainOpenAfterMovingFromContentBackToTrigger()
  })
})
