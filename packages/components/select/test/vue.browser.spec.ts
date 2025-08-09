import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import Select from '~/vue/select.vue'
import { SelectTestSuite } from './spec'

let Tests: SelectTestSuite

describe('vue browser tests', () => {
  beforeEach(() => {
    render(Select)
    Tests = new SelectTestSuite()
  })

  it('clicking the label should focus control', async () => {
    await Tests.ClickingTheLabelShouldFocusControl()
  })

  it('should toggle select', async () => {
    await Tests.ShouldToggleSelect()
  })

  it('should deselect', async () => {
    await Tests.ShouldDeselect()
  })

  it('clicking clear trigger should return focus', async () => {
    await Tests.ClickingClearTriggerShouldReturnFocus()
  })

  it('should highlight on hover', async () => {
    await Tests.ShouldHighlightOnHover()
  })

  it('should navigate on arrow down', async () => {
    await Tests.ShouldNavigateOnArrowDown()
  })
})
