import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import Toggle from '~/vue/toggle.vue'
import { ComponentTestSuite } from './spec'

let Tests: ComponentTestSuite

describe('toggle vue browser tests', () => {
  beforeEach(async () => {
    render(Toggle)
    Tests = new ComponentTestSuite()
  })

  it('[single] should select on click', async () => {
    await Tests.SingleShouldSelectOnClick()
  })

  it('[single] should select and deselect', async () => {
    await Tests.SingleShouldSelectAndDeselect()
  })

  it('[multiple] should select multiple', async () => {
    await Tests.MultipleShouldSelectMultiple()
  })
})
