import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Tour from '~/svelte/tour.svelte'
import { ComponentTestSuite } from './spec'

let Tests: ComponentTestSuite

describe('svelte browser tests', () => {
  beforeEach(async () => {
    render(Tour)
    Tests = new ComponentTestSuite()
  })

  it("should open tour on click start", async () => {
    await Tests.ShouldOpenTourOnClickStart()
  })

  it("should close on escape", async () => {
    await Tests.ShouldCloseOnEscape()
  })
})
