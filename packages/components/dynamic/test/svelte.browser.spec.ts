import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Dynamic from '~/svelte/dynamic.svelte'
import { DynamicTestSuite } from './spec'

let Tests: DynamicTestSuite

describe('svelte browser tests', () => {
  beforeEach(() => {
    render(Dynamic)
    Tests = new DynamicTestSuite()
  })

  it('should add new tag value', async () => {
    await Tests.ShouldAddNewTagValue()
  })

  it('when input is empty backspace highlights the last tag', async () => {
    await Tests.WhenInputIsEmptyBackspaceHighlightsLastTag()
  })

  it('deletes tag with backspace when input value is empty', async () => {
    await Tests.DeletesTagWithBackspaceWhenInputValueIsEmpty()
  })

  it('delete tag by clearing its content and hit enter', async () => {
    await Tests.DeleteTagByClearingItsContentAndHitEnter()
  })

  it('delete tag with delete key, show allow keyboard navigation', async () => {
    await Tests.DeleteTagWithDeleteKeyShowAllowKeyboardNavigation()
  })

  it('delete tag with pointer, show allow keyboard navigation', async () => {
    await Tests.DeleteTagWithPointerShowAllowKeyboardNavigation()
  })

  it('when tag is empty + no visible tags + enter pressed, should not enter editing state', async () => {
    await Tests.WhenTagIsEmptyNoVisibleTagsEnterPressedShouldNotEnterEditingState()
  })

  it('should navigate tags with arrow keys', async () => {
    await Tests.ShouldNavigateTagsWithArrowKeys()
  })

  it('should clear focused tag on blur', async () => {
    await Tests.ShouldClearFocusedTagOnBlur()
  })

  it('removes tag on close button click', async () => {
    await Tests.RemovesTagOnCloseButtonClick()
  })

  it('edit tag with enter key', async () => {
    await Tests.EditTagWithEnterKey()
  })

  it('edit with double click', async () => {
    await Tests.EditTagWithDoubleClick()
  })

  it('clears highlighted tag on escape press', async () => {
    await Tests.ClearsHighlightedTagOnEscapePress()
  })

  it('delete + backspace interaction', async () => {
    await Tests.DeleteTagWithBackspaceWhenInputValueIsEmpty()
  })

  it('[addOnPaste: false] pasting should work every time', async () => {
    await Tests.AddOnPasteFalsePastingShouldWorkEveryTime()
  })

  it('[addOnPaste: false] pasting + enter should work', async () => {
    await Tests.AddOnPasteFalsePastingEnterShouldWork()
  })

  it('[addOnPaste: true] pasting should add tags', async () => {
    await Tests.AddOnPasteTruePastingShouldAddTags()
  })

  it('[addOnPaste: true] when input is empty, should work', async () => {
    await Tests.AddOnPasteTrueWhenInputIsEmptyShouldWork()
  })
})
