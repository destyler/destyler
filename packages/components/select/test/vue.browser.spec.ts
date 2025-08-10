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

  it('should navigate on arrow up', async () => {
    await Tests.ShouldNavigateOnArrowUp()
  })

  it('should navigate on home/end', async () => {
    await Tests.ShouldNavigateOnHomeAndEnd()
  })

  it('should navigate on typeahead', async () => {
    await Tests.ShouldNavigateOnTypeahed()
  })

  it('should loop through the options when loop is enabled', async () => {
    await Tests.ShouldLoopThroughOptionsWhenLoopIsEnabled()
  })

  it('should close on escape', async () => {
    await Tests.ShouldCloseOnEscape()
  })

  it('should select on enter', async () => {
    await Tests.ShouldSelectOnEnter()
  })

  it('should select on space', async () => {
    await Tests.ShouldSelectOnSpace()
  })

  it('should close on select', async () => {
    await Tests.ShouldCloseOnSelect()
  })

  it('should not close on closeOnSelect = false', async () => {
    await Tests.ShouldNotCloseOnCloseOnSelectFalse()
  })
})
