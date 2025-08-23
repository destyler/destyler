import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import Tour from '~/vue/tour.vue'
import { ComponentTestSuite } from './spec'

let Tests: ComponentTestSuite

describe('tour vue browser tests', () => {
  beforeEach(async () => {
    render(Tour)
    Tests = new ComponentTestSuite()
  })

  it('should open tour on click start', async () => {
    await Tests.ShouldOpenTourOnClickStart()
  })

  it('should close on escape', async () => {
    await Tests.ShouldCloseOnEscape()
  })
})
