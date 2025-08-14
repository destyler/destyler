import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Select from '~/svelte/select.svelte'
import { SelectTestSuite } from './spec'

let Tests: SelectTestSuite

describe('svelte browser tests', () => {
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

  it('should close on outside click', async () => {
    await Tests.ShouldCloseOnOutsideClick()
  })

  it('should close on blur - no selection', async () => {
    await Tests.ShouldCloseOnBlurNoSelection()
  })

  it('should open the select with enter key', async () => {
    await Tests.ShouldOpenSelectWithEnterKey()
  })

  it('should open the select with space key', async () => {
    await Tests.ShouldOpenSelectWithSpaceKey()
  })

  it('should open with down arrow keys + highlight first option', async () => {
    await Tests.ShouldOpenWithDownArrowKeysAndHighlightFirstOption()
  })

  it('should open with up arrow keys  + highlight last option', async () => {
    await Tests.ShouldOpenWithUpArrowKeysAndHighlightLastOption()
  })

  it('should select last option on arrow left', async () => {
    await Tests.ShouldSelectLastOptionOnArrowLeft()
  })

  it('should select first option on arrow right', async () => {
    await Tests.ShouldSelectFirstOptionOnArrowRight()
  })

  it('should select next options on arrow right', async () => {
    await Tests.ShouldSelectNextOptionsOnArrowRight()
  })

  it('should select with typeahead', async () => {
    await Tests.ShouldSelectWithTypeahead()
  })
})
