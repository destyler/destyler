import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import Radio from '~/vue/radio.vue'
import { RadioTestSuite } from './spec'

let Tests: RadioTestSuite

describe('vue browser tests', () => {
  beforeEach(() => {
    render(Radio)
    Tests = new RadioTestSuite()
  })

  it("should have aria-labelledby on root", async () => {
    await Tests.ShouldHaveAriaLabelledByOnRoot()
  })

  it("should be checked when clicked", async () => {
    await Tests.ShouldBeCheckedWhenClicked()
  })
})
